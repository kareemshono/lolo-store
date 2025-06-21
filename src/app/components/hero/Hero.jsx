"use client"

import { HiShoppingBag } from "react-icons/hi2"
import { FaCircleArrowDown } from "react-icons/fa6";
import styles from "./Hero.module.scss"
import { Inter } from "next/font/google"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"

const inter = Inter({ subsets: ["latin"] })

const Hero = () => {
  const router = useRouter()

  // Variants for staggered animation of .colLeft elements
  const containerVariants = {
    hidden: { opacity: 1 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3, // Delay between children animations
        delayChildren: 0.5, // Delay before starting stagger
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
        ease: [0.42, 0, 0.58, 1], // Smooth easing
      },
    },
  }

  const handleShopNow = () => {
    router.push("/shop")
  }

  const handleScroll = () => {
    console.log('Scroll arrow clicked, scrolling down 500px');
    window.scrollBy({
      top: 700,
      behavior: 'smooth',
    });
  }

  return (
    <section className={styles.heroSection}>
      <motion.div
        className={styles.colLeft}
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.h3 className={styles.best} variants={itemVariants}>Best</motion.h3>
        <motion.h1 className={styles.title} variants={itemVariants}>
          For Women
        </motion.h1>
        <motion.p className={styles.subtitle} variants={itemVariants}>
          Discover the latest trends and timeless pieces, designed for <br /> the modern
          woman. Shop our exclusive collection today.
        </motion.p>
        <motion.button
          onClick={handleShopNow}
          className={`${styles.btn} ${inter.className}`}
          variants={itemVariants}
        >
          <span><HiShoppingBag /></span>
          Shop Now
        </motion.button>
      </motion.div>
      <div className={styles.colRight}></div>
      <div className={styles.scrollArrow}>
        <FaCircleArrowDown
          className={styles.icon}
          onClick={handleScroll}
          style={{ cursor: 'pointer' }}
        />
      </div>
    </section>
  )
}

export default Hero