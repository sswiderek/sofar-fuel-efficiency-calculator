import { ReactNode } from 'react';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface InfoTooltipProps {
  children: ReactNode;
  icon?: ReactNode;
}

export function InfoTooltip({ children, icon }: InfoTooltipProps) {
  return (
    <Tooltip delayDuration={200}>
      <TooltipTrigger asChild>
        <button className="p-0.5 hover:bg-slate-100 rounded-full transition-colors">
          {icon || <Info className="h-3.5 w-3.5 text-slate-400 hover:text-slate-600" />}
        </button>
      </TooltipTrigger>
      <TooltipContent className="bg-white border-blue-200 shadow-lg max-w-[300px] p-3">
        <div className="space-y-1">
          {children}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
