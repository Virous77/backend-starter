import { NextFunction, Response, Request } from 'express';
import { ZodError } from 'zod';

type TError = {
  status: number;
  message: string;
};

interface CustomError extends Error {
  status?: number;
}

export const createError = ({ status, message }: TError) => {
  const err: CustomError = new Error();
  (err.status = status), (err.message = message);
  return err;
};

type TResponse = {
  status: number;
  message: string;
  data: any;
  res: Response;
};

export const sendResponse = ({
  res,
  status,
  message,
  data = null,
}: TResponse) => {
  return res.status(status).json({
    status,
    message,
    success: status < 300,
    data,
  });
};

export const handleCallback = (callback: any) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await callback(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

export const zodErrorSimplify = (error: ZodError) => {
  const errors = error.errors
    .map((err) => {
      return {
        field: err.path.join('.'),
      };
    })
    .reduce((acc, curr, idx) => {
      return {
        ...acc,
        [curr.field]: `${curr.field} is ${error.errors[idx]?.code}`,
      };
    }, {});
  return errors;
};

export const getErrorMessage = (error: unknown): { message: string } => {
  let message = 'An unknown error occurred';
  if (error instanceof Error) {
    message = error.message;
  } else if (error && typeof error === 'object' && 'message' in error) {
    message = String((error as { message: unknown }).message);
  } else if (typeof error === 'string') {
    message = error;
  } else if (error === null || error === undefined) {
    message = 'An error occurred';
  }
  return { message };
};
