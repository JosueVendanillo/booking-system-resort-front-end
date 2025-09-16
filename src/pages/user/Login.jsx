import React, { useState } from 'react';
import { Link,useNavigate,NavLink } from 'react-router-dom';
import axios from 'axios';
import { setUser } from '../../utils/auth';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password!");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post("http://localhost:8080/api/auth/login", {
        email: email,
        password: password,
      });

        console.log("response email:", response.data.email);
        console.log("response fullName:", response.data.fullName);
        console.log("response token:", response.data.token);

      if (response.data) {
        // ✅ Assuming API returns { fullName, email, token }
        const userData = {
          fullName: response.data.fullName,
          email: response.data.email,
          token: response.data.token,
        };

        // Save via util
        setUser(userData);

        console.log("Logged in user:", userData);

        // Redirect to dashboard
        navigate("/admin/dashboard");
      }
    } catch (error) {


      console.error("Login failed:", error.response?.data || error.message);
      alert(error.response?.data?.error || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };
    return (
        <div className="d-flex flex-column flex-md-row vh-100">
            {/* Left Column with Gradient Background */}
            <div
                className="col-md-6 d-none d-md-flex align-items-center justify-content-center"
                style={{
                    background: 'linear-gradient(135deg, #6c63ff, #3f3d56)',
                    color: 'white',
                    padding: '40px',
                }}
            >
                <div className="text-center">
                    <h1 className="display-3 fw-bold mb-4 text-white">Welcome Back!</h1>
                    <p className="fs-4">
                        Experience luxury and comfort at Blue Belle Resort. Log in to access your account and start your journey with us.
                    </p>
                </div>
            </div>

            {/* Right Column with Login Form */}
            <div className="col-md-6 d-flex align-items-center justify-content-center bg-light flex-grow-1">
                <div className="card shadow-lg p-5" style={{ width: '100%', maxWidth: '400px', borderRadius: '15px' }}>
                    <h2 className="text-center mb-4 text-primary">Login</h2>
                    <form onSubmit={handleLogin}>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label fw-semibold">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                placeholder="Enter your email"
                                required
                                style={{ borderRadius: '10px' }}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)} // ✅ update state
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label fw-semibold">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                placeholder="Enter your password"
                                required
                                style={{ borderRadius: '10px' }}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} // ✅ update state
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary w-100 py-2"
                            style={{ borderRadius: "10px", fontWeight: "bold" }}
                            disabled={loading}
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>
                    <p className="text-center mt-3">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-primary fw-semibold">
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;