import { FeatureExtractionPipeline } from '@xenova/transformers';
import { normalize } from '../utils/calculations';

export const buildEmbed =
  (model: FeatureExtractionPipeline) =>
  async (texts: string[]): Promise<number[][]> => {
    const embeddings: number[][] = [];
    if (!model) {
      throw Error('No model found.');
    }
    for (const text of texts) {
      const output = await model(text, { pooling: 'mean', normalize: false });
      const embedding = Array.from(output.data as Float32Array);
      embeddings.push(normalize(embedding));
    }
    return embeddings;
  };
