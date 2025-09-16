import React from 'react'

function PaymentFormModal() {
    return (
        <div className="modal fade" id="modal_createEditPayment" tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog modal-md modal-dialog-scrollable" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Add new payment</h5>

                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>

                    <div className="modal-body">
                        <form className='row'>
                            <div className="mb-3">
                                <label className="form-label">Booking ID</label>
                                <input type="text"
                                    className="form-control is_invalid" placeholder="Enter booking ID"
                                    autoFocus />

                                <div className="invalid-feedback">
                                    Error
                                </div>
                            </div>

                            <div className="col-12 mb-3">
                                <label className="form-label">Payment Method</label>
                                <select className="form-select">
                                    <option defaultChecked>Default</option>
                                    <option defaultValue="1">Cash</option>
                                    <option defaultValue="2">GCASH</option>
                                    <option defaultValue="3">Credit Card</option>
                                    <option defaultValue="4">Debit Card</option>
                                </select>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Amount</label>
                                <input type="number"
                                    className="form-control is_invalid" placeholder="Enter amount"
                                    autoFocus />

                                <div className="invalid-feedback">
                                    Error
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

export default PaymentFormModal