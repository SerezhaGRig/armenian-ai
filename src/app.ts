import express, { Express } from 'express';
import dotenv from 'dotenv';
import { ingestRouter } from './controllers/ingest';
import { askRouter } from './controllers/ask';
import { healthRouter } from './controllers/health';
import { errorHandler } from './utils/error';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

app.use('/ingest', ingestRouter);
app.use('/ask', askRouter);
app.use('/health', healthRouter);

app.use(errorHandler);

app.listen(port, () => {
  console.info(`Server running on port ${port}`);
});
