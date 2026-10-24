import { createGoogleGenerativeAI } from "@ai-sdk/google";
import type { LanguageModel } from "ai";
import config from "../../config";

export type ChatProvider = {
  name: string;
  model: LanguageModel;
};

export function getChatModels(): ChatProvider[] {
  if (!config.gemini_api_key) {
    return [];
  }

  const google = createGoogleGenerativeAI({
    apiKey: config.gemini_api_key,
  });

  return [
    {
      name: "gemini",
      model: google("gemini-2.5-flash"),
    },
  ];
}
