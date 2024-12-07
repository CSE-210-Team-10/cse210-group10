import { createClient } from 'https://esm.sh/@supabase/supabase-js';

import { supabaseUrl, supabaseAnonKey } from './supabase.js';
import {
  getProviderToken,
  setProviderToken,
  removeProviderToken,
} from './local-storage.js';

/** @typedef { import('@supabase/supabase-js').User } User */
/** @typedef { import('@supabase/supabase-js').AuthError } AuthError */
/** @typedef { import('@supabase/supabase-js').SupabaseClient } SupabaseClient */
/**
 * @typedef { object } UserData
 * @property { string } username - User's username
 * @property { string } avatarUrl - an URL to the user's avatar image
 * @property { string } accessToken - a token to access user's github data
 */

/**
 * Create a dynamic redirect URL after a successful login
 * @returns { string } redirect URL
 */
function getDynamicRedirectUrl() {
  const { protocol, host } = window.location;
  return `${protocol}//${host}/`;
}

/**
 * This is a singleton class that handles authentication. It should be only imported once for each page maximum.
 * @class
 */
class AuthService {
  /** @type { SupabaseClient } */
  supabase;

  /** @type { User | null } */
  user;

  /** @type { Set<function(string, UserData | null): void> } */
  authStateSubscribers;

  /**
   * A constructor that initializes default values of user and providerToken.
   * @constructor
   */
  constructor() {
    this.supabase = createClient(supabaseUrl, supabaseAnonKey);
    this.user = null;
    this.authStateSubscribers = new Set();

    this.supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        this.user = session.user;

        if (session.provider_token) {
          const success = await setProviderToken(session.provider_token);

          if (!success) {
            this.user = null;
            removeProviderToken();
          }
        }
      }

      if (event === 'SIGNED_OUT') {
        this.user = null;
        removeProviderToken();
      }

      this.notifySubscribers(event);
    });
  }

  /**
   * Sign in user with GitHub OAuth
   * @returns { Promise<string> } redirect URL
   * @throws { AuthError } If there's an error during login
   */
  async login() {
    try {
      const url = getDynamicRedirectUrl();
      const { data, error } = await this.supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: url,
          scopes: [
            'read:user',
            'user:email',
            'repo', // Access to private repositories
            'public_repo', // Access to public repositories
            'repo:status', // Access to commit status
            'read:org', // Read org and team membership
            'read:discussion', // Access to discussions
            'read:project', // Access to projects
          ].join(' '),
        },
      });

      if (error) throw error;

      return data.url;
    } catch (error) {
      console.error('Login error:', error.message);
      throw error;
    }
  }

  /**
   * Sign out the current user from Supabase authentication
   * @throws { Error } If there's an error during logout
   * @returns { Promise<void> }
   */
  async logout() {
    try {
      const { error } = await this.supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Logout error:', error.message);
      throw error;
    }
  }

  /**
   * Check if there is a currently authenticated user
   * @returns { boolean } True if user is logged in, false otherwise
   */
  isLoggedIn() {
    return !!this.user;
  }

  /**
   * Get the currently authenticated user
   * @returns { User | null } The current user object or null if not authenticated
   */
  getCurrentUser() {
    return this.user;
  }

  /**
   * Get GitHub-specific user data from the authenticated user's metadata
   * @returns { UserData | null } Object containing GitHub username, avatar URL and access token, or null if no user data
   */
  getGithubData() {
    if (!this.user || !this.user.user_metadata) {
      return null;
    }

    return {
      username: this.user.user_metadata.user_name,
      avatarUrl: this.user.user_metadata.avatar_url,
      accessToken: getProviderToken(),
    };
  }

  /**
   * Subscribe to authentication state changes
   * @param { function(string, UserData | null): void } callback - Function to be called when auth state changes
   * @returns { function(): void } Unsubscribe function to remove the listener
   */
  subscribeToAuthChanges(callback) {
    this.authStateSubscribers.add(callback);
    return () => this.authStateSubscribers.delete(callback);
  }

  /**
   * Notify all subscribers about an authentication state change
   * @param { string } event - The auth event type that occurred
   * @private
   */
  notifySubscribers(event) {
    const userData = this.getGithubData();
    this.authStateSubscribers.forEach(callback => {
      callback(event, userData);
    });
  }
}

// Export as singleton to ensure single instance across app
export const authService = new AuthService();
