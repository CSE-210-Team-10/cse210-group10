/* eslint-disable */
describe('Authentication and Navigation Tests', () => {
  beforeEach(() => {
    cy.clearAllCookies();
    cy.clearLocalStorage();
    
    cy.visit('/login');
    cy.get('button').contains('Continue with GitHub').click();

    // Handle GitHub login
    cy.origin('https://github.com', () => {
      cy.get('input[name="login"]').type(Cypress.env('GITHUB_TEST_USERNAME'));
      cy.get('input[name="password"]').type(Cypress.env('GITHUB_TEST_PASSWORD'));
      cy.get('input[type="submit"]').click();
      
      // If 2FA is enabled, you might need additional handling here
    });

  });

  it('should complete authentication flow', () => {
    // After callback, should redirect to main page
    cy.url().should('eq', 'http://localhost:3000/#');
  });
});
/* eslint-enable */