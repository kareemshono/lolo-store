"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import { toast } from "react-toastify";
import { clearToasts } from "@/redux/slices/userSlice/userSlice";

export default function ToastHandler() {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const { welcomeToast, successToast } = useSelector((state) => state.userSlice);

  useEffect(() => {
    if (pathname === "/" && (welcomeToast || successToast)) {
      if (successToast) {
        toast.success(successToast, {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        });
      }
      if (welcomeToast) {
        toast.success(welcomeToast, {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        });
      }
      dispatch(clearToasts());
      console.log("ToastHandler: Displaying toasts on homepage");
    }
  }, [pathname, welcomeToast, successToast, dispatch]);

  return null;
}