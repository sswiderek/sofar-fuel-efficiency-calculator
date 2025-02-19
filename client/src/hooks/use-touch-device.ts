
import { useState, useEffect } from "react"

export function useTouchDevice() {
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    const checkTouch = () => {
      // Primary check: matchMedia
      const hasCoarse = window.matchMedia('(pointer: coarse)').matches;
      // Secondary checks
      const hasTouch = 'ontouchstart' in window || 
                      (window.DocumentTouch && document instanceof DocumentTouch);
      const hasMaxTouch = navigator.maxTouchPoints > 0;
      
      console.log('Touch detection:', {
        hasCoarse,
        hasTouch,
        hasMaxTouch,
        userAgent: navigator.userAgent
      });

      setIsTouch(hasCoarse || hasTouch || hasMaxTouch);
    }
    
    checkTouch()
    window.addEventListener('touchstart', () => setIsTouch(true), { once: true })
    
    const mediaQuery = window.matchMedia('(pointer: coarse)')
    mediaQuery.addListener(checkTouch)
    
    return () => {
      mediaQuery.removeListener(checkTouch)
    }
  }, [])

  return isTouch
}
