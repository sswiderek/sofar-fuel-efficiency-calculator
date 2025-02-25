
import { useState, useEffect } from "react"

export function useTouchDevice() {
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    const checkTouch = () => {
      const touchPoints = navigator.maxTouchPoints > 0;
      const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
      const touchScreen = matchMedia('(hover: none)').matches;
      const hasTouchApi = 'ontouchstart' in window;
      
      setIsTouch(touchPoints || coarsePointer || touchScreen || hasTouchApi);
    }
    
    checkTouch();
    window.addEventListener('orientationchange', checkTouch);
    window.addEventListener('touchstart', () => setIsTouch(true), { once: true });
    
    return () => {
      window.removeEventListener('orientationchange', checkTouch);
    }
  }, [])

  return isTouch
}
