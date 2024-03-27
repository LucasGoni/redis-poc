import { Request, Response, NextFunction } from 'express';

export function requestLogger(req: Request, res: Response, next: NextFunction) {
    const logEntry = {
        timestamp: new Date().toISOString(),
        method: req.method,
        path: req.path,
        query: req.query,
        body: req.body,
    };
    console.log(JSON.stringify(logEntry));
    next();
}


