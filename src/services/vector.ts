import fs from 'fs/promises';
import path from 'path';
import { Chunk } from '../types';
import { cosine } from '../utils/calculations';

const storagePath = process.env.VECTOR_STORAGE_PATH || './data/vectors.json';

let vectorService: VectorService | null = null;

export class VectorService {
  private async ensureStorage(): Promise<void> {
    const dir = path.dirname(storagePath);
    await fs.mkdir(dir, { recursive: true });

    try {
      await fs.access(storagePath);
    } catch {
      await fs.writeFile(storagePath, '[]');
    }
  }

  async save(chunks: Chunk[]): Promise<void> {
    const existing = await this.load();
    const updated = [...existing, ...chunks];
    await fs.writeFile(storagePath, JSON.stringify(updated, null, 2));
  }

  async load(): Promise<Chunk[]> {
    const data = await fs.readFile(storagePath, 'utf-8');
    const chunks: Chunk[] = JSON.parse(data) as Chunk[];
    return chunks;
  }

  async search(
    queryVector: number[],
    topK: number,
  ): Promise<Array<Chunk & { score: number }>> {
    const chunks = await this.load();

    const scored = chunks.map((chunk) => ({
      ...chunk,
      score: cosine(queryVector, chunk.vector),
    }));

    scored.sort((a, b) => b.score - a.score);

    return scored.slice(0, topK);
  }

  async getCount(): Promise<number> {
    const chunks = await this.load();
    return chunks.length;
  }

  public static async getVectorService(): Promise<VectorService> {
    if (!vectorService) {
      vectorService = new VectorService();
      await vectorService.ensureStorage();
    }
    return vectorService;
  }
}
