import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { calculatorInputSchema, type CalculatorInput, type CalculationResult } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { InfoIcon, ShipIcon, TimerIcon, FuelIcon, DollarSignIcon, LeafIcon, GlobeIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import ResultsDisplay from "./results-display";
import { apiRequest } from "@/lib/queryClient";

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

  const { data: fuelPriceData, isError: isFuelPriceError } = useQuery<VLSFOPrice>({
    queryKey: ['/api/vlsfo-price'],
  });

  const form = useForm<CalculatorInput>({
    resolver: zodResolver(calculatorInputSchema),
    defaultValues: {
      fleetSize: '',
      voyageLength: '',
      portTime: '',
      fuelConsumption: '',
      fuelPrice: '',
      estimatedSavings: 5
    }
  });

  // Update fuel price when data is fetched
  useEffect(() => {
    if (fuelPriceData?.price) {
      form.setValue('fuelPrice', fuelPriceData.price.toString());
    }
  }, [fuelPriceData, form]);

  async function onSubmit(formEvent: React.FormEvent) {
    formEvent.preventDefault();
    if (!(formEvent.nativeEvent instanceof SubmitEvent)) {
      return;
    }

    const values = form.getValues();
    const emptyFields = [];

    if (!values.fleetSize) emptyFields.push("Fleet Size");
    if (!values.voyageLength) emptyFields.push("Voyage Length (Days at Sea)");
    if (!values.portTime) emptyFields.push("Port Time (Days)");
    if (!values.fuelConsumption) emptyFields.push("Fuel Consumption");
    if (!values.fuelPrice) emptyFields.push("Fuel Price");

    if (emptyFields.length > 0) {
      toast({
        title: "Missing Information",
        description: `Please fill in the following fields: ${emptyFields.join(", ")}`,
        variant: "destructive"
      });
      return;
    }

    setIsCalculating(true);
    try {
      const formData = {
        fleetSize: Number(values.fleetSize),
        voyageLength: Number(values.voyageLength),
        portTimePerVoyage: Number(values.portTime),
        fuelConsumption: Number(values.fuelConsumption),
        fuelPrice: Number(values.fuelPrice),
        estimatedSavings: Number(values.estimatedSavings)
      };

      if (Object.values(formData).some(isNaN)) {
        toast({
          title: "Invalid Input",
          description: "Please ensure all fields contain valid numbers",
          variant: "destructive"
        });
        return;
      }

      const scenarios = [
        { savings: 3, label: 'Conservative Savings' },
        { savings: 5, label: 'Average Savings' },
        { savings: 7, label: 'Optimal Savings' }
      ];

      try {
        const responses = await Promise.all(
          scenarios.map(async (scenario) => {
            const data = { ...formData, estimatedSavings: scenario.savings };
            const res = await apiRequest("POST", "/api/calculate", data);
            if (!res.ok) throw new Error('API request failed');
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
            <form onSubmit={onSubmit} className="space-y-8 p-4">
              <div className="space-y-4">
                {/* Fleet Size Field */}
                <FormField
                  control={form.control}
                  name="fleetSize"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <FormLabel className="flex items-center gap-2">
                          <ShipIcon className="h-4 w-4" />
                          <span>Fleet Size</span>
                        </FormLabel>
                        <Tooltip delayDuration={100}>
                          <TooltipTrigger asChild>
                            <button 
                              type="button" 
                              className="p-1 -m-1 border-0 bg-transparent cursor-pointer"
                              onTouchStart={(e) => e.preventDefault()}
                            >
                              <InfoIcon className="h-4 w-4 text-muted-foreground" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>Number of ships in your fleet</TooltipContent>
                        </Tooltip>
                      </div>
                      <FormControl>
                        <Input 
                          type="number"
                          placeholder="Enter number of ships (e.g. 10)"
                          {...field}
                          onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Voyage Length Field */}
                <FormField
                  control={form.control}
                  name="voyageLength"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <FormLabel className="flex items-center gap-2">
                          <TimerIcon className="h-4 w-4" />
                          <span>Voyage Length (Days at Sea)</span>
                        </FormLabel>
                        <Tooltip delayDuration={100}>
                          <TooltipTrigger asChild>
                            <button 
                              type="button" 
                              className="p-1 -m-1 border-0 bg-transparent cursor-pointer"
                              onTouchStart={(e) => e.preventDefault()}
                            >
                              <InfoIcon className="h-4 w-4 text-muted-foreground" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-sm p-2">
  <div className="space-y-1">
    <div className="text-sm font-medium">Average Voyage Length</div>
    <div className="text-xs text-muted-foreground">
      Enter the typical duration of your voyages in days. For varied routes, use your fleet's average voyage duration. Include sea days only, excluding port time.
    </div>
  </div>
</TooltipContent>
                        </Tooltip>
                      </div>
                      <FormControl>
                        <Input 
                          type="number"
                          placeholder="Enter voyage duration (e.g. 30)"
                          {...field}
                          onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Port Time Field */}
                <FormField
                  control={form.control}
                  name="portTime"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <FormLabel className="flex items-center gap-2">
                          <TimerIcon className="h-4 w-4" />
                          <span>Port Time (Days)</span>
                        </FormLabel>
                        <Tooltip delayDuration={100}>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              className="p-1 -m-1 border-0 bg-transparent cursor-pointer"
                              onTouchStart={(e) => e.preventDefault()}
                            >
                              <InfoIcon className="h-4 w-4 text-muted-foreground" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-sm p-2">
                            <div className="space-y-1">
                              <div className="text-sm font-medium">Port Time Duration</div>
                              <div className="text-xs text-muted-foreground">
                                Enter the average time your vessels spend in port per voyage. For mixed routes, use your fleet's average port duration across all voyages.
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter average port time (e.g. 5)"
                          {...field}
                          onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />


                {/* Fuel Consumption Field */}
                <FormField
                  control={form.control}
                  name="fuelConsumption"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <FormLabel className="flex items-center gap-2">
                          <FuelIcon className="h-4 w-4" />
                          <span>Fuel Consumption (MT/Day)</span>
                        </FormLabel>
                        <Tooltip delayDuration={100}>
                          <TooltipTrigger asChild>
                            <button 
                              type="button" 
                              className="p-1 -m-1 border-0 bg-transparent cursor-pointer"
                              onTouchStart={(e) => e.preventDefault()}
                            >
                              <InfoIcon className="h-4 w-4 text-muted-foreground" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-sm p-2">
  <div className="space-y-1">
    <div className="text-sm font-medium">Daily Fuel Consumption (MT/Day)</div>
    <div className="text-xs text-muted-foreground">
      Enter your fleet's average fuel consumption in Metric Tons per day while at sea. For mixed fleets, use a weighted average based on vessel operating days.
    </div>
  </div>
</TooltipContent>
                        </Tooltip>
                      </div>
                      <FormControl>
                        <Input 
                          type="number"
                          placeholder="Enter fuel consumption (e.g. 50)"
                          {...field}
                          onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
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
                              onTouchStart={(e) => e.preventDefault()}
                            >
                              <InfoIcon className="h-4 w-4 text-muted-foreground" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-sm p-2">
                            <div className="space-y-1">
                              <div className="text-sm font-medium">Monthly Average VLSFO Fuel Price</div>
                              <div className="text-xs text-muted-foreground">
                                Based on Ship & Bunker's Global 20 Ports Average. Monthly averages provide a stable baseline for calculations by smoothing out daily price fluctuations.
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
                          onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <div className="text-xs text-slate-500 mt-1">
                        {fuelPriceData?.isError ? (
                          fuelPriceData.errorMessage || "Error fetching price data"
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

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  className="w-full"
                  disabled={isCalculating}
                  type="submit"
                >
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
                <img src="/images/cargo-ship.png" alt="Cargo Ship" className="w-48 h-48 object-contain mb-3" />
                <div className="waves-small"></div>
              </div>
              <p className="text-slate-700 text-base text-center">Fill in your fleet details to calculate estimated fuel savings</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}