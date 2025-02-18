import Image from "next/image"
import Rating from '@mui/material/Rating';
import styles from "./ProductModal.module.scss"
import { AiOutlineClose } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { toggleModal } from "@/redux/slices/productModal/productModalSlice";
import { useState } from "react";

const colors = ["lightpink", "skyblue", "green", "mediumorchid", "lightgrey"];
const sizes = ["xs", "s", "m", "l"];
const ProductModal = () => {
    const dispatch = useDispatch();
    const [stockAvailable, setStockAvailable] = useState(false)
  return (
    <div className={styles.productModal}>
        <div className={styles.productContainer}>
            <div className={styles.colLeft}>
                <Image src="/offer1.webp" width={450} height={325} />
                <div className={`${styles.stockStatus} ${stockAvailable ? `${styles.available}`:`${styles.outOfStock}`}`}>
                  <span>{stockAvailable ? "Available":"Out Of Stock"}</span>
                </div>
            </div>
            <div className={styles.colRight}>
            <span onClick={() => dispatch(toggleModal(false))} className={styles.closeIcon}>
                        <AiOutlineClose className={styles.closeIc} />
                    </span>
                <p className={styles.categoryPath}>
                    Shop/ <span>Dresses</span>
                </p>
                <h1 className={styles.title}>Product Title</h1>
                <p className={styles.miniDescription}>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Rem, 
                    numquam?
                </p>
               
                <div className={styles.categoryColorFilter}>
            <p className={styles.title}>Available Colors</p>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                padding: "10px",
              }}
            >
              {colors.map((color) => (
                <div
                  key={color}
                  onClick={() => console.log(color)}
                  style={{
                    backgroundColor: color,
                    
                    width: "30px",
                    height: "30px",
                    border: "1px solid #00000030",
                    padding: "5px",
                    borderRadius: "50%",
                    cursor: "pointer",
                  }}
                ></div>
              ))}
            </div>
          </div>
          <div className={styles.categorySizeFilter}>
            <p className={styles.title}>Available Sizes</p>
            <div style={{ display: "flex", gap: "10px", padding: "10px" }}>
              {sizes.map((size) => (
                <div
                  key={size}
                  onClick={() => console.log(size)}
                  style={{
                    width: "50px",
                    textAlign: "center",
                    border: "1px solid #00000030",
                    padding: "0px 5px",
                    textTransform: "uppercase",
                    borderRadius: "5%",
                    cursor: "pointer",
                  }}
                >
                  <p>{size}</p>
                </div>
              ))}
            </div>
          </div>
          <h3 className={styles.price}>$200.00</h3>
                <div className={styles.rate}>
                     <Rating name="read-only" value="2" readOnly />
                     2 Reviews
                </div>
                <div className={styles.btns}>
                  <button className={styles.addToCart}>ADD TO CART</button>
                  <button className={styles.viewMore}>MORE DETAILS...</button>
                </div>
            </div>
        </div>

    </div>
  )
}

export default ProductModal