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

const mockTasks = `
[
  {
    id: 1,
    type: 'personal',
    title: 'Fix navigation bug in header',
    done: false,
    dueDate: new Date('2024-12-20'),
    description: 'Navigation menu disappears when clicking on dropdown items. Steps to reproduce: 1. Click on dropdown 2. Select any item',
    url: 'https://api.github.com/repos/owner/repo/issues/1',
    priority: 'high',
    tags: ['bug', 'frontend']
  },
  {
    id: 2,
    type: 'personal',
    title: 'Add dark mode support',
    done: true,
    dueDate: new Date('2024-12-15'),
    description: 'Implements system-wide dark mode support using CSS variables and theme context',
    url: 'https://api.github.com/repos/owner/repo/pulls/2',
    priority: 'medium',
    tags: ['ui', 'theme']
  },
  {
    id: 3,
    type: 'personal',
    title: 'Review team documentation',
    done: false,
    dueDate: new Date('2024-12-31'),
    description: 'Go through onboarding docs and update outdated information',
    url: '',
    priority: 'low',
    tags: ['docs', 'team']
  },
  {
    id: 4,
    type: 'personal',
    title: 'Memory leak',
    done: false,
    dueDate: new Date('2024-12-18'),
    description: 'Memory usage increases over time when WebSocket connection is kept open. Need to properly dispose of event listeners.',
    url: 'https://api.github.com/repos/owner/repo/issues/4',
    priority: 'high',
    tags: ['bug']
  },
  {
    id: 5,
    type: 'personal',
    title: 'Upgrade dependencies',
    done: false,
    dueDate: new Date('2024-12-25'),
    description: 'Update all npm packages to their latest stable versions. Major version changes: React 18, TypeScript 5',
    url: 'https://api.github.com/repos/owner/repo/pulls/5',
    priority: 'medium',
    tags: ['maintenance']
  }
];
`

describe('Home Page', () => {
  beforeEach(() => {
    // Mock the auth service
    const mockAuthService = {
      subscribeToAuthChanges: cy.stub().callsFake((callback) => {
        callback('SIGNED_IN', mockUser);
      }),
      getGithubData: cy.stub().returns(mockUser)
    };

    const mockAuthServiceString = `{
      subscribeToAuthChanges: (callback) => {
        callback('SIGNED_IN', ${JSON.stringify(mockUser)});
        return () => {}; // Cleanup function
      },
      getGithubData: () => {return ${JSON.stringify(mockUser)};}
    }`;

    // Mock the TaskStore
    const mockTaskStore = {
      getAllTasks: () => mockTasks,
      createTask: cy.stub(),
      updateTask: cy.stub(),
      deleteTask: cy.stub()
    };

    // Intercept and stub module imports
    cy.intercept('GET', '**/auth.js', {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/javascript',
      },
      body: `export const authService = ${mockAuthServiceString};`
    });

    cy.intercept('GET', '**/task/crud.js', {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/javascript',
      },
      body: `
        const tasks = [];
        export const getAllTasks = () => tasks;
        export const createTasks = (task) => tasks.push({id: len(tasks), ...task});
        export default { getAllTasks, createTasks };
        `
    });

    cy.visit('/');
  });

  it('should load the home page with task items', () => {
    // Check URL
    cy.url().should('not.include', '/login');
  });

  // Add more test cases for edit, delete, complete actions

  /* ==== Test Created with Cypress Studio ==== */
  it('create task', function() {
    /* ==== Generated with Cypress Studio ==== */
    cy.get('#create-task-btn').click();
    cy.get('input[name="taskName"]', { includeShadowDom: true }).type('New Test Task');
    /* ==== End Cypress Studio ==== */
  });
});