import Image from "next/image";
import { FaHeart } from "react-icons/fa6";
import { GrView } from "react-icons/gr";
import { FaCartPlus } from "react-icons/fa";



import styles from "./NewArrivalCard.module.scss";
import { Inter } from "next/font/google";
const inter = Inter({subsets:["latin"]})
const NewArrivalCard = ({id,imgUrl,title,priceRange}) => {
  return (
    <div className={styles.cardContainer}>
      <div className={styles.imgWrapper}>
      <div style={{backgroundImage:`url(${imgUrl})`}} className={styles.imgContainer}>
      
   
        </div>
        <span className={styles.wishHeart}>
        
        <FaHeart />
      </span>
     <button className={`${styles.cartButton} ${inter.className}`}>
      <FaCartPlus /> Add To Cart
     </button>
      <div className={styles.hoverDiv}>
          <p>
            <span><GrView /></span>
             Quick View</p>
        </div>
      </div>
     
        <div className={styles.text}>
          <h2>{title}</h2>
          <p>{priceRange}</p>
        </div>
    </div>
  )
}

export default NewArrivalCard;