import { and, eq } from 'drizzle-orm';

import { getUserAuth } from '@/lib/auth/utils';
import { db } from '@/lib/db/index';
import {
  insertOrderSchema,
  NewOrderParams,
  OrderId,
  orderIdSchema,
  orders,
  UpdateOrderParams,
  updateOrderSchema,
} from '@/lib/db/schema/orders';

export const createOrder = async (order: NewOrderParams) => {
  const { session } = await getUserAuth();
  try {
    const newOrder = insertOrderSchema.parse({
      ...order,
      userId: session?.user.id!,
      ordersDate: new Date(order.ordersDate).toISOString(),
    });
    const [o] = await db.insert(orders).values(newOrder).returning();
    return { order: o };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    return { error: message };
  }
};

export const updateOrder = async (id: OrderId, order: UpdateOrderParams) => {
  const { session } = await getUserAuth();
  try {
    const { id: orderId } = orderIdSchema.parse({ id });
    const newOrder = updateOrderSchema.parse({
      ...order,
      userId: session?.user.id!,
      ordersDate: new Date(order.ordersDate).toISOString(),
    });
    const [o] = await db
      .update(orders)
      .set(newOrder)
      .where(and(eq(orders.id, orderId!), eq(orders.userId, session?.user.id!)))
      .returning();
    return { order: o };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    return { error: message };
  }
};

export const deleteOrder = async (id: OrderId) => {
  const { session } = await getUserAuth();
  try {
    const { id: orderId } = orderIdSchema.parse({ id });
    const [o] = await db
      .delete(orders)
      .where(and(eq(orders.id, orderId!), eq(orders.userId, session?.user.id!)))
      .returning();
    return { order: o };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    return { error: message };
  }
};
