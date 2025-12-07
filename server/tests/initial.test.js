import request from 'supertest';
import app from '../app.js';

describe('API Health Check', () => {
    it('GET / should return 200 and welcome message', async () => {
        const res = await request(app).get('/');

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'YUVAX API is running');
        expect(res.body).toHaveProperty('version', '1.0.0');
    });

    it('GET /unknown-route should return 404', async () => {
        const res = await request(app).get('/api/unknown-route');

        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty('message', 'Route not found');
    });
});
