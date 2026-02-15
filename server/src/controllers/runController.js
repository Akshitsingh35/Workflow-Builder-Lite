import prisma from '../services/database.js';
import workflowEngine from '../services/workflowEngine.js';
import { validateRunInput } from '../utils/validators.js';
import { AppError } from '../utils/errorHandler.js';

/**
 * Run Controller - Handles workflow execution and run history
 */
class RunController {
    /**
     * Execute a workflow
     * POST /api/run
     */
    async runWorkflow(req, res, next) {
        try {
            const validatedData = validateRunInput(req.body);
            const workflow = await prisma.workflow.findUnique({ where: { id: validatedData.workflowId } });
            if (!workflow) return next(new AppError('Workflow not found', 404));

            const stepOutputs = await workflowEngine.executeWorkflow(workflow.steps, validatedData.inputText);
            const run = await prisma.run.create({
                data: {
                    workflowId: workflow.id,
                    inputText: validatedData.inputText,
                    stepOutputs
                },
                include: { workflow: { select: { name: true } } }
            });

            res.status(201).json({
                success: true,
                data: {
                    id: run.id,
                    workflowName: run.workflow.name,
                    inputText: run.inputText,
                    stepOutputs: run.stepOutputs,
                    totalExecutionTimeMs: stepOutputs.reduce((sum, s) => sum + (s.executionTimeMs || 0), 0),
                    createdAt: run.createdAt
                }
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get run history
     * GET /api/runs?limit=5
     */
    async getRuns(req, res, next) {
        try {
            const limit = Math.min(parseInt(req.query.limit) || 5, 50);

            const runs = await prisma.run.findMany({
                take: limit,
                orderBy: {
                    createdAt: 'desc'
                },
                include: {
                    workflow: {
                        select: {
                            name: true,
                            steps: true
                        }
                    }
                }
            });

            const formattedRuns = runs.map(run => ({
                id: run.id,
                workflowId: run.workflowId,
                workflowName: run.workflow.name,
                inputText: run.inputText.substring(0, 100) + (run.inputText.length > 100 ? '...' : ''),
                stepOutputs: run.stepOutputs,
                totalExecutionTimeMs: workflowEngine.getTotalExecutionTime(run.stepOutputs),
                createdAt: run.createdAt
            }));

            res.json({
                success: true,
                data: formattedRuns
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get a single run by ID
     * GET /api/runs/:id
     */
    async getRunById(req, res, next) {
        try {
            const { id } = req.params;

            const run = await prisma.run.findUnique({
                where: { id },
                include: {
                    workflow: {
                        select: {
                            name: true,
                            steps: true
                        }
                    }
                }
            });

            if (!run) {
                throw new AppError('Run not found', 404);
            }

            res.json({
                success: true,
                data: {
                    id: run.id,
                    workflowId: run.workflowId,
                    workflowName: run.workflow.name,
                    inputText: run.inputText,
                    stepOutputs: run.stepOutputs,
                    totalExecutionTimeMs: workflowEngine.getTotalExecutionTime(run.stepOutputs),
                    createdAt: run.createdAt
                }
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new RunController();
