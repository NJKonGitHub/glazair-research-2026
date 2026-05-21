import { useTranslation } from 'react-i18next'
import Walkthrough from '../Walkthrough'

export default function S05GettingStarted() {
  const { t } = useTranslation()
  return (
    <section id="getting-started" className="section section--alt">
      <div className="container">
        <p className="section__eyebrow">
          <span className="rule" />
          <span className="num">05</span>
          <span>{t('s05_eyebrow')}</span>
        </p>
        <h2 className="section__title">{t('s05_title')}</h2>
        <div className="section__body">
          <p className="section__lede">{t('s05_lede')}</p>
          <h3 className="section__subhead"><span className="marker">05.1</span><span>{t('s05_sub1')}</span></h3>
          <p>{t('s05_sub1_body1')}</p>
          <p>{t('s05_sub1_body2')}</p>
          <h3 className="section__subhead"><span className="marker">05.2</span><span>{t('s05_sub2')}</span></h3>
          <p>{t('s05_sub2_body1')}</p>
          <h3 className="section__subhead"><span className="marker">05.3</span><span>{t('s05_sub3')}</span></h3>
          <p>{t('s05_sub3_body1')}</p>
          <p>{t('s05_sub3_body2')}</p>
        </div>
        <Walkthrough prevIndex={3} prevNum="04" prevTitleKey="nav_s04" nextIndex={5} nextNum="06" nextTitleKey="nav_s06" />
      </div>
    </section>
  )
}
