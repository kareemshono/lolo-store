import styles from "./Sidebar.module.scss"
import Link from "next/link"
import { IoIosArrowDown } from "react-icons/io";

const Sidebar = () => {
  return (
    <aside className={styles.sidebarContainer}>
                    <h1>NS ADMIN</h1>
                    <ul className={styles.sidebarList}>
                      <li>
                        <Link href="/">Dashboard</Link>
                        </li>
                      <li>
                        <Link href="/products">Products 
                        <IoIosArrowDown />
                        </Link>
                        </li>
                      <li>
                        <Link href="/orders">Orders
                        <IoIosArrowDown />
                        </Link>
                      </li>
                      <li>
                        <Link href="/users">Users
                        <IoIosArrowDown />
                        </Link>
                      </li>
                      <li></li>
                    </ul>
                  </aside>
  )
}

export default Sidebar