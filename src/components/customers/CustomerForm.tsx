"use client";

import { Customer, NewCustomerParams, insertCustomerParams } from "@/lib/db/schema/customers";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

const CustomerForm = ({
  customer,
  closeModal,
}: {
  customer?: Customer;
  closeModal: () => void;
}) => {
  const { toast } = useToast();
  
  const editing = !!customer?.id;

  const router = useRouter();
  const utils = trpc.useContext();

  const defaultValues = customer
    ? {
        ...customer,
        birthday: new Date(customer.birthday),
      }
    : {
        name: "",
        lastName: "",
        email: "",
        emailVerifier: false,
        rut: "",
        birthday: new Date(),
      };

  const form = useForm<z.infer<typeof insertCustomerParams>>({
    // latest Zod release has introduced a TS error with zodResolver
    // open issue: https://github.com/colinhacks/zod/issues/2663
    // errors locally but not in production
    resolver: zodResolver(insertCustomerParams),
    defaultValues,
  });

  const onSuccess = async (action: "create" | "update" | "delete") => {
    await utils.customers.getCustomers.invalidate();
    router.refresh();
    closeModal();toast({
      title: 'Success',
      description: `Customer ${action}d!`,
      variant: "default",
    });
  };

  const { mutate: createCustomer, isLoading: isCreating } =
    trpc.customers.createCustomer.useMutation({
      onSuccess: () => onSuccess("create"),
    });

  const { mutate: updateCustomer, isLoading: isUpdating } =
    trpc.customers.updateCustomer.useMutation({
      onSuccess: () => onSuccess("update"),
    });

  const { mutate: deleteCustomer, isLoading: isDeleting } =
    trpc.customers.deleteCustomer.useMutation({
      onSuccess: () => onSuccess("delete"),
    });

  const handleSubmit = (values: NewCustomerParams) => {
    if (editing) {
      updateCustomer({ ...values, id: customer.id, birthday: values.birthday });
    } else {
      createCustomer({ ...values, birthday: values.birthday });
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
          name="lastName"
          render={({ field }) => (<FormItem>
              <FormLabel>Last Name</FormLabel>
                <FormControl>
            <Input {...field} />
          </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (<FormItem>
              <FormLabel>Email</FormLabel>
                <FormControl>
            <Input {...field} />
          </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="rut"
          render={({ field }) => (<FormItem>
              <FormLabel>Rut</FormLabel>
                <FormControl>
            <Input {...field} />
          </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="birthday"
          render={({ field }) => (<FormItem>
              <FormLabel>Birthday</FormLabel>
                <br />
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(new Date(field.value), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={new Date(field.value)}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

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
            onClick={() => deleteCustomer({ id: customer.id })}
          >
            Delet{isDeleting ? "ing..." : "e"}
          </Button>
        ) : null}
      </form>
    </Form>
  );
};

export default CustomerForm;
