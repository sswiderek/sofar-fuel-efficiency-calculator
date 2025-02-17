"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { cn } from "@/lib/utils"
import { useTouchDevice } from "@/hooks/use-touch-device"

const TooltipProvider = TooltipPrimitive.Provider
const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Trigger>
>((props, ref) => {
  const isTouch = useTouchDevice()

  const handleTouch = (e: React.TouchEvent) => {
    // If you really need to block default scrolling/zoom, keep preventDefault().
    // If not, you can comment it out or only call it if e.cancelable.
    e.preventDefault()
    if (ref && "current" in ref && ref.current) {
      ref.current.click()
    }
  }

  return (
    <TooltipPrimitive.Trigger
      ref={ref}
      {...props}
      onTouchStart={handleTouch}
      style={{
        pointerEvents: "auto",
        touchAction: "none"
      }}
    />
  )
})
TooltipTrigger.displayName = TooltipPrimitive.Trigger.displayName

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md",
      className
    )}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider
};
