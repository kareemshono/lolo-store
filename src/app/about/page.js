"use client"
import { motion } from "framer-motion";
import styles from "./About.module.scss"
import Image from "next/image";

const About = () => {
    const titleVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: (i) => ({
          opacity: 1,
          y: 0,
          transition: { delay: i * 0.1, duration: 0.5 },
        }),
      };
  return (
    <div className={styles.aboutUs}>
        <div className={styles.header}>
        <motion.div
        className={styles.aboutBanner}
        initial="hidden"
        animate="visible"
      >
        <h1 className={styles.title}>
          {Array.from("ABOUT-NS").map((letter, index) => (
            <motion.span
              key={index}
              custom={index}
              variants={titleVariants}
              style={{ display: "inline-block" }}
            >
              {letter}
            </motion.span>
          ))}
        </h1>
      </motion.div>
        </div>
        <div className={styles.body}>
            <div className={styles.rowLtr}>
            <div className={styles.colLeft}>
                <Image src="/ns.png" width={450} height={400} alt="none" />
            </div>
            <div className={styles.colRight}>
                <h1>About NS FASHION</h1>
                <p>NS Fashion, based in Turkey, brings you a unique blend of modern elegance and traditional charm. Specializing in womens dresses and abayas, we are dedicated to crafting designs that celebrate individuality and grace. Our collection combines high-quality fabrics with exquisite details, offering something for every style and occasion. At NS Fashion, we honor cultural heritage while embracing contemporary trends, ensuring every woman feels confident and beautiful. Discover timeless fashion</p>
            </div>
            </div>
        
            <div className={styles.rtl}>
            <div className={styles.colLeft}>
                <h1>Each piece is designed by hand</h1>
                <p>At NS Fashion, each piece tells a unique story of elegance and artistry. Our journey begins with thoughtful sketches, where every detail is meticulously planned. From there, skilled hands bring these designs to life, crafting each piece with precision and care. Finally, our creations are brought to fruition, blending quality fabrics and craftsmanship to deliver timeless dresses and abayas. Experience the perfect harmony of design, craftsmanship, and elegance at NS Fashion, your destination for sophistication.</p>
            </div>
            <div className={styles.colRight}>
                <Image src="/sketch.webp" width={550} height={350} alt="none" />
            </div>
            
            </div>
        </div>
    </div>
  )
}

export default About