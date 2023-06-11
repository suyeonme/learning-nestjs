import { rm } from 'fs/promises';
import { join } from 'path';

/**
 * @summary Setup file for Jest
 * @description This file is run before each test file
 * @see {jst-e2e.config.js} setupFilesAfterEnv
 */

global.beforeEach(async () => {
  try {
    // Remove test database before each test
    await rm(join(__dirname, '..', 'test.sqlite'));
  } catch (error) {}
}); 
