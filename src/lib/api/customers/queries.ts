import { db } from "@/lib/db/index";
import { eq, and } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";
import { type CustomerId, customerIdSchema, customers } from "@/lib/db/schema/customers";

export const getCustomers = async () => {
  const { session } = await getUserAuth();
  const c = await db.select().from(customers).where(eq(customers.userId, session?.user.id!));
  return { customers: c };
};

export const getCustomerById = async (id: CustomerId) => {
  const { session } = await getUserAuth();
  const { id: customerId } = customerIdSchema.parse({ id });
  const [c] = await db.select().from(customers).where(and(eq(customers.id, customerId), eq(customers.userId, session?.user.id!)));
  return { customer: c };
};

