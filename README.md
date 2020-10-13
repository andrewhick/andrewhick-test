# andrewhick.com test suite

Cypress and Axe proof of concept with andrewhick.com

This test suite uses [Cypress](https://www.cypress.io/) and [Axe](https://www.deque.com/axe/) to test [andrewhick.com](https://www.andrewhick.com) for accessibility. This README goes through the steps to run these tests, and to set up a brand new test suite from scratch.

It assumes that you have a basic knowledge of:

* Cypress
* Terminal / command prompt
* GitHub
* Node Package Manager (npm)

## Install and run this test suite

1. Clone this repository to your local machine and navigate to the folder in terminal:

```bash
git clone https://github.com/andrewhick/andrewhick-test.git && cd andrewhick-test
```

2. `npm install`
3. `npx cypress open` to open the Cypress test window
4. `npx cypress run` to run from command line instead (best for Axe)

## How to set up a brand new Cypress project with Axe

This guide covers how to set up a new project from scratch.

### Example 'Hello world' test

This is the simplest possible test once your test suite is set up. It flags a full set of accessibility rules and does not provide detailed output to the terminal, just the number of violations on failure.

```javascript
describe('Hello world', () => {
  it('should be accessible', () => {
    cy.visit('/')
    cy.injectAxe()
    cy.checkA11y()
  })
})
```

### Set up Git

Skip this section if you are not interested in publishing your repository to GitHub.

[Karl Broman's tutorial](https://kbroman.org/github_tutorial/pages/init.html)

1. Set up a new folder on your machine and navigate to it. The folder name will become your GitHub repository's name, so choose wisely.
2. Add a README.md file
3. `git init`
4. `git checkout -b main`
5. `git add .`
6. `git commit am "First commit"`
7. `git remote add origin https://github.com/andrewhick/andrewhick-test.git` (replace this with your GitHub username and test repository name)
5. `git push -u origin main`

### Install Cypress

[Cypress installation instructions](https://docs.cypress.io/guides/getting-started/installing-cypress.html#npm-install)

1. `npm install`
2. `npm init`
3. `npm install cypress --save-dev`
4. `npx cypress open` - this creates the folder structure the first time it is run, containing example tests.
5. Run test from command line using `npx cypress run`
6. Update cypress.json to include your base URL, set a default timeout, and prevent tests running every time tests are updated, to prevent unnecessary noise:

```json
    "baseUrl" : "https://www.andrewhick.com",
    "defaultCommandTimeout" : 5000,
    "watchForFileChanges": false
```

### Install and set up Axe

Based on [Tim Deschryver's tutorial](https://timdeschryver.dev/blog/setting-up-cypress-with-axe-for-accessibility) plus extra information as needed.

1. `npm i --save-development axe-core cypress-axe` installs the two main components
2. Add `import 'cypress-axe'` to `support/index.js`
3. Add `cy.injectAxe()` to the test after page load
4. Add `cy.checkA11y()` when you want to test the page
5. Add a [violation callback](https://github.com/avanslaars/cypress-axe#using-the-violationcallback-argument) to give meaningful information in terminal
6. Ask Axe to [only flag the rules you want to test against](https://www.npmjs.com/package/cypress-axe#cychecka11y), such as WCAG v2.1 levels A and AA

```javascript
    // Checks for accessibility against WCAG 2.1 A and AA, and outputs a meaningful response back to the terminal
    cy.checkA11y(
      null,
      {
        runOnly: {
          type: 'tag',
          values: ['wcag21a', 'wcag21aa']
        }
      },
      terminalLog
    )
```

By this stage you should hopefully have a basic, working test suite. Run it with `npx cypress run` and check the outputs.

## Pitfalls

### 1 accessibility violation was detected: expected 1 to equal 0

This just means the number of accessibility issues was 1 but should have been 0.

To make Axe produce a more meaningful report in the terminal you can use the [violation callback](https://github.com/avanslaars/cypress-axe#using-the-violationcallback-argument).

I changed this by adding it as a custom command into `support/commands.js`, and calling it back from `cy.checkA11y` as `cy.terminalLog`.

This is what a report looks like:
```
┌─────────┬─────────────────────┬────────────┬─────────────────────────────────────────────────────────────────────────────────────────────────────────────┬───────┐
│ (index) │         id          │   impact   │                                                 description                                                 │ nodes │
├─────────┼─────────────────────┼────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────┼───────┤
│    0    │ 'landmark-one-main' │ 'moderate' │ 'Ensures the document has only one main landmark and each iframe in the page has at most one main landmark' │   1   │
│    1    │      'region'       │ 'moderate' │                            'Ensures all page content is contained by landmarks'                             │   1   │
└─────────┴─────────────────────┴────────────┴─────────────────────────────────────────────────────────────────────────────────────────────────────────────┴───────┘
```

[Axe bug logged and closed for '1=0' error](https://github.com/avanslaars/cypress-axe/issues/34) (someone else had the same issue as me and didn't understand the output)

### Refused to evaluate a string as JavaScript because 'unsafe-eval' is not an allowed source of script in the following Content Security Policy directive: "script-src 'self' 'unsafe-inline'".

This occurred because Cypress did not recognise the Content Security Policy (CSP) I'd set in the meta tags on my website. Instead they need to be set at server level.

Based on [advice when I asked about it on StackOverflow](https://stackoverflow.com/questions/64306273/cypress-and-axe-seem-to-ignore-content-security-policy), I decided to comment out the CSP meta tag on my website and the tests ran again.

### Non-WCAG rules were still included in scope

I tried setting rules to only test for WCAG 2.1 A and AA as follows:

```javascript
    // Tags were not successfully applied:
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

But this still seemed to flag up landmark violations, which aren't part of WCAG 2.1 A/AA. I don't know why yet, but I found another solution which worked:

Instead, skipping the configureAxe step and applying the config directly to `cy.checkA11y()` worked for me:

```javascript
    // This worked and only flagged WCAG rules:
    cy.checkA11y(
      null,
      {
        runOnly: {
          type: 'tag',
          values: ['wcag21a', 'wcag21aa']
        }
      },
      terminalLog
    )
```

## Useful links

* [Documentation on cy.checkA11y()](https://www.npmjs.com/package/cypress-axe#cychecka11y)
* [NPM documentation on cypress-axe](https://www.npmjs.com/package/cypress-axe)
* [Axe rules configuration](https://www.deque.com/axe/core-documentation/api-documentation/#parameters-1)
* [List of available rules tags](https://www.deque.com/axe/core-documentation/api-documentation/#axe-core-tags)
* [Example config](https://dev.to/aaronktberry/a11y-testing-web-apps-with-axe-core-150d) (not yet used successfully!)
* [Documentation on axe.configure](https://www.deque.com/axe/core-documentation/api-documentation/#api-name-axeconfigure) (not yet used successfully!)
