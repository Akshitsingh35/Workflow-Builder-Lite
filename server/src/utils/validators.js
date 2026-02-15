const { AppError } = require('./errorHandler');
const { STEP_REGISTRY } = require('../services/stepRegistry');

/**
 * Validate workflow creation payload
 */
const validateWorkflow = (data) => {
    const errors = [];

    // Check name
    if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
        errors.push('Workflow name is required');
    }

    // Check steps
    if (!data.steps || !Array.isArray(data.steps)) {
        errors.push('Steps must be an array');
    } else {
        // Check step count (2-4 steps required)
        if (data.steps.length < 2 || data.steps.length > 4) {
            errors.push('Workflow must have between 2 and 4 steps');
        }

        // Validate each step type
        const validStepTypes = Object.keys(STEP_REGISTRY);
        data.steps.forEach((step, index) => {
            if (!step.type || typeof step.type !== 'string') {
                errors.push(`Step ${index + 1}: type is required`);
            } else if (!validStepTypes.includes(step.type)) {
                errors.push(`Step ${index + 1}: invalid step type "${step.type}". Valid types: ${validStepTypes.join(', ')}`);
            }
        });
    }

    if (errors.length > 0) {
        throw new AppError(errors.join('; '), 400);
    }

    return {
        name: data.name.trim(),
        steps: data.steps
    };
};

/**
 * Validate run workflow payload
 */
const validateRunInput = (data) => {
    const errors = [];

    if (!data.workflowId || typeof data.workflowId !== 'string') {
        errors.push('Workflow ID is required');
    }

    if (!data.inputText || typeof data.inputText !== 'string' || data.inputText.trim().length === 0) {
        errors.push('Input text cannot be empty');
    }

    if (errors.length > 0) {
        throw new AppError(errors.join('; '), 400);
    }

    return {
        workflowId: data.workflowId,
        inputText: data.inputText.trim()
    };
};

module.exports = {
    validateWorkflow,
    validateRunInput
};
