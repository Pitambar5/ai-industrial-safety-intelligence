import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

interface TelemetryPayload {
  gasLevelPpm: number;
  hotWorkActive: boolean;
  workerCount: number;
  zoneId: string;
}

// Default starting telemetry data state
let currentTelemetryState: TelemetryPayload = {
  gasLevelPpm: 20,
  hotWorkActive: false,
  workerCount: 5,
  zoneId: 'Coke-Oven-Battery-B'
};

// Main API endpoint that evaluates risks across multiple agents
app.get('/api/telemetry/live-status', (req: Request, res: Response) => {
  let gasStatus = 'CLEAR';
  let gasReasoning = 'Gas readings are within baseline atmospheric tolerances.';
  let permitStatus = currentTelemetryState.hotWorkActive ? 'ELEVATED' : 'CLEAR';
  let permitReasoning = currentTelemetryState.hotWorkActive 
    ? 'Permit Tracking Agent flagged active open-flame tools authorized in zone.' 
    : 'Standard maintenance permit validated.';

  let compoundRiskScore = 10;
  let overallStatus = 'SECURE';

  // Check for the "Elevated Gas" plume threshold
  if (currentTelemetryState.gasLevelPpm >= 35 && currentTelemetryState.gasLevelPpm < 50) {
    gasStatus = 'ELEVATED';
    gasReasoning = `Gas Tracking Agent detected a localized plume anomaly at ${currentTelemetryState.gasLevelPpm} PPM. Below individual hazard cut-off.`;
  }

  // COMPOUND RISK CO-OCCURRENCE DETECTION BOUNDARY
  if (gasStatus === 'ELEVATED' && permitStatus === 'ELEVATED') {
    compoundRiskScore = 87; 
    overallStatus = 'CRITICAL';
    gasReasoning += ' [AMPLIFIED: Open ignition parameters active within zone boundary]';
    permitReasoning += ' [CRITICAL MISMATCH: Hot work active during gas plume migration]';
  }

  res.status(200).json({
    compoundRiskScore,
    overallStatus,
    agentLogs: [
      { agentName: 'GasTrackingAgent', status: gasStatus, reasoning: gasReasoning },
      { agentName: 'PermitParsingAgent', status: permitStatus, reasoning: permitReasoning }
    ],
    timestamp: new Date().toISOString()
  });
});

// Update endpoint to change sensor data dynamically
app.post('/api/telemetry/update', (req: Request, res: Response) => {
  currentTelemetryState = { ...currentTelemetryState, ...req.body };
  res.status(200).json({ message: 'Telemetry updated successfully' });
});

app.listen(3000, () => {
  console.log('🚀 Safety Intelligence Multi-Agent Layer running on port 3000');
});