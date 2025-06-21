import { IoReturnUpBack } from "react-icons/io5";
import styles from "./UnderConstruction.module.scss"
import Link from "next/link";
const UnderConstruction = () => {
  return (
    <section className={styles.pageContainer}>
        <div className={styles.colText}>
            <h1>PAGE IS UNDER <span> CONSTRUCTION!</span> </h1>
            <h2>We are very sorry, page is currently undergoing maintenance <br />
            we wil be back shortly, thank you for your patience</h2>
            <Link href="/">
                <IoReturnUpBack className={styles.icon} />
                GO BACK</Link>
        </div>
        
    </section>
  )
}

export default UnderConstruction