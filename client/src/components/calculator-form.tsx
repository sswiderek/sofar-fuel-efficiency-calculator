import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { calculatorInputSchema, type CalculatorInput, type CalculationResult } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { InfoIcon } from "lucide-react";
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

  async function onSubmit() {
    setIsCalculating(true);
    try {
      const scenarios = [
        { savings: 0, label: 'Current Operations (Baseline)' },
        { savings: 4, label: '4% Fuel Savings' },
        { savings: 8, label: '8% Fuel Savings' }
      ];
      
      const allResults = await Promise.all(
        scenarios.map(async (scenario) => {
          const data = { ...form.getValues(), estimatedSavings: scenario.savings };
          const res = await apiRequest("POST", "/api/calculate", data);
          return res.json();
        })
      );
      
      setResults(allResults);
    } catch (error) {
      console.error("Calculation failed:", error);
    } finally {
      setIsCalculating(false);
    }
  }

  return (
    <div className="space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="fleetSize"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormLabel>Fleet Size</FormLabel>
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
                    <FormLabel>Average Voyage Length (Days)</FormLabel>
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
                    <FormLabel>Fuel Consumption (MT/Day)</FormLabel>
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
                    <FormLabel>Fuel Price (USD/MT)</FormLabel>
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

      {results && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ResultsDisplay results={results} />
        </motion.div>
      )}
    </div>
  );
}
