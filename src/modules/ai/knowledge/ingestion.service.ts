import { getKnowledgeDocuments } from "./knowledge.service";

/**
 * The initial knowledge base is code-backed, so no database ingestion
 * is needed. This function provides a consistent entry point for a
 * future database/vector-backed ingestion pipeline.
 */
export async function ingestKnowledgeBase() {
  const documents = getKnowledgeDocuments();

  return {
    indexed: documents.length,
    storage: "static",
    message: "Curated RentNest knowledge is ready for retrieval.",
  };
}
