import { useState, useEffect } from "react"

export function useTouchDevice() {
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    // function handleTouch() {
    //   setIsTouch(true)
    //   window.removeEventListener("touchstart", handleTouch, { passive: false })
    // }

    // window.addEventListener("touchstart", handleTouch, { passive: false })

    // return () => {
    //   window.removeEventListener("touchstart", handleTouch, { passive: false })
    // }
  }, [])

  return isTouch
}
