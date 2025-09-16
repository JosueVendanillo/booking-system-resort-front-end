import React from 'react'
import { NavLink } from 'react-router-dom'
import PaymentFormModal from '../../components/FormModal/PaymentFormModal'

function PaymentManagement() {
    return (
        <>
            <div className='container-xxl flex-grow-1 container-p-y'>
                <div className="card">
                    <div className="card-header d-flex justify-content-between">
                        <h5>Payment List</h5>

                        <div className="d-flex flex-row">
                            <input className="form-control me-3" type="text" placeholder="Search..." />
                            <button className='btn btn-primary text-nowrap' data-bs-toggle="modal" data-bs-target="#modal_createEditPayment">+ New Record</button>
                        </div>
                    </div>

                    <div className="table-responsive text-nowrap">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>Booking ID</th>
                                    <th className="text-center">Amount</th>
                                    <th className="text-center">Payment Method</th>
                                    <th className="text-center">Date</th>
                                    <th className="text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="table-border-bottom-0">
                                <tr>
                                    <td>PY-434AVS</td>
                                    <td className="text-center">P2300.00</td>
                                    <td className="text-center">Cash</td>
                                    <td className="text-center">4/23/2049 <br /> 5:00 PM</td>
                                    <td className="text-center flex items-center justify-center">
                                        <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modal_createEditPayment">
                                            <i className="bx bx-edit-alt me-1"></i>
                                            Edit
                                        </button>
                                    </td>
                                </tr>

                                {/* <tr className="text-bg-secondary">
                                <td colSpan="6" className="text-center">
                                    <div className="alert alert-dark mb-0" role="alert">There are no record available</div>
                                </td>
                            </tr>

                            <tr>
                                <td colSpan="6"></td>    
                            </tr> */}
                            </tbody>
                        </table>
                    </div>

                    <div id="pagination">
                        <div className="demo-inline-spacing d-flex justify-content-center align-items-center pe-3 justify-content-md-end">
                            {/* Pagination */}
                        </div>
                    </div>
                </div >
            </div>

            <PaymentFormModal />
        </>
    )
}

export default PaymentManagement