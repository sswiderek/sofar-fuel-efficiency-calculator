import { useState, useEffect } from "react"

/**
 * Detects whether a user is on a touch-capable device by listening for
 * their very first "touchstart" event. This version uses { passive: false }
 * so it doesn't conflict with places where we call preventDefault().
 */
export function useTouchDevice() {
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    function handleTouch() {
      setIsTouch(true)
      // Remove listener once we've detected the first real touch
      window.removeEventListener("touchstart", handleTouch, { passive: false })
    }

    // IMPORTANT: Using { passive: false } so preventDefault won't cause errors
    window.addEventListener("touchstart", handleTouch, { passive: false })

    return () => {
      // Clean up the same listener on unmount
      window.removeEventListener("touchstart", handleTouch, { passive: false })
    }
  }, [])

  return isTouch
}
