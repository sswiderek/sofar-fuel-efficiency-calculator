"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/lib/utils"

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = ({ children, ...props }) => {
  const [open, setOpen] = React.useState(false);
  const openTimeout = React.useRef(null);

  const handleOpenChange = React.useCallback((nextOpen) => {
    if (nextOpen) {
      openTimeout.current = setTimeout(() => setOpen(true), props.delayDuration || 200);
    } else {
      if (openTimeout.current) clearTimeout(openTimeout.current);
      setOpen(false);
    }
  }, [props.delayDuration]);

  React.useEffect(() => {
    return () => {
      if (openTimeout.current) clearTimeout(openTimeout.current);
    };
  }, []);

  return (
    <TooltipPrimitive.Root open={open} onOpenChange={handleOpenChange} {...props}>
      {children}
    </TooltipPrimitive.Root>
  );
};

const TooltipTrigger = React.forwardRef((props, ref) => {
  console.log('TooltipTrigger render:', { props, hasRef: !!ref });
  return <TooltipPrimitive.Trigger ref={ref} {...props} />;
});
TooltipTrigger.displayName = 'TooltipTrigger';

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-[99999] overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
TooltipContent.displayName = "TooltipContent"

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider
}