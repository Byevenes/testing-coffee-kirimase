import { and, eq } from 'drizzle-orm';

import { getUserAuth } from '@/lib/auth/utils';
import { db } from '@/lib/db/index';
import { customers } from '@/lib/db/schema/customers';
import { type OrderId, orderIdSchema, orders } from '@/lib/db/schema/orders';

export const getOrders = async () => {
  const { session } = await getUserAuth();
  const o = await db
    .select({ order: orders, customer: customers })
    .from(orders)
    .leftJoin(customers, eq(orders.customerId, customers.id))
    .where(eq(orders.userId, session?.user.id!));
  return { orders: o };
};

export const getOrderById = async (id: OrderId) => {
  const { session } = await getUserAuth();
  const { id: orderId } = orderIdSchema.parse({ id });
  const [o] = await db
    .select()
    .from(orders)
    .where(and(eq(orders.id, orderId), eq(orders.userId, session?.user.id!)))
    .leftJoin(customers, eq(orders.customerId, customers.id));
  return { order: o };
};
