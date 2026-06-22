# AI-Powered Industrial Safety Intelligence for Zero-Harm Operations
### ET AI Hackathon 2026 — Phase 2: Build Sprint Submission (Problem Statement 1)

This repository contains the prototype architecture for an intelligent multi-agent safety layer designed to eliminate dangerous manual handoffs in heavy industrial environments by catching hidden compound risk factors.

## 🛠️ Tech Stack & Architecture
- **Backend Core:** Node.js, Express, TypeScript
- **Multi-Agent Simulation Engine:** Specialized agents (GasTrackingAgent, PermitParsingAgent) coordinated via an intelligent RiskCoordinator router layer to detect high-risk co-occurrences.
- **E2E Test Automation Harness:** Playwright with TypeScript for high-stress concurrent asynchronous sensor data mocking.

## 🧪 Automated Testing & Verification Validation
To verify system resilience under peak data saturation stress without dropping critical safety alerts, we integrated an automated end-to-end testing matrix using Playwright network interception (page.route).
