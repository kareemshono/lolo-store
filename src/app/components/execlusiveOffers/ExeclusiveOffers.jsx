"use client"
import Image from "next/image"
import  { useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import styles from "./ExeclusiveOffers.module.scss"
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
const ExeclusiveOffers = () => {
  return (
    <section className={styles.execlusiveOffersSection}>
        <div className={styles.header}>
            <h1>Execlusive Offers</h1>
            <p>Lorem ipsum dolor sit amet.</p>
            <div className={styles.divider}>
            <Image src={"/divider.svg"} width={200} height={50} alt="vector"/>
        </div>
        <div className={styles.body}>
        <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        slidesPerView={3}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className={styles.mySwiper}
      >
        <SwiperSlide>
            <Image src={"/dress.webp"} width={400} height={300} alt="product"/>
        </SwiperSlide>
        <SwiperSlide>
        <Image src={"/abaya.webp"} width={400} height={300} alt="product"/>
        </SwiperSlide>
        <SwiperSlide>
        <Image src={"/dress.webp"} width={400} height={300} alt="product"/>
        </SwiperSlide>
        <SwiperSlide>
        <Image src={"/abaya.webp"} width={400} height={300} alt="product"/>
        </SwiperSlide>
        <SwiperSlide>
        <Image src={"/dress.webp"} width={400} height={300} alt="product"/>
        </SwiperSlide>
       \\
      
      </Swiper>
        </div>
        </div>
     
    </section>
  )
}

export default ExeclusiveOffers