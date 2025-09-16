import React from 'react'

function CustomerFormModal() {
  return (
    <div className="modal fade" id="modal_createEditCustomer" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-md modal-dialog-scrollable" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add new booking</h5>

            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>

          <div className="modal-body">
            <form>
              <div className="mb-3">
                <label className="form-label">Fullname</label>
                <input type="text"
                  className="form-control is_invalid" placeholder="Enter fullname"
                  autoFocus />

                <div className="invalid-feedback">
                  Error
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input type="email"
                  className="form-control is_invalid" placeholder="Enter email"
                  autoFocus />

                <div className="invalid-feedback">
                  Error
                </div>
              </div>

              <div className="col-12 mb-3">
                <label className="form-label">Select Gender</label>
                <select className="form-select">
                  <option defaultChecked>Default</option>
                  <option defaultValue="0">Male</option>
                  <option defaultValue="1">Female</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Contact</label>
                <input type="text"
                  className="form-control is_invalid" placeholder="Enter contact"
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

export default CustomerFormModal