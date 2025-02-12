import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { calculatorInputSchema, type CalculatorInput, type CalculationResult } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { InfoIcon, ShipIcon, TimerIcon, FuelIcon, DollarSignIcon } from "lucide-react"; // Added icons
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
      <div className="bg-blue-50 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          Assumptions Made in This Calculator <span className="text-blue-500">⚙️</span>
        </h3>
        <ul className="space-y-4">
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-1">⛽</span>
            <div>
              <p className="font-medium">Fuel Consumption is Based on Daily Averages</p>
              <p className="text-sm text-muted-foreground">The calculator assumes a constant fuel consumption rate (MT/day) for the entire voyage duration.</p>
            </div>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-1">💰</span>
            <div>
              <p className="font-medium">Fuel Price is Static</p>
              <p className="text-sm text-muted-foreground">The fuel price entered is considered fixed for the voyage. Fluctuations in fuel prices are not accounted for.</p>
            </div>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-1">🌱</span>
            <div>
              <p className="font-medium">Estimated Savings Range</p>
              <p className="text-sm text-muted-foreground">The fuel savings percentage is estimated between 4% to 10%, based on typical results from Wayfinder platform. Actual savings may vary depending on weather conditions, route complexity, and vessel type.</p>
            </div>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-1">🌍</span>
            <div>
              <p className="font-medium">CO₂ Emissions Reduction</p>
              <p className="text-sm text-muted-foreground">The calculator assumes that each metric ton of fuel burned produces 3.15 metric tons of CO₂, based on standard shipping industry benchmarks.</p>
            </div>
          </li>
        </ul>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
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
                      <Tooltip>
                        <TooltipTrigger>
                          <InfoIcon className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Assumes a constant fuel consumption rate for the entire voyage duration</p>
                        </TooltipContent>
                      </Tooltip>
                    </FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </div>
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
                      <Tooltip>
                        <TooltipTrigger>
                          <InfoIcon className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Price is considered fixed for the voyage duration</p>
                        </TooltipContent>
                      </Tooltip>
                    </FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </div>
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
      </div>
      <div className="md:border-l md:pl-8">
        {results ? (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ResultsDisplay results={results} />
          </motion.div>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            Enter values and calculate to see results
          </div>
        )}
      </div>
    </div>
  );
}