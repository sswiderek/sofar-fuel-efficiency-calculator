
import { useState, useEffect } from "react"

export function useTouchDevice() {
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    const checkTouch = () => {
      const hasTouch = 'ontouchstart' in window;
      const hasMaxTouch = navigator.maxTouchPoints > 0;
      const hasCoarse = window.matchMedia('(pointer: coarse)').matches;
      
      console.log('Touch detection (prod):', {
        hasTouch,
        hasMaxTouch,
        hasCoarse,
        userAgent: navigator.userAgent
      });

      setIsTouch(hasTouch || hasMaxTouch || hasCoarse);
    }
    
    checkTouch()
    window.addEventListener('resize', checkTouch)
    window.matchMedia('(pointer: coarse)').addListener(checkTouch)
    
    return () => {
      window.removeEventListener('resize', checkTouch)
      window.matchMedia('(pointer: coarse)').removeListener(checkTouch)
    }
  }, [])

  return isTouch
}
