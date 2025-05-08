"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = exports.AppError = void 0;
class AppError extends Error {
    constructor(message, statusCode = 500, details) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.details = details;
    }
}
exports.AppError = AppError;
const handleError = (res, error) => {
    const statusCode = error instanceof AppError ? error.statusCode : 500;
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(statusCode).json({
        success: false,
        error: {
            message,
            details: process.env.NODE_ENV === 'development' ? error : undefined
        }
    });
};
exports.handleError = handleError;
