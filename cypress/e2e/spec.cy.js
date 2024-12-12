/* eslint-disable */
/// <reference types="cypress" />

const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  user_metadata: {
    avatar_url: 'https://github.com/avatar.png',
    email: 'test@example.com',
    email_verified: true,
    full_name: 'Test User',
    iss: 'https://api.github.com',
    preferred_username: 'testuser',
    provider_id: '12345',
    sub: 'test-user-id'
  },
  app_metadata: {
    provider: 'github',
    providers: ['github']
  },
  aud: 'authenticated',
  role: 'authenticated'
};

const mockSession = {
  access_token: 'fake-access-token',
  refresh_token: 'fake-refresh-token',
  expires_in: 3600,
  expires_at: Date.now() + 3600000,
  token_type: 'bearer',
  user: mockUser
};

const mockTasks = [
  {
    id: 1,
    title: 'Test Task',
    priority: 'high',
    date: '2024-12-31',
    tags: ['test'],
    description: 'Test description'
  }
];

describe('Home Page', () => {
  beforeEach(() => {
    // Mock the auth service
    const mockAuthService = {
      subscribeToAuthChanges: cy.stub().callsFake((callback) => {
        callback('SIGNED_IN', mockUser);
      }),
      getGithubData: cy.stub().returns(mockUser)
    };

    // Mock the TaskStore
    const mockTaskStore = {
      getAllTasks: () => mockTasks,
      createTask: cy.stub(),
      updateTask: cy.stub(),
      deleteTask: cy.stub()
    };

    // Intercept and stub module imports
    cy.intercept('GET', '**/auth.js', {
      body: `export const authService = ${JSON.stringify(mockAuthService)};`
    });

    cy.intercept('GET', '**/task/crud.js', {
      body: `export default ${JSON.stringify(mockTaskStore)};`
    });

    cy.visit('/');
  });

  it('should load the home page with task items', () => {
    // Check URL
    cy.url().should('not.include', '/login');
  });

  // Add more test cases for edit, delete, complete actions
});