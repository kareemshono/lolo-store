"use client";

import Image from "next/image";
import Rating from "@mui/material/Rating";
import styles from "./ProductDetails.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/redux/slices/cart/cartSlice";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductDetails = ({ product }) => {
    const dispatch = useDispatch();
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);

    // Extract unique sizes and colors
    const allSizes = [...new Set(product.variants.map((variant) => variant.size))];
    const allColors = [
        ...new Set(
            product.variants
                .map((variant) => variant.color || "No Color")
                .filter((color) => color !== null)
        ),
    ];

    // Filter available colors based on selected size
    const availableColors = selectedSize
        ? [
              ...new Set(
                  product.variants
                      .filter((v) => v.size === selectedSize)
                      .map((v) => v.color || "No Color")
              ),
          ]
        : allColors;

    // Filter available sizes based on selected color
    const availableSizes = selectedColor
        ? [
              ...new Set(
                  product.variants
                      .filter((v) => (v.color || "No Color") === selectedColor)
                      .map((v) => v.size)
              ),
          ]
        : allSizes;

    // Handle size selection
    const handleSelectSize = (size) => {
        setSelectedSize(size);
        if (selectedColor && !product.variants.some((v) => v.size === size && (v.color || "No Color") === selectedColor)) {
            setSelectedColor(null);
        }
    };

    // Handle color selection
    const handleSelectColor = (color) => {
        setSelectedColor(color);
        if (selectedSize && !product.variants.some((v) => (v.color || "No Color") === color && v.size === selectedSize)) {
            setSelectedSize(null);
        }
    };

    // Find selected variant
    const selectedVariant = product.variants.find(
        (v) => v.size === selectedSize && (v.color || "No Color") === selectedColor
    );

    // Handle add to cart
    const handleAddToCart = () => {
        if (!selectedSize || !selectedColor || !selectedVariant) {
            toast.error("Please select both a size and a color.");
            return;
        }
        dispatch(
            addToCart({
                productId: product.product_id,
                variantId: selectedVariant.id,
                quantity: 1,
                product_name: product.product_name,
                price: product.price,
                size: selectedVariant.size,
                color: selectedVariant.color || null,
                thumbnail:
                    product.images.find((img) => img.is_thumbnail)?.img_url || "/default.jpg",
            })
        ).then(() => toast.success("Added to cart!"));
    };

    // Stock status
    const stockAvailable = selectedVariant ? selectedVariant.stock_quantity > 0 : product.product_stock > 0;

    // Color style
    const getColorStyle = (color) => {
        if (color === "No Color") return "#d3d3d3";
        return color.toLowerCase();
    };

    return (
        <div className={styles.productDetails}>
            <div className={styles.productContainer}>
                <div className={styles.colLeft}>
                    <Image
                        src={product.images.find((img) => img.is_thumbnail)?.img_url || "/default.jpg"}
                        width={450}
                        height={325}
                        alt={product.product_name}
                    />
                    <div
                        className={`${styles.stockStatus} ${
                            stockAvailable ? styles.available : styles.outOfStock
                        }`}
                    >
                        <span>{stockAvailable ? "Available" : "Out of Stock"}</span>
                    </div>
                </div>
                <div className={styles.colRight}>
                    <p className={styles.categoryPath}>
                        Shop / <span>{product.category_name || "Dresses"}</span>
                    </p>
                    <h1 className={styles.title}>{product.product_name}</h1>
                    <p className={styles.miniDescription}>
                        {product.description ||
                            "Lorem ipsum dolor sit amet, consectetur adipisicing elit."}
                    </p>
                    <div className={styles.categoryColorFilter}>
                        <p className={styles.title}>Available Colors</p>
                        <div
                            style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "10px",
                                padding: "10px",
                            }}
                        >
                            {availableColors.length > 0 ? (
                                availableColors.map((color) => (
                                    <div
                                        key={color}
                                        onClick={() => handleSelectColor(color)}
                                        style={{
                                            backgroundColor: getColorStyle(color),
                                            width: "30px",
                                            height: "30px",
                                            border: `2px solid ${
                                                selectedColor === color ? "#000" : "#00000030"
                                            }`,
                                            padding: "5px",
                                            borderRadius: "50%",
                                            cursor: "pointer",
                                        }}
                                    ></div>
                                ))
                            ) : (
                                <p>No colors available</p>
                            )}
                        </div>
                    </div>
                    <div className={styles.categorySizeFilter}>
                        <p className={styles.title}>Available Sizes</p>
                        <div style={{ display: "flex", gap: "10px", padding: "10px" }}>
                            {availableSizes.map((size) => (
                                <div
                                    key={size}
                                    onClick={() => handleSelectSize(size)}
                                    style={{
                                        width: "50px",
                                        textAlign: "center",
                                        border: `1px solid ${
                                            selectedSize === size ? "#000" : "#00000030"
                                        }`,
                                        padding: "0px 5px",
                                        textTransform: "uppercase",
                                        borderRadius: "5%",
                                        cursor: "pointer",
                                    }}
                                >
                                    <p>{size}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <h3 className={styles.price}>{product.price} TL</h3>
                    <div className={styles.rate}>
                        <Rating name="read-only" value={2} readOnly />
                        2 Reviews
                    </div>
                    <div className={styles.btns}>
                        <button
                            className={styles.addToCart}
                            onClick={handleAddToCart}
                            disabled={!selectedSize || !selectedColor || !stockAvailable}
                            style={{
                                opacity: !selectedSize || !selectedColor || !stockAvailable ? 0.5 : 1,
                                cursor:
                                    !selectedSize || !selectedColor || !stockAvailable
                                        ? "not-allowed"
                                        : "pointer",
                            }}
                        >
                            ADD TO CART
                        </button>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default ProductDetails;