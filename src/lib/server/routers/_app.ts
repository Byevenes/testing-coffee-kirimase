import { computersRouter } from "./computers";
import { router } from "../trpc";
import { booksRouter } from "./books";
import { productsRouter } from "./products";
import { customersRouter } from "./customers";
import { ordersRouter } from "./orders";

export const appRouter = router({
  computers: computersRouter,
  books: booksRouter,
  products: productsRouter,
  customers: customersRouter,
  orders: ordersRouter,
});

export type AppRouter = typeof appRouter;
