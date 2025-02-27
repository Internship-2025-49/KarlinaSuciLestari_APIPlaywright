import { test, expect } from '@playwright/test';

test('has title', async ({ request }) => {
  const response = await request.get('/api/users?page=2');
  expect(response.ok()).toBeTruthy();
  const users = await response.json();
  expect(users.data.length).toBeGreaterThan(0);
});

test('Create a new user', async ({ request }) => {
    const newUser = {
      name: "Luffy",
      job: "Pirate"
    };
    const response = await request.post('/api/users', { data: newUser });
    expect(response.ok()).toBeTruthy();
    const user = await response.json();
    expect(user.name).toBe('Luffy');
  });

  test('Update a user', async ({ request }) => {
    const updatedUser = {
      name: "Monkey D. Luffy",
      job: "Pirate King"
    };
    const response = await request.put('/api/users/2', { data: updatedUser });
    expect(response.ok()).toBeTruthy();
    const user = await response.json();
    expect(user.name).toBe('Monkey D. Luffy');
  });

  test('Delete a user', async ({ request }) => {
    const response = await request.delete('/api/users/2');
    expect(response.ok()).toBeTruthy();
  });

  const testData = [
    { name: 'Luffy', job: 'Pirate' },
    { name: 'Zoro', job: 'Swordsman' },
    { name: 'Sanji', job: 'Chef' }
  ];
  
  testData.forEach((data) => {
    test(`Create a new user with name ${data.name}`, async ({ request }) => {
      const response = await request.post('/api/users', { data });
      expect(response.ok()).toBeTruthy();
      const user = await response.json();
      expect(user.name).toBe(data.name);
    });
  });