import * as z from "zod";

export const CreatePropertyImageSchema = z.object({
  propertyId: z.uuid(),

  images: z.array(z.url()).min(1),
});

export const SetThumbnailSchema = z.object({
  propertyId: z.uuid(),
});

export type CreatePropertyImageInput = z.infer<
  typeof CreatePropertyImageSchema
>;

export type SetThumbnailInput = z.infer<typeof SetThumbnailSchema>;
