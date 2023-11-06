import { text, real, integer, serial, pgTable, json } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { getProducts } from "@/lib/api/products/queries";
import { StoredFile } from "@/types";

export const products = pgTable('products', {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  unitPrice: real("unit_price").notNull().default(0), // real is a float
  unitInStock: integer("unit_in_stock").notNull().default(0),
  unitOnOrder: integer("unit_on_order").notNull().default(0),
  discontinued: integer("discontinued").default(0),
  images: json("images").$type<StoredFile[] | null>().default(null),
  points: integer("points").default(0)
});


// Schema for products - used to validate API requests
export const insertProductSchema = createInsertSchema(products, {
  images: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        url: z.string(),
      })
    )
    .optional()
    .nullable(),
});

export const insertProductParams = createSelectSchema(products, {
  unitPrice: z.coerce.number(),
  unitInStock: z.coerce.number(),
  unitOnOrder: z.coerce.number(),
  discontinued: z.coerce.number(),
  points: z.coerce.number(),
}).omit({
  id: true
});

export const updateProductSchema = createSelectSchema(products, {
  images: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        url: z.string(),
      })
    )
    .optional()
    .nullable(),
});

export const updateProductParams = createSelectSchema(products, {
  unitPrice: z.coerce.number(),
  unitInStock: z.coerce.number(),
  unitOnOrder: z.coerce.number(),
  discontinued: z.coerce.number(),
  points: z.coerce.number()
})

export const productIdSchema = updateProductSchema.pick({ id: true });

// Types for products - used to type API request params and within Components
export type Product = z.infer<typeof updateProductSchema>;
export type NewProduct = z.infer<typeof insertProductSchema>;
export type NewProductParams = z.infer<typeof insertProductParams>;
export type UpdateProductParams = z.infer<typeof updateProductParams>;
export type ProductId = z.infer<typeof productIdSchema>["id"];

// this type infers the return from getProducts() - meaning it will include any joins
export type CompleteProduct = Awaited<ReturnType<typeof getProducts>>["products"][number];

