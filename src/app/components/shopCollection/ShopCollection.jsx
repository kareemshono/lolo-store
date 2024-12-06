import ShopCollectionItem from "../shopCollectionItem/ShopCollectionItem"
import { products } from "./productsDummyData"
import styles from "./ShopCollection.module.scss"

const ShopCollection = () => {
  return (
    <div className={styles.shopCollectionContainer}>
        {products?.map((product) => {
            return <ShopCollectionItem key={product.id} id={product.id} name={product.name} img_url={product.img_url} price={product.price} sizes={product.sizes} />
        })}
    </div>
  )
}

export default ShopCollection