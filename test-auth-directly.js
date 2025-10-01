#!/usr/bin/env node

const puppeteer = require('puppeteer');

async function testAuth() {
  const browser = await puppeteer.launch({ headless: false, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  console.log('🔍 Testing auth page directly...');
  
  // Set age verification in localStorage to bypass modal
  await page.evaluateOnNewDocument(() => {
    localStorage.setItem('alchm_age_verified', 'true');
    localStorage.setItem('alchm_verification_date', Date.now().toString());
  });
  
  await page.goto('http://localhost:3000/en/auth/login', {
    waitUntil: 'networkidle2',
    timeout: 30000
  });
  
  // Wait a bit for page to fully load
  await page.waitForTimeout(2000);
  
  const elements = await page.evaluate(() => {
    return {
      hasEmailInput: !!document.querySelector('input[type="email"]'),
      hasPasswordInput: !!document.querySelector('input[type="password"]'),
      hasGoogleButton: !!Array.from(document.querySelectorAll('button')).find(btn => 
        btn.textContent.toLowerCase().includes('google')),
      hasCrisisButton: !!Array.from(document.querySelectorAll('button, a')).find(btn => 
        btn.textContent.toLowerCase().includes('988') || 
        btn.textContent.toLowerCase().includes('crisis')),
      bodyText: document.body.innerText.substring(0, 200),
      formCount: document.querySelectorAll('form').length,
      inputCount: document.querySelectorAll('input').length,
      buttonCount: document.querySelectorAll('button').length
    };
  });
  
  console.log('Form elements found:', elements);
  
  await browser.close();
}

testAuth().catch(console.error);
