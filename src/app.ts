import express, { Application, NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';

import Router from './routers/index';

import { AppError, NotFound } from './utils/appResponse';
import logger from './utils/logger';
import bodyParser from 'body-parser';

const app: Application = express();
// Express Middlewares
app.use(helmet());
app.use(cors());
app.use(express.urlencoded({ limit: '25mb', extended: true }));
app.use(express.json());
app.use(bodyParser.json());

// Root Route
app.use('/v1/api/lineHook', Router);
app.get('/OPTION', (req: Request, res: Response) => {
  res.status(200).json();
});

//Route 404
app.use(NotFound);

// middleware全域錯誤處理
app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500;

  logger.error(`${err.statusCode} :${req.path}-${err.message}`);
  res.setHeader('Content-Type', 'application/json'); // 確保回傳 JSON
  if (process.env.NODE_ENV === 'dev') {
    return res.status(err.statusCode).json({ message: err.message });
  } else {
    return res.status(err.statusCode).json({ message: err.message });
  }
});

export default app;
