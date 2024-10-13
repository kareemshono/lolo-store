import Image from "next/image"
import styles from "./NewArrival.module.scss"
import { newArrivalData } from "./newArrivalData"
import NewArrivalCard from "../newArrivalCard/NewArrivalCard"

const NewArrival = () => {
  return (
    <section className={styles.arrivalSection}>
        <div className={styles.header}>
            <h1>New arrivals</h1>
         
            <p>Collection of new arriving clothes</p>
        </div>
        <div className={styles.divider}>
            <Image src={"/divider.svg"} width={200} height={50} alt="vector"/>
        </div>
        
        <div className={styles.body}>
        {newArrivalData?.map(item => {
          return <NewArrivalCard key={item.id}
          title={item.title}
          imgUrl={item.imgUrl}
          priceRange={item.priceRange}
          />
        })}
        </div>
    </section>
  )
}

export default NewArrival