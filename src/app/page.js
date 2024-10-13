import styles from "./page.module.css";
import Hero from "./components/hero/Hero";
import NewArrival from "./components/newArrival/NewArrival";
import CategoriesSection from "./components/categoriesSection/CategoriesSection";
import ExeclusiveOffers from "./components/execlusiveOffers/ExeclusiveOffers";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Hero />
        <NewArrival />
        <CategoriesSection />
        <ExeclusiveOffers />
       </main>
    </div>
  );
}
