"use client";
import Link from "next/link";
import { BsBag } from "react-icons/bs";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation"; // Import hook for current path
import styles from "./Navbar.module.scss";
import Image from "next/image";
import Cart from "../cart/Cart";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [toggleCart, setToggledCart] = useState(false);
  const [hamToggled, setHamToggled] = useState(false);
  const pathname = usePathname(); // Get current path

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`${styles.navContainer}
       ${
        hamToggled ? `${styles.navToggled}` : ""
      }
      ${
        scrolled ? styles.scrolled : styles.transparent
      }`}
      style={{ backgroundColor: pathname === "/checkout" ? "#171517" : "" }}
    >
      <div className={styles.logo}>
        <Link href="/">
          <Image src={"/navLogo2.svg"} width={100} height={60} alt="logo" />
        </Link>
      </div>
      <nav className={styles.navbar}>
        <button onClick={() => setHamToggled(!hamToggled)}
            className={`${styles.hamBtn} ${hamToggled ? `${styles.isActive}` : ""}`}>
          <span></span>
          <span></span>
          <span></span>
        </button>
        <ul className={styles.navList}>
          <li className={styles.navItem}>
            <Link href="/" className={styles.navLink}>
              Home
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/shop" className={styles.navLink}>
              Shop
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/featured" className={styles.navLink}>
              Featured
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/about" className={styles.navLink}>
              About
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/contact" className={styles.navLink}>
              Contact Us
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/signin" className={styles.navLink}>
              Sign In
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/signup" className={styles.navLink}>
              Sign Up
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link
              onClick={() => setToggledCart(!toggleCart)}
              href="#"
              className={styles.navLink}
            >
              <BsBag className={styles.cartIcon} />
            </Link>
          </li>
        </ul>
      </nav>
      {toggleCart ? <Cart handleToggle={setToggledCart} /> : ""}
    </div>
  );
};

export default Navbar;
