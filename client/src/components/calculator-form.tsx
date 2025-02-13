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
  const [isFetchingPrice, setIsFetchingPrice] = useState(false);

  useEffect(() => {
    const fetchFuelPrice = async () => {
      setIsFetchingPrice(true);
      try {
        const response = await fetch('/api/fuel-price');
        const data = await response.json();
        if (data.price) {
          form.setValue('fuelPrice', data.price);
        }
      } catch (error) {
        console.error('Failed to fetch fuel price:', error);
      } finally {
        setIsFetchingPrice(false);
      }
    };

    fetchFuelPrice();
  }, []);

  const form = useForm<CalculatorInput>({
    resolver: zodResolver(calculatorInputSchema),
    defaultValues: {
      fleetSize: undefined,
      voyageLength: undefined,
      fuelConsumption: undefined,
      fuelPrice: undefined,
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
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                onSubmit(e);
              }} 
              className="space-y-8 p-4"
            >
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
                        <Input 
                          type="number" 
                          placeholder={field.name === 'fleetSize' ? '10' : 
                            field.name === 'voyageLength' ? '30' : 
                            field.name === 'fuelConsumption' ? '50' : 
                            field.name === 'fuelPrice' ? '750' : '5'}
                          className="placeholder:text-gray-400 text-black"
                          {...field} 
                          onChange={e => field.onChange(parseFloat(e.target.value))} 
                        />
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
                        <Input 
                          type="number" 
                          placeholder={field.name === 'fleetSize' ? '10' : 
                            field.name === 'voyageLength' ? '30' : 
                            field.name === 'fuelConsumption' ? '50' : 
                            field.name === 'fuelPrice' ? '750' : '5'}
                          className="placeholder:text-gray-400 text-black"
                          {...field} 
                          onChange={e => field.onChange(parseFloat(e.target.value))} 
                        />
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
                        <Input 
                          type="number" 
                          placeholder={field.name === 'fleetSize' ? '10' : 
                            field.name === 'voyageLength' ? '30' : 
                            field.name === 'fuelConsumption' ? '50' : 
                            field.name === 'fuelPrice' ? '750' : '5'}
                          className="placeholder:text-gray-400 text-black"
                          {...field} 
                          onChange={e => field.onChange(parseFloat(e.target.value))} 
                        />
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
                          <span>Fuel Price (USD/MT){isFetchingPrice ? " - Loading..." : ""}</span>
                        </FormLabel>
                        <Tooltip>
                          <TooltipTrigger>
                            <InfoIcon className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>Current fuel price per metric ton</TooltipContent>
                        </Tooltip>
                      </div>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder={field.name === 'fleetSize' ? '10' : 
                            field.name === 'voyageLength' ? '30' : 
                            field.name === 'fuelConsumption' ? '50' : 
                            field.name === 'fuelPrice' ? '750' : '5'}
                          className="placeholder:text-gray-400 text-black"
                          {...field} 
                          onChange={e => field.onChange(parseFloat(e.target.value))} 
                        />
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
            >
              <ResultsDisplay results={results} />
            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center gap-2 text-muted-foreground mt-8">
              <div className="ship-container" style={{ transform: 'scale(0.15)', position: 'relative' }}>
                <svg viewBox="0 0 200 150" className="w-48 h-48" style={{ marginBottom: '20px' }}>
                  <g stroke="#374151" strokeWidth="1">
                    {/* Hull */}
                    <path d="M30,100 L170,100 L150,130 L50,130 Z" fill="#1E3A8A"/>
                    {/* Main deck */}
                    <path d="M50,60 L150,60 L150,100 L50,100 Z" fill="#1E3A8A"/>
                    {/* Bridge tower */}
                    <path d="M130,30 L150,30 L150,60 L130,60 Z" fill="#CBD5E1"/>
                    <path d="M135,15 L145,15 L145,30 L135,30 Z" fill="#CBD5E1"/>
                  </g>
                  {/* Containers */}
                  <rect x="60" y="65" width="20" height="15" fill="#EAB308"/>
                  <rect x="60" y="50" width="20" height="15" fill="#DC2626"/>
                  <rect x="80" y="65" width="20" height="15" fill="#2563EB"/>
                  <rect x="80" y="50" width="20" height="15" fill="#EAB308"/>
                  <rect x="100" y="65" width="20" height="15" fill="#DC2626"/>
                  <rect x="100" y="50" width="20" height="15" fill="#2563EB"/>
                </svg>
                <div className="waves-small"></div>
              </div>
              <p className="text-slate-700 text-base">Fill in your fleet details to calculate potential fuel savings</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}