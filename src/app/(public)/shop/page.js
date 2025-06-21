"use client";
import { IoFilterSharp } from "react-icons/io5";
import { FaArrowLeft } from "react-icons/fa";
import * as React from "react";
import { motion } from "framer-motion";
import styles from "./Shop.module.scss";
import ShopCollection from "../../components/shopCollection/ShopCollection";
import { Inter } from "next/font/google";
import { useDispatch, useSelector } from 'react-redux';
import { fetchColors, setFilters } from '@/redux/slices/products/productsSlice';
import { Tooltip } from '@mui/material';
import { useSearchParams } from 'next/navigation';

const categories = ["dresses", "abayas", "shirts", "skirts"];
const sizes = ["xs", "s", "s", "l"];

const inter = Inter({ subsets: ["latin"] });

const ColorFilter = ({ colors, selectedColors, handleColorChange }) => {
    return (
        <div className={styles.categoryColorFilter}>
            <p>By color</p>
            <div className={styles.colorContainer}>
                {colors.map((color) => (
                    <Tooltip
                        key={color}
                        title={color.charAt(0).toUpperCase() + color.slice(1)}
                        placement="top"
                        arrow
                    >
                        <div
                            onClick={() => handleColorChange(color)}
                            className={`${styles.colorCircle} ${
                                selectedColors.includes(color) ? styles.selected : ""
                            }`}
                            style={{ backgroundColor: color }}
                        ></div>
                    </Tooltip>
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
    const dispatch = useDispatch();
    const { colors, filters } = useSelector((state) => state.products);
    const [selectedCategories, setSelectedCategories] = React.useState(filters.categories || []);
    const [selectedSizes, setSelectedSizes] = React.useState(filters.sizes || []);
    const [selectedColors, setSelectedColors] = React.useState(filters.colors || []);
    const [sortOrder, setSortOrder] = React.useState(filters.sort || "");
    const [isFilterOpen, setIsFilterOpen] = React.useState(false);
    const searchParams = useSearchParams();
    // Read URL category parameter on mount
    React.useEffect(() => {
        const category = searchParams.get('category');
        console.log('URL category:', category); // Debug log
        if (category) {
            const normalizedCategory = category.toLowerCase();
            if (categories.includes(normalizedCategory) && !selectedCategories.includes(normalizedCategory)) {
                setSelectedCategories([normalizedCategory]);
            }
        }
    }, [searchParams]);

    // Fetch colors on mount
    React.useEffect(() => {
        dispatch(fetchColors());
    }, [dispatch]);

    // Handle filter changes
    const handleCategoryChange = (category) => {
        setSelectedCategories((prev) =>
            prev.includes(category)
                ? prev.filter((c) => c !== category)
                : [...prev, category]
        );
    };

    const handleSizeChange = (size) => {
        setSelectedSizes((prev) =>
            prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
        );
    };

    const handleColorChange = (color) => {
        setSelectedColors((prev) =>
            prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
        );
    };

    const handleSortChange = (e) => {
        setSortOrder(e.target.value);
    };

    // Toggle filter panel on mobile
    const toggleFilterPanel = () => {
        setIsFilterOpen((prev) => !prev);
        console.log('Filter panel toggled:', !isFilterOpen);
    };

    // Update Redux filters
    React.useEffect(() => {
        dispatch(setFilters({
            categories: selectedCategories,
            sizes: selectedSizes,
            colors: selectedColors,
            sort: sortOrder,
        }));
        console.log('Updated filters:', { categories: selectedCategories, sizes: selectedSizes, colors: selectedColors, sort: sortOrder }); // Debug log
    }, [dispatch, selectedCategories, selectedSizes, selectedColors, sortOrder]);

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
                <button
                    className={styles.filterToggle}
                    onClick={toggleFilterPanel}
                    aria-label="Toggle Filters"
                >
                    <IoFilterSharp />
                </button>
                <motion.div
                    className={`${styles.colFilters} ${isFilterOpen ? styles.filterPanelOpen : ''}`}
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                >
                    <button
                        className={styles.closeIcon}
                        onClick={toggleFilterPanel}
                        aria-label="Close Filters"
                    >
                        <FaArrowLeft />
                    </button>
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
                                <div className={styles.selectGroup} key={category}>
                                    <label className={styles.selectLabel}>
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
                    <ColorFilter
                        colors={colors}
                        selectedColors={selectedColors}
                        handleColorChange={handleColorChange}
                    />
                    <SizeFilter
                        sizes={sizes}
                        selectedSizes={selectedSizes}
                        handleSizeChange={handleSizeChange}
                    />
                    <div className={styles.categorySortFilter}>
                        <p>Sort by</p>
                        <select
                            value={sortOrder}
                            onChange={handleSortChange}
                            className={styles.sortSelect}
                        >
                            <option value="">Default</option>
                            <option value="priceAsc">Price: Low to High</option>
                            <option value="priceDesc">Price: High to Low</option>
                        </select>
                    </div>
                </motion.div>

                <motion.div
                    className={styles.colProducts}
                    initial="hidden"
                    animate="visible"
                    variants={productVariants}
                >
                    <ShopCollection />
                </motion.div>
            </div>
        </section>
    );
};

export default Shop;