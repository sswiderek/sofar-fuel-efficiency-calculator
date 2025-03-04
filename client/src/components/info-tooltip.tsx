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
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <button type="button" className={`inline-flex items-center text-gray-400 hover:text-gray-600 ml-1 ${className}`}>
            <Info className={`${iconClassName} translate-y-[0.1em]`} />
          </button>
        </TooltipTrigger>
        <TooltipContent 
          side="right" 
          align="start" 
          sideOffset={5}
          alignOffset={-5}
          className="max-w-[350px] w-[350px] p-4 text-sm bg-slate-100 text-slate-800 rounded-lg shadow-lg border border-slate-200 z-[9999]"
          avoidCollisions={true}
          collisionPadding={20}
        >
          <div className="tooltip-content-wrapper">
            {children}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}