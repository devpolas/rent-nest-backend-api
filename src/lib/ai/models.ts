import { createGroq } from "@ai-sdk/groq";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import type { LanguageModel } from "ai";
import config from "../../config";

export type ChatProvider = {
  name: string;
  model: LanguageModel;
};

export function getChatModels(): ChatProvider[] {
  const providers: ChatProvider[] = [];

  // 3. OpenRouter (Tertiary fallback provider supporting free model tags like ':free')
  if (config.open_router_api_key) {
    const openrouter = createOpenRouter({ apiKey: config.open_router_api_key });
    providers.push({
      name: "openrouter",
      model: openrouter(
        config.open_router_model || "deepseek/deepseek-r1:free",
      ),
    });
  }

  // 1. Groq (Primary testing provider - fast, free tier, no 503 errors)
  if (config.groq_api_key) {
    const groq = createGroq({ apiKey: config.groq_api_key });
    providers.push({
      name: "groq",
      model: groq(config.groq_model || "llama-3.3-70b-versatile"),
    });
  }

  // 2. Gemini (Secondary provider)
  if (config.gemini_api_key) {
    const google = createGoogleGenerativeAI({ apiKey: config.gemini_api_key });
    providers.push({
      name: "gemini",
      model: google(config.gemini_model || "gemini-3.8-flash"),
    });
  }

  return providers;
}
