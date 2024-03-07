import { NextFunction, Request, Response } from 'express';
import z, { AnyZodObject } from 'zod';
import { zodErrorSimplify, getErrorMessage } from '../utils/utils';

export const userSchema = z.object({
  name: z.string().min(1).max(32),
  email: z.string().email(),
  userId: z.string().min(1).max(32),
});

export const validateBodyData =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      return next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          status: 400,
          message: 'Validation Error',
          data: zodErrorSimplify(error),
          success: false,
        });
      }
      return next(getErrorMessage(error));
    }
  };
