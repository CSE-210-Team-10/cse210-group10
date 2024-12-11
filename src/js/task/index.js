/**
 * @typedef { object } Task
 * @property { number } id - Unique identifier for the task
 * @property { 'issue' | 'pr' | 'personal' } type - Type of the task (can be issue, pr, or personal)
 * @property { string } title - Title of the task
 * @property { boolean } done - Whether the task is done or not
 * @property { Date } dueDate - due date of the task
 * @property { string } description - Description/body content of the task
 * @property { string } url - GitHub API URL for the task
 * @property { 'high' | 'low' | 'medium' } priority - Priority of the task
 * @property { string[] } tags - A list of tags associated to the task
 */

export {};
