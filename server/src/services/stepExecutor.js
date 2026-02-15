import { STEP_REGISTRY } from './stepRegistry.js';
import llmService from './llmService.js';
import { AppError } from '../utils/errorHandler.js';

/**
 * Step Executor - Executes individual workflow steps
 */
class StepExecutor {
    /**
     * Execute a single step
     * @param {string} stepType - The type of step to execute
     * @param {string} input - The input text for the step
     * @returns {Promise<{output: string, executionTimeMs: number}>}
     */
    async execute(stepType, input) {
        const startTime = Date.now();

        const stepConfig = STEP_REGISTRY[stepType];

        if (!stepConfig) {
            throw new AppError(`Unknown step type: ${stepType}`, 400);
        }

        let output;

        if (stepConfig.usesLLM) {
            // LLM-based step
            const prompt = stepConfig.promptTemplate(input);
            output = await llmService.complete(prompt);
        } else {
            // Non-LLM step (direct processing)
            output = stepConfig.process(input);
        }

        const executionTimeMs = Date.now() - startTime;

        return {
            output,
            executionTimeMs
        };
    }
}

export default new StepExecutor();
