import { useTranslation } from 'react-i18next'
import Carousel from './components/Carousel'
import Header from './components/Header'
import SectionNav from './components/SectionNav'
import S01Welcome from './components/sections/S01Welcome'
import S02Platform from './components/sections/S02Platform'
import S03Roles from './components/sections/S03Roles'
import S04Quoting from './components/sections/S04Quoting'
import S05GettingStarted from './components/sections/S05GettingStarted'
import S06Questions from './components/sections/S06Questions'
import S07Commercial from './components/sections/S07Commercial'
import S08Agreement from './components/sections/S08Agreement'
import type { Lang } from './token'

interface Props {
  lang: Lang
  tokenId: string
}

export default function Portal({ tokenId }: Props) {
  const { i18n } = useTranslation()
  const currentLang = i18n.language as Lang

  const panels = [
    <S01Welcome />,
    <S02Platform />,
    <S03Roles />,
    <S04Quoting />,
    <S05GettingStarted />,
    <S06Questions />,
    <S07Commercial />,
    <S08Agreement tokenId={tokenId} />,
  ]

  return (
    <>
      <Header currentLang={currentLang} />
      <Carousel nav={<SectionNav />} panels={panels} />
    </>
  )
}
