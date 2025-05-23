import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import {
  Anchor,
  Boxes as BoxesIcon,
  Ship,
  Wheat,
  Fuel,
  Scale,
  ScaleIcon,
  Hash as HashIcon,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { InfoTooltip } from "@/components/info-tooltip";
import {
  calculatorInputSchema,
  type CalculatorInput,
  type CalculationResult,
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import ResultsDisplay from "./results-display";
import { apiRequest } from "@/lib/queryClient";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
// Import modified inputs with empty value handling
import {
  CountInput,
  FuelConsumptionInput,
  SeaDaysInput,
  FuelPriceInput
} from "../modified-inputs";

interface VLSFOPrice {
  price: number | null;
  month: string;
  year: number;
  isError: boolean;
  errorMessage?: string;
}

// Type definition for vessel size data
interface VesselSizeData {
  label: string;
  defaultConsumption: number;
  defaultSeaDays: number;
}

export default function CalculatorForm() {
  const { toast } = useToast();
  const [results, setResults] = useState<CalculationResult[] | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [originalFormData, setOriginalFormData] = useState<any>(null);
  const [sharedDataProcessed, setSharedDataProcessed] = useState(false);

  const { data: fuelPriceData, isError: isFuelPriceError } =
    useQuery<VLSFOPrice>({
      queryKey: ["/api/vlsfo-price"],
    });

  // Parse shared data from URL if available
  const parseSharedData = () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const sharedData = urlParams.get('data');
      
      if (sharedData) {
        // Decode the base64 URL string
        const decodedData = JSON.parse(decodeURIComponent(atob(sharedData)));
        return decodedData;
      }
    } catch (error) {
      console.error("Error parsing shared data:", error);
    }
    return null;
  };

  const form = useForm<CalculatorInput>({
    resolver: zodResolver(calculatorInputSchema),
    defaultValues: {
      fuelPrice: 531,
      estimatedSavings: 5,
      vessels: [
        {
          category: "",
          size: "",
          count: 1,
          fuelConsumption: 0,
          seaDaysPerYear: 280,
        },
      ],
    },
  });

  const resultsRef = React.useRef<HTMLDivElement>(null);

  // Process shared data from URL and populate form fields
  useEffect(() => {
    if (!sharedDataProcessed) {
      const sharedData = parseSharedData();
      
      if (sharedData) {
        // Update form values with shared data
        try {
          // Update vessels data with special handling for the select fields
          if (sharedData.vessels && Array.isArray(sharedData.vessels)) {
            // First set the entire vessels array to ensure the proper number of vessels is created
            form.setValue("vessels", sharedData.vessels);
            
            // Process each vessel in two stages to ensure proper rendering
            // First stage - set categories for all vessels
            sharedData.vessels.forEach((vessel: any, index: number) => {
              if (vessel.category) {
                console.log(`Setting vessel ${index} category to ${vessel.category}`);
                form.setValue(`vessels.${index}.category`, vessel.category);
              }
            });
            
            // Wait for categories to be processed, then set sizes and other fields
            setTimeout(() => {
              sharedData.vessels.forEach((vessel: any, index: number) => {
                // Set size with explicit forceRender
                if (vessel.size) {
                  console.log(`Setting vessel ${index} size to ${vessel.size}`);
                  form.setValue(`vessels.${index}.size`, vessel.size, { 
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true
                  });
                }
                
                // Set other fields
                if (vessel.count) {
                  form.setValue(`vessels.${index}.count`, Number(vessel.count));
                }
                
                if (vessel.fuelConsumption) {
                  form.setValue(`vessels.${index}.fuelConsumption`, Number(vessel.fuelConsumption));
                }
                
                if (vessel.seaDaysPerYear) {
                  form.setValue(`vessels.${index}.seaDaysPerYear`, Number(vessel.seaDaysPerYear));
                }
              });
              
              // Force a form update
              form.trigger();
            }, 100); // Slightly longer timeout to ensure DOM has updated
          }
          
          // Update fuel price
          if (sharedData.fuelPrice) {
            form.setValue("fuelPrice", Number(sharedData.fuelPrice));
          }
          
          // Store original form data to pass to results display
          setOriginalFormData(sharedData);
          
          // If results are included in the shared data, set them
          if (sharedData.results) {
            setResults([{ ...sharedData.results, label: "Estimated Savings" }]);
          }
          
          // Mark as processed to avoid repeated processing
          setSharedDataProcessed(true);
        } catch (error) {
          console.error("Error populating form with shared data:", error);
        }
      }
    }
  }, [form, sharedDataProcessed]);

  useEffect(() => {
    if (!sharedDataProcessed) {
      // Always use 531 as the fuel price, regardless of API data
      form.setValue("fuelPrice", 531);
    }
  }, [form, sharedDataProcessed]);

  useEffect(() => {
    if (results && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [results]);

  async function onSubmit(data: CalculatorInput) {
    // Using react-hook-form's submission which gives us the data directly

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
          ", ",
        )}`,
        variant: "destructive",
      });
      return;
    }

    setIsCalculating(true);
    try {
      const formData = {
        fuelPrice: Number(values.fuelPrice),
        estimatedSavings: Number(values.estimatedSavings),
        vessels: values.vessels.map((vessel) => ({
          category: vessel.category,
          size: vessel.size,
          count: Number(vessel.count),
          fuelConsumption: Number(vessel.fuelConsumption),
          seaDaysPerYear: Number(vessel.seaDaysPerYear),
        })),
      };

      if (
        isNaN(formData.fuelPrice) ||
        isNaN(formData.estimatedSavings) ||
        formData.vessels.some(
          (v) =>
            isNaN(v.count) ||
            isNaN(v.fuelConsumption) ||
            isNaN(v.seaDaysPerYear),
        )
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
        
        // Store the form data for sharing
        setOriginalFormData(data);
        
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative max-w-full">
        <div className="space-y-8 pt-4 max-w-full overflow-hidden">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 p-6"
            >
              <div className="space-y-8">
                <div className="space-y-6">
                  <h3 className="text-sm font-medium text-slate-700">
                    Fleet Configuration
                  </h3>
                  {form.watch("vessels")?.map((vessel, index) => (
                    <div
                      key={index}
                      className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-slate-200/60 shadow-sm w-full"
                    >
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
                                    <div className="flex items-center gap-1.5">
                                      <FormLabel className="relative text-slate-700 font-medium">
                                        Vessel Category
                                      </FormLabel>
                                      <InfoTooltip>
                                        <p className="text-slate-600 leading-relaxed">
                                          Select the type of vessel based on its cargo or use
                                        </p>
                                      </InfoTooltip>
                                    </div>
                                  </div>
                                </div>
                                <FormControl>
                                  <Select
                                    onValueChange={(value) => {
                                      field.onChange(value);
                                      // Safely get the first size for this vessel category
                                      if (
                                        vesselSizes[
                                          value as keyof typeof vesselSizes
                                        ]
                                      ) {
                                        const firstSize = Object.keys(
                                          vesselSizes[
                                            value as keyof typeof vesselSizes
                                          ],
                                        )[0];
                                        form.setValue(
                                          `vessels.${index}.size`,
                                          firstSize,
                                        );

                                        // Clear fuel consumption when category changes
                                        form.setValue(
                                          `vessels.${index}.fuelConsumption`,
                                          0,
                                        );
                                      }
                                    }}
                                    value={field.value}
                                  >
                                    <SelectTrigger className="bg-white">
                                      <SelectValue placeholder="Select vessel category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {Object.entries(vesselCategories).map(
                                        ([key, label]) => (
                                          <SelectItem
                                            key={key}
                                            value={key}
                                            className="flex items-center gap-2"
                                          >
                                            <div className="flex items-center">
                                              {key === "container-ship" ? (
                                                <img
                                                  src="/images/container_ship.png"
                                                  alt="Container Ship"
                                                  className="h-6 w-6 object-contain mr-2"
                                                />
                                              ) : key === "ro-ro" ? (
                                                <img
                                                  src="/images/ro_ro_ship.png"
                                                  alt="Ro-Ro Ship"
                                                  className="h-6 w-6 object-contain mr-2"
                                                />
                                              ) : key === "cruise-ship" ? (
                                                <img
                                                  src="/images/cruise_ship.png"
                                                  alt="Cruise Ship"
                                                  className="h-6 w-6 object-contain mr-2"
                                                />
                                              ) : key === "bulk-carrier" ? (
                                                <img
                                                  src="/images/bulk_carrier.png"
                                                  alt="Bulk Carrier"
                                                  className="h-6 w-6 object-contain mr-2"
                                                />
                                              ) : key === "oil-tanker" ? (
                                                <img
                                                  src="/images/oil_tanker.png"
                                                  alt="Tanker"
                                                  className="h-6 w-6 object-contain mr-2"
                                                />
                                              ) : (
                                                <ShipIcon className="h-4 w-4 mr-2" />
                                              )}
                                              {label}
                                            </div>
                                          </SelectItem>
                                        ),
                                      )}
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage className="text-xs mt-1.5 bg-red-50 text-red-700 px-1.5 py-0.5 rounded border border-red-200/50 inline-block" />
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
                                    <div className="flex items-center gap-1.5">
                                      <FormLabel className="relative text-slate-700 font-medium">
                                        Vessel Size
                                      </FormLabel>
                                      <InfoTooltip>
                                        <p className="text-slate-600 leading-relaxed">
                                          Standard size classifications like Panamax, Capesize, etc.
                                        </p>
                                      </InfoTooltip>
                                    </div>
                                  </div>
                                </div>
                                <FormControl>
                                  <Select
                                    onValueChange={(value) => {
                                      console.log(`Size changed to: ${value}`);
                                      field.onChange(value);
                                      const category = form.getValues(
                                        `vessels.${index}.category`,
                                      );
                                      if (category && value) {
                                        try {
                                          // Get the specific vessel size data for this category and size
                                          const categoryData = vesselSizes[category as keyof typeof vesselSizes];
                                          if (categoryData) {
                                            const sizeKey = value as string;
                                            const sizeData = categoryData[sizeKey as keyof typeof categoryData];

                                            // Safely access consumption and sea days with explicit type check
                                            if (sizeData && 
                                                typeof sizeData === 'object' && 
                                                'defaultConsumption' in sizeData && 
                                                'defaultSeaDays' in sizeData) {
                                              const consumption = Number((sizeData as any).defaultConsumption);
                                              const seaDays = Number((sizeData as any).defaultSeaDays);

                                              // Only update if values are valid numbers and if the user hasn't modified them already
                                              // (Don't override values from a saved state)
                                              const currentConsumption = form.getValues(`vessels.${index}.fuelConsumption`);
                                              const currentSeaDays = form.getValues(`vessels.${index}.seaDaysPerYear`);
                                              
                                              // Always update fuel consumption when size changes
                                              if (!isNaN(consumption)) {
                                                form.setValue(
                                                  `vessels.${index}.fuelConsumption`,
                                                  consumption
                                                );
                                              }

                                              if (!isNaN(seaDays) && (!currentSeaDays || currentSeaDays === 0)) {
                                                form.setValue(
                                                  `vessels.${index}.seaDaysPerYear`,
                                                  seaDays
                                                );
                                              }
                                            }
                                          }
                                        } catch (error) {
                                          console.error("Error setting vessel data:", error);
                                        }
                                      }
                                    }}
                                    value={field.value}
                                    defaultValue={field.value}
                                  >
                                    <SelectTrigger className="bg-white">
                                      <SelectValue placeholder="Select vessel size" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {form.getValues(
                                        `vessels.${index}.category`,
                                      ) &&
                                        Object.entries(
                                          vesselSizes[
                                            form.getValues(
                                              `vessels.${index}.category`,
                                            ) as keyof typeof vesselSizes
                                          ],
                                        ).map(([key, value]) => (
                                          <SelectItem
                                            key={key}
                                            value={key}
                                            className="flex items-center gap-2"
                                          >
                                            <div className="flex items-center">
                                              {form.getValues(
                                                `vessels.${index}.category`,
                                              ) === "bulk-carrier" && (
                                                <img
                                                  src="/images/bulk_carrier.png"
                                                  alt="Bulk Carrier"
                                                  className={`
                                                  ${key === "small" ? "h-5 w-5" : ""}
                                                  ${key === "medium" ? "h-6 w-6" : ""}
                                                  ${key === "large" ? "h-7 w-7" : ""}
                                                  ${key === "vlarge" ? "h-8 w-8" : ""}
                                                  ${key === "vlcc" ? "h-9 w-9" : ""}
                                                  object-contain mr-2
                                                `}
                                                />
                                              )}
                                              {form.getValues(
                                                `vessels.${index}.category`,
                                              ) === "ro-ro" && (
                                                <img
                                                  src="/images/ro_ro_ship.png"
                                                  alt="Ro-Ro Ship"
                                                  className={`
                                                  ${key === "small" ? "h-6 w-6" : ""}
                                                  ${key === "medium" ? "h-7 w-7" : ""}
                                                  ${key === "large" ? "h-8 w-8" : ""}
                                                  ${key === "verylarge" ? "h-9 w-9" : ""}
                                                  ${key === "extralarge" ? "h-10 w-10" : ""}
                                                  object-contain mr-2
                                                `}
                                                />
                                              )}
                                              {form.getValues(
                                                `vessels.${index}.category`,
                                              ) === "cruise-ship" && (
                                                <img
                                                  src="/images/cruise_ship.png"
                                                  alt="Cruise Ship"
                                                  className={`
                                                  ${key === "small" ? "h-4 w-4" : ""}
                                                  ${key === "midsize" ? "h-5 w-5" : ""}
                                                  ${key === "large" ? "h-6 w-6" : ""}
                                                  ${key === "verylarge" ? "h-7 w-7" : ""}
                                                  ${key === "mega" ? "h-8 w-8" : ""}
                                                  object-contain mr-2
                                                `}
                                                />
                                              )}
                                              {form.getValues(
                                                `vessels.${index}.category`,
                                              ) === "container-ship" && (
                                                <img
                                                  src="/images/container_ship.png"
                                                  alt="Container Ship"
                                                  className={`
                                                  ${key === "feeder" ? "h-4 w-4" : ""}
                                                  ${key === "feedermax" ? "h-5 w-5" : ""}
                                                  ${key === "panamax" ? "h-6 w-6" : ""}
                                                  ${key === "postpanamax" ? "h-7 w-7" : ""}
                                                  ${key === "newpanamax" ? "h-8 w-8" : ""}
                                                  ${key === "ulcv" ? "h-9 w-9" : ""}
                                                  object-contain mr-2
                                                `}
                                                />
                                              )}
                                              {form.getValues(
                                                `vessels.${index}.category`,
                                              ) === "oil-tanker" && (
                                                <img
                                                  src="/images/oil_tanker.png"
                                                  alt="Tanker"
                                                  className={`
                                                  ${key === "small" ? "h-4 w-4" : ""}
                                                  ${key === "medium" ? "h-5 w-5" : ""}
                                                  ${key === "aframax" ? "h-6 w-6" : ""}
                                                  ${key === "suezmax" ? "h-7 w-7" : ""}
                                                  ${key === "vlcc" ? "h-8 w-8" : ""}
                                                  ${key === "ulcc" ? "h-9 w-9" : ""}
                                                  object-contain mr-2
                                                `}
                                                />
                                              )}
                                              {value.label.replace(
                                                /\B(?=(\d{3})+(?!\d))/g,
                                                ",",
                                              )}
                                            </div>
                                          </SelectItem>
                                        ))}
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage className="text-xs mt-1.5 bg-red-50 text-red-700 px-1.5 py-0.5 rounded border border-red-200/50 inline-block" />
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
                                    <HashIcon className="h-4 w-4 text-foreground" />
                                    <div className="flex items-center gap-1.5">
                                      <FormLabel className="relative text-slate-700 font-medium">
                                        Number of Ships
                                      </FormLabel>
                                      <InfoTooltip>
                                        <p className="text-slate-600 leading-relaxed">
                                          Total count of vessels of this
                                          specific category and size in your
                                          fleet. Calculations will be multiplied
                                          by this number for fleet-wide
                                          estimates.
                                        </p>
                                      </InfoTooltip>
                                    </div>
                                  </div>
                                </div>
                                <CountInput 
                                  field={field} 
                                  className="w-full bg-white/80 border-slate-200/80 focus:border-sky-200 focus:ring-sky-200"
                                  placeholder="e.g. 5"
                                />
                                <FormMessage className="text-xs mt-1.5 bg-red-50 text-red-700 px-1.5 py-0.5 rounded border border-red-200/50 inline-block" />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`vessels.${index}.fuelConsumption`}
                            render={({ field }) => (
                              <FormItem>
                                <div className="relative flex flex-col sm:flex-row sm:items-center gap-2">
                                  {/* Added relative positioning */}
                                  <div className="flex items-center gap-1.5">
                                    <FuelIcon className="h-4 w-4 text-foreground shrink-0" />
                                    <div className="flex items-center gap-1.5">
                                      <FormLabel className="relative text-slate-700 font-medium whitespace-nowrap">
                                        Fuel Consumption (MT/Day)
                                      </FormLabel>
                                      <InfoTooltip>
                                        <h4 className="font-semibold mb-2 text-slate-700">
                                          Daily Fuel Consumption
                                        </h4>
                                        <p className="text-slate-600 leading-relaxed">
                                          Pre-populated with an industry average estimate based on vessel type
                                          and size. For most accurate results, please adjust this value to match
                                          your vessel's actual operational data. Includes fuel used for
                                          propulsion only.
                                        </p>
                                      </InfoTooltip>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <FuelConsumptionInput 
                                    field={field} 
                                    vessel={vessel}
                                  />
                                  {vessel.category && vessel.size && (
                                    <div className="text-xs text-amber-600 text-right mt-1.5">
                                      <span className="bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/50">
                                        Industry estimate - adjust as needed
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <FormMessage className="text-xs mt-1.5 bg-red-50 text-red-700 px-1.5 py-0.5 rounded border border-red-200/50 inline-block" />
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
                                  <div className="flex items-center gap-1.5">
                                    <FormLabel className="relative text-slate-700 font-medium">
                                      Days at Sea Per Vessel Per Year
                                    </FormLabel>
                                    <InfoTooltip>
                                      <h4 className="font-semibold mb-2 text-slate-700">
                                        Annual Sea Days
                                      </h4>
                                      <p className="text-slate-600 leading-relaxed">
                                        Average days at sea per vessel per year. Default is 280 days, accounting for port calls and maintenance. Adjust to match your schedule.
                                      </p>
                                    </InfoTooltip>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <SeaDaysInput
                                  field={field}
                                  vessel={vessel}
                                />
                              </div>
                              <FormMessage className="text-xs mt-1.5 bg-red-50 text-red-700 px-1.5 py-0.5 rounded border border-red-200/50 inline-block" />
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
                              vessels.filter((_, i) => i !== index),
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
                        {
                          category: "container-ship",
                          size: "small",
                          count: 1,
                          fuelConsumption: 0,
                          seaDaysPerYear: 280,
                        },
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
                        <div className="flex items-center gap-1.5">
                          <DollarSignIcon className="h-4 w-4" />
                          <div className="flex items-center gap-1.5">
                            <FormLabel className="text-slate-700">Fuel Price (USD/MT)</FormLabel>
                            <InfoTooltip>
                              <h4 className="text-slate-800 font-medium mb-1">
                                Monthly Average VLSFO Fuel Price
                              </h4>
                              <p className="text-slate-600 leading-relaxed">
                                Based on Ship & Bunker's Global 20 Ports Average. Monthly
                                averages provide a stable baseline for calculations by smoothing
                                out daily price fluctuations.
                              </p>
                            </InfoTooltip>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <span className="absolute left-2.5 text-gray-500 top-[9px]">
                            $
                          </span>
                          <FuelPriceInput 
                            field={field}
                            className="w-full pl-7 bg-white/80 border-slate-200/80 focus:border-sky-200 focus:ring-sky-200"
                          />
                        </div>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        Latest monthly average: $531/MT (April 2025)
                      </div>
                      <FormMessage className="text-xs mt-1.5 bg-red-50 text-red-700 px-1.5 py-0.5 rounded border border-red-200/50 inline-block" />
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
              ref={resultsRef}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-2 md:mt-8"
            >
              <ResultsDisplay 
                results={results} 
                originalFormData={originalFormData || form.getValues()}
              />
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