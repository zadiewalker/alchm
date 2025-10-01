/**
 * ALCHM Escalation System API Routes
 * 
 * Express routes for the escalation intelligence and analytics system.
 */

import { Router } from 'express';
import {
  evaluateEscalation,
  initiateHandoff,
  recordResolution,
  startMonitoring,
  checkTriggers,
  getAnalyticsDashboard,
  getRealTimeAlerts,
  getMetricInsights,
  getOptimizedResponse,
  recordSuccessfulIntervention,
  getSystemStatus
} from '../api/escalation-system';

const router = Router();

// Core escalation endpoints
router.post('/evaluate', evaluateEscalation);
router.post('/handoff', initiateHandoff);
router.post('/record-resolution', recordResolution);

// Monitoring endpoints
router.post('/start-monitoring', startMonitoring);
router.post('/check-triggers', checkTriggers);

// Analytics endpoints
router.get('/analytics/dashboard', getAnalyticsDashboard);
router.get('/analytics/alerts', getRealTimeAlerts);
router.get('/analytics/insights', getMetricInsights);

// Learning endpoints
router.post('/learning/optimize-response', getOptimizedResponse);
router.post('/learning/record-intervention', recordSuccessfulIntervention);

// System status
router.get('/status', getSystemStatus);

export default router;