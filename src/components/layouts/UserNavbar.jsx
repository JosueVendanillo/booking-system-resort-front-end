import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

function UserNavbar() {
    const [activeSection, setActiveSection] = useState('');

    useEffect(() => {
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.6 }
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

    return (
         <nav className="navbar navbar-expand-xl bg-white shadow sticky-top">
            <div className="container-xxl">
                <NavLink to="/" className="navbar-brand">
                    <img src="/assets/img/projectImgs/logo.png" alt="Logo" style={{ height: '45px', width: '150px' }} />
                </NavLink>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse justify-content-end h-100" id="navbarNav">
                    <ul className="navbar-nav align-items-center h-100">
                        <li className={`nav-item ${activeSection === 'hero' ? 'active border-bottom border-4 border-primary fw-bold text-black' : ''}`}>
                            <a href="/#hero" className="nav-link px-3">Home</a>
                        </li>
                        <li className={`nav-item ${activeSection === 'about' ? 'active border-bottom border-4 border-primary fw-bold text-black' : ''}`}>
                            <a href="/#about" className="nav-link px-3">About</a>
                        </li>
                        <li className={`nav-item ${activeSection === 'amenities' ? 'active border-bottom border-4 border-primary fw-bold' : ''}`}>
                            <a href="/#amenities" className="nav-link px-3">Amenities</a>
                        </li>
                        <li className={`nav-item ${activeSection === 'gallery' ? 'active border-bottom border-4 border-primary fw-bold' : ''}`}>
                            <a href="/#gallery" className="nav-link px-3">Gallery</a>
                        </li>
                        <li className={`nav-item ${activeSection === 'footer' || activeSection === 'booking-cta' ? 'active border-bottom border-4 border-primary fw-bold' : ''}`}>
                            <a href="/#footer" className="nav-link px-3">Contact</a>
                        </li>
                        <li>
                            <NavLink to="/login" className="btn btn-primary ms-xl-3">Book Now</NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default UserNavbar;
