"use client"

import Image from "next/image"
import styles from "./NewArrival.module.scss"
import { newArrivalData } from "./newArrivalData"
import NewArrivalCard from "../newArrivalCard/NewArrivalCard"
import { motion } from "framer-motion"

// Animation variants for the parent container
const containerVariants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2,
    },
  },
}


// Animation variants for each individual card
const cardVariants = {
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

const NewArrival = () => {
  return (
    <section className={styles.arrivalSection}>
      <motion.div
        className={styles.header}
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.h1 variants={cardVariants}>New arrivals</motion.h1>
        <motion.p variants={cardVariants}>
          Collection of new arriving clothes
        </motion.p>
      </motion.div>

      <div className={styles.divider}>
        <Image src={"/divider.svg"} width={200} height={50} alt="vector" />
      </div>

      <motion.div
        className={styles.body}
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
      >
        {newArrivalData?.map((item) => (
          <NewArrivalCard
            key={item.id}
            title={item.title}
            imgUrl={item.imgUrl}
            priceRange={item.priceRange}
            sizes={item.sizes}
            cardVariants={cardVariants} // Pass variants to each card
          />
        ))}
      </motion.div>
    </section>
  )
}

export default NewArrival
