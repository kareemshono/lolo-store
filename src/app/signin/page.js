"use client"
import Link from "next/link";
import { IoIosLogIn } from "react-icons/io";
import styles from "./SignIn.module.scss"
import { useState } from "react";
import { Inter } from "next/font/google";

const inter = Inter({subsets:["latin"]})
const SignIn = () => {

  const [userCredentials,setUserCredentials] = useState({
    name:"",
    email:"",
    password:"",
    
})

const handleChange = (e) => {
    setUserCredentials({...userCredentials,[e.target.name]:e.target.value});

}
  return (
    <div className={styles.pageContainer}>
       <div className={styles.formContainer}>
            <p>Welcome Back</p>
            <h1>Sign In To Your Account</h1>
            <p>You don't have an account yet ? <Link href="/login">Sign Up</Link></p>
            <form action="#" className={styles.form}>
                <div className={styles.formGroup}>   
                    <label htmlFor="name"  className={styles.formLabel}>
                        Full Name*
                        </label>  
                        <input type="text" onChange={handleChange} required name="name" id="name" value={userCredentials.name} className={styles.formControl} />               
                </div>
                <div className={styles.formGroup}>   
                    <label htmlFor="email"  className={styles.formLabel}>
                        Your Email*
                        </label>  
                        <input type="email" onChange={handleChange} required name="email" id="email" value={userCredentials.email} className={styles.formControl} />               
                </div>
                <div className={styles.formGroup}>   
                    <label htmlFor="password"  className={styles.formLabel}>
                       Password*
                        </label>  
                        <input type="password" onChange={handleChange} required name="password" id="password" value={userCredentials.password} className={styles.formControl} />               
                </div>
              
                <div className={styles.btnContainer}>
                <button
          className={`${styles.btn} ${inter.className}`}
          
        >
          <span><IoIosLogIn /></span>
          Sign In
        </button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default SignIn;