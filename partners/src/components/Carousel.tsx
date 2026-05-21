import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { CarouselContext } from '../CarouselContext'
import * as analytics from '../analytics'

/**
 * 0-indexed panel indices that require a dwell gate before showing the next arrow.
 * These are the "long" content sections: S02 (1), S04 (3), S06 (5).
 */
const LONG_PANELS = new Set([1, 3, 5])

/** S08 is the terminal panel — no next arrow is ever shown. */
const TERMINAL_INDEX = 7

/** Section ID labels for analytics, e.g. index 0 → "01" */
const SECTION_IDS = ['01', '02', '03', '04', '05', '06', '07', '08']

const DWELL_MS = 3000        // ms before next arrow appears on long panels
const SCROLL_SETTLE_MS = 80  // debounce for scroll → activeIndex update
const SCROLL_BOTTOM_PX = 60  // proximity to bottom that triggers next visibility

interface Props {
  panels: React.ReactNode[]
  nav: React.ReactNode
}

const ChevLeft = () => (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const ChevRight = () => (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default function Carousel({ panels, nav }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const panelRefs = useRef<(HTMLDivElement | null)[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const activeIndexRef = useRef(0)
  const [nextVisible, setNextVisible] = useState(true)
  const scrollDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const touchStartXRef = useRef<number>(0)

  // ── Navigation ──────────────────────────────────────────────────────────

  const goTo = useCallback(
    (index: number) => {
      const container = containerRef.current
      if (!container) return
      const clamped = Math.max(0, Math.min(panels.length - 1, index))
      container.scrollTo({ left: clamped * container.clientWidth, behavior: 'smooth' })
    },
    [panels.length],
  )

  const goNext = useCallback(() => goTo(activeIndexRef.current + 1), [goTo])
  const goPrev = useCallback(() => goTo(activeIndexRef.current - 1), [goTo])

  // ── Horizontal scroll → detect settled panel ─────────────────────────

  const handleContainerScroll = useCallback(() => {
    if (scrollDebounceRef.current) clearTimeout(scrollDebounceRef.current)
    scrollDebounceRef.current = setTimeout(() => {
      const container = containerRef.current
      if (!container) return
      const idx = Math.round(container.scrollLeft / container.clientWidth)
      if (idx !== activeIndexRef.current) {
        activeIndexRef.current = idx
        setActiveIndex(idx)
      }
    }, SCROLL_SETTLE_MS)
  }, [])

  // ── Next-arrow visibility + section_view analytics ───────────────────

  useEffect(() => {
    const entryTime = Date.now()

    // Cleanup: fire section_view analytics when leaving this panel
    const reportView = () => {
      const duration = (Date.now() - entryTime) / 1000
      if (duration >= 2) {
        analytics.post('section_view', {
          section_id: SECTION_IDS[activeIndex],
          duration_seconds: Math.round(duration),
        })
      }
    }

    if (activeIndex === TERMINAL_INDEX) {
      setNextVisible(false)
      return reportView
    }

    if (LONG_PANELS.has(activeIndex)) {
      setNextVisible(false)

      // Show next arrow after fixed dwell period
      const dwellTimer = setTimeout(() => setNextVisible(true), DWELL_MS)

      // Also show next arrow when user scrolls to bottom of this panel
      const panel = panelRefs.current[activeIndex]
      const onPanelScroll = panel
        ? () => {
            if (panel.scrollTop + panel.clientHeight >= panel.scrollHeight - SCROLL_BOTTOM_PX) {
              setNextVisible(true)
            }
          }
        : null

      if (panel && onPanelScroll) {
        panel.addEventListener('scroll', onPanelScroll, { passive: true })
      }

      return () => {
        clearTimeout(dwellTimer)
        if (panel && onPanelScroll) panel.removeEventListener('scroll', onPanelScroll)
        reportView()
      }
    }

    // Short panels: show next immediately
    setNextVisible(true)
    return reportView
  }, [activeIndex])

  // ── Keyboard navigation ──────────────────────────────────────────────

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); goNext() }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goNext, goPrev])

  // ── Touch swipe navigation ────────────────────────────────────────────

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const onStart = (e: TouchEvent) => { touchStartXRef.current = e.touches[0].clientX }
    const onEnd = (e: TouchEvent) => {
      const deltaX = e.changedTouches[0].clientX - touchStartXRef.current
      if (Math.abs(deltaX) > 50) {
        if (deltaX < 0) goNext()
        else goPrev()
      }
    }

    container.addEventListener('touchstart', onStart, { passive: true })
    container.addEventListener('touchend', onEnd, { passive: true })
    return () => {
      container.removeEventListener('touchstart', onStart)
      container.removeEventListener('touchend', onEnd)
    }
  }, [goNext, goPrev])

  // ── Context value ────────────────────────────────────────────────────

  const ctx = useMemo(
    () => ({ activeIndex, goTo, goNext, goPrev }),
    [activeIndex, goTo, goNext, goPrev],
  )

  // ── Render ───────────────────────────────────────────────────────────

  return (
    <CarouselContext.Provider value={ctx}>
      {nav}

      <div
        className="carousel-container"
        ref={containerRef}
        onScroll={handleContainerScroll}
      >
        {panels.map((panel, i) => (
          <div
            key={i}
            className="panel"
            ref={(el) => { panelRefs.current[i] = el }}
          >
            {panel}
          </div>
        ))}
      </div>

      {activeIndex > 0 && (
        <button
          type="button"
          className="carousel-nav carousel-nav--prev"
          onClick={goPrev}
          aria-label="Previous section"
        >
          <ChevLeft />
        </button>
      )}

      {nextVisible && activeIndex < TERMINAL_INDEX && (
        <button
          type="button"
          className="carousel-nav carousel-nav--next"
          onClick={goNext}
          aria-label="Next section"
        >
          <ChevRight />
        </button>
      )}
    </CarouselContext.Provider>
  )
}
