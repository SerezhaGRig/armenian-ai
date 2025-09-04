import { Router, Request, Response, NextFunction } from 'express';
import { askSchema } from '../validators';
import { buildEmbed, getEmbeddingModel } from '../services/embedding';
import { mockLLMStream } from '../services/llm';
import { VectorService } from '../services/vector';

const router = Router();

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { query, topK } = askSchema.parse(req.body);

    console.info(`Processing query: ${query}`);
    const embed = buildEmbed(await getEmbeddingModel());
    const [queryVector] = await embed([query]);
    const vectorService = await VectorService.getVectorService();

    const results = await vectorService.search(queryVector, topK);

    const context = results.map((r) => `[${r.id}]: ${r.text}`).join('\n\n');

    const prompt = `Based on the following context, answer the question. Context: ${context} Question: ${query}`;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    for await (const token of mockLLMStream(prompt)) {
      res.write(`data: ${JSON.stringify({ type: 'token', text: token })}\n\n`);
    }

    const citations = results.map((r) => ({ id: r.id, score: r.score }));
    res.write(`data: ${JSON.stringify({ type: 'final', citations })}\n\n`);

    res.end();
  } catch (error) {
    next(error);
  }
});

export const askRouter = router;
