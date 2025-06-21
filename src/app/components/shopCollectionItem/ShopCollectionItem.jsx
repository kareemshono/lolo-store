"use client";

import Image from "next/image";
import Link from "next/link";
import { FaHeart } from "react-icons/fa6";
import { BsBag } from "react-icons/bs";
import { GrView } from "react-icons/gr";
import styles from "./ShopCollectionItem.module.scss";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/slices/cart/cartSlice";
import { useState } from "react";
import { toggleModal } from "@/redux/slices/productModal/productModalSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TransitionLink from "../transition/TransitionLink";

const ShopCollectionItem = ({ product }) => {
    const dispatch = useDispatch();
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);

    // Deduplicate sizes and colors from product.variants
    const sizes = [...new Set(product.variants.map((variant) => variant.size))];
    const colors = [...new Set(product.variants.map((variant) => variant.color).filter(Boolean))];

    // Handle size selection
    const handleSelectSize = (size) => {
        setSelectedSize(size);
    };

    // Handle color selection
    const handleSelectColor = (color) => {
        setSelectedColor(color);
    };

    // Find variant based on selected size and color
    const selectedVariant = product.variants.find(
        (v) => v.size === selectedSize && v.color === selectedColor
    );

    // Handle add to cart
    const handleAddToCart = () => {
     
        if (!selectedVariant) {
            toast.error("Please select size and color", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                
            });
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
        ).then(() => {
            toast.success("Added to cart!", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                
            });
        });
    };

    // Handle quick view
    const handleQuickView = () => {
        dispatch(toggleModal({ showModal: true, product }));
    };

    return (
        <div className={styles.shopCollectionItem}>
            <div className={styles.imgContainer}>
                <Image
                    src={
                        product.images.find((img) => img.is_thumbnail)?.img_url ||
                        "/default.jpg"
                    }
                    fill
                    alt={product.product_name + " img"}
                />
                <div onClick={handleQuickView} className={styles.hoverDiv}>
                    <p>
                        <span>
                            <GrView />
                        </span>
                        Quick View
                    </p>
                </div>
            </div>
            <div className={styles.infoContainer}>
                <div className={styles.colLeft}>
                    <h4 className={styles.title}>
                        <TransitionLink href={`/products/${product.product_id}`}>
                            {product.product_name}
                        </TransitionLink>
                    </h4>
                    <span className={styles.wishHeart}>
                        <FaHeart />
                    </span>
                    <span className={styles.addToCart} onClick={handleAddToCart}>
                        <BsBag />
                        <span className={styles.text}>Add to cart</span>
                    </span>
                    <span className={styles.priceRange}>{product.price} TL</span>
                </div>
                <div className={styles.colRight}>
                    <div className={styles.sizeContainer}>
                        {sizes.map((size) => (
                            <span
                                key={size}
                                className={`${styles.sizeOption} ${
                                    selectedSize === size ? styles.selected : ""
                                }`}
                                onClick={() => handleSelectSize(size)}
                            >
                                {size}
                            </span>
                        ))}
                    </div>
                    {colors.length > 0 && (
                        <div className={styles.colorContainer}>
                            {colors.map((color) => (
                                <span
                                    key={color}
                                    className={`${styles.colorOption} ${
                                        selectedColor === color ? styles.selected : ""
                                    }`}
                                    style={{ backgroundColor: color.toLowerCase() }}
                                    onClick={() => handleSelectColor(color)}
                                    title={color}
                                >
                                    {/* Color swatch, no text inside */}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <ToastContainer
                position="top-center"
                autoClose={2000}
                
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                className={styles.toastContainer}
            />
        </div>
    );
};

export default ShopCollectionItem;