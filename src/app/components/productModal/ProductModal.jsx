"use client";

import Image from "next/image";
import Rating from "@mui/material/Rating";
import styles from "./ProductModal.module.scss";
import { AiOutlineClose } from "react-icons/ai";
import { FaTurkishLiraSign } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { toggleModal } from "@/redux/slices/productModal/productModalSlice";
import { addToCart } from "@/redux/slices/cart/cartSlice";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TransitionLink from "../transition/TransitionLink";

const ProductModal = () => {
    const dispatch = useDispatch();
    const { showModal, product } = useSelector((state) => state.productModal);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedQuantity, setSelectedQuantity] = useState(1);

    if (!showModal || !product) return null;

    const allSizes = [...new Set(product.variants.map((variant) => variant.size))];
    const allColors = [
        ...new Set(
            product.variants
                .map((variant) => variant.color || "No Color")
                .filter((color) => color !== null)
        ),
    ];

    const availableColors = selectedSize
        ? [
              ...new Set(
                  product.variants
                      .filter((v) => v.size === selectedSize)
                      .map((v) => v.color || "No Color")
              ),
          ]
        : allColors;

    const availableSizes = selectedColor
        ? [
              ...new Set(
                  product.variants
                      .filter((v) => (v.color || "No Color") === selectedColor)
                      .map((v) => v.size)
              ),
          ]
        : allSizes;

    const handleSelectSize = (size) => {
        setSelectedSize(size);
        if (selectedColor && !product.variants.some((v) => v.size === size && (v.color || "No Color") === selectedColor)) {
            setSelectedColor(null);
        }
        setSelectedQuantity(1); // Reset quantity on color change
    };

    const handleSelectColor = (color) => {
        setSelectedColor(color);
        if (selectedSize && !product.variants.some((v) => (v.color || "No Color") === color && v.size === selectedSize)) {
            setSelectedSize(null);
        }
        setSelectedQuantity(1); // Reset quantity on color change
    };
 const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value, 10);
        if (isNaN(value)) {
            setSelectedQuantity(1);
        } else {
            setSelectedQuantity(Math.max(1, Math.min(value, selectedVariant?.stock_quantity || product.product_stock)));
        }
    };

    const selectedVariant = product.variants.find(
        (v) => v.size === selectedSize && (v.color || "No Color") === selectedColor
    );

    const handleAddToCart = () => {
        if (!selectedSize || !selectedColor || !selectedVariant) {
            toast.error("Please select both a size and a color.");
            return;
        }
          if (!selectedQuantity || selectedQuantity < 1 || selectedQuantity > (selectedVariant?.stock_quantity || product.product_stock)) {
            toast.error("Please select a valid quantity.", {
                position: "top-center",
                autoClose: 3000,
                theme: "colored",
            });
            return;
        }
        dispatch(
            addToCart({
                productId: product.product_id,
                variantId: selectedVariant.id,
                quantity: selectedQuantity,
                product_name: product.product_name,
                price: product.price,
                size: selectedVariant.size,
                color: selectedVariant.color || null,
                thumbnail:
                    product.images.find((img) => img.is_thumbnail)?.img_url || "/default.jpg",
            })
        ).then(() => toast.success("Added to cart!"));
    };

    const handleClose = () => {
        dispatch(toggleModal({ showModal: false, product: null }));
    };

      const stockAvailable = selectedVariant
        ? selectedVariant.stock_quantity > 0
        : product.variants?.length > 0
        ? product.variants.some((v) => v.stock_quantity > 0)
        : product.product_stock > 0;
    const getColorStyle = (color) => {
        if (color === "No Color") return "#d3d3d3";
        return color.toLowerCase();
    };

    return (
        <div className={styles.productModal}>
            <div className={styles.productContainer}>
                <div className={styles.colLeft}>
                    <Image
                        src={product.images.find((img) => img.is_thumbnail)?.img_url || "/default.jpg"}
                        width={350}
                        height={450}
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
                    <span onClick={handleClose} className={styles.closeIcon}>
                        <AiOutlineClose className={styles.closeIc} />
                    </span>
                    <p className={styles.categoryPath}>
                        Shop / <span>{product.category_name || "Dresses"}</span>
                    </p>
                    <h1 className={styles.title}>{product.product_name}</h1>
                    <p className={styles.miniDescription}>
                        {product.description ||
                            "Select Your Preffered Size & Color!"}
                    </p>
                     <div className={styles.rate}>
                        <Rating name="read-only" value={2} readOnly />
                        2 Reviews
                        
                    </div>
                     <h3 className={styles.price}>
                        <span>
                            <FaTurkishLiraSign className={styles.liraIcon} />
                        </span>
                        {product.price} TL</h3>
                    <div className={styles.variants}>
                        <p><span>Material: </span>{product.variants[0].material}</p>
                        <p><span>Fit Type: </span>{product.variants[0].fit_type}</p>
                    </div>
                      
                   
                    <div className={styles.categoryColorFilter}>
                        <p className={styles.title}>Available Colors</p>
                        <div
                            style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "10px",
                                padding: "5px",
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
                                            border: `3px solid ${
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
                        <div style={{ display: "flex", gap: "10px", padding: "5px" }}>
                            {availableSizes.map((size) => (
                                <div
                                    key={size}
                                    onClick={() => handleSelectSize(size)}
                                    className={styles.sizeDiv}
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
                    <div className={styles.quantityFilter}>
                        <p className={styles.title}>Quantity</p>
                        <div style={{ padding: "5px" }}>
                            <input
                                type="number"
                                value={selectedQuantity}
                                onChange={handleQuantityChange}
                                min="1"
                                max={selectedVariant ? selectedVariant.stock_quantity : product.product_stock}
                                style={{
                                    width: "60px",
                                    padding: "5px",
                                    border: `1px solid #00000030`,
                                    borderRadius: "5%",
                                    textAlign: "center",
                                    fontSize: "16px",
                                }}
                                disabled={!selectedVariant || !stockAvailable}
                            />
                            {selectedVariant && (
                                <p style={{ fontSize: "14px", color: "#333", marginTop: "5px" }}>
                                    {selectedVariant.stock_quantity} in stock
                                </p>
                            )}
                        </div>
                    </div>
                    <div className={styles.btns}>
                        <button
                            className={styles.addToCart}
                            onClick={handleAddToCart}
                            
                            style={{
                                opacity: !selectedSize || !selectedColor || !stockAvailable ? 0.9 : 1,
                           
                            }}
                        >
                            ADD TO CART
                        </button>
                        <TransitionLink onClick={handleClose} href={`/products/${product.product_id}`} className={styles.viewMore}>
                            MORE DETAILS...
                        </TransitionLink>
                    </div>
                </div>
            </div>
            <ToastContainer className={styles.toaster} position="top-center" draggable  theme="colored" />
        </div>
    );
};

export default ProductModal;