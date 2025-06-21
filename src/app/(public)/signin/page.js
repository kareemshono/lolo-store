"use client";
import Link from "next/link";
import { IoIosLogIn } from "react-icons/io";
import styles from "./SignIn.module.scss";
import { useState, useEffect } from "react";
import { Inter } from "next/font/google";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { loginUser, clearError } from "@/redux/slices/userSlice/userSlice";
import Spinner from "../../components/loadingSpinner/Spinner";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"] });

const SignIn = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, isLoading, error } = useSelector((state) => state.userSlice);
  const [userCredentials, setUserCredentials] = useState({
    email: "",
    password: "",
  });

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  // Clear errors on mount
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleChange = (e) => {
    setUserCredentials({ ...userCredentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Login data:", userCredentials);
    const result = await dispatch(loginUser(userCredentials));
    if (loginUser.fulfilled.match(result)) {
      router.push("/"); // Immediate redirect
    }
  };

  return (
    <div className={styles.pageContainer}>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        className={styles.toastContainer}
      />
      <div className={styles.formContainer}>
        <p>Welcome Back</p>
        <h1>Sign In To Your Account</h1>
        {isLoading && <Spinner />}
        {error && error.type === "login" && (
          <p style={{ color: "red", marginTop: "10px" }}>{error.message}</p>
        )}
        <p>
          You don't have an account yet? <Link href="/signup">Sign Up</Link>
        </p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.formLabel}>
              Your Email*
            </label>
            <input
              type="email"
              onChange={handleChange}
              required
              name="email"
              id="email"
              value={userCredentials.email}
              className={styles.formControl}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.formLabel}>
              Password*
            </label>
            <input
              type="password"
              onChange={handleChange}
              required
              name="password"
              id="password"
              value={userCredentials.password}
              className={styles.formControl}
            />
          </div>
          <div className={styles.btnContainer}>
            <button
              type="submit"
              className={`${styles.btn} ${inter.className}`}
              disabled={isLoading}
            >
              <span>
                <IoIosLogIn />
              </span>
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;