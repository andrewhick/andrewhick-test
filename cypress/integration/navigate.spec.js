/// <reference types="cypress" />

function terminalLog(violations) {
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

// Then in your test...
it('Logs violations to the terminal', () => {
  cy.checkA11y(null, null, terminalLog)
})

context('Navigation', () => {
  // beforeEach(() => {
  //   cy.visit('https://example.cypress.io')
  //   cy.get('.navbar-nav').contains('Commands').click()
  //   cy.get('.dropdown-menu').contains('Navigation').click()
  // })

  it('navigates each page and checks for accessibility', () => {
    cy.visit('/')

    // cy.get('title').should('contain', 'Andrew Hick - test and accessible design person')
    // cy.get('h2').first().should('contain', 'Recent things')
    cy.injectAxe()
    cy.checkA11y(null, null, terminalLog)

    // // search for an exemption and click Edit
    // cy.get('#term').type('waste')
    // cy.get('[name="commit"]').click()
    // cy.get('.heading-large').should('contain', 'dashboard')
    // cy.contains('View details').first().click()    
    // cy.get('.heading-large').should('contain', 'Registration details')
    // cy.contains('Edit').first().click()
    // cy.get('.heading-large').should('contain', 'Edit')

    // // update operator name
    // cy.get('[href*="operator_name"').click()
    // var newName = 'Cypress waste name edit ' + Math.floor(Math.random() * 1000000).toString()
    // cy.get('#operator_name_form_operator_name').clear().type(newName)
    // cy.get('[value="Continue"]').click()

    // // submit declaration
    // cy.get('[value="Continue"]').click()
    // cy.get('#content').should('contain', 'You can be prosecuted')
    // cy.get('#declaration_form_declaration').click()
    // cy.get('[value="Continue"]').click()  
    // cy.contains('View registration').click()
  
  })
})
