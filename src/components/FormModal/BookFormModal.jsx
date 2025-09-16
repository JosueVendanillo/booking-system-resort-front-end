import React from 'react'

function BookFormModal() {
    return (
        <div className="modal fade" id="modal_createEditBook" tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog modal-md modal-dialog-scrollable" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Add new booking</h5>

                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>

                    <div className="modal-body">
                        <form className='row'>
                            <div className="col-12 mb-3">
                                <label className="form-label">Select User</label>
                                <select className="form-select">
                                    <option defaultChecked>Default</option>
                                    <option defaultValue="0">John Doe</option>
                                    <option defaultValue="1">Wick John</option>
                                    <option defaultValue="2">Tupe D</option>
                                    <option defaultValue="3">Cassy G</option>
                                </select>
                            </div>

                            <div className="col-12 mb-3">
                                <label className="form-label">Select Type</label>
                                <select className="form-select">
                                    <option defaultChecked>Default</option>
                                    <option defaultValue="1">Room</option>
                                    <option defaultValue="2">Cottage</option>
                                    <option defaultValue="3">Pool</option>
                                </select>
                            </div>

                            <div className="col-12 mb-3">
                                <label className="form-label">Select Type Name</label>
                                <select className="form-select">
                                    <option defaultChecked>Default</option>
                                    <option defaultValue="1">Deluxe</option>
                                    <option defaultValue="2">King</option>
                                    <option defaultValue="3">Queen</option>
                                </select>
                            </div>

                            <div className='mb-3'>
                                <h5 className='mb-1'>Check In</h5>

                                <div className='row'>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Date</label>
                                        <input className="form-control" type="date" defaultValue="2021-06-18" />
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Time</label>
                                        <input className="form-control" type="time" defaultValue="12:30:00" />
                                    </div>
                                </div>
                            </div>

                            <div className='mb-3'>
                                <h5 className='mb-1'>Check Out</h5>

                                <div className='row'>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Date</label>
                                        <input className="form-control" type="date" defaultValue="2021-06-18" />
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Time</label>
                                        <input className="form-control" type="time" defaultValue="12:30:00" />
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal">Close</button>
                        <button className="btn btn-primary ms-2">
                            <span>Save Changes</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BookFormModal