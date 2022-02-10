import 'reflect-metadata';
import 'dotenv/config';

import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import 'express-async-errors';
import SwaggerUi from 'swagger-ui-express';
import { errors } from 'celebrate';
import routes from '@shared/infra/http/routes';
import AppError from '@shared/errors/AppError';

import swaggerFile from '@shared/documentation/swagger.json';
import rateLimiter from './middlewares/RateLimiter';

import '@shared/infra/typeorm';
import '@shared/container';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api-docs', SwaggerUi.serve, SwaggerUi.setup(swaggerFile));
app.use(rateLimiter);
app.use(routes);
app.use(errors());
app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response
      .status(err.statusCode)
      .json({ status: 'error', error: err.message });
  }
  console.error(err);
  return response.status(500).json({
    status: 'error',
    error: 'Internal server error.',
  });
});

app.listen(3333, () => {
  console.log('Server started on port 3333!');
});
