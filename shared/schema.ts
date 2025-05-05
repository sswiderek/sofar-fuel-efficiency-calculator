import { z } from "zod";

// Define vessel categories
export const vesselCategories = {
  "container-ship": "Container Ship",
  "bulk-carrier": "Bulk Carrier",
  "oil-tanker": "Tanker",
  "cruise-ship": "Cruise Ship",
  "ro-ro": "Ro-Ro / General Cargo",
  "custom": "Custom Vessel"
} as const;

// Define vessel names for Cost Breakdown in Response Panel
export const vesselDisplayNames = {
  "container-ship": {
    "feeder": "Feeder",
    "feedermax": "Feedermax",
    "panamax": "Panamax",
    "postpanamax": "Post-Panamax",
    "newpanamax": "New Panamax",
    "ulcv": "ULCV"
  },
  "bulk-carrier": {
    "small": "Handysize",
    "medium": "Handymax",
    "large": "Panamax",
    "vlarge": "Capesize",
    "vlcc": "VLOC"
  },
  "oil-tanker": {
    "small": "Small Tanker",
    "medium": "Medium Tanker",
    "aframax": "Aframax",
    "suezmax": "Suezmax",
    "vlcc": "VLCC",
    "ulcc": "ULCC"
  },
  "cruise-ship": {
    "small": "Small",
    "midsize": "Mid-Size",
    "large": "Large",
    "verylarge": "Very Large",
    "mega": "Mega"
  },
  "ro-ro": {
    "small": "Small / Feeder",
    "medium": "Medium",
    "large": "Large",
    "verylarge": "Very Large",
    "extralarge": "Extra Large"
  },
  "custom": {
    "custom": "Custom Size"
  }
} as const;

// Define icon sizes for vessels in Cost Breakdown in Response Panel
export const vesselIconSizes = {
  "container-ship": {
    "feeder": "h-6 w-6",
    "feedermax": "h-7 w-7",
    "panamax": "h-8 w-8",
    "postpanamax": "h-9 w-9",
    "newpanamax": "h-10 w-10",
    "ulcv": "h-11 w-11"
  },
  "bulk-carrier": {
    "small": "h-7 w-7",
    "medium": "h-8 w-8",
    "large": "h-9 w-9",
    "vlarge": "h-10 w-10",
    "vlcc": "h-11 w-11"
  },
  "oil-tanker": {
    "small": "h-6 w-6",
    "medium": "h-7 w-7",
    "aframax": "h-8 w-8",
    "suezmax": "h-9 w-9",
    "vlcc": "h-10 w-10",
    "ulcc": "h-11 w-11"
  },
  "cruise-ship": {
    "small": "h-7 w-7",
    "midsize": "h-8 w-8",
    "large": "h-9 w-9",
    "verylarge": "h-10 w-10",
    "mega": "h-11 w-11"
  },
  "ro-ro": {
    "small": "h-7 w-7",
    "medium": "h-8 w-8",
    "large": "h-9 w-9",
    "verylarge": "h-10 w-10",
    "extralarge": "h-11 w-11"
  },
  "custom": {
    "custom": "h-9 w-9"
  }
} as const;

