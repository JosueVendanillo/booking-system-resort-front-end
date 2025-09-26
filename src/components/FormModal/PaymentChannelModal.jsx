import React from "react";
import gcashQR from "../../assets/images/gcash-qr.jpg";
import bpibankQR from "../../assets/images/bpi-bank-qr.jpg";

function PaymentChannelModal({ show, onClose, onPaymentDone }) {
  if (!show) return null; // Don't render unless modal is open

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content rounded-4 shadow-lg">
          <div className="modal-header">
            <h5 className="modal-title">Choose Your Payment Method</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="list-group">
              <div className="list-group-item">
                <h5>GCash</h5>
                <p>Send payment to: <strong>0917-123-4567</strong></p>
                <img 
                  src={gcashQR} 
                  alt="GCash QR Code" 
                  style={{ width: "200px", marginTop: "10px" }} 
                />
              </div>
              <div className="list-group-item">
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
                <h5>Pay at Counter</h5>
                <p>You can pay directly when you arrive at the resort.</p>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button 
              className="btn btn-secondary rounded-pill" 
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              className="btn btn-primary rounded-pill" 
              onClick={onPaymentDone}
            >
              Payment Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentChannelModal;
