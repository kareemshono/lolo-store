"use client";

import Image from "next/image";
import { useTransition } from "../transition/TransitionProvider";


import { FaPlus, FaMinus } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";
import styles from "./Cart.module.scss";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
    fetchCart,
    updateCartItem,
    removeFromCart,
    mergeCart,
    updateGuestCartQuantity,
    removeFromGuestCart,
} from "@/redux/slices/cart/cartSlice";
import { fetchUser, clearError } from "@/redux/slices/userSlice/userSlice";

const Cart = ({ handleToggle }) => {
    // Inside your component:
const { startLoading } = useTransition();
    const dispatch = useDispatch();
    const router = useRouter();
    const { user, error: authError } = useSelector((state) => state.userSlice);
    const { cart, items, guestCart, isLoading, error: cartError } = useSelector((state) => state.cart);
    const [hasFetchedUser, setHasFetchedUser] = useState(false);
    const [hasMergedCart, setHasMergedCart] = useState(false);

    // Fetch user on mount
    useEffect(() => {
        if (!hasFetchedUser) {
            console.log("Cart: Fetching user...");
            dispatch(fetchUser()).then(() => setHasFetchedUser(true));
        }
    }, [dispatch, hasFetchedUser]);

    // Fetch cart and merge guest cart when user is authenticated
    useEffect(() => {
        if (user && hasFetchedUser) {
            console.log("Cart: Fetching cart for user:", user?.id || 'unknown');
            dispatch(fetchCart());
            if (guestCart.length > 0 && !hasMergedCart) {
                console.log("Cart: Merging guest cart:", guestCart);
                dispatch(mergeCart(guestCart)).then(() => setHasMergedCart(true));
            }
        }
    }, [user, hasFetchedUser, guestCart, hasMergedCart, dispatch]);

    // Clear auth errors
    useEffect(() => {
        if (authError && authError.suppress) {
            console.log("Cart: Clearing auth error:", authError);
            dispatch(clearError());
        }
    }, [authError, dispatch]);

    // Log cart state
    console.log("Cart: State:", { userId: user?.id, cart, items, guestCart, isLoading, cartError });

    // Calculate cart totals
    const cartItems = user ? items : guestCart;
    console.log("Cart: Rendering cart items:", cartItems);

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
    const shipping = subtotal > 0 ? 30 : 0;
    const total = subtotal + shipping;

    // Handle quantity increase
    const handleIncrease = (item) => {
        if (!item) {
            console.error("Cart: Invalid item for increase:", item);
            return;
        }
        console.log("Cart: Increasing quantity for item:", item.id || item.productId);
        const newQuantity = item.quantity + 1;
        if (user) {
            if (!item.id) {
                console.error("Cart: Missing item.id for user cart:", item);
                return;
            }
            dispatch(updateCartItem({ itemId: item.id, quantity: newQuantity }));
        } else {
            if (!item.productId || !item.variantId) {
                console.error("Cart: Missing productId or variantId for guest cart:", item);
                return;
            }
            dispatch(
                updateGuestCartQuantity({
                    productId: item.productId,
                    variantId: item.variantId,
                    quantity: newQuantity,
                })
            );
        }
    };

    // Handle quantity decrease
    const handleDecrease = (item) => {
        if (!item) {
            console.error("Cart: Invalid item for decrease:", item);
            return;
        }
        if (item.quantity <= 1) return;
        console.log("Cart: Decreasing quantity for item:", item.id || item.productId);
        const newQuantity = item.quantity - 1;
        if (user) {
            if (!item.id) {
                console.error("Cart: Missing item.id for user cart:", item);
                return;
            }
            dispatch(updateCartItem({ itemId: item.id, quantity: newQuantity }));
        } else {
            if (!item.productId || !item.variantId) {
                console.error("Cart: Missing productId or variantId for guest cart:", item);
                return;
            }
            dispatch(
                updateGuestCartQuantity({
                    productId: item.productId,
                    variantId: item.variantId,
                    quantity: newQuantity,
                })
            );
        }
    };

    // Handle remove item
    const handleRemove = (item) => {
        if (!item) {
            console.error("Cart: Invalid item for remove:", item);
            return;
        }
        console.log("Cart: Removing item:", item.id || item.productId);
        if (user) {
            if (!item.id) {
                console.error("Cart: Missing item.id for user cart:", item);
                return;
            }
            dispatch(removeFromCart(item.id));
        } else {
            if (!item.productId || !item.variantId) {
                console.error("Cart: Missing productId or variantId for guest cart:", item);
                return;
            }
            dispatch(removeFromGuestCart({ productId: item.productId, variantId: item.variantId }));
        }
    };

    // Handle checkout
    const handleCheckout = () => {
        console.log("Cart: Navigating to checkout, user:", user ? user.id : "guest");
        startLoading(); // ✅ Start spinner
        if (!user) {
            router.push("/signin");
            handleToggle(false);
        } else {
            router.push("/checkout");
            handleToggle(false);
        }
    };

    return (
        <div className={styles.cartModal}>
            <div className={styles.cartContainer}>
                <div className={styles.colLeft}>
                    <div className={styles.header}>
                        <h2>Your Cart</h2>
                        <p className={styles.subtitle}>
                            You have {cartItems.length} item{cartItems.length !== 1 ? "s" : ""} in your cart
                        </p>
                    </div>
                    <div className={styles.body}>
                        {isLoading && <p>Loading...</p>}
                        {cartError && (
                            <p style={{ color: "red" }}>
                                Error: {cartError}
                                {cartError.includes("Invalid product ID")
                                    ? " (Please try refreshing or signing out and back in)"
                                    : ""}
                            </p>
                        )}
                        {authError && !authError.suppress && (
                            <p style={{ color: "red" }}>Auth Error: {authError.message}</p>
                        )}
                        {cartItems.length === 0 && !isLoading && !cartError && <p className={styles.emptyCartText}>
                            Your cart is empty! Try adding some items.</p>}
                        {cartItems.map((item, index) => (
                            <div
                                key={item.id || `${item.productId}-${item.variantId}-${index}`}
                                className={styles.cartItem}
                            >
                                <div className={styles.itemImage}>
                                    <Image
                                        src={item.thumbnail || "/offer1.webp"}
                                        width={90}
                                        height={100}
                                        alt={item.product_name || "Product"}
                                    />
                                </div>
                                <div className={styles.itemInfo}>
                                    <p className={styles.itemTitle}>{item.product_name || "Product"}</p>
                                    <p className={styles.itemSubtitle}>
                                        {item.size ? `Size: ${item.size}` : "Women dress"}
                                        {item.color ? `, Color: ${item.color}` : ""}
                                    </p>
                                </div>
                                <div className={styles.itemQuant}>
                                    <span onClick={() => handleIncrease(item)}>
                                        <FaPlus />
                                    </span>
                                    <span className={styles.count}>{item.quantity}</span>
                                    <span onClick={() => handleDecrease(item)}>
                                        <FaMinus />
                                    </span>
                                </div>
                                <div className={styles.itemPrice}>
                                    <span>{((item.price || 0) * item.quantity).toFixed(2)} TL</span>
                                </div>
                                <div className={styles.itemDelete}>
                                    <span onClick={() => handleRemove(item)}>
                                        <MdDeleteForever />
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className={styles.colRight}>
                    <span onClick={() => handleToggle(false)} className={styles.closeIcon}>
                        <AiOutlineClose className={styles.closeIc} />
                    </span>
                    <div className={styles.row}>
                        <h2 className={styles.summaryTitle}>Your Cart Summary:</h2>
                    </div>
                    <div className={styles.rowBody}>
                        <div className={styles.colSummaryTitles}>
                            <p>Subtotal:</p>
                            <p>Shipping:</p>
                            <p>Total:</p>
                        </div>
                        <div className={styles.colSummaryValues}>
                            <p>{subtotal.toFixed(2)} TL</p>
                            <p>{shipping.toFixed(2)} TL</p>
                            <p>{total.toFixed(2)} TL</p>
                        </div>
                    </div>
                    <div className={styles.row}>
                        <button onClick={handleCheckout} className={styles.btnCheckout}>
                            Checkout
                            <span>{total.toFixed(2)} TL</span>
                            
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;