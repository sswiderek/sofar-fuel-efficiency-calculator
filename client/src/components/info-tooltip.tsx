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
          <button type="button" className={`inline-flex items-center text-gray-400 hover:text-gray-600 ml-1 ${className}`}>
            <Info className={`${iconClassName} translate-y-[0.1em]`} />
          </button>
        </TooltipTrigger>
        <TooltipContent 
          className="max-w-[300px] p-4 text-sm bg-blue-900 text-white rounded-lg shadow-lg"
          sideOffset={5}
        >
          {children}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}