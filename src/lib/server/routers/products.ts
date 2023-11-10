import { createProduct, deleteProduct, updateProduct } from "@/lib/api/products/mutations";
import { getProductById, getProducts } from "@/lib/api/products/queries";
import {
  insertProductParams,
  productIdSchema,
  updateProductParams,
} from "@/lib/db/schema/products";

import { publicProcedure, router } from "../trpc";

export const productsRouter = router({
  getProducts: publicProcedure.query(async () => {
    return getProducts();
  }),
  getProductById: publicProcedure.input(productIdSchema).query(async ({ input }) => {
    return getProductById(input.id);
  }),
  createProduct: publicProcedure
    .input(insertProductParams)
    .mutation(async ({ input }) => {
      return createProduct(input);
    }),
  updateProduct: publicProcedure
    .input(updateProductParams)
    .mutation(async ({ input }) => {
      return updateProduct(input.id, input);
    }),
  deleteProduct: publicProcedure
    .input(productIdSchema)
    .mutation(async ({ input }) => {
      return deleteProduct(input.id);
    }),
});
