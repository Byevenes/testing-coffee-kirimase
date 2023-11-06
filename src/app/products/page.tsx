import ProductList from "@/components/products/ProductList";
import NewProductModal from "@/components/products/ProductModal";
import { getProducts } from "@/lib/api/products/queries";

export default async function Products() {
  const { products } = await getProducts();  

  return (
    <main className="max-w-3xl mx-auto p-5 md:p-0 sm:pt-4">
      <div className="flex justify-between">
        <h1 className="font-semibold text-2xl my-2">Products</h1>
        <NewProductModal />
      </div>
      <ProductList products={products} />
    </main>
  );
}
