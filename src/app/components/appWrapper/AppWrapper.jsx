"use client";

import { useSelector } from "react-redux";
import UserInitializer from "../userInit/UserInitializer";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import Spinner from "../loadingSpinner/Spinner";
import ProductModal from "../productModal/ProductModal";
import { TransitionProvider, useTransition } from "../transition/TransitionProvider";

export default function AppWrapper({ children }) {
  const showModal = useSelector((state) => state.productModal.showModal);

  return (
    <TransitionProvider>
      <InnerAppWrapper showModal={showModal} children={children} />
    </TransitionProvider>
  );
}

function InnerAppWrapper({ showModal, children }) {
  const { isLoading } = useTransition();

  return (
    <>
      <UserInitializer />
      {showModal ? <ProductModal /> : null}
      <Navbar />
      {isLoading && <Spinner />}
      {children}
      <Footer />
    </>
  );
}