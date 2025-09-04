export interface Chunk {
  id: string;
  text: string;
  metadata?: Record<string, any>;
  vector: number[];
}
