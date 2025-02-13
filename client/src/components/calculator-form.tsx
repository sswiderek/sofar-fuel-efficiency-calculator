
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { calculatorInputSchema, type CalculatorInput, type CalculationResult } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { InfoIcon, ShipIcon, TimerIcon, FuelIcon, DollarSignIcon } from "lucide-react";
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
      const values = form.getValues();
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
                >
                  {isCalculating ? "Calculating..." : "View Potential Savings"}
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
            >
              <ResultsDisplay results={results} />
            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center gap-2 text-muted-foreground mt-8">
              <div className="ship-container">
                <svg viewBox="0 0 200 150" className="w-48 h-48">
                  <path d="M20,110 Q100,120 180,110 L160,140 Q100,150 40,140 Z" fill="#1E40AF" />
                  <path d="M40,60 L160,60 L160,110 L40,110 Z" fill="#1E40AF" />
                  <rect x="140" y="30" width="30" height="30" fill="#475569" />
                  <rect x="150" y="15" width="10" height="15" fill="#475569" />
                  <rect x="45" y="65" width="25" height="20" fill="#1D4ED8" />
                  <rect x="45" y="40" width="25" height="20" fill="#B91C1C" />
                  <rect x="75" y="65" width="25" height="20" fill="#D97706" />
                  <rect x="75" y="40" width="25" height="20" fill="#15803D" />
                  <rect x="105" y="65" width="25" height="20" fill="#15803D" />
                  <rect x="105" y="40" width="25" height="20" fill="#1D4ED8" />
                  <circle cx="30" cy="125" r="3" fill="#B91C1C" />
                  <circle cx="45" cy="125" r="3" fill="#B91C1C" />
                </svg>
                <div className="waves-container">
                  <div className="wave wave1"></div>
                  <div className="wave wave2"></div>
                  <div className="wave wave3"></div>
                </div>
              </div>
              <p className="text-slate-700 text-base">Fill in your fleet details to calculate potential fuel savings</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
