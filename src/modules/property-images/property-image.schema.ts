import * as z from "zod";

export const CreatePropertyImageSchema = z.object({
  images: z
    .array(
      z.object({
        url: z.url(),
        publicId: z.string().min(1),
      }),
    )
    .min(1),
});

export type CreatePropertyImageInput = z.infer<
  typeof CreatePropertyImageSchema
>;
