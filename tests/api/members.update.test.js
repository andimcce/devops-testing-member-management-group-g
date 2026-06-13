const { api, seedDatabase, createMember } = require('../../helpers/api');

beforeAll(() => seedDatabase());

describe('PUT /api/members/:id – Update a member', () => {

  test('TC-G2-013: should update the member name successfully', async () => {
    const created = await createMember();
    const id = created.body.id;

    const res = await api.put(`/api/members/${id}`).send({ name: 'Updated Name' });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Updated Name');
  });

  test('TC-G2-014: should update the member email successfully', async () => {
    const created = await createMember();
    const id = created.body.id;
    const newEmail = `updated.${Date.now()}@example.com`;

    const res = await api.put(`/api/members/${id}`).send({ email: newEmail });

    expect(res.status).toBe(200);
    expect(res.body.email).toBe(newEmail);
  });

  test('TC-G2-015: should return 409 when updating email to one already taken', async () => {
    const first = await createMember();
    const second = await createMember();

    const res = await api.put(`/api/members/${second.body.id}`).send({ email: first.body.email });

    expect(res.status).toBe(409);
    expect(res.body.error).toMatch(/already taken/i);
  });

  test('TC-G2-016: should return 400 when updating email to an invalid format', async () => {
    const created = await createMember();
    const id = created.body.id;

    const res = await api.put(`/api/members/${id}`).send({ email: 'bad-format' });

    expect(res.status).toBe(400);
  });

  test('TC-G2-017: should return 404 when updating a non-existent member', async () => {
    const res = await api.put('/api/members/999999').send({ name: 'Ghost' });

    expect(res.status).toBe(404);
  });

});