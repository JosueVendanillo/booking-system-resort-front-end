import React from "react";
import { useLocation } from "react-router-dom";

function PaymentSuccess() {
  const location = useLocation();
  
  // Optional: you can read query params from PayMongo if needed
  const queryParams = new URLSearchParams(location.search);
  const paymentStatus = queryParams.get("status"); // example if PayMongo sends it

  return (
    <div className="container mt-5 text-center">
      <h2>Payment Successful!</h2>
      <p>Thank you for your payment. Your booking is confirmed.</p>
      {paymentStatus && <p>Status: {paymentStatus}</p>}
      <a href="/" className="btn btn-primary mt-3">Go to Home</a>
    </div>
  );
}

export default PaymentSuccess;
