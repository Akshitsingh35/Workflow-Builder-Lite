import { GoogleGenerativeAI } from '@google/generative-ai';
import { AppError } from '../utils/errorHandler.js';

/**
 * LLM Service - Handles all Google Gemini API interactions
 */
class LLMService {
    constructor() {
        this.client = null;
        this.model = null;
        this.modelName = 'gemini-2.5-flash'; // Free tier model, fast and capable
    }

    /**
     * Initialize the Gemini client
     * Lazy initialization to allow for environment variable loading
     */
    getModel() {
        if (!this.model) {
            const apiKey = process.env.GEMINI_API_KEY;

            if (!apiKey) {
                throw new AppError('GEMINI_API_KEY environment variable is not set', 500);
            }

            this.client = new GoogleGenerativeAI(apiKey);
            this.model = this.client.getGenerativeModel({ model: this.modelName });
        }
        return this.model;
    }

    /**
     * Generate text completion from Gemini
     * @param {string} prompt - The prompt to send to the LLM
     * @returns {Promise<string>} - The generated text response
     */
    async complete(prompt) {
        try {
            const model = this.getModel();

            const systemPrompt = 'You are a helpful assistant that processes text according to instructions. Provide clear, concise responses.';
            const fullPrompt = `${systemPrompt}\n\n${prompt}`;

            const result = await model.generateContent(fullPrompt);
            const response = await result.response;
            const text = response.text();

            if (!text) {
                throw new AppError('No response received from LLM', 500);
            }

            return text.trim();
        } catch (error) {
            if (error.isOperational) {
                throw error;
            }

            // Handle specific Gemini errors
            if (error.message?.includes('API key')) {
                throw new AppError('Invalid Gemini API key', 401);
            }
            if (error.message?.includes('quota') || error.message?.includes('rate')) {
                throw new AppError('Gemini rate limit exceeded. Please try again later.', 429);
            }
            if (error.message?.includes('blocked') || error.message?.includes('safety')) {
                throw new AppError('Content was blocked by safety filters. Try different input.', 400);
            }

            console.error('LLM Error:', error.message);
            throw new AppError(`LLM processing failed: ${error.message}`, 500);
        }
    }

    /**
     * Health check - make a minimal API call to verify connectivity
     * @returns {Promise<boolean>} - True if healthy
     */
    async healthCheck() {
        try {
            const model = this.getModel();

            const result = await model.generateContent('Say "ok"');
            const response = await result.response;
            const text = response.text();

            return text && text.length > 0;
        } catch (error) {
            console.error('LLM Health Check Failed:', error.message);
            return false;
        }
    }
}

// Export singleton instance
export default new LLMService();
