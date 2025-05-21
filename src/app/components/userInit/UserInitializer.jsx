"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchUser } from "@/redux/slices/userSlice/userSlice";

export default function UserInitializer() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchUser());
    }, [dispatch]);

    return null; // Renders nothing
}