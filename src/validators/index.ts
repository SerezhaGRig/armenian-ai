import { z } from 'zod';

export const documentSchema = z.object({
  id: z.string(),
  text: z.string(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const ingestSchema = z.array(documentSchema);

export const askSchema = z.object({
  query: z.string().min(1),
  topK: z.number().int().min(1).max(20).default(5),
  maxTokens: z.number().int().min(1).max(4000).default(200),
});
