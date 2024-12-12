import { jest } from '@jest/globals';
import {
  createTask,
  getTask,
  getAllTasks,
  updateTask,
  deleteTask
} from '../src/js/task/crud.js';
import mockTasks from '../src/mock/mock-personal-tasks.json';

/**
 * Test suite for Task Management Functions
 * @group Task Management
 */
describe('Task Management Module', () => {
  const { tasks } = mockTasks;

  // Setup a mock local storage to run tests on
  const localStorageMock = (() => {
    let store = {};
    return {
      getItem: jest.fn(key => store[key] || null),
      setItem: jest.fn((key, value) => {
        store[key] = value.toString();
      }),
      clear: jest.fn(() => {
        store = {};
      }),
      removeItem: jest.fn(key => {
        delete store[key];
      })
    };
  })();

  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
  });

  /**
   * Test suite for createTask function
   * @group Task Creation
   */
  describe('createTask', () => {
    const createMockTaskData = {
      title: 'New Test Task',
      type: 'personal',
      done: false,
      dueDate: new Date('2024-12-31'),
      tags: ['test'],
      priority: 'low'
    };

    beforeEach(() => {
      localStorageMock.clear();
      // Populate localStorage with initial tasks for consistent testing
      localStorage.setItem('personal_tasks', JSON.stringify(tasks));
    });

    /**
     * Verifies that a new task can be created with correct properties
     * @test
     */
    test('should create a new task with incremented ID', () => {
      const task = createTask(createMockTaskData);

      expect(task).toEqual(expect.objectContaining({
        id: expect.any(Number),
        title: 'New Test Task',
        type: 'personal',
        done: false,
        tags: ['test'],
        priority: 'low'
      }));
      expect(task.dueDate).toBeInstanceOf(Date);
    });

    /**
     * Verifies that task creation fails with invalid input
     * @test
     */
    test('should throw error for invalid task data', () => {
      const invalidTaskCases = [
        { ...createMockTaskData, title: null },
        { ...createMockTaskData, type: 'invalid' },
        { ...createMockTaskData, done: 'not a boolean' },
        { ...createMockTaskData, dueDate: 'invalid date' },
        { ...createMockTaskData, tags: 'not an array' },
        { ...createMockTaskData, priority: 'invalid' }
      ];

      invalidTaskCases.forEach(invalidTask => {
        expect(() => createTask(invalidTask)).toThrow();
      });
    });
  });

  /**
   * Test suite for getAllTasks function
   * @group Task Retrieval
   */
  describe('getAllTasks', () => {
    beforeEach(() => {
      localStorageMock.clear();
      localStorage.setItem('personal_tasks', JSON.stringify(tasks));
    });

    /**
     * Verifies that all tasks are retrieved with parsed dates
     * @test
     */
    test('should return all tasks with parsed dates', () => {
      const retrievedTasks = getAllTasks();

      expect(retrievedTasks.length).toBe(tasks.length);
      retrievedTasks.forEach(task => {
        expect(task.dueDate).toBeInstanceOf(Date);
      });
    });

    /**
     * Verifies that an empty array is returned when no tasks exist
     * @test
     */
    test('should return an empty array when no tasks exist', () => {
      localStorageMock.clear();
      const retrievedTasks = getAllTasks();

      expect(retrievedTasks).toHaveLength(0);
    });
  });

  /**
   * Test suite for getTask function
   * @group Task Retrieval
   */
  describe('getTask', () => {
    beforeEach(() => {
      localStorageMock.clear();
      localStorage.setItem('personal_tasks', JSON.stringify(tasks));
    });

    /**
     * Verifies that a specific task can be retrieved by ID
     * @test
     */
    test('should retrieve a specific task by ID', () => {
      const firstTaskId = tasks[0].id;
      const task = getTask(firstTaskId);

      expect(task).toEqual(expect.objectContaining({
        id: firstTaskId,
        title: tasks[0].title
      }));
    });

    /**
     * Verifies that undefined is returned for non-existent task
     * @test
     */
    test('should return undefined for non-existent task', () => {
      const task = getTask(999);

      expect(task).toBeUndefined();
    });
  });

  /**
   * Test suite for updateTask function
   * @group Task Update
   */
  describe('updateTask', () => {
    beforeEach(() => {
      localStorageMock.clear();
      localStorage.setItem('personal_tasks', JSON.stringify(tasks));
    });

    /**
     * Verifies that an existing task can be updated
     * @test
     */
    test('should update an existing task', () => {
      const firstTaskId = tasks[0].id;
      const updatedTask = updateTask(firstTaskId, {
        title: 'Updated Task Title',
        done: true
      });

      expect(updatedTask).toEqual(expect.objectContaining({
        id: firstTaskId,
        title: 'Updated Task Title',
        done: true
      }));
    });

    /**
     * Verifies that update fails with invalid data
     * @test
     */
    test('should throw error when updating with invalid data', () => {
      const firstTaskId = tasks[0].id;

      expect(() => updateTask(firstTaskId, { type: 'invalid' })).toThrow();
    });

    /**
     * Verifies that updating a non-existent task returns undefined
     * @test
     */
    test('should return undefined for non-existent task', () => {
      const result = updateTask(999, { title: 'Test Update' });

      expect(result).toBeUndefined();
    });
  });

  /**
   * Test suite for deleteTask function
   * @group Task Deletion
   */
  describe('deleteTask', () => {
    beforeEach(() => {
      localStorageMock.clear();
      localStorage.setItem('personal_tasks', JSON.stringify(tasks));
    });

    /**
     * Verifies that an existing task can be deleted
     * @test
     */
    test('should delete an existing task', () => {
      const firstTaskId = tasks[0].id;
      const deleteResult = deleteTask(firstTaskId);

      expect(deleteResult).toBe(true);

      const remainingTasks = getAllTasks();
      expect(remainingTasks).toHaveLength(tasks.length - 1);
      expect(remainingTasks.some(task => task.id === firstTaskId)).toBe(false);
    });

    /**
     * Verifies that deleting a non-existent task returns false
     * @test
     */
    test('should return false when deleting non-existent task', () => {
      const deleteResult = deleteTask(999);

      expect(deleteResult).toBe(false);

      const remainingTasks = getAllTasks();
      expect(remainingTasks).toHaveLength(tasks.length);
    });
  });
});