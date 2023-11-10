"use client";
import { CompleteCustomer } from "@/lib/db/schema/customers";
import { trpc } from "@/lib/trpc/client";

import CustomerModal from "./CustomerModal";

const Customer = ({ customer }: { customer: CompleteCustomer }) => {
  return (
    <li className="flex justify-between my-2">
      <div className="w-full">
        <div>{customer.name}</div>
      </div>
      <CustomerModal customer={{ ...customer, birthday: new Date(customer.birthday) }} />
    </li>
  );
};

const EmptyState = () => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-gray-900">No customers</h3>
      <p className="mt-1 text-sm text-gray-500">
        Get started by creating a new customer.
      </p>
      <div className="mt-6">
        <CustomerModal emptyState={true} />
      </div>
    </div>
  );
};

export default function CustomerList({ customers }: { customers: CompleteCustomer[] }) {
  const { data: c } = trpc.customers.getCustomers.useQuery(undefined, {
    initialData: { customers },
    refetchOnMount: false,
  });

  if (c.customers.length === 0) {
    return <EmptyState />;
  }

  return (
    <ul>
      {c.customers.map((customer) => (
        <Customer customer={customer} key={customer.id} />
      ))}
    </ul>
  );
}

