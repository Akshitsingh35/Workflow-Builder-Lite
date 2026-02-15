import prisma from '../services/database.js';
import { validateWorkflow } from '../utils/validators.js';
import { getAvailableSteps } from '../services/stepRegistry.js';
import { AppError } from '../utils/errorHandler.js';

/**
 * Workflow Controller - Handles workflow CRUD operations
 */
class WorkflowController {
    /**
     * Create a new workflow
     * POST /api/workflows
     */
    async createWorkflow(req, res, next) {
        try {
            const validatedData = validateWorkflow(req.body);

            const workflow = await prisma.workflow.create({
                data: {
                    name: validatedData.name,
                    steps: validatedData.steps
                }
            });

            res.status(201).json({
                success: true,
                data: workflow
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get all workflows
     * GET /api/workflows
     */
    async getWorkflows(req, res, next) {
        try {
            const workflows = await prisma.workflow.findMany({
                orderBy: {
                    createdAt: 'desc'
                },
                include: {
                    _count: {
                        select: { runs: true }
                    }
                }
            });

            res.json({
                success: true,
                data: workflows
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get a single workflow by ID
     * GET /api/workflows/:id
     */
    async getWorkflowById(req, res, next) {
        try {
            const { id } = req.params;

            const workflow = await prisma.workflow.findUnique({
                where: { id },
                include: {
                    runs: {
                        orderBy: { createdAt: 'desc' },
                        take: 5
                    }
                }
            });

            if (!workflow) {
                throw new AppError('Workflow not found', 404);
            }

            res.json({
                success: true,
                data: workflow
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Delete a workflow
     * DELETE /api/workflows/:id
     */
    async deleteWorkflow(req, res, next) {
        try {
            const { id } = req.params;

            await prisma.workflow.delete({
                where: { id }
            });

            res.json({
                success: true,
                message: 'Workflow deleted successfully'
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get available step types
     * GET /api/workflows/steps
     */
    async getAvailableSteps(req, res, next) {
        try {
            const steps = getAvailableSteps();

            res.json({
                success: true,
                data: steps
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new WorkflowController();
