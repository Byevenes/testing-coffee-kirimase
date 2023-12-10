"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Book, insertBookParams,NewBookParams } from "@/lib/db/schema/books";
import { trpc } from "@/lib/trpc/client";

import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";

const BookForm = ({
  book,
  closeModal,
}: {
  book?: Book;
  closeModal: () => void;
}) => {
  const { toast } = useToast();
  
  const editing = !!book?.id;

  const router = useRouter();
  const utils = trpc.useContext();

  const form = useForm<z.infer<typeof insertBookParams>>({
    // latest Zod release has introduced a TS error with zodResolver
    // open issue: https://github.com/colinhacks/zod/issues/2663
    // errors locally but not in production
    resolver: zodResolver(insertBookParams),
    defaultValues: book ?? {
      title: "",
     author: "",
     pages: 0,
     read: false
    },
  });

  const onSuccess = (action: "create" | "update" | "delete") => {
    utils.books.getBooks.invalidate();
    router.refresh();
    closeModal();toast({
      title: 'Success',
      description: `Book ${action}d!`,
      variant: "default",
    });
  };

  const { mutate: createBook, isLoading: isCreating } =
    trpc.books.createBook.useMutation({
      onSuccess: () => onSuccess("create"),
    });

  const { mutate: updateBook, isLoading: isUpdating } =
    trpc.books.updateBook.useMutation({
      onSuccess: () => onSuccess("update"),
    });

  const { mutate: deleteBook, isLoading: isDeleting } =
    trpc.books.deleteBook.useMutation({
      onSuccess: () => onSuccess("delete"),
    });

  const handleSubmit = (values: NewBookParams) => {
    if (editing) {
      updateBook({ ...values, id: book.id });
    } else {
      createBook(values);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className={"space-y-8"}>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (<FormItem>
              <FormLabel>Title</FormLabel>
                <FormControl>
            <Input {...field} />
          </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="author"
          render={({ field }) => (<FormItem>
              <FormLabel>Author</FormLabel>
                <FormControl>
            <Input {...field} />
          </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="pages"
          render={({ field }) => (<FormItem>
              <FormLabel>Pages</FormLabel>
                <FormControl>
            <Input {...field} />
          </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="read"
          render={({ field }) => (<FormItem>
              <FormLabel>Read</FormLabel>
                <br />
            <FormControl>
              <Checkbox {...field} checked={!!field.value} onCheckedChange={field.onChange} value={""} />
            </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="mr-1"
          disabled={isCreating || isUpdating}
        >
          {editing
            ? `Sav${isUpdating ? "ing..." : "e"}`
            : `Creat${isCreating ? "ing..." : "e"}`}
        </Button>
        {editing ? (
          <Button
            type="button"
            variant={"destructive"}
            onClick={() => deleteBook({ id: book.id })}
          >
            Delet{isDeleting ? "ing..." : "e"}
          </Button>
        ) : null}
      </form>
    </Form>
  );
};

export default BookForm;
