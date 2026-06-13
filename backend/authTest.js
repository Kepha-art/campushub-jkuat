const fetch = global.fetch || require('node-fetch');
const base = 'http://localhost:5000/api/auth';
const email = `testuser_${Date.now()}@example.com`;
const body = { name: 'Test User', email, password: 'TestPass123' };

(async () => {
  try {
    console.log('Registering:', email);
    const reg = await fetch(`${base}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const regData = await reg.json();
    console.log('Register status:', reg.status);
    console.log('Register response:', JSON.stringify(regData, null, 2));

    const login = await fetch(`${base}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: 'TestPass123' }),
    });
    const loginData = await login.json();
    console.log('Login status:', login.status);
    console.log('Login response:', JSON.stringify(loginData, null, 2));
  } catch (err) {
    console.error('Request error:', err);
  }
})();