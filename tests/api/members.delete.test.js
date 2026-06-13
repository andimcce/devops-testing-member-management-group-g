const { api, seedDatabase, createMember } = require('../../helpers/api');

beforeAll(() => seedDatabase());

describe('DELETE /api/members/:id – Delete a member', () => {

  test('TC-G2-023: should delete a member with no active loans', async () => {
    const created = await createMember();
    const id = created.body.id;

    const res = await api.delete(`/api/members/${id}`);

    expect(res.status).toBe(204);
  });

  test('TC-G2-024: should return 404 when trying to get a deleted member', async () => {
    const created = await createMember();
    const id = created.body.id;
    await api.delete(`/api/members/${id}`);

    const res = await api.get(`/api/members/${id}`);

    expect(res.status).toBe(404);
  });

  test('TC-G2-025: should return 409 when deleting a member with active loans', async () => {
    // Use a member from seed data that already has an active loan
    const loansRes = await api.get('/api/loans?status=active');
    const activeLoan = loansRes.body[0];

    const res = await api.delete(`/api/members/${activeLoan.memberId}`);

    expect(res.status).toBe(409);
    expect(res.body.error).toMatch(/active loans/i);
  });

  test('TC-G2-026: should return 404 when deleting a non-existent member', async () => {
    const res = await api.delete('/api/members/999999');

    expect(res.status).toBe(404);
  });

});