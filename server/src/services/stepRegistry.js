/**
 * Step Registry - Centralized configuration for all workflow step types
 * 
 * Each step defines:
 * - usesLLM: boolean - whether this step requires LLM processing
 * - promptTemplate: function - generates the prompt for LLM steps
 * - process: function - for non-LLM steps, the processing logic
 */

export const STEP_REGISTRY = {
    /**
     * Clean step - removes extra whitespace, normalizes text
     * Non-LLM step
     */
    clean: {
        usesLLM: false,
        description: 'Clean and normalize text',
        process: (input) => {
            return input
                .replace(/\s+/g, ' ')           // Replace multiple spaces with single space
                .replace(/\n+/g, '\n')          // Replace multiple newlines with single newline
                .replace(/^\s+|\s+$/g, '')      // Trim leading/trailing whitespace
                .replace(/[^\S\n]+/g, ' ');     // Normalize other whitespace
        }
    },

    /**
     * Summarize step - creates a concise summary
     * LLM step
     */
    summarize: {
        usesLLM: true,
        description: 'Generate a concise summary',
        promptTemplate: (input) => `Please provide a clear and concise summary of the following text. Focus on the main points and key information.

Text to summarize:
${input}

Summary:`
    },

    /**
     * Extract key points step - extracts main points as bullet list
     * LLM step
     */
    extract_keypoints: {
        usesLLM: true,
        description: 'Extract key points as bullet list',
        promptTemplate: (input) => `Extract the main key points from the following text. Present them as a clear bullet-point list.

Text:
${input}

Key Points:`
    },

    /**
     * Tag category step - assigns relevant category tags
     * LLM step
     */
    tag_category: {
        usesLLM: true,
        description: 'Assign category tags',
        promptTemplate: (input) => `Analyze the following text and assign 2-5 relevant category tags. Return only the tags, comma-separated.

Text:
${input}

Tags:`
    },

    /**
     * Sentiment step - analyzes emotional tone
     * LLM step
     */
    sentiment: {
        usesLLM: true,
        description: 'Analyze sentiment and tone',
        promptTemplate: (input) => `Analyze the sentiment and emotional tone of the following text. Provide a brief assessment including the overall sentiment (positive/negative/neutral) and any notable emotional undertones.

Text:
${input}

Sentiment Analysis:`
    },

    /**
     * Generate title step - creates a descriptive title
     * LLM step
     */
    generate_title: {
        usesLLM: true,
        description: 'Generate a descriptive title',
        promptTemplate: (input) => `Generate a clear, descriptive, and engaging title for the following text. The title should capture the main topic or theme.

Text:
${input}

Title:`
    }
};

/**
 * Get all available step types
 */
export function getAvailableSteps() {
    return Object.entries(STEP_REGISTRY).map(([type, config]) => ({
        type,
        description: config.description,
        usesLLM: config.usesLLM
    }));
}

// module.exports = {
//     STEP_REGISTRY,
//     getAvailableSteps
// };
