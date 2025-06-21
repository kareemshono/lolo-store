"use client";

import Image from "next/image";
import styles from "./NewArrival.module.scss";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useRef } from "react";
import { fetchAllProducts } from "@/redux/slices/products/productsSlice";
import NewArrivalCard from "../newArrivalCard/NewArrivalCard";
import ProductModal from "../productModal/ProductModal";
import Spinner from "../loadingSpinner/Spinner";

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
};

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
};

const NewArrival = () => {
  const dispatch = useDispatch();
  const { products, isLoading, error } = useSelector((state) => state.products);
  const showModal = useSelector((state) => state.productModal.showModal);
  const sectionRef = useRef(null);
  const hasAnimated = useRef(false);

  // Fetch latest 6 products on mount
  useEffect(() => {
    dispatch(
      fetchAllProducts({
        sort: "created_at_desc",
        limit: 6,
        page: 0,
      })
    );
  }, [dispatch]);

  // IntersectionObserver for reliable animations
  useEffect(() => {
    if (!sectionRef.current || hasAnimated.current || isLoading || error) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          console.log("NewArrival: Section in view, triggering animations");
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, [isLoading, error]);

  return (
    <section className={styles.arrivalSection} ref={sectionRef}>
      <motion.div
        className={styles.header}
        variants={containerVariants}
        initial="hidden"
        
  whileInView="show"
        animate={hasAnimated.current ? "show" : "hidden"}
      >
        <motion.h1 variants={cardVariants}>
          <span>New</span> Arrivals
        </motion.h1>
        <motion.p variants={cardVariants}>
          Collection of new arriving clothes
        </motion.p>
      </motion.div>

      <div className={styles.divider}>
        <Image src="/divider.svg" width={200} height={50} alt="vector" />
      </div>

      <div className={styles.spinnerContainer}>
        {isLoading && <Spinner />}
        {error && <p className={styles.error}>{error}</p>}
      </div>

      <motion.div
        className={styles.body}
        variants={containerVariants}
        initial="hidden"
       
  whileInView="show"
        animate={hasAnimated.current && products.length > 0 ? "show" : "hidden"}
      >
        {products.map((product) => (
          <NewArrivalCard
            key={product.product_id}
            product={product}
            cardVariants={cardVariants}
          />
        ))}
      </motion.div>
      {showModal && <ProductModal />}
    </section>
  );
};

export default NewArrival;