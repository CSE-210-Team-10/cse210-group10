import { filterTasksByType, filterTasksByStatus, filterTasksByCreationTime } from '../src/utils/task-filtering';
import mockTasks from '../src/mock/mock-tasks.json';

describe('Task Filtering Functions', () => {
  const { tasks } = mockTasks;

  describe('filterTasksByType', () => {
    test('should return only issues', () => {
      const issues = filterTasksByType(tasks, 'issue');
      expect(issues.length).toBeGreaterThan(0);
      issues.forEach(task => {
        expect(task.type).toBe('issue');
      });
    });

    test('should return only pull requests', () => {
      const prs = filterTasksByType(tasks, 'pull_request');
      expect(prs.length).toBeGreaterThan(0);
      prs.forEach(task => {
        expect(task.type).toBe('pull_request');
      });
    });

    test('should return empty array for non-existent type', () => {
      const result = filterTasksByType(tasks, 'nonexistent');
      expect(result).toHaveLength(0);
    });
  });

  describe('filterTasksByStatus', () => {
    test('should return only open tasks', () => {
      const openTasks = filterTasksByStatus(tasks, 'open');
      expect(openTasks.length).toBeGreaterThan(0);
      openTasks.forEach(task => {
        expect(task.status).toBe('open');
      });
    });

    test('should return only closed tasks', () => {
      const closedTasks = filterTasksByStatus(tasks, 'closed');
      expect(closedTasks.length).toBeGreaterThan(0);
      closedTasks.forEach(task => {
        expect(task.status).toBe('closed');
      });
    });

    test('should return empty array for non-existent status', () => {
      const result = filterTasksByStatus(tasks, 'nonexistent');
      expect(result).toHaveLength(0);
    });
  });

  describe('filterTasksByCreationTime', () => {
    const testDate = '2024-11-24T03:21:13Z';
    
    test('should return tasks created before specified date', () => {
      const olderTasks = filterTasksByCreationTime(tasks, testDate, 'before');
      olderTasks.forEach(task => {
        const taskTime = new Date(task.createdAt).getTime();
        const compareTime = new Date(testDate).getTime();
        expect(taskTime).toBeLessThan(compareTime);
      });
    });
  
    test('should return tasks created after specified date', () => {
      const newerTasks = filterTasksByCreationTime(tasks, testDate, 'after');
      newerTasks.forEach(task => {
        const taskTime = new Date(task.createdAt).getTime();
        const compareTime = new Date(testDate).getTime();
        expect(taskTime).toBeGreaterThan(compareTime);
      });
    });
  
    test('should return tasks created on specified date', () => {
      const tasksOnDate = filterTasksByCreationTime(tasks, testDate, 'on');
      tasksOnDate.forEach(task => {
        const taskDay = new Date(task.createdAt).toDateString();
        const compareDay = new Date(testDate).toDateString();
        expect(taskDay).toBe(compareDay);
      });
    });
  
    test('should return all tasks for invalid operator', () => {
      const result = filterTasksByCreationTime(tasks, testDate, 'invalid');
      expect(result).toEqual(tasks);
    });
  
    test('should use "on" as default operator', () => {
      const defaultResult = filterTasksByCreationTime(tasks, testDate);
      const onResult = filterTasksByCreationTime(tasks, testDate, 'on');
      expect(defaultResult).toEqual(onResult);
    });
  });
});