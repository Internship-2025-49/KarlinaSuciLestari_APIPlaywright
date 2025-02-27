const { test, expect } = require('@playwright/test');

const BASE_URL = "https://reqres.in/api/users";
const DATA_URL = "https://reqres.in/api/users?page=2";
const SOURCE_URL = "https://reqres.in/api/unknown";
const REGISTER_URL = "https://reqres.in/api/register";

test('Get all users', async ({ request }) => {
    const response = await request.get(DATA_URL);
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    console.log("Isi seluruh Pengguna");
    console.log("Users:", data.data);

});

test('Get List users', async ({ request }) => {
    const response = await request.get(DATA_URL);
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    console.log("Isi List Pengguna");
    console.log("Users:", data.data);

    expect(data.users).toBeUndefined();
});

test('Get a single user by ID', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/2`);
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    console.log("Isi berdasarkan id");
    console.log("User  by ID:", data.data);
});

test('Get a single user by ID Not Found', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/23`);
    expect(response.status()).toBe(404); 
    const data = await response.json();
    console.log("Response Body:", data); 

    expect(data.users).toBeUndefined();
    expect(data.error).toBe("Not Found");
});


test('Get all users Resource', async ({ request }) => {
    const response = await request.get(SOURCE_URL);
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    console.log("Resource Users");
    console.log("List <Resource> :", data.data);

      expect(data.users).toBeUndefined();
});


test('Get a single user by Resource', async ({ request }) => {
    const response = await request.get(`${SOURCE_URL}/2`);
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    console.log("User:", data.data);

      expect(data.users).toBeUndefined();
});

test('Get a single user by Resource Not Found', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/23`);
    expect(response.status()).toBe(404); 
    const data = await response.json();
    console.log("Response Body:", data); 

    expect(data.users).toBeUndefined();
    expect(data.error).toBe("Not Found");
});

test('Create a new user', async ({ request }) => {
    const successResponse = await request.post(BASE_URL, {
        data: { name: "Tari Ari", job: "Sains" }
    });
    expect(successResponse.ok()).toBeTruthy();
    expect(successResponse.status()).toBe(201);

    const successData = await successResponse.json();

    expect(successData.name).toBe("Tari Ari");
    expect(successData.job).toBe("Sains");

    console.log("User Created:", successData);

    
    const failResponse = await request.post(BASE_URL, {
        data: {} 
    });
    expect(failResponse.ok()).toBeFalsy();
    expect(failResponse.status()).toBeGreaterThanOrEqual(400);

    const failData = await failResponse.json();
    expect(failData).toHaveProperty("error");

    console.log("User Creation Failed:", failData);
});



test('Update an existing user', async ({ request }) => {
    const successResponse = await request.put(`${BASE_URL}/2`, {
        data: { name: "Ina", job: "Manager" }
    });

    expect(successResponse.ok()).toBeTruthy();
    expect(successResponse.status()).toBe(200);

    const successData = await successResponse.json();

    expect(successData.name).toBe("Ina");
    expect(successData.job).toBe("Manager");

    expect(successData).toHaveProperty("updatedAt");

    console.log("User Updated Successfully:", successData);

    const failResponse = await request.put(`${BASE_URL}/99999`, {
        data: {} 
    });

    expect(failResponse.ok()).toBeFalsy();
    expect(failResponse.status()).toBeGreaterThanOrEqual(400);

    const failData = await failResponse.json();

    expect(failData).toHaveProperty("error");

    console.log("User Update Failed:", failData);
});



test('Delete a user', async ({ request }) => {
    const response = await request.delete(`${BASE_URL}/3`);
    expect(response.status()).toBe(204);

    const body = await response.body();
    expect(body).toBeNull();
  
    console.log("User deleted successfully");
    
});

test('Register a new user', async ({ request }) => {
    const response = await request.post(REGISTER_URL, {
        data: { email: "eve.holt@reqres.in", password: "pistol" }
    });
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    console.log("User Registered:", data);

      expect(data.users).toBeUndefined();
});

test('Login a user', async ({ request }) => {
    // Skenario sukses: Login dengan email dan password yang benar
    const successResponse = await request.post(REGISTER_URL, {
        data: { email: "eve.holt@reqres.in", password: "pistol" }
    });

   
    expect(successResponse.ok()).toBeTruthy();

    expect(successResponse.status()).toBe(200);
    const successData = await successResponse.json();

    expect(successData).toHaveProperty("token");
    console.log("User Logged In Successfully:", successData);

    const failResponse = await request.post(REGISTER_URL, {
        data: { email: "eve.holt@reqres.in" }
    });

    expect(failResponse.ok()).toBeFalsy();
    expect(failResponse.status()).toBe(400);
    const failData = await failResponse.json();

    expect(failData).toHaveProperty("error");
    console.log("User Login Failed:", failData);
});
