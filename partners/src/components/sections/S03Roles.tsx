import { useTranslation } from 'react-i18next'
import Walkthrough from '../Walkthrough'

export default function S03Roles() {
  const { t } = useTranslation()
  return (
    <section id="roles" className="section section--alt">
      <div className="container">
        <p className="section__eyebrow">
          <span className="rule" />
          <span className="num">03</span>
          <span>{t('s03_eyebrow')}</span>
        </p>
        <h2 className="section__title">{t('s03_title')}</h2>
        <div className="section__body">
          <p className="section__lede">{t('s03_lede')}</p>

          <h3 className="section__subhead"><span className="marker">03.1</span><span>{t('s03_sub1')}</span></h3>
          <p>{t('s03_sub1_body1')}</p>
          <p>{t('s03_sub1_body2')}</p>

          <h3 className="section__subhead"><span className="marker">03.2</span><span>{t('s03_sub2')}</span></h3>
          <p>{t('s03_sub2_body1')}</p>
          <p>{t('s03_sub2_body2')}</p>
          <p>{t('s03_sub2_body3')}</p>

          <aside className="sticker-callout" aria-label="Glazair sticker responsibility">
            <div className="sticker-callout__text">
              <p className="sticker-callout__label">{t('s03_sticker_label')}</p>
              <h4 className="sticker-callout__title">{t('s03_sticker_title')}</h4>
              <p className="sticker-callout__body">{t('s03_sticker_body1')}</p>
              <p className="sticker-callout__body">{t('s03_sticker_body2')}</p>
              <p className="sticker-callout__meta">
                <span>{t('s03_sticker_meta')}</span>
                <span className="sticker-callout__meta-code">{t('s03_sticker_code')}</span>
              </p>
            </div>
            <figure className="sticker-specimen" aria-label="Sticker specimen">
              <img src="/assets/sticker.svg" alt="Glazair workshop sticker with QR code" />
              <figcaption>{t('s03_sticker_caption')}</figcaption>
            </figure>
          </aside>

          <h3 className="section__subhead"><span className="marker">03.3</span><span>{t('s03_sub3')}</span></h3>
          <p>{t('s03_sub3_body1')}</p>
          <p>{t('s03_sub3_body2')}</p>

          <h3 className="section__subhead"><span className="marker">03.4</span><span>{t('s03_sub4')}</span></h3>
          <p>{t('s03_sub4_body1')}</p>
          <p>{t('s03_sub4_body2')}</p>
        </div>
        <Walkthrough prevIndex={1} prevNum="02" prevTitleKey="nav_s02" nextIndex={3} nextNum="04" nextTitleKey="nav_s04" />
      </div>
    </section>
  )
}
