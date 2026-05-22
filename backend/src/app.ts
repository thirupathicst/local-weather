import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';

import weatherRoutes from './routes/weatherRoutes.js';
import { errorHandler } from './middleware/errorMiddleware.js';
import { setupSwagger } from './config/swagger.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json({
    message: 'API Explorer Backend Running'
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    uptime: process.uptime()
  });
});

app.use('/api/weather', weatherRoutes);
setupSwagger(app);
app.use(errorHandler);

export default app;