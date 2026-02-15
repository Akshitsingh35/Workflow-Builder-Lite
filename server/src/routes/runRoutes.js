import express from 'express';
import runController from '../controllers/runController.js';
import { asyncHandler } from '../utils/errorHandler.js';

const router = express.Router();

// POST /api/runs - Execute a workflow
router.post('/', asyncHandler(runController.runWorkflow));

// GET /api/runs - List all runs
router.get('/', asyncHandler(runController.getRuns));

// GET /api/runs/:id - Get a single run
router.get('/:id', asyncHandler(runController.getRunById));

export default router;
