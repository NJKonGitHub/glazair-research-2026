import { useTranslation } from 'react-i18next'
import Walkthrough from '../Walkthrough'

export default function S07Commercial() {
  const { t } = useTranslation()
  return (
    <section id="commercial" className="section section--alt">
      <div className="container">
        <p className="section__eyebrow">
          <span className="rule" />
          <span className="num">07</span>
          <span>{t('s07_eyebrow')}</span>
        </p>
        <h2 className="section__title">{t('s07_title')}</h2>
        <div className="section__body">
          <p className="section__lede">{t('s07_lede')}</p>
          <h3 className="section__subhead"><span className="marker">07.1</span><span>{t('s07_sub1')}</span></h3>
          <p>{t('s07_sub1_body1')}</p>
          <p>{t('s07_sub1_body2')}</p>
          <h3 className="section__subhead"><span className="marker">07.2</span><span>{t('s07_sub2')}</span></h3>
          <p>{t('s07_sub2_body1')}</p>
          <p>{t('s07_sub2_body2')}</p>
          <h3 className="section__subhead"><span className="marker">07.3</span><span>{t('s07_sub3')}</span></h3>
          <p>{t('s07_sub3_body1')}</p>
          <h3 className="section__subhead"><span className="marker">07.4</span><span>{t('s07_sub4')}</span></h3>
          <p>{t('s07_sub4_body1')}</p>
          <p>{t('s07_sub4_body2')}</p>
        </div>
        <Walkthrough prevIndex={5} prevNum="06" prevTitleKey="nav_s06" nextIndex={7} nextNum="08" nextTitleKey="nav_s08" />
      </div>
    </section>
  )
}
