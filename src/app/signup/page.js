"use client"
import Link from "next/link";
import styles from "./SignUpPage.module.scss"
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "@/redux/slices/userSlice/userSlice";
import { Inter } from "next/font/google";
import { GrUserNew } from "react-icons/gr";
import { useState } from "react";
import Spinner from "../components/loadingSpinner/Spinner";

const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/


const inter = Inter({ subsets: ["latin"] });
const SignUpPage = () => {
    const dispatch = useDispatch();
    const { user, isLoading, error } = useSelector((state) => state.userSlice);
    const [userCredentials,setUserCredentials] = useState({
        name:"",
        email:"",
        password:"",
        confirmPass:"",
        phone:""
    })
    const [formErrors,setFormErrors] = useState({});

   
//form validation
const validate =  (userCredentials) => {
    const errors = {};
    if(!userCredentials.name.length){
        errors.name = "Name is required !"
    }  
      else if (!userCredentials.email.length){
        errors.email = "Email is required !"
        
      }
      else if (!userCredentials.phone.length){
        errors.phone = "Phone Number is required !"
        
      }
      else if (!regex.test(userCredentials.email)) {
        errors.email = "Email format is not valid ! "
      }
      else if (!userCredentials.password.length) {
        errors.password = "Password is required !"
      }
      else if (!userCredentials.confirmPass.length) {
       errors.confirmPass = "Password confirmation is required !"
      }
      else if (userCredentials.password !== userCredentials.confirmPass) {
        errors.confirmPass = "Passwords do not match !"
      }
      else if (userCredentials.password.length < 6) {
        errors.password = "Password must be at least 6 charachters !"
      }
      return errors;
    
}


    const handleChange = (e) => {
        setUserCredentials({...userCredentials,[e.target.name]:e.target.value});

    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const validation = validate(userCredentials);
        if (Object.keys(validation).length > 0 ) {
            setFormErrors(validation);
            return; // stop the function if there are errors
          }
          try {
            dispatch(registerUser(userCredentials));
        
              setSuccess("User registered successfully!");
              setUserCredentials({
                name:"",
                email:"",
                password:"",
                confirmPass:"",
                phone:""
              })
          } catch (error) {
            // setError(error.response?.data?.msg || "Something went wrong");
            console.log(error)
          }
    }

  return (
    <div className={styles.pageContainer}>
        {console.log(userCredentials)}
        {isLoading && <Spinner />}
        
        {console.log(user)}
        <div className={styles.formContainer}>
        
            <p>Start Shopping With Us</p>
            <h1>Create An Account</h1>
            <p>Already A Client ? <Link href="/login">Sign In</Link></p>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>   
                    <label htmlFor="name"  className={styles.formLabel}>
                        Full Name*
                        </label>  
                        <input type="text" onChange={handleChange} required name="name" id="name" value={userCredentials.name} className={styles.formControl} />               
                        <p className={`${formErrors.name ? styles.inputError:styles.hide}`}>{formErrors.name}</p>
                </div>
                <div className={styles.formGroup}>   
                    <label htmlFor="email"  className={styles.formLabel}>
                        Your Email*
                        </label>  
                        <input type="email" onChange={handleChange} required name="email" id="email" value={userCredentials.email} className={styles.formControl} />               
                        <p className={`${formErrors.email ? styles.inputError:styles.hide}`}>{formErrors.email}</p>
                </div>
                <div className={styles.formGroup}>   
                    <label htmlFor="password"  className={styles.formLabel}>
                        New Password*
                        </label>  
                        <input type="password" onChange={handleChange} required name="password" id="password" value={userCredentials.password} className={styles.formControl} />               
                        <p className={`${formErrors.password ? styles.inputError:styles.hide}`}>{formErrors.password}</p>
                </div>
                <div className={styles.formGroup}>   
                    <label htmlFor="confirmPass"  className={styles.formLabel}>
                        Confirm Password*
                        </label>  
                        <input type="password" onChange={handleChange} required name="confirmPass" id="confirmPass" value={userCredentials.confirmPass} className={styles.formControl} />               
                        <p className={`${formErrors.confirmPass ? styles.inputError:styles.hide}`}>{formErrors.confirmPass}</p>
                </div>
                <div className={styles.formGroup}>   
                    <label htmlFor="phone"  className={styles.formLabel}>
                        Phone Number*
                        </label>  
                        <input type="telephone" onChange={handleChange} required name="phone" id="phone" value={userCredentials.phone} className={styles.formControl} />               
                        <p className={`${formErrors.phone ? styles.inputError:styles.hide}`}>{formErrors.phone}</p>
                </div>
                <div className={styles.btnContainer}>
                <button
                type="submit"
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