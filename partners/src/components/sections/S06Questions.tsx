import { useTranslation } from 'react-i18next'
import Placeholder from '../Placeholder'
import Walkthrough from '../Walkthrough'

export default function S06Questions() {
  const { t } = useTranslation()
  return (
    <section id="questions" className="section">
      <div className="container">
        <p className="section__eyebrow">
          <span className="rule" />
          <span className="num">06</span>
          <span>{t('s06_eyebrow')}</span>
        </p>
        <h2 className="section__title">{t('s06_title')}</h2>
        <div className="section__body">
          <p className="section__lede">{t('s06_lede')}</p>
          <h3 className="section__subhead"><span className="marker">06.1</span><span>{t('s06_q1')}</span></h3>
          <p>{t('s06_a1')}</p>
          <h3 className="section__subhead"><span className="marker">06.2</span><span>{t('s06_q2')}</span></h3>
          <p>{t('s06_a2')}</p>
          <h3 className="section__subhead"><span className="marker">06.3</span><span>{t('s06_q3')}</span></h3>
          <p>{t('s06_a3')}</p>
          <h3 className="section__subhead"><span className="marker">06.4</span><span>{t('s06_q4')}</span></h3>
          <p>{t('s06_a4')}</p>
          <h3 className="section__subhead"><span className="marker">06.5</span><span>{t('s06_q5')}</span></h3>
          <Placeholder textKey="s06_a5_placeholder" />
          <h3 className="section__subhead"><span className="marker">06.6</span><span>{t('s06_q6')}</span></h3>
          <p>{t('s06_a6')}</p>
          <h3 className="section__subhead"><span className="marker">06.7</span><span>{t('s06_q7')}</span></h3>
          <p>{t('s06_a7')}</p>
          <h3 className="section__subhead"><span className="marker">06.8</span><span>{t('s06_q8')}</span></h3>
          <p>{t('s06_a8')}</p>
          <h3 className="section__subhead"><span className="marker">06.9</span><span>{t('s06_q9')}</span></h3>
          <p>{t('s06_a9')}</p>
          <h3 className="section__subhead"><span className="marker">06.10</span><span>{t('s06_q10')}</span></h3>
          <Placeholder textKey="s06_a10_placeholder" />
          <h3 className="section__subhead"><span className="marker">06.11</span><span>{t('s06_q11')}</span></h3>
          <p>{t('s06_a11')}</p>
          <h3 className="section__subhead"><span className="marker">06.12</span><span>{t('s06_q12')}</span></h3>
          <p>{t('s06_a12')}</p>
        </div>
        <Walkthrough prevIndex={4} prevNum="05" prevTitleKey="nav_s05" nextIndex={6} nextNum="07" nextTitleKey="nav_s07" />
      </div>
    </section>
  )
}
