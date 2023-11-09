import { varchar, boolean, date, pgTable, uuid, serial,  } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { getCustomers } from "@/lib/api/customers/queries";
import { users } from ".";

export const customers = pgTable('customers', {
  // [ ] TODO: change to uuid
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  lastName: varchar("last_name", { length: 256 }).notNull(),
  email: varchar("email", { length: 256 }).notNull().unique(),
  emailVerifier: boolean("email_verifier").default(false),
  rut: varchar("rut", { length: 256 }).notNull(),
  birthday: date("birthday").notNull(),
  userId: varchar("user_id", { length: 256 }).references(() => users.id, { onDelete: "cascade" }).notNull(),
});


// Schema for customers - used to validate API requests
export const insertCustomerSchema = createInsertSchema(customers, { birthday: z.coerce.date() });

export const insertCustomerParams = createSelectSchema(customers, {
  name: z.coerce.string().min(2, { message: "Name must be at least 2 character long" }),
  lastName: z.coerce.string().min(2, { message: "Last name must be at least 2 character long" }),
  rut: z.coerce.string().min(2, { message: "Rut must be at least 2 character long" })
    .max(12, { message: "Rut must be at most 12 character long" }),
  email: z.coerce.string().email(),
  emailVerifier: z.coerce.boolean(),
  birthday: z.coerce.date()
}).omit({ 
  id: true,
  userId: true
});

export const updateCustomerSchema = createSelectSchema(customers, { birthday: z.coerce.date() });

export const updateCustomerParams = createSelectSchema(customers,{
  email: z.coerce.string().email(),
  emailVerifier: z.coerce.boolean(),
  birthday: z.coerce.date()
}).omit({ 
  userId: true
});

export const customerIdSchema = updateCustomerSchema.pick({ id: true });

// Types for customers - used to type API request params and within Components
export type Customer = z.infer<typeof updateCustomerSchema>;
export type NewCustomer = z.infer<typeof insertCustomerSchema>;
export type NewCustomerParams = z.infer<typeof insertCustomerParams>;
export type UpdateCustomerParams = z.infer<typeof updateCustomerParams>;
export type CustomerId = z.infer<typeof customerIdSchema>["id"];
    
// this type infers the return from getCustomers() - meaning it will include any joins
export type CompleteCustomer = Awaited<ReturnType<typeof getCustomers>>["customers"][number];

