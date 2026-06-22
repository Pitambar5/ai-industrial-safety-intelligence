import { test, expect } from '@playwright/test';

test.describe('Industrial Safety Platform - Compound Risk Detection E2E Suite', () => {

  test('should flash critical alert when safe gas levels co-occur with a hot work permit', async ({ page }) => {
    
    // Intercept the dashboard's live telemetry endpoint to mock data safely
    await page.route('**/api/telemetry/live-status', async (route) => {
      await route.fulfill({
        contentType: 'application/json',
        json: {
          compoundRiskScore: 87,
          overallStatus: 'CRITICAL',
          agentLogs: [
            { 
              agentName: 'GasTrackingAgent', 
              status: 'ELEVATED', 
              reasoning: 'Gas Tracking Agent detected a localized plume anomaly at 45 PPM.' 
            },
            { 
              agentName: 'PermitParsingAgent', 
              status: 'ELEVATED', 
              reasoning: 'Permit Agent flags ignition source mismatch' 
            }
          ],
          timestamp: new Date().toISOString()
        }
      });
    });

    // Navigate to your UI prototype dashboard safety track page
    await page.goto('http://localhost:3000/dashboard/safety');

    // Assertion 1: Verify the critical compound risk alert banner displays instantly
    const alertBanner = page.locator('[data-testid="critical-alert-banner"]');
    await expect(alertBanner).toBeVisible();
    await expect(alertBanner).toContainText('CRITICAL COMPOUND RISK DETECTED');

    // Assertion 2: Verify the AI multi-agent trace log reports the exact correlation reason
    const agentLogs = page.locator('[data-testid="ai-reasoning-log"]');
    await expect(agentLogs).toContainText('Permit Agent flags ignition source mismatch');
  });
});
