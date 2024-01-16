describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'John Doe',
      username: 'John',
      password: 'Doe'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:5173')
  })

  it('Login form is shown', function() {
    cy.contains('login').click()
  })

  describe('Login', function() {

    it('user can login', function () {
      cy.contains('login').click()
      cy.get('#username').type('John')
      cy.get('#password').type('Doe')
      cy.get('#login-button').click()
      cy.contains('Login successful')
    })

    it('login fails', function() {
      cy.contains('login').click()
      cy.get('#username').type('John')
      cy.get('#password').type('Snow')
      cy.get('#login-button').click()

      cy.get('.error').should('contain', 'Wrong credentials')
    })
  })

  describe('When logged in', function() {
    beforeEach( function () {
      cy.login({ username: 'John', password: 'Doe' })
    })

    it('A blog can be created', function() {
      cy.get('#new-blog-button').click()
      cy.get('#title').type('test')
      cy.get('#author').type('John')
      cy.get('#url').type('test.com')
      cy.get('#submitBlog').click()
      cy.contains('test')
      cy.contains('John')
    })

    describe('when a blog exists', function () {
      beforeEach( function () {
        cy.addBlog({ title: 'test blog', author: 'tester', url: 'test.com' })
      })

      it('a blog can be liked', function () {
        cy.get('#show-blog').click()
        cy.get('#like-blog-button').click()
        cy.contains('1')
      })

      it('a blog can be deleted', function () {
        cy.get('#show-blog').click()
        cy.get('#delete-blog-button').click()
        cy.get('html').should('not.contain', 'test blog')
      })

      it('only the creator can see the delete button of a blog', function () {
        cy.get('#logout-button').click()
        const newUser = {
          username: 'hacker',
          password: 'hacker'
        }
        cy.request('POST', 'http://localhost:3003/api/users/', newUser)
        cy.visit('http://localhost:5173')
        cy.login({ username: 'hacker', password: 'hacker' })
        cy.get('#show-blog').click()
        cy.get('#delete-blog-button').should('not.be.visible')
      })

      describe('with multiple blogs', function () {
        beforeEach( function () {
          cy.addBlog({ title: 'test blog 2', author: 'tester', url: 'test.com' })
        })

        it('blogs are ordered by likes', function () {
          cy.get('#show-blog').click()
          cy.get('#show-blog').click()
          cy.get('#hide-blog-button').click()
          cy.get('#like-blog-button').click()
          cy.get('#hide-blog-button').click()

          cy.get('[data-testid="blog-info"]').eq(0).should('contain', 'test blog 2')
          cy.get('[data-testid="blog-info"]').eq(1).should('contain', 'test blog')
        })
      })
    })
  })
})