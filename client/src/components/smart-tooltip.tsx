
import React, { useEffect, useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SmartTooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
}

export function SmartTooltip({ content, children }: SmartTooltipProps) {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch('ontouchstart' in window);
    console.log("SmartTooltip mounted with touch:", 'ontouchstart' in window);
  }, []);

  if (isTouch) {
    return children;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent>
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
