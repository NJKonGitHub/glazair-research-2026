import { useTranslation } from 'react-i18next'
import { useCarousel } from '../CarouselContext'

interface Props {
  prevIndex?: number
  prevNum?: string
  prevTitleKey?: string
  nextIndex?: number
  nextNum?: string
  nextTitleKey?: string
}

const ArrowLeft = () => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const ArrowRight = () => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default function Walkthrough({
  prevIndex,
  prevNum,
  prevTitleKey,
  nextIndex,
  nextNum,
  nextTitleKey,
}: Props) {
  const { t } = useTranslation()
  const { goTo } = useCarousel()

  const hasPrev = prevIndex !== undefined
  const hasNext = nextIndex !== undefined

  return (
    <nav className="walkthrough" aria-label="Section walkthrough">
      <button
        type="button"
        className="walkthrough__btn walkthrough__btn--prev"
        onClick={() => hasPrev && goTo(prevIndex!)}
        aria-disabled={hasPrev ? undefined : 'true'}
        tabIndex={hasPrev ? undefined : -1}
        disabled={!hasPrev}
      >
        <span className="walkthrough__arrow"><ArrowLeft /></span>
        <span className="walkthrough__meta">
          <span className="walkthrough__label">
            {prevNum ? `${t('walkthrough_prev')} · ${prevNum}` : t('walkthrough_prev')}
          </span>
          <span className="walkthrough__title">{prevTitleKey ? t(prevTitleKey) : '—'}</span>
        </span>
      </button>

      <button
        type="button"
        className="walkthrough__btn walkthrough__btn--next"
        onClick={() => hasNext && goTo(nextIndex!)}
        aria-disabled={hasNext ? undefined : 'true'}
        tabIndex={hasNext ? undefined : -1}
        disabled={!hasNext}
      >
        <span className="walkthrough__meta">
          <span className="walkthrough__label">
            {nextNum ? `${t('walkthrough_next')} · ${nextNum}` : t('walkthrough_end')}
          </span>
          <span className="walkthrough__title">{nextTitleKey ? t(nextTitleKey) : '—'}</span>
        </span>
        <span className="walkthrough__arrow"><ArrowRight /></span>
      </button>
    </nav>
  )
}
