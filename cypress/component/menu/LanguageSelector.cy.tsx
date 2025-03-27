import React from 'react'
import LanguageSelector from '../../../src/components/menu/LanguageSelector'

describe('<LanguageSelector />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<LanguageSelector />)
  })
})
