
import { useState, useEffect } from 'react';

export function useTouchDevice() {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const checkTouch = () => {
      setIsTouch(true);
      window.removeEventListener('touchstart', checkTouch);
    };

    if (typeof window !== 'undefined') {
      if ('ontouchstart' in window || 
          (navigator.maxTouchPoints && navigator.maxTouchPoints > 0) ||
          window.matchMedia('(pointer: coarse)').matches) {
        setIsTouch(true);
      } else {
        window.addEventListener('touchstart', checkTouch, { passive: true });
      }
    }

    return () => window.removeEventListener('touchstart', checkTouch);
  }, []);

  return isTouch;
}
