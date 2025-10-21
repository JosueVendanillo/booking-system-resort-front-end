import React,{ useState, useEffect } from 'react'
import axios from 'axios';
import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
    FaMapMarkerAlt,
    FaPhone,
    FaEnvelope,
    FaWifi,
    FaCoffee,
    FaUtensils,
    FaDumbbell,
    FaWater,
    FaCar,
    FaStar,
    FaFacebookF, FaTwitter, FaInstagram, FaYoutube
} from "react-icons/fa"
import PaymentChannel from '../../components/FormModal/PaymentChannelModal';

function Homepage() {

//pricing
const ADULT_PRICE = 300;
const KID_PRICE = 150;


const navigate = useNavigate();
const [showPaymentModal, setShowPaymentModal] = useState(false);
const [bookingCode, setBookingCode] = useState("");
const [confirmedAmount, setConfirmedAmount] = useState(0);
const [downpayment, setDownpayment] = useState(0); // <-- NEW state
const [adultCount, setAdultCount] = useState(0);
const [kidsCount, setKidsCountt] = useState(0);
 
// Add these helpers at the top of your component
const formatDate = (date) => date.toLocaleDateString("en-CA");
const formatTime = (date) => date.toTimeString().slice(0, 5);
const getToday = () => formatDate(new Date());
const getNowTime = () => formatTime(new Date());
const parseDateTimeLocal = (dateStr, timeStr) => {
  const [y, m, d] = (dateStr || getToday()).split("-").map(Number);
  const [hh, mm] = (timeStr || "00:00").split(":").map(Number);
  return new Date(y, m - 1, d, hh, mm, 0);
};
const getDefaultCheckout = (checkIn) => {
  const co = new Date(checkIn);
  co.setHours(co.getHours() + 1);
  return {
    checkOutDate: formatDate(co),
    checkOutTime: formatTime(co),
  };
};
   

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

// Update your booking state initialization
const [booking, setBooking] = useState({
  fullname: "",
  gender: "",
  adults: 1,
  kids: 0,
  unitType: "",
  checkInDate: getToday(),
  checkInTime: getNowTime(),
  checkOutDate: getToday(),
  checkOutTime: getNowTime(),
  customer: {
    email: "",
    contactNumber: ""
  }
});

// Automatically update checkout when check-in changes
useEffect(() => {
  const checkIn = parseDateTimeLocal(booking.checkInDate, booking.checkInTime);
  const checkOut = parseDateTimeLocal(booking.checkOutDate, booking.checkOutTime);

  // If checkout is before/equal checkin, reset it to +1 hour
  if (checkOut <= checkIn) {
    const { checkOutDate, checkOutTime } = getDefaultCheckout(checkIn);
    setBooking((prev) => ({
      ...prev,
      checkOutDate,
      checkOutTime,
    }));
  }
}, [booking.checkInDate, booking.checkInTime]);


  // Handle simple field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBooking((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle nested customer field changes
  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setBooking((prev) => ({
      ...prev,
      customer: {
        ...prev.customer,
        [name]: value
      }
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setSuccess("");
  setError("");

  try {
    // Combine date + time into LocalDateTime strings
    const payload = {
      fullname: booking.fullname,

      adults: booking.adults,
      kids: booking.kids,
      unitType: booking.unitType,
      checkIn: `${booking.checkInDate}T${booking.checkInTime}:00`,   // <-- FIX
      checkOut: `${booking.checkOutDate}T${booking.checkOutTime}:00`, // <-- FIX
      customer: {
        email: booking.customer.email,
        contactNumber: booking.customer.contactNumber,
        gender: booking.customer.gender,  
      },
    };

    const response = await axios.post(
      "http://localhost:8080/api/bookings",
      payload
    );

        // ✅ Compute total cost (room + people)
    const totalAmount = response.data.totalAmount || 0; // from backend
    // const computedPeopleCost = booking.adults * ADULT_PRICE + booking.kids * KID_PRICE;
    // const totalAmount = baseAmount + computedPeopleCost;
    const kids = booking.kids || 0;
    const adults = booking.adults || 0;



    console.log("Booking response:", response.data);

    // Save bookingCode and totalAmount
    setBookingCode(response.data.bookingCode);
    setConfirmedAmount(totalAmount);
    setDownpayment(totalAmount * 0.3);
    // setPeopleCost(computedPeopleCost);
    setAdultCount(adults);
    setKidsCountt(kids);
    
    
     // Save booking temporarily
   localStorage.setItem("pendingBooking", JSON.stringify(payload));

     // Open payment modal
     setShowPaymentModal(true);

    console.log("Booking saved:", response.data);
    console.log("Booking Code: ", response.data.bookingCode);
    console.log("Total Amount: ", totalAmount);
    // console.log("People Cost: ", computedPeopleCost);
    

    confirm("Are you sure you want to submit the booking?");
    setSuccess("Booking successful!");
    alert("Booking successful!");

    // Reset form
    setBooking({
      fullname: "",
        gender: "",
      adults: 1,
      kids: 0,
      unitType: "",
      checkInDate: getToday(),
      checkInTime: getNowTime(),
      checkOutDate: getToday(),
      checkOutTime: getNowTime(),
      customer: {
        email: "",
        contactNumber: ""
      }
    });
  } catch (err) {
    setError("Failed to submit booking. Please try again.");
    console.error(err.response?.data || err.message);
  } finally {
    setLoading(false);
  }
};

    return (
        <>
            {/* Hero Section */}
            <section id="hero" className="text-center position-relative" style={{ backgroundImage: 'url("/assets/img/projectImgs/hero.jpg")', backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '70vh' }}>
                <div className='position-absolute top-0 h-100 w-100 bg-dark' style={{ zIndex: 0, opacity: '60%' }}></div>

                <div className="position-relative container h-100 d-flex flex-column justify-content-center align-items-center text-center">
                    <h1 className="display-1 fw-bold mb-2 text-white">Blue Belle Hotel And Resort</h1>
                    <p className="fs-2 mb-4 mx-auto lh-1 text-white" style={{ maxWidth: "600px" }}>
                        Experience luxury and tranquility in our exclusive pool paradise
                    </p>
                    <div className="d-flex flex-column flex-sm-row gap-3">
                        <a href="/#booking-cta" className="btn btn-light text-primary fw-semibold px-4 py-2 rounded-pill">
                            Book Now
                        </a>

                        <a href="/#about" className="btn btn-outline-light fw-semibold px-4 py-2 rounded-pill">Explore</a>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-5 container-xxl flex-grow-1 container-p-y">
                <div className="container py-4">
                    <div className="text-center mb-5">
                        <h2 className="display-3 fw-bold mb-3">About Our Resort</h2>
                    </div>

                    <div className="row g-5 align-items-center">
                        <div className="col-md-6">
                            <div className="position-relative rounded-4 overflow-hidden shadow" style={{ height: "400px" }}>
                                <img
                                    src="/assets/img/projectImgs/about.jpg"
                                    alt="Resort exterior"
                                    className="w-100 h-100"
                                    style={{ objectFit: "cover" }}
                                />
                            </div>
                        </div>

                        <div className="col-md-6">
                            <h3 className="display-4 fw-semibold mb-4">A Place to Unwind, Explore, and Reconnect</h3>
                            <p className="text-muted mb-4">
                                Nestled in a breathtaking coastal location, Blue Belle Hotel and Resort offers a peaceful retreat for families, couples, and solo travelers alike. From elegant rooms with panoramic views to open-air lounges and nature-infused amenities — every corner is designed to give you a stay worth remembering.
                            </p>
                            <a href="/#amenities" className="btn btn-primary fw-semibold px-4 py-2 rounded-pill">Learn More</a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Amenities Section */}
            <section id="amenities" className="py-5 bg-light">
                <div className="container py-4">
                    <div className="text-center mb-5">
                        <h2 className="h1 fw-bold mb-3">Resort Amenities</h2>
                        <p className="text-muted mx-auto fs-5" style={{ maxWidth: "800px" }}>
                            Indulge in our facilities designed for your comfort and enjoyment
                        </p>
                        <div className="divider-primary mx-auto mt-3"></div>
                    </div>

                    <div className="row g-4">
                        <div className="col-md-6 col-lg-4">
                            <div className="card h-100 text-center p-4 hover-shadow">
                                <div className="d-flex justify-content-center mb-4">
                                    <div
                                        className="d-flex align-items-center justify-content-center rounded-circle"
                                        style={{ width: "64px", height: "64px", backgroundColor: "rgba(105, 108, 255, 0.1)" }}
                                    >
                                        <FaWifi className="text-primary" style={{ width: "28px", height: "28px" }} />
                                    </div>
                                </div>
                                <h3 className="h5 fw-semibold mb-3">High-Speed WiFi</h3>
                                <p className="text-muted">
                                    Stay connected with complimentary high-speed internet throughout the resort.
                                </p>
                            </div>
                        </div>

                        <div className="col-md-6 col-lg-4">
                            <div className="card h-100 text-center p-4 hover-shadow">
                                <div className="d-flex justify-content-center mb-4">
                                    <div
                                        className="d-flex align-items-center justify-content-center rounded-circle"
                                        style={{ width: "64px", height: "64px", backgroundColor: "rgba(105, 108, 255, 0.1)" }}
                                    >
                                        <FaCoffee className="text-primary" style={{ width: "28px", height: "28px" }} />
                                    </div>
                                </div>
                                <h3 className="h5 fw-semibold mb-3">Spa & Wellness</h3>
                                <p className="text-muted">
                                    Rejuvenate your body and mind with our premium spa treatments and wellness programs.
                                </p>
                            </div>
                        </div>

                        <div className="col-md-6 col-lg-4">
                            <div className="card h-100 text-center p-4 hover-shadow">
                                <div className="d-flex justify-content-center mb-4">
                                    <div
                                        className="d-flex align-items-center justify-content-center rounded-circle"
                                        style={{ width: "64px", height: "64px", backgroundColor: "rgba(105, 108, 255, 0.1)" }}
                                    >
                                        <FaUtensils className="text-primary" style={{ width: "28px", height: "28px" }} />
                                    </div>
                                </div>
                                <h3 className="h5 fw-semibold mb-3">Fine Dining</h3>
                                <p className="text-muted">
                                    Experience culinary excellence.
                                </p>
                            </div>
                        </div>

                        <div className="col-md-6 col-lg-4">
                            <div className="card h-100 text-center p-4 hover-shadow">
                                <div className="d-flex justify-content-center mb-4">
                                    <div
                                        className="d-flex align-items-center justify-content-center rounded-circle"
                                        style={{ width: "64px", height: "64px", backgroundColor: "rgba(105, 108, 255, 0.1)" }}
                                    >
                                       <FaDumbbell className="text-primary" style={{ width: "28px", height: "28px" }} />
                                    </div>
                                </div>
                                <h3 className="h5 fw-semibold mb-3">Excitement Activities</h3>
                                <p className="text-muted">
                                    Maintain your joy in our state-of-the-art activities.
                                </p>
                            </div>
                        </div>

                        <div className="col-md-6 col-lg-4">
                            <div className="card h-100 text-center p-4 hover-shadow">
                                <div className="d-flex justify-content-center mb-4">
                                    <div
                                        className="d-flex align-items-center justify-content-center rounded-circle"
                                        style={{ width: "64px", height: "64px", backgroundColor: "rgba(105, 108, 255, 0.1)" }}
                                    >
                                        <FaWater className="text-primary" style={{ width: "28px", height: "28px" }} />
                                    </div>
                                </div>
                                <h3 className="h5 fw-semibold mb-3">Infinity Pools</h3>
                                <p className="text-muted">Relax in our stunning infinity pools.</p>
                            </div>
                        </div>

                        <div className="col-md-6 col-lg-4">
                            <div className="card h-100 text-center p-4 hover-shadow">
                                <div className="d-flex justify-content-center mb-4">
                                    <div
                                        className="d-flex align-items-center justify-content-center rounded-circle"
                                        style={{ width: "64px", height: "64px", backgroundColor: "rgba(105, 108, 255, 0.1)" }}
                                    >
                                        <FaCar className="text-primary" style={{ width: "28px", height: "28px" }} />
                                    </div>
                                </div>
                                <h3 className="h5 fw-semibold mb-3">Concierge Service</h3>
                                <p className="text-muted">
                                    Our dedicated concierge team is available 24/7 to fulfill your every request.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Gallery Section */}
            <section id="gallery" className="py-5">
                <div className="container py-4">
                    <div className="text-center mb-5">
                        <h2 className="h1 fw-bold mb-3">Resort Gallery</h2>
                        <p className="text-muted mx-auto fs-5" style={{ maxWidth: "800px" }}>
                            Explore the beauty and luxury of our resort through our gallery
                        </p>
                        <div className="divider-primary mx-auto mt-3"></div>
                    </div>

                    <div className="row g-3">
                        {Array.from({ length: 4 }, (_, index) => (
                            <div key={index} className="col-6 col-md-4 col-lg-3">
                                <div
                                    className="position-relative rounded-4 overflow-hidden gallery-item"
                                    style={{ height: "240px" }}
                                >
                                    <img
                                        src={`/assets/img/projectImgs/img_${index + 1}.jpg`}
                                        alt={`Gallery image ${index + 1}`}
                                        className="w-100 h-100"
                                        style={{ objectFit: "cover" }}
                                    />
                                    <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-0 overlay"></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-4">
                        <NavLink to="/gallery" className="btn btn-primary fw-semibold px-4 py-2 rounded-pill">View All Photos</NavLink>
                    </div>
                </div>
            </section>

            {/* Testimonial Section */}
            <section id="testimonials" className="py-5 bg-light">
                <div className="container py-4">
                    <div className="text-center mb-5">
                        <h2 className="h1 fw-bold mb-3">Guest Experiences</h2>
                        <p className="text-muted mx-auto fs-5" style={{ maxWidth: "800px" }}>
                            Hear what our guests have to say about their stay at Blue Belle Hotel And Resort
                        </p>
                        <div className="divider-primary mx-auto mt-3"></div>
                    </div>

                    <div className="row g-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="col-md-4">
                                <div className="card h-100 p-4">
                                    <div className="mb-3">
                                        <div className="text-warning">
                                            {[...Array(5)].map((_, i) => (
                                                <FaStar key={i} className="d-inline-block me-1" />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-muted mb-4 fst-italic">
                                        "Our stay at Blue Belle was nothing short of magical. The staff went above and beyond to make
                                        our anniversary special. The beachfront villa was stunning and the dining experiences were
                                        exceptional."
                                    </p>
                                    <div className="d-flex align-items-center">
                                        <div
                                            className="position-relative rounded-circle overflow-hidden me-3"
                                            style={{ width: "48px", height: "48px" }}
                                        >
                                            <img
                                                src="/public/assets/img/projectImgs/logo.png"
                                                alt=""
                                                className="w-100 h-100"
                                                style={{ objectFit: "cover" }}
                                            />
                                        </div>
                                        <div>
                                            <h4 className="h6 fw-semibold mb-0">John</h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Booking CTA Section */}
            <section id="booking-cta" className="py-5 bg-primary text-white">
                <div className="container py-4">
                    <div className="text-center mb-5">
                        <h2 className="display-2 fw-bold mb-3 text-white">Book Your Stay Today</h2>
                        <p className="fs-4 mx-auto" style={{ maxWidth: "800px" }}>
                            Experience the ultimate luxury and relaxation at Blue Belle Hotel and Resort. Secure your spot in paradise now!
                        </p>
                        <div className="divider-light mx-auto mt-3"></div>
                    </div>

                    <div className="row g-5 align-items-center">
                        {/* Booking Information */}
                        <div className="col-md-6">
                            <div className="position-relative rounded-4 overflow-hidden shadow" style={{ height: "480px" }}>
                                <img
                                    src="/assets/img/projectImgs/about.jpg"
                                    alt="Resort exterior"
                                    className="w-100 h-100"
                                    style={{ objectFit: "cover" }}
                                />
                            </div>
                        </div>

                        {/* Booking Form */}
                        <div className="col-md-6">
                            <div className="card shadow-lg">
                                <div className="card-body p-4">
                                    <h3 className="h4 fw-semibold mb-4 text-primary">Reserve Your Stay</h3>
                                    <form className="row g-3" onSubmit={handleSubmit}>
                                        <div className="col-12">
                                            <label htmlFor="fullname" className="form-label fw-medium">Fullname</label>
                                            <input
                                            type="text"
                                            className="form-control"
                                            name="fullname"
                                            value={booking.fullname}
                                            onChange={handleChange}
                                            required
                                            />
                                        </div>

                                        <div className="col-md-6">
                                            <label htmlFor="gender" className="form-label fw-medium">Gender</label>
                                            <select
                                                className="form-select"
                                                id="gender"
                                                name="gender"
                                                value={booking.gender}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="" disabled>Select Gender</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                            </select>
                                        </div>

                                        <div className="col-md-6">
                                            <label htmlFor="email" className="form-label fw-medium">Email</label>
                                            <input
                                            type="email"
                                            className="form-control"
                                            name="email"
                                            value={booking.customer?.email || ""}
                                            onChange={handleCustomerChange}
                                            required
                                            />
                                        </div>

                                        <div className="col-md-6">
                                            <label htmlFor="contactNumber" className="form-label fw-medium">Contact Number</label>
                                            <input
                                            type="text"
                                            className="form-control"
                                            name="contactNumber"
                                            value={booking.customer?.contactNumber || ""}
                                            onChange={handleCustomerChange}
                                            required
                                            />
                                        </div>

                                        <div className="row w-100">
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="checkInDate" className="form-label fw-medium">Check-in Date</label>
                                            <input
                                            type="date"
                                            className="form-control"
                                            id="checkInDate"
                                            name="checkInDate"
                                            value={booking.checkInDate}
                                            onChange={handleChange}
                                            min={getToday()}
                                            required
                                            />
                                        </div>
                                        {/* <div className="col-md-6 mb-3">
                                            <label htmlFor="checkInTime" className="form-label fw-medium">Check-in Time</label>
                                            <input
                                            type="time"
                                            className="form-control"
                                            id="checkInTime"
                                            name="checkInTime"
                                            value={booking.checkInTime}
                                            onChange={handleChange}
                                            min={booking.checkInDate === getToday() ? getNowTime() : "00:00"}
                                            required
                                            />
                                        </div> */}
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="checkOutDate" className="form-label fw-medium">Check-out Date</label>
                                            <input
                                            type="date"
                                            className="form-control"
                                            id="checkOutDate"
                                            name="checkOutDate"
                                            value={booking.checkOutDate}
                                            onChange={handleChange}
                                            min={booking.checkInDate}
                                            required
                                            />
                                        </div>
                                        {/* <div className="col-md-6 mb-3">
                                            <label htmlFor="checkOutTime" className="form-label fw-medium">Check-out Time</label>
                                            <input
                                            type="time"
                                            className="form-control"
                                            id="checkOutTime"
                                            name="checkOutTime"
                                            value={booking.checkOutTime}
                                            onChange={handleChange}
                                            min={booking.checkOutDate === booking.checkInDate ? booking.checkInTime : "00:00"}
                                            required
                                            />
                                        </div> */}
                                        </div>

                                            <div className="col-md-6">
                                            <label htmlFor="adults" className="form-label fw-medium">Adult</label>
                                            <div className="input-group">
                                                <button
                                                type="button"
                                                className="btn btn-outline-secondary"
                                                onClick={() =>
                                                    setBooking((prev) => ({
                                                    ...prev,
                                                    adults: Math.max(1, (parseInt(prev.adults) || 1) - 1),
                                                    }))
                                                }
                                                >
                                                -
                                                </button>
                                                <input
                                                type="text"
                                                className="form-control text-center"
                                                name="adults"
                                                value={booking.adults || 1}
                                                readOnly
                                                />
                                                <button
                                                type="button"
                                                className="btn btn-outline-secondary"
                                                onClick={() =>
                                                    setBooking((prev) => ({
                                                    ...prev,
                                                    adults: Math.min(20, (parseInt(prev.adults) || 1) + 1),
                                                    }))
                                                }
                                                >
                                                +
                                                </button>
                                            </div>
                                            </div>

                                            <div className="col-md-6">
                                            <label htmlFor="kids" className="form-label fw-medium">Kids</label>
                                            <div className="input-group">
                                                <button
                                                type="button"
                                                className="btn btn-outline-secondary"
                                                onClick={() =>
                                                    setBooking((prev) => ({
                                                    ...prev,
                                                    kids: Math.max(0, (parseInt(prev.kids) || 0) - 1),
                                                    }))
                                                }
                                                >
                                                -
                                                </button>
                                                <input
                                                type="text"
                                                className="form-control text-center"
                                                name="kids"
                                                value={booking.kids || 0}
                                                readOnly
                                                />
                                                <button
                                                type="button"
                                                className="btn btn-outline-secondary"
                                                onClick={() =>
                                                    setBooking((prev) => ({
                                                    ...prev,
                                                    kids: Math.min(20, (parseInt(prev.kids) || 0) + 1),
                                                    }))
                                                }
                                                >
                                                +
                                                </button>
                                            </div>
                                            </div>

                                        <div className="col-md-6">
                                            <label htmlFor="unitType" className="form-label fw-medium">Room Type</label>
                                            <select
                                            className="form-select"
                                            id="unitType"
                                            name="unitType"
                                            value={booking.unitType}
                                            onChange={handleChange}
                                            required
                                            >
                                            <option value="" disabled>Select Room</option>
                                            <option value="ktv-room">KTV Room</option>
                                            <option value="big-cabana">Big Cabana</option>
                                            <option value="small-cabana">Small Cabana</option>
                                            <option value="brown-table">Brown Table</option>
                                            <option value="colored-table">Colored Table</option>
                                            <option value="garden-table">Garden Table</option>
                                            <option value="couple-room">Couple Room (For Private)</option>
                                            <option value="family-room">Family Room (For Private)</option>
                                            </select>
                                        </div>
                                        <section id="price-list" class="py-5 bg-light">
                                         <div class="container">
                                             <h2 class="text-center mb-4">Cottage Price List</h2>
                                             <div class="table-responsive">
                                             <table class="table table-bordered table-striped text-center">
                                             <thead class="table-dark">
                                               <tr>
                                               <th>Facility</th>
                                               <th>Capacity</th>
                                               <th>Price (₱)</th>
                                               </tr>
                                               </thead>
                                               <tbody>
                                               <tr>
                                               <td>KTV Room</td>
                                               <td>25 pax</td>
                                               <td>3,500</td>
                                               </tr>
                                               <tr>
                                               <td>Big Cabana</td>
                                               <td>25 pax</td>
                                               <td>1,500</td>
                                               </tr>
                                               <tr>
                                               <td>Small Cabana</td>
                                               <td>15 pax</td>
                                               <td>1,000</td>
                                               </tr>
                                               <tr>
                                               <td>Brown Table</td>
                                               <td>15 pax</td>
                                               <td>1,000</td>
                                               </tr>
                                               <tr>
                                               <td>Colored Table</td>
                                               <td>9–12 pax</td>
                                               <td>800</td>
                                               </tr>
                                               <tr>
                                               <td>Garden Table</td>
                                               <td>4–6 pax</td>
                                               <td>500</td>
                                               </tr>
                                               <tr>
                                               <td>Couple Room</td>
                                               <td>6-8 pax</td>
                                               <td>3,000</td>
                                               </tr>
                                               <tr>
                                               <td>Family Room</td>
                                               <td>6-8 pax</td>
                                               <td>5,500</td>
                                               </tr>
                                               </tbody>
                                               </table>
                                               </div>
                                               </div>
                                               </section>

                                               <div>
                                                <input type="checkbox" name="" id="" />
                                                <label className="ms-2">I agree to the <a href="/terms-and-conditions" target="_blank" rel="noopener noreferrer">Terms and Conditions</a></label>
                                               </div>
                                        <div className="col-12">
                                            <button type="submit" className="btn btn-primary w-100 py-2 rounded-pill">
                                                Book Now
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            {/* Feedback Section */}
<section id="feedback" className="py-5 bg-light">
  <div className="container py-4">
    <div className="text-center mb-5">
      <h2 className="h1 fw-bold mb-3">We Value Your Feedback</h2>
      <p className="text-muted mx-auto fs-5" style={{ maxWidth: "800px" }}>
        Share your thoughts and help us improve your experience at Blue Belle Hotel & Resort.
      </p>
      <div className="divider-primary mx-auto mt-3"></div>
    </div>

    <div className="row justify-content-center">
      <div className="col-lg-8">
        <form
              onSubmit={async (e) => {
            e.preventDefault();

            const formData = {
              name: e.target.name.value,
              email: e.target.email.value,
              rating: e.target.rating.value,
              message: e.target.message.value,
            };

            try {
              const response = await axios.post("http://localhost:8080/api/feedback", formData);
              if (response.status === 200 || response.status === 201) {
                alert("Thank you for your feedback!");
                e.target.reset();
              } else {
                alert("Something went wrong. Please try again later.");
              }
            } catch (error) {
              console.error("Error submitting feedback:", error);
              alert("Failed to send feedback. Please check your connection or try again later.");
            }
          }}
          className="card shadow-lg border-0 p-4 rounded-4 bg-white"
        >
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-medium">Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Your name"
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-medium">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="col-12">
              <label className="form-label fw-medium">Rating</label>
              <select name="rating" className="form-select" required>
                <option value="">Select rating</option>
                <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
                <option value="4">⭐⭐⭐⭐ Good</option>
                <option value="3">⭐⭐⭐ Average</option>
                <option value="2">⭐⭐ Poor</option>
                <option value="1">⭐ Very Poor</option>
              </select>
            </div>

            <div className="col-12">
              <label className="form-label fw-medium">Message</label>
              <textarea
                name="message"
                rows="4"
                className="form-control"
                placeholder="Write your feedback here..."
                required
              ></textarea>
            </div>

            <div className="col-12 text-center">
              <button type="submit" className="btn btn-primary px-5 py-2 rounded-pill fw-semibold">
                Submit Feedback
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</section>


              {/* Payment Modal */}
            <PaymentChannel
                show={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                onPaymentDone={() => {
                    const savedBooking = JSON.parse(localStorage.getItem("pendingBooking"));
                    alert("Payment successful! Booking details:\n" + JSON.stringify(savedBooking, null, 2));
                    localStorage.removeItem("pendingBooking");
                    setShowPaymentModal(false);

                    // Reset booking form
                    setBooking({
                        fullname: "",
                        gender: "",
                        adults: 1,
                        kids: 0,
                        unitType: "",
                        checkInDate: getToday(),
                        checkInTime: getNowTime(),
                        checkOutDate: getToday(),
                        checkOutTime: getNowTime(),
                        customer: { email: "", contactNumber: "" }
                    });
                }}
                 bookingCode={bookingCode}
                totalAmount={confirmedAmount}
                 downpayment={downpayment}
                 adults={adultCount}
                kids={kidsCount}
                // peopleCost={peopleCost}
            />
        </>
    )
}

export default Homepage