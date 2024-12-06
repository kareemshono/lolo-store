import Image from "next/image"
import { LuCopyright } from "react-icons/lu";

import styles from "./Footer.module.scss"
import Link from "next/link"
const Footer = () => {
  return (
    <footer className={styles.footer}>
        <div className={styles.row}>
        <div className={styles.logoCotnainer}>
            <Image src={"/navLogo2.svg"} width={140} height={200}   alt="logo"/>
        </div>
        
        <div className={styles.linksCotnainer}>
            <h4>Links</h4>
            <ul className={styles.list}>
                <li>
                    <Link href="" >
                    Home
                     </Link>
                </li>
                <li>
                    <Link href="" >
                    Shop
                     </Link>
                </li>
                <li>
                    <Link href="" >
                    Featured
                     </Link>
                </li>
                <li>
                    <Link href="" >
                    About
                     </Link>
                </li>
                <li>
                    <Link href="" >
                    Contact Us
                     </Link>
                </li>
                <li>
                    <Link href="" >
                    Sign In
                     </Link>
                </li>
            </ul>
        </div>
        <div className={styles.contactContainer}>
            <h4>Contact Us</h4>
            <p>123 Moda Street,
                Kadıköy,
                34710 Istanbul,
                Turkey</p>
            <p>info@nsfashion.store</p>
                <p>+964 751 124 1004</p>
        </div>
        </div>
       
        <hr className={styles.dividerLine} />
        <div className={styles.row2}>
        <div className={styles.colCopy}>
           <p><span>NS - Store </span> <LuCopyright />   2024. All Rights Reserved.</p> 
        </div>
        <div className={styles.colPay}>
            <ul className={styles.payList}>
                <li>
                    <Image src={"/icons/visa.svg"} width={60} height={40} alt="vector" />
                </li>
                <li>
                    <Image src={"/icons/mastercard.svg"} width={60} height={40} alt="vector" />
                </li>
                <li>
                    <Image src={"/icons/paypal.svg"} width={60} height={40} alt="vector" />
                </li>
                <li>
                    <Image src={"/icons/stripe.svg"} width={60} height={40} alt="vector" />
                </li>
                <li>
                    <Image src={"/icons/gpay.svg"} width={60} height={40} alt="vector" />
                </li>
                <li></li>
            </ul>
        </div>
        </div>
        
    </footer>
  )
}

export default Footer