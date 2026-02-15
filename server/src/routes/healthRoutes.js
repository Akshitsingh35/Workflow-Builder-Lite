import express from 'express';
import healthController from '../controllers/healthController.js';

const router = express.Router();

// Full health check
router.get('/', (req, res, next) => healthController.getHealth(req, res, next));

// Simple liveness check
router.get('/live', (req, res) => healthController.getLiveness(req, res));

export default router;
