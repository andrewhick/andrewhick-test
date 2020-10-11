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

### Axe

[Tim Deschryver's tutorial](https://timdeschryver.dev/blog/setting-up-cypress-with-axe-for-accessibility)

1. `npm i --save-development axe-core cypress-axe`
2. Add `import 'cypress-axe'` to `support/index.js`
3. Add `cy.injectAxe()` after page load
4. Add `cy.checkA11y()`

### Example test

```
describe('Home', () => {
  it('should be accessible', () => {
    cy.visit('/')
    cy.injectAxe()
    cy.checkA11y()
  })
})
```

## Error messages

### Refused to evaluate a string as JavaScript because 'unsafe-eval' is not an allowed source of script in the following Content Security Policy directive: "script-src 'self' 'unsafe-inline'".

Doesn't work on andrewhick.com. Something to do with the server security policy?

### 1 accessibility violation was detected: expected 1 to equal 0

I _think_ this just means 

[Axe bug logged and closed for '1=0' error](https://github.com/avanslaars/cypress-axe/issues/34)

Found when testing a gov.uk page. These did not help me:


https://github.com/avanslaars/cypress-axe#using-the-violationcallback-argument

