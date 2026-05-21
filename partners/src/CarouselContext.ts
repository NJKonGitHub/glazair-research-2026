import { createContext, useContext } from 'react'

export interface CarouselContextValue {
  activeIndex: number
  goTo: (index: number) => void
  goNext: () => void
  goPrev: () => void
}

export const CarouselContext = createContext<CarouselContextValue | null>(null)

export function useCarousel(): CarouselContextValue {
  const ctx = useContext(CarouselContext)
  if (!ctx) throw new Error('useCarousel must be used within a Carousel provider')
  return ctx
}
