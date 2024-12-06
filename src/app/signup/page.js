"use client"
import Link from "next/link";
import styles from "./SignUpPage.module.scss"
import { Inter } from "next/font/google";
import { GrUserNew } from "react-icons/gr";
import { useState } from "react";



const inter = Inter({ subsets: ["latin"] })
const SignUpPage = () => {
    const [userCredentials,setUserCredentials] = useState({
        name:"",
        email:"",
        password:"",
        confirmPass:"",
        phone:""
    })

    const handleChange = (e) => {
        setUserCredentials({...userCredentials,[e.target.name]:e.target.value});

    }

  return (
    <div className={styles.pageContainer}>
        {console.log(userCredentials)}
        <div className={styles.formContainer}>
            <p>Start Shopping With Us</p>
            <h1>Create An Account</h1>
            <p>Already A Client ? <Link href="/login">Sign In</Link></p>
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
                        New Password*
                        </label>  
                        <input type="password" onChange={handleChange} required name="password" id="password" value={userCredentials.password} className={styles.formControl} />               
                </div>
                <div className={styles.formGroup}>   
                    <label htmlFor="confirmPass"  className={styles.formLabel}>
                        Confirm Password*
                        </label>  
                        <input type="password" onChange={handleChange} required name="confirmPass" id="confirmPass" value={userCredentials.confirmPass} className={styles.formControl} />               
                </div>
                <div className={styles.formGroup}>   
                    <label htmlFor="phone"  className={styles.formLabel}>
                        Phone Number*
                        </label>  
                        <input type="telephone" onChange={handleChange} required name="phone" id="phone" value={userCredentials.phone} className={styles.formControl} />               
                </div>
                <div className={styles.btnContainer}>
                <button
          className={`${styles.btn} ${inter.className}`}
          
        >
          <span><GrUserNew /></span>
          Create Account
        </button>
                </div>
            </form>
        </div>
        </div>
  )
}

export default SignUpPage;