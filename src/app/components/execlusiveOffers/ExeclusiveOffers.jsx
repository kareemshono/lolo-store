"use client"
import Image from "next/image"

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { FaRegEyeSlash } from "react-icons/fa";
import { motion } from "framer-motion"
import styles from "./ExeclusiveOffers.module.scss"
import { Autoplay, Pagination } from 'swiper/modules';

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
const ExeclusiveOffers = () => {
  return (
    <section className={styles.execlusiveOffersSection}>
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }} // Trigger animation when 30% of the element is in view
        className={styles.header}>
            <motion.h1 variants={itemVariants}> <span>Execlusive</span> Offers</motion.h1>
            <motion.p variants={itemVariants}>Unwrap the Best Deals: Exclusive Offers on Trendy Women&lsquo;s Fashion.</motion.p>
            <div className={styles.divider}>
            <Image src={"/divider.svg"} width={200} height={50} alt="vector"/>
        </div>
        </motion.div>
        <div className={styles.body}>
        {/* <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        loop={true}
        slidesPerView={3}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination]}
        className={styles.mySwiper}
      >
        <SwiperSlide>
            <Image src={"/offer1.webp"} width={400} height={400} alt="product"/>
            <div className={styles.productDescription}>
              <h2>Product Name</h2>
              <p>$100-$130</p>
            </div>
        </SwiperSlide>
        <SwiperSlide>
        <Image src={"/offer2.webp"} width={400} height={400} alt="product"/>
        <div className={styles.productDescription}>
          <h2>Product Name</h2>
          <p>$100-$130</p>
        </div>
        </SwiperSlide>
        <SwiperSlide>
        <Image src={"/offer3.webp"} width={400} height={400} alt="product"/>
        <div className={styles.productDescription}>
          <h2>Product Name</h2>
          <p>$100-$130</p>
        </div>
        </SwiperSlide>
        <SwiperSlide>
        <Image src={"/offer4.webp"} width={400} height={400} alt="product"/>
        <div className={styles.productDescription}>
          <h2>Product Name</h2>
          <p>$100-$130</p>
        </div>
        </SwiperSlide>
        <SwiperSlide>
        <Image src={"/offer5.webp"} width={400} height={400} alt="product"/>
        <div className={styles.productDescription}>
          <h2>Product Name</h2>
          <p>$100-$130</p>
        </div>
        </SwiperSlide>
        <SwiperSlide>
        <Image src={"/dress.webp"} width={400} height={400} alt="product"/>
        <div className={styles.productDescription}>
          <h2>Product Name</h2>
          <p>$100-$130</p>
        </div>
        </SwiperSlide>
       
      
      </Swiper> */}
        <div className={styles.glassOverlay}>
        </div>
        <div className={styles.text}>
          <FaRegEyeSlash className={styles.icon} />
          <h2>Coming <span>Soon</span>...</h2>
          <p>This photo contains something <br />you may find interesting</p>
        </div>
        </div>
     
     
    </section>
  )
}

export default ExeclusiveOffers