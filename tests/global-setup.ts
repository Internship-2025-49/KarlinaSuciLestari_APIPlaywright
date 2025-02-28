import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
    console.log("Starting Global Setup...");
    
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    const LOGIN_URL = config.projects[0].use.baseURL || 'https://reqres.in/api/login';
    console.log("Base URL:", LOGIN_URL);

    
    try {
        const response = await page.goto(LOGIN_URL);
        if (!response || !response.ok()) {
            throw new Error(`Server is not reachable at ${LOGIN_URL}`);
        }
        console.log("✅ Server is running!");
    } catch (error) {
        console.error(error.message);
        process.exit(1); 
    }
    console.log("Login url:",LOGIN_URL);

    const loginResponse = await page.request.post(`${LOGIN_URL}/login`, {
        data: { email: "eve.holt@reqres.in", password: "pistol" }
    });

    if (loginResponse.ok()) {
        const loginData = await loginResponse.json();
        console.log("Login successful! Token:", loginData.token);

      
        await page.context().storageState({ path: 'auth.json' });
    } else {
        console.error("Login failed!");
    }

    await browser.close();
}

export default globalSetup;
