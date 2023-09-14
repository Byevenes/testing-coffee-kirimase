import { db } from "@/lib/db";
import { and, eq } from "drizzle-orm";
import { 
  BookId, 
  NewBookParams,
  UpdateBookParams, 
  updateBookSchema,
  insertBookSchema, 
  books,
  bookIdSchema 
} from "@/lib/db/schema/books";
import { getUserAuth } from "@/lib/auth/utils";

export const createBook = async (book: NewBookParams) => {
  const { session } = await getUserAuth();
  const newBook = insertBookSchema.parse({ ...book, userId: session?.user.id! });
  try {
    const [b] =  await db.insert(books).values(newBook).returning();
    return { book: b };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const updateBook = async (id: BookId, book: UpdateBookParams) => {
  const { session } = await getUserAuth();
  const { id: bookId } = bookIdSchema.parse({ id });
  const newBook = updateBookSchema.parse({ ...book, userId: session?.user.id! });
  try {
    const [b] =  await db
     .update(books)
     .set(newBook)
     .where(and(eq(books.id, bookId!), eq(books.userId, session?.user.id!)))
     .returning();
    return { book: b };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const deleteBook = async (id: BookId) => {
  const { session } = await getUserAuth();
  const { id: bookId } = bookIdSchema.parse({ id });
  try {
    const [b] =  await db.delete(books).where(and(eq(books.id, bookId!), eq(books.userId, session?.user.id!)))
    .returning();
    return { book: b };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

