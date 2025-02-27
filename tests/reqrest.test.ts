const { test, expect } = require('@playwright/test');

const BASE_URL = "https://reqres.in/api/users";
const DATA_URL = "https://reqres.in/api/users?page=2";
const SOURCE_URL = "https://reqres.in/api/unknown";
const REGISTER_URL = "https://reqres.in/api/register";

test('Get all users', async ({ request }) => {
    const response = await request.get(DATA_URL);
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    console.log("Users:", data.data);
});

test('Get List users', async ({ request }) => {
    const response = await request.get(DATA_URL);
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    console.log("Users:", data.data);
});

test('Get a single user by ID', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/2`);
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    console.log("User  by ID:", data.data);
});

test('Get a single user by ID Not Found', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/23`);
    expect(response.status()).toBe(404); 
    const data = await response.json();
    console.log("Response Body:", data); 
});


test('Get all users Resource', async ({ request }) => {
    const response = await request.get(SOURCE_URL);
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    console.log("List <Resource> :", data.data);
});


test('Get a single user by Resource', async ({ request }) => {
    const response = await request.get(`${SOURCE_URL}/2`);
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    console.log("User:", data.data);
});

test('Get a single user by Resource Not Found', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/23`);
    expect(response.status()).toBe(404); 
    const data = await response.json();
    console.log("Response Body:", data); 
});

test('Create a new user', async ({ request }) => {
    const response = await request.post(BASE_URL, {
        data: { name: "Tari Ari", job: "Sains" }
    });
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    console.log("User Created:", data);
});

test('Update an existing user', async ({ request }) => {
    const response = await request.put(`${BASE_URL}/2`, {
        data: { name: "Ina", job: "Manager" }
    });
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    console.log("User Updated:", data);
});

test('Delete a user', async ({ request }) => {
    const response = await request.delete(`${BASE_URL}/3`);
    expect(response.status()).toBe(204);
    console.log("User deleted successfully");
});

test('Register a new user', async ({ request }) => {
    const response = await request.post(REGISTER_URL, {
        data: { email: "eve.holt@reqres.in", password: "pistol" }
    });
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    console.log("User Registered:", data);
});

test('Login a user', async ({ request }) => {
    const response = await request.post(REGISTER_URL, {
        data: { email: "eve.holt@reqres.in", password: "pistol" }
    });
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    console.log("User Logged In:", data);
});