"use client";
import { CompleteProduct } from "@/lib/db/schema/products";
import { trpc } from "@/lib/trpc/client";
import ProductModal from "./ProductModal";


export default function ProductList({ products }: { products: CompleteProduct[] }) {
  const { data: p } = trpc.products.getProducts.useQuery(undefined, {
    initialData: { products },
    refetchOnMount: false,
  });

  if (p.products.length === 0) {
    return <EmptyState />;
  }

  return (
    <ul>
      {p.products.map((product) => (
        <Product product={product} key={product.id} />
      ))}
    </ul>
  );
}

const Product = ({ product }: { product: CompleteProduct }) => {
  return (
    <li className="flex justify-between my-2">
      <div className="w-full">
        <div>{product.name}</div>
      </div>
      <ProductModal product={product} />
    </li>
  );
};

const EmptyState = () => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-gray-900">No products</h3>
      <p className="mt-1 text-sm text-gray-500">
        Get started by creating a new product.
      </p>
      <div className="mt-6">
        <ProductModal emptyState={true} />
      </div>
    </div>
  );
};

