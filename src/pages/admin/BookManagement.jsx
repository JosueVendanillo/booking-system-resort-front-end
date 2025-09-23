import React, { useState, useEffect } from "react";
import { NavLink } from 'react-router-dom'
import BookFormModal from '../../components/FormModal/BookFormModal'
// import BookEditModal from '../../components/FormModal/BookEditModal'  // <--- Add this



function BookManagement() {
  const [search, setSearch] = useState("");
  const [bookings, setBookings] = useState([]);
  const [editingBooking, setEditingBooking] = useState(null);

    // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Load bookings from backend
  useEffect(() => {
    fetch("http://localhost:8080/api/bookings") // Adjust the URL if needed
      .then((res) => res.json())
      .then((data) => setBookings(data))
      .catch((err) => console.error("Failed to fetch bookings:", err));
  }, []);

  // Delete booking with confirmation
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      fetch(`http://localhost:8080/api/bookings/${id}`, { method: "DELETE" })
        .then((res) => {
          if (res.ok) {
            setBookings(bookings.filter((b) => b.id !== id));
          } else {
            alert("Failed to delete booking");
          }
        })
        .catch((err) => console.error(err));
    }
  };

  // Filter bookings by search
  const filteredBookings = bookings.filter((b) =>
    b.fullname.toLowerCase().includes(search.toLowerCase())
  );

  
  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(filteredBookings.length / itemsPerPage));
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirstItem, indexOfLastItem);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };


  return (
    <>
      <div className='container-xxl flex-grow-1 container-p-y'>
        <div className="card">
          <div className="card-header d-flex justify-content-between">
            <h5>Booking List</h5>
            <div className="d-flex flex-row">
              <input
                className="form-control me-3"
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                className='btn btn-primary text-nowrap'
                data-bs-toggle="modal"
                data-bs-target="#modal_createEditBook"
                 onClick={() => setEditingBooking(null)} // reset for new record
              >
                + New Record
              </button>
            </div>
          </div>

          <div className="table-responsive text-nowrap">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Fullname</th>
                  <th className="text-center">Type</th>
                  {/* <th className="text-center">Type Name</th> */}
                  <th className="text-center">Check In</th>
                  <th className="text-center">Check Out</th>
                  <th className="text-center">Adults</th>
                  <th className="text-center">Kids</th>
                  <th className="text-center">No. of day(s)</th>
                  <th className="text-center">Total Amount</th>
                  <th className="text-center">Payment Status</th>
                  <th className="text-center">Actions</th>
                  
                </tr>
              </thead>
              <tbody className="table-border-bottom-0">
                  {currentBookings.length > 0 ? (
                    currentBookings.map((b) => (
                    <tr key={b.id}>
                      <td>{b.bookingCode}</td>
                      <td>{b.fullname}</td>
                      <td className="text-center">{b.unitType}</td>
                      {/* <td className="text-center">{b.typeName || "-"}</td> */}
                      <td className="text-center">{new Date(b.checkIn).toLocaleString()}</td>
                      <td className="text-center">{new Date(b.checkOut).toLocaleString()}</td>
                      <td className="text-center">{b.adults}</td>
                      <td className="text-center">{b.kids}</td>
                      <td className="text-center">
                        {b.noOfDays
                            ? b.noOfDays <= 1
                            ? b.noOfDays + " day"
                            : b.noOfDays + " days"
                            : "-"}
                      </td>
                      <td className="text-center">Php{b.totalAmount?.toLocaleString() || 0}</td>
                      <td className="text-center">
                            <span
                                className={`badge ${
                                b.paymentStatus === "PAID"
                                    ? "bg-success"
                                    : b.paymentStatus === "CANCELLED"
                                    ? "bg-danger"
                                    : "bg-warning text-dark"
                                }`}
                            >
                                {b.paymentStatus || "PENDING"}
                            </span>
                            </td>
                      <td className="text-center d-flex justify-content-center">
                        <button
                          type="button"
                          className="btn btn-danger me-2"
                          onClick={() => handleDelete(b.id)}
                        >
                          <i className="bx bx-trash me-1"></i>
                          Delete
                        </button>

                        <button
                        type="button"
                        className="btn btn-primary"
                        data-bs-toggle="modal"
                        data-bs-target="#modal_editBook"
                        onClick={() => setEditingBooking(b)}
                        >
                        <i className="bx bx-edit-alt me-1"></i>
                        Edit
                        </button>

                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="text-bg-secondary">
                    <td colSpan="10" className="text-center py-4">
                      <div className="alert alert-light mb-0" role="alert">
                        There are no records available
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination Controls */}
          <div className="d-flex justify-content-center align-items-center py-3">
            <nav>
              <ul className="pagination mb-0">
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => goToPage(currentPage - 1)}>
                    Previous
                  </button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => (
                  <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                    <button className="page-link" onClick={() => goToPage(i + 1)}>
                      {i + 1}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => goToPage(currentPage + 1)}>
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>

      {/* Pass props to modal */}
{/* New Record Modal */}
<BookFormModal
  bookings={bookings}
  setBookings={setBookings}
  editingBooking={editingBooking}  // can be null for new record
  setEditingBooking={setEditingBooking}
/>


    </>
  )
}

export default BookManagement