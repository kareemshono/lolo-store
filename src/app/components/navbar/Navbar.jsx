"use client";
import Link from "next/link";
import { BsBag } from "react-icons/bs";
import { IoMdArrowDropdown } from "react-icons/io";
import { CiDeliveryTruck } from "react-icons/ci";
import { FaUserEdit, FaSignOutAlt } from "react-icons/fa";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

import styles from "./Navbar.module.scss";
import Image from "next/image";
import Cart from "../cart/Cart";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/redux/slices/userSlice/userSlice";
import { fetchCart } from "@/redux/slices/cart/cartSlice";
import TransitionLink from "../transition/TransitionLink";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [toggleCart, setToggledCart] = useState(false);
  const [hamToggled, setHamToggled] = useState(false);
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.userSlice);
  const { items, guestCart } = useSelector((state) => state.cart);

  // Calculate cart item count with fallback for SSR
  const cartCount = typeof window !== "undefined" ? (
    user
      ? items.reduce((sum, item) => sum + (item.quantity || 0), 0)
      : guestCart.reduce((sum, item) => sum + (item.quantity || 0), 0)
  ) : 0;

  // Close hamburger menu on navigation
  const handleNavClose = () => {
    if (hamToggled) {
      setHamToggled(false);
      console.log("Navbar: Closing hamburger menu on navigation");
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch cart for authenticated user
  useEffect(() => {
    if (user) {
      console.log('Navbar: Fetching cart for user:', user);
      dispatch(fetchCart());
    }
    console.log('Navbar: Pathname:', pathname, 'Cart count:', cartCount, 'Items:', items, 'GuestCart:', guestCart);
  }, [dispatch, user, pathname]);

  // Check if pathname is /products/[id] or /checkout
  const isDarkBackground = pathname === "/checkout" || pathname === "/privacypolicy" || /^\/products\/\d+$/.test(pathname);

  return (
    <div
      className={`${styles.navContainer} ${
        hamToggled ? `${styles.navToggled}` : ""
      } ${scrolled ? styles.scrolled : styles.transparent}`}
      style={{ backgroundColor: isDarkBackground ? "#171517" : "" }}
    >
      <div className={styles.logo}>
        <TransitionLink href="/" onNavigate={handleNavClose}>
          <Image src={"/navLogo2.svg"} width={100} height={60} alt="logo" />
        </TransitionLink>
      </div>
      <nav className={styles.navbar}>
        <button
          onClick={() => setHamToggled(!hamToggled)}
          className={`${styles.hamBtn} ${hamToggled ? `${styles.isActive}` : ""}`}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <ul className={styles.navList}>
          <li className={styles.navItem}>
            <TransitionLink href="/" className={styles.navLink} onNavigate={handleNavClose}>
              Home
            </TransitionLink>
          </li>
          <li className={styles.navItem}>
            <TransitionLink prefetch href="/shop" className={styles.navLink} onNavigate={handleNavClose}>
              Shop
            </TransitionLink>
          </li>
          <li className={styles.navItem}>
            <TransitionLink href="/featured" className={styles.navLink} onNavigate={handleNavClose}>
              Featured
            </TransitionLink>
          </li>
          <li className={styles.navItem}>
            <TransitionLink href="/about" className={styles.navLink} onNavigate={handleNavClose}>
              About
            </TransitionLink>
          </li>
          <li className={styles.navItem}>
            <TransitionLink href="/contact" className={styles.navLink} onNavigate={handleNavClose}>
              Contact Us
            </TransitionLink>
          </li>
          {!user && (
            <>
              <li className={styles.navItem}>
                <TransitionLink href="/signin" className={styles.navLink} onNavigate={handleNavClose}>
                  Sign In
                </TransitionLink>
              </li>
              <li className={styles.navItem}>
                <TransitionLink href="/signup" className={styles.navLink} onNavigate={handleNavClose}>
                  Sign Up
                </TransitionLink>
              </li>
            </>
          )}
          <li className={styles.navItem}>
            <Link
              onClick={() => setToggledCart(!toggleCart)}
              href="#"
              className={styles.navLink}
              style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
            >
              <BsBag className={styles.cartIcon} />
              {cartCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '-8px',
                    backgroundColor: '#e74c3c',
                    color: '#fff',
                    borderRadius: '50%',
                    width: '18px',
                    height: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                >
                  {cartCount}
                </span>
              )}
            </Link>
          </li>
          {user && (
            <li className={`${styles.navItem} ${styles.dropDownNavItem}`}>
              <Link href="#" className={`${styles.navLink} ${styles.dropDownLink}`}>
                Hi, {user?.name || 'User'}
                <IoMdArrowDropdown className={styles.arrowDropDown} />
              </Link>
              <div className={styles.dropDownDiv}>
                <ul className={styles.dropDownList}>
                  <li className={styles.dropDownItem}>
                    <TransitionLink href="/orders" className={styles.dropDownLink} onNavigate={handleNavClose}>
                      <CiDeliveryTruck className={styles.dropDownIcon} />
                      Your Orders
                    </TransitionLink>
                  </li>
                  <li className={styles.dropDownItem}>
                    <TransitionLink href="/account" className={styles.dropDownLink} onNavigate={handleNavClose}>
                      <FaUserEdit className={styles.dropDownIcon} />
                      Account Info / Edit
                    </TransitionLink>
                  </li>
                  <li
                    onClick={() => dispatch(logoutUser())}
                    className={styles.dropDownItem}
                  >
                    <span className={styles.dropDownLink}>
                      <FaSignOutAlt className={styles.dropDownIcon} />
                      Sign Out
                    </span>
                  </li>
                </ul>
              </div>
            </li>
          )}
        </ul>
      </nav>
      {toggleCart ? <Cart handleToggle={setToggledCart} /> : ""}
    </div>
  );
};

export default Navbar;