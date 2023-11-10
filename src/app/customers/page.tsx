import CustomerList from "@/components/customers/CustomerList";
import NewCustomerModal from "@/components/customers/CustomerModal";
import { getCustomers } from "@/lib/api/customers/queries";
import { checkAuth } from "@/lib/auth/utils";

export default async function Customers() {
  await checkAuth();
  const { customers } = await getCustomers();  

  return (
    <main className="max-w-3xl mx-auto p-5 md:p-0 sm:pt-4">
      <div className="flex justify-between">
        <h1 className="font-semibold text-2xl my-2">Customers</h1>
        <NewCustomerModal />
      </div>
      <CustomerList customers={customers} />
    </main>
  );
}
