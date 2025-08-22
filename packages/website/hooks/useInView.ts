'use client'

/**
 * useInView Hook
 * Detects when an element enters the viewport
 */

import { useEffect, useRef, useState, RefObject } from 'react'

export function useInView(threshold = 0.25): [RefObject<HTMLElement>, boolean] {
  const [isInView, setIsInView] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Only trigger once when entering view
        if (entry.isIntersecting && !isInView) {
          setIsInView(true)
        }
      },
      { threshold }
    )
    
    const currentRef = ref.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
      observer.disconnect()
    }
  }, [threshold, isInView])

  return [ref, isInView]
}