import type { Request, Response } from "express";
import httpStatus from "http-status";
import type { ModelMessage } from "ai";
import { catchAsync } from "../../utils/catchAsync";
import { AppError } from "../../utils/appError";
import { buildSystemPrompt } from "../../lib/ai/prompts";
import { streamChatWithFallback } from "../../lib/ai/chat";
import { prepareChatContext } from "./ai.service";
import { chatRequestSchema } from "./ai.schema";

function extractText(message: {
  content?: string | undefined;
  parts?:
    | Array<{
        type: string;
        text?: string | undefined;
      }>
    | undefined;
}): string {
  if (typeof message.content === "string") {
    return message.content.trim();
  }

  return (
    message.parts
      ?.filter((part) => part.type === "text")
      .map((part) => part.text ?? "")
      .join("\n")
      .trim() ?? ""
  );
}

const chat = catchAsync(async (req: Request, res: Response) => {
  const parsed = chatRequestSchema.parse(req.body);

  const latestUserMessage = [...parsed.messages]
    .reverse()
    .find((message) => message.role === "user");

  const query = latestUserMessage ? extractText(latestUserMessage) : "";

  if (!query) {
    throw new AppError(
      "Please provide a non-empty user message.",
      httpStatus.BAD_REQUEST,
    );
  }

  const messages: ModelMessage[] = parsed.messages
    .filter(
      (message) => message.role === "user" || message.role === "assistant",
    )
    .map((message) => ({
      role: message.role as "user" | "assistant",
      content: extractText(message),
    }))
    .filter((message) => message.content.length > 0)
    .slice(-12);

  const { knowledge, properties } = await prepareChatContext(query);

  const system = buildSystemPrompt({
    knowledge,
    properties,
  });

  const abortController = new AbortController();

  res.on("close", () => {
    if (!res.writableEnded) abortController.abort();
  });

  await streamChatWithFallback({
    messages,
    system,
    res,
    signal: abortController.signal,
  });
});

export const aiController = {
  chat,
};
