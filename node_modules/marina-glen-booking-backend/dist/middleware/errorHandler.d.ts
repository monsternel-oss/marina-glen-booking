import { Request, Response, NextFunction } from 'express';
interface CustomError extends Error {
    statusCode?: number;
    status?: string;
    isOperational?: boolean;
}
export declare const errorHandler: (err: CustomError, _req: Request, res: Response, _next: NextFunction) => void;
export {};
//# sourceMappingURL=errorHandler.d.ts.map