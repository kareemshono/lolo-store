import Image from "next/image"
import { FaHeart } from "react-icons/fa6"
import { BsBag } from "react-icons/bs";
import styles from "./ShopCollectionItem.module.scss"

const ShopCollectionItem = ({id,name,img_url,price,sizes}) => {
  return (
    <div className={styles.shopCollectionItem}>
        <div className={styles.imgContainer}>
            <Image src={img_url} width={340} height={220} alt={name + "img"} />
           
        </div>
        <div className={styles.infoContainer}>
            <div className={styles.colLeft}>
                <h4 className={styles.title}>
                    {name}
                </h4>
                <span className={styles.wishHeart}>
                <FaHeart />
                </span>
                    <span className={styles.addToCart}>
                    <BsBag />
                    <span className={styles.text}>Add to cart</span>
                    
                    </span>
                <span className={styles.priceRange}>
                    {price}
                </span>
            </div>
            <div className={styles.colRight}>
                {sizes?.map((size) => {
                    return <span key={size}>{size}</span>
                                  })}
            </div>
        </div>
    </div>
  )
}

export default ShopCollectionItem