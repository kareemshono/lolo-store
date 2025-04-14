import styles from "./Spinner.module.scss"

const Spinner = () => {
  return (
    <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}>
            <img src="/spinner.svg"  alt="" />
            <h3>ON YOUR MARKS!</h3>
        </div>
    </div>
  )
}

export default Spinner