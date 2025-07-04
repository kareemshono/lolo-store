"use client";

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { motion } from "framer-motion";
import Rating from '@mui/material/Rating';
import { FaCircleUser } from "react-icons/fa6";
import { FaCheckCircle } from "react-icons/fa";
import styles from "./CustomerReviews.module.scss";
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import Image from 'next/image';
import { useEffect } from 'react';

// Animation variants for the parent container
const containerVariants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

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
};

const CustomerReviews = () => {
  useEffect(() => {
    console.log("CustomerReviews Swiper initialized");
  }, []);

  return (
    <section className={styles.customerReviewsSection}>
      <motion.div variants={containerVariants} className={styles.header}>
        <motion.h1 variants={itemVariants}>
          Our <span>Customers</span> Reviews
        </motion.h1>
        <motion.p variants={itemVariants}>
          Hear What Our Customers Say About Us:
        </motion.p>
      </motion.div>
      <div className={styles.body}>
        <Swiper
          spaceBetween={30}
          centeredSlides={true}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
          }}
          loop={true}
          slidesPerView={1} // Default for mobile
          breakpoints={{
            768: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
          }}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          modules={[Autoplay, Pagination, Navigation]}
          className={styles.mySwiper2}
          onSlideChange={() => console.log("Swiper slide changed")}
        >
          <SwiperSlide className={styles.slide}>
            <div className={styles.header}>
              <Rating name="read-only" value={3.5} readOnly />
              <span className={styles.useIcon}><FaCircleUser /></span>
            </div>
            <div className={styles.title}>
              <p>Sarah M.</p>
              <span className={styles.checkIcon}>
                <FaCheckCircle />
              </span>
            </div>
            <div className={styles.text}>
              "Absolutely love the quality of the dresses I ordered! The fabric feels luxurious, and they fit perfectly. NS Fashion has become my go-to for all my fashion needs."
            </div>
          </SwiperSlide>
          <SwiperSlide className={styles.slide}>
            <div className={styles.header}>
              <Rating name="read-only" value={4} readOnly />
              <span className={styles.useIcon}><FaCircleUser /></span>
            </div>
            <div className={styles.title}>
              <p>Rama K.</p>
              <span className={styles.checkIcon}>
                <FaCheckCircle />
              </span>
            </div>
            <div className={styles.text}>
              "The fast delivery was a game-changer! I needed a dress last minute, and it arrived within 48 hours. Great service and beautiful collection."
            </div>
          </SwiperSlide>
          <SwiperSlide className={styles.slide}>
            <div className={styles.header}>
              <Rating name="read-only" value={5} readOnly />
              <span className={styles.useIcon}><FaCircleUser /></span>
            </div>
            <div className={styles.title}>
              <p>Lana C.</p>
              <span className={styles.checkIcon}>
                <FaCheckCircle />
              </span>
            </div>
            <div className={styles.text}>
              "The customer service at NS Fashion is top-notch. They helped me pick out the perfect outfit for a wedding, and I received so many compliments! Highly recommend."
            </div>
          </SwiperSlide>
          <SwiperSlide className={styles.slide}>
            <div className={styles.header}>
              <Rating name="read-only" value={4} readOnly />
              <span className={styles.useIcon}><FaCircleUser /></span>
            </div>
            <div className={styles.title}>
              <p>Sofy H.</p>
              <span className={styles.checkIcon}>
                <FaCheckCircle />
              </span>
            </div>
            <div className={styles.text}>
              "I’m obsessed with their exclusive offers! Got my hands on a beautiful summer dress at a great discount. The quality is impressive, and it looks even better in person."
            </div>
          </SwiperSlide>
          <SwiperSlide className={styles.slide}>
            <div className={styles.header}>
              <Rating name="read-only" value={5} readOnly />
              <span className={styles.useIcon}><FaCircleUser /></span>
            </div>
            <div className={styles.title}>
              <p>Nour S.</p>
              <span className={styles.checkIcon}>
                <FaCheckCircle />
              </span>
            </div>
            <div className={styles.text}>
              "I’ve never had a better online shopping experience. From secure payment options to seamless delivery, NS Fashion really knows how to make their customers happy. Will be shopping again!"
            </div>
          </SwiperSlide>
          <SwiperSlide className={styles.slide}>
            <div className={styles.header}>
              <Rating name="read-only" value={2} readOnly />
              <span className={styles.useIcon}><FaCircleUser /></span>
            </div>
            <div className={styles.title}>
              <p>Lamia K.</p>
              <span className={styles.checkIcon}>
                <FaCheckCircle />
              </span>
            </div>
            <div className={styles.text}>
              "The trendy designs at NS Fashion keep me coming back. Their styles are always on point, and the quality is unmatched. Love my new fall collection pieces!"
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </section>
  );
};

export default CustomerReviews;