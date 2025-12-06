import React from 'react'

import { Outlet } from 'react-router-dom'
import ReceptionistNavbar from '../components/layouts/Receptionist/ReceptionistNavbar'
import ReceptionistSidebar from '../components/layouts/Receptionist/ReceptionistSidebar'
function ReceptionistLayout() {
  return (
    <div className="layout-wrapper layout-content-navbar">
        <div className="layout-container">
            <ReceptionistNavbar />

            <div className="layout-page">
                <ReceptionistSidebar />

                <div className="content-wrapper">
                    <Outlet />

                    <div className="content-backdrop fade"></div>
                </div>
            </div>
        </div>

        <div className="layout-overlay layout-menu-toggle"></div>
    </div>
  )
}

export default AdminLayout