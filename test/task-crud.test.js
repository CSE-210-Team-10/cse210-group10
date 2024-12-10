import { 
    createTask, 
    getTask, 
    getAllTasks, 
    updateTask, 
    deleteTask 
} from '../src/utils/crud.js';

// Mock localStorage
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

// Import mock tasks
const mockTasks = require('../src/mock/mock-personal-tasks.json').tasks;

describe('Task Management Module', () => {
  beforeEach(() => {
    localStorageMock.clear();
    // Preload mock tasks into localStorage
    localStorageMock.setItem('byteboard_tasks', JSON.stringify(mockTasks));
  });

  describe('getAllTasks', () => {
    test('should return all tasks with parsed dates', () => {
      const tasks = getAllTasks();
      expect(tasks.length).toBe(mockTasks.length);
      tasks.forEach((task, index) => {
        expect(task.id).toBe(mockTasks[index].id);
        expect(task.dueDate).toBeInstanceOf(Date);
      });
    });
  });

  describe('getTask', () => {
    test('should return a task by ID', () => {
      const task = getTask(1); // First task in mock data
      expect(task).toEqual({
        ...mockTasks[0],
        dueDate: new Date(mockTasks[0].dueDate),
      });
    });

    test('should return undefined for a non-existent task ID', () => {
      const task = getTask(999);
      expect(task).toBeUndefined();
    });
  });

  describe('createTask', () => {
    const newTaskData = {
      title: 'New Test Task',
      type: 'personal',
      done: false,
      dueDate: '2024-05-01',
      tags: ['test', 'new']
    };

    test('should create a new task with a unique ID', () => {
      const newTask = createTask(newTaskData);
      expect(newTask.id).toBe(mockTasks.length + 1);
      expect(newTask.title).toBe(newTaskData.title);
    });

    test('should throw an error for invalid task data', () => {
      const invalidTask = { ...newTaskData, type: 'invalid-type' };
      expect(() => createTask(invalidTask)).toThrow('Task must have a valid type: issue, pr, or personal');
    });
  });

  describe('updateTask', () => {
    test('should update an existing task', () => {
      const updatedTask = updateTask(1, { title: 'Updated Title', done: true });
      expect(updatedTask.title).toBe('Updated Title');
      expect(updatedTask.done).toBe(true);
    });

    test('should return undefined for a non-existent task ID', () => {
      const result = updateTask(999, { title: 'Non-existent Task' });
      expect(result).toBeUndefined();
    });

    test('should validate the updated task properties', () => {
      expect(() => updateTask(1, { dueDate: 'invalid-date' })).toThrow('Task must have a valid due date');
    });
  });

  describe('deleteTask', () => {
    test('should delete an existing task', () => {
      const deleteResult = deleteTask(1); // First task in mock data
      expect(deleteResult).toBe(true);

      const tasksAfterDeletion = getAllTasks();
      expect(tasksAfterDeletion.length).toBe(mockTasks.length - 1);
      expect(tasksAfterDeletion.find(task => task.id === 1)).toBeUndefined();
    });

    test('should return false for a non-existent task ID', () => {
      const deleteResult = deleteTask(999);
      expect(deleteResult).toBe(false);
    });
  });

  describe('Integration Tests', () => {
    test('should handle full CRUD lifecycle', () => {
      // Create
      const newTask = createTask({
        title: 'Lifecycle Task',
        type: 'issue',
        done: false,
        dueDate: '2024-06-15',
        tags: ['lifecycle']
      });
      expect(newTask.id).toBe(mockTasks.length + 1);

      // Read
      const retrievedTask = getTask(newTask.id);
      expect(retrievedTask).toEqual({ ...newTask, dueDate: new Date('2024-06-15') });

      // Update
      const updatedTask = updateTask(newTask.id, { title: 'Updated Lifecycle Task' });
      expect(updatedTask.title).toBe('Updated Lifecycle Task');

      // Delete
      const deleteResult = deleteTask(newTask.id);
      expect(deleteResult).toBe(true);
      expect(getTask(newTask.id)).toBeUndefined();
    });
  });
});
