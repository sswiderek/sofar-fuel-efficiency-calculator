import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast"
import { Anchor, Boxes as BoxesIcon, Ship, Wheat, Fuel } from "lucide-react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  calculatorInputSchema,
  type CalculatorInput,
  type CalculationResult,
  vesselTypes,
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
      vessels: [{ type: "", count: 1, fuelConsumption: 0, seaDaysPerYear: 280 }],
    },
  });

  // Update fuel price when data is fetched
  useEffect(() => {
    if (fuelPriceData?.price) {
      form.setValue("fuelPrice", fuelPriceData.price.toString());
    }
  }, [fuelPriceData, form]);

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
          type: vessel.type,
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
                {/* Vessel List */}
                <div className="space-y-6">
                  <h3 className="text-sm font-medium text-slate-700">Fleet Configuration</h3>
                  {form.watch("vessels")?.map((_, index) => (
                    <div key={index} className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-slate-200/60 shadow-sm w-full">
                      <div className="space-y-6">
                        <FormField
                          control={form.control}
                          name={`vessels.${index}.type`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                <ShipIcon className="h-4 w-4" />
                                Vessel Type
                              </FormLabel>
                              <FormControl>
                                <Select
                                  onValueChange={(value) => {
                                    field.onChange(value);
                                    // Set default fuel consumption and sea days
                                    form.setValue(
                                      `vessels.${index}.fuelConsumption`,
                                      vesselTypes[value as keyof typeof vesselTypes].defaultConsumption
                                    );
                                    form.setValue(
                                      `vessels.${index}.seaDaysPerYear`,
                                      vesselTypes[value as keyof typeof vesselTypes].defaultSeaDays || 280
                                    );
                                  }}
                                  value={field.value}
                                >
                                  <SelectTrigger className="bg-white">
                                    <SelectValue placeholder="Select vessel type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {Object.entries(vesselTypes).map(([key, value]) => (
                                      <SelectItem key={key} value={key} className="flex items-center gap-2">
                                        <div className="flex items-center">
                                          {key.includes('container-ship-small') ? (
                                            <img src="/images/container_ship.png" alt="Small Container Ship" className="h-6 w-6 object-contain mr-2" />
                                          ) : key.includes('container-ship-medium') ? (
                                            <img src="/images/container_ship.png" alt="Medium Container Ship" className="h-8 w-8 object-contain mr-2" />
                                          ) : key.includes('container-ship-large') ? (
                                            <img src="/images/container_ship.png" alt="Large Container Ship" className="h-10 w-10 object-contain mr-2" />
                                          ) : key.includes('bulk-carrier-small') ? (
                                            <img src="/images/bulk_carrier.png" alt="Handysize Bulk Carrier" className="h-7 w-7 object-contain mr-2" />
                                          ) : key.includes('bulk-carrier-large') ? (
                                            <img src="/images/bulk_carrier.png" alt="Panamax Bulk Carrier" className="h-10 w-10 object-contain mr-2" />
                                          ) : key.includes('tanker-small') ? (
                                            <img src="/images/oil_tanker.png" alt="Medium Range Tanker" className="h-7 w-7 object-contain mr-2" />
                                          ) : key.includes('tanker-large') ? (
                                            <img src="/images/oil_tanker.png" alt="VLCC" className="h-10 w-10 object-contain mr-2" />
                                          ) : (
                                            <Ship className="h-4 w-4 mr-2" />
                                          )}
                                          <span>{value.label}</span>
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
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <InfoIcon className="h-4 w-4 text-slate-400" />
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-[300px] text-xs">
                                      <p>Enter the number of vessels of this specific type in your fleet</p>
                                    </TooltipContent>
                                  </Tooltip>
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
                                  <Tooltip delayDuration={100}>
                                    <TooltipTrigger asChild>
                                      <button type="button" className="p-1 -m-1 border-0 bg-transparent cursor-help">
                                        <InfoIcon className="h-4 w-4 text-muted-foreground" />
                                      </button>
                                    </TooltipTrigger>
                                    <TooltipContent side="right" className="max-w-[280px]">
                                      <p className="text-sm">
                                        Average fuel consumption in Metric Tonnes per day while at sea. Typical ranges from 20-150 MT/day depending on vessel size.
                                      </p>
                                    </TooltipContent>
                                  </Tooltip>
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
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button type="button" className="p-1 -m-1 border-0 bg-transparent cursor-help">
                                      <InfoIcon className="h-4 w-4 text-slate-400" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-[300px] text-xs">
                                    <p>Active Sailing Days: The number of days your ship spends at sea in a year. Don't include time in port or maintenance. Enter for one ship only, not your entire fleet. Typical value: 280 days</p>
                                  </TooltipContent>
                                </Tooltip>
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
                        { type: "container-ship-small", count: 1, fuelConsumption: 40, seaDaysPerYear: 280 }
                      ]);
                    }}
                  >
                    Add Vessel Type
                  </Button>
                </div>


                {/* Fuel Price Field */}
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
                              className="p-1 -m-1 border-0 bg-transparent cursor-pointer"
                            >
                              <InfoIcon className="h-4 w-4 text-muted-foreground" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-sm p-2">
                            <div className="space-y-1">
                              <div className="text-sm font-medium">
                                Monthly Average VLSFO Fuel Price
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Based on Ship & Bunker's Global 20 Ports
                                Average. Monthly averages provide a stable
                                baseline for calculations by smoothing out daily
                                price fluctuations.
                              </div>
                            </div>
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