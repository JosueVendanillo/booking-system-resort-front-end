import React from 'react'
import { NavLink } from 'react-router-dom'
import BookFormModal from '../../components/FormModal/BookFormModal'

function BookManagement() {
    return (
        <>
            <div className='container-xxl flex-grow-1 container-p-y'>
                <div className="card">
                    <div className="card-header d-flex justify-content-between">
                        <h5>Booking List</h5>

                        <div className="d-flex flex-row">
                            <input className="form-control me-3" type="text" placeholder="Search..." />
                            <button className='btn btn-primary text-nowrap' data-bs-toggle="modal" data-bs-target="#modal_createEditBook">+ New Record</button>
                        </div>
                    </div>

                    <div className="table-responsive text-nowrap">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>Fullname</th>
                                    <th className="text-center">Type</th>
                                    <th className="text-center">Type Name</th>
                                    <th className="text-center">Check In</th>
                                    <th className="text-center">Check Out</th>
                                    <th className="text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="table-border-bottom-0">
                                <tr>
                                    <td>John Doe</td>
                                    <td className="text-center">Room</td>
                                    <td className="text-center">Deluxe</td>
                                    <td className="text-center">4/23/2023 <br /> 5:00 PM</td>
                                    <td className="text-center">4/25/2023 <br /> 5:00 PM</td>
                                    <td className="text-center flex items-center justify-center">
                                        <button type="button" className="btn btn-danger me-2">
                                            <i className="bx bx-trash me-1"></i>
                                            Delete
                                        </button>

                                        <button type="button" className="btn btn-primary">
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

            <BookFormModal />
        </>
    )
}

export default BookManagement