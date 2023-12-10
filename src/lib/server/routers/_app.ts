import { router } from '../trpc';

import { booksRouter } from './books';
import { computersRouter } from './computers';
import { customersRouter } from './customers';
import { ordersRouter } from './orders';
import { productsRouter } from './products';

export const appRouter = router({
  computers: computersRouter,
  books: booksRouter,
  products: productsRouter,
  customers: customersRouter,
  orders: ordersRouter,
});

export type AppRouter = typeof appRouter;
