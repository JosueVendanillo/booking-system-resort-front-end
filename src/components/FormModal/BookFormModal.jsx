import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function BookFormModal({ setBookings, bookings, editingBooking, setEditingBooking }) {
  const formatDate = (date) => date.toLocaleDateString("en-CA"); // YYYY-MM-DD
  const formatTime = (date) => date.toTimeString().slice(0, 5); // HH:mm
  const formatDateTimeForBackend = (date) => {
    const pad = (n) => n.toString().padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate()
    )}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  };
  const getToday = () => formatDate(new Date());
  const parseDateTimeLocal = (dateStr, timeStr) => {
    const [y, m, d] = (dateStr || getToday()).split("-").map(Number);
    const [hh, mm] = (timeStr || "00:00").split(":").map(Number);
    return new Date(y, m - 1, d, hh, mm, 0);
  };
  const dayStart = (date) => { const d = new Date(date); d.setHours(0,0,0,0); return d; };
  const dayEnd = (date) => { const d = new Date(date); d.setHours(23,59,59,999); return d; };
  const getDefaultCheckout = (checkIn) => {
    const co = new Date(checkIn);
    co.setHours(co.getHours() + 22); // 22-hour checkout
    return { checkOutDate: formatDate(co), checkOutTime: formatTime(co) };
  };

  // --- state ---
  const [roomAvailability, setRoomAvailability] = useState({});
  const [customers, setCustomers] = useState([]);
  const [roomCapacities, setRoomCapacities] = useState({});
  const [bookedDates, setBookedDates] = useState([]);
  const hasRun = useRef(false);

  const [formData, setFormData] = useState({
    bookingCode: "",
    fullname: "",
    email: "",
    contactNumber: "",
    adults: 1,
    kids: 0,
    unitType: "",
    checkInDate: getToday(),
    checkInTime: "14:00",
    checkOutDate: getToday(),
    checkOutTime: "12:00",
    totalAmount: 0,
    leisureTime: "",
    addOns: "",
  });

  // --- fetch ---
  useEffect(() => { axios.get("http://localhost:8080/api/customers").then(r => setCustomers(r.data || [])).catch(() => setCustomers([])); }, []);
  useEffect(() => { axios.get("http://localhost:8080/api/rooms/room-capacities").then(r => setRoomCapacities(Object.fromEntries(r.data || []))).catch((e)=>console.error(e)); }, []);
  useEffect(() => { fetch("http://localhost:8080/api/rooms/room-availability").then(r => r.ok? r.json() : Promise.reject("fail")).then(data => { const map={}; data.forEach(([type, total, available]) => (map[type]=Number(available))); setRoomAvailability(map); }).catch(err => console.error(err)); }, []);
  useEffect(() => {
    if (!formData.unitType) return;
    axios.get("http://localhost:8080/api/bookings/booked-dates", { params: { unitType: formData.unitType } })
      .then(res => setBookedDates(res.data || []))
      .catch(err => { console.error(err); setBookedDates([]); });
  }, [formData.unitType]);

  const isSameBooking = (b) => editingBooking && b.id === editingBooking.id;
  const isDateBlocked = (date) => {
    if (!bookedDates.length) return false;
    const s = dayStart(date), e = dayEnd(date);
    return bookedDates.some(b => {
      if (isSameBooking(b)) return false;
      const bS = new Date(b.checkIn), bE = new Date(b.checkOut);
      return !(bE < s || bS > e);
    });
  };

