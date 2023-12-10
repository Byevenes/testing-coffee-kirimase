import { boolean, integer, pgTable,serial, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { getBooks } from "@/lib/api/books/queries";

import { users } from "./auth";

export const books = pgTable('books', {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 256 }).notNull(),
  author: varchar("author", { length: 256 }).notNull(),
  pages: integer("pages").notNull(),
  read: boolean("read").notNull(),
  userId: varchar("user_id", { length: 256 }).references(() => users.id, { onDelete: "cascade" }).notNull(),
});


// Schema for books - used to validate API requests
export const insertBookSchema = createInsertSchema(books);
export const insertBookParams = createSelectSchema(books, {
  title: z.coerce.string().min(5),
  author: z.coerce.string().min(5),
  pages: z.coerce.number().min(3),
  read: z.coerce.boolean(),
}).omit({
  id: true,
  userId: true
});
export const updateBookSchema = createSelectSchema(books);
export const updateBookParams = createSelectSchema(books, {
  pages: z.coerce.number(),
  read: z.coerce.boolean()
}).omit({
  userId: true
});
export const bookIdSchema = updateBookSchema.pick({ id: true });

// Types for books - used to type API request params and within Components
export type Book = z.infer<typeof updateBookSchema>;
export type NewBook = z.infer<typeof insertBookSchema>;
export type NewBookParams = z.infer<typeof insertBookParams>;
export type UpdateBookParams = z.infer<typeof updateBookParams>;
export type BookId = z.infer<typeof bookIdSchema>["id"];

// this type infers the return from getBooks() - meaning it will include any joins
export type CompleteBook = Awaited<ReturnType<typeof getBooks>>["books"][number];
