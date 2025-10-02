import React,{useState } from "react";
import gcashQR from "../../assets/images/gcash-qr.jpg";
import bpibankQR from "../../assets/images/bpi-bank-qr.jpg";
import axios from 'axios';

function PaymentChannelModal({ show, onClose, onPaymentDone, bookingCode, totalAmount,downpayment }) {
  if (!show) return null; // Don't render unless modal is open

  const [selectedMethod, setSelectedMethod] = useState(""); // track selected method


  console.log("Booking Code in Modal:", bookingCode);
  console.log("Total Amount in Modal:", totalAmount);
  console.log("Downpayment in Modal:", downpayment);
  console.log("Selected Method:", selectedMethod);
  console.log("-----");

const handleConfirm = async () => {
  try {
    const payload = {
      bookingCode: bookingCode,
      amount: downpayment,
      paymentMethod: selectedMethod,
      paymentDate: new Date().toISOString()
    };

    const response = await axios.post("http://localhost:8080/api/payments/payment-home-user", payload);

    console.log("Payment saved:", response.data);
    onPaymentDone(); // callback to Homepage
  } catch (err) {
    console.error("Payment failed:", err);
    alert("Payment failed, please try again.");
  }
};


  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content rounded-4 shadow-lg">
          <div className="modal-header">
            <h5 className="modal-title">Choose Your Payment Method</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
             {/* Booking Summary */}
            <div className="alert alert-info text-center mb-4">
              <h6>Your Booking Code: <strong>{bookingCode}</strong></h6>
              <h6>Total Amount: <strong>₱{Number(totalAmount).toLocaleString()}</strong></h6>
              <p className="mb-0">Minimum Downpayment (30%): <strong>₱{downpayment.toLocaleString()}</strong></p>
            </div>

            <div className="list-group">
              <div className="list-group-item">
                  <input
                  type="radio"
                  name="paymentMethod"
                  value="GCash"
                  checked={selectedMethod === "GCash"}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                  className="form-check-input me-2"
                />
                <h5>GCash</h5>
                <p>Send payment to: <strong>0917-123-4567</strong></p>
                <img 
                  src={gcashQR} 
                  alt="GCash QR Code" 
                  style={{ width: "200px", marginTop: "10px" }} 
                />
              </div>
              <div className="list-group-item">
                  <input
                  type="radio"
                  name="paymentMethod"
                  value="Bank Transfer"
                  checked={selectedMethod === "Bank"}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                  className="form-check-input me-2"
                />
                <h5>Bank Transfer</h5>
                <p>
                  Bank: BPI <br />
                  Account Number: <strong>1234-5678-90</strong> <br />
                  Account Name: Blue Belle Hotel
                </p>
                <img 
                  src={bpibankQR} 
                  alt="BPI Bank QR Code" 
                  style={{ width: "200px", marginTop: "10px" }} 
                />
              </div>
              <div className="list-group-item">
                  <input
                  type="radio"
                  name="paymentMethod"
                  value="Counter"
                  checked={selectedMethod === "Counter"}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                  className="form-check-input me-2"
                />
                <h5>Pay at Counter</h5>
                <p>You can pay directly when you arrive at the resort.</p>
              </div>
            </div>
          </div>
          <div className="modal-footer">
              <button className="btn btn-secondary rounded-pill" onClick={onClose}>
              Cancel
            </button>
            <button
              className="btn btn-primary rounded-pill"
              onClick={handleConfirm}
              disabled={!selectedMethod} // disable until a method is selected
            >
              Confirm Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentChannelModal;