// Define size options for each vessel category
export const vesselSizes = {
  "container-ship": {
    "feeder": { label: "Feeder (0.5K-1K TEU)", defaultConsumption: 20, defaultSeaDays: 280 },
    "feedermax": { label: "Feedermax (1K-3K TEU)", defaultConsumption: 32, defaultSeaDays: 280 },
    "panamax": { label: "Panamax (3K-5K TEU)", defaultConsumption: 65, defaultSeaDays: 280 },
    "postpanamax": { label: "Post-Panamax (5K-10K TEU)", defaultConsumption: 125, defaultSeaDays: 280 },
    "newpanamax": { label: "New Panamax (10K-14K TEU)", defaultConsumption: 170, defaultSeaDays: 280 },
    "ulcv": { label: "ULCV (>14K TEU)", defaultConsumption: 185, defaultSeaDays: 280 }
  },
  "bulk-carrier": {
    "small": { label: "Handysize (10K-35K DWT)", defaultConsumption: 15, defaultSeaDays: 280 },
    "medium": { label: "Handymax (35K-50K DWT)", defaultConsumption: 20, defaultSeaDays: 280 },
    "large": { label: "Panamax (50K-80K DWT)", defaultConsumption: 25, defaultSeaDays: 280 },
    "vlarge": { label: "Capesize (80K-200K DWT)", defaultConsumption: 30, defaultSeaDays: 280 },
    "vlcc": { label: "VLOC (>200K DWT)", defaultConsumption: 35, defaultSeaDays: 280 }
  },
  "oil-tanker": {
    "small": { label: "Small (<50K DWT)", defaultConsumption: 28, defaultSeaDays: 280 },
    "medium": { label: "Medium (50K-80K DWT)", defaultConsumption: 36, defaultSeaDays: 280 },
    "aframax": { label: "Aframax (80K-120K DWT)", defaultConsumption: 45, defaultSeaDays: 280 },
    "suezmax": { label: "Suezmax (120K-160K DWT)", defaultConsumption: 52, defaultSeaDays: 280 },
    "vlcc": { label: "VLCC (160K-320K DWT)", defaultConsumption: 70, defaultSeaDays: 280 },
    "ulcc": { label: "ULCC (>320K DWT)", defaultConsumption: 78, defaultSeaDays: 280 }
  },
  "cruise-ship": {
    "small": { label: "Small (10K-50K GT)", defaultConsumption: 25, defaultSeaDays: 280 },
    "midsize": { label: "Mid-Size (50K-100K GT)", defaultConsumption: 32, defaultSeaDays: 280 },
    "large": { label: "Large (100K-150K GT)", defaultConsumption: 40, defaultSeaDays: 280 },
    "verylarge": { label: "Very Large (150K-200K GT)", defaultConsumption: 48, defaultSeaDays: 280 },
    "mega": { label: "Mega (>200K GT)", defaultConsumption: 55, defaultSeaDays: 280 }
  },
  "ro-ro": {
    "small": { label: "Small / Feeder (<10K GT)", defaultConsumption: 20, defaultSeaDays: 280 },
    "medium": { label: "Medium (10K-30K GT)", defaultConsumption: 32, defaultSeaDays: 280 },
    "large": { label: "Large (30K-50K GT)", defaultConsumption: 48, defaultSeaDays: 280 },
    "verylarge": { label: "Very Large (50K-70K GT)", defaultConsumption: 65, defaultSeaDays: 280 },
    "extralarge": { label: "Extra Large (>70K GT)", defaultConsumption: 82, defaultSeaDays: 280 }
  },
  "custom": {
    "custom": { label: "Custom Size", defaultConsumption: 50, defaultSeaDays: 280 }
  }
} as const;

export const vesselSchema = z.object({
  category: z.enum(Object.keys(vesselCategories) as [string, ...string[]], {
    errorMap: () => ({ message: "Please select a vessel category" })
  }),
  size: z.string(),
  count: z.number().min(1, "Must have at least 1 ship"),
  fuelConsumption: z.number().min(0.1, "Must consume some fuel"),
  seaDaysPerYear: z.number().min(1, "Must have at least 1 sea day").max(365, "Cannot exceed 365 days per year"),
  buildYear: z.number().optional(),
  specificsProvided: z.boolean().optional()
});

export const calculatorInputSchema = z.object({
  vessels: z.array(vesselSchema),
  fuelPrice: z.number().min(0.1, "Fuel price must be greater than 0").max(5000, "Please verify prices over $5000/MT"),
  estimatedSavings: z.number().min(0).max(10)
});

export type CalculatorInput = z.infer<typeof calculatorInputSchema>;
export type Vessel = z.infer<typeof vesselSchema>;

export interface CalculationResult {
  totalFuelCost: number;
  estimatedSavings: number;
  fuelCostWithWayfinder: number;
  co2Reduction: number;
  totalFuelConsumption: number;
  fuelPrice: number;
  vessels: Vessel[];
}

// Contact form schema
export const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  companyName: z.string().min(1, "Company name is required"),
  phoneNumber: z.string().optional(),
  message: z.string().optional(),
  calculationData: z.any().optional() // For storing calculation results
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
