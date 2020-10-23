/// <reference types="cypress" />

// Use a function to log output to the terminal as per:
// https://github.com/avanslaars/cypress-axe#using-the-violationcallback-argument

context('Navigation test', () => {

  it('navigates pages and checks for accessibility', () => {

    // Home page
    cy.visit('/')
    cy.get('title').should('contain', 'Andrew Hick - test and accessible design person')
    cy.get('h2').first().should('contain', 'Recent things')
    cy.checkCustomA11y() // custom command - see /support/commands.js

    // Portfolio page
    cy.get('[alt="icon resembling p in braille"]').click()
    cy.get('title').should('contain', 'Andrew Hick | Professional portfolio')
    cy.get('h3').should('contain', 'Register as a waste carrier')
    cy.checkCustomA11y()

    // Design page
    cy.get('[href="../design/"]').first().click()
  })
})
