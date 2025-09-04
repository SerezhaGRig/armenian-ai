import { Router, Request, Response, NextFunction } from 'express';
import { ingestSchema } from '../validators';
import { Chunk } from '../types';
import { buildChunking } from '../utils/chunking';
import { buildEmbed, getEmbeddingModel } from '../services/embedding';
import { VectorService } from '../services/vector';

const router = Router();

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const vectorService = await VectorService.getVectorService();

    const embed = buildEmbed(await getEmbeddingModel());

    const startTime = Date.now();

    const documents = ingestSchema.parse(req.body);

    console.info(`Ingesting ${documents.length} documents`);

    const allChunks: Chunk[] = [];

    const chunk = buildChunking();

    for (const doc of documents) {
      const textChunks = chunk(doc.text);

      const embeddings = await embed(textChunks);

      for (let i = 0; i < textChunks.length; i++) {
        allChunks.push({
          id: `${doc.id}#chunk${i}`,
          text: textChunks[i],
          metadata: doc.metadata,
          vector: embeddings[i],
        });
      }
    }

    await vectorService.save(allChunks);

    const timeTaken = Date.now() - startTime;

    res.json({
      docsIngested: documents.length,
      chunksCreated: allChunks.length,
      timeTaken,
    });
  } catch (error) {
    next(error);
  }
});

export const ingestRouter = router;
