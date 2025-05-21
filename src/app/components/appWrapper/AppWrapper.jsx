"use client";
import { useSelector } from "react-redux";
import UserInitializer from "../userInit/UserInitializer";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import { fetchUser } from "@/redux/slices/userSlice/userSlice";
import Spinner from "../loadingSpinner/Spinner";
import ProductModal from "../productModal/ProductModal";


export default function AppWrapper({ children }) {
   
    const showModal = useSelector(state => state.productModal.showModal) 

    if (fetchUser.isLoading) {
        return <Spinner />;
    }
    if (fetchUser.fulfilled) {console.log(fetchUser)}

    return (
        <>
        
            <UserInitializer />
            {showModal ? <ProductModal /> : <></>}
        
            <Navbar />
            {children}
            <Footer />
        </>
    );
}