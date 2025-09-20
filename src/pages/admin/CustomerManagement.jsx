import React, {useState} from 'react'
import { NavLink } from 'react-router-dom'
import CustomerFormModal from '../../components/FormModal/CustomerFormModal'

function CustomerManagement() {
    //   const [customers, setCustomers] = useState([]);
    // const [search, setSearch] = useState("");

    // // Fetch customers from backend
    // useEffect(() => {
    //     fetch("http://localhost:8080/api/customers")
    //         .then(res => res.json())
    //         .then(data => setCustomers(data))
    //         .catch(err => console.error("Error fetching customers:", err));
    // }, []);

    // // Filter customers by search text
    // const filteredCustomers = customers.filter(c =>
    //     c.fullname?.toLowerCase().includes(search.toLowerCase()) ||
    //     c.email?.toLowerCase().includes(search.toLowerCase())
    // );

    return (
        <>
            <div className='container-xxl flex-grow-1 container-p-y'>
                <div className="card">
                    <div className="card-header d-flex justify-content-between">
                        <h5>Customer List</h5>

                        <div className="d-flex flex-row">
                            <input className="form-control me-3" type="text" placeholder="Search..." />
                            <button className='btn btn-primary text-nowrap' data-bs-toggle="modal" data-bs-target="#modal_createEditCustomer">+ New Record</button>
                        </div>
                    </div>

                    <div className="table-responsive text-nowrap">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>Fullname</th>
                                    <th>Email</th>
                                    <th className="text-center">Gender</th>
                                    <th className="text-center">Contact</th>
                                    <th className="text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="table-border-bottom-0">
                                  {/* {filteredCustomers.length > 0 ? (
                                    filteredCustomers.map((customer) => (
                                        <tr key={customer.id}>
                                            <td>{customer.fullname}</td>
                                            <td>{customer.email}</td>
                                            <td className="text-center">{customer.gender || "N/A"}</td>
                                            <td className="text-center">{customer.contactNumber}</td>
                                            <td className="text-center flex items-center justify-center">
                                                <button type="button" className="btn btn-danger me-2">
                                                    <i className="bx bx-trash me-1"></i>
                                                    Delete
                                                </button>

                                                <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modal_createEditCustomer">
                                                    <i className="bx bx-edit-alt me-1"></i>
                                                    Edit
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr className="text-bg-secondary">
                                        <td colSpan="5" className="text-center">
                                            <div className="alert alert-dark mb-0" role="alert">There are no records available</div>
                                        </td>
                                    </tr>
                                )} */}
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

                    <div id="pagination">
                        <div className="demo-inline-spacing d-flex justify-content-center align-items-center pe-3 justify-content-md-end">
                            {/* Pagination */}
                        </div>
                    </div>
                </div >
            </div>

            <CustomerFormModal />
        </>
    )
}

export default CustomerManagement