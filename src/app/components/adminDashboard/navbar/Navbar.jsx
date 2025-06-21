import styles from "./Navbar.module.scss"
import { IoIosArrowDown } from "react-icons/io";
const Navbar = () => {
  return (
    <div className={styles.navContainer}>
        <div className={styles.navLogoContainer}>
            <h2>NS DASHBOARD</h2>
            <p>NS Fashion Store</p>
        </div>
        <nav className={styles.nav}>
            <ul className={styles.navList}>
                <li className={styles.navItem}>
                    <input type="search" name="" id="" />
                </li>
                <li className={styles.navItem}>
                    whatever
                </li>
                <li className={styles.navItem}>
                    admin
                </li>
                <li className={styles.navItem}>
                    Nour Shono 
                    <IoIosArrowDown />
                </li>
            </ul>
        </nav>
    </div>
  )
}

export default Navbar