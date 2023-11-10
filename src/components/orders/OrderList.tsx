"use client";
import { CompleteOrder } from "@/lib/db/schema/orders";
import { trpc } from "@/lib/trpc/client";
import OrderModal from "./OrderModal";


export default function OrderList({ orders }: { orders: CompleteOrder[] }) {
  const { data: o } = trpc.orders.getOrders.useQuery(undefined, {
    initialData: { orders },
    refetchOnMount: false,
  });

  if (o.orders.length === 0) {
    return <EmptyState />;
  }

  return (
    <ul>
      {o.orders.map((order) => (
        <Order order={order} key={order.order.id} />
      ))}
    </ul>
  );
}

const Order = ({ order }: { order: CompleteOrder }) => {
  return (
    <li className="flex justify-between my-2">
      <div className="w-full">
        <div>{order.order.ordersDate.toString()}</div>
      </div>
      <OrderModal order={order.order} />
    </li>
  );
};

const EmptyState = () => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-gray-900">No orders</h3>
      <p className="mt-1 text-sm text-gray-500">
        Get started by creating a new order.
      </p>
      <div className="mt-6">
        <OrderModal emptyState={true} />
      </div>
    </div>
  );
};

