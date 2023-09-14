import { computersRouter } from "./computers";
import { router } from "../trpc";
import { booksRouter } from "./books";

export const appRouter = router({
  computers: computersRouter,
  books: booksRouter,
});

export type AppRouter = typeof appRouter;
