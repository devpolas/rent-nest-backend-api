import * as z from "zod";

export const PropertySchema = z.object({
  title: z.string().min(10),
  description: z.string().min(15),
  rent: z.number().positive(),
  securityDeposit: z.number().nonnegative(),
  bedrooms: z.number().int().positive(),
  bathrooms: z.number().int().positive(),
  area: z.number().positive(),
  availableFrom: z.date(),
  availability: z
    .enum(["AVAILABLE", "RESERVED", "RENTED", "UNAVAILABLE"])
    .default("AVAILABLE"),
  status: z
    .enum(["PENDING", "APPROVED", "REJECTED", "RENTED", "ARCHIVED"])
    .default("PENDING"),
  propertyImages: z.array(z.url()),
  propertyTypeId: z.uuid(),
  amenities: z.array(z.uuid()),
  features: z.array(z.uuid()),
  propertyRules: z.array(z.uuid()),
});

export const LocationSchema = z.object({
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  type: z.enum(["PROPERTY"]).default("PROPERTY"),
  country: z.string().min(1),
  division: z.string().min(1),
  district: z.string().min(1),
  city: z.string().min(1),
  village: z.string().min(1),
  postalCode: z.string().min(1),

  addressLine: z.string().optional(),
});

export const CompletePropertySchema = PropertySchema.extend({
  ...LocationSchema.shape,
});

export type PropertyInputType = z.input<typeof CompletePropertySchema>;
