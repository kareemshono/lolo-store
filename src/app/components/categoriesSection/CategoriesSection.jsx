"use client"
import Image from "next/image";
import CategorySectionItem from "../categorySectionItem/CategorySectionItem";
import { categoriesData } from "./categories";
import { motion } from "framer-motion"
import styles from "./CategoriesSection.module.scss";

// Animation variants for the parent container
const containerVariants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Delay between each child card animation
      delayChildren: 0.3,   // Delay before the first child starts animating
    },
  },
}
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
}
const CategoriesSection = () => {
  return (
    <section className={styles.categoriesSection}>
        <motion.div className={styles.row}
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }} // Trigger animation when 30% of the element is in view
        >
            <motion.h1 variants={itemVariants}>Categories</motion.h1>
            <motion.p variants={itemVariants}>Discover Your Style Across Every Collection</motion.p>
            <div className={styles.divider}>
            <Image src={"/divider2.svg"} width={200} height={50} alt="vector"/>
        </div>
        </motion.div>
        <div className={styles.row}>
        {categoriesData?.map(item => {
            return <CategorySectionItem key={item.id} title={item.title} imgUrl={item.imgUrl} url={item.url} />
        })}
        </div>
    </section>
  )
}

export default CategoriesSection