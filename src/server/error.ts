import { ZodError } from 'zod';
import { Request, Response, NextFunction } from 'express';

export class MonitorerError extends Error {
  constructor(message: string, public data?: Record<string, unknown> | ZodError) {
    super(message);
    this.name = 'MonitorerError';
  }
}

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  console.error('[Global Error Handler]', err);
  if (err instanceof MonitorerError) {
    return res.status(400).json({
      error: err.message,
      ...(err.data && { data: err.data }),
    });
  }

  // // Handle Zod validation errors
  // if (err.name === 'ZodError') {
  //   return res.status(400).json({
  //     error: 'Validation failed',
  //     details: err.errors,
  //   });
  // }

  res.status(500).json({
    error: 'Internal server error',
    ...(process.env.NODE_ENV !== 'production' && { message: err.message }),
  });
}
