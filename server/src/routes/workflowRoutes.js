import express from 'express';
import workflowController from '../controllers/workflowController.js';
import { asyncHandler } from '../utils/errorHandler.js';

const router = express.Router();

// Get available step types (must be before :id route)
router.get('/steps', asyncHandler(workflowController.getAvailableSteps));

// Create a new workflow
router.post('/', asyncHandler(workflowController.createWorkflow));

// Get all workflows
router.get('/', asyncHandler(workflowController.getWorkflows));

// Get a single workflow
router.get('/:id', asyncHandler(workflowController.getWorkflowById));

// Delete a workflow
router.delete('/:id', asyncHandler(workflowController.deleteWorkflow));

export default router;
