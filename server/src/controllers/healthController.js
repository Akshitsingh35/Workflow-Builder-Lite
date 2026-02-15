import prisma from '../services/database.js';
import llmService from '../services/llmService.js';

/**
 * Health Controller - System health and status checks
 */
class HealthController {
    /**
     * Get system health status
     * GET /api/health
     */
    async getHealth(req, res, next) {
        try {
            const health = {
                server: 'ok',
                database: 'error',
                llm: 'error',
                timestamp: new Date().toISOString()
            };

            // Check database
            try {
                await prisma.$queryRaw`SELECT 1`;
                health.database = 'ok';
            } catch (dbError) {
                console.error('Database health check failed:', dbError.message);
                health.database = 'error';
            }

            // Check LLM
            try {
                const llmHealthy = await llmService.healthCheck();
                health.llm = llmHealthy ? 'ok' : 'error';
            } catch (llmError) {
                console.error('LLM health check failed:', llmError.message);
                health.llm = 'error';
            }

            // Determine overall status
            const allHealthy = health.database === 'ok' && health.llm === 'ok';
            const statusCode = allHealthy ? 200 : 503;

            res.status(statusCode).json({
                success: allHealthy,
                data: health
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Simple liveness check
     * GET /api/health/live
     */
    async getLiveness(req, res) {
        res.json({
            success: true,
            data: {
                status: 'alive',
                timestamp: new Date().toISOString()
            }
        });
    }
}

export default new HealthController();
