import { streamText, type ModelMessage } from "ai";
import type { Response } from "express";
import { getChatModels } from "./models";

type StreamChatOptions = {
  messages: ModelMessage[];
  system: string;
  res: Response;
  signal: AbortSignal;
};

export async function streamChatWithFallback({
  messages,
  system,
  res,
  signal,
}: StreamChatOptions): Promise<void> {
  const [provider] = getChatModels();

  if (!provider) {
    res.status(503).json({
      success: false,
      message: "Gemini API key is not configured.",
    });
    return;
  }

  if (signal.aborted) return;

  try {
    const result = streamText({
      model: provider.model,
      system,
      messages,
      abortSignal: signal,
      maxOutputTokens: 1200,
      maxRetries: 0,

      onError({ error }) {
        console.error(`[AI:${provider.name}] Stream error`, error);
      },

      onFinish({ finishReason }) {
        console.info(`[AI:${provider.name}] Finished`, {
          finishReason,
        });
      },
    });

    const iterator = result.textStream[Symbol.asyncIterator]();
    let outputStarted = false;

    while (!signal.aborted) {
      const part = await iterator.next();

      if (signal.aborted) return;
      if (part.done) break;
      if (!part.value) continue;

      if (!outputStarted) {
        outputStarted = true;
        res.status(200);
        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.setHeader("Cache-Control", "no-cache, no-transform");
        res.setHeader("X-Accel-Buffering", "no");
        res.setHeader("X-AI-Provider", provider.name);
      }

      res.write(part.value);
    }

    if (signal.aborted) return;

    if (!outputStarted) {
      throw new Error("Gemini returned an empty text stream.");
    }

    if (!res.writableEnded) {
      res.end();
    }
  } catch (error) {
    console.error(`[AI:${provider.name}] Failed`, error);

    if (!res.headersSent && !res.writableEnded) {
      res.status(502).json({
        success: false,
        message: "Gemini could not generate a response. Please try again.",
      });
    } else if (!res.writableEnded) {
      // The stream has started, so a JSON error response is no longer safe.
      res.destroy(
        error instanceof Error ? error : new Error("Gemini stream failed."),
      );
    }
  }
}
