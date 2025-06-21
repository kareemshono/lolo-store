"use client";

import Image from "next/image";
import CategorySectionItem from "../categorySectionItem/CategorySectionItem";
import { motion } from "framer-motion";
import styles from "./CategoriesSection.module.scss";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchAllCategories } from "@/redux/slices/categories/categoriesSlice";

// Animation variants for the parent container
const containerVariants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.42, 0, 0.58, 1],
    },
  },
};

const CategoriesSection = () => {
  const dispatch = useDispatch();
  const { categories, isLoading, error } = useSelector((state) => state.categories);

  useEffect(() => {
    dispatch(fetchAllCategories());
  }, [dispatch]);

  return (
    <section className={styles.categoriesSection}>
      <motion.div
        className={styles.row}
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.h1 variants={itemVariants}>Categories</motion.h1>
        <motion.p variants={itemVariants}>
          Discover Your Style Across Every Collection
        </motion.p>
        <div className={styles.divider}>
          <Image src="/divider2.svg" width={200} height={50} alt="vector" />
        </div>
      </motion.div>
      <div className={styles.row}>
        {isLoading && <p>Loading...</p>}
        {error && <p className={styles.error}>{error}</p>}
        {categories.length === 0 && !isLoading && !error && (
          <p>No categories available.</p>
        )}
        {categories.map((item) => (
          <CategorySectionItem
            key={item.id}
            id={item.id}
            title={item.name}
            imgUrl={item.img_url || "/categories/default.jpg"}
            categoryName={item.name}
            variants={itemVariants}
          />
        ))}
      </div>
    </section>
  );
};

export default CategoriesSection;