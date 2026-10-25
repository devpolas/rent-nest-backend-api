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
  const providers = getChatModels();

  if (providers.length === 0) {
    res.status(503).json({
      success: false,
      message: "No AI providers are configured.",
    });
    return;
  }

  if (signal.aborted) return;

  let lastError: unknown = null;

  // Iterate over configured providers in order of priority (e.g., Groq -> Gemini -> DeepSeek)
  for (const provider of providers) {
    if (signal.aborted) return;

    try {
      let streamError: unknown;

      const result = streamText({
        model: provider.model,
        system,
        messages,
        abortSignal: signal,
        maxOutputTokens: 1200,
        maxRetries: 2,

        onError({ error }) {
          streamError = error;
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

      // Surface provider errors inside the loop to trigger the catch block and try the next model
      if (streamError) {
        throw streamError;
      }

      if (!outputStarted) {
        throw new Error(
          `[AI:${provider.name}] Provider finished without producing text.`,
        );
      }

      if (!res.writableEnded) {
        res.end();
      }

      // Stream succeeded! Exit the fallback loop.
      return;
    } catch (error) {
      lastError = error;
      console.warn(
        `[AI:${provider.name}] Failed attempt. Retrying with next provider...`,
        error,
      );

      // SAFETY CHECK: If chunks have already started streaming to the client,
      // we cannot switch models mid-stream. End the response gracefully.
      if (res.headersSent) {
        console.error(
          `[AI:${provider.name}] Error occurred after headers were sent.`,
        );
        if (!res.writableEnded) res.end();
        return;
      }
    }
  }

  // If ALL providers in the list failed:
  if (!res.headersSent && !res.writableEnded) {
    res.status(502).json({
      success: false,
      message:
        "All AI providers failed to generate a response. Please try again.",
      debugError:
        lastError instanceof Error ? lastError.message : String(lastError),
    });
  }
}
