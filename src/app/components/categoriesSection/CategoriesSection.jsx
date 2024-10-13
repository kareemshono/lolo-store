import Image from "next/image";
import CategorySectionItem from "../categorySectionItem/CategorySectionItem";
import { categoriesData } from "./categories";
import styles from "./CategoriesSection.module.scss";


const CategoriesSection = () => {
  return (
    <section className={styles.categoriesSection}>
        <div className={styles.row}>
            <h1>Categories</h1>
            <p>Discover Your Style Across Every Collection</p>
            <div className={styles.divider}>
            <Image src={"/divider2.svg"} width={200} height={50} alt="vector"/>
        </div>
        </div>
        <div className={styles.row}>
        {categoriesData?.map(item => {
            return <CategorySectionItem key={item.id} title={item.title} imgUrl={item.imgUrl} url={item.url} />
        })}
        </div>
    </section>
  )
}

export default CategoriesSection