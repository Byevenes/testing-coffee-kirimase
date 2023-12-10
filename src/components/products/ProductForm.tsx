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
import { insertProductParams,NewProductParams, Product } from "@/lib/db/schema/products";
import { trpc } from "@/lib/trpc/client";

import { Button } from "../ui/button";

const ProductForm = ({
  product,
  closeModal,
}: {
  product?: Product;
  closeModal: () => void;
}) => {
  const { toast } = useToast();

  const editing = !!product?.id;

  const router = useRouter();
  const utils = trpc.useContext();

  const form = useForm<z.infer<typeof insertProductParams>>({
    // latest Zod release has introduced a TS error with zodResolver
    // open issue: https://github.com/colinhacks/zod/issues/2663
    // errors locally but not in production
    resolver: zodResolver(insertProductParams),
    //@ts-ignore
    defaultValues: product ?? {
      name: "",
      unitPrice: 0.0,
      unitInStock: 0,
      unitOnOrder: 0,
      discontinued: 0,
      points: 0,
      images: null,
      description: "",
    },
  });

  const onSuccess = (action: "create" | "update" | "delete") => {
    utils.products.getProducts.invalidate();
    router.refresh();
    closeModal(); toast({
      title: 'Success',
      description: `Product ${action}d!`,
      variant: "default",
    });
  };

  const { mutate: createProduct, isLoading: isCreating } =
    trpc.products.createProduct.useMutation({
      onSuccess: () => onSuccess("create"),
    });

  const { mutate: updateProduct, isLoading: isUpdating } =
    trpc.products.updateProduct.useMutation({
      onSuccess: () => onSuccess("update"),
    });

  const { mutate: deleteProduct, isLoading: isDeleting } =
    trpc.products.deleteProduct.useMutation({
      onSuccess: () => onSuccess("delete"),
    });

  const handleSubmit = (values: NewProductParams) => {
    if (editing) {
      updateProduct({ ...values, id: product.id });
    } else {
      createProduct(values);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className={"space-y-8"}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (<FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>

            <FormMessage />
          </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="unitPrice"
          render={({ field }) => (<FormItem>
            <FormLabel>Unit Price</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>

            <FormMessage />
          </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="unitInStock"
          render={({ field }) => (<FormItem>
            <FormLabel>Unit In Stock</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>

            <FormMessage />
          </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="unitOnOrder"
          render={({ field }) => (<FormItem>
            <FormLabel>Unit On Order</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>

            <FormMessage />
          </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="discontinued"
          render={({ field }) => (<FormItem>
            <FormLabel>Discontinued</FormLabel>
            <FormControl>
              <Input {...field} value={field.value ?? 0} />
            </FormControl>

            <FormMessage />
          </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="points"
          render={({ field }) => (<FormItem>
            <FormLabel>Points</FormLabel>
            <FormControl>
              <Input {...field} value={field.value ?? 0} />
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
            onClick={() => deleteProduct({ id: product.id })}
          >
            Delet{isDeleting ? "ing..." : "e"}
          </Button>
        ) : null}
      </form>
    </Form>
  );
};

export default ProductForm;
