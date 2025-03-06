import { test, expect, APIRequestContext } from '@playwright/test';
import fs from 'fs';

import * as dotenv from 'dotenv';
dotenv.config();

const BASE_URL = 'http://localhost:3000/api';
let authToken = process.env.AUTH_TOKEN || ''; 

test.beforeAll(async () => {
  console.log("beforeAll mulai dijalankan...");

  if (!authToken) {
    console.log("Auth token belum ada, mulai login...");

    const response = await fetch(`${BASE_URL}/person/login`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "x-api-key": process.env.API_KEY || ""  
      },
      body: JSON.stringify({ username: "tari", password: "tari123" }),
    });

    console.log("Login Response Status:", response.status);
    const responseText = await response.text();
    console.log("Raw Login Response:", responseText);

    try {
      const responseBody = JSON.parse(responseText);
      authToken = responseBody.token;

      console.log("Token Diterima:", authToken);

      if (authToken) {
        fs.writeFileSync(".env", `API_KEY=${process.env.API_KEY}\nAUTH_TOKEN=${authToken}\n`);
        console.log("Token berhasil disimpan di .env");
      } else {
        console.error("Gagal mendapatkan token");
      }
    } catch (error) {
      console.error("Gagal parse JSON:", error);
    }
  }

  console.log("beforeAll selesai.");
});


test.afterAll(async () => {
  console.log('All tests completed.');
});

test.describe('Person API Tests', () => {
  let personId: string = '';

  test('Get persons', async ({ request }: { request: APIRequestContext }) => {
    if (!authToken) {
      console.error("authToken kosong! Tes dihentikan.");
      return;
    }

    const response = await request.get(`${BASE_URL}/person/data`, {
      headers: {
        'x-api-key': process.env.API_KEY || '',  
        'Authorization': `Bearer ${authToken}`,  
      },
    });

    console.log("Response Status:", response.status());
    const persons = await response.json();
    console.log('All Persons:', persons);

    expect(response.status()).toBe(200);
    expect(persons.length).toBeGreaterThan(0);
  });

  test('Create person', async ({ request }: { request: APIRequestContext }) => {
    if (!authToken) {
      console.error("authToken kosong! Tes dihentikan.");
      return;
    }

    const response = await request.post(`${BASE_URL}/person/data`, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.API_KEY || '',  
        'Authorization': `Bearer ${authToken}`,  
      },
      data: { name: 'Ari Lestari', address: 'Bobojong', phone: '123456789' },
    });

    console.log("Response Status:", response.status());
    const responseBody = await response.json();
    console.log('Created:', responseBody);

    expect(response.status()).toBe(200);
    personId = responseBody._id;
  });
  

  test('Cek dan Update person', async ({ request }) => {
    const personCheck = await request.put(`${BASE_URL}/person/data/${personId}`);
    
    if (personCheck.status() !== 200) {
      console.warn('Person tidak ditemukan. Mungkin sudah dihapus.');
      return;
    }
  
    const response = await request.put(`${BASE_URL}/person/data/${personId}`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
      data: { name: 'Herman', address: 'Cicadas', phone: '987654321' },
    });

    expect(response.status()).toBe(200);
  });
  

  test('Delete person', async ({ request }: { request: APIRequestContext }) => {
    if (!authToken) {
      console.error("authToken kosong! Tes dihentikan.");
      return;
    }
    if (!personId) {
      console.warn('Tidak ada person untuk dihapus');
      return;
    }

    const response = await request.delete(`${BASE_URL}/person/data/138`, {
      headers: {
        'x-api-key': process.env.API_KEY || '',  
        'Authorization': `Bearer ${authToken}`,  
      },
    });

    console.log("Response Status:", response.status());
    console.log('Deleted:', await response.json());

    expect(response.status()).toBe(200);
  });
});