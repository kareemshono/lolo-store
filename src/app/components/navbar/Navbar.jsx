import Link from "next/link"
import styles from "./Navbar.module.scss"
import Image from "next/image"
const Navbar = () => {
  return (
<div className={styles.navContainer}>
    <div className={styles.logo}>
        <Link href="/">
        <Image src={"/navlogolast.svg"} width={100} height={75} alt="logo"/>
        </Link>
    </div>
    <nav className={styles.navbar}>
        <button className={styles.hamBtn}>
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
                <Link href="/" className={styles.navLink}>
                Shop 
                </Link>
            </li>
            <li className={styles.navItem}>
                <Link href="/" className={styles.navLink}>
                Featured 
                </Link>
            </li>
            <li className={styles.navItem}>
                <Link href="/" className={styles.navLink}>
                About
                </Link>
            </li>
            <li className={styles.navItem}>
                <Link href="/" className={styles.navLink}>
                Contact Us
                </Link>
            </li>
            <li className={styles.navItem}>
                <Link href="/" className={styles.navLink}>
                Sign In
                </Link>
            </li>
            <li className={styles.navItem}>
                <Link href="/" className={styles.navLink}>
                <Image src={"/icons/cart.svg"} width={30} height={30} alt="cart vector" />
                </Link>
            </li>
        </ul>
    </nav>
</div>
  )
}

export default Navbar