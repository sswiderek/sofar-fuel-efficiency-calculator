import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { calculatorInputSchema, type CalculatorInput, type CalculationResult } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { InfoIcon, ShipIcon, TimerIcon, FuelIcon, DollarSignIcon, LeafIcon, GlobeIcon } from "lucide-react"; // Added icons
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import ResultsDisplay from "./results-display";
import { apiRequest } from "@/lib/queryClient";

export default function CalculatorForm() {
  const [results, setResults] = useState<CalculationResult[] | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const form = useForm<CalculatorInput>({
    resolver: zodResolver(calculatorInputSchema),
    defaultValues: {
      fleetSize: 10,
      voyageLength: 30,
      fuelConsumption: 50,
      fuelPrice: 750,
      estimatedSavings: 5
    }
  });

  async function onSubmit(formEvent: React.FormEvent) {
    formEvent.preventDefault();
    setIsCalculating(true);
    try {
      console.log("Form submission started");
      const values = form.getValues();
      console.log("Form values:", values);
      const formData = {
        fleetSize: Number(values.fleetSize),
        voyageLength: Number(values.voyageLength),
        fuelConsumption: Number(values.fuelConsumption),
        fuelPrice: Number(values.fuelPrice),
        estimatedSavings: Number(values.estimatedSavings)
      };

      if (Object.values(formData).some(isNaN)) {
        console.error("Invalid form data");
        return;
      }

      const scenarios = [
        { savings: 4, label: 'Conservative Savings' },
        { savings: 6, label: 'Average Savings' },
        { savings: 8, label: 'Optimal Savings' }
      ];

      try {
        const responses = await Promise.all(
          scenarios.map(async (scenario) => {
            const data = { ...formData, estimatedSavings: scenario.savings };
            const res = await apiRequest("POST", "/api/calculate", data);
            if (!res.ok) throw new Error('API request failed');
            const json = await res.json();
            console.log("API Response:", json);
            return { ...json, label: scenario.label };
          })
        );
        console.log("All responses:", responses);
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-4">
              <div className="space-y-4"> {/* Changed to vertical stacking */}
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
                        <Tooltip>
                          <TooltipTrigger>
                            <InfoIcon className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>Number of ships in your fleet</TooltipContent>
                        </Tooltip>
                      </div>
                      <FormControl>
                        <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="voyageLength"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <FormLabel className="flex items-center gap-2">
                          <TimerIcon className="h-4 w-4" />
                          <span>Average Voyage Length (Days)</span>
                        </FormLabel>
                        <Tooltip>
                          <TooltipTrigger>
                            <InfoIcon className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>Average duration of voyages</TooltipContent>
                        </Tooltip>
                      </div>
                      <FormControl>
                        <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                        <Tooltip>
                          <TooltipTrigger>
                            <InfoIcon className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>Average daily fuel consumption in metric tons</TooltipContent>
                        </Tooltip>
                      </div>
                      <FormControl>
                        <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                        <Tooltip>
                          <TooltipTrigger>
                            <InfoIcon className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>Current fuel price per metric ton</TooltipContent>
                        </Tooltip>
                      </div>
                      <FormControl>
                        <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                      </FormControl>
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
                  type="submit"
                  className="w-full"
                  disabled={isCalculating}
                  onClick={onSubmit}
                >
                  {isCalculating ? "Calculating..." : "View Potential Savings"}
                </Button>
              </motion.div>
            </form>
          </Form>

          <div className="mt-4 border-t border-slate-200 pt-4">
            <h4 className="text-sm font-semibold mb-4 text-slate-900">Calculator Assumptions</h4>
            <div className="grid grid-cols-1 gap-4 text-xs text-slate-800">
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <FuelIcon className="h-4 w-4 flex-shrink-0 text-slate-700" />
                  <div>
                    <p className="font-semibold text-slate-900">Fuel Consumption</p>
                    <p className="text-slate-800">Assumes constant fuel consumption rate (MT/day) for entire voyage</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <DollarSignIcon className="h-4 w-4 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Fuel Price</p>
                    <p>Fixed fuel price for voyage duration, no price fluctuations</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <LeafIcon className="h-4 w-4 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Savings Range</p>
                    <p>4-10% typical savings based on Wayfinder platform results</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <GlobeIcon className="h-4 w-4 flex-shrink-0" />
                  <div>
                    <p className="font-medium">CO₂ Calculation</p>
                    <p>3.15 metric tons of CO₂ per metric ton of fuel burned</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          {results ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ResultsDisplay results={results} />
            </motion.div>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground mt-8"> {/* Added margin-top here */}
              Enter values and calculate to see results
            </div>
          )}
        </div>
      </div>
    </div>
  );
}