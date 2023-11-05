import BookList from "@/components/books/BookList";
import NewBookModal from "@/components/books/BookModal";
import { getBooks } from "@/lib/api/books/queries";
import { checkAuth } from "@/lib/auth/utils";

export default async function Books() {
  await checkAuth();
  const { books } = await getBooks();  

  return (
    <main className="max-w-3xl mx-auto p-5 md:p-0 sm:pt-4">
      <div className="flex justify-between">
        <h1 className="font-semibold text-2xl my-2">Books</h1>
        <NewBookModal />
      </div>
      <BookList books={books} />
    </main>
  );
}
