import { useTranslation } from 'react-i18next'
import Walkthrough from '../Walkthrough'

export default function S02Platform() {
  const { t } = useTranslation()
  return (
    <section id="platform" className="section">
      <div className="container">
        <p className="section__eyebrow">
          <span className="rule" />
          <span className="num">02</span>
          <span>{t('s02_eyebrow')}</span>
        </p>
        <h2 className="section__title">{t('s02_title')}</h2>
        <div className="section__body">
          <p className="section__lede">{t('s02_lede')}</p>
          <h3 className="section__subhead"><span className="marker">02.1</span><span>{t('s02_sub1')}</span></h3>
          <p>{t('s02_sub1_body1')}</p>
          <p>{t('s02_sub1_body2')}</p>
          <h3 className="section__subhead"><span className="marker">02.2</span><span>{t('s02_sub2')}</span></h3>
          <p>{t('s02_sub2_body1')}</p>
          <p>{t('s02_sub2_body2')}</p>
          <h3 className="section__subhead"><span className="marker">02.3</span><span>{t('s02_sub3')}</span></h3>
          <p>{t('s02_sub3_body1')}</p>
          <p>{t('s02_sub3_body2')}</p>
          <h3 className="section__subhead"><span className="marker">02.4</span><span>{t('s02_sub4')}</span></h3>
          <p>{t('s02_sub4_body1')}</p>
          <p>{t('s02_sub4_body2')}</p>
          <h3 className="section__subhead"><span className="marker">02.5</span><span>{t('s02_sub5')}</span></h3>
          <p>{t('s02_sub5_body1')}</p>
          <p>{t('s02_sub5_body2')}</p>
        </div>
        <Walkthrough prevIndex={0} prevNum="01" prevTitleKey="nav_s01" nextIndex={2} nextNum="03" nextTitleKey="nav_s03" />
      </div>
    </section>
  )
}
