import { test, expect } from '@playwright/test';

test.describe('LangGraph AI Service Health & Integration', () => {
  test('AI Service health check endpoint responds with healthy status', async ({ request, baseURL }) => {
    const aiBaseUrl = baseURL || process.env.AI_SERVICE_URL || 'https://bkai.169-58-102-217.sslip.io';
    const response = await request.get(`${aiBaseUrl}/health`, {
      ignoreHTTPSErrors: true,
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.status).toBe('healthy');
    expect(data.service).toBe('BK LangGraph AI Service');
    expect(data.nvidia_nim_configured).toBe(true);
  });
});
