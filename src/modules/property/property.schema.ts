import * as z from "zod";

export const PropertySchema = z.object({
  title: z.string().min(10),
  description: z.string().min(15),
  rent: z.number().positive(),
  securityDeposit: z.number().nonnegative(),
  bedrooms: z.number().int().positive(),
  bathrooms: z.number().int().positive(),
  area: z.number().positive(),
  availableFrom: z.coerce.date(),
  availability: z
    .enum(["AVAILABLE", "RESERVED", "RENTED", "UNAVAILABLE"])
    .optional(),
  status: z
    .enum(["PENDING", "APPROVED", "REJECTED", "RENTED", "ARCHIVED"])
    .optional(),
  images: z.array(z.url()).min(1),
  categoryId: z.uuid(),
  amenities: z.array(z.uuid()).min(1),
  features: z.array(z.uuid()).min(1),
  rules: z.array(z.uuid()).min(1),
});

export const AdminSchema = z.object({
  landlordId: z.uuid(),
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

export const PropertyUpdateSchema = z.object({
  title: z.string().min(10).optional(),
  description: z.string().min(15).optional(),
  rent: z.number().positive().optional(),
  securityDeposit: z.number().nonnegative().optional(),
  bedrooms: z.number().int().positive().optional(),
  bathrooms: z.number().int().positive().optional(),
  area: z.number().positive().optional(),
  availableFrom: z.coerce.date().optional(),
  availability: z
    .enum(["AVAILABLE", "RESERVED", "RENTED", "UNAVAILABLE"])
    .optional(),
  status: z
    .enum(["PENDING", "APPROVED", "REJECTED", "RENTED", "ARCHIVED"])
    .optional(),
  images: z.array(z.url()).optional(),
  categoryId: z.uuid().optional(),
  amenities: z.array(z.uuid()).min(1).optional(),
  features: z.array(z.uuid()).min(1).optional(),
  rules: z.array(z.uuid()).min(1).optional(),
});

export const LocationUpdateSchema = z.object({
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  country: z.string().min(1).optional(),
  division: z.string().min(1).optional(),
  district: z.string().min(1).optional(),
  city: z.string().min(1).optional(),
  village: z.string().min(1).optional(),
  postalCode: z.string().min(1).optional(),
  addressLine: z.string().optional().optional(),
});

export const AdminUpdateSchema = z.object({
  landlordId: z.uuid().optional(),
});

export const CompletePropertySchema = PropertySchema.extend({
  location: LocationSchema,
});

export const PropertyAdminSchema = CompletePropertySchema.extend({
  ...AdminSchema.shape,
});

export const CompleteUpdatePropertySchema = PropertyUpdateSchema.extend({
  location: LocationUpdateSchema.optional(),
});
export const CompleteUpdateAdminPropertySchema = PropertyUpdateSchema.extend({
  location: LocationUpdateSchema.optional(),
  ...AdminUpdateSchema.shape,
});

export type PropertyInputType = z.infer<typeof CompletePropertySchema>;

export type AdminPropertyInputType = z.infer<typeof PropertyAdminSchema>;

export type PropertyUpdateInputType = z.infer<
  typeof CompleteUpdatePropertySchema
>;

export type AdminPropertyUpdateInputType = z.infer<
  typeof CompleteUpdateAdminPropertySchema
>;
