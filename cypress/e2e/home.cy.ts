describe('Home', (): void => {
  beforeEach((): void => {
    cy.visit('/')
  })

  afterEach((): void => {
    cy.url().should('match', /\/$/)
  })

  it('root elements should be there', (): void => {
    cy.get('h1[data-testid="home.real-time-measurements"]').should('have.text', 'Real-time measurements')
  })

  it('clicking on the logo goes to the home', (): void => {
    cy.get('[data-testid="navigation-menu.logo"]').click()
  })

  it('clicking on Home menu option goes to the home', (): void => {
    cy.get('[data-testid="navigation-menu.home"]').click()
  })

  it('clicking on the Spanish icon language is changed to Spanish', (): void => {
    cy.get('img[data-testid="es-ES"]').click()
    cy.get('h1[data-testid="home.real-time-measurements"]').should('have.text', 'Mediciones en tiempo real')
  })
})
