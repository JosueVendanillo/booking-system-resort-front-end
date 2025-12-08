import React, { useEffect, useState } from "react";
import axios from 'axios';

function PaymentChannelModal({ show, onClose, onPaymentDone, bookingCode, totalAmount, downpayment, adults, kids }) {
  if (!show) return null;

  const [adultPrice, setAdultPrice] = useState(0);
  const [kidPrice, setKidPrice] = useState(0);
  const [peopleCost, setPeopleCost] = useState(0);
  const [adultCount, setAdultCount] = useState(0);
  const [kidsCount, setKidsCount] = useState(0);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [bookingIdForDiscount, setBookingIdForDiscount] = useState(null)

  const [booking, setBooking] = useState({
    discountType: ""
  });

  const DISCOUNT_TYPES = ["Senior Citizen", "PWD", "Birthday Promo"];


  // Multiple uploads state
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadError, setUploadError] = useState("");


  //payment gateway
  const [clientKey, setClientKey] = useState()

  const PAYMONGO_KEY = "pk_test_UYnTzoX9VzXoRoj5n9uCJ2Rm"; //LIVE
  // "pk_test_UYnTzoX9VzXoRoj5n9uCJ2Rm"; TEST


  {/* // Add state for phone */ }
  // const [gcashPhone, setGcashPhone] = useState("");
  // const [gcashError, setGcashError] = useState("");


  // const validateGcashNumber = (phone) => {
  //   const regex = /^(09|\+639)\d{9}$/;
  //   if (!phone) return "GCash number is required";
  //   if (!regex.test(phone)) return "Invalid GCash number (09xxxxxxxxx or +639xxxxxxxxx)";
  //   return "";
  // };


  // const handleGcashChange = (e) => {
  //   let value = e.target.value.replace(/\D/g, ""); // remove non-digit characters

  //   // Auto-add +63 if the user starts with 9
  //   if (value.startsWith("9")) {
  //     value = "+63" + value;
  //   }

  //   // Limit to 13 characters (+639XXXXXXXXX)
  //   if (value.length > 13) value = value.slice(0, 13);

  //   setGcashPhone(value);
  //   setGcashError(validateGcashNumber(value));
  // };




  useEffect(() => {
    const loadFees = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/prices/entrance-fee');
        setAdultPrice(res.data.adultPrice);
        setKidPrice(res.data.kidsPrice);

        setAdultCount(adults * res.data.adultPrice);
        setKidsCount(kids * res.data.kidsPrice || 0);
        setPeopleCost((adults * res.data.adultPrice) + (kids * res.data.kidsPrice) || 0);

      } catch (err) {
        console.error("Error fetching entrance fees:", err);
      }
    };
    loadFees();
  }, [adults, kids]);

  const payload = JSON.parse(localStorage.getItem("pendingBooking"));

  // const handleConfirm = async () => {
  //   try {
  //     const response = await axios.post("http://localhost:8080/api/bookings", payload);
  //     alert("Booking Successful");

  //     setBookingIdForDiscount(response.data.id)

  //     onPaymentDone();
  //     // window.location.reload();
  //   } catch (err) {
  //     console.error("Error saving booking:", err);
  //     alert("Payment failed, please try again.");
  //   }


  // };




  // ===== FOR PAYMENT GATEWAY ======


  useEffect(() => {
  const verifyPayment = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const intentId = urlParams.get("payment_intent_client_key"); // PayMongo sends clientKey in URL
    if (intentId) {
      try {
        const res = await axios.get(`http://localhost:8080/api/paymongo/intent/${intentId}`);
        const status = res.data.data.attributes.status;
        if (status === "succeeded") {
          alert("Payment Successful!");
        } else {
          alert("Payment Pending or Failed");
        }
      } catch (err) {
        console.error(err);
      }
    }
  };
  verifyPayment();
}, []);



const loadPayMongoSDK = () => {
  return new Promise((resolve, reject) => {
    if (window.PayMongo) return resolve(window.PayMongo);

    const script = document.createElement("script");
    script.src = "https://js.paymongo.com/v1/paymongo.js";
    script.onload = () => resolve(window.PayMongo);
    script.onerror = () => reject(new Error("Failed to load PayMongo SDK"));
    document.body.appendChild(script);
  });
};

