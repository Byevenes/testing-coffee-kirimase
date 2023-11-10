import { date, integer, serial, varchar, pgTable } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { customers } from "./customers"
import { getOrders } from "@/lib/api/orders/queries";
import { users } from ".";

export const orders = pgTable('orders', {
  id: serial("id").primaryKey(),
  ordersDate: date("orders_date").notNull(),
  customerId: integer("customer_id").references(() => customers.id, { onDelete: "cascade" }).notNull(),
  userId: varchar("user_id", { length: 256 }).references(() => users.id, { onDelete: "cascade" }).notNull(),
});


// Schema for orders - used to validate API requests
export const insertOrderSchema = createInsertSchema(orders);

export const insertOrderParams = createSelectSchema(orders, {
  ordersDate: z.coerce.string(),
  customerId: z.coerce.number()
}).omit({ 
  id: true,
  userId: true
});

export const updateOrderSchema = createSelectSchema(orders);

export const updateOrderParams = createSelectSchema(orders,{
  ordersDate: z.coerce.string(),
  customerId: z.coerce.number()
}).omit({ 
  userId: true
});

export const orderIdSchema = updateOrderSchema.pick({ id: true });

// Types for orders - used to type API request params and within Components
export type Order = z.infer<typeof updateOrderSchema>;
export type NewOrder = z.infer<typeof insertOrderSchema>;
export type NewOrderParams = z.infer<typeof insertOrderParams>;
export type UpdateOrderParams = z.infer<typeof updateOrderParams>;
export type OrderId = z.infer<typeof orderIdSchema>["id"];
    
// this type infers the return from getOrders() - meaning it will include any joins
export type CompleteOrder = Awaited<ReturnType<typeof getOrders>>["orders"][number];

