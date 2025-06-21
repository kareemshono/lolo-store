"use client";

import Link from "next/link";
import { useTransition } from "./TransitionProvider";
import { usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import { toggleModal } from "@/redux/slices/productModal/productModalSlice";
import { useEffect, useRef } from "react";

export default function TransitionLink({ href, children, onClick, onNavigate, ...props }) {
  const { startLoading } = useTransition();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleClick = (e) => {
    if (!isMounted.current) return;
    if (pathname !== href) {
      startLoading();
      dispatch(toggleModal({ showModal: false, product: null }));
      console.log("TransitionLink: Closing ProductModal on navigation");
      if (onNavigate) onNavigate(); // Call onNavigate for Navbar
    }
    if (onClick) onClick(e); // Preserve existing onClick (e.g., ProductModal)
  };

  return (
    <Link href={href} {...props} onClick={handleClick}>
      {children}
    </Link>
  );
}