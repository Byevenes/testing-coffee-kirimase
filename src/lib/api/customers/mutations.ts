import { db } from "@/lib/db/index";
import { and, eq } from "drizzle-orm";
import { 
  CustomerId, 
  NewCustomerParams,
  UpdateCustomerParams, 
  updateCustomerSchema,
  insertCustomerSchema, 
  customers,
  customerIdSchema 
} from "@/lib/db/schema/customers";
import { getUserAuth } from "@/lib/auth/utils";

export const createCustomer = async (customer: NewCustomerParams) => {  
  const { session } = await getUserAuth();

  try {
    const newCustomer = insertCustomerSchema.parse({ ...customer, userId: session?.user.id!, birthday: new Date(customer.birthday) });
    const [c] =  await db.insert(customers).values(newCustomer).returning();
    return { customer: c };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const updateCustomer = async (id: CustomerId, customer: UpdateCustomerParams) => {
  const { session } = await getUserAuth();
  const { id: customerId } = customerIdSchema.parse({ id });
  const newCustomer = updateCustomerSchema.parse({ ...customer, userId: session?.user.id! });
  try {
    const [c] =  await db
     .update(customers)
     .set(newCustomer)
     .where(and(eq(customers.id, customerId!), eq(customers.userId, session?.user.id!)))
     .returning();
    return { customer: c };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const deleteCustomer = async (id: CustomerId) => {
  const { session } = await getUserAuth();
  const { id: customerId } = customerIdSchema.parse({ id });
  try {
    const [c] =  await db.delete(customers).where(and(eq(customers.id, customerId!), eq(customers.userId, session?.user.id!)))
    .returning();
    return { customer: c };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

