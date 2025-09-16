import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import AmenityFormModal from '../../components/FormModal/AmenityFormModal'

function AmenityManagement() {
  const [amenities, setAmenities] = useState([
    { id: 1, name: 'Deluxe Room', description: 'Spacious room with luxury features.' },
    { id: 2, name: 'Swimming Pool', description: 'Outdoor infinity pool with ocean view.' },
    { id: 3, name: 'Fitness Center', description: 'Fully equipped gym with trainer.' },
    { id: 4, name: 'Spa', description: 'Relaxing massage and wellness services.' },
    { id: 5, name: 'Restaurant', description: 'Fine dining with international cuisine.' },
    { id: 6, name: 'Free WiFi', description: 'High-speed internet access everywhere.' },
    { id: 7, name: 'Parking', description: 'Secure underground parking for guests.' },
    { id: 8, name: 'Bar', description: 'Cocktail lounge with ocean view.' }
  ])
  const [searchTerm, setSearchTerm] = useState("")
  const [editAmenity, setEditAmenity] = useState(null)

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const handleAddAmenity = (newAmenity) => {
    setAmenities(prev => [...prev, { id: Date.now(), ...newAmenity }])
  }

  const handleEditAmenity = (updatedAmenity) => {
    setAmenities(prev => prev.map(a => (a.id === updatedAmenity.id ? updatedAmenity : a)))
    setEditAmenity(null)
  }

  const handleDeleteAmenity = (id) => {
    setAmenities(prev => prev.filter(a => a.id !== id))
  }

  const filteredAmenities = amenities.filter(a =>
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentAmenities = filteredAmenities.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.max(1, Math.ceil(filteredAmenities.length / itemsPerPage))

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page)
  }

    return (
        <>
            <div className='container-xxl flex-grow-1 container-p-y'>
                <div className="card">
                    <div className="card-header d-flex justify-content-between">
                        <h5>Amenity List</h5>

                        <div className="d-flex flex-row">
                            <input className="form-control me-3" 
                            type="text" 
                            placeholder="Search..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                            <button className='btn btn-primary text-nowrap' 
                            data-bs-toggle="modal" 
                            data-bs-target="#modal_createEdiAmenity"
                            onClick={() => setEditAmenity(null)} // Reset for new record
                            >+ New Record</button>
                        </div>
                    </div>

                    <div className="table-responsive text-nowrap">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>Amenity</th>
                                    <th>Description</th>
                                    <th className="text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="table-border-bottom-0">
                                {/* <tr>
                                    <td>Deluxe Room</td>
                                    <td >Lorem ipsum dolor sit amet, consectetur adipiscing elit.</td>
                                    <td className="text-center flex items-center justify-center">
                                        <button type="button" className="btn btn-danger me-2">
                                            <i className="bx bx-trash me-1"></i>
                                            Delete
                                        </button>

                                        <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modal_createEdiAmenity">
                                            <i className="bx bx-edit-alt me-1"></i>
                                            Edit
                                        </button>
                                    </td>
                                </tr> */}

                                {currentAmenities.length > 0 ? (
                                                currentAmenities.map(a => (
                                                    <tr key={a.id}>
                                                    <td>{a.name}</td>
                                                    <td>{a.description}</td>
                                                    <td className="text-center">
                                                        <button
                                                        type="button"
                                                        className="btn btn-danger me-2"
                                                        onClick={() => handleDeleteAmenity(a.id)}
                                                        >
                                                        <i className="bx bx-trash me-1"></i>
                                                        Delete
                                                        </button>

                                                        <button
                                                        type="button"
                                                        className="btn btn-primary"
                                                        data-bs-toggle="modal"
                                                        data-bs-target="#modal_createEdiAmenity"
                                                        onClick={() => setEditAmenity(a)}
                                                        >
                                                        <i className="bx bx-edit-alt me-1"></i>
                                                        Edit
                                                        </button>
                                                    </td>
                                                    </tr>
                                                ))
                                                ) : (
                                                <tr className="text-bg-secondary">
                                                    <td colSpan="3" className="text-center">
                                                    <div className="alert alert-dark mb-0" role="alert">
                                                        There are no records available
                                                    </div>
                                                    </td>
                                                </tr>
                                                )}

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

          {/* Pagination Controls */}
          <div id="pagination">
            <div className="demo-inline-spacing d-flex justify-content-center align-items-center pe-3 justify-content-md-end py-3">
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
      </div>

            <AmenityFormModal 
                onAdd={handleAddAmenity}
                onEdit={handleEditAmenity}
                editAmenity={editAmenity}
            />
        </>
    )
}

export default AmenityManagement