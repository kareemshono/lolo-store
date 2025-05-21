import { notFound } from "next/navigation";
import ProductDetails from "@/app/components/productDetails/ProductDetails";

export default async function ProductPage({ params }) {
    const { id } = params;
    const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        cache: "no-store", // Ensure fresh data
    });

    if (!res.ok) {
        notFound();
    }

    const product = await res.json();

    return <ProductDetails product={product} />;
}