const stepExecutor = require('./stepExecutor');

/**
 * Workflow Engine - Orchestrates workflow execution
 * 
 * Handles:
 * - Sequential step execution
 * - Passing output from one step to the next
 * - Collecting execution metrics
 */
class WorkflowEngine {
    /**
     * Execute a complete workflow
     * @param {Array<{type: string}>} steps - Array of step configurations
     * @param {string} inputText - Initial input text
     * @returns {Promise<Array<{step: string, output: string, executionTimeMs: number}>>}
     */
    async executeWorkflow(steps, inputText) {
        const results = [];
        let currentInput = inputText;

        for (const step of steps) {
            const { output, executionTimeMs } = await stepExecutor.execute(
                step.type,
                currentInput
            );

            results.push({
                step: step.type,
                output,
                executionTimeMs
            });

            // Output of current step becomes input for next step
            currentInput = output;
        }

        return results;
    }

    /**
     * Calculate total execution time for a workflow run
     * @param {Array<{executionTimeMs: number}>} stepOutputs 
     * @returns {number} Total execution time in milliseconds
     */
    getTotalExecutionTime(stepOutputs) {
        return stepOutputs.reduce((total, step) => total + step.executionTimeMs, 0);
    }
}

module.exports = new WorkflowEngine();
