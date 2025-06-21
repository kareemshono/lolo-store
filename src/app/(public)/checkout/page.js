"use client";
import { useState } from "react";
import { GrFormNextLink } from "react-icons/gr";
import { IoReturnUpBackOutline } from "react-icons/io5";
import { MdOutlineShoppingCartCheckout } from "react-icons/md";
import styles from "./Checkout.module.scss";
import Image from "next/image";
import { Inter } from "next/font/google";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"] });
const steps = ["Billing Information", "Payment Information", "Review Your Details"];

const Checkout = () => {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(1);
  const [isStepFulfilled, setIsStepFulfilled] = useState({
    1: false,
    2: false,
    3: false,
  });
  const [billingCredentials, setBillingCredentials] = useState({
    fullName: "",
    email: "",
    cPhoneNum: "",
    country: "",
    street: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
  });
  const [paymentCredentials, setPaymentCredentials] = useState({
    name: "",
    cardNum: "",
    expDate: "",
    cvv: "",
  });
  const [selectedCard, setSelectedCard] = useState(null); // Track selected card (visa or mastercard)
  const [cardRegion, setCardRegion] = useState(null); // Track card region (turkish or non-turkish)
  const cart = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.userSlice.user);

  const handleCardSelect = (cardType) => {
    setSelectedCard(cardType);
  };

  const handleCardRegionSelect = (region) => {
    setCardRegion(region);
  };

  const handleNext = async () => {
    let isStepValid = false;

    if (activeStep === 1) {
      isStepValid = Object.values(billingCredentials).every((value) => value.trim() !== "");
      if (isStepValid) {
        try {
          const response = await fetch("http://localhost:5000/api/addresses", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user_id: user.id,
              full_name: billingCredentials.fullName,
              email: billingCredentials.email,
              phone: billingCredentials.cPhoneNum,
              country: billingCredentials.country,
              street: billingCredentials.street,
              apartment: billingCredentials.apartment,
              city: billingCredentials.city,
              state: billingCredentials.state,
              zip_code: billingCredentials.zipCode,
            }),
          });
          if (!response.ok) throw new Error("Failed to save address");
          setIsStepFulfilled({ ...isStepFulfilled, 1: true });
          setActiveStep(activeStep + 1);
          toast.success("Billing information saved successfully!", { autoClose: 2000 });
        } catch (error) {
          console.error("Address save error:", error);
          toast.error("Failed to save address. Please try again.");
        }
      } else {
        toast.error("Please fill in all required fields.");
      }
    } else if (activeStep === 2) {
      isStepValid = Object.values(paymentCredentials).every((value) => value.trim() !== "");
      if (!selectedCard) {
        toast.error("Please select a payment card (Visa or MasterCard).");
      } else if (!cardRegion) {
        toast.error("Please select card region (Turkish or Non-Turkish).");
      } else if (isStepValid && paymentCredentials.cardNum.length === 16 && paymentCredentials.cvv.length === 3) {
        setIsStepFulfilled({ ...isStepFulfilled, 2: true });
        setActiveStep(activeStep + 1);
        toast.success("Payment details entered successfully!", { autoClose: 2000 });
      } else {
        toast.error("Please enter valid card details (16-digit card number, 3-digit CVV).");
      }
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleChangeBilling = (e) => {
    setBillingCredentials({ ...billingCredentials, [e.target.name]: e.target.value });
  };

  const handleChangeCard = (e) => {
    setPaymentCredentials({ ...paymentCredentials, [e.target.name]: e.target.value });
  };

  const navigateToShop = () => {
    router.push("/shop");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id) {
      toast.error("Please log in to place an order.");
      return;
    }
    try {
      // Calculate total
      const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const shipping = 30;
      const total = subtotal + shipping;

      // Fetch addresses
      const addressResponse = await fetch(`http://localhost:5000/api/addresses/user/${user.id}`);
      if (!addressResponse.ok) throw new Error("Failed to fetch addresses");
      const addresses = await addressResponse.json();
      if (!addresses.length) throw new Error("No address found");

      // Create order
      const orderResponse = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          address_id: addresses[0].id,
          total,
          order_items: cart.map((item) => ({
            product_id: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        }),
      });
      if (!orderResponse.ok) throw new Error("Failed to create order");
      const order = await orderResponse.json();

      // Process Iyzico payment
      const paymentResponse = await fetch("http://localhost:5000/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: order.id,
          user_id: user.id,
          amount: total,
          card_details: {
            name: paymentCredentials.name,
            cardNum: paymentCredentials.cardNum,
            expDate: paymentCredentials.expDate,
            cvv: paymentCredentials.cvv,
          },
          billing_address: {
            full_name: billingCredentials.fullName,
            email: billingCredentials.email,
            phone: billingCredentials.cPhoneNum,
            country: billingCredentials.country,
            street: billingCredentials.street,
            city: billingCredentials.city,
            state: billingCredentials.state,
            zip_code: billingCredentials.zipCode,
          },
          cardRegion, // Pass card region
        }),
      });
      if (!paymentResponse.ok) {
        const errorData = await paymentResponse.json();
        throw new Error(errorData.error || "Payment failed");
      }
      const paymentResult = await paymentResponse.json();
      if (paymentResult.status === "success") {
        console.log("Payment successful:", paymentResult.paymentId);
        router.push("/order-confirmation");
      } else {
        throw new Error("Payment failed: " + (paymentResult.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error(`Failed to complete checkout: ${error.message}`);
    }
  };

  return (
    <section className={styles.checkoutPage}>
      <div className={styles.checkoutContainer}>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          className={styles.toastContainer}
        />
        <div className={styles.stepper}>
          <div onClick={() => setActiveStep(1)} className={styles.step1}>
            <span
              className={`${activeStep === 1 ? styles.nonActive : styles.active} ${
                isStepFulfilled[1] ? styles.fulfilled : styles.active
              }`}
            >
              1
            </span>
            <p>{steps[0]}</p>
          </div>
          <div onClick={() => setActiveStep(2)} className={styles.step2}>
            <span
              className={`${activeStep === 2 ? styles.nonActive : styles.active} ${
                isStepFulfilled[2] ? styles.fulfilled : styles.active
              }`}
            >
              2
            </span>
            <p>{steps[1]}</p>
          </div>
          <div onClick={() => setActiveStep(3)} className={styles.step3}>
            <span
              className={`${activeStep === 3 ? styles.nonActive : styles.active} ${
                isStepFulfilled[1] && isStepFulfilled[2] ? styles.fulfilled : styles.active
              }`}
            >
              3
            </span>
            <p>{steps[2]}</p>
          </div>
        </div>
        <div className={styles.header}>
          <h2>{steps[activeStep - 1]}</h2>
        </div>
        <div className={styles.formContainer}>
          <form onSubmit={handleSubmit} className={styles.form}>
            {activeStep === 1 && (
              <>
                <div className={`${styles.formGroup} ${styles.half}`}>
                  <label htmlFor="fullName" className={styles.formLabel}>
                    Full Name*
                  </label>
                  <input
                    onChange={handleChangeBilling}
                    value={billingCredentials.fullName}
                    type="text"
                    required
                    placeholder="e.g., John Doe"
                    className={styles.formControl}
                    name="fullName"
                    id="fullName"
                  />
                </div>
                <div className={`${styles.formGroup} ${styles.half}`}>
                  <label htmlFor="email" className={styles.formLabel}>
                    Email*
                  </label>
                  <input
                    onChange={handleChangeBilling}
                    value={billingCredentials.email}
                    type="email"
                    required
                    placeholder="example@gmail.com"
                    className={styles.formControl}
                    name="email"
                    id="email"
                  />
                </div>
                <div className={`${styles.formGroup} ${styles.full}`}>
                  <label htmlFor="cPhoneNum" className={styles.formLabel}>
                    Contact Phone Number*
                  </label>
                  <input
                    onChange={handleChangeBilling}
                    value={billingCredentials.cPhoneNum}
                    type="tel"
                    required
                    placeholder="e.g., +1 234 567 8900"
                    className={styles.formControl}
                    name="cPhoneNum"
                    id="cPhoneNum"
                  />
                </div>
                <div className={`${styles.formGroup} ${styles.full}`}>
                  <p
                    style={{
                      color: "#000e9e9",
                      padding: "0rem 0rem .5rem 0rem",
                      fontStyle: "italic",
                      textTransform: "uppercase",
                    }}
                  >
                    Address Information
                  </p>
                  <label htmlFor="country" className={styles.formLabel}>
                    Country
                  </label>
                  <select
                    onChange={handleChangeBilling}
                    value={billingCredentials.country}
                    className={styles.formSelect}
                    name="country"
                    id="country"
                  >
                    <option value="turkey">Turkey</option>
                    <option value="syria">Syria</option>
                    <option value="saudi arabia">Saudi Arabia</option>
                  </select>
                </div>
                <div className={`${styles.formGroup} ${styles.full}`}>
                  <label htmlFor="street" className={styles.formLabel}>
                    Street Address*
                  </label>
                  <input
                    onChange={handleChangeBilling}
                    value={billingCredentials.street}
                    type="text"
                    required
                    placeholder="e.g., 123 Main St"
                    className={styles.formControl}
                    name="street"
                    id="street"
                  />
                </div>
                <div className={`${styles.formGroup} ${styles.half}`}>
                  <label htmlFor="apartment" className={styles.formLabel}>
                    Apartment/House Num*
                  </label>
                  <input
                    onChange={handleChangeBilling}
                    value={billingCredentials.apartment}
                    type="text"
                    required
                    placeholder="e.g., Apartment 3B"
                    className={styles.formControl}
                    name="apartment"
                    id="apartment"
                  />
                </div>
                <div className={`${styles.formGroup} ${styles.half}`}>
                  <label htmlFor="city" className={styles.formLabel}>
                    City*
                  </label>
                  <input
                    onChange={handleChangeBilling}
                    value={billingCredentials.city}
                    type="text"
                    required
                    placeholder="e.g., Istanbul"
                    className={styles.formControl}
                    name="city"
                    id="city"
                  />
                </div>
                <div className={`${styles.formGroup} ${styles.half}`}>
                  <label htmlFor="state" className={styles.formLabel}>
                    State/Province*
                  </label>
                  <input
                    onChange={handleChangeBilling}
                    value={billingCredentials.state}
                    type="text"
                    required
                    placeholder="e.g., Istanbul"
                    className={styles.formControl}
                    name="state"
                    id="state"
                  />
                </div>
                <div className={`${styles.formGroup} ${styles.half}`}>
                  <label htmlFor="zipCode" className={styles.formLabel}>
                    ZIP/Postal Code*
                  </label>
                  <input
                    onChange={handleChangeBilling}
                    value={billingCredentials.zipCode}
                    type="text"
                    required
                    placeholder="e.g., 90001"
                    className={styles.formControl}
                    name="zipCode"
                    id="zipCode"
                  />
                </div>
                <div className={`${styles.row} ${styles.btns}`}>
                  <button
                    disabled={activeStep === 1}
                    onClick={handleBack}
                    className={`${activeStep === 1 ? styles.btnDisabled : styles.btnBack} ${
                      inter.className
                    }`}
                  >
                    <IoReturnUpBackOutline className={styles.backArrow} />
                    Back
                  </button>
                  <button
                    onClick={handleNext}
                    type="button"
                    className={`${styles.btn} ${inter.className}`}
                  >
                    <GrFormNextLink className={styles.nextArrow} />
                    Next Step
                  </button>
                </div>
              </>
            )}
            {activeStep === 2 && (
              <>
                <div className={styles.cardsRow}>
                  <h2 className={styles.cardType}>Choose Card Region</h2>
                  <div className={styles.cardRegionToggle}>
                    <button
                      type="button"
                      className={`${styles.regionButton} ${
                        cardRegion === "turkish" ? styles.selectedRegion : ""
                      }`}
                      onClick={() => handleCardRegionSelect("turkish")}
                    >
                      Turkish Card
                    </button>
                    <button
                      type="button"
                      className={`${styles.regionButton} ${
                        cardRegion === "non-turkish" ? styles.selectedRegion : ""
                      }`}
                      onClick={() => handleCardRegionSelect("non-turkish")}
                    >
                      Non-Turkish Card
                    </button>
                  </div>
                  <h2 className={styles.cardType}>Choose Payment Type</h2>
                  <ul className={styles.payList}>
                    <li
                      className={selectedCard === "visa" ? styles.selectedCard : ""}
                      onClick={() => handleCardSelect("visa")}
                    >
                      <Image src="/icons/visa.svg" width={75} height={50} alt="Visa" />
                    </li>
                    <li
                      className={selectedCard === "mastercard" ? styles.selectedCard : ""}
                      onClick={() => handleCardSelect("mastercard")}
                    >
                      <Image src="/icons/mastercard.svg" width={75} height={50} alt="MasterCard" />
                    </li>
                  </ul>
                  <div className={styles.poweredByIyzico}>
                    <span>Powered by Iyzico</span>
                    {/* Uncomment when logo is available */}
                    {/* <Image src="/icons/iyzico.svg" width={50} height={30} alt="Iyzico" /> */}
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="name" className={styles.formLabel}>
                    Name On Card*
                  </label>
                  <input
                    onChange={handleChangeCard}
                    value={paymentCredentials.name}
                    type="text"
                    required
                    className={styles.formControl}
                    name="name"
                    id="name"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="cardNum" className={styles.formLabel}>
                    Card Number*
                  </label>
                  <input
                    onChange={handleChangeCard}
                    value={paymentCredentials.cardNum}
                    type="text"
                    required
                    maxLength={16}
                    className={styles.formControl}
                    name="cardNum"
                    id="cardNum"
                  />
                </div>
                <div className={`${styles.formGroup} ${styles.half}`}>
                  <label htmlFor="expDate" className={styles.formLabel}>
                    Expiration Date*
                  </label>
                  <input
                    onChange={handleChangeCard}
                    value={paymentCredentials.expDate}
                    type="month"
                    required
                    className={styles.formControl}
                    name="expDate"
                    id="expDate"
                  />
                </div>
                <div className={`${styles.formGroup} ${styles.half}`}>
                  <label htmlFor="cvv" className={styles.formLabel}>
                    CVV*
                  </label>
                  <input
                    onChange={handleChangeCard}
                    value={paymentCredentials.cvv}
                    type="text"
                    required
                    maxLength={3}
                    className={styles.formControl}
                    name="cvv"
                    id="cvv"
                  />
                </div>
                <div className={`${styles.row} ${styles.btns}`}>
                  <button
                    type="button"
                    onClick={handleBack}
                    className={`${styles.btnBack} ${inter.className}`}
                  >
                    <IoReturnUpBackOutline className={styles.backArrow} />
                    Back
                  </button>
                  <button
                    onClick={handleNext}
                    type="button"
                    className={`${styles.btn} ${inter.className}`}
                  >
                    <GrFormNextLink className={styles.nextArrow} />
                    Next Step
                  </button>
                </div>
              </>
            )}
            {activeStep === 3 && (
              <>
                <div className={styles.detailsRevContainer}>
                  <p>Full Name: <span className={styles.light}>{billingCredentials.fullName}</span></p>
                  <p>Email: <span className={styles.light}>{billingCredentials.email}</span></p>
                  <p>Contact Phone Number: <span className={styles.light}>{billingCredentials.cPhoneNum}</span></p>
                  <p>Country: <span className={styles.light}>{billingCredentials.country}</span></p>
                  <p>Street: <span className={styles.light}>{billingCredentials.street}</span></p>
                  <p>Apartment/House Num: <span className={styles.light}>{billingCredentials.apartment}</span></p>
                  <p>City: <span className={styles.light}>{billingCredentials.city}</span></p>
                  <p>State/Province: <span className={styles.light}>{billingCredentials.state}</span></p>
                  <p>Zip/Postal Code: <span className={styles.light}>{billingCredentials.zipCode}</span></p>
                  <p>Name On Card: <span className={styles.light}>{paymentCredentials.name}</span></p>
                  <p>Card Number: <span className={styles.light}>**** **** **** {paymentCredentials.cardNum.slice(-4)}</span></p>
                  <p>Expiration Date: <span className={styles.light}>{paymentCredentials.expDate}</span></p>
                  <p>CVV: <span className={styles.light}>***</span></p>
                  <p>Card Type: <span className={styles.light}>{cardRegion === "turkish" ? "Turkish" : "Non-Turkish"} {selectedCard}</span></p>
                </div>
                <div className={`${styles.row} ${styles.btns}`}>
                  <button
                    type="button"
                    onClick={handleBack}
                    className={`${styles.btnBack} ${inter.className}`}
                  >
                    <IoReturnUpBackOutline className={styles.backArrow} />
                    Back
                  </button>
                  <button type="submit" className={`${styles.btn} ${inter.className}`}>
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
                <p>${cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}</p>
                <p>$30.00</p>
                <p>${(cart.reduce((sum, item) => sum + item.price * item.quantity, 0) + 30).toFixed(2)}</p>
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
  );
};

export default Checkout;