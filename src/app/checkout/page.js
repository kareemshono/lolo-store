"use client"
import { useState } from "react";
import { GrFormNextLink } from "react-icons/gr";
import { IoReturnUpBackOutline } from "react-icons/io5";
import { MdOutlineShoppingCartCheckout } from "react-icons/md";
import styles from "./Checkout.module.scss"
import Image from "next/image";
import { Inter } from "next/font/google";
import { useRouter } from "next/navigation";


const inter = Inter({subsets:["latin"]})
const steps = ["Billing Information","Payment Information","Review Your Details"]
const Checkout = () => {
    const router = useRouter()
    const [activeStep, setActiveStep] = useState(1);
    const [isStepFulfilled,setIsStepFullfiled] = useState({
        1:false,
        2:false,
        3:false
    })
    const [billingCredentials,setBilingCredentials] = useState({
        fullName:"",
        email:"",
        cPhoneNum:"",
        country:"",
        street:"",
        apartement:"",
        city:"",
        state:"",
        zipCode:""
    });
    const [paymentCredentials,setPaymentCredentials] = useState({
        name:"",
        cardNum:"",
        expDate:"",
        cvv:""

    })
    const handleNext = () => {
        let isStepValid = false;

        if (activeStep === 1) {
          isStepValid = Object.values(billingCredentials).every((value) => value.trim() !== "");
          setIsStepFullfiled({...isStepFulfilled,1:isStepValid})
        } else if (activeStep === 2) {
          isStepValid = Object.values(paymentCredentials).every((value) => value.trim() !== "");
          setIsStepFullfiled({...isStepFulfilled,2:isStepValid});
         
        }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
   console.log(Object.values(paymentCredentials).every((value) => value.trim() !== ""))
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const handleReset = () => {
    setActiveStep(0);
  };
  const handleChangeBilling = (e) => {
    
    setBilingCredentials({...billingCredentials,[e.target.name]: e.target.value})
  }

  const handleChangeCard = (e) => {
    
    setPaymentCredentials({...paymentCredentials,[e.target.name]:e.target.value})
  }
  const navigateToShop = () => {
    router.push("/shop");
   
}
  const handleSubmit =  (e) => {
    e.preventDefault();
    console.log("order placed successfuly")
  }
  return (
    <section className={styles.checkoutPage}>
        <div className={styles.checkoutContainer}>
          
        <div className={styles.stepper}>
            {console.log("step",isStepFulfilled[2])}
                    <div onClick={() => setActiveStep(1)} className={styles.step1}>
                        <span className={`${activeStep === 1 ? `${styles.nonActive}`:`${styles.active}`} ${isStepFulfilled[1] ? `${styles.fulfilled}`:`${styles.active}`}`}>1</span>
                        <p>{steps[0]}</p>
                    </div>
                    <div onClick={() => setActiveStep(2)} className={styles.step2}>
                        {console.log("step2",isStepFulfilled[2])}
                        <span className={`${activeStep === 2 ? `${styles.nonActive}`:`${styles.active}`} ${isStepFulfilled[2] ? `${styles.fulfilled}`:`${styles.active}`}`}>2</span>
                        <p>{steps[1]}</p>
                    </div>
                    <div onClick={() => setActiveStep(3)} className={styles.step3}>
                        <span className={`${activeStep === 3 ? `${styles.nonActive}`:`${styles.active}`} ${isStepFulfilled[2] && isStepFulfilled[1] ? `${styles.fulfilled}`:`${styles.active}`}`}>3</span>
                        <p>{steps[2]}</p>
                    </div>
                </div>
                <div className={styles.header}>
                    <h2>{steps[activeStep - 1]}</h2> 
                    
                </div>
                <div className={styles.formContainer}>
                <form  onSubmit={handleSubmit} className={styles.form}>
             
            {/* BILLING INFORMATION */}
            { activeStep === 1 && ( 
                    <>
                     <div className={`${styles.formGroup} ${styles.half}`}>
                     <label htmlFor="fullName" className={styles.formLabel}>Full Name*</label>
                     <input onChange={handleChangeBilling} value={billingCredentials.fullName} type="text" required placeholder="e.g., John Doe" className={styles.formControl} name="fullName" id="fullName" />
                 </div>
                 <div className={`${styles.formGroup} ${styles.half}`}>
                     <label htmlFor="email" className={styles.formLabel}>Email*</label>
                     <input onChange={handleChangeBilling} value={billingCredentials.email} type="email" required placeholder="example@gmail.com" className={styles.formControl} name="email" id="email" />
                 </div>
                 <div className={`${styles.formGroup} ${styles.full}`}>
                     <label htmlFor="cPhoneNum" className={styles.formLabel}>Contact Phone Number*</label>
                     <input onChange={handleChangeBilling} value={billingCredentials.cPhoneNum} type="tel" required placeholder="e.g., +1 234 567 8900" className={styles.formControl} name="cPhoneNum" id="cPhoneNum" />
                 </div>
            
                 <div className={`${styles.formGroup} ${styles.full}`}>
                 
                    <p style={{color:"#000e9e9",padding:"0rem 0rem .5rem 0rem",fontStyle:"italic",
                        textTransform:"uppercase"
                    }}>Address Information</p>
                     <label htmlFor="country" className={styles.formLabel}>Country</label>
                     <select onChange={handleChangeBilling} value={billingCredentials.country}  className={styles.formSelect} name="country" id="country" >
                        <option value="turkey">Turkey</option>
                        <option value="syria">Syria</option>
                        <option value="saudi arabia">Saudi Arabia</option>
                        </select>
                 </div>
                 <div className={`${styles.formGroup} ${styles.full}`}>
                     <label htmlFor="street" className={styles.formLabel}>Street Address*</label>
                     <input onChange={handleChangeBilling} value={billingCredentials.street} type="text" required placeholder="e.g., 123 Main St" className={styles.formControl} name="street" id="street" />
                 </div>
                 <div className={`${styles.formGroup} ${styles.half}`}>
                     <label htmlFor="apartement" className={styles.formLabel}>Apartement/House Num*</label>
                     <input onChange={handleChangeBilling} value={billingCredentials.apartement} type="text" required placeholder="e.g.,  Apartement 3B" className={styles.formControl} name="apartement" id="apartement" />
                 </div>
                 <div className={`${styles.formGroup} ${styles.half}`}>
                     <label htmlFor="city" className={styles.formLabel}>City*</label>
                     <input onChange={handleChangeBilling} value={billingCredentials.city} type="text" required placeholder="e.g., Istanbul" className={styles.formControl} name="city" id="city" />
                 </div>
                 <div className={`${styles.formGroup} ${styles.half}`}>
                     <label htmlFor="state" className={styles.formLabel}>State/Province*</label>
                     <input onChange={handleChangeBilling} value={billingCredentials.state} type="text" required placeholder="e.g., Istanbul" className={styles.formControl} name="state" id="state" />
                 </div>
                 <div className={`${styles.formGroup} ${styles.half}`}>
                     <label htmlFor="zipCode" className={styles.formLabel}>ZIP/Postal Code*</label>
                     <input onChange={handleChangeBilling} value={billingCredentials.zipCode} type="text" required placeholder="e.g., 90001" className={styles.formControl} name="zipCode" id="zipCode" />
                 </div>
                 <div className={`${styles.row} ${styles.btns}`}>

                         <button disabled={activeStep === 1}  onClick={handleBack} className={`${activeStep === 1 ? styles.btnDisabled : styles.btnBack} ${inter.className}`}>
                        <IoReturnUpBackOutline className={styles.backArrow} />
                        Back 
                             </button>                        
                         <button onClick={handleNext} type="button" className={`${styles.btn} ${inter.className}`}>
                        <GrFormNextLink className={styles.nextArrow} />
                        Next Step
                             </button>                        
                     </div>
                 {/* <div className={styles.pricingContainer}>
                     <div className={styles.row}>
                         
                             <p>Subtotal</p>
                             <span>$ 2000.00</span>
                         
                     </div>
                     <div className={styles.row}>
                     <p>Shipping</p>
                     <span>$ 35.00</span>
                     </div>
                     <div className={styles.row}>
                     <p>Total</p>
                     <span>$ 2035.00</span>
                     </div>
                    
                 </div> */}
             
                 </>
                ) }
                {/* PAYMENT INFORMATION  */}
                { activeStep === 2 && ( 
                    <>
                    {console.log(isStepFulfilled[2])}
                    <div className={styles.cardsRow}>
                    <h2 className={styles.cardType}>Choose Payment Type</h2>
                <ul className={styles.payList}>
                <li>
                    <Image src={"/icons/visa.svg"} width={75} height={50} alt="vector" />
                </li>
                <li>
                    <Image src={"/icons/mastercard.svg"} width={75} height={50} alt="vector" />
                </li>
                <li>
                    <Image src={"/icons/paypal.svg"} width={75} height={50} alt="vector" />
                </li>
                <li>
                    <Image src={"/icons/stripe.svg"} width={75} height={50} alt="vector" />
                </li>
                <li>
                    <Image src={"/icons/gpay.svg"} width={75} height={50} alt="vector" />
                </li>
               
            </ul>
                    </div>
                     <div className={styles.formGroup}>
                     <label htmlFor="name" className={styles.formLabel}>Name On Card</label>
                     <input onChange={handleChangeCard} value={paymentCredentials.name} type="text" className={styles.formControl} name="name" id="name" />
                 </div>
                 <div className={styles.formGroup}>
                     <label htmlFor="cardNum" className={styles.formLabel}>Card Number</label>
                     <input onChange={handleChangeCard} value={paymentCredentials.cardNum} type="text" className={styles.formControl} name="cardNum" id="cardNum" />
                 </div>
                 <div className={`${styles.formGroup} ${styles.half}`}>
                     <label htmlFor="expDate" className={styles.formLabel}>Expiration Date</label>
                     <input onChange={handleChangeCard} value={paymentCredentials.expDate} type="date" className={styles.formControl} name="expDate" id="expDate" />
                 </div>
                 <div className={`${styles.formGroup} ${styles.half}`}>
                     <label htmlFor="cvv" className={styles.formLabel}>CVV</label>
                     <input onChange={handleChangeCard} value={paymentCredentials.cvv} type="text" className={styles.formControl} name="cvv" id="cvv" />
                 </div>
                 
                 <div className={`${styles.row} ${styles.btns}`}>

                    <button onClick={handleBack} className={`${styles.btnBack} ${inter.className}`}>
                    <IoReturnUpBackOutline className={styles.backArrow} />
                    Back 
                        </button>                        
                    <button onClick={handleNext} type="button"  className={`${styles.btn} ${inter.className}`}>
                    <GrFormNextLink className={styles.nextArrow} />
                    Next Step
                        </button>                        
                    </div>
                 
                 </>
                ) }
                {/* REVIEW DETAILS  */}
                {activeStep === 3 && (
                    <>
                    <div className={styles.detailsRevContainer}>
                    <p>Full Name: <span className={styles.light}>{billingCredentials.fullName}</span></p>
                    <p>Email: <span className={styles.light}>{billingCredentials.email}</span></p>
                    <p>Contact Phone Number: <span className={styles.light}>{billingCredentials.cPhoneNum}</span></p>
                    <p>Country: <span className={styles.light}>{billingCredentials.country}</span></p>
                    <p>Street: <span className={styles.light}>{billingCredentials.street}</span></p>
                    <p>Apartement/House Num: <span className={styles.light}>{billingCredentials.apartement}</span></p>
                    <p>City: <span className={styles.light}>{billingCredentials.city}</span></p>
                    <p>State/Province: <span className={styles.light}>{billingCredentials.state}</span></p>
                    <p>Zip/Postal Code: <span className={styles.light}>{billingCredentials.zipCode}</span></p>
                    card info
                    <p>Name On Card: <span className={styles.light}>{paymentCredentials.name}</span></p>
                    <p>Card Number: <span className={styles.light}>{paymentCredentials.cardNum}</span></p>
                    <p>Expiration Date: <span className={styles.light}>{paymentCredentials.expDate}</span></p>
                    <p>cvv: <span className={styles.light}>{paymentCredentials.cvv}</span></p>
                    </div>
                    <div className={`${styles.row} ${styles.btns}`}>

                         <button onClick={handleBack} className={`${styles.btnBack} ${inter.className}`}>
                        <IoReturnUpBackOutline className={styles.backArrow} />
                        Back 
                             </button>                        
                         <button type="submit"  className={`${styles.btn} ${inter.className}`}>
                        Place Order
                             </button>                        
                     </div>
                    </>
                )}
               
            </form>
            <div className={styles.colSummary}>
        
            <div className={styles.row}>
                <h2 className={styles.summaryTitle}>Order Summary:</h2>
               </div>
               <div className={styles.row}>
                <div className={styles.colLeft}>
                    <p>Subtotal:</p>
                    <p>Shipping:</p>
                    <p>Total:</p>
                </div>
                <div className={styles.colRight}>
                    <p>200.00</p>
                    <p>$30</p>
                    <p>$230.00s</p>
                </div>
               </div>
               <div className={styles.row}>
                <div className={styles.btns100}>
                    <button onClick={navigateToShop} className={`${styles.btn100}`}>
                        <MdOutlineShoppingCartCheckout className={styles.shopIcon} />
                        Continue Shopping
                    </button>
                </div>
               </div>
            </div>
                </div>
    
        </div>
        
    </section>
  )
}

export default Checkout