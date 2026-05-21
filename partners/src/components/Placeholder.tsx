import { useTranslation } from 'react-i18next'

interface Props {
  textKey: string
}

export default function Placeholder({ textKey }: Props) {
  const { t } = useTranslation()
  return (
    <div className="placeholder" role="note">
      <p className="placeholder__label">{t('placeholder_label')}</p>
      <p className="placeholder__body">{t(textKey)}</p>
    </div>
  )
}
