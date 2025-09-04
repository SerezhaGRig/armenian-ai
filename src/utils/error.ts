import { Request, Response } from 'express';
import { ErrorWithCode } from '../middlewars/error';

export const errorHandler = (
  err: Error | ErrorWithCode,
  _: Request,
  res: Response,
) => {
  console.error('Error occurred', {
    error: err.message,
    stack: err.stack,
  });

  const statusCode = err instanceof ErrorWithCode ? err.statusCode : 500;

  return res.status(statusCode).json({
    error: 'Internal server error',
    requestId: res.getHeader('X-Request-Id'),
  });
};
