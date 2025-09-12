import { pipeline } from '@xenova/transformers';

let embedder: any;

export async function loadEmbedder() {
  if (!embedder) {
    embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }
  return embedder;
}

export async function getEmbedding(text: string): Promise<number[]> {
  const model = await loadEmbedder();
  const output = await model(text);
  return output[0]; // [embedding vector]
}
