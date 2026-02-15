/**
 * Custom application error class
 */
export class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

export const errorHandler = (err, req, res, next) => {
    console.error('Error:', err.message);

    if (err.isOperational) {
        return res.status(err.statusCode).json({
            success: false,
            error: err.message
        });
    }

    // Handle Prisma errors
    if (err.code === 'P2002') {
        return res.status(409).json({
            success: false,
            error: 'A record with this value already exists'
        });
    }

    if (err.code === 'P2025') {
        return res.status(404).json({
            success: false,
            error: 'Record not found'
        });
    }

    // Default error response
    return res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
};

export const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
