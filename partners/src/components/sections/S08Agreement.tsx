import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Placeholder from '../Placeholder'
import Walkthrough from '../Walkthrough'
import * as analytics from '../../analytics'

interface Props {
  tokenId: string
}

type CtaChoice = '1' | '2' | '3'

const CONFIRM_KEYS: Record<CtaChoice, string> = {
  '1': 'cta_1_confirm',
  '2': 'cta_2_confirm',
  '3': 'cta_3_confirm',
}

const ArrowRight = () => (
  <svg viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path d="M3.75 9H14.25" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9.75 4.5L14.25 9L9.75 13.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const ArrowSmall = () => (
  <svg viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path d="M2.5 6H9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.5 3L9.5 6L6.5 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default function S08Agreement({ tokenId: _tokenId }: Props) {
  const { t } = useTranslation()
  const year = new Date().getFullYear()
  const [chosen, setChosen] = useState<CtaChoice | null>(null)

  function handleCta(cta: CtaChoice) {
    if (chosen !== null) return // not reversible within the session
    analytics.post('cta_click', { cta })
    setChosen(cta)
  }

  return (
    <section id="agreement" className="section">
      <div className="container">
        <p className="section__eyebrow">
          <span className="rule" />
          <span className="num">08</span>
          <span>{t('s08_eyebrow')}</span>
        </p>
        <h2 className="section__title">{t('s08_title')}</h2>
        <div className="section__body">
          <p className="section__lede">{t('s08_lede')}</p>

          <h3 className="section__subhead"><span className="marker">08.1</span><span>{t('s08_sub1')}</span></h3>
          <p>{t('s08_sub1_body1')}</p>

          <h3 className="section__subhead"><span className="marker">08.2</span><span>{t('s08_sub2')}</span></h3>
          <p>{t('s08_sub2_body1')}</p>
          <Placeholder textKey="s08_sub2_placeholder" />

          <h3 className="section__subhead"><span className="marker">08.3</span><span>{t('s08_sub3')}</span></h3>
          <p>{t('s08_sub3_body1')}</p>

          <h3 className="section__subhead"><span className="marker">08.4</span><span>{t('s08_sub4')}</span></h3>
          <p>{t('s08_sub4_body1')}</p>

          <h3 className="section__subhead"><span className="marker">08.5</span><span>{t('s08_sub5')}</span></h3>
          <Placeholder textKey="s08_sub5_placeholder" />

          <h3 className="section__subhead"><span className="marker">08.6</span><span>{t('s08_sub6')}</span></h3>
          <p>{t('s08_sub6_body1')}</p>
        </div>

        <div className="cta-block">
          {chosen !== null ? (
            <p className="cta-confirm" role="status" aria-live="polite">
              {t(CONFIRM_KEYS[chosen])}
            </p>
          ) : (
            <>
              <p className="cta-block__intro">{t('s08_cta_intro')}</p>

              <button
                type="button"
                className="cta cta--primary"
                onClick={() => handleCta('1')}
              >
                <span className="cta__label">
                  {t('s08_cta1_label')}
                  <span className="cta__hint">{t('s08_cta1_hint')}</span>
                </span>
                <span className="cta__arrow"><ArrowRight /></span>
              </button>

              <button
                type="button"
                className="cta cta--secondary"
                onClick={() => handleCta('2')}
              >
                <span className="cta__label">
                  {t('s08_cta2_label')}
                  <span className="cta__hint">{t('s08_cta2_hint')}</span>
                </span>
                <span className="cta__arrow"><ArrowRight /></span>
              </button>

              <button
                type="button"
                className="cta cta--tertiary"
                onClick={() => handleCta('3')}
              >
                <span>{t('s08_cta3_label')}</span>
                <span className="cta__arrow"><ArrowSmall /></span>
              </button>
            </>
          )}
        </div>

        <Walkthrough prevIndex={6} prevNum="07" prevTitleKey="nav_s07" />
      </div>

      <footer className="site-footer">
        <div className="site-footer__inner">
          <p className="site-footer__text">{t('footer_text', { year })}</p>
        </div>
      </footer>
    </section>
  )
}
