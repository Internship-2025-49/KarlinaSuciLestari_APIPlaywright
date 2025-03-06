import { test, expect } from '@playwright/test';

test("mocks a fruit and doesn't call api", async ({ page }) => {

     

    await page.goto('https://demo.playwright.dev/api-mocking');
  
    await expect(page.getByText('Strawberry')).toBeVisible();
  });


test('Mock API response with multiple fruits', async ({ page }) => {
  await page.route('https://demo.playwright.dev/api-mocking', async route => {
    const jsonResponse = [
      { id: 1, name: 'Apple' },
      { id: 2, name: 'Banana' },
      { id: 3, name: 'Cherry' }
    ];
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(jsonResponse),
    });
  });

  await page.goto('https://demo.playwright.dev/api-mocking');
  await page.waitForSelector('text=Apple');
  await page.waitForSelector('text=Banana');
  await page.waitForSelector('text=Cherry');

  await expect(page.getByText('Apple')).toBeVisible();
  await expect(page.getByText('Banana')).toBeVisible();
  await expect(page.getByText('Cherry')).toBeVisible();
});

test('gets the json from api and adds a new fruit', async ({ page }) => {
  await page.route('*/**/api/v1/fruits', async route => {
    const response = await route.fetch();
    const json = await response.json();
    json.push({ name: 'Loquat', id: 100 });
   
    await route.fulfill({ response, json });
  });

  
  await page.goto('https://demo.playwright.dev/api-mocking');

  
  await expect(page.getByText('Loquat', { exact: true })).toBeVisible();
});

test('CRUD operations on fruits API', async ({ page }) => {
  await page.route('*/**/api/v1/fruits', async route => {
    const response = await route.fetch();
    let json = await response.json();
    
    json = json.map(fruit => ({ name: fruit.name }));

    // Create
    json.push({ name: 'Grape' });

    // Update
    const indexToUpdate = json.findIndex(fruit => fruit.name === 'Banana');
    if (indexToUpdate !== -1) {
      json[indexToUpdate] = { name: 'Persik' };
    }

    // Delete
    json = json.filter(fruit => fruit.name !== 'Lemon');
    
    await route.fulfill({ json });
  });

  await page.goto('https://demo.playwright.dev/api-mocking');

  await expect(page.getByText('Grape', { exact: true })).toBeVisible();
  await expect(page.getByText('Persik', { exact: true })).toBeVisible();
  await expect(page.getByText('Lemon', { exact: true })).not.toBeVisible();
});


test('records or updates the HAR file', async ({ page }) => {
 
  await page.routeFromHAR('./hars/fruit.har', {
    url: '*/**/api/v1/fruits',
    update: true,
  });


  await page.goto('https://demo.playwright.dev/api-mocking');

 
  await expect(page.getByText('Strawberry')).toBeVisible();
});


// test('gets the json from HAR and checks the new fruit has been added', async ({ page }) => {
//   // Replay API requests from HAR.
//   // Either use a matching response from the HAR,
//   // or abort the request if nothing matches.
//   await page.routeFromHAR('./hars/fruit.har', {
//     url: '*/**/api/v1/fruits',
//     update: false,
//   });

//   // Go to the page
//   await page.goto('https://demo.playwright.dev/api-mocking');

//   // Assert that the Playwright fruit is visible
//   await expect(page.getByText('Playwright', { exact: true })).toBeVisible();
// });

test('soket web test with request', async ({ page }) => {
  await page.routeWebSocket('wss://example.com/ws', ws => {
  const server = ws.connectToServer();
  ws.onMessage(message => {
    if (message === 'request')
      server.send('request2');
    else
      server.send(message);
  });
});
});


  
  