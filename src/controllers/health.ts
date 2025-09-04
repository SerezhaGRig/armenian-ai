import { Router, Request, Response, NextFunction } from 'express';
import { VectorService } from '../services/vector';

const router = Router();

router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const vectorService = await VectorService.getVectorService();

    const vectorCount = await vectorService.getCount();

    res.json({
      status: 'ok',
      vectorCount,
      modelInfo: {
        embedding: process.env.EMBEDDING_MODEL || 'Xenova/all-MiniLM-L6-v2',
        llm: 'mock',
      },
    });
  } catch (error) {
    next(error);
  }
});

export const healthRouter = router;
