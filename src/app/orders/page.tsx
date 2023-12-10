import OrderList from "@/components/orders/OrderList";
import NewOrderModal from "@/components/orders/OrderModal";
import { getOrders } from "@/lib/api/orders/queries";
import { checkAuth } from "@/lib/auth/utils";

export default async function Orders() {
  await checkAuth();
  const { orders } = await getOrders();  

  return (
    <main className="max-w-3xl mx-auto p-5 md:p-0 sm:pt-4">
      <div className="flex justify-between">
        <h1 className="font-semibold text-2xl my-2">Orders</h1>
        <NewOrderModal />
      </div>
      <OrderList orders={orders} />
    </main>
  );
}
