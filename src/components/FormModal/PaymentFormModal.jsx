import React, { useState, useEffect } from 'react'
import axios from 'axios'

function PaymentFormModal({ fetchPayments, editingPayment, setEditingPayment }) {
  const [bookingId, setBookingId] = useState("")
  const [amount, setAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [error, setError] = useState("")
  const [bookingAmount, setBookingAmount] = useState(0)
  const [alreadyPaid, setAlreadyPaid] = useState(0)
  const [remainingBalance, setRemainingBalance] = useState(0)

  // 🔹 On mount/edit
  useEffect(() => {
    console.log("🔄 useEffect triggered | editingPayment:", editingPayment)
    if (editingPayment) {
      setBookingId(editingPayment.bookingCode || "")
      setAmount(editingPayment.amount || "")
      setPaymentMethod(editingPayment.paymentMethod || "")
      setRemainingBalance(editingPayment.remainingBalance || 0)

      console.log("📝 Loaded editing payment:", {
        bookingId: editingPayment.bookingCode,
        amount: editingPayment.amount,
        paymentMethod: editingPayment.paymentMethod,
        remainingBalance: editingPayment.remainingBalance
      })
    } else {
      setBookingId("")
      setAmount("")
      setPaymentMethod("")
      setBookingAmount(0)
      setAlreadyPaid(0)
      setRemainingBalance(0)
      setError("")
      console.log("✨ Reset state for new payment")
    }
  }, [editingPayment])

  // 🔹 Fetch booking info
  const fetchBooking = async () => {
    try {
      setError("")
      if (!bookingId) return

      console.log("📡 Fetching booking for:", bookingId)

      const bookingRes = await axios.get(`http://localhost:8080/api/bookings/code/${bookingId}`)
      const booking = bookingRes.data
      console.log("✅ Booking response:", booking)

      if (booking && booking.totalAmount) {
        setBookingAmount(booking.totalAmount)

        const paymentsRes = await axios.get(`http://localhost:8080/api/payments/booking/${bookingId}`)
        console.log("📡 Payments response:", paymentsRes.data)

        const totalPaid = paymentsRes.data.reduce((sum, p) => sum + parseFloat(p.amount), 0)
        setAlreadyPaid(totalPaid)

        const lastPayment = paymentsRes.data[paymentsRes.data.length - 1]
        if (lastPayment?.remainingBalance !== undefined) {
          setRemainingBalance(lastPayment.remainingBalance)
        } else {
          setRemainingBalance(booking.totalAmount - totalPaid)
        }

        if (totalPaid === 0) {
          const downPayment = (booking.totalAmount * 0.3).toFixed(2)
          setAmount(downPayment)
          console.log("💰 First payment, auto-setting downpayment:", downPayment)
        } else {
          setAmount("")
        }
      } else {
        console.warn("⚠️ Booking not found or no amount available")
        setBookingAmount(0)
        setAlreadyPaid(0)
        setRemainingBalance(0)
        setError("Booking not found or no amount available.")
      }
    } catch (err) {
      console.error("❌ Error fetching booking:", err.response?.data || err.message)
      setBookingAmount(0)
      setAlreadyPaid(0)
      setRemainingBalance(0)
      setError("Booking not found.")
    }
  }

  // 🔹 Save new payment
  const handleSave = async () => {
    console.log("💾 handleSave called with:", { bookingId, paymentMethod, amount })

    if (!bookingId || !paymentMethod || !amount) {
      alert("Please fill in all fields.")
      return
    }

    const paidAmount = parseFloat(amount)
    if (paidAmount <= 0) {
      alert("Amount must be greater than 0.")
      return
    }

    try {
      const payload = {
        bookingCode: bookingId,
        amount: paidAmount,
        paymentMethod,
        paymentDate: new Date().toISOString()
      }
      console.log("📤 Saving payment payload:", payload)

      if (editingPayment) {
        await axios.put(`http://localhost:8080/api/payments/${editingPayment.id}`, payload)
        alert("Payment updated successfully!")
      } else {
        const res = await axios.post("http://localhost:8080/api/payments", payload)
        console.log("✅ Payment created response:", res.data)
        setRemainingBalance(res.data.remainingBalance || (bookingAmount - (alreadyPaid + paidAmount)))
        alert("Payment recorded successfully!")
      }

      fetchPayments()
      setEditingPayment(null)
      window.location.reload()
    } catch (err) {
      console.error("❌ Error saving payment:", err.response?.data || err.message)
      alert(err.response?.data?.message || "Failed to save payment.")
    }
  }

  // 🔹 Complete remaining payment
  const handlePayRemaining = async () => {
    console.log("💳 handlePayRemaining called with:", { bookingId, paymentMethod, remainingBalance })

    if (!paymentMethod) {
      alert("Please select a payment method to complete remaining payment.")
      return
    }

    try {
      const payload = {
        paymentMethod,
        remainingAmount: remainingBalance
      }
      console.log("📤 Completing payment payload:", payload)

      const res = await axios.post(`http://localhost:8080/api/payments/complete/${bookingId}?paymentMethod=${paymentMethod}`, payload)
      console.log("✅ Complete payment response:", res.data)

      setRemainingBalance(res.data.remainingBalance || 0)
      alert("Remaining payment completed successfully!")
      fetchPayments()
      setEditingPayment(null)
      window.location.reload()
    } catch (err) {
      console.error("❌ Error completing payment:", err.response?.data || err.message)
      alert(err.response?.data?.message || "Failed to complete remaining payment.")
    }
  }

  return (
    <div className="modal fade" id="modal_createEditPayment" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-md modal-dialog-scrollable" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{editingPayment ? "Edit Payment" : "Add New Payment"}</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"
              onClick={() => setEditingPayment(null)}></button>
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

              {/* Booking Info */}
              {bookingAmount > 0 && (
                <div className="alert alert-info">
                  <p className="mb-1">Booking Total: ₱{bookingAmount.toFixed(2)}</p>
                  <p className="mb-1">Already Paid: ₱{alreadyPaid.toFixed(2)}</p>
                  <p className="mb-1 fw-bold">Remaining Balance: ₱{remainingBalance.toFixed(2)}</p>
                  {alreadyPaid === 0 && <p className="mb-0 text-danger fw-bold">Required Downpayment: ₱{(bookingAmount * 0.3).toFixed(2)}</p>}
                </div>
              )}

              {/* Payment Method */}
              <div className="col-12 mb-3">
                <label className="form-label">Payment Method</label>
                <select
                  className="form-select"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
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
                <label className="form-label">{editingPayment ? "Amount Paid" : "Amount"}</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="form-control"
                  placeholder={bookingAmount ? `Enter amount (Remaining ₱${remainingBalance.toFixed(2)})` : "Enter amount"}
                  disabled={!!editingPayment}
                />
              </div>

              {/* Remaining Balance (only when editing) */}
              {editingPayment && (
                <div className="mb-3">
                  <label className="form-label">Remaining Balance</label>
                  <input
                    type="number"
                    value={remainingBalance}
                    onChange={(e) => setRemainingBalance(e.target.value)}
                    className="form-control"
                    disabled
                  />
                </div>
              )}
            </form>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal"
              onClick={() => setEditingPayment(null)}>Close</button>

            {!editingPayment && (
              <button type="button" onClick={handleSave} className="btn btn-primary ms-2">Save Payment</button>
            )}

            {editingPayment && remainingBalance > 0 &&(
              <button type="button" onClick={handlePayRemaining} className="btn btn-success ms-2">Pay Remaining</button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentFormModal
