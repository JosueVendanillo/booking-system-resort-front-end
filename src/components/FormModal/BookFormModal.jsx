import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

/**
 * BookFormModal (Option A)
 * - DatePicker on both check-in and check-out
 * - Disables booked dates for the selected unitType using /api/bookings/booked-dates
 * - Room: check-in >= 14:00, auto check-out = +22 hours (read-only)
 * - Table: leisureTime chooses times (Day/Night)
 * - Capacity checks + confirm when switching unit types
 */

function BookFormModal({ setBookings, bookings, editingBooking, setEditingBooking }) {
  // Helpers
  const formatDate = (date) => date.toLocaleDateString("en-CA"); // YYYY-MM-DD
  const formatTime = (date) => date.toTimeString().slice(0, 5); // HH:mm
  const toISODate = (date) => date.toISOString().split("T")[0]; // YYYY-MM-DD

  const formatDateTimeForBackend = (date) => {
    const pad = (n) => n.toString().padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  };

  const getTodayISO = () => toISODate(new Date());
  const nowTime = () => new Date().toTimeString().slice(0, 5);

  const parseDateTimeLocal = (dateStr, timeStr) => {
    const [y, m, d] = (dateStr || getTodayISO()).split("-").map(Number);
    const [hh, mm] = (timeStr || "00:00").split(":").map(Number);
    return new Date(y, m - 1, d, hh, mm, 0);
  };

  const dayStart = (date) => { const d = new Date(date); d.setHours(0,0,0,0); return d; };
  const dayEnd = (date) => { const d = new Date(date); d.setHours(23,59,59,999); return d; };

  // default 22 hour checkout
  const getCheckoutFrom = (checkInDateStr, checkInTimeStr) => {
    const ci = parseDateTimeLocal(checkInDateStr, checkInTimeStr);
    const out = new Date(ci.getTime() + 22 * 60 * 60 * 1000);
    return { date: toISODate(out), time: formatTime(out) };
  };

  // state
  const [roomAvailability, setRoomAvailability] = useState({});
  const [customers, setCustomers] = useState([]);
  const [roomCapacities, setRoomCapacities] = useState({});
  const [bookedDates, setBookedDates] = useState([]); // bookings for selected unitType
  const didInit = useRef(false);

  const [formData, setFormData] = useState({
    bookingCode: "",
    fullname: "",
    email: "",
    contactNumber: "",
    adults: 1,
    kids: 0,
    unitType: "",
    checkInDate: getTodayISO(),
    checkInTime: "14:00",
    checkOutDate: getTodayISO(),
    checkOutTime: "12:00",
    totalAmount: 0,
    leisureTime: "",
    addOns: "",
  });

  // fetch supporting data
  useEffect(() => {
    axios.get("http://localhost:8080/api/customers")
      .then(r => setCustomers(r.data || []))
      .catch(() => setCustomers([]));
  }, []);

  useEffect(() => {
    axios.get("http://localhost:8080/api/rooms/room-capacities")
      .then(r => setRoomCapacities(Object.fromEntries(r.data || [])))
      .catch(e => { console.error("cap fetch err", e); setRoomCapacities({}); });
  }, []);

  useEffect(() => {
    fetch("http://localhost:8080/api/rooms/room-availability")
      .then(r => r.ok ? r.json() : Promise.reject("fail"))
      .then(data => {
        const map = {};
        data.forEach(([type, total, available]) => (map[type] = Number(available)));
        setRoomAvailability(map);
      })
      .catch(err => { console.error("availability fetch err", err); setRoomAvailability({}); });
  }, []);

  // fetch booked-dates when unitType changes (or when editingBooking's unitType is set)
  useEffect(() => {
    const unit = formData.unitType;
    if (!unit) { setBookedDates([]); return; }
    axios.get("http://localhost:8080/api/bookings/booked-dates", { params: { unitType: unit } })
      .then(res => setBookedDates(res.data || []))
      .catch(err => { console.error("booked-dates fetch err", err); setBookedDates([]); });
  }, [formData.unitType]);

  // helper: if booked entry belongs to the booking being edited, skip it
  const isSameBooking = (b) => editingBooking && b.id === editingBooking.id;

  // date blocking: returns true if date is blocked
  const isDateBlocked = (date) => {
    if (!bookedDates || bookedDates.length === 0) return false;
    const s = dayStart(date), e = dayEnd(date);
    return bookedDates.some(b => {
      if (isSameBooking(b)) return false; // allow editing booking's current dates
      const bS = new Date(b.checkIn);
      const bE = new Date(b.checkOut);
      return !(bE < s || bS > e);
    });
  };

  // table booked check for entire day (helper)
  const isTableBooked = (date) => {
    if (!isTableType(formData.unitType) || !date) return false;
    const s = dayStart(date), e = dayEnd(date);
    return bookedDates.some(b => {
      if (isSameBooking(b)) return false;
      const bS = new Date(b.checkIn), bE = new Date(b.checkOut);
      return !(bE < s || bS > e);
    });
  };

  // apply times for tables based on leisureTime
  const applyTableTimes = (isoDateStr, leisure) => {
    if (!isoDateStr) return;
    const [y, m, d] = isoDateStr.split("-").map(Number);
    if (leisure === "DAY") {
      const ci = new Date(y, m - 1, d, 8, 0, 0);
      const co = new Date(y, m - 1, d, 17, 0, 0);
      setFormData(prev => ({ ...prev, checkInDate: toISODate(ci), checkInTime: formatTime(ci), checkOutDate: toISODate(co), checkOutTime: formatTime(co) }));
    } else if (leisure === "NIGHT") {
      const ci = new Date(y, m - 1, d, 19, 0, 0);
      const next = new Date(y, m - 1, d + 1); next.setHours(4, 0, 0, 0);
      setFormData(prev => ({ ...prev, checkInDate: toISODate(ci), checkInTime: formatTime(ci), checkOutDate: toISODate(next), checkOutTime: formatTime(next) }));
    }
  };

  // hydrate form when editingBooking changes
  useEffect(() => {
    if (editingBooking) {
      const checkIn = new Date(editingBooking.checkIn);
      const checkOut = new Date(editingBooking.checkOut);

      // try to match customer
      let matchedCustomer = null;
      const bookingCustomerId = editingBooking?.customer?.id ?? editingBooking?.customerId ?? editingBooking?.customer_id;
      if (bookingCustomerId != null) matchedCustomer = customers.find(c => Number(c.id) === Number(bookingCustomerId));
      if (!matchedCustomer && (editingBooking?.customer?.email || editingBooking?.email)) {
        const targetEmail = (editingBooking.customer?.email || editingBooking.email || "").toString().toLowerCase();
        matchedCustomer = customers.find(c => c.email && c.email.toLowerCase() === targetEmail);
      }
      if (!matchedCustomer && editingBooking?.fullname) {
        const targetName = editingBooking.fullname.toString().toLowerCase();
        matchedCustomer = customers.find(c => c.fullname && c.fullname.toLowerCase() === targetName);
      }
      const emailVal = matchedCustomer?.email ?? editingBooking.customer?.email ?? editingBooking.email ?? "";
      const contactVal = matchedCustomer?.contactNumber ?? editingBooking.customer?.contactNumber ?? editingBooking.contactNumber ?? "";

      setFormData({
        bookingCode: editingBooking.bookingCode || "",
        fullname: editingBooking.fullname || "",
        email: emailVal,
        contactNumber: contactVal,
        adults: editingBooking.adults || 1,
        kids: editingBooking.kids || 0,
        unitType: editingBooking.unitType || "",
        checkInDate: toISODate(checkIn),
        checkInTime: formatTime(checkIn),
        checkOutDate: toISODate(checkOut),
        checkOutTime: formatTime(checkOut),
        totalAmount: editingBooking.totalAmount ?? 0,
        leisureTime: editingBooking.leisureTime || "",
        addOns: editingBooking.addOns || ""
      });
    } else {
      // new booking defaults
      const now = new Date();
      const { date: coDate, time: coTime } = getCheckoutFrom(toISODate(now), "14:00");
      setFormData(prev => ({
        ...prev,
        bookingCode: "",
        fullname: "",
        email: "",
        contactNumber: "",
        adults: 1,
        kids: 0,
        unitType: "",
        checkInDate: toISODate(now),
        checkInTime: "14:00",
        checkOutDate: coDate,
        checkOutTime: coTime,
        leisureTime: "",
        addOns: ""
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingBooking, customers]);

  // when check-in changes for rooms -> auto compute checkout (+22 hrs)
  useEffect(() => {
    const roomTypes = ["ktv-room", "big-cabana", "small-cabana", "couple-room", "family-room"];
    if (!roomTypes.includes(formData.unitType)) return;
    const out = getCheckoutFrom(formData.checkInDate, formData.checkInTime);
    setFormData(prev => ({ ...prev, checkOutDate: out.date, checkOutTime: out.time }));
  }, [formData.checkInDate, formData.checkInTime, formData.unitType]);

  // fetch booked-dates also when editingBooking exists and has unitType (so the picker disables correctly on open)
  useEffect(() => {
    if (editingBooking && editingBooking.unitType) {
      axios.get("http://localhost:8080/api/bookings/booked-dates", { params: { unitType: editingBooking.unitType } })
        .then(res => setBookedDates(res.data || []))
        .catch(() => setBookedDates([]));
    }
  }, [editingBooking]);

  // pax total calculator
  const calculateTotalByGuests = (adults, kids) => (Number(adults)||0) * 150 + (Number(kids)||0) * 100;

  // helpers for type checks
  const isTableType = (t) => ["brown-table", "colored-table", "garden-table"].includes(t);
  const isRoomType = (t) => ["ktv-room", "big-cabana", "small-cabana", "couple-room", "family-room"].includes(t);

  // --- handlers ---
  const updatePax = (field, delta) => {
    setFormData(prev => {
      const newValue = Math.max(0, (parseInt(prev[field]) || 0) + delta);
      const next = { ...prev, [field]: newValue };
      const total = (parseInt(next.adults) || 0) + (parseInt(next.kids) || 0);
      const max = roomCapacities[next.unitType] || 99;
      if (next.unitType && total > max) {
        alert(`Total guests (${total}) exceed the capacity (${max}) for ${next.unitType}.`);
        return prev; // reject change
      }
      next.totalAmount = calculateTotalByGuests(next.adults, next.kids);
      return next;
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // adults / kids typed manually
    if (name === "adults" || name === "kids") {
      const nextValue = parseInt(value) || 0;
      const nextTotal = name === "adults" ? nextValue + (parseInt(formData.kids) || 0) : (parseInt(formData.adults) || 0) + nextValue;
      const max = roomCapacities[formData.unitType] || 99;
      if (formData.unitType && nextTotal > max) {
        alert(`Total guests (${nextTotal}) exceed the capacity (${max}) for ${formData.unitType}.`);
        return;
      }
      setFormData(prev => ({ ...prev, [name]: nextValue, totalAmount: calculateTotalByGuests(name === "adults" ? nextValue : prev.adults, name === "kids" ? nextValue : prev.kids) }));
      return;
    }

    // unitType changed -> check capacities and prompt
    if (name === "unitType") {
      const newUnit = value;
      const newMax = roomCapacities[newUnit] || 99;
      const totalGuests = (parseInt(formData.adults) || 0) + (parseInt(formData.kids) || 0);

      if (totalGuests > newMax) {
        const proceed = window.confirm(
          `Selected unit "${newUnit.replace("-", " ")}" has capacity ${newMax}, current guests ${totalGuests}.\n` +
          `Do you want to automatically reduce guest count to fit and proceed? (OK = reduce & proceed, Cancel = keep previous unit)`
        );
        if (!proceed) {
          return; // don't change unit
        }
        // adjust guests to fit
        let adjAdults = Math.min(formData.adults, newMax);
        let adjKids = Math.min(formData.kids, Math.max(0, newMax - adjAdults));
        setFormData(prev => ({
          ...prev,
          unitType: newUnit,
          adults: adjAdults,
          kids: adjKids,
          totalAmount: calculateTotalByGuests(adjAdults, adjKids),
          // times reset based on type
          checkInTime: isRoomType(newUnit) ? "14:00" : prev.checkInTime,
          checkOutTime: isRoomType(newUnit) ? "12:00" : prev.checkOutTime,
          leisureTime: isTableType(newUnit) ? prev.leisureTime : ""
        }));
        return;
      }

      // normal update
      setFormData(prev => ({
        ...prev,
        unitType: newUnit,
        checkInTime: isRoomType(newUnit) ? "14:00" : prev.checkInTime,
        checkOutTime: isRoomType(newUnit) ? "12:00" : prev.checkOutTime,
        leisureTime: isTableType(newUnit) ? prev.leisureTime : ""
      }));
      return;
    }

    // leisureTime change: apply table times if we have date
    if (name === "leisureTime") {
      setFormData(prev => ({ ...prev, leisureTime: value }));
      if (isTableType(formData.unitType) && formData.checkInDate) {
        applyTableTimes(formData.checkInDate, value);
      }
      return;
    }

    // checkInTime typed for rooms: enforce >= 14:00
    // if (name === "checkInTime") {
    //   if (isRoomType(formData.unitType) && value < "14:00") {
    //     alert("Room check-in cannot be earlier than 14:00 (2:00 PM).");
    //     return;
    //   }
    //   // set and recalc checkout for rooms
    //   setFormData(prev => {
    //     const next = { ...prev, checkInTime: value };
    //     if (isRoomType(next.unitType)) {
    //       const out = getCheckoutFrom(next.checkInDate, value);
    //       next.checkOutDate = out.date;
    //       next.checkOutTime = out.time;
    //     }
    //     return next;
    //   });
    //   return;
    // }

    // check-in date typed via non-picker path (shouldn't be used when DatePicker used) - keep safe
    if (name === "checkInDate") {
      setFormData(prev => {
        const next = { ...prev, checkInDate: value };
        if (isTableType(next.unitType) && next.leisureTime) applyTableTimes(value, next.leisureTime);
        if (isRoomType(next.unitType)) {
          const out = getCheckoutFrom(value, prev.checkInTime);
          next.checkOutDate = out.date;
          next.checkOutTime = out.time;
        }
        return next;
      });
      return;
    }

    // fallback: update field
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // DatePicker handlers (both pickers)
  const handlePickCheckIn = (date) => {
    if (!date) return;
    const iso = toISODate(date);

    // Prevent selection if blocked
    if (isDateBlocked(date)) {
      // won't happen because DatePicker already disables, but guard
      alert("This date is unavailable for the selected unit.");
      return;
    }

    if (isTableType(formData.unitType)) {
      // set date and apply times if leisureTime selected
      setFormData(prev => ({ ...prev, checkInDate: iso }));
      if (formData.leisureTime) applyTableTimes(iso, formData.leisureTime);
    } else {
      // room
      setFormData(prev => {
        const next = { ...prev, checkInDate: iso };
        const out = getCheckoutFrom(iso, prev.checkInTime);
        next.checkOutDate = out.date;
        next.checkOutTime = out.time;
        return next;
      });
    }
  };

  const handlePickCheckOut = (date) => {
    if (!date) return;
    // For rooms, check-out should be read-only and controlled by check-in; but because we are using DatePicker for both,
    // we still prevent manual change for rooms by ignoring pick if it's a room type.
    if (isRoomType(formData.unitType)) {
      return; // ignore user picking checkout for room types
    }
    const iso = toISODate(date);
    if (isDateBlocked(date)) {
      alert("This check-out date overlaps an unavailable booking.");
      return;
    }
    setFormData(prev => ({ ...prev, checkOutDate: iso }));
  };

  // handle check-in time typed via time input for rooms (we already handle in handleChange for checkInTime)
  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // parse datetimes
    const checkIn = parseDateTimeLocal(formData.checkInDate, formData.checkInTime);
    const checkOut = parseDateTimeLocal(formData.checkOutDate, formData.checkOutTime);

    if (checkOut <= checkIn) {
      alert("Check-out must be after check-in.");
      return;
    }

    // enforce room check-in >= 14:00
    if (isRoomType(formData.unitType) && formData.checkInTime < "14:00") {
      alert("Room check-in cannot be earlier than 14:00 (2:00 PM).");
      return;
    }

    // capacity check again before submit
    const totalGuests = (parseInt(formData.adults) || 0) + (parseInt(formData.kids) || 0);
    const max = roomCapacities[formData.unitType] || 99;
    if (formData.unitType && totalGuests > max) {
      alert(`Total guests (${totalGuests}) exceed the capacity (${max}) for ${formData.unitType}.`);
      return;
    }

    // overlapping bookings client-side check (server should also enforce)
    const hasOverlap = bookings.some(b => {
      if (editingBooking && b.id === editingBooking.id) return false;
      if (!b.unitType || !formData.unitType) return false;
      if (b.unitType.toLowerCase() !== formData.unitType.toLowerCase()) return false;
      const existingCheckIn = new Date(b.checkIn);
      const existingCheckOut = new Date(b.checkOut);
      return checkIn < existingCheckOut && checkOut > existingCheckIn;
    });
    if (hasOverlap) {
      alert("This booking overlaps with an existing booking for the same unit.");
      return;
    }

    // high-level availability
    const availableCount = roomAvailability[formData.unitType];
    if (typeof availableCount !== "undefined" && availableCount === 0 && !(editingBooking && editingBooking.unitType === formData.unitType)) {
      alert("Selected unit type currently shows 0 availability.");
      return;
    }

    const payload = {
      fullname: formData.fullname,
      adults: Number(formData.adults) || 1,
      kids: Number(formData.kids) || 0,
      unitType: formData.unitType,
      checkIn: formatDateTimeForBackend(checkIn),
      checkOut: formatDateTimeForBackend(checkOut),
      leisureTime: formData.leisureTime,
      addOns: formData.addOns,
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
        alert(`Error response: ${errorData.error || "Failed to save booking"}`);
        return;
      }

      const savedBooking = await response.json();
      if (editingBooking) {
        setBookings(bookings.map(b => (b.id === editingBooking.id ? savedBooking : b)));
        setEditingBooking(null);
        window.location.reload();
      } else {
        setBookings([...bookings, savedBooking]);
        window.location.reload();
      }

      const modalElement = document.getElementById("modal_createEditBook");
      const modal = window.bootstrap?.Modal.getInstance(modalElement);
      modal?.hide();
    } catch (err) {
      console.error(err);
      alert("Error saving booking. Please try again.");
    }
  };

  // UI helpers: selected Date objects for DatePicker
  const selectedCheckIn = formData.checkInDate ? new Date(formData.checkInDate + "T00:00:00") : null;
  const selectedCheckOut = formData.checkOutDate ? new Date(formData.checkOutDate + "T00:00:00") : null;

  // styling for summary card - make nicer
  const summaryCardStyle = { borderRadius: 10, boxShadow: "0 2px 6px rgba(0,0,0,0.08)" };

  return (
    <div className="modal fade" id="modal_createEditBook" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-md modal-dialog-scrollable" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{editingBooking ? "Edit Booking" : "Add new booking"}</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
          </div>

          <div className="modal-body">
            <form className="row" onSubmit={handleSubmit}>
              {/* Booking Code */}
              {editingBooking && (
                <div className="col-12 mb-3">
                  <label className="form-label">Booking Code</label>
                  <input className="form-control" name="bookingCode" value={formData.bookingCode} readOnly />
                </div>
              )}

              {/* Name */}
              <div className="col-12 mb-3">
                <label className="form-label">Fullname</label>
                <input className="form-control" name="fullname" value={formData.fullname} placeholder="Ex. Juan Dela Cruz" onChange={handleChange} />
              </div>

              {/* Email / Contact */}
              <div className="col-6 mb-3">
                <label className="form-label">Email</label>
                <input className="form-control" type="email" name="email" value={formData.email} onChange={handleChange} disabled={!!editingBooking} />
                {editingBooking && <small className="text-muted">To update email, go to Customer Management.</small>}
              </div>
              <div className="col-6 mb-3">
                <label className="form-label">Contact Number</label>
                <input className="form-control" name="contactNumber" value={formData.contactNumber} onChange={handleChange} disabled={!!editingBooking} />
                {editingBooking && <small className="text-muted">To update contact number, go to Customer Management.</small>}
              </div>

              {/* Adults / Kids */}
              <div className="col-6 mb-3">
                <label className="form-label">Adults</label>
                <div className="input-group">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => updatePax("adults", -1)}>-</button>
                  <input type="text" className="form-control text-center" name="adults" value={formData.adults} onChange={handleChange} />
                  <button type="button" className="btn btn-outline-secondary" onClick={() => updatePax("adults", 1)}>+</button>
                </div>
              </div>
              <div className="col-6 mb-3">
                <label className="form-label">Kids</label>
                <div className="input-group">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => updatePax("kids", -1)}>-</button>
                  <input type="text" className="form-control text-center" name="kids" value={formData.kids} onChange={handleChange} />
                  <button type="button" className="btn btn-outline-secondary" onClick={() => updatePax("kids", 1)}>+</button>
                </div>
              </div>

              {/* Unit Type */}
              <div className="col-12 mb-3">
                <label className="form-label">Select Type</label>
                <select className="form-select" name="unitType" value={formData.unitType} onChange={handleChange}>
                  <option value="" disabled>Select Room/Table</option>
                  {[
                    { v: "ktv-room", l: "KTV Room" },
                    { v: "big-cabana", l: "Big Cabana" },
                    { v: "small-cabana", l: "Small Cabana" },
                    { v: "couple-room", l: "Couple Room" },
                    { v: "family-room", l: "Family Room" },
                    { v: "brown-table", l: "Brown Table" },
                    { v: "colored-table", l: "Colored Table" },
                    { v: "garden-table", l: "Garden Table" },
                  ].map(opt => {
                    const cap = roomCapacities[opt.v];
                    const avail = roomAvailability[opt.v];
                    const labelSuffix = `${cap ? ` • Max ${cap}` : ""}${typeof avail !== "undefined" ? ` • ${avail} available` : ""}`;
                    return <option key={opt.v} value={opt.v}>{opt.l}{labelSuffix}</option>;
                  })}
                </select>
              </div>

              {/* Leisure Time (tables only) */}
              {isTableType(formData.unitType) && (
                <div className="col-12 mb-3">
                  <label className="form-label">Leisure Time</label>
                  <select className="form-select" name="leisureTime" value={formData.leisureTime} onChange={handleChange}>
                    <option value="">Select</option>
                    <option value="DAY">Day (08:00 - 17:00)</option>
                    <option value="NIGHT">Night (19:00 - 04:00)</option>
                  </select>
                  {formData.checkInDate && isTableBooked(new Date(formData.checkInDate + "T00:00:00")) && (
                    <small className="text-danger d-block mt-1">This date is already booked for the selected table.</small>
                  )}
                </div>
              )}

              {/* Check-in / Check-out (DatePickers) */}
              <div className="col-6 mb-3">
                <label className="form-label">Check-In</label>
                <DatePicker
                  selected={selectedCheckIn}
                  onChange={handlePickCheckIn}
                  filterDate={(d) => !isDateBlocked(d)}
                  minDate={editingBooking ? null : new Date()}
                  className="form-control"
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Select check-in date"
                />
                {isRoomType(formData.unitType) && (
                  <input
                    type="time"
                    className="form-control mt-1"
                    name="checkInTime"
                    value={formData.checkInTime}
                    min="14:00"
                    onChange={handleChange}
                    aria-label="Check-in time"
                  />
                )}
              </div>

              <div className="col-6 mb-3">
                <label className="form-label">Check-Out</label>
                <DatePicker
                  selected={selectedCheckOut}
                  onChange={handlePickCheckOut}
                  filterDate={(d) => !isDateBlocked(d)}
                  minDate={selectedCheckIn || new Date()}
                  className="form-control"
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Select check-out date"
                  disabled={isRoomType(formData.unitType)} // rooms control checkout automatically
                />
                {isRoomType(formData.unitType) ? (
                  <input type="time" readOnly className="form-control mt-1" name="checkOutTime" value={formData.checkOutTime} />
                ) : (
                  <input type="time" className="form-control mt-1" name="checkOutTime" value={formData.checkOutTime} onChange={handleChange} />
                )}
              </div>

              <div>
                {/* //Check discount attachment here based on the fullname
                //Check if there is an attached image,
                // apply the discount , all discounts are 20%, if senior citizen - 20% to a single adult , if Birthday promo & PWD for either adult or kid */}
              </div>

              {/* Add-ons */}
              <div className="col-12 mb-3">
                <label className="form-label">Add-ons</label>
                <textarea className="form-control" rows={3} name="addOns" value={formData.addOns} onChange={handleChange} placeholder="Write your add ons here..." />
              </div>

              {/* Summary (nicer UI) */}
              <div className="col-12 mb-3">
                <label className="form-label">Booking Summary</label>
                <div className="card bg-white p-3" style={summaryCardStyle}>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h6 className="mb-1">{formData.fullname || "Guest"}</h6>
                      <small className="text-muted">{formData.email || "No email"} • {formData.contactNumber || "No contact"}</small>
                    </div>
                    <div className="text-end">
                      <span className="badge bg-primary">{formData.unitType || "N/A"}</span>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-6">
                      <p className="mb-1"><strong>Guests</strong></p>
                      <p className="mb-1">{formData.adults} adult(s), {formData.kids} kid(s)</p>
                      <p className="mb-1"><strong>Check-In</strong></p>
                      <p className="mb-1">{formData.checkInDate} {formData.checkInTime}</p>
                    </div>
                    <div className="col-6">
                      <p className="mb-1"><strong>Check-Out</strong></p>
                      <p className="mb-1">{formData.checkOutDate} {formData.checkOutTime}</p>
                      {isTableType(formData.unitType) && <p className="mb-1"><strong>Leisure</strong></p>}
                      {isTableType(formData.unitType) && <p className="mb-1">{formData.leisureTime || "N/A"}</p>}
                    </div>
                  </div>

                  <hr />
                  <div className="d-flex justify-content-between">
                    <div>
                      <small className="text-muted">Add-Ons</small>
                      <div>{formData.addOns || <small className="text-muted">None</small>}</div>
                    </div>
                    <div className="text-end">
                      <small className="text-muted">Total</small>
                      <div className="h6 mb-0">Php {formData.totalAmount}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="col-12 text-end">
                <button type="button" className="btn btn-outline-secondary me-2" data-bs-dismiss="modal">Close</button>
                <button type="submit" className="btn btn-primary">{editingBooking ? "Update" : "Book"}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookFormModal;
