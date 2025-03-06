import { test, expect, request } from '@playwright/test';

const API_URL = 'https://jsonplaceholder.typicode.com/posts';

test.describe('CRUD API Test', () => {
    let context;

    test.beforeAll(async () => {
        context = await request.newContext();
    });

    test('Get all data', async () => {
        const response = await context.get(API_URL);
        expect(response.status()).toBe(200);
        const data = await response.json();
        console.log('Data:', data);
    });

    test('Create new data', async () => {
        const response = await context.post(API_URL, {
            data: { title: 'New Post', body: 'This is a new post', userId: 1 }
        });
        expect(response.status()).toBe(201);
        const data = await response.json();
        console.log('Created Data:', data);
    });

    test('Get data by ID', async () => {
        const response = await context.get(`${API_URL}/1`);
        expect(response.status()).toBe(200);
        const data = await response.json();
        console.log('Data by ID:', data);
    });

    test('Update data', async () => {
        const response = await context.put(`${API_URL}/1`, {
            data: { title: 'Updated Post', body: 'This is updated content', userId: 1 }
        });
        expect(response.status()).toBe(200);
        const data = await response.json();
        console.log('Updated Data:', data);
    });

    test('Delete data', async () => {
        const response = await context.delete(`${API_URL}/1`);
        expect(response.status()).toBe(200);
        console.log('Deleted Data:', response.ok() ? 'Success' : 'Failed');
    });
        
});