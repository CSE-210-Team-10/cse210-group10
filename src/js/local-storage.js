import { PROVIDER_TOKEN_KEY } from './const.js';
import { isProviderTokenValid } from './github-api.js';

/**
 * Validates and sets the provider token in localStorage
 * @param { string } token - The provider token to validate and store
 * @returns { Promise<boolean> } - Returns true if token is valid and was set, false otherwise
 * @private
 */
export async function setProviderToken(token) {
  try {
    if (!token) return false;

    const isTokenValid = await isProviderTokenValid(token);
    console.log(isTokenValid);
    if (!isTokenValid) return false;

    localStorage.setItem(PROVIDER_TOKEN_KEY, token);
    return true;
  } catch (error) {
    console.error('Error setting provider token:', error);
    return false;
  }
}

/**
 * Remove Provider Token from localStorage
 */
export function removeProviderToken() {
  localStorage.removeItem(PROVIDER_TOKEN_KEY);
}

/**
 * Get Provider Token from localStorage
 * @returns Provider Token from localStorage
 */
export function getProviderToken() {
  return localStorage.getItem(PROVIDER_TOKEN_KEY);
}
