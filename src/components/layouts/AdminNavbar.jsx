import React, { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom';
import { getUser, getUserRole } from '../../utils/auth';

function AdminNavbar() {

//user session
     const [user, setUser] = useState(null);
     const [userRole, setRole] = useState(null);
    
      useEffect(() => {
        const loggedUser = getUser();
        if (loggedUser) {
          setUser(loggedUser);
        }


 const userRole = getUserRole();
    if (userRole) {
      setRole(userRole);
    } else {
      setRole("GUEST");
    }
      }, []);


    const location = useLocation();

    

    const titleMap = {
        '/admin': 'Dashboard',
        '/admin/account': 'Account Management',
        '/admin/amenity': 'Amenities Management',
        '/admin/book': 'Booking Management',
        '/admin/customer': 'Customers Management',
        '/admin/payment': 'Payment Management',
        '/admin/room': 'Room Management',
    };

    const currentTitle = titleMap[location.pathname] || 'Admin Panel';

    return (
        <nav className="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme"id="layout-navbar">
            <div className="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0 d-xl-none">
                <a className="nav-item nav-link px-0 me-xl-4" href="javascript:void(0)">
                    <i className="bx bx-menu bx-sm"></i>
                </a>
            </div>

            <div className="navbar-nav-right d-flex align-items-center" id="navbar-collapse">
                <div className='d-flex justify-between align-middle w-100'>
                    <h4 className='mb-0 mt-2 w-100'>{currentTitle}</h4>

                    <div className="nav-item navbar-dropdown dropdown-user dropdown">
                        <a className="nav-link dropdown-toggle hide-arrow hstack g-5" href="javascript:void(0);"
                            data-bs-toggle="dropdown">
                            <span className="mx-3">|</span>

                            <span>{user?. fullName ||user?. email || "Guest"}</span>
                        </a>
                        <ul className="dropdown-menu dropdown-menu-end">
                            <li>
                                <a className="dropdown-item" href="#">
                                    <div className="d-flex">
                                        <div className="flex-shrink-0 me-3">
                                            |
                                        </div>
                                        <div className="flex-grow-1">
                                            <span
                                                className="fw-semibold d-block">{user?. fullName ||user?. email || "Guest"}</span>
                                            <small className="text-muted">{userRole}</small>
                                        </div>
                                    </div>
                                </a>
                            </li>
                            <li>
                                <div className="dropdown-divider"></div>
                            </li>

                            <li>
                                <NavLink to="/login" className="dropdown-item">
                                    <i className="bx bx-power-off me-2"></i>
                                    <span className="align-middle">Log Out</span>
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default AdminNavbar