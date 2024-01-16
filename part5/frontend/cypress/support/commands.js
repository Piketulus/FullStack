Cypress.Commands.add('login', ({ username, password }) => {
  cy.get('#username').type(username)
  cy.get('#password').type(password)
  cy.get('#login-button').click()
})

Cypress.Commands.add('addBlog', ({ title, author, url }) => {
  cy.get('#new-blog-button').click()
  cy.get('#title').type(title)
  cy.get('#author').type(author)
  cy.get('#url').type(url)
  cy.get('#submitBlog').click()
})