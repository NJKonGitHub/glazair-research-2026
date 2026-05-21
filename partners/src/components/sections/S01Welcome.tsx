import { useTranslation } from 'react-i18next'
import Walkthrough from '../Walkthrough'

export default function S01Welcome() {
  const { t } = useTranslation()
  return (
    <section id="welcome" className="section">
      <div className="container">
        <p className="section__eyebrow">
          <span className="rule" />
          <span className="num">01</span>
          <span>{t('s01_eyebrow')}</span>
        </p>
        <h1 className="section__title">{t('s01_title')}</h1>
        <div className="section__body">
          <p className="section__lede">{t('s01_lede')}</p>
          <p>{t('s01_body1')}</p>
          <p>{t('s01_body2')}</p>
          <p className="section__closing">{t('s01_closing')}</p>
        </div>
        <Walkthrough nextIndex={1} nextNum="02" nextTitleKey="nav_s02" />
      </div>
    </section>
  )
}
