import { getKnowledgeDocuments } from "./knowledge.service";

const stopWords = new Set([
  "a",
  "an",
  "and",
  "are",
  "can",
  "do",
  "for",
  "how",
  "i",
  "in",
  "is",
  "it",
  "me",
  "my",
  "of",
  "on",
  "or",
  "the",
  "to",
  "what",
  "where",
  "which",
  "with",
  "you",
  "your",
]);

function tokenize(value: string): string[] {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 1 && !stopWords.has(word));
}

export function retrieveKnowledge(query: string, limit = 4): string[] {
  const queryTokens = [...new Set(tokenize(query))];

  if (!queryTokens.length) return [];

  return getKnowledgeDocuments()
    .map((document) => {
      const titleTokens = tokenize(document.title);
      const keywordTokens = document.keywords.flatMap(tokenize);
      const contentTokens = tokenize(document.content);

      const score = queryTokens.reduce((total, token) => {
        if (titleTokens.includes(token)) return total + 4;
        if (keywordTokens.includes(token)) return total + 3;
        if (contentTokens.includes(token)) return total + 1;
        return total;
      }, 0);

      return { document, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ document }) => `${document.title}\n${document.content}`);
}
