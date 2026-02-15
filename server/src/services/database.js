import { PrismaClient } from '@prisma/client';

/**
 * Prisma client singleton instance
 * Handles database connections efficiently
 */
const prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
});

// Handle cleanup on application shutdown
process.on('beforeExit', async () => {
    await prisma.$disconnect();
});

export default prisma;
