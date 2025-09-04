import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

export const errorHandler = (
  err: Error,
  _: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  __: NextFunction,
) => {
  console.error('Error occurred', {
    error: err.message,
    stack: err.stack,
  });

  if (err instanceof ZodError) {
    res.status(400).json({
      error: err.message,
      details: err.errors,
    });
  } else {
    res.status(500).json({
      error: 'Internal server error',
    });
  }
};
