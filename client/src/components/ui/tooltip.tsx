
"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { cn } from "@/lib/utils"
import { useTouchDevice } from "@/hooks/use-touch-device"
import { Popover, PopoverTrigger, PopoverContent } from "./popover"

const TooltipProvider = TooltipPrimitive.Provider
const Tooltip = TooltipPrimitive.Root

interface TooltipProps {
  children: React.ReactNode
  content: React.ReactNode
  className?: string
}

function MobileTooltip({ children, content, className }: TooltipProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className={cn("w-60 text-xs p-2", className)}>
        {content}
      </PopoverContent>
    </Popover>
  )
}

function DesktopTooltip({ children, content, className }: TooltipProps) {
  return (
    <Tooltip>
      <TooltipPrimitive.Trigger asChild>
        {children}
      </TooltipPrimitive.Trigger>
      <TooltipPrimitive.Content
        sideOffset={4}
        className={cn("z-50 rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md", className)}
      >
        {content}
      </TooltipPrimitive.Content>
    </Tooltip>
  )
}

const TooltipTrigger = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Trigger>
>((props, ref) => (
  <TooltipPrimitive.Trigger
    ref={ref}
    {...props}
  />
))
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

function SmartTooltip(props: TooltipProps) {
  const isTouch = useTouchDevice()
  return isTouch ? <MobileTooltip {...props} /> : <DesktopTooltip {...props} />
}

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  SmartTooltip,
}
