import { FeatureExtractionPipeline, pipeline } from '@xenova/transformers';

const modelName = process.env.EMBEDDING_MODEL || 'Xenova/all-MiniLM-L6-v2';

let model: FeatureExtractionPipeline | null = null;

export const getEmbeddingModel = async () => {
  if (!model) {
    model = await pipeline('feature-extraction', modelName);
  }
  return model;
};
