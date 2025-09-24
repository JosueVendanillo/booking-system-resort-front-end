import React, { useState, useEffect } from 'react'
import axios from 'axios'

function PaymentFormModal({ fetchPayments, editingPayment, setEditingPayment }) {
  const [bookingId, setBookingId] = useState("")
  const [amount, setAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [error, setError] = useState("")
  const [bookingAmount, setBookingAmount] = useState("")

  // Pre-fill form if editing
  useEffect(() => {
    if (editingPayment) {
      setBookingId(editingPayment.bookingCode || "")
      setAmount(editingPayment.amount || "")
      setPaymentMethod(editingPayment.paymentMethod || "")
    } else {
      // reset when adding new
      setBookingId("")
      setAmount("")
      setPaymentMethod("")
      setBookingAmount("")
      setError("")
    }
  }, [editingPayment])

  // Fetch booking details
  const fetchBooking = async () => {
    try {
      setError("")
      if (!bookingId) return

      const response = await axios.get(`http://localhost:8080/api/bookings/code/${bookingId}`)
      const booking = response.data

      if (booking && booking.totalAmount) {
        setBookingAmount(booking.totalAmount)
      } else {
        setBookingAmount("")
        setError("Booking not found or no amount available.")
      }
    } catch (err) {
      console.error(" Error fetching booking:", err.response ? err.response.data : err.message)
      setBookingAmount("")
      setError("Booking not found.")
    }
  }

  const handleSave = async () => {
    if (!bookingId || !paymentMethod || !amount) {
      alert("Please fill in all fields.")
      return
    }

    if (parseFloat(amount) !== parseFloat(bookingAmount)) {
      alert("The entered amount does not match the required total.")
      return
    }

    try {
      const payload = {
        bookingCode: bookingId,
        amount,
        paymentMethod,
        paymentDate: new Date().toISOString()
      }

      let response
      if (editingPayment) {
        // 🔹 Update existing payment
        response = await axios.put(
          `http://localhost:8080/api/payments/${editingPayment.id}`,
          payload
        )
        alert("Payment updated successfully!")
      } else {
        // 🔹 Create new payment
        response = await axios.post("http://localhost:8080/api/payments", payload)
        alert("Payment recorded successfully!")
      }

      console.log("Payment response:", response.data)

      fetchPayments()
      setEditingPayment(null)
    } catch (err) {
      console.error(" Error saving payment:", err.response ? err.response.data : err.message)
      alert("Failed to save payment.")
    }
  }

  return (
    <div className="modal fade" id="modal_createEditPayment" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-md modal-dialog-scrollable" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {editingPayment ? "View Payment" : "Add New Payment"}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={() => setEditingPayment(null)}
            ></button>
          </div>

          <div className="modal-body">
            <form className="row">
              {/* Booking Code */}
              <div className="mb-3">
                <label className="form-label">Booking Code</label>
                <input
                  type="text"
                  value={bookingId}
                  onChange={(e) => setBookingId(e.target.value)}
                  onBlur={fetchBooking}
                  className={`form-control ${error ? "is-invalid" : ""}`}
                  placeholder="Enter booking code"
                  autoFocus
                  disabled={!!editingPayment}  
                />
                {error && <div className="invalid-feedback">{error}</div>}
              </div>

              {/* Payment Method */}
              <div className="col-12 mb-3">
                <label className="form-label">Payment Method</label>
                <select
                  className="form-select"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  disabled={!!editingPayment}  
                >
                  <option value="">Select method</option>
                  <option value="Cash">Cash</option>
                  <option value="GCASH">GCASH</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                </select>
              </div>

              {/* Amount */}
              <div className="mb-3">
                <label className="form-label">Amount</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className={`form-control`}
                  placeholder={bookingAmount ? `Must equal ${bookingAmount}` : "Enter amount"}
                  disabled={!!editingPayment}  
                />
              </div>
            </form>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline-secondary"
              data-bs-dismiss="modal"
              onClick={() => setEditingPayment(null)}
            >
              Close
            </button>
            {!editingPayment && (
              <button type="button" onClick={handleSave} className="btn btn-primary ms-2">
                Save Payment
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentFormModal
