// Modified input handlers for the calculator form
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { FormControl } from "@/components/ui/form";

// Custom numeric input component that properly handles empty values
export const CountInput = ({ field, className, placeholder }: any) => {
  // Use internal state to track the displayed value
  const [displayValue, setDisplayValue] = useState<string>(
    field.value === undefined || field.value === null || field.value === 0 ? "" : String(field.value)
  );

  // Update display value when field.value changes from external sources
  useEffect(() => {
    if (field.value !== undefined && field.value !== null && field.value !== 0) {
      setDisplayValue(String(field.value));
    }
  }, [field.value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setDisplayValue(inputValue);
    
    // Only pass numeric values to the form
    if (inputValue === "") {
      field.onChange("");  // Pass empty string (will be converted to required value on submit)
    } else {
      field.onChange(Number(inputValue));
    }
  };

  return (
    <FormControl>
      <Input
        type="number"
        className={className || "w-full bg-white/80 border-slate-200/80 focus:border-sky-200 focus:ring-sky-200"}
        placeholder={placeholder || "e.g. 5"}
        value={displayValue}
        onChange={handleChange}
        onBlur={() => {
          // On blur, ensure we provide valid number for form validation if needed
          if (displayValue === "") {
            // Don't auto-fill on blur to allow truly empty field
            field.onChange(field.value || 1); // Default to 1 for validation purposes only
          }
        }}
      />
    </FormControl>
  );
};

export const FuelConsumptionInput = ({ field, className, placeholder, vessel }: any) => {
  const [displayValue, setDisplayValue] = useState<string>(
    field.value === undefined || field.value === null || field.value === 0 ? "" : String(field.value)
  );

  useEffect(() => {
    if (field.value !== undefined && field.value !== null && field.value !== 0) {
      setDisplayValue(String(field.value));
    }
  }, [field.value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setDisplayValue(inputValue);
    
    if (inputValue === "") {
      field.onChange("");
    } else {
      field.onChange(Number(inputValue));
    }
  };

  return (
    <FormControl>
      <Input
        type="number"
        className={className || `w-full bg-white/80 border-slate-200/80 focus:border-sky-200 focus:ring-sky-200 ${vessel?.category ? "bg-slate-50 border-dashed" : ""}`}
        placeholder={placeholder || (vessel?.category ? "Estimated value" : "Enter value")}
        value={displayValue}
        onChange={handleChange}
        onBlur={() => {
          if (displayValue === "") {
            // Don't auto-fill, but ensure validation works
            field.onChange(field.value || 0.1);
          }
        }}
      />
    </FormControl>
  );
};

export const SeaDaysInput = ({ field, className, placeholder, vessel }: any) => {
  const [displayValue, setDisplayValue] = useState<string>(
    field.value === undefined || field.value === null || field.value === 0 ? "" : String(field.value)
  );

  useEffect(() => {
    if (field.value !== undefined && field.value !== null && field.value !== 0) {
      setDisplayValue(String(field.value));
    }
  }, [field.value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setDisplayValue(inputValue);
    
    if (inputValue === "") {
      field.onChange("");
    } else {
      field.onChange(Number(inputValue));
    }
  };

  return (
    <FormControl>
      <Input
        type="number"
        className={className || `w-full bg-white/80 border-slate-200/80 focus:border-sky-200 focus:ring-sky-200 ${vessel?.category ? "bg-slate-50 border-dashed" : ""}`}
        placeholder={placeholder || (vessel?.category ? "Estimated value" : "Enter value")}
        value={displayValue}
        onChange={handleChange}
        onBlur={() => {
          if (displayValue === "") {
            // Don't auto-fill, but ensure validation works
            field.onChange(field.value || 1);
          }
        }}
      />
    </FormControl>
  );
};

export const FuelPriceInput = ({ field, className, placeholder }: any) => {
  const [displayValue, setDisplayValue] = useState<string>(
    field.value === undefined || field.value === null || field.value === 0 ? "" : String(field.value)
  );

  useEffect(() => {
    if (field.value !== undefined && field.value !== null && field.value !== 0) {
      setDisplayValue(String(field.value));
    }
  }, [field.value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setDisplayValue(inputValue);
    
    if (inputValue === "") {
      field.onChange("");
    } else {
      field.onChange(Number(inputValue));
    }
  };

  return (
    <FormControl>
      <Input
        type="number"
        className={className || "w-full pl-7 bg-white/80 border-slate-200/80 focus:border-sky-200 focus:ring-sky-200"}
        placeholder={placeholder || "Enter fuel price"}
        value={displayValue}
        onChange={handleChange}
        onBlur={() => {
          if (displayValue === "") {
            // Don't auto-fill, but ensure validation works
            field.onChange(field.value || 0.1);
          }
        }}
      />
    </FormControl>
  );
};