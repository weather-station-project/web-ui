import { useTranslation } from 'react-i18next'
import { Nav, Navbar } from 'react-bootstrap'
import { memo } from 'react'
import logo from '/logo.png'
import LanguageSelector from './LanguageSelector.tsx'

const NavigationMenu = () => {
  const { t } = useTranslation()

  return (
    <header>
      <Navbar bg="primary" variant="dark">
        <Navbar.Brand href="/">
          <img src={logo} className="d-inline-block align-top logo" alt="Logo" />
        </Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link href="/">{t('navigation-menu.home')}</Nav.Link>
          {/*<Nav.Link href="/historicaldata">{t('navmenu.historical_data')}</Nav.Link>
          <Nav.Link href="/measurementslist">{t('navmenu.measurements_list')}</Nav.Link>*/}
        </Nav>
        <Nav>
          <LanguageSelector />
        </Nav>
      </Navbar>
    </header>
  )
}

export default memo(NavigationMenu)
