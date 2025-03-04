
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface InfoTooltipProps {
  children: React.ReactNode;
  className?: string;
  iconClassName?: string;
}

export function InfoTooltip({ 
  children, 
  className = "", 
  iconClassName = "h-4 w-4" 
}: InfoTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button type="button" className={`inline-flex items-center text-gray-400 hover:text-gray-600 align-[0.1em] ${className}`}>
            <Info className={iconClassName} />
          </button>
        </TooltipTrigger>
        <TooltipContent 
          className="rounded-md bg-slate-800 px-3 py-2.5 text-sm text-white max-w-[250px] border border-slate-700 shadow-xl"
          sideOffset={5}
        >
          {children}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
