import { router } from "../trpc";

import { booksRouter } from "./books";
import { computersRouter } from "./computers";
import { productsRouter } from "./products";
import { customersRouter } from "./customers";

export const appRouter = router({
  computers: computersRouter,
  books: booksRouter,
  products: productsRouter,
  customers: customersRouter,
});

export type AppRouter = typeof appRouter;
