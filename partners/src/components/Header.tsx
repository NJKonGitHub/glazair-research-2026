import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { switchLang } from '../i18n'
import * as analytics from '../analytics'
import type { Lang } from '../token'

interface Props {
  currentLang: Lang
}

const LANGS: { code: Lang; label: string; labelKey: string }[] = [
  { code: 'en', label: 'English', labelKey: 'lang_en' },
  { code: 'hu', label: 'Magyar', labelKey: 'lang_hu' },
  { code: 'de', label: 'Deutsch', labelKey: 'lang_de' },
]

export default function Header({ currentLang }: Props) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [logoError, setLogoError] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('click', onClickOutside)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('click', onClickOutside)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  function handleSelect(lang: Lang) {
    analytics.post('language_change', { from_lang: currentLang, to_lang: lang })
    switchLang(lang)
    setOpen(false)
  }

  const active = LANGS.find((l) => l.code === currentLang) ?? LANGS[0]

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <a href="#" className="site-header__logo" aria-label="Glazair" onClick={(e) => e.preventDefault()}>
          {logoError ? (
            <span className="site-header__logo-fallback">Glazair</span>
          ) : (
            <img
              src="/assets/glazair_logo.svg"
              alt="Glazair"
              onError={() => setLogoError(true)}
            />
          )}
        </a>

        <div className={`lang${open ? ' lang--open' : ''}`} ref={ref}>
          <button
            className="lang__btn"
            type="button"
            aria-haspopup="listbox"
            aria-expanded={open}
            onClick={(e) => { e.stopPropagation(); setOpen((v) => !v) }}
          >
            <span className="lang__code">{active.code.toUpperCase()}</span>
            <span className="lang__name">{active.label}</span>
            <svg className="lang__chev" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {open && (
            <div className="lang__menu" role="listbox" aria-label={t('lang_selector_label')}>
              {LANGS.map((l) => {
                const isActive = l.code === currentLang
                const isDisabled = false
                return (
                  <div
                    key={l.code}
                    role="option"
                    aria-selected={isActive}
                    className={`lang__opt${isActive ? ' lang__opt--active' : ''}${isDisabled ? ' lang__opt--disabled' : ''}`}
                    title={isDisabled ? t('lang_coming_soon') : undefined}
                    onClick={() => handleSelect(l.code)}
                  >
                    <span className="lang__opt-meta">
                      <span>{l.label}</span>
                      {isActive ? (
                        <span className="lang__opt-pre">{t('lang_from_invitation')}</span>
                      ) : (
                        <span className="lang__opt-code">{l.code.toUpperCase()}</span>
                      )}
                    </span>
                    {isActive && (
                      <svg className="lang__check" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                        <path d="M2.5 7.5L5.5 10.5L11.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
