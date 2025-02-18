import styles from "./CategorySectionItem.module.scss";

const CategorySectionItem = ({id,title,url,imgUrl}) => {
  return (
    <div className={styles.sectionItem}>
        <div style={{backgroundImage:`linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.1)), url(${imgUrl})`}} className={styles.imgContainer}>

        </div>
        <div className={styles.itemText}>
        <h2>{title}</h2>
        <p>SHOP NOW</p>
        </div>
       
    </div>
  )
}

export default CategorySectionItem