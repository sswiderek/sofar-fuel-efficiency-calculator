import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
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
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
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
      annualSeaDays: "",
      fuelPrice: "",
      estimatedSavings: 5,
      vessels: [{ type: "", count: 1, fuelConsumption: 0 }],
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

    if (!values.annualSeaDays) emptyFields.push("Annual Sea Days");
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
        annualSeaDays: Number(values.annualSeaDays),
        fuelPrice: Number(values.fuelPrice),
        estimatedSavings: Number(values.estimatedSavings),
        vessels: values.vessels.map((vessel) => ({
          type: vessel.type,
          count: Number(vessel.count),
          fuelConsumption: Number(vessel.fuelConsumption),
        })),
      };

      if (
        Object.values(formData).some(isNaN) ||
        formData.vessels.some((v) => isNaN(v.count) || isNaN(v.fuelConsumption))
      ) {
        toast({
          title: "Invalid Input",
          description: "Please ensure all fields contain valid numbers",
          variant: "destructive",
        });
        return;
      }

      const scenarios = [
        { savings: 3, label: "Conservative Savings" },
        { savings: 5, label: "Average Savings" },
        { savings: 7, label: "Optimal Savings" },
      ];

      try {
        const responses = await Promise.all(
          scenarios.map(async (scenario) => {
            const data = { ...formData, estimatedSavings: scenario.savings };
            const res = await apiRequest("POST", "/api/calculate", data);
            if (!res.ok) throw new Error("API request failed");
            const json = await res.json();
            return { ...json, label: scenario.label };
          })
        );
        if (Array.isArray(responses)) {
          setResults(responses);
        } else {
          console.error("Responses is not an array:", responses);
        }
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative">
        <div className="space-y-8 pt-4">
          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-8 p-4 max-w-md">
              <div className="space-y-6">
                {/* Vessel List */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">Vessels</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const currentVessels = form.getValues("vessels") || [];
                        form.setValue("vessels", [
                          ...currentVessels,
                          { type: "", count: 1, fuelConsumption: 0 },
                        ]);
                      }}
                    >
                      Add Vessel Type
                    </Button>
                  </div>

                  {form.watch("vessels")?.map((_, index) => (
                    <div key={index} className="space-y-4 p-4 border rounded-lg">
                      <FormField
                        control={form.control}
                        name={`vessels.${index}.type`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Vessel Type</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={(value) => {
                                  field.onChange(value);
                                  // Set default fuel consumption
                                  form.setValue(
                                    `vessels.${index}.fuelConsumption`,
                                    vesselTypes[value as keyof typeof vesselTypes].defaultConsumption
                                  );
                                }}
                                value={field.value}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select vessel type" />
                                </SelectTrigger>
                                <SelectContent>
                                  {Object.entries(vesselTypes).map(([key, value]) => (
                                    <SelectItem key={key} value={key}>
                                      {value.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`vessels.${index}.count`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Number of Ships</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
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
                              <FormLabel>Fuel Consumption (MT/Day)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
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

                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
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
                  ))}
                </div>

                {/* Annual Sea Days Field */}
                <FormField
                  control={form.control}
                  name="annualSeaDays"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <FormLabel className="flex items-center gap-2">
                          <TimerIcon className="h-4 w-4" />
                          <span>Annual Sea Days</span>
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
                                Total Sea Days Per Year
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Enter the total number of days your fleet spends at sea per year. This is the sum of all days when vessels are actively sailing, excluding time spent in port or at anchor.
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter annual sea days (e.g. 280)"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? Number(e.target.value)
                                : undefined
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />


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
  );
}