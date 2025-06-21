"use client"

import { motion } from "framer-motion"
import styles from "./CtaAbout.module.scss"
import TransitionLink from "../transition/TransitionLink"

// Animation variants for the parent container
const containerVariants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3, // Delay between each child element animation
      delayChildren: 0.2,   // Delay before the first child starts animating
    },
  },
}

const textVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.42, 0, 0.58, 1],
    },
  },
}

const CtaAbout = () => {
  return (
    <section className={styles.ctaAboutSection}>
      <motion.div 
        className={styles.content}
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }} // Trigger animation when 30% of the element is in view
      >
        <motion.div className={styles.text}>
          <motion.h2 variants={textVariants}>
            Trendy looks for all seasons
          </motion.h2>
          <motion.p variants={textVariants}>
            Each piece is crafted with care and precision, designed to keep you looking chic all year round
          </motion.p>
          
            <TransitionLink href="/about">
            <motion.button className={styles.btn} variants={textVariants}>About Us</motion.button>
            
            </TransitionLink>
            
          
        </motion.div>
      </motion.div>
    </section>
  )
}

export default CtaAbout
