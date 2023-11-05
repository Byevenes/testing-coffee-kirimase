import { db } from "@/lib/db";
import { eq, and } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";
import { type BookId, bookIdSchema, books } from "@/lib/db/schema/books";

export const getBooks = async () => {
  const { session } = await getUserAuth();
  const b = await db.select().from(books).where(eq(books.userId, session?.user.id!));
  return { books: b };
};

export const getBookById = async (id: BookId) => {
  const { session } = await getUserAuth();
  const { id: bookId } = bookIdSchema.parse({ id });
  const [b] = await db.select().from(books).where(and(eq(books.id, bookId), eq(books.userId, session?.user.id!)));
  return { book: b };
};
