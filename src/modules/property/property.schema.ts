import * as z from "zod";
import {
  AvailabilityStatus,
  PropertyStatus,
} from "../../../generated/prisma/enums";

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

export const PropertyQuerySchema = z.object({
  search: z.string().optional(),

  category: z.string().optional(),
  categoryId: z.string().optional(),

  country: z.string().optional(),
  division: z.string().optional(),
  district: z.string().optional(),
  city: z.string().optional(),
  village: z.string().optional(),

  minRent: z.string().optional(),
  maxRent: z.string().optional(),

  minArea: z.string().optional(),
  maxArea: z.string().optional(),

  bedrooms: z.string().optional(),
  bathrooms: z.string().optional(),

  availability: z.enum(AvailabilityStatus).optional(),

  status: z.enum(PropertyStatus).optional(),

  amenityIds: z.string().optional(),
  featureIds: z.string().optional(),
  ruleIds: z.string().optional(),

  minRating: z.string().optional(),
  minReviews: z.string().optional(),

  sortBy: z
    .enum([
      "createdAt",
      "rent",
      "area",
      "bedrooms",
      "bathrooms",
      "averageRating",
      "reviewCount",
    ])
    .optional(),

  sortOrder: z.enum(["asc", "desc"]).optional(),

  page: z.string().optional(),

  limit: z.string().optional(),
});

export type PropertyInputType = z.infer<typeof PropertySchema>;
export type AdminPropertyInputType = z.infer<typeof AdminPropertySchema>;
export type PropertyUpdateInputType = z.infer<typeof PropertyUpdateSchema>;
export type AdminPropertyUpdateInputType = z.infer<
  typeof AdminPropertyUpdateSchema
>;

export type PropertyQuery = z.infer<typeof PropertyQuerySchema>;
