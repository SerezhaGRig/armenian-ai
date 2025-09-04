import { FeatureExtractionPipeline, pipeline } from '@xenova/transformers';
import { normalize } from '../utils/calculations';

const modelName = process.env.EMBEDDING_MODEL || 'Xenova/all-MiniLM-L6-v2';

let model: FeatureExtractionPipeline | null = null;

export const getEmbeddingModel = async () => {
  if (!model) {
    model = await pipeline('feature-extraction', modelName);
  }
  return model;
};

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
