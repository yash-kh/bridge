import request from 'supertest';
import app from '../index.js';

describe('GET /api/tokens', () => {
  it('should fetch tokens', async () => {
    const res = await request(app)
      .get('/api/tokens?blockchain=ethereum');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });
});