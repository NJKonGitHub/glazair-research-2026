import { useTranslation } from 'react-i18next'
import Walkthrough from '../Walkthrough'

export default function S04Quoting() {
  const { t } = useTranslation()
  return (
    <section id="quoting" className="section">
      <div className="container">
        <p className="section__eyebrow">
          <span className="rule" />
          <span className="num">04</span>
          <span>{t('s04_eyebrow')}</span>
        </p>
        <h2 className="section__title">{t('s04_title')}</h2>
        <div className="section__body">
          <p className="section__lede">{t('s04_lede')}</p>
          <h3 className="section__subhead"><span className="marker">04.1</span><span>{t('s04_sub1')}</span></h3>
          <p>{t('s04_sub1_body1')}</p>
          <p>{t('s04_sub1_body2')}</p>
          <h3 className="section__subhead"><span className="marker">04.2</span><span>{t('s04_sub2')}</span></h3>
          <p>{t('s04_sub2_body1')}</p>
          <p>{t('s04_sub2_body2')}</p>
          <p>{t('s04_sub2_body3')}</p>
          <h3 className="section__subhead"><span className="marker">04.3</span><span>{t('s04_sub3')}</span></h3>
          <p>{t('s04_sub3_body1')}</p>
          <p>{t('s04_sub3_body2')}</p>
          <p>{t('s04_sub3_body3')}</p>
          <h3 className="section__subhead"><span className="marker">04.4</span><span>{t('s04_sub4')}</span></h3>
          <p>{t('s04_sub4_body1')}</p>
          <p>{t('s04_sub4_body2')}</p>
        </div>
        <Walkthrough prevIndex={2} prevNum="03" prevTitleKey="nav_s03" nextIndex={4} nextNum="05" nextTitleKey="nav_s05" />
      </div>
    </section>
  )
}
