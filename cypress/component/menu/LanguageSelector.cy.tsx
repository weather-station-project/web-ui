import React from 'react'
import LanguageSelector from '../../../src/components/menu/LanguageSelector'
import { I18nextProvider } from 'react-i18next'
import i18next from '../../../src/helpers/i18next'

describe('LanguageSelector', (): void => {
  beforeEach((): void => {
    cy.stub(i18next, 'changeLanguage').as('changeLanguage').resolves()

    cy.mount(
      <I18nextProvider i18n={i18next}>
        <LanguageSelector />
      </I18nextProvider>
    )
  })

  it('2 flags should be rendered', (): void => {
    cy.get('img[data-testid="es-ES"]').should('exist')
    cy.get('img[data-testid="en-EN"]').should('exist')
  })

  it('should change language to Spanish when Spanish flag is clicked', (): void => {
    cy.get('img[data-testid="es-ES"]').click()
    cy.get('@changeLanguage').should('have.been.calledWith', 'es-ES')
  })

  it('should change language to English when English flag is clicked', (): void => {
    cy.get('img[data-testid="en-EN"]').click()
    cy.get('@changeLanguage').should('have.been.calledWith', 'en-EN')
  })
})
