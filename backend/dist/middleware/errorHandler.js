export const errorHandler = (err, _req, res, _next) => {
    let error = { ...err };
    error.message = err.message;
    // Log error for debugging
    console.error('Error:', err);
    // Default error response
    let statusCode = error.statusCode || 500;
    let message = error.message || 'Server Error';
    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        message = 'Resource not found';
        statusCode = 404;
    }
    // Mongoose duplicate key
    if (err.name === 'MongoError' && err.code === 11000) {
        message = 'Duplicate field value entered';
        statusCode = 400;
    }
    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map((val) => val.message);
        message = `Validation Error: ${errors.join(', ')}`;
        statusCode = 400;
    }
    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        message = 'Invalid token';
        statusCode = 401;
    }
    if (err.name === 'TokenExpiredError') {
        message = 'Token expired';
        statusCode = 401;
    }
    res.status(statusCode).json({
        success: false,
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};
//# sourceMappingURL=errorHandler.js.map