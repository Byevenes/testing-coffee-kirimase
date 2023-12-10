import {
  createOrder,
  deleteOrder,
  updateOrder,
} from '@/lib/api/orders/mutations';
import { getOrderById, getOrders } from '@/lib/api/orders/queries';
import {
  insertOrderParams,
  orderIdSchema,
  updateOrderParams,
} from '@/lib/db/schema/orders';
import { publicProcedure, router } from '@/lib/server/trpc';

export const ordersRouter = router({
  getOrders: publicProcedure.query(async () => {
    return getOrders();
  }),
  getOrderById: publicProcedure
    .input(orderIdSchema)
    .query(async ({ input }) => {
      return getOrderById(input.id);
    }),
  createOrder: publicProcedure
    .input(insertOrderParams)
    .mutation(async ({ input }) => {
      return createOrder(input);
    }),
  updateOrder: publicProcedure
    .input(updateOrderParams)
    .mutation(async ({ input }) => {
      return updateOrder(input.id, input);
    }),
  deleteOrder: publicProcedure
    .input(orderIdSchema)
    .mutation(async ({ input }) => {
      return deleteOrder(input.id);
    }),
});
