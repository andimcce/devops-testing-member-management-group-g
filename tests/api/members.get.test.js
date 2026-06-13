const { api, seedDatabase, createMember } = require('../../helpers/api');

beforeAll(() => seedDatabase());

describe('GET /api/members – List and retrieve members', () => {

  test('TC-G2-009: should return 200 and an array for GET /api/members', async () => {
    const res = await api.get('/api/members');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('TC-G2-010: should return correct fields for each member in the list', async () => {
    const res = await api.get('/api/members');

    const member = res.body[0];
    expect(member).toHaveProperty('id');
    expect(member).toHaveProperty('name');
    expect(member).toHaveProperty('email');
    expect(member).toHaveProperty('memberNumber');
    expect(member).toHaveProperty('status');
  });

  test('TC-G2-011: should return 200 and the correct member for GET /api/members/:id', async () => {
    const created = await createMember({ name: 'Get By ID', email: `getbyid.${Date.now()}@example.com` });
    const id = created.body.id;

    const res = await api.get(`/api/members/${id}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(id);
    expect(res.body.name).toBe('Get By ID');
  });

  test('TC-G2-012: should return 404 for a non-existent member ID', async () => {
    const res = await api.get('/api/members/999999');

    expect(res.status).toBe(404);
    expect(res.body.error).toMatch(/not found/i);
  });

});