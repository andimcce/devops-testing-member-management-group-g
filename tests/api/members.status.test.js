const { api, seedDatabase, createMember } = require('../../helpers/api');

beforeAll(() => seedDatabase());

describe('POST /api/members/:id/deactivate & /activate – Member status', () => {

  test('TC-G2-018: should deactivate an active member', async () => {
    const created = await createMember();
    const id = created.body.id;

    const res = await api.post(`/api/members/${id}/deactivate`);

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('inactive');
  });

  test('TC-G2-019: should reactivate an inactive member', async () => {
    const created = await createMember();
    const id = created.body.id;
    await api.post(`/api/members/${id}/deactivate`);

    const res = await api.post(`/api/members/${id}/activate`);

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('active');
  });

  test('TC-G2-020: should return 404 when deactivating a non-existent member', async () => {
    const res = await api.post('/api/members/999999/deactivate');

    expect(res.status).toBe(404);
  });

  test('TC-G2-021: should return 404 when activating a non-existent member', async () => {
    const res = await api.post('/api/members/999999/activate');

    expect(res.status).toBe(404);
  });

  test('TC-G2-022: inactive member should not be able to borrow a book', async () => {
    // Seed gives us books with available copies — use book id 1
    const member = await createMember();
    const id = member.body.id;
    await api.post(`/api/members/${id}/deactivate`);

    const booksRes = await api.get('/api/books');
    const availableBook = booksRes.body.find(b => b.availableCopies > 0);

    const res = await api.post('/api/loans').send({ bookId: availableBook.id, memberId: id });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/inactive/i);
  });

});