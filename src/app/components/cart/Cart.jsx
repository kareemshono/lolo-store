"use client"

import Image from "next/image"
import { FaPlus, FaMinus } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";
import styles from "./Cart.module.scss"
import { useRouter } from "next/navigation";

const Cart = ({handleToggle}) => {
   
const router = useRouter();
const navigateToCheckout = () => {
    router.push("/checkout");
    handleToggle(false)
}
  return (
    <div  className={styles.cartModal}>

        <div  className={styles.cartContainer}>
            <div  className={styles.colLeft}>
                <div className={styles.header}>
                  
                    <h2>Your Cart</h2>
                    <p className={styles.subtitle}>You have 3 items in your cart</p>
                </div>
                <div className={styles.body}>
                <div className={styles.cartItem}>
                    <div className={styles.itemImage}>
                        <Image src="/offer1.webp" width={100} height={75} alt="none" />
                    </div>
                    <div className={styles.itemInfo}>
                    <p className={styles.itemTitle}>
                        Brown silky smooth
                    </p>
                    <p className={styles.itemSubtitle}>
                        women dress
                    </p>
                </div>
                <div className={styles.itemQuant}>
                    <span><FaPlus /></span>
                    <span className={styles.count}>
                        0
                    </span>
                    <span><FaMinus /></span>
                </div>
                <div className={styles.itemPrice}>
                    <span>$ 100.00</span>
                </div>
                <div className={styles.itemDelete}>
                    <span><MdDeleteForever /></span>
                </div>
                </div>
         
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
                    <p>200.00</p>
                    <p>$30</p>
                    <p>$230.00s</p>
                </div>
               </div>
               <div className={styles.row}>
                         <button onClick={() => navigateToCheckout()} className={styles.btnCheckout}>
                             <span>$230.00</span>
                             Checkout
                             </button>                        
                     </div>
                     
           
            </div>
        </div>
    </div>
  )
}

export default Cart