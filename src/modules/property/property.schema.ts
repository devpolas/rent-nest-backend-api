import * as z from "zod";

const AvailabilityStatusSchema = z.enum([
  "AVAILABLE",
  "RESERVED",
  "RENTED",
  "UNAVAILABLE",
]);

const PropertyStatusSchema = z.enum([
  "PENDING",
  "APPROVED",
  "REJECTED",
  "RENTED",
  "ARCHIVED",
]);

const PropertyBaseSchema = z.object({
  title: z.string().min(10).max(255),

  description: z.string().min(15),

  rent: z.number().positive(),

  securityDeposit: z.number().nonnegative(),

  bedrooms: z.number().int().positive(),

  bathrooms: z.number().int().positive(),

  area: z.number().positive(),

  availableFrom: z.coerce.date().optional(),

  availability: AvailabilityStatusSchema.optional(),

  locationId: z.uuid().optional(),

  categoryId: z.uuid(),

  images: z.array(z.url()).min(1),

  amenities: z.array(z.uuid()).min(1),

  features: z.array(z.uuid()).min(1),

  rules: z.array(z.uuid()).min(1),
});

// Landlord/Admin create base
export const PropertySchema = PropertyBaseSchema;

// Admin create
export const AdminPropertySchema = PropertyBaseSchema.extend({
  landlordId: z.uuid(),

  status: PropertyStatusSchema.optional(),
});

// Normal update
export const PropertyUpdateSchema = PropertyBaseSchema.partial();

// Admin update
export const AdminPropertyUpdateSchema = PropertyBaseSchema.partial().extend({
  landlordId: z.uuid().optional(),

  status: PropertyStatusSchema.optional(),
});

export type PropertyInputType = z.infer<typeof PropertySchema>;

export type AdminPropertyInputType = z.infer<typeof AdminPropertySchema>;

export type PropertyUpdateInputType = z.infer<typeof PropertyUpdateSchema>;

export type AdminPropertyUpdateInputType = z.infer<
  typeof AdminPropertyUpdateSchema
>;
