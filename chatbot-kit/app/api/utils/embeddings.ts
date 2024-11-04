import { TogetherAIEmbeddings } from '@langchain/community/embeddings/togetherai';

export function loadEmbeddingsModel() {
  return new TogetherAIEmbeddings({
    apiKey: process.env.TOGETHER_AI_API_KEY,
    modelName: process.env.EMBEDDING_MODEL_NAME,
  });
}