"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Spinner.module.scss";

const Spinner = () => {
  const [showApology, setShowApology] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowApology(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingSpinner}>
        <Image className={styles.inf} src="/infSpinner.svg" height={200} width={150} alt="" />

        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: .3 }}
        >
          <motion.span
            initial={{ opacity: 1 }}
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Loading...
          </motion.span>{" "}
          <span style={{ color: "#797979" }}>Good things take a second.</span>
        </motion.h3>

        <AnimatePresence>
          {showApology && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              style={{ marginTop: "1rem", color: "#888" }}
            >
              Sorry for taking longer than usual. Thanks for your patience!
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Spinner;
