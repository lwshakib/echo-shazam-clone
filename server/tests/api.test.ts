import { expect, test, describe } from 'bun:test';
import request from 'supertest';
import app from '../index';

describe('Echo Server API Tests', () => {
  test('POST /identify without audio file should return 400', async () => {
    const res = await request(app).post('/identify');
    expect(res.status).toBe(400);
  });

  test('POST /webhook/upload_hashes without token should return 401', async () => {
    const res = await request(app)
      .post('/webhook/upload_hashes')
      .send({ song: 'test', hashes: [] });
    expect(res.status).toBe(401);
  });
});
