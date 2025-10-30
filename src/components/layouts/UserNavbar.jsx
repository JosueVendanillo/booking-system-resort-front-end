import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { getUser, getUserRole } from '../../utils/auth';
import Homepage from '../../pages/user/Homepage';

function UserNavbar() {
    const [activeSection, setActiveSection] = useState('');
    const [user, setUser] = useState(null);
    const [userRole, setRole] = useState(null);



  // ✅ Load user initially and whenever login/logout occurs
  useEffect(() => {
    const loadUser = () => {
      const loggedUser = getUser();
      const role = getUserRole();

      if (loggedUser) {
        setUser(loggedUser);
        setRole(role);
      } else {
        setUser(null);
        setRole('GUEST');
      }
    };

    // Initial load
    loadUser();

    // Listen for both localStorage (other tabs) and custom userChange events (same tab)
    window.addEventListener('storage', loadUser);
    window.addEventListener('userChange', loadUser);

    return () => {
      window.removeEventListener('storage', loadUser);
      window.removeEventListener('userChange', loadUser);
    };
  }, []);

  // ✅ Observe active section (unchanged)
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

  // ✅ Logout handler
  const handleLogout = () => {
    setUser(null);
    setRole('GUEST');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    window.dispatchEvent(new Event('userChange')); // 🔥 notify all listeners
    window.location.href = '/login';
  };


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
                            {/* <NavLink to="/#booking-cta" className="btn btn-primary ms-xl-3">Book Now</NavLink> */}
                            <a className="btn btn-primary ms-xl-3" href="">Book Now</a>
                        </li>
  
                    </ul>
                                        {/* ✅ Only show this dropdown if user is logged in */}
          {user ? (
            <div className="nav-item navbar-dropdown dropdown-user dropdown">
              <a
                className="nav-link dropdown-toggle hide-arrow hstack g-5"
                href="javascript:void(0);"
                data-bs-toggle="dropdown"
              >
                <span className="mx-3">|</span>
                <span>{user?.fullName || user?.email}</span>
              </a>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <a className="dropdown-item" href="#">
                    <div className="d-flex">
                      <div className="flex-shrink-0 me-3">|</div>
                      <div className="flex-grow-1">
                        <span className="fw-semibold d-block">
                          {user?.fullName || user?.email}
                        </span>
                        <small className="text-muted">{userRole}</small>
                      </div>
                    </div>
                  </a>
                </li>
                <li>
                  <div className="dropdown-divider"></div>
                </li>
                <li>
                  <button onClick={handleLogout} className="dropdown-item">
                    <i className="bx bx-power-off me-2"></i>
                    <span className="align-middle">Log Out</span>
                  </button>
                </li>
              </ul>
            </div>
          ) : null}
                </div>
            </div>
        </nav>
    );
}

export default UserNavbar;
