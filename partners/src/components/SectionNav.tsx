import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useCarousel } from '../CarouselContext'

const SECTIONS = [
  { id: 'welcome',       num: '01', key: 'nav_s01' },
  { id: 'platform',      num: '02', key: 'nav_s02' },
  { id: 'roles',         num: '03', key: 'nav_s03' },
  { id: 'quoting',       num: '04', key: 'nav_s04' },
  { id: 'getting-started', num: '05', key: 'nav_s05' },
  { id: 'questions',     num: '06', key: 'nav_s06' },
  { id: 'commercial',    num: '07', key: 'nav_s07' },
  { id: 'agreement',     num: '08', key: 'nav_s08' },
]

const DRAG_THRESHOLD_PX = 4

export default function SectionNav() {
  const { t } = useTranslation()
  const { activeIndex, goTo } = useCarousel()
  const listRef = useRef<HTMLUListElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  // All drag state in a single ref so event handlers see fresh values without
  // causing re-renders or stale closure issues.
  const drag = useRef({ active: false, startX: 0, startScroll: 0, moved: false })

  // Auto-scroll the active pill into view whenever the active section changes
  useEffect(() => {
    const list = listRef.current
    if (!list) return
    const activePill = list.querySelector<HTMLElement>('.section-nav__pill--active')
    if (activePill) {
      activePill.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' })
    }
  }, [activeIndex])

  // Global mouse-move / mouse-up listeners for drag-scroll
  useEffect(() => {
    function onMove(e: MouseEvent) {
      if (!drag.current.active) return
      const list = listRef.current
      if (!list) return
      const delta = drag.current.startX - e.clientX
      list.scrollLeft = drag.current.startScroll + delta
      if (Math.abs(delta) > DRAG_THRESHOLD_PX) drag.current.moved = true
    }
    function onUp() {
      drag.current.active = false
      setIsDragging(false)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [])

  function handleMouseDown(e: React.MouseEvent<HTMLUListElement>) {
    const list = listRef.current
    if (!list) return
    drag.current = { active: true, startX: e.clientX, startScroll: list.scrollLeft, moved: false }
    setIsDragging(true)
  }

  function handlePillClick(e: React.MouseEvent, idx: number) {
    if (drag.current.moved) {
      e.preventDefault()
      return
    }
    goTo(idx)
  }

  return (
    <nav
      className={`section-nav${isDragging ? ' section-nav--dragging' : ''}`}
      aria-label="Portal sections"
    >
      <div className="section-nav__inner">
        <ul
          ref={listRef}
          className="section-nav__list"
          onMouseDown={handleMouseDown}
        >
          {SECTIONS.map((s, i) => (
            <li key={s.id}>
              <button
                type="button"
                className={`section-nav__pill${activeIndex === i ? ' section-nav__pill--active' : ''}`}
                aria-current={activeIndex === i ? 'true' : undefined}
                onClick={(e) => handlePillClick(e, i)}
              >
                <span className="num">{s.num}</span>
                <span>{t(s.key)}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
