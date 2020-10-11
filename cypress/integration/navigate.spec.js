/// <reference types="cypress" />

// Use a function to log output to the terminal as per:
// https://github.com/avanslaars/cypress-axe#using-the-violationcallback-argument

function terminalLog(violations) {
  // consider adding this into support instead
  cy.task(
    'log',
    `${violations.length} accessibility violation${
      violations.length === 1 ? '' : 's'
    } ${violations.length === 1 ? 'was' : 'were'} detected`
  )
  // pluck specific keys to keep the table readable
  const violationData = violations.map(
    ({ id, impact, description, nodes }) => ({
      id,
      impact,
      description,
      nodes: nodes.length
    })
  )

  cy.task('table', violationData)
}

context('Navigation test', () => {

  it('navigates each page and checks for accessibility', () => {
    cy.visit('/')
    cy.get('title').should('contain', 'Andrew Hick - test and accessible design person')
    cy.get('h2').first().should('contain', 'Recent things')
    cy.injectAxe()
    cy.configureAxe({
      rules: [
        {
          id: 'WCAG 2.1 only',
          tags: ['wcag21a', 'wcag21aa'],
          disableOtherRules: true
        }
      ]
    })
    cy.checkA11y(null, null, terminalLog)

  })
})
