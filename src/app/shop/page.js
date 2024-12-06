"use client";
import { IoFilterSharp } from "react-icons/io5";
import * as React from "react";
import Slider from "@mui/material/Slider";
import { motion } from "framer-motion";
import styles from "./Shop.module.scss";
import ShopCollection from "../components/shopCollection/ShopCollection";
import { Inter } from "next/font/google";

const colors = ["lightpink", "skyblue", "green", "mediumorchid", "lightgrey"];
const sizes = ["xs", "s", "m", "l"];
const inter = Inter({ subsets: ["latin"] });

const Shop = () => {
  const [value, setValue] = React.useState([20, 37]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Animations
  const titleVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5 },
    }),
  };

  const containerVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
  };

  const productVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
  };

  return (
    <section className={`${styles.shopContainer} ${inter.className}`}>
      <motion.div
        className={styles.shopBanner}
        initial="hidden"
        animate="visible"
      >
        <h1 className={styles.title}>
          {Array.from("SHOP").map((letter, index) => (
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

      <div className={styles.shopBody}>
        <motion.div
          className={styles.colFilters}
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <div className={styles.title}>
            <h3>
              Filter by category
              <span>
                <IoFilterSharp />
              </span>
            </h3>
          </div>
          <div className={styles.categoryListFilter}>
            <p>All categories</p>
            <ul className={styles.categoryList}>
              <li>Dresses</li>
              <li>Abaya</li>
            </ul>
          </div>
          <div className={styles.categoryColorFilter}>
            <p>By color</p>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                padding: "10px",
              }}
            >
              {colors.map((color) => (
                <div
                  key={color}
                  onClick={() => console.log(color)}
                  style={{
                    backgroundColor: color,
                    boxShadow: "0px 0px 10px #00000022",
                    width: "30px",
                    height: "30px",
                    border: "1px solid #00000030",
                    padding: "5px",
                    borderRadius: "50%",
                    cursor: "pointer",
                  }}
                ></div>
              ))}
            </div>
          </div>
          <div className={styles.categorySizeFilter}>
            <p>By size</p>
            <div style={{ display: "flex", gap: "10px", padding: "10px" }}>
              {sizes.map((size) => (
                <div
                  key={size}
                  onClick={() => console.log(size)}
                  style={{
                    width: "70px",
                    textAlign: "center",
                    border: "1px solid #00000030",
                    padding: "0px 10px",
                    textTransform: "uppercase",
                    borderRadius: "5%",
                    cursor: "pointer",
                  }}
                >
                  <p>{size}</p>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.categoryPriceFilter}>
            <p>By Price</p>$10
            <Slider
              getAriaLabel={() => "Temperature range"}
              value={value}
              sx={{
                color: "gray",
                "& .MuiSlider-thumb": {
                  border: "2px solid gray",
                },
                "& .MuiSlider-track": {
                  backgroundColor: "gray",
                },
                "& .MuiSlider-rail": {
                  backgroundColor: "#d3d3d3",
                },
              }}
              onChange={handleChange}
              valueLabelDisplay="auto"
            />
            $1000
          </div>
        </motion.div>

        <motion.div
          className={styles.colProducts}
          initial="hidden"
          animate="visible"
          variants={productVariants}
        >
          <div className={styles.productsHeader}>
            <div className={styles.colLeft}>
              <p>Showing results 1 of 10</p>
            </div>
            <div className={styles.colRight}>Sort by</div>
          </div>
          <ShopCollection />
        </motion.div>
      </div>
    </section>
  );
};

export default Shop;
