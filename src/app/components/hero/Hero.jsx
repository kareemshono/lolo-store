"use client"

import Image from "next/image"
import { HiShoppingBag } from "react-icons/hi2"
import styles from "./Hero.module.scss"
import { Inter, Raleway } from "next/font/google"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const inter = Inter({ subsets: ["latin"] })

const Hero = () => {
  const [carouselImgs, setCarouselImgs] = useState([
    { id: 0, img: "/girl-shopping.webp" },
    { id: 1, img: "/girl-shopping2.webp" },
    { id: 2, img: "/girl-shopping4.webp" },
    { id: 3, img: "/girl-shopping3.png" },
  ])

  const [currentImage, setCurrentImage] = useState(0)
  const [direction, setDirection] = useState(1) // To track slide direction

  // Auto switch images every 4 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      setDirection(1) // slide to the right
      setCurrentImage((prevImage) =>
        prevImage === carouselImgs.length - 1 ? 0 : prevImage + 1
      )
    }, 4000)

    return () => clearInterval(intervalId) // Cleanup interval on component unmount
  }, [carouselImgs.length])

  // Animation variants for image transitions
  const imageVariants = {
    initial: (direction) => ({
      opacity: 0,
      x: direction > 0 ? 100 : -100, // Slide in from the right if direction is positive, left if negative
    }),
    animate: {
      opacity: 1,
      x: 0, // Bring image to the center
      transition: {
        duration: 2,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    exit: (direction) => ({
      opacity: 0,
      x: direction > 0 ? -100 : 100, // Slide out to the left if direction is positive, right if negative
      transition: { duration: 1.5, ease: "easeInOut" },
    }),
  }

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

  return (
    <section className={styles.heroSection}>
      <motion.div
        className={styles.colLeft}
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.h1 className={styles.title} variants={itemVariants}>
          For Women
        </motion.h1>
        <motion.h3 className={styles.best} variants={itemVariants}>Best</motion.h3>
        <motion.p className={styles.subtitle} variants={itemVariants}>
          Discover the latest trends and timeless pieces, designed for <br /> the modern
          woman. Shop our exclusive collection today.
        </motion.p>
        <motion.button
          className={`${styles.btn} ${inter.className}`}
          variants={itemVariants}
        >
          <span><HiShoppingBag /></span>
          Shop Now
        </motion.button>
      </motion.div>

      <div className={styles.colRight}>
        <div className={styles.carouselContainer}>
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={carouselImgs[currentImage].id}
              className={styles.carouselSlide}
              variants={imageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              custom={direction} // Pass direction to variants
            >
              <Image
                src={carouselImgs[currentImage].img}
                width={600}
                height={400}
                alt={`carousel-image-${currentImage}`}
                priority={true} // Preload images for better performance
                style={{ objectFit: "cover", maxWidth: "100%", height: "auto" }}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

export default Hero