const applyTableTimes = (dateStr, leisure) => {
  if (!dateStr) return;
  const [y, m, d] = dateStr.split("-").map(Number);
  if (leisure === "DAY") {
    const ci = new Date(y,m-1,d,8,0,0), co = new Date(y,m-1,d,17,0,0);
    setFormData(prev => ({ ...prev, checkInDate: formatDate(ci), checkInTime: formatTime(ci), checkOutDate: formatDate(co), checkOutTime: formatTime(co) }));
  } else if (leisure === "NIGHT") {
    const ci = new Date(y,m-1,d,19,0,0), next = new Date(y,m-1,d+1); 
    next.setHours(4,0,0,0);
    setFormData(prev => ({ ...prev, checkInDate: formatDate(ci), checkInTime: formatTime(ci), checkOutDate: formatDate(next), checkOutTime: formatTime(next) }));
  }
};


  // --- editing booking ---
  useEffect(() => {
    if (editingBooking) {
      const checkIn = new Date(editingBooking.checkIn);
      const checkOut = new Date(editingBooking.checkOut);
      let matchedCustomer = null;
      const bookingCustomerId = editingBooking?.customer?.id ?? editingBooking?.customerId ?? editingBooking?.customer_id;
      if (bookingCustomerId != null) matchedCustomer = customers.find(c => Number(c.id) === Number(bookingCustomerId));
      if (!matchedCustomer && (editingBooking?.customer?.email || editingBooking?.email)) {
        const targetEmail = (editingBooking.customer?.email || editingBooking.email || "").toLowerCase();
        matchedCustomer = customers.find(c => c.email && c.email.toLowerCase() === targetEmail);
      }
      if (!matchedCustomer && editingBooking?.fullname) {
        const targetName = editingBooking.fullname.toLowerCase();
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
        checkInDate: formatDate(checkIn),
        checkInTime: formatTime(checkIn),
        checkOutDate: formatDate(checkOut),
        checkOutTime: formatTime(checkOut),
        totalAmount: editingBooking.totalAmount ?? 0,
        leisureTime: editingBooking.leisureTime || "",
        addOns: editingBooking.addOns || ""
      });
    } else {
      const checkIn = new Date();
      const def = getDefaultCheckout(checkIn);
      setFormData(prev => ({ ...prev, bookingCode:"", fullname:"", email:"", contactNumber:"", adults:1, kids:0, unitType:"", checkInDate: formatDate(checkIn), checkInTime:"14:00", checkOutDate:def.checkOutDate, checkOutTime:def.checkOutTime, leisureTime:"", addOns:"" }));
    }
  }, [editingBooking, customers]);

  // Auto-update checkout for rooms
  useEffect(() => {
    const roomTypes = ["ktv-room","big-cabana","small-cabana","couple-room","family-room"];
    if (!roomTypes.includes(formData.unitType)) return;
    const checkIn = parseDateTimeLocal(formData.checkInDate, formData.checkInTime);
    const { checkOutDate, checkOutTime } = getDefaultCheckout(checkIn);
    setFormData(prev => ({ ...prev, checkOutDate, checkOutTime }));
  }, [formData.checkInDate, formData.checkInTime, formData.unitType]);


  const updatePax = (field, delta) => {
  setFormData(prev => {
    const newValue = Math.max(0, (parseInt(prev[field]) || 0) + delta);
    const total = (field === "adults" ? newValue : prev.adults) + (field === "kids" ? newValue : prev.kids);
    const max = roomCapacities[prev.unitType] || 99;

    if (prev.unitType && total > max) {
      alert(`Total guests (${total}) exceed the capacity (${max}) for ${prev.unitType}.`);
      return prev; // Don't update
    }
    return { ...prev, [field]: newValue };
  });
};


  // Generic handleChange
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "adults" || name === "kids") {
      const nextValue = parseInt(value) || 0;
      const nextData = { ...formData, [name]: nextValue };
      const total = (parseInt(nextData.adults) || 0) + (parseInt(nextData.kids) || 0);
      const selectedType = nextData.unitType;
      const max = roomCapacities[selectedType] || 99;
      if (selectedType && total > max) {
        alert(`Total guests (${total}) exceed the capacity (${max}) for ${selectedType}.`);
        return;
      }
      const updatedTotal = calculateTotalByGuests(nextData.adults, nextData.kids);
      setFormData((prev) => ({ ...prev, [name]: nextValue, totalAmount: updatedTotal }));
      return;
    }

    if (name === "unitType") {
      const newUnit = value;
      const maxCap = roomCapacities[newUnit] || 99;
      const totalGuests = formData.adults + formData.kids;

      // If total guests exceed new room capacity
      if (totalGuests > maxCap) {
        const proceed = window.confirm(
          `The selected room (${newUnit.replace("-", " ")}) has a capacity of ${maxCap}. ` +
          `Current total guests: ${totalGuests}. ` +
          `Do you want to automatically adjust the number of guests to fit this room?`
        );

        if (!proceed) {
          // User canceled, do not change unit type
          return;
        }

        // Adjust guests to fit new capacity
        let adjAdults = Math.min(formData.adults, maxCap);
        let adjKids = Math.min(formData.kids, maxCap - adjAdults);

        setFormData((prev) => ({
          ...prev,
          unitType: newUnit,
          adults: adjAdults,
          kids: adjKids,
          checkInTime: isRoomType(newUnit) ? "14:00" : prev.checkInTime,
          checkOutTime: isRoomType(newUnit) ? "12:00" : prev.checkOutTime,
          leisureTime: isTableType(newUnit) ? prev.leisureTime : "",
        }));

        return;
      }

      // Normal update when total guests <= max capacity
      setFormData((prev) => ({
        ...prev,
        unitType: newUnit,
        checkInTime: isRoomType(newUnit) ? "14:00" : prev.checkInTime,
        checkOutTime: isRoomType(newUnit) ? "12:00" : prev.checkOutTime,
        leisureTime: isTableType(newUnit) ? prev.leisureTime : "",
      }));
    }


      // --- Leisure Time selection ---
      if (name === "leisureTime") {
        setFormData(prev => ({ ...prev, leisureTime: value }));
        return;
      }

      // --- Check-in / Check-out / Add-ons / etc ---
      setFormData(prev => ({ ...prev, [name]: value }));
  };

    // --- Auto-apply table times whenever relevant ---
    useEffect(() => {
      if (isTableType(formData.unitType) && formData.leisureTime && formData.checkInDate) {
        applyTableTimes(formData.checkInDate, formData.leisureTime);
      }
    }, [formData.unitType, formData.leisureTime, formData.checkInDate]);

  const isTableType = t=>["brown-table","colored-table","garden-table"].includes(t);
  const isRoomType = t=>["ktv-room","big-cabana","small-cabana","couple-room","family-room"].includes(t);

  const handlePickCheckInDate = (date) => {
    if(!date) return;
    const iso = date.toISOString().split("T")[0];
    if(isTableType(formData.unitType)){
      setFormData(prev=>({...prev, checkInDate: iso}));
      if(formData.leisureTime) applyTableTimes(iso, formData.leisureTime);
    } else { setFormData(prev=>({...prev, checkInDate: iso})); }
  };

  const handleRoomCheckInTime = (time) => {
    if(time<"14:00"){ alert("Check-in cannot be earlier than 2:00 PM"); return; }
    setFormData(prev=>({...prev, checkInTime: time}));
    const checkIn = parseDateTimeLocal(formData.checkInDate, time);
    const out = new Date(checkIn.getTime() + 22*60*60*1000);
    setFormData(prev=>({...prev, checkOutDate: formatDate(out), checkOutTime: formatTime(out)}));
  };

  const handleSubmit = async(e)=>{
    e.preventDefault();
    const checkIn=parseDateTimeLocal(formData.checkInDate, formData.checkInTime);
    const checkOut=parseDateTimeLocal(formData.checkOutDate, formData.checkOutTime);
    if(checkOut<=checkIn){ alert("Check-Out must be after Check-In."); return; }

    const roomTypes=["ktv-room","big-cabana","small-cabana","couple-room","family-room"];
    if(roomTypes.includes(formData.unitType)&&formData.checkInTime<"14:00"){ alert("Room check-in cannot be earlier than 2 PM"); return; }

    const hasOverlap = bookings.some(b=>{
      if(editingBooking&&b.id===editingBooking.id) return false;
      if(!b.unitType||!formData.unitType) return false;
      if(b.unitType.toLowerCase()!==formData.unitType.toLowerCase()) return false;
      const existingCheckIn=new Date(b.checkIn);
      const existingCheckOut=new Date(b.checkOut);
      return checkIn<existingCheckOut && checkOut>existingCheckIn;
    });
    if(hasOverlap){ alert("This booking overlaps with an existing booking for the same unit."); return; }

    const selectedAvailable=roomAvailability[formData.unitType];
    if(typeof selectedAvailable!=="undefined"&&selectedAvailable===0&&!(editingBooking&&editingBooking.unitType===formData.unitType)){
      alert("Selected room type is currently unavailable."); return;
    }

    const payload={ 
      fullname:formData.fullname, adults:Number(formData.adults)||1, kids:Number(formData.kids)||0, unitType:formData.unitType, checkIn:formatDateTimeForBackend(checkIn), checkOut:formatDateTimeForBackend(checkOut), leisureTime:formData.leisureTime, addOns:formData.addOns, customer:{ fullname:formData.fullname, email:formData.email, contactNumber:formData.contactNumber } };

    try{
      let response;
      if(editingBooking){
        response=await fetch(`http://localhost:8080/api/bookings/${editingBooking.id}`,{method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify(payload)});
      }else{
        response=await fetch("http://localhost:8080/api/bookings",{method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(payload)});
      }
      if(!response.ok){ const errorData=await response.json().catch(()=>({})); console.error("Error response:", errorData); alert(`Error response: ${errorData.error||"Failed to save booking"}`); return; }
      const savedBooking=await response.json();
      if(editingBooking){ setBookings(bookings.map(b=>b.id===editingBooking.id?savedBooking:b)); setEditingBooking(null); window.location.reload(); }else{ setBookings([...bookings,savedBooking]); window.location.reload(); }
      const modalElement=document.getElementById("modal_createEditBook");
      const modal=window.bootstrap?.Modal.getInstance(modalElement); modal?.hide();
    }catch(err){ console.error(err); alert("Error saving booking. Please try again."); }
  };



  const isTableBooked = () => {
  if (!isTableType(formData.unitType) || !formData.checkInDate) return false;
  const s = dayStart(parseDateTimeLocal(formData.checkInDate, "00:00"));
  const e = dayEnd(parseDateTimeLocal(formData.checkInDate, "23:59"));
  return bookedDates.some(b => {
    if (editingBooking && b.id === editingBooking.id) return false;
    const bS = new Date(b.checkIn);
    const bE = new Date(b.checkOut);
    return !(bE < s || bS > e);
  });
};


  return (
    <div className="modal fade" id="modal_createEditBook" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-md modal-dialog-scrollable" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{editingBooking?"Edit Booking":"Add new booking"}</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
          </div>
          <div className="modal-body">
            <form className="row" onSubmit={handleSubmit}>

              {/* Fullname / Email / Contact */}
              <div className="col-12 mb-3">
                <label className="form-label">Fullname</label>
                <input className="form-control" name="fullname" value={formData.fullname} onChange={handleChange} placeholder="Ex. Juan Dela Cruz" />
              </div>
              <div className="col-6 mb-3">
                <label className="form-label">Email</label>
                <input className="form-control" type="email" name="email" value={formData.email} onChange={handleChange} disabled={!!editingBooking} />
              </div>
              <div className="col-6 mb-3">
                <label className="form-label">Contact Number</label>
                <input className="form-control" name="contactNumber" value={formData.contactNumber} onChange={handleChange} disabled={!!editingBooking} />
              </div>

              {/* Adults / Kids */}
              <div className="col-6 mb-3">
                <label className="form-label">Adults</label>
                <div className="input-group">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => updatePax("adults", -1)}>-</button>
                  <input type="text" className="form-control text-center" name="adults" value={formData.adults||1} onChange={handleChange} />
                  <button type="button" className="btn btn-outline-secondary" onClick={() => updatePax("adults", 1)}>+</button>
                </div>
              </div>
              <div className="col-6 mb-3">
                <label className="form-label">Kids</label>
                <div className="input-group">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => updatePax("kids", -1)}>-</button>
                  <input type="text" className="form-control text-center" name="kids" value={formData.kids||0} onChange={handleChange} />
                  <button type="button" className="btn btn-outline-secondary" onClick={() => updatePax("kids", 1)}>+</button>
                </div>
              </div>

              {/* Unit Type */}
              <div className="col-12 mb-3">
                <label className="form-label">Select Type</label>
                <select className="form-select" name="unitType" value={formData.unitType} onChange={handleChange}>
                  <option value="" disabled>Select Room/Table</option>
                  {[
                    {v:"ktv-room", l:"KTV Room"},
                    {v:"big-cabana", l:"Big Cabana"},
                    {v:"small-cabana", l:"Small Cabana"},
                    {v:"couple-room", l:"Couple Room"},
                    {v:"family-room", l:"Family Room"},
                    {v:"brown-table", l:"Brown Table"},
                    {v:"colored-table", l:"Colored Table"},
                    {v:"garden-table", l:"Garden Table"}
                  ].map(opt=><option key={opt.v} value={opt.v}>{opt.l}</option>)}
                </select>
              </div>

              {/* Leisure time for tables */}
              {isTableType(formData.unitType) && !isTableBooked() && (
                <div className="col-12 mb-3">
                  <label className="form-label">Leisure Time</label>
                  <select className="form-select" name="leisureTime" value={formData.leisureTime} onChange={handleChange}>
                    <option value="">Select</option>
                    <option value="DAY">Day (8AM - 5PM)</option>
                    <option value="NIGHT">Night (7PM - 4AM)</option>
                  </select>
                </div>
              )}

              {/* Check-in / Check-out */}
              <div className="col-6 mb-3">
                <label className="form-label">Check-In</label>
                <input type="date" className="form-control" name="checkInDate" value={formData.checkInDate} onChange={handleChange} />
                {isRoomType(formData.unitType) && <input type="time" className="form-control mt-1" name="checkInTime" value={formData.checkInTime} onChange={e=>handleRoomCheckInTime(e.target.value)} />}
              </div>
              <div className="col-6 mb-3">
                <label className="form-label">Check-Out</label>
                <input type="date" className="form-control" name="checkOutDate" value={formData.checkOutDate} onChange={handleChange} />
                {isRoomType(formData.unitType) && <input type="time" className="form-control mt-1" name="checkOutTime" value={formData.checkOutTime} readOnly />}
              </div>

              {/* Add-ons */}
              <div className="col-12 mb-3">
                <label className="form-label">Add-ons</label>
                <textarea className="form-control" name="addOns" value={formData.addOns} onChange={handleChange} rows={2}></textarea>
              </div>

              {/* Summary Card */}
              <div className="col-12 mb-3">
                <label className="form-label">Booking Summary</label>
                <div className="card bg-light border shadow-sm p-3">
                  <p className="mb-1"><strong>Name:</strong> {formData.fullname}</p>
                  <p className="mb-1"><strong>Email:</strong> {formData.email}</p>
                  <p className="mb-1"><strong>Contact:</strong> {formData.contactNumber}</p>
                  <p className="mb-1"><strong>Unit Type:</strong> {formData.unitType}</p>
                  <p className="mb-1"><strong>Guests:</strong> {formData.adults} adult(s), {formData.kids} kid(s)</p>
                  <p className="mb-1"><strong>Check-In:</strong> {formData.checkInDate} {formData.checkInTime}</p>
                  <p className="mb-1"><strong>Check-Out:</strong> {formData.checkOutDate} {formData.checkOutTime}</p>
                  {isTableType(formData.unitType) && (
                    <p className="mb-1"><strong>Leisure Time:</strong> {formData.leisureTime || "N/A"}</p>
                  )}
                  <p className="mb-1"><strong>Add-Ons:</strong> {formData.addOns || "None"}</p>
                  <p className="mb-0"><strong>Total Amount:</strong> Php {formData.totalAmount}</p>
                </div>
              </div>



              <div className="col-12 text-end">
                <button type="submit" className="btn btn-primary">{editingBooking?"Update":"Book"}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookFormModal;
