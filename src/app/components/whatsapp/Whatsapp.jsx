"use client"
import { FaWhatsapp } from "react-icons/fa";
import styles from "./Whatsapp.module.scss"
const Whatsapp = () => {
  const openWhatsApp = () => {
    const phoneNumber = "+905365139115"; // Replace with your number
    const message = "Hello, I need more information!";
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };
  return (
    <div onClick={openWhatsApp} className={styles.whatsappContainer}>

        <FaWhatsapp className={styles.whatsappIcon} />
    </div>
  )
}

export default Whatsapp