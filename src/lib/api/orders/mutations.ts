import { db } from "@/lib/db/index";
import { and, eq } from "drizzle-orm";
import { 
  OrderId, 
  NewOrderParams,
  UpdateOrderParams, 
  updateOrderSchema,
  insertOrderSchema, 
  orders,
  orderIdSchema 
} from "@/lib/db/schema/orders";
import { getUserAuth } from "@/lib/auth/utils";

export const createOrder = async (order: NewOrderParams) => {
  const { session } = await getUserAuth();
  try {
    const newOrder = insertOrderSchema
      .parse({ ...order, userId: session?.user.id!, ordersDate: new Date(order.ordersDate).toISOString() });
    const [o] =  await db.insert(orders).values(newOrder).returning();
    return { order: o };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const updateOrder = async (id: OrderId, order: UpdateOrderParams) => {
  const { session } = await getUserAuth();
  try {
    const { id: orderId } = orderIdSchema.parse({ id });
    const newOrder = updateOrderSchema.parse({ ...order, userId: session?.user.id! });
    const [o] =  await db
     .update(orders)
     .set(newOrder)
     .where(and(eq(orders.id, orderId!), eq(orders.userId, session?.user.id!)))
     .returning();
    return { order: o };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const deleteOrder = async (id: OrderId) => {
  const { session } = await getUserAuth();
  try {
    const { id: orderId } = orderIdSchema.parse({ id });
    const [o] =  await db.delete(orders).where(and(eq(orders.id, orderId!), eq(orders.userId, session?.user.id!)))
    .returning();
    return { order: o };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

