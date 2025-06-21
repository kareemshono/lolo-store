  "use client";
  import { useEffect } from "react";
  import { useDispatch } from "react-redux";
  import { fetchUser } from "@/redux/slices/userSlice/userSlice";
  import Cookies from "js-cookie";

  export default function UserInitializer() {
    const dispatch = useDispatch();

    useEffect(() => {
      // Check for token cookie
      const token = Cookies.get("token");
      if (token) {
        dispatch(fetchUser());
      }
    }, [dispatch]);

    return null; // Renders nothing
  }