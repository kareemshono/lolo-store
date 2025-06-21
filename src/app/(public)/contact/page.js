"use client"
import { motion } from "framer-motion";
import styles from "./ContactUs.module.scss"
import Image from "next/image";

const ContactUs = () => {
    const titleVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: (i) => ({
          opacity: 1,
          y: 0,
          transition: { delay: i * 0.1, duration: 0.5 },
        }),
      };
  return (
    <div className={styles.contactUs}>
        <div className={styles.header}>
        <motion.div
        className={styles.aboutBanner}
        initial="hidden"
        animate="visible"
      >
        <h1 className={styles.title}>
          {Array.from("CONTACT-US").map((letter, index) => (
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
            <div className={styles.formContainer}>
                <div className={styles.colLeft}>
                    <h2>Do not hesitate to contact us at any time!</h2>
                <div className={styles.formGroup}>
                    <label htmlFor="name" className={styles.formLabel}>Full Name*</label>
                    <input type="text" required  className={styles.formControl} />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="email" className={styles.formLabel}>Email*</label>
                    <input type="email" required  className={styles.formControl} />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="phone" className={styles.formLabel}>Phone*</label>
                    <input type="text" required  className={styles.formControl} />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="message" className={styles.formLabel}>Message*</label>
                    <textarea rows={2} required  className={styles.formControl} />
                </div>
                <div className={styles.btnContainer}>
                    <button>Submit Message</button>
                </div>
                </div>
                <div className={styles.colRight}>
                    <Image src="/navLogo2.svg" width={300} height={500} />
                </div>
            </div>
        </div>
    </div>
  )
}

export default ContactUs