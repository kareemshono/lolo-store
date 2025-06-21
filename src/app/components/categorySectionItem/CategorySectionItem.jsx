"use client";


import styles from "./CategorySectionItem.module.scss";
import { motion } from "framer-motion";
import TransitionLink from "../transition/TransitionLink";

const CategorySectionItem = ({ id, title, imgUrl, categoryName, variants }) => {
  return (
    <motion.div className={styles.sectionItem} variants={variants}>
      <TransitionLink className={styles.link} href={`/shop?category=${encodeURIComponent(categoryName)}`}>
        <div 
       style={{backgroundImage:`linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.1)), url(${imgUrl ? imgUrl : "categories/dress.webp"})`}}
        className={styles.imgContainer}>
      
          
        </div>
        <div className={styles.itemText}>
          <h2 className={styles.title}>{title}</h2>
          <p>SHOP NOW</p>
        </div>
      </TransitionLink>
    </motion.div>
  );
};

export default CategorySectionItem;