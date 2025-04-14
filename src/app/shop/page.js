"use client";
import { IoFilterSharp } from "react-icons/io5";
import * as React from "react";
import Slider from "@mui/material/Slider";
import { motion } from "framer-motion";
import styles from "./Shop.module.scss";
import ShopCollection from "../components/shopCollection/ShopCollection";
import { Inter } from "next/font/google";
import { products } from "../components/shopCollection/productsDummyData";
const colors = ["lightpink", "skyblue", "green", "mediumorchid", "lightgrey"];
const categories = ["dresses","abaya","shirts","skirts"]
const sizes = ["xs", "s", "m", "l"];


const inter = Inter({ subsets: ["latin"] });
const ColorFilter = ({ colors, selectedColors, handleColorChange }) => {
  return (
    <div className={styles.categoryColorFilter}>
      <p>By color</p>
      <div className={styles.colorContainer}>
        {colors.map((color) => (
          <div
            key={color}
            onClick={() => handleColorChange(color)}
            className={`${styles.colorCircle} ${
              selectedColors.includes(color) ? styles.selected : ""
            }`}
            style={{ backgroundColor: color }}
          ></div>
        ))}
      </div>
    </div>
  );
};
const SizeFilter = ({ sizes, selectedSizes, handleSizeChange }) => {
  return (
    <div className={styles.categorySizeFilter}>
      <p>By size</p>
      <div className={styles.sizeContainer}>
        {sizes.map((size) => (
          <div
            key={size}
            onClick={() => handleSizeChange(size)}
            className={`${styles.sizeBox} ${
              selectedSizes.includes(size) ? styles.selected : ""
            }`}
          >
            <p>{size}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
const Shop = () => {
  const [value, setValue] = React.useState([20, 37]);
  const [productsData,setProductsData] = React.useState(products)
  const [selectedCategories, setSelectedCategories] = React.useState([]);
  const [selectedColors, setSelectedColors] = React.useState([]);
  const [selectedSizes, setSelectedSizes] = React.useState([]);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
 // Handle checkbox change
 const handleCategoryChange = (category) => {
  setSelectedCategories((prev) =>
    prev.includes(category)
      ? prev.filter((c) => c !== category) // Remove if already selected
      : [...prev, category] // Add if not selected
  );
};
const handleColorChange = (color) => {
  setSelectedColors((prev) =>
    prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
  );
};
const handleSizeChange = (size) => {
  setSelectedSizes((prev) =>
    prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
  );
};
  // Filter products based on selected categories
  const filteredProducts =
    selectedCategories.length === 0
      ? productsData // Show all if no category is selected
      : productsData.filter((product) =>
          selectedCategories.includes(product.category)
        );

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
            <div className={styles.categoryList}>
            {categories.map((category) => (
              <div className={styles.selectGroup}>
                    <label key={category} className={styles.selectLabel}>
            <input
              type="checkbox"
              checked={selectedCategories.includes(category)}
              onChange={() => handleCategoryChange(category)}
              className={styles.category}
            />
            <span>{category}</span>
          </label>
              </div>
      
        ))}
            </div>
          </div>
        <>
        <ColorFilter colors={colors} selectedColors={selectedColors} handleColorChange={handleColorChange} /></>
        <>
        <SizeFilter sizes={sizes} selectedSizes={selectedSizes} handleSizeChange={handleSizeChange} />
        </>
        
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
