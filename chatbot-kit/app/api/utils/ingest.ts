import { NextResponse } from 'next/server';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { loadEmbeddingsModel } from '../utils/embeddings';
import { loadVectorStore } from '../utils/vector_store';
import { type MongoClient } from 'mongodb';
import { randomUUID } from 'crypto';

export async function Ingest(pdfData: WithImplicitCoercion<string> | { [Symbol.toPrimitive](hint: "string"): string; }) {
    let mongoDbClient: MongoClient | null = null;    
    
    const id = randomUUID()
    
    try {
        /* load from remote pdf URL */
        // const buffer = await response.blob();
        const buffer = Buffer.from(pdfData, 'base64'); // Assuming pdfData is base64 encoded
        const blob = new Blob([buffer], { type: 'application/pdf' });
        const loader = new PDFLoader(blob);
        const rawDocs = await loader.load();

        /* Split text into chunks */
        const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });
        const splitDocs = await textSplitter.splitDocuments(rawDocs);
        // Necessary for Mongo - we'll query on this later.
        for (const splitDoc of splitDocs) {
            splitDoc.metadata.docstore_document_id = id;
        }

        console.log('creating vector store...');

        /* create and store the embeddings in the vectorStore */
        const embeddings = loadEmbeddingsModel();

        const store = await loadVectorStore({
            namespace: id,
            embeddings,
        });
        const vectorstore = store.vectorstore;
        if ('mongoDbClient' in store) {
            mongoDbClient = store.mongoDbClient;
        }

        // embed the PDF documents
        await vectorstore.addDocuments(splitDocs);
    } catch (error) {
        console.log('error', error);
        throw new Error(`Failed to ingest your data ${error}`);
    } finally {
        if (mongoDbClient) {
            await mongoDbClient.close();
        }
    }
}