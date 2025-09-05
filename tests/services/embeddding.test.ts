/* eslint-disable @typescript-eslint/require-await */
import { FeatureExtractionPipeline } from '@xenova/transformers';
import { buildEmbed } from '../../src/services/embedding';

type MockOutput = { data: Float32Array };

describe('buildEmbed', () => {
  it('throws an error when no model is provided', async () => {
    const embed = buildEmbed(null as unknown as FeatureExtractionPipeline);

    await expect(embed(['hello'])).rejects.toThrow('No model found.');
  });

  it('returns normalized embeddings for given texts', async () => {
    const mockModel = jest.fn(
      async (): Promise<MockOutput> => ({
        data: new Float32Array([3, 4]),
      }),
    );

    const embed = buildEmbed(mockModel as unknown as FeatureExtractionPipeline);

    const result = await embed(['hello', 'world']);

    expect(mockModel).toHaveBeenCalledTimes(2);

    expect(result).toEqual([
      [0.6, 0.8],
      [0.6, 0.8],
    ]);
  });

  it('calls model with correct parameters', async () => {
    const mockModel = jest.fn(
      async (): Promise<MockOutput> => ({ data: new Float32Array([1]) }),
    );

    const embed = buildEmbed(mockModel as unknown as FeatureExtractionPipeline);

    await embed(['foo']);

    expect(mockModel).toHaveBeenCalledWith('foo', {
      pooling: 'mean',
      normalize: false,
    });
  });
});
