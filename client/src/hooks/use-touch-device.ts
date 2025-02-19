
import { useState, useEffect } from "react"

export function useTouchDevice() {
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    const checkTouch = () => {
      setIsTouch(
        'ontouchstart' in window || 
        navigator.maxTouchPoints > 0 ||
        window.matchMedia('(pointer: coarse)').matches
      )
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
