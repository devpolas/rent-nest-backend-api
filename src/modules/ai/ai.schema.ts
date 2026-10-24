import * as z from "zod";

const messagePartSchema = z
  .object({
    type: z.string(),
    text: z.string().max(4000).optional(),
  })
  .loose();

const chatMessageSchema = z
  .object({
    role: z.enum(["user", "assistant", "system"]),
    content: z.string().max(4000).optional(),
    parts: z.array(messagePartSchema).max(100).optional(),
  })
  .loose()
  .refine(
    (message) =>
      typeof message.content === "string" || Array.isArray(message.parts),
    "Message must contain text content.",
  );

export const chatRequestSchema = z.object({
  messages: z.array(chatMessageSchema).min(1).max(20),
});

export const knowledgeSearchSchema = z.object({
  q: z.string().trim().min(1).max(300),
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;
