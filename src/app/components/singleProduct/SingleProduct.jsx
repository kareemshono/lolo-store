"use client"
import Image from 'next/image'
import Rating from "@mui/material/Rating";
import { FaTurkishLiraSign } from "react-icons/fa6";

import styles from "./SingleProduct.module.scss"
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer,toast } from 'react-toastify';
import { addToCart } from '@/redux/slices/cart/cartSlice';

const SingleProduct = ({ product }) => {
      const dispatch = useDispatch();
    
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedQuantity, setSelectedQuantity] = useState(1);
  

    const allSizes = [...new Set(product.variants.map((variant) => variant.size))];
    const allColors = [
        ...new Set(
            product.variants
                .map((variant) => variant.color || "No Color")
                .filter((color) => color !== null)
        ),
    ];
 const selectedVariant = product.variants.find(
        (v) => v.size === selectedSize && (v.color || "No Color") === selectedColor
    );
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
  const getColorStyle = (color) => {
        if (color === "No Color") return "#d3d3d3";
        return color.toLowerCase();
    };
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
  // Fix stock status
    const stockAvailable = selectedVariant
        ? selectedVariant.stock_quantity > 0
        : product.variants?.some((v) => v.stock_quantity > 0) ||
          product.stock_quantity > 0;
  return (
    <div className={styles.singleProductPage}>
        <div className={styles.colLeft}>
                   <div
                        className={`${styles.stockStatus} ${
                            stockAvailable ? styles.available : styles.outOfStock
                        }`}
                    >
                        <span>{stockAvailable ? "Available" : "Out of Stock"}</span>
                    </div>
               <Image
                                   src={product.images.find((img) => img.is_thumbnail)?.img_url || "/default.jpg"}
                                   width={350}
                                   height={450}
                                   alt={product.product_name}
                               />
        </div>
        <div className={styles.colRight}>
            <p className={styles.categoryPath}>
                Shop / <span>{product.category_name || "Dresses"}</span>

            </p>
          <h1 className={styles.title}>
                    {product.product_name || "Product Name Unavailable"}
                </h1>
             <p className={styles.miniDescription}>
                        {product.description ||
                            "Please select both a size & color."}
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
                                   
                                        <div className={styles.cta}>
                                            <button 
                                                  onClick={handleAddToCart}
                            
                            style={{
                                opacity: !selectedSize || !selectedColor || !stockAvailable ? 0.5 : 1,
                           
                            }}>Add To Cart</button>
                                        </div>
                                             <div className={styles.description}>
                                            <h2>Product description:</h2>
                                            <p>{product.description? product.description : "There is no specific description added for this product!, try refreshing the page or try another time or contact us for support"}</p>
                                        </div>
        </div>
        <ToastContainer closeButton={false}  position="bottom-center" draggable  theme="colored" />
    </div>
  )
}

export default SingleProduct