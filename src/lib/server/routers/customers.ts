import { createCustomer, deleteCustomer, updateCustomer } from "@/lib/api/customers/mutations";
import { getCustomerById, getCustomers } from "@/lib/api/customers/queries";
import {
  customerIdSchema,
  insertCustomerParams,
  updateCustomerParams,
} from "@/lib/db/schema/customers";
import { publicProcedure, router } from "@/lib/server/trpc";

export const customersRouter = router({
  getCustomers: publicProcedure.query(async () => {
    return getCustomers();
  }),
  getCustomerById: publicProcedure.input(customerIdSchema).query(async ({ input }) => {
    return getCustomerById(input.id);
  }),
  createCustomer: publicProcedure
    .input(insertCustomerParams)
    .mutation(async ({ input }) => {
      return createCustomer(input);
    }),
  updateCustomer: publicProcedure
    .input(updateCustomerParams)
    .mutation(async ({ input }) => {
      return updateCustomer(input.id, input);
    }),
  deleteCustomer: publicProcedure
    .input(customerIdSchema)
    .mutation(async ({ input }) => {
      return deleteCustomer(input.id);
    }),
});
