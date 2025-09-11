import fs from 'fs';
import path from 'path';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { CharacterTextSplitter } from 'langchain/text_splitter';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { Document } from 'langchain/document';

let vectorStore: MemoryVectorStore | null = null;
let embeddings: GoogleGenerativeAIEmbeddings | null = null;

async function loadAndEmbedDocs(): Promise<MemoryVectorStore> {
  const filePath = path.join(
    __dirname,
    '../data/stress_management_students.txt',
  );
  const rawText = fs.readFileSync(filePath, 'utf-8');

  const splitter = new CharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50,
  });

  const docs: Document[] = await splitter.createDocuments([rawText]);

  embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GOOGLE_API_KEY!,
    modelName: 'embedding-001',
  });

  const store = await MemoryVectorStore.fromDocuments(docs, embeddings);
  return store;
}

export async function queryDocuments(user_query: string): Promise<string> {
  if (!vectorStore) {
    vectorStore = await loadAndEmbedDocs();
  }

  if (!embeddings) {
    throw new Error('Embeddings not initialized');
  }

  // Embed the query text to vector
  const queryVector = await embeddings.embedQuery(user_query);

  // Search similar docs with vector + score
  const resultsWithScores = await vectorStore.similaritySearchVectorWithScore(
    queryVector,
    2,
  );

  // Extract docs only
  const results = resultsWithScores.map(([doc, score]) => doc);

  const topSnippets = results.map((doc) => doc.pageContent).join('\n');

  const model = new ChatGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY!,
    model: 'gemini-1.5-flash',
    temperature: 0.5,
  });

  const instruction = `
You are a precise assistant.
- Pick only the most relevant insights.
- Reply in maximum 5–10 words.
- Be clear and to the point.
- Avoid long explanations or unnecessary details.
  `;

  const input = `${instruction}\nUser: ${user_query}\nRelevant Info:\n${topSnippets}`;

  // Use any to bypass TS error for generate method
  const response = await (model as any).generate([input]);
  const text = response.generations[0][0].text;
  return text.trim() ?? 'No answer found.';
}
