// Modified input handlers for the calculator form
import React from 'react';
import { Input } from "@/components/ui/input";
import { FormControl } from "@/components/ui/form";

// These modified components allow empty input values instead of defaulting to 0

export const CountInput = ({ field, className, placeholder }: any) => (
  <FormControl>
    <Input
      type="number"
      className={className || "w-full bg-white/80 border-slate-200/80 focus:border-sky-200 focus:ring-sky-200"}
      placeholder={placeholder || "e.g. 5"}
      {...field}
      value={field.value === undefined || field.value === null ? "" : field.value}
      onChange={(e) =>
        field.onChange(e.target.value === "" ? undefined : Number(e.target.value))
      }
    />
  </FormControl>
);

export const FuelConsumptionInput = ({ field, className, placeholder, vessel }: any) => (
  <FormControl>
    <Input
      type="number"
      {...field}
      className={className || `w-full bg-white/80 border-slate-200/80 focus:border-sky-200 focus:ring-sky-200 ${vessel?.category ? "bg-slate-50 border-dashed" : ""}`}
      placeholder={placeholder || (vessel?.category ? "Estimated value" : "Enter value")}
      value={field.value === undefined || field.value === null ? "" : field.value}
      onChange={(e) =>
        field.onChange(e.target.value === "" ? undefined : Number(e.target.value))
      }
    />
  </FormControl>
);

export const SeaDaysInput = ({ field, className, placeholder, vessel }: any) => (
  <FormControl>
    <Input
      type="number"
      className={className || `w-full bg-white/80 border-slate-200/80 focus:border-sky-200 focus:ring-sky-200 ${vessel?.category ? "bg-slate-50 border-dashed" : ""}`}
      placeholder={placeholder || (vessel?.category ? "Estimated value" : "Enter value")}
      {...field}
      value={field.value === undefined || field.value === null ? "" : field.value}
      onChange={(e) =>
        field.onChange(e.target.value === "" ? undefined : Number(e.target.value))
      }
    />
  </FormControl>
);

export const FuelPriceInput = ({ field, className, placeholder }: any) => (
  <FormControl>
    <Input
      placeholder={placeholder || "Enter fuel price"}
      {...field}
      value={field.value === undefined || field.value === null ? "" : field.value}
      onChange={(e) =>
        field.onChange(
          e.target.value === "" ? undefined : Number(e.target.value)
        )
      }
      className={className || "w-full pl-7 bg-white/80 border-slate-200/80 focus:border-sky-200 focus:ring-sky-200"}
    />
  </FormControl>
);