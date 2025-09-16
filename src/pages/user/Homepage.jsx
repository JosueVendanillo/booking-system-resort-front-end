import React from 'react'
import { Link, NavLink } from 'react-router-dom'
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

function Homepage() {
    

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
                                    <form className="row g-3">
                                        <div className="col-12">
                                            <label htmlFor="checkin" className="form-label fw-medium">Fullname</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                required
                                            />
                                        </div>

                                        <div className="col-md-6">
                                            <label htmlFor="checkin" className="form-label fw-medium">Email</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                required
                                            />
                                        </div>

                                        <div className="col-md-6">
                                            <label htmlFor="checkin" className="form-label fw-medium">Contact Number</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                required
                                            />
                                        </div>

                                        <div className="col-md-6">
                                            <label htmlFor="checkin" className="form-label fw-medium">Check-in Date</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                id="checkin"
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="checkout" className="form-label fw-medium">Check-out Date</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                id="checkout"
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="guests" className="form-label fw-medium">Adult</label>
                                            <select className="form-select" id="guests" required>
                                                <option value="" disabled selected>Select Adult</option>
                                                <option value="1">1 Adult</option>
                                                <option value="2">2 Adults</option>
                                                <option value="3">3 Adults</option>
                                                <option value="4">4 Adults</option>
                                            </select>
                                            </div>
                                        <div className="col-md-6">
                                            <label htmlFor="guests" className="form-label fw-medium">Kids</label>
                                            <select className="form-select" id="guests">
                                                <option value="" disabled selected>Select Kids</option>
                                                <option value="1">1 Kid</option>
                                                <option value="2">2 Kids</option>
                                                <option value="3">3 Kids</option>
                                                <option value="4">4 Kids</option>
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="room" className="form-label fw-medium">Room Type</label>
                                            <select className="form-select" id="room" required>
                                                <option value="" disabled selected>Select Room</option>
                                                <option value="standard">KTV Room</option>
                                                <option value="deluxe">Big Cabana</option>
                                                <option value="suite">Small Cabana</option>
                                                <option value="suite">Brown Table</option>
                                                <option value="suite">Colored Table</option>
                                                <option value="suite">Garden Table</option>
                                                <option value="suite">Couple Room (For Private) </option>
                                                <option value="suite">Family Room (For Private) </option>
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
                                               <td>Family Room</td>
                                               <td>6-8 pax</td>
                                               <td>5,500</td>
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
        </>
    )
}

export default Homepage