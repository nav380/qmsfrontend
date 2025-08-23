import React, { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NetworkStatus = () => {
  useEffect(() => {
    const notifyOffline = () => {
      toast.error("You're offline!", { autoClose: 3000 });
    };

    const notifyOnline = () => {
      toast.success("You're back online!", { autoClose: 3000 });
    };

    // Event listeners for online/offline
    window.addEventListener("offline", notifyOffline);
    window.addEventListener("online", notifyOnline);

    // Cleanup event listeners on component unmount
    return () => {
      window.removeEventListener("offline", notifyOffline);
      window.removeEventListener("online", notifyOnline);
    };
  }, []);

  return <ToastContainer />;
};

export default NetworkStatus;
