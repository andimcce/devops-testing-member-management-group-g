const supertest = require('supertest');
const { execSync } = require('child_process');
const path = require('path');

const BASE_URL = process.env.SUT_URL || 'http://localhost:3000';

const api = supertest(BASE_URL);

const SUT_DIR = process.env.SUT_DIR || path.resolve(__dirname, '../sut');

function seedDatabase() {
  execSync('npm run seed', { cwd: SUT_DIR, stdio: 'inherit' });
}

async function createMember(overrides = {}) {
  const unique = Date.now() + Math.random().toString(36).slice(2, 7);
  const payload = {
    name: 'Test Member',
    email: `test.${unique}@example.com`,
    ...overrides,
  };
  const res = await api.post('/api/members').send(payload);
  return res;
}

module.exports = { api, seedDatabase, createMember };