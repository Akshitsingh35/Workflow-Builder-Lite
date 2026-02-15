/**
 * API Service - Centralized API calls (using axios)
 */

/**
 * API Service - Centralized API calls (using axios)
 */

import axios from 'axios';

// Use VITE_API_URL from environment, fallback to /api for dev proxy
const API_BASE = import.meta.env.VITE_API_URL || '/api';

/**
 * Handle API response (axios version)
 */
function handleResponse(response) {
    // Axios automatically throws for non-2xx, so just return data
    return response.data;
}

/**
 * Workflow API
 */
export const workflowApi = {
    /**
     * Get all workflows
     */
    async getAll() {
        const response = await axios.get(`${API_BASE}/workflows`);
        return handleResponse(response);
    },

    /**
     * Get a single workflow by ID
     */
    async getById(id) {
        const response = await axios.get(`${API_BASE}/workflows/${id}`);
        return handleResponse(response);
    },

    /**
     * Create a new workflow
     */
    async create(data) {
        const response = await axios.post(`${API_BASE}/workflows`, data);
        return handleResponse(response);
    },

    /**
     * Delete a workflow
     */
    async delete(id) {
        const response = await axios.delete(`${API_BASE}/workflows/${id}`);
        return handleResponse(response);
    },

    /**
     * Get available step types
     */
    async getStepTypes() {
        const response = await axios.get(`${API_BASE}/workflows/steps`);
        return handleResponse(response);
    }
};

/**
 * Run API
 */
export const runApi = {
    /**
     * Execute a workflow
     */
    async execute(workflowId, inputText) {
        const response = await axios.post(`${API_BASE}/runs`, { workflowId, inputText });
        return handleResponse(response);
    },

    /**
     * Get run history
     */
    async getHistory(limit = 5) {
        const response = await axios.get(`${API_BASE}/runs?limit=${limit}`);
        return handleResponse(response);
    },

    /**
     * Get a single run by ID
     */
    async getById(id) {
        const response = await axios.get(`${API_BASE}/runs/${id}`);
        return handleResponse(response);
    }
};

/**
 * Health API
 */
export const healthApi = {
    /**
     * Get system health status
     */
    async getStatus() {
        const response = await axios.get(`${API_BASE}/health`);
        return handleResponse(response);
    }
};
