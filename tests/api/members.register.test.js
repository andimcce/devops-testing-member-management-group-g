const { api, seedDatabase, createMember } = require('../../helpers/api');

beforeAll(() => seedDatabase());

describe('POST /api/members – Register a member', () => {

  test('TC-G2-001: should register a new member with valid name and email', async () => {
    const res = await createMember({ name: 'Alice Müller', email: 'alice.mueller@example.com' });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Alice Müller');
    expect(res.body.email).toBe('alice.mueller@example.com');
    expect(res.body.id).toBeDefined();
  });

  test('TC-G2-002: should assign an auto-generated member number on registration', async () => {
    const res = await createMember();

    expect(res.status).toBe(201);
    expect(res.body.memberNumber).toMatch(/^M\d{4}$/);
  });

  test('TC-G2-003: should set status to active by default on registration', async () => {
    const res = await createMember();

    expect(res.status).toBe(201);
    expect(res.body.status).toBe('active');
  });

  test('TC-G2-004: should return 400 when name is missing', async () => {
    const res = await api.post('/api/members').send({ email: 'noname@example.com' });

    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  test('TC-G2-005: should return 400 when email is missing', async () => {
    const res = await api.post('/api/members').send({ name: 'No Email' });

    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  test('TC-G2-006: should return 400 when email format is invalid', async () => {
    const res = await api.post('/api/members').send({ name: 'Bad Email', email: 'not-an-email' });

    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  test('TC-G2-007: should return 409 when email is already registered', async () => {
    const email = `duplicate.${Date.now()}@example.com`;
    await createMember({ email });

    const res = await createMember({ email });

    expect(res.status).toBe(409);
    expect(res.body.error).toMatch(/already registered/i);
  });

  test('TC-G2-008: should return 400 when body is completely empty', async () => {
    const res = await api.post('/api/members').send({});

    expect(res.status).toBe(400);
  });

});