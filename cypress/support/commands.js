// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.on('uncaught:exception', (err, runnable) => {
        // returning false here prevents Cypress from
        // failing the test
        return false
    })

Cypress.Commands.add('terminalLog', (violations) => {
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
    })

Cypress.Commands.add('checkCustomA11y', () => {
    cy.injectAxe()
    cy.checkA11y(
        // checkA11y format based on examples of usage:
        // https://www.npmjs.com/package/cypress-axe#cychecka11y

        null,
        { // Specify that only WCAG 2.1 rules to levels A and AA will be tested for:
          runOnly: {
            type: 'tag',
            values: ['wcag21a', 'wcag21aa']
          }
        },
        cy.terminalLog
      )
})