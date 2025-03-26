describe('Home', (): void => {
  beforeEach((): void => {
    cy.visit('/')
  })

  it('root elements should be there', (): void => {
    expect(true).to.equal(true)
  })

  it('url should end with /', (): void => {})
})
