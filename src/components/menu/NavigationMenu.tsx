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
        <Navbar.Brand href="/" data-testid="navigation-menu.logo">
          <img src={logo} className="logo" alt="Logo" />
        </Navbar.Brand>
        <Nav>
          <Nav.Link href="/" data-testid="navigation-menu.home">
            {t('navigation-menu.home')}
          </Nav.Link>
          {/*<Nav.Link href="/historicaldata">{t('navmenu.historical_data')}</Nav.Link>
          <Nav.Link href="/measurementslist">{t('navmenu.measurements_list')}</Nav.Link>*/}
        </Nav>
        <Navbar.Collapse className="justify-content-end">
          <Nav>
            <LanguageSelector />
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </header>
  )
}

export default memo(NavigationMenu)
