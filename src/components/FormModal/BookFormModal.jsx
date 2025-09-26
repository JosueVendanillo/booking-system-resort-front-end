import React, { useEffect, useState } from "react";

function BookFormModal({ setBookings, bookings, editingBooking, setEditingBooking }) {

    // Helpers - local formatting instead of UTC
    const formatDate = (date) => date.toLocaleDateString("en-CA"); // YYYY-MM-DD
    const formatTime = (date) => date.toTimeString().slice(0, 5); // HH:mm

    // Format for backend (ISO without milliseconds)
    const formatDateTimeForBackend = (date) => {
    const pad = (n) => n.toString().padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    };


  const getToday = () => formatDate(new Date());
  const getNowTime = () => formatTime(new Date());

    const parseDateTimeLocal = (dateStr, timeStr) => {
    const [y, m, d] = (dateStr || getToday()).split("-").map(Number);
    const [hh, mm] = (timeStr || "00:00").split(":").map(Number);
    return new Date(y, m - 1, d, hh, mm, 0); // seconds = 0
    };


  const getDefaultCheckout = (checkIn) => {
    const co = new Date(checkIn);
    co.setHours(co.getHours() + 1);
    return {
      checkOutDate: formatDate(co),
      checkOutTime: formatTime(co),
    };
  };

  // Form state
  const [formData, setFormData] = useState({
    bookingCode: "",
    fullname: "",
    email: "",
    contactNumber: "",
    adults: 1,
    kids: 0,
    unitType: "",
    checkInDate: getToday(),
    checkInTime: getNowTime(),
    checkOutDate: getToday(),
    checkOutTime: getNowTime(),
  });

  // Update checkout automatically whenever check-in changes
  useEffect(() => {
    const checkIn = parseDateTimeLocal(formData.checkInDate, formData.checkInTime);
    const { checkOutDate, checkOutTime } = getDefaultCheckout(checkIn);
    setFormData((prev) => ({
      ...prev,
      checkOutDate,
      checkOutTime,
    }));
  }, [formData.checkInDate, formData.checkInTime]);

  // Update formData when editingBooking changes
  useEffect(() => {
    if (editingBooking) {
      const checkIn = new Date(editingBooking.checkIn);
      const checkOut = new Date(editingBooking.checkOut);
      setFormData({
        bookingCode: editingBooking.bookingCode || "",
        fullname: editingBooking.fullname || "",
        email: editingBooking.email || editingBooking.customer?.email || "",
        contactNumber: editingBooking.contactNumber || editingBooking.customer?.contactNumber || "",
        adults: editingBooking.adults || 1,
        kids: editingBooking.kids || 0,
        unitType: editingBooking.unitType || "",
        checkInDate: formatDate(checkIn),
        checkInTime: formatTime(checkIn),
        checkOutDate: formatDate(checkOut),
        checkOutTime: formatTime(checkOut),
      });
    } else {
      const checkIn = new Date();
      const { checkOutDate, checkOutTime } = getDefaultCheckout(checkIn);
      setFormData({
        bookingCode: "",
        fullname: "",
        email: "",
        contactNumber: "",
        adults: 1,
        kids: 0,
        unitType: "",
        checkInDate: formatDate(checkIn),
        checkInTime: getNowTime(),
        checkOutDate,
        checkOutTime,
      });
    }
  }, [editingBooking]);



    const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    };



  const resetCheckout = () => {
    const checkIn = parseDateTimeLocal(formData.checkInDate, formData.checkInTime);
    const { checkOutDate, checkOutTime } = getDefaultCheckout(checkIn);
    setFormData((prev) => ({
      ...prev,
      checkOutDate,
      checkOutTime,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const checkIn = parseDateTimeLocal(formData.checkInDate, formData.checkInTime);
    const checkOut = parseDateTimeLocal(formData.checkOutDate, formData.checkOutTime);

    if (checkOut <= checkIn) {
      alert("Check-Out must be after Check-In.");
      return;
    }

    // Check overlapping bookings
    const hasOverlap = bookings.some((b) => {
      if (editingBooking && b.id === editingBooking.id) return false;
      const sameUnit = b.unitType.toLowerCase() === formData.unitType.toLowerCase();
      if (!sameUnit) return false;
      const existingCheckIn = new Date(b.checkIn);
      const existingCheckOut = new Date(b.checkOut);
      return checkIn < existingCheckOut && checkOut > existingCheckIn;
    });

    // if (hasOverlap) {
    //   alert("This booking overlaps with an existing booking for the same unit.");
    //   return;
    // }

    const payload = {
      fullname: formData.fullname,
      adults: Number(formData.adults) || 1,
      kids: Number(formData.kids) || 0,
      unitType: formData.unitType,
      checkIn: formatDateTimeForBackend(checkIn),
      checkOut: formatDateTimeForBackend(checkOut),
      customer: {
        fullname: formData.fullname,
        email: formData.email,
        contactNumber: formData.contactNumber
      }
    };

    try {
      let response;
      if (editingBooking) {
        response = await fetch(`http://localhost:8080/api/bookings/${editingBooking.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        response = await fetch("http://localhost:8080/api/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
      
        const errorData = await response.json().catch(() => ({}));
        console.error("Error response:", errorData);
        // This will show a clean alert
        alert(
          `Error response: ${errorData.error || "Failed to save booking"}`
        );
        return;
      } 
      // throw new Error("Failed to save booking");

      const savedBooking = await response.json();

      if (editingBooking) {
        setBookings(bookings.map((b) => (b.id === editingBooking.id ? savedBooking : b)));
        setEditingBooking(null);
        window.location.reload(); // Refresh page after delete
      } else {
        setBookings([...bookings, savedBooking]);
        window.location.reload(); // Refresh page after add
      }

      const modalElement = document.getElementById("modal_createEditBook");
      const modal = window.bootstrap.Modal.getInstance(modalElement);
      modal.hide();

    } catch (err) {
      console.error(err);
      alert("Error saving booking. Please try again.");
    }
  };


  return (
    <div className="modal fade" id="modal_createEditBook" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-md modal-dialog-scrollable" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{editingBooking ? "Edit Booking" : "Add new booking"}</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>

          <div className="modal-body">
            <form className="row" onSubmit={handleSubmit}>
               {/* Booking Code (read-only, only when editing) */}
              {editingBooking && (
                <div className="col-12 mb-3">
                  <label className="form-label">Booking Code</label>
                  <input
                    className="form-control"
                    name="bookingCode"
                    value={formData.bookingCode}
                    readOnly
                  />
                </div>
              )}

              {/* User Select */}
              <div className="col-12 mb-3">
                <label className="form-label">Select User</label>
                  <input
                    className="form-control"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleChange}
                  />

                {/* <select className="form-select" name="fullname" value={formData.fullname} onChange={handleChange}>
                  <option value="">Select user</option>
                  <option value="John Doe">John Doe</option>
                  <option value="Wick John">Wick John</option>
                  <option value="Tupe D">Tupe D</option>
                  <option value="Cassy G">Cassy G</option>
                </select> */}
              </div>

              {/* Email */}
            <div className="col-6 mb-3">
              <label className="form-label">Email</label>
              <input
                className="form-control"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!!editingBooking} // Disable if editing
              />
                {editingBooking && (
                <small className="text-muted">
                  To update email, go to Customer Management.
                </small>
              )}
            </div>

            {/* Contact */}
          <div className="col-6 mb-3">
            <label className="form-label">Contact Number</label>
            <input
              className="form-control"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              disabled={!!editingBooking} // Disable if editing
            />
              {editingBooking && (
                <small className="text-muted">
                  To update contact number, go to Customer Management.
                </small>
              )}
          </div>

              {/* Adults */}
              <div className="col-6 mb-3">
                <label className="form-label">Adults</label>
                <div className="input-group">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setFormData(prev => ({ ...prev, adults: Math.max(1, (parseInt(prev.adults) || 1) - 1) }))}>-</button>
                  <input type="text" className="form-control text-center" name="adults" value={formData.adults || 1} min={1} max={20} onChange={handleChange} />
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setFormData(prev => ({ ...prev, adults: Math.min(20, (parseInt(prev.adults) || 1) + 1) }))}>+</button>
                </div>
              </div>

              {/* Kids */}
              <div className="col-6 mb-3">
                <label className="form-label">Kids</label>
                <div className="input-group">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setFormData(prev => ({ ...prev, kids: Math.max(0, (parseInt(prev.kids) || 0) - 1) }))}>-</button>
                  <input type="text" className="form-control text-center" name="kids" value={formData.kids || 0} min={1} max={20} onChange={handleChange} />
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setFormData(prev => ({ ...prev, kids: Math.min(20, (parseInt(prev.kids) || 0) + 1) }))}>+</button>
                </div>
              </div>

              {/* Unit Type */}
              <div className="col-12 mb-3">
                <label className="form-label">Select Type</label>
                <select className="form-select" name="unitType" value={formData.unitType} onChange={handleChange}>
                  <option value="" disabled>Select Room</option>
                  <option value="ktv-room">KTV Room</option>
                  <option value="big-cabana">Big Cabana</option>
                  <option value="small-cabana">Small Cabana</option>
                  <option value="brown-table">Brown Table</option>
                  <option value="colored-table">Colored Table</option>
                  <option value="garden-table">Garden Table</option>
                  <option value="couple-room">Couple Room (Private)</option>
                  <option value="family-room">Family Room (Private)</option>
                </select>
              </div>

              {/* Check In */}
              <div className="mb-3">
                <h5 className="mb-1">Check In</h5>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Date</label>
                    <input className="form-control" type="date" name="checkInDate" value={formData.checkInDate} onChange={handleChange} min={getToday()} disabled={!!editingBooking} />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Time</label>
                    <input className="form-control" type="time" name="checkInTime" value={formData.checkInTime} onChange={handleChange} min={
                      !editingBooking && formData.checkInDate === getToday()
                        ? getNowTime()
                        : "00:00"
                    } 
                    disabled={!!editingBooking} // Disable if editing
                    />
                  </div>
                </div>
              </div>

              {/* Check Out */}
              <div className="mb-3">
                <h5 className="mb-1">Check Out</h5>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Date</label>
                    <input className="form-control" type="date" name="checkOutDate" value={formData.checkOutDate} onChange={handleChange} min={formData.checkInDate} />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Time</label>
                    <input className="form-control" type="time" name="checkOutTime" value={formData.checkOutTime} onChange={handleChange} min={formData.checkOutDate === formData.checkInDate ? formData.checkInTime : "00:00"} />
                  </div>
                </div>
                <button type="button" className="btn btn-sm btn-warning" onClick={resetCheckout}>
                  Reset Checkout (Current Date & Time)
                </button>
              </div>

              {/* Footer */}
              <div className="modal-footer">
                <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal">Close</button>
                <button type="submit" className="btn btn-primary ms-2">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookFormModal;
