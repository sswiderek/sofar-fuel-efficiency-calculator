import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface InfoTooltipProps {
  children?: React.ReactNode;
  content?: React.ReactNode;
  className?: string;
  iconClassName?: string;
}

export function InfoTooltip({ 
  children, 
  content,
  className = "", 
  iconClassName = "h-4 w-4" 
}: InfoTooltipProps) {
  // Use content or children, preferring content if both are provided
  const tooltipContent = content ?? children;
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button 
            type="button" 
            className={`inline-flex items-center text-gray-400 hover:text-gray-600 ml-1 cursor-pointer ${className}`}
          >
            <Info className={`${iconClassName} translate-y-[0.1em]`} />
          </button>
        </TooltipTrigger>
        <TooltipContent 
          side="top" 
          align="center" 
          sideOffset={5} 
          className="max-w-[300px] p-4 text-sm bg-slate-100 text-slate-800 rounded-lg shadow-lg border border-slate-200 z-[9999]"
        >
          {tooltipContent}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}