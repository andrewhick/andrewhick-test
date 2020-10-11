# andrewhick.com test suite

Cypress and Axe proof of concept with andrewhick.com

## Setup

1. Clone this repository and navigate to the folder
2. `npm install`
3. `npx cypress open` to open the UI
4. `npx cypress run` to run from command line instead (best for Axe)

## Setting up a new Cypress project with Axe

### Git

[Karl Broman's tutorial](https://kbroman.org/github_tutorial/pages/init.html)

1. Set up a new folder on your machine and navigate to it
2. Add a README.md file
3. `git init`
4. `git checkout -b main`
5. `git add .`
6. `git commit am "First commit"`
7. `git remote add origin https://github.com/andrewhick/andrewhick-test.git`
5. `git push -u origin main`

### Cypress

[Cypress installation instructions](https://docs.cypress.io/guides/getting-started/installing-cypress.html#npm-install)

1. `npm install`
2. `npm init`
3. `npm install cypress --save-dev`
4. `npx cypress open`
5. Run test from command line using `npx cypress run`
6. Update cypress.json to include base URL and prevent tests running every time tests are updated, to prevent unnecessary noise:

```json
    "baseUrl" : "https://www.andrewhick.com",
    "defaultCommandTimeout" : 5000,
    "watchForFileChanges": false
```

### Axe

[Tim Deschryver's tutorial](https://timdeschryver.dev/blog/setting-up-cypress-with-axe-for-accessibility)

1. `npm i --save-development axe-core cypress-axe`
2. Add `import 'cypress-axe'` to `support/index.js`
3. Add `cy.injectAxe()` after page load
4. Add `cy.checkA11y()`
5. Add violation callback to give meaningful information in terminal
6. [Configure Axe for the rules you want to test against](https://www.deque.com/axe/core-documentation/api-documentation/#axe-core-tags)

```javascript
// Run this in every test:
cy.configureAxe({
  rules: [all("wcag21a", "wcag21aa")] // tests will fail if any 2.1A or 2.1AA tests fail
})
```

Supporting links:

* [Axe rules configuration](https://www.deque.com/axe/core-documentation/api-documentation/#parameters-1)
* [List of available rules tags](https://www.deque.com/axe/core-documentation/api-documentation/#axe-core-tags)

### Example test

```javascript
describe('Home', () => {
  it('should be accessible', () => {
    cy.visit('/')
    cy.injectAxe()
    cy.checkA11y()
  })
})
```

## Pitfalls (and how they were resolved)

### 1 accessibility violation was detected: expected 1 to equal 0

I _think_ this just means the number of accessibility issues was 1 but should have been 0.

To make Axe produce a more meaningful report in the terminal you can use the [violation callback](https://github.com/avanslaars/cypress-axe#using-the-violationcallback-argument).

This is what a report looks like:
```
┌─────────┬─────────────────────┬────────────┬─────────────────────────────────────────────────────────────────────────────────────────────────────────────┬───────┐
│ (index) │         id          │   impact   │                                                 description                                                 │ nodes │
├─────────┼─────────────────────┼────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────┼───────┤
│    0    │ 'landmark-one-main' │ 'moderate' │ 'Ensures the document has only one main landmark and each iframe in the page has at most one main landmark' │   1   │
│    1    │      'region'       │ 'moderate' │                            'Ensures all page content is contained by landmarks'                             │   1   │
└─────────┴─────────────────────┴────────────┴─────────────────────────────────────────────────────────────────────────────────────────────────────────────┴───────┘
```

[Axe bug logged and closed for '1=0' error](https://github.com/avanslaars/cypress-axe/issues/34)


https://github.com/avanslaars/cypress-axe#using-the-violationcallback-argument

### Refused to evaluate a string as JavaScript because 'unsafe-eval' is not an allowed source of script in the following Content Security Policy directive: "script-src 'self' 'unsafe-inline'".

The error message here seemed misleading. Although my site's Content Security Policy (CSP) didn't include 'unsafe-eval' I think this was actually failing for a different reason. I had forgotten to remove the following from my copy of the violation callback mentioned earlier:

```javascript
it('Logs violations to the terminal', () => {
  cy.checkA11y(null, null, terminalLog)
})
```

This then failed because it was checking accessibility on an empty site which hadn't been loaded yet.

### Can't set rules

I tried setting rules to only test for WCAG 2.1 A and AA as follows:

```javascript
    cy.configureAxe({
      rules: [
        {
          id: 'WCAG 2.1',
          tags: ['wcag21a', 'wcag21aa'],
          disableOtherRules: true
        }
      ]
    })
```

But when I did this I started getting the unsafe-eval error message again 😭😭😭

Supporting documentation:
* [Example config](https://dev.to/aaronktberry/a11y-testing-web-apps-with-axe-core-150d)
* [Documentation on axe.configure](https://www.deque.com/axe/core-documentation/api-documentation/#api-name-axeconfigure)