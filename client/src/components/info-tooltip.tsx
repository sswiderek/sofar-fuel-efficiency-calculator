
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
          <button type="button" className={`inline-flex items-center text-blue-500 hover:text-blue-600 ${className}`}>
            <Info className={iconClassName} />
          </button>
        </TooltipTrigger>
        <TooltipContent 
          className="rounded-md bg-black/90 px-2.5 py-2 text-xs text-white max-w-[200px]"
        >
          {children}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
