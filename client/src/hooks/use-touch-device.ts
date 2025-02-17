
import { useState, useEffect } from 'react';

export function useTouchDevice() {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const checkTouch = () => {
      const isTouchDevice = (
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        // @ts-ignore
        navigator.msMaxTouchPoints > 0 ||
        window.matchMedia('(pointer: coarse)').matches
      );
      setIsTouch(isTouchDevice);
    };

    checkTouch();
    window.addEventListener('touchstart', checkTouch, { once: true });
    return () => window.removeEventListener('touchstart', checkTouch);
  }, []);

  return isTouch;
}
