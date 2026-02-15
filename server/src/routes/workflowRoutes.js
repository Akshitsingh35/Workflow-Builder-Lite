const express = require('express');
const router = express.Router();
const workflowController = require('../controllers/workflowController');

// Get available step types (must be before :id route)
router.get('/steps', (req, res, next) => workflowController.getAvailableSteps(req, res, next));

// Create a new workflow
router.post('/', (req, res, next) => workflowController.createWorkflow(req, res, next));

// Get all workflows
router.get('/', (req, res, next) => workflowController.getWorkflows(req, res, next));

// Get a single workflow
router.get('/:id', (req, res, next) => workflowController.getWorkflowById(req, res, next));

// Delete a workflow
router.delete('/:id', (req, res, next) => workflowController.deleteWorkflow(req, res, next));

module.exports = router;
