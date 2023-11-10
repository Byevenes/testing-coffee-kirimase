"use client";

import { Order, NewOrderParams, insertOrderParams } from "@/lib/db/schema/orders";
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
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

const OrderForm = ({
  order,
  closeModal,
}: {
  order?: Order;
  closeModal: () => void;
}) => {
  const { toast } = useToast();
  const { data: customers } = trpc.customers.getCustomers.useQuery();
  const editing = !!order?.id;

  const router = useRouter();
  const utils = trpc.useContext();

  const form = useForm<z.infer<typeof insertOrderParams>>({
    // latest Zod release has introduced a TS error with zodResolver
    // open issue: https://github.com/colinhacks/zod/issues/2663
    // errors locally but not in production
    resolver: zodResolver(insertOrderParams),
    defaultValues: order ?? {
      ordersDate: "",
     customerId: 0
    },
  });

  const onSuccess = async (action: "create" | "update" | "delete") => {
    await utils.orders.getOrders.invalidate();
    router.refresh();
    closeModal();toast({
      title: 'Success',
      description: `Order ${action}d!`,
      variant: "default",
    });
  };

  const { mutate: createOrder, isLoading: isCreating } =
    trpc.orders.createOrder.useMutation({
      onSuccess: () => onSuccess("create"),
    });

  const { mutate: updateOrder, isLoading: isUpdating } =
    trpc.orders.updateOrder.useMutation({
      onSuccess: () => onSuccess("update"),
    });

  const { mutate: deleteOrder, isLoading: isDeleting } =
    trpc.orders.deleteOrder.useMutation({
      onSuccess: () => onSuccess("delete"),
    });

  const handleSubmit = (values: NewOrderParams) => {
    if (editing) {
      updateOrder({ ...values, id: order.id });
    } else {
      createOrder(values);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className={"space-y-8"}>
        <FormField
          control={form.control}
          name="ordersDate"
          render={({ field }) => (<FormItem>
              <FormLabel>Orders Date</FormLabel>
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
                        new Date(field.value).toLocaleDateString()
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
        <FormField
          control={form.control}
          name="customerId"
          render={({ field }) => (<FormItem>
              <FormLabel>Customer Id</FormLabel>
                <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={String(field.value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers?.customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id.toString()}>
                        {customer.email}  {/* TODO: Replace with a field from the customer model */}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
            onClick={() => deleteOrder({ id: order.id })}
          >
            Delet{isDeleting ? "ing..." : "e"}
          </Button>
        ) : null}
      </form>
    </Form>
  );
};

export default OrderForm;
