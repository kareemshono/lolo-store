import { toast } from "react-toastify";

const toastMiddleware = (store) => (next) => (action) => {
  if (
    ["auth/loginUser/rejected", "auth/registerUser/rejected"].includes(action.type) &&
    action.payload &&
    !action.payload.suppress
  ) {
    toast.error(action.payload.message || "An error occurred", {
      position: "top-right",
      autoClose: 3000,
      theme: "colored",
    });
  }
  return next(action);
};

export default toastMiddleware;