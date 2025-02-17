
import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { cn } from "@/lib/utils"
import { useTouchDevice } from "@/hooks/use-touch-device"

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = ({ children, ...props }: { children: React.ReactNode } & React.ComponentProps<typeof TooltipPrimitive.Root>) => {
  const isTouch = useTouchDevice()
  const [open, setOpen] = React.useState(false)
  
  if (isTouch) {
    return (
      <TooltipPrimitive.Root modal defaultOpen={open} open={open} onOpenChange={setOpen} {...props}>
        {children}
      </TooltipPrimitive.Root>
    )
  }
  
  return <TooltipPrimitive.Root {...props}>{children}</TooltipPrimitive.Root>
}

const TooltipTrigger = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Trigger>
>((props, ref) => {
  const isTouch = useTouchDevice()
  
  return (
    <TooltipPrimitive.Trigger 
      ref={ref}
      {...props}
      onClick={isTouch ? (e) => {
        console.log('Touch click event triggered', e)
        if (props.onClick) props.onClick(e)
      } : undefined}
      onTouchStart={isTouch ? (e) => {
        console.log('Touch start event triggered', e)
        setOpen(true)
      } : undefined}
      onTouchEnd={isTouch ? (e) => {
        console.log('Touch end event triggered', e)
        setTimeout(() => setOpen(false), 1000)
      } : undefined}
    />
  )
})
TooltipTrigger.displayName = TooltipPrimitive.Trigger.displayName

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => {
  const isTouch = useTouchDevice()
  
  return (
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md",
        isTouch ? "fixed inset-x-4 bottom-4 animate-in fade-in-0 zoom-in-95" : 
        "animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  )
})
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
