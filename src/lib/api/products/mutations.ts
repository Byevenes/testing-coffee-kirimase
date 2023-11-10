import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import {
  insertProductSchema,
  NewProductParams,
  ProductId,
  productIdSchema,
  products,
  UpdateProductParams,
  updateProductSchema } from "@/lib/db/schema/products";

export const createProduct = async (product: NewProductParams) => {
  const newProduct = insertProductSchema.parse(product);
  try {
    const [p] = await db.insert(products).values(newProduct).returning();
    return { product: p };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const updateProduct = async (id: ProductId, product: UpdateProductParams) => {
  const { id: productId } = productIdSchema.parse({ id });
  const newProduct = updateProductSchema.parse(product);
  try {
    const [p] = await db
      .update(products)
      .set(newProduct)
      .where(eq(products.id, productId!))
      .returning();
    return { product: p };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const deleteProduct = async (id: ProductId) => {
  const { id: productId } = productIdSchema.parse({ id });
  try {
    const [p] = await db.delete(products).where(eq(products.id, productId!))
      .returning();
    return { product: p };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

