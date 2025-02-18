"use client"

import { FaHeart } from "react-icons/fa6"
import { GrView } from "react-icons/gr"
import { FaCartPlus } from "react-icons/fa"
import { motion } from "framer-motion"
import styles from "./NewArrivalCard.module.scss"
import { Inter } from "next/font/google"
import { useDispatch } from "react-redux"
import { toggleModal } from "@/redux/slices/productModal/productModalSlice"

const inter = Inter({ subsets: ["latin"] })

const NewArrivalCard = ({ id, imgUrl, title, priceRange, sizes, cardVariants,item }) => {
  const dispatch = useDispatch()
  return (
    <motion.div
      className={styles.cardContainer}
      variants={cardVariants} // Apply animation variants
    >
      <div className={styles.imgWrapper}>
        <div
          style={{ backgroundImage: `url(${imgUrl})` }}
          className={styles.imgContainer}
        ></div>
        <span className={styles.wishHeart}>
          <FaHeart />
        </span>
        <button className={`${styles.cartButton} ${inter.className}`}>
          <FaCartPlus /> Add To Cart
        </button>
        <div className={styles.hoverDiv}>
          <p onClick={() => dispatch(toggleModal(true))}>
            <span>
              <GrView />
            </span>
            Quick View
          </p>
        </div>
      </div>

      <div className={styles.text}>
        <div className={styles.left}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.price}>{priceRange}</p>
        </div>
        <div className={styles.right}>
          {sizes?.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default NewArrivalCard
