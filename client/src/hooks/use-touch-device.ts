
import { useState, useEffect } from "react"

export function useTouchDevice() {
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    const checkTouch = () => {
      // Primary checks for touch capability
      const touchPoints = navigator.maxTouchPoints > 0;
      const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
      const touchScreen = matchMedia('(hover: none)').matches;
      const hasTouchApi = 'ontouchstart' in window;
      
      console.log('Touch detection:', {
        touchPoints,
        coarsePointer,
        touchScreen,
        hasTouchApi,
        userAgent: navigator.userAgent
      });

      setIsTouch(touchPoints || coarsePointer || touchScreen || hasTouchApi);
    }
    
    checkTouch();
    
    // Handle orientation changes
    window.addEventListener('orientationchange', checkTouch);
    // Handle initial touch
    window.addEventListener('touchstart', () => setIsTouch(true), { once: true });
    
    return () => {
      window.removeEventListener('orientationchange', checkTouch);
    }
  }, [])

  return isTouch
}
