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

test('Successfully create a new user', async ({ request }) => {
    const response = await request.post(BASE_URL, {
        data: { name: "Tari Ari", job: "Sains" }
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(201);

    const data = await response.json();

    expect(data.name).toBe("Tari Ari");
    expect(data.job).toBe("Sains");

    console.log("✅ User Created Successfully:", data);
});

test('Fail to create a new user with missing data', async ({ request }) => {
    const response = await request.post(BASE_URL, {
        data: {} 
    });

    expect(response.ok()).toBeFalsy();
    expect(response.status()).toBeGreaterThanOrEqual(400);

    const data = await response.json();
    expect(data).toHaveProperty("error");

    console.log("✅ User Creation Failed Due to Missing Data:", data);
});




test('Successfully update an existing user', async ({ request }) => {
    const response = await request.put(`${BASE_URL}/2`, {
        data: { name: "Ina", job: "Manager" }
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const data = await response.json();

    expect(data.name).toBe("Ina");
    expect(data.job).toBe("Manager");
    expect(data).toHaveProperty("updatedAt");

    console.log("✅ User Updated Successfully:", data);
});

test('Fail to update user with invalid data', async ({ request }) => {
    const response = await request.put(`${BASE_URL}/2`, {
        data: { name: "", job: "" } 
    });

    expect(response.ok()).toBeFalsy();
    expect(response.status()).toBeGreaterThanOrEqual(400);

    const data = await response.json();
    expect(data).toHaveProperty("error");

    console.log("✅ User Update Failed Due to Invalid Data:", data);
});

test('Fail to update non-existing user', async ({ request }) => {
    const response = await request.put(`${BASE_URL}/99999`, {
        data: { name: "John", job: "Developer" }
    });

    expect(response.ok()).toBeFalsy();
    expect(response.status()).toBeGreaterThanOrEqual(400);

    const data = await response.json();
    expect(data).toHaveProperty("error");

    console.log("✅ User Update Failed (User Not Found):", data);
});

test('Successfully delete an existing user', async ({ request }) => {
    const response = await request.delete(`${BASE_URL}/3`);
    
    expect(response.status()).toBe(204);

    const body = await response.text(); 
    expect(body).toBe("");
    
    console.log("✅ User deleted successfully");
});


test('Fail to delete a non-existing user', async ({ request }) => {
    const response = await request.delete(`${BASE_URL}/99999`); 
    
    expect(response.status()).toBeGreaterThanOrEqual(400);
    
    const errorData = await response.json();
    expect(errorData).toHaveProperty("error");

    console.log("✅ User deletion failed (User Not Found):", errorData);
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

test('Successfully log in a user', async ({ request }) => {
    const response = await request.post(REGISTER_URL, {
        data: { email: "eve.holt@reqres.in", password: "pistol" }
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty("token");

    console.log("✅ User Logged In Successfully:", data);
});

test('Fail to log in a user with missing password', async ({ request }) => {
    const response = await request.post(REGISTER_URL, {
        data: { email: "eve.holt@reqres.in" } 
    });

    expect(response.ok()).toBeFalsy();
    expect(response.status()).toBe(400);

    const data = await response.json();
    expect(data).toHaveProperty("error");
    expect(data).toHaveProperty("message"); 

    console.log("✅ User Login Failed Due to Missing Password:", data.error, "-", data.message);
});

