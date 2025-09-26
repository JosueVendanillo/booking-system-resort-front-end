import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('CUSTOMER'); // Default role is CUSTOMER
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await axios.post('http://localhost:8080/api/auth/register', {
        fullName,  // matches backend User.fullName
        email,     // matches backend User.email
        password,   // matches backend expects "password"
        role
      });
      alert("Registration successful");
      navigate('/login');
    } catch (error) {
      alert("Registration failed. Possible user is already existing or Try again.");
      console.error(error);
    }
  };



    return (
        <div className="d-flex flex-column flex-md-row vh-100">
            {/* Left Column */}
            <div
                className="col-md-6 d-none d-md-flex align-items-center justify-content-center"
                style={{
                    background: 'linear-gradient(135deg, #3f3d56, #6c63ff)',
                    color: 'white',
                    padding: '40px',
                }}
            >
                <div className="text-center px-4">
                    <h1 className="display-3 fw-bold mb-4 text-white">Join Us!</h1>
                    <p className="fs-4">
                        Create an account to enjoy exclusive benefits and start your journey with Blue Belle Resort.
                    </p>
                </div>
            </div>

            {/* Right Column */}
            <div className="col-md-6 d-flex align-items-center justify-content-center bg-light flex-grow-1">
                <div className="card shadow-lg p-5" style={{ width: '100%', maxWidth: '400px', borderRadius: '15px' }}>
                    <h2 className="text-center mb-4 text-primary">Register</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="fullName" className="form-label fw-semibold">Full Name</label>
                            <input
                                type="text"
                                className="form-control"
                                id="fullName"
                                placeholder="Enter your full name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                                style={{ borderRadius: '10px' }}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label fw-semibold">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={{ borderRadius: '10px' }}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label fw-semibold">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{ borderRadius: '10px' }}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="confirmPassword" className="form-label fw-semibold">Confirm Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="confirmPassword"
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                style={{ borderRadius: '10px' }}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="userRole"className="form-label fw-semibold">User Role</label>
                            <select
                                id="userRole"
                                className="form-select"
                                style={{ borderRadius: '10px' }}
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                            >
                                <option value="CUSTOMER">Customer</option>
                                <option value="ADMIN">Admin</option>
                                <option value="MODERATOR">Moderator</option>
                            </select>
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary w-100 py-2"
                            style={{ borderRadius: '10px', fontWeight: 'bold' }}
                        >
                            Register
                        </button>
                    </form>
                    <p className="text-center mt-3">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary fw-semibold">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;
