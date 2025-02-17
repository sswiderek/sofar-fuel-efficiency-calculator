import { useEffect, useState } from "react"

/**
 * A hook to detect if we're on a touch-capable device.
 * 
 * 1. Performs a one-time check at mount, using standard heuristics.
 * 2. Avoids adding a 'touchstart' listener with { passive: true }.
 *    This prevents "Unable to preventDefault..." warnings elsewhere.
 */
export function useTouchDevice() {
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    // Basic one-time check for touch support:
    const detectedTouch =
      "ontouchstart" in window ||
      (navigator.maxTouchPoints && navigator.maxTouchPoints > 0) ||
      window.matchMedia("(pointer: coarse)").matches

    setIsTouch(detectedTouch)
  }, [])

  return isTouch
}

