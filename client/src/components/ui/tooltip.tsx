"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import { cn } from "@/lib/utils"

const TooltipProvider = TooltipPrimitive.Provider

interface SmartTooltipProps {
  children: React.ReactNode
  content: React.ReactNode
  className?: string
}

const SmartTooltip = ({ children, content, className }: SmartTooltipProps) => {
  const [isTouchDevice, setIsTouchDevice] = React.useState(false)

  React.useEffect(() => {
    const checkTouch = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
    }
    checkTouch()
    window.addEventListener('resize', checkTouch)
    return () => window.removeEventListener('resize', checkTouch)
  }, [])

  if (isTouchDevice) {
    return (
      <PopoverPrimitive.Root>
        <PopoverPrimitive.Trigger asChild>
          {children}
        </PopoverPrimitive.Trigger>
        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            align="center"
            sideOffset={4}
            className={cn(
              "z-[100] w-[260px] rounded-md border bg-white p-3 text-sm text-slate-950 shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
              className
            )}
          >
            {content}
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
    )
  }

  return (
    <TooltipProvider>
      <TooltipPrimitive.Root delayDuration={0}>
        <TooltipPrimitive.Trigger asChild>
          {children}
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            sideOffset={4}
            className={cn(
              "z-[100] overflow-hidden rounded-md bg-slate-900 px-3 py-1.5 text-xs text-slate-50 animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
              className
            )}
          >
            {content}
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipProvider>
  )
}

export { SmartTooltip }