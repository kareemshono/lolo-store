"use client"
import Image from "next/image"
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import styles from "./Featured.module.scss"

const Featured = () => {
  const titleVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5 },
    }),
  };
  return (
    <div className={styles.featuredContainer}>
      <div className={styles.header}>
      <motion.div
        className={styles.featuredBanner}
        initial="hidden"
        animate="visible"
      >
        <h1 className={styles.title}>
          {Array.from("FEATURED").map((letter, index) => (
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
    <div className={styles.colLeft}>
        <Image src="/featuredBanner.webp" width={500} height={350} alt="banner" />

      </div>
        <div className={styles.colRight}>
            <h1>COME CHECK OUR FEATURED PRODUCTS</h1>
            <p>Welcome to <span>NS Fashion</span>, where elegance meets tradition. Discover a stunning collection of womens
               dresses and abayas designed for every occasion. From modern chic styles to timeless classics, our pieces blend comfort,
                sophistication, and quality. Whether you are looking for casual wear or glamorous outfits, we have got something perfect for you. Our abayas showcase intricate details and graceful designs,
                 embracing cultural heritage with a contemporary twist. At NS Fashion, we believe in empowering women through fashion that speaks confidence and individuality. Explore our exclusive range and redefine
               your wardrobe with timeless elegance. Your style journey starts here!</p>
        </div>
    </div>
    <div className={styles.row}>
    <Swiper
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
        modules={[Autoplay]}
        className={styles.mySwiper2}
      >
        <SwiperSlide>
            <Image src={"/offer1.webp"} width={400} height={400} alt="product"/>
          
        </SwiperSlide>
        <SwiperSlide>
        <Image src={"/offer2.webp"} width={400} height={400} alt="product"/>
        
        </SwiperSlide>
        <SwiperSlide>
        <Image src={"/offer3.webp"} width={400} height={400} alt="product"/>
       
        </SwiperSlide>
        <SwiperSlide>
        <Image src={"/offer4.webp"} width={400} height={400} alt="product"/>
        
        </SwiperSlide>
        <SwiperSlide>
        <Image src={"/offer5.webp"} width={400} height={400} alt="product"/>
      
        </SwiperSlide>
        <SwiperSlide>
        <Image src={"/dress.webp"} width={400} height={400} alt="product"/>
        
        </SwiperSlide>
       
      
      </Swiper>
    </div>
    </div>
  )
}

export default Featured