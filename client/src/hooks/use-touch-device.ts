
import { useState, useEffect } from 'react';

export function useTouchDevice() {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const checkTouch = () => {
      const isTouchDevice = 
        ('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        window.matchMedia('(pointer: coarse)').matches;
      
      setIsTouch(isTouchDevice);
    };

    checkTouch();
    window.addEventListener('touchstart', () => setIsTouch(true), { passive: true });
    
    return () => {
      window.removeEventListener('touchstart', () => setIsTouch(true));
    };
  }, []);

  return isTouch;
}