const handleConfirm = async () => {
  try {
    // 1️⃣ Save booking
    const bookingRes = await axios.post("http://localhost:8080/api/bookings", payload);
    const bookingId = bookingRes.data.id;
    setBookingIdForDiscount(bookingId);
    alert("Booking saved!");

    // 2️⃣ Create PayMongo Payment Intent
    const amountInCentavos = totalAmount * 100; // convert PHP to centavos
    const intentRes = await axios.post("http://localhost:8080/api/paymongo/intent/maya", {
      amount: amountInCentavos,
      returnUrl: "http://localhost:4173/payment-success"
    });

    const clientKey = intentRes.data.clientKey;
    if (!clientKey) throw new Error("Missing clientKey");

    // 3️⃣ Redirect to hosted checkout
    window.location.href = `https://checkout.paymongo.com/?client_key=${clientKey}`;

  } catch (err) {
    console.error("Payment Error:", err);
    alert("Unable to initiate payment. Please try again.");
  }
};











  // ====== DISCOUNT TYPE CHANGE ======
  const handleChange = (e) => {
    setBooking((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // ====== VALIDATION FOR MULTIPLE FILES ======
  const validateFiles = (files) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    const maxSize = 5 * 1024 * 1024;
    const maxFiles = 5;

    if (files.length + uploadedImages.length > maxFiles) {
      return "Maximum of 5 images allowed.";
    }
    for (let file of files) {
      if (!allowedTypes.includes(file.type)) {
        return "Only JPG, JPEG and PNG files are allowed.";
      }
      if (file.size > maxSize) {
        return "Each file must be under 5MB.";
      }
    }
    return null;
  };

  // ====== HANDLE MULTIPLE IMAGE UPLOAD ======
  const handleMultipleImages = (e) => {
    const files = Array.from(e.target.files);
    const error = validateFiles(files);

    if (error) {
      setUploadError(error);
      return;
    }

    setUploadError("");

    const mapped = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setUploadedImages((prev) => [...prev, ...mapped]);
  };

  // ====== DELETE IMAGE ======
  const handleDeleteImage = (index) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  // ====== UPLOAD FILES TO BACKEND ======
  const handleUpload = async () => {
    if (uploadedImages.length === 0) {
      setUploadError("Please attach at least one proof image.");
      return;
    }

    console.log("bookingID for discount value: " + bookingIdForDiscount)

    const formData = new FormData();

    // attach bookingId
    formData.append("bookingId", bookingIdForDiscount);
    formData.append("discountType", booking.discountType);
    formData.append("uploadedBy", payload.fullname); // or dynamic
    uploadedImages.forEach((img) => {
      formData.append("files", img.file);
    });


    try {
      const res = await axios.post(
        "http://localhost:8080/api/uploads/discount-proofs",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert("Files uploaded successfully!");
    } catch (err) {
      console.error(err);
      setUploadError("Failed to upload. Please try again.");
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

            {/* SUMMARY */}
            <div className="alert alert-info text-center mb-4">
              <h6>Your Booking Code: <strong>{bookingCode}</strong></h6>
              <h6><strong>Total Adult Price:</strong> ₱{adultCount}</h6>
              <h6><strong>Total Kids Price:</strong> ₱{kidsCount}</h6>
              <h6><strong>Total Entrance:</strong> ₱{peopleCost}</h6>
              <h6>Total Amount: <strong>₱{Number(totalAmount).toLocaleString()}</strong></h6>
              <p className="mb-0">Minimum Downpayment (30%): <strong>₱{downpayment.toLocaleString()}</strong></p>
            </div>

            {/* DISCOUNT TYPE */}
            <div className="col-md-6 mb-3">
              <label className="fw-medium d-block mb-2">Type of Discount</label>

              <div className="d-flex gap-4">
                {DISCOUNT_TYPES.map((type) => (
                  <div className="form-check" key={type}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name="discountType"
                      value={type}
                      checked={booking.discountType === type}
                      onChange={handleChange}
                    />
                    <label className="form-check-label">{type}</label>
                  </div>
                ))}
              </div>
            </div>

            {/* SHOW UPLOAD WHEN DISCOUNT SELECTED */}
            {booking.discountType && (
              <div className="col-md-6">
                <label className="form-label fw-medium">Upload your Proof of Discount</label>

                <input
                  type="file"
                  className="form-control mb-2"
                  accept="image/*"
                  multiple
                  onChange={handleMultipleImages}
                />

                {uploadError && <p className="text-danger small">{uploadError}</p>}

                {/* PREVIEW IMAGES */}
                <div className="d-flex gap-2 flex-wrap mt-2">
                  {uploadedImages.map((img, idx) => (
                    <div
                      key={idx}
                      className="position-relative"
                      style={{ width: "120px", height: "120px" }}
                    >
                      <img
                        src={img.preview}
                        alt="preview"
                        className="img-thumbnail"
                        style={{ width: "120px", height: "120px", objectFit: "cover" }}
                      />

                      <button
                        type="button"
                        onClick={() => handleDeleteImage(idx)}
                        className="btn btn-danger btn-sm position-absolute top-0 end-0"
                        style={{
                          transform: "translate(30%, -30%)",
                          padding: "2px 6px",
                          borderRadius: "50%",
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                <button className="btn btn-primary mt-3" onClick={handleUpload}>
                  UPLOAD
                </button>
              </div>
            )}

    



            {/* PAYMENT REFERENCE */}
            <div className="list-group mt-4">
              <div className="list-group-item">
                <h5>Enter Reference No.</h5>
                <input
                  type="text"
                  placeholder="Enter Reference No."
                  className="form-control mt-2"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                />
                <p>Please enter the reference number of your online transaction.</p>
              </div>
            </div>




            {/* // Add input in the modal body (above Confirm Payment button) */}
            {/* <div className="mb-3">
              <label className="fw-medium">GCash Phone Number</label>
              <input
                type="text"
                className={`form-control ${gcashError ? "is-invalid" : ""}`}
                placeholder="Enter your GCash phone number"
                value={gcashPhone}
                onChange={(e) => {
                  const value = e.target.value;
                  setGcashPhone(value);
                  setGcashError(validateGcashNumber(value));
                  handleGcashChange(e)
                }}
              />
              {gcashError && <div className="invalid-feedback">{gcashError}</div>}

            </div> */}



          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary rounded-pill" onClick={onClose}>Cancel</button>
            <button
              className="btn btn-primary rounded-pill"
              onClick={handleConfirm}
              disabled={referenceNumber.trim().length === 0

                // ||
                // gcashError !== ""  // disable if invalid

              }
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
