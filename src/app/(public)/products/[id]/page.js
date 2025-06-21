import { notFound } from "next/navigation";
import SingleProduct from "@/app/components/singleProduct/SingleProduct";

export default async function ProductPage({ params }) {
    const { id } = params;

    // Validate ID
    const productId = parseInt(id, 10);
    if (isNaN(productId) || productId <= 0) {
        console.error(`Invalid product ID: ${id}`);
        notFound();
    }

    try {
        const res = await fetch(`http://localhost:5000/api/products/${productId}`, {
            cache: "no-store", // Fresh data for stock accuracy
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!res.ok) {
            console.error(`Fetch failed for product ID ${productId}: ${res.status}`);
            notFound();
        }

        const product = await res.json();

        // Validate product data
        if (!product || !product.product_name) {
            console.error(`Invalid product data for ID ${productId}:`, product);
            notFound();
        }

        console.log(`Fetched product ${productId}: ${product.product_name}`);

        return <SingleProduct product={product} />;
    } catch (error) {
        console.error(`Error fetching product ${productId}:`, error.message);
        notFound();
    }
}

export async function generateMetadata({ params }) {
    const { id } = params;
    const productId = parseInt(id, 10);
    if (isNaN(productId) || productId <= 0) return {};

    try {
        const res = await fetch(`http://localhost:5000/api/products/${productId}`);
        if (!res.ok) return { title: "Product Not Found | Lolo Store" };
        const product = await res.json();
        return {
            title: `${product.product_name || "Product"} | Lolo Store`,
            description: product.description || "Shop this product at Lolo Store",
        };
    } catch (error) {
        return {
            title: "Product Not Found | Lolo Store",
        };
    }
}