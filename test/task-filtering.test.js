import { filterTasksByType, filterTasksByStatus, filterTasksByCreationTime, sortTasksFromEarliest, sortTasksFromLatest } from '../src/utils/task-filtering';
import mockTasks from '../src/mock/mock-tasks.json';

describe('Task Filtering Functions', () => {
  const { tasks } = mockTasks;

  /**
   * Test suite for filterTasksByType function
   * @group Task Type Filtering
   */
  describe('filterTasksByType', () => {
    /**
     * Verifies that the function correctly filters tasks of type 'issue'
     * @test
     */
    test('should return only issues', () => {
      const issues = filterTasksByType(tasks, 'issue');
      expect(issues.length).toBeGreaterThan(0);
      issues.forEach(task => {
        expect(task.type).toBe('issue');
      });
    });

    /**
     * Verifies that the function correctly filters tasks of type 'pull_request'
     * @test
     */
    test('should return only pull requests', () => {
      const prs = filterTasksByType(tasks, 'pull_request');
      expect(prs.length).toBeGreaterThan(0);
      prs.forEach(task => {
        expect(task.type).toBe('pull_request');
      });
    });

    /**
     * Verifies that the function returns an empty array when filtering by a non-existent type
     * @test
     */
    test('should return empty array for non-existent type', () => {
      const result = filterTasksByType(tasks, 'nonexistent');
      expect(result).toHaveLength(0);
    });
  });

  /**
   * Test suite for filterTasksByStatus function
   * @group Task Status Filtering
   */
  describe('filterTasksByStatus', () => {
    /**
     * Verifies that the function correctly filters tasks with 'open' status
     * @test
     */
    test('should return only open tasks', () => {
      const openTasks = filterTasksByStatus(tasks, 'open');
      expect(openTasks.length).toBeGreaterThan(0);
      openTasks.forEach(task => {
        expect(task.status).toBe('open');
      });
    });

    /**
     * Verifies that the function correctly filters tasks with 'closed' status
     * @test
     */
    test('should return only closed tasks', () => {
      const closedTasks = filterTasksByStatus(tasks, 'closed');
      expect(closedTasks.length).toBeGreaterThan(0);
      closedTasks.forEach(task => {
        expect(task.status).toBe('closed');
      });
    });

    /**
     * Verifies that the function returns an empty array when filtering by a non-existent status
     * @test
     */
    test('should return empty array for non-existent status', () => {
      const result = filterTasksByStatus(tasks, 'nonexistent');
      expect(result).toHaveLength(0);
    });
  });

  /**
   * Test suite for filterTasksByCreationTime function
   * @group Task Creation Time Filtering
   */
  describe('filterTasksByCreationTime', () => {
    const testDate = '2024-11-24T03:21:13Z';
    
    /**
     * Verifies that the function correctly filters tasks created before the specified date
     * @test
     */
    test('should return tasks created before specified date', () => {
      const olderTasks = filterTasksByCreationTime(tasks, testDate, 'before');
      olderTasks.forEach(task => {
        const taskTime = new Date(task.createdAt).getTime();
        const compareTime = new Date(testDate).getTime();
        expect(taskTime).toBeLessThan(compareTime);
      });
    });
  
    /**
     * Verifies that the function correctly filters tasks created after the specified date
     * @test
     */
    test('should return tasks created after specified date', () => {
      const newerTasks = filterTasksByCreationTime(tasks, testDate, 'after');
      newerTasks.forEach(task => {
        const taskTime = new Date(task.createdAt).getTime();
        const compareTime = new Date(testDate).getTime();
        expect(taskTime).toBeGreaterThan(compareTime);
      });
    });
  
    /**
     * Verifies that the function correctly filters tasks created on the specified date
     * @test
     */
    test('should return tasks created on specified date', () => {
      const tasksOnDate = filterTasksByCreationTime(tasks, testDate, 'on');
      tasksOnDate.forEach(task => {
        const taskDay = new Date(task.createdAt).toDateString();
        const compareDay = new Date(testDate).toDateString();
        expect(taskDay).toBe(compareDay);
      });
    });
  
    /**
     * Verifies that the function returns all tasks when given an invalid operator
     * @test
     */
    test('should return all tasks for invalid operator', () => {
      const result = filterTasksByCreationTime(tasks, testDate, 'invalid');
      expect(result).toEqual(tasks);
    });
  
    /**
     * Verifies that the function uses 'on' as the default operator when none is specified
     * @test
     */
    test('should use "on" as default operator', () => {
      const defaultResult = filterTasksByCreationTime(tasks, testDate);
      const onResult = filterTasksByCreationTime(tasks, testDate, 'on');
      expect(defaultResult).toEqual(onResult);
    });
  });

  /**
   * Test suite for task sorting functions
   * @group Task Sorting
   */
  describe('Task Sorting Functions', () => {
    /**
     * Verifies that tasks are correctly sorted from latest to earliest creation date
     * @test
     */
    test('should sort tasks from latest to earliest', () => {
      const sortedTasks = sortTasksFromLatest(tasks);
      
      for (let i = 0; i < sortedTasks.length - 1; i++) {
        const currentTaskDate = new Date(sortedTasks[i].createdAt).getTime();
        const nextTaskDate = new Date(sortedTasks[i + 1].createdAt).getTime();
        expect(currentTaskDate).toBeGreaterThanOrEqual(nextTaskDate);
      }
    });

    /**
     * Verifies that tasks are correctly sorted from earliest to latest creation date
     * @test
     */
    test('should sort tasks from earliest to latest', () => {
      const sortedTasks = sortTasksFromEarliest(tasks);
      
      for (let i = 0; i < sortedTasks.length - 1; i++) {
        const currentTaskDate = new Date(sortedTasks[i].createdAt).getTime();
        const nextTaskDate = new Date(sortedTasks[i + 1].createdAt).getTime();
        expect(currentTaskDate).toBeLessThanOrEqual(nextTaskDate);
      }
    });

    /**
     * Verifies that sorting functions handle empty arrays correctly
     * @test
     */
    test('should handle empty array', () => {
      const emptyArray = [];
      expect(sortTasksFromLatest(emptyArray)).toEqual([]);
      expect(sortTasksFromEarliest(emptyArray)).toEqual([]);
    });

    /**
     * Verifies that sorting functions handle arrays with single task correctly
     * @test
     */
    test('should handle single task array', () => {
      const singleTask = [{ createdAt: '2024-01-01T00:00:00Z' }];
      expect(sortTasksFromLatest(singleTask)).toEqual(singleTask);
      expect(sortTasksFromEarliest(singleTask)).toEqual(singleTask);
    });

    /**
     * Verifies that sorting functions handle tasks with identical creation dates
     * @test
     */
    test('should handle identical creation dates', () => {
      const tasksWithSameDate = [
        { createdAt: '2024-01-01T00:00:00Z' },
        { createdAt: '2024-01-01T00:00:00Z' }
      ];
      
      const latestSorted = sortTasksFromLatest(tasksWithSameDate);
      const earliestSorted = sortTasksFromEarliest(tasksWithSameDate);
      
      expect(latestSorted.length).toBe(2);
      expect(earliestSorted.length).toBe(2);
    });
  });
});

