import { computersRouter } from "./computers";
import { router } from "../trpc";
import { booksRouter } from "./books";
import { productsRouter } from "./products";

export const appRouter = router({
  computers: computersRouter,
  books: booksRouter,
  products: productsRouter,
});

export type AppRouter = typeof appRouter;
