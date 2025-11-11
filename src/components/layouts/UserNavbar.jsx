import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { getUser, getUserRole, clearUser } from "../../utils/auth";

function UserNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState("");
  const [user, setUser] = useState(getUser());
  const [userRole, setRole] = useState(getUserRole() || "GUEST");

  useEffect(() => {
    const handleUserChange = () => {
      const loggedUser = getUser();
      const role = getUserRole();
      if (loggedUser) {
        setUser(loggedUser);
        setRole(role);
      } else {
        setUser(null);
        setRole("GUEST");
      }
    };
    window.addEventListener("userChange", handleUserChange);
    window.addEventListener("storage", handleUserChange);
    return () => {
      window.removeEventListener("userChange", handleUserChange);
      window.removeEventListener("storage", handleUserChange);
    };
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll("section");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.6 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [location]); // re-run on route change

  const handleLogout = () => {
    clearUser();
    window.dispatchEvent(new Event("userChange"));
    navigate("/login");
  };

  const scrollToSection = (id) => {
    if (location.pathname !== "/") {
      navigate("/"); // go to homepage first
      setTimeout(() => {
        const section = document.getElementById(id);
        if (section) section.scrollIntoView({ behavior: "smooth" });
      }, 100); // small delay to wait for DOM
    } else {
      const section = document.getElementById(id);
      if (section) section.scrollIntoView({ behavior: "smooth" });
    }

    // close mobile collapse
    const navbarCollapse = document.getElementById("navbarNav");
    if (navbarCollapse && navbarCollapse.classList.contains("show")) {
      navbarCollapse.classList.remove("show");
    }
  };

  return (
    <nav className="navbar navbar-expand-xl bg-white shadow sticky-top">
      <div className="container-xxl">
        <NavLink to="/" className="navbar-brand">
          <img
            src="/assets/img/projectImgs/logo.png"
            alt="Logo"
            style={{ height: "45px", width: "150px" }}
          />
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end h-100" id="navbarNav">
          <ul className="navbar-nav align-items-center h-100">
            {["hero", "about", "amenities", "gallery", "footer"].map((section) => (
              <li
                key={section}
                className={`nav-item ${
                  activeSection === section
                    ? "active border-bottom border-4 border-primary fw-bold text-black"
                    : ""
                }`}
              >
                <button
                  type="button"
                  className="nav-link px-3 btn btn-link border-0"
                  onClick={() => scrollToSection(section)}
                >
                  {section === "hero"
                    ? "Home"
                    : section.charAt(0).toUpperCase() + section.slice(1)}
                </button>
              </li>
            ))}
            <li>
              <button
                type="button"
                className="btn btn-primary ms-xl-3"
                onClick={() => {
                  if (!user) navigate("/login");
                  else scrollToSection("booking-cta");
                }}
              >
                Book Now
              </button>
            </li>
          </ul>

          {user && (
            <div className="nav-item dropdown ms-3">
              <button
                type="button"
                className="btn btn-link nav-link dropdown-toggle"
                id="userDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <span className="mx-3">|</span>
                {user?.fullName || user?.email}
              </button>

              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                <li>
                  <div className="dropdown-item">
                    <div className="d-flex">
                      <div className="flex-shrink-0 me-3">|</div>
                      <div className="flex-grow-1">
                        <span className="fw-semibold d-block">
                          {user?.fullName || user?.email}
                        </span>
                        <small className="text-muted">{userRole}</small>
                      </div>
                    </div>
                  </div>
                </li>
                <li><div className="dropdown-divider"></div></li>
                <li>
                  <button onClick={handleLogout} className="dropdown-item">
                    <i className="bx bx-power-off me-2"></i> Log Out
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default UserNavbar;
