import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import dotenv from 'dotenv';
import Router from './src/routes/index';
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

app.use('/api/v1', Router);

app.get('/', (req, res) => {
  res.send('Hello World');
});

// global error handler
interface CustomError extends Error {
  status?: number;
}

app.use(
  (
    err: CustomError,
    req: Request,
    res: Response,
    next: NextFunction
  ): Response => {
    console.log(err);
    const errorStatus: number = err.status || 500;
    const errorMessage: string =
      err.message || 'Something went wrong, Try again!';

    return res.status(errorStatus).json({
      status: errorStatus,
      message: errorMessage,
      stack: err.stack,
      success: false,
      data: null,
    });
  }
);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
