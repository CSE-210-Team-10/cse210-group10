describe('Authentication Tests', () => {
  beforeEach(() => {
    // Mock Supabase OAuth sign-in
    cy.intercept('POST', '*/auth/v1/authorize', {
      statusCode: 200,
      body: {
        url: 'http://localhost:3000/callback',
        provider: 'github',
        access_token: 'mock-access-token'
      }
    }).as('supabaseAuth');
  
    // Mock Supabase session
    cy.intercept('GET', '*/auth/v1/session', {
      statusCode: 200,
      body: {
        user: {
          id: 'test-id',
          app_metadata: {
            provider: 'github'
          },
          user_metadata: {
            user_name: 'Yuxuan-Wu-test',
            avatar_url: 'https://github.com/test-image.jpg',
            email: 'charleslele2002-test@gmail.com'
          }
        },
        session: {
          access_token: 'mock-access-token',
          provider_token: 'mock-github-token',
          expires_in: 3600
        }
      }
    }).as('getSession');
  
    // Mock the OAuth callback
    cy.intercept('POST', '*/auth/v1/token?grant_type=provider_token', {
      statusCode: 200,
      body: {
        access_token: 'mock-access-token',
        provider_token: 'mock-github-token',
        user: {
          id: 'test-id',
          app_metadata: {
            provider: 'github'
          },
          user_metadata: {
            user_name: 'Yuxuan-Wu-test',
            avatar_url: 'https://github.com/test-image.jpg',
            email: 'charleslele2002-test@gmail.com'
          }
        }
      }
    }).as('supabaseCallback');
  });
  
  it('can sign in with GitHub', () => {
    cy.visit('/login');
    cy.get('#loginButton').click();
  
    // Wait for Supabase auth flow
    cy.wait('@supabaseAuth');
      
    // Simulate callback redirect
    cy.visit('/callback#access_token=mock-token&provider_token=mock-github-token');
      
    cy.wait('@supabaseCallback');
    cy.wait('@getSession');
  
    // Assert successful login
    cy.url().should('eq', 'http://localhost:3000/');
  });
  
  it('maintains session after login', () => {
    // Set up local storage to simulate logged-in state
    cy.window().then((win) => {
      win.localStorage.setItem('sb-provider-token', 'mock-github-token');
      win.localStorage.setItem('supabase.auth.token', JSON.stringify({
        access_token: 'mock-access-token',
        provider_token: 'mock-github-token'
      }));
    });
  
    cy.visit('/');
  });
});