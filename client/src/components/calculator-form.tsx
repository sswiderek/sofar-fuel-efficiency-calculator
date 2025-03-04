import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast"
import { Anchor, Boxes as BoxesIcon, Ship, Wheat, Fuel, Scale, ScaleIcon } from "lucide-react"; 
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  calculatorInputSchema,
  type CalculatorInput,
  type CalculationResult,
  vesselTypes,
  vesselCategories,
  vesselSizes,
} from "@shared/schema"; 
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  InfoIcon,
  ShipIcon,
  TimerIcon,
  FuelIcon,
  DollarSignIcon,
  AnchorIcon,
  GaugeIcon,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import ResultsDisplay from "./results-display";
import { apiRequest } from "@/lib/queryClient";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface VLSFOPrice {
  price: number | null;
  month: string;
  year: number;
  isError: boolean;
  errorMessage?: string;
}

export default function CalculatorForm() {
  const { toast } = useToast();
  const [results, setResults] = useState<CalculationResult[] | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const { data: fuelPriceData, isError: isFuelPriceError } = useQuery<VLSFOPrice>(
    {
      queryKey: ["/api/vlsfo-price"],
    }
  );

  const form = useForm<CalculatorInput>({
    resolver: zodResolver(calculatorInputSchema),
    defaultValues: {
      fuelPrice: "",
      estimatedSavings: 5,
      vessels: [{ category: "", size: "", count: 1, fuelConsumption: 0, seaDaysPerYear: 280 }], 
    },
  });

  const resultsRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (fuelPriceData?.price) {
      form.setValue("fuelPrice", fuelPriceData.price.toString());
    }
  }, [fuelPriceData, form]);

  useEffect(() => {
    if (results && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [results]);

  async function onSubmit(formEvent: React.FormEvent) {
    formEvent.preventDefault();
    if (!(formEvent.nativeEvent instanceof SubmitEvent)) {
      return;
    }

    const values = form.getValues();
    const emptyFields = [];

    if (!values.fuelPrice) emptyFields.push("Fuel Price");
    if (!values.vessels || values.vessels.length === 0) {
      emptyFields.push("At least one vessel");
    }

    if (emptyFields.length > 0) {
      toast({
        title: "Missing Information",
        description: `Please fill in the following fields: ${emptyFields.join(
          ", "
        )}`,
        variant: "destructive",
      });
      return;
    }

    setIsCalculating(true);
    try {
      const formData = {
        fuelPrice: parseFloat(values.fuelPrice),
        estimatedSavings: parseFloat(values.estimatedSavings.toString()),
        vessels: values.vessels.map((vessel) => ({
          category: vessel.category,
          size: vessel.size,
          count: parseInt(vessel.count.toString()),
          fuelConsumption: parseFloat(vessel.fuelConsumption.toString()),
          seaDaysPerYear: parseFloat(vessel.seaDaysPerYear.toString()),
        })),
      };

      if (
        isNaN(formData.fuelPrice) || 
        isNaN(formData.estimatedSavings) ||
        formData.vessels.some((v) => isNaN(v.count) || isNaN(v.fuelConsumption) || isNaN(v.seaDaysPerYear))
      ) {
        toast({
          title: "Invalid Input",
          description: "Please ensure all fields contain valid numbers",
          variant: "destructive",
        });
        return;
      }

      try {
        const data = { ...formData, estimatedSavings: 5 };
        const res = await apiRequest("POST", "/api/calculate", data);
        if (!res.ok) throw new Error("API request failed");
        const json = await res.json();
        setResults([{ ...json, label: "Estimated Savings" }]);
      } catch (error) {
        console.error("API error:", error);
      }
    } catch (error) {
      console.error("Calculation failed:", error);
    } finally {
      setIsCalculating(false);
    }
  }

  return (
    <TooltipProvider>
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative max-w-full">
        <div className="space-y-8 pt-4 max-w-full overflow-hidden">
          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-8 p-6">
              <div className="space-y-8">
                <div className="space-y-6">
                  <h3 className="text-sm font-medium text-slate-700">Fleet Configuration</h3>
                  {form.watch("vessels")?.map((_, index) => (
                    <div key={index} className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-slate-200/60 shadow-sm w-full">
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name={`vessels.${index}.category`}
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center gap-1.5">
                                  <div className="flex items-center gap-2">
                                    <AnchorIcon className="h-4 w-4 text-foreground" />
                                    <FormLabel>Vessel Category</FormLabel>
                                  </div>

                                </div>
                                <FormControl>
                                  <Select
                                    onValueChange={(value) => {
                                      field.onChange(value);
                                      // Safely get the first size for this vessel category
                                      if (vesselSizes[value as keyof typeof vesselSizes]) {
                                        const firstSize = Object.keys(vesselSizes[value as keyof typeof vesselSizes])[0];
                                        form.setValue(`vessels.${index}.size`, firstSize);

                                        // Safely get default values
                                        const sizeData = vesselSizes[value as keyof typeof vesselSizes][firstSize as keyof typeof vesselSizes[keyof typeof vesselSizes]];
                                        if (sizeData) {
                                          form.setValue(`vessels.${index}.fuelConsumption`, sizeData.defaultConsumption);
                                          form.setValue(`vessels.${index}.seaDaysPerYear`, sizeData.defaultSeaDays);
                                        }
                                      }
                                    }}
                                    value={field.value}
                                  >
                                    <SelectTrigger className="bg-white">
                                      <SelectValue placeholder="Select vessel category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {Object.entries(vesselCategories).map(([key, label]) => (
                                        <SelectItem key={key} value={key} className="flex items-center gap-2">
                                          <div className="flex items-center">
                                            {key === 'container-ship' ? (
                                              <img src="/images/container_ship.png" alt="Container Ship" className="h-6 w-6 object-contain mr-2" />
                                            ) : key === 'bulk-carrier' ? (
                                              <img src="/images/bulk_carrier.png" alt="Bulk Carrier" className="h-6 w-6 object-contain mr-2" />
                                            ) : key === 'oil-tanker' ? (
                                              <img src="/images/oil_tanker.png" alt="Oil Tanker" className="h-6 w-6 object-contain mr-2" />
                                            ) : (
                                              <ShipIcon className="h-4 w-4 mr-2" />
                                            )}
                                            {label}
                                          </div>
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`vessels.${index}.size`}
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center gap-1.5">
                                  <div className="flex items-center gap-2">
                                    <ScaleIcon className="h-4 w-4 text-foreground" />
                                    <FormLabel>Vessel Size</FormLabel>
                                  </div>
                                </div>
                                <FormControl>
                                  <Select
                                    onValueChange={(value) => {
                                      field.onChange(value);
                                      const category = form.getValues(`vessels.${index}.category`);
                                      if (category && value && vesselSizes[category as keyof typeof vesselSizes]) {
                                        const sizeData = vesselSizes[category as keyof typeof vesselSizes][value as keyof typeof vesselSizes[keyof typeof vesselSizes]];
                                        if (sizeData) {
                                          form.setValue(`vessels.${index}.fuelConsumption`, sizeData.defaultConsumption);
                                          form.setValue(`vessels.${index}.seaDaysPerYear`, sizeData.defaultSeaDays);
                                        }
                                      }
                                    }}
                                    value={field.value}
                                  >
                                    <SelectTrigger className="bg-white">
                                      <SelectValue placeholder="Select vessel size" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {form.getValues(`vessels.${index}.category`) && Object.entries(vesselSizes[form.getValues(`vessels.${index}.category`) as keyof typeof vesselSizes]).map(([key, value]) => (
                                        <SelectItem key={key} value={key} className="flex items-center gap-2">
                                          <div className="flex items-center">
                                            {form.getValues(`vessels.${index}.category`) === 'bulk-carrier' && (
                                              <img 
                                                src="/images/bulk_carrier.png" 
                                                alt="Bulk Carrier" 
                                                className={`
                                                  ${key === 'small' ? 'h-5 w-5' : ''}
                                                  ${key === 'medium' ? 'h-6 w-6' : ''}
                                                  ${key === 'large' ? 'h-7 w-7' : ''}
                                                  ${key === 'vlarge' ? 'h-8 w-8' : ''}
                                                  object-contain mr-2
                                                `}
                                              />
                                            )}
                                            {form.getValues(`vessels.${index}.category`) === 'container-ship' && (
                                              <div className="mr-2">
                                                {key === 'feeder' && <img src="/images/container_ship.png" alt="Feeder" className="h-5 w-5 object-contain" />}
                                                {key === 'small' && <img src="/images/container_ship.png" alt="Small Feeder" className="h-6 w-6 object-contain" />}
                                                {key === 'medium' && <img src="/images/container_ship.png" alt="Panamax" className="h-7 w-7 object-contain" />}
                                                {key === 'large' && <img src="/images/container_ship.png" alt="Post-Panamax (5,000-10,000 TEU)" className="h-8 w-8 object-contain" />}
                                                {key === 'vlarge' && <img src="/images/container_ship.png" alt="ULCV (14,500+ TEU)" className="h-9 w-9 object-contain" />}
                                              </div>
                                            )}
                                            {form.getValues(`vessels.${index}.category`) === 'oil-tanker' && (
                                              <img src="/images/oil_tanker.png" alt="Oil Tanker" className="h-6 w-6 object-contain" />
                                            )}
                                            {value.label.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                          </div>
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-[1fr_1.5fr] gap-6">
                          <FormField
                            control={form.control}
                            name={`vessels.${index}.count`}
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center gap-1.5">
                                  <div className="flex items-center gap-2">
                    <AnchorIcon className="h-4 w-4 text-foreground" />
                    <FormLabel>Number of Ships</FormLabel>
                  </div>
                                </div>
                                <FormControl>
                                  <Input
                                    type="number"
                                    className="w-full bg-white/80 border-slate-200/80 focus:border-sky-200 focus:ring-sky-200"
                                    placeholder="e.g. 5"
                                    {...field}
                                    onChange={(e) =>
                                      field.onChange(Number(e.target.value))
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`vessels.${index}.fuelConsumption`}
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center gap-1.5">
                                  <div className="flex flex-wrap items-center gap-2">
                    <FuelIcon className="h-4 w-4 text-foreground" />
                    <FormLabel className="whitespace-nowrap">Fuel Consumption (MT/Day)</FormLabel>
                  </div>

                                </div>
                                <FormControl>
                                  <Input
                                    type="number"
                                    className="w-full bg-white/80 border-slate-200/80 focus:border-sky-200 focus:ring-sky-200"
                                    placeholder="e.g. 50"
                                    {...field}
                                    onChange={(e) =>
                                      field.onChange(Number(e.target.value))
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name={`vessels.${index}.seaDaysPerYear`}
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center gap-1.5">
                                <div className="flex items-center gap-2">
                                  <TimerIcon className="h-4 w-4 text-foreground" />
                                  <FormLabel>Days at Sea Per Vessel Per Year</FormLabel>
                                </div>
                              </div>
                              <FormControl>
                                <Input
                                  type="number"
                                  className="w-full bg-white/80 border-slate-200/80 focus:border-sky-200 focus:ring-sky-200"
                                  placeholder="e.g. 280"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(Number(e.target.value))
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="mt-4 w-full sm:w-auto text-slate-600 hover:text-red-600 hover:border-red-200 transition-colors"
                          onClick={() => {
                            const vessels = form.getValues("vessels");
                            form.setValue(
                              "vessels",
                              vessels.filter((_, i) => i !== index)
                            );
                          }}
                        >
                          Remove Vessel Type
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      const vessels = form.getValues("vessels") || [];
                      form.setValue("vessels", [
                        ...vessels,
                        { category: "container-ship", size: "small", count: 1, fuelConsumption: 40, seaDaysPerYear: 280 } 
                      ]);
                    }}
                  >
                    Add Vessel Type
                  </Button>
                </div>


                <FormField
                  control={form.control}
                  name="fuelPrice"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <FormLabel className="flex items-center gap-2">
                          <DollarSignIcon className="h-4 w-4" />
                          <span>Fuel Price (USD/MT)</span>
                        </FormLabel>
                        <Tooltip delayDuration={100}>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              className="p-1 -m-1 border-0 bg-transparent cursor-pointer group"
                            >
                              <InfoIcon className="h-4 w-4 text-muted-foreground group-hover:text-slate-700 transition-colors" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="bg-white text-slate-900 border border-slate-200 shadow-md rounded-md p-3 text-sm max-w-[300px]">
                            <p>VLSFO Fuel Type: Calculations use Very Low Sulfur Fuel Oil (VLSFO) prices, which is the primary marine fuel used to comply with IMO 2020 sulfur regulations.</p>
                            {fuelPriceData?.price && !isFuelPriceError && (
                              <p className="mt-2 text-xs text-slate-600">
                                Current value reflects the global monthly average VLSFO price for {fuelPriceData.month} {fuelPriceData.year}.
                              </p>
                            )}
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter fuel price"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? Number(e.target.value)
                                : undefined
                            )
                          }
                          className="w-full bg-white/80 border-slate-200/80 focus:border-sky-200 focus:ring-sky-200"
                        />
                      </FormControl>
                      <div className="text-xs text-slate-500 mt-1">
                        {fuelPriceData?.isError ? (
                          fuelPriceData.errorMessage ||
                          "Error fetching price data"
                        ) : fuelPriceData?.price ? (
                          `Latest monthly average: $${fuelPriceData.price}/MT (${fuelPriceData.month} ${fuelPriceData.year})`
                        ) : (
                          "Loading price data..."
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button className="w-full" disabled={isCalculating} type="submit">
                  {isCalculating ? "Calculating..." : "Calculate Savings"}
                </Button>
              </motion.div>

            </form>
          </Form>
        </div>
        <div>
          {results ? (
            <motion.div
              ref={resultsRef}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-2 md:mt-8"
            >
              <ResultsDisplay results={results} />
            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center gap-2 text-muted-foreground -mt-8">
              <div className="ship-container relative">
                <img
                  src="/images/cargo-ship.png"
                  alt="Cargo Ship"
                  className="w-48 h-48 object-contain mb-3"
                />
                <div className="waves-small"></div>
              </div>
              <p className="text-slate-700 text-base text-center">
                Fill in your fleet details to calculate estimated fuel savings
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
    </TooltipProvider>
  );
}