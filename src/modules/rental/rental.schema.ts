import * as z from "zod";

export const RentalRequestSchema = z.object({
  propertyId: z.uuid(),
  message: z.string().min(1),
  moveInDate: z.coerce.date(),
  leaseDays: z.int().nonnegative(),
});

export const RentalRequestTenantUpdateSchema = z.object({
  message: z.string().min(1),
  moveInDate: z.coerce.date(),
  leaseDays: z.int().nonnegative(),
});

export const AdminAndOwnerUpdateSchema = z.object({
  status: z
    .enum([
      "PENDING",
      "APPROVED",
      "REJECTED",
      "PAYMENT_PENDING",
      "ACTIVE",
      "COMPLETED",
      "CANCELLED",
    ])
    .optional(),
});

export const RentalRequestAdminAndOwnerUpdateSchema =
  RentalRequestTenantUpdateSchema.extend({
    ...AdminAndOwnerUpdateSchema.shape,
  });

export type RentalRequestTenantUpdateType = z.infer<
  typeof RentalRequestTenantUpdateSchema
>;

export type RentalRequestType = z.infer<typeof RentalRequestSchema>;

export type RentalRequestAdminAndOwnerUpdateType = z.infer<
  typeof RentalRequestAdminAndOwnerUpdateSchema
>;
