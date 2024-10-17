"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import styles from "./ServiceFeatures.module.scss"

// Animation variants for the parent container
const containerVariants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3, // Delay between each child column animation
      delayChildren: 0.2,   // Delay before the first child starts animating
    },
  },
}

const colVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.42, 0, 0.58, 1],
    },
  },
}

const ServiceFeatures = () => {
  return (
    <section className={styles.serviceFeaturesSection}>
      <div className={styles.header}>
        <h1>What We Offer?</h1>
      </div>
      <motion.div
        className={styles.row}
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }} // Trigger animation when 30% of the element is in view
      >
        <motion.div className={styles.col} variants={colVariants}>
          <Image src="/icons/shippingCar.svg" width={50} height={35} alt="Fast Delivery" />
          <div className={styles.text}>
            <h2>Fast Delivery</h2>
            <p>Speedy Shipping, No Delays.</p>
          </div>
        </motion.div>

        <motion.div className={styles.col} variants={colVariants}>
          <Image src="/icons/securePayment.svg" width={50} height={35} alt="Secure Payment" />
          <div className={styles.text}>
            <h2>Secure Payment</h2>
            <p>Safe & Secure Transactions.</p>
          </div>
        </motion.div>

        <motion.div className={styles.col} variants={colVariants}>
          <Image src="/icons/quality.svg" width={50} height={35} alt="Quality Guarantee" />
          <div className={styles.text}>
            <h2>Quality Guarantee</h2>
            <p>Crafted with Care, Guaranteed to Last.</p>
          </div>
        </motion.div>

        <motion.div className={styles.col} variants={colVariants}>
          <Image src="/icons/supportIcon.svg" width={50} height={35} alt="Customer Support" />
          <div className={styles.text}>
            <h2>Customer Support</h2>
            <p>Here for You 24/7.</p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default ServiceFeatures
