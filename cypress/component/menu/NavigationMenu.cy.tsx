import i18next from '../../../src/helpers/i18next'
import { I18nextProvider } from 'react-i18next'
import NavigationMenu from '../../../src/components/menu/NavigationMenu'
import React from 'react'

describe('NavigationMenu', (): void => {
  beforeEach((): void => {
    cy.mount(
      <I18nextProvider i18n={i18next}>
        <NavigationMenu />
      </I18nextProvider>
    )
  })

  it('expected links should be rendered', (): void => {
    cy.get('[data-testid="navigation-menu.logo"]').should('exist')
    cy.get('[data-testid="navigation-menu.home"]').should('exist')
  })

  it('2 flags should be rendered for the LanguageSelector', (): void => {
    cy.get('img[data-testid="es-ES"]').should('exist')
    cy.get('img[data-testid="en-EN"]').should('exist')
  })
})
