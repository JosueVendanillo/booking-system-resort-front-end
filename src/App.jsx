import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import UserLayout from './layouts/UserLayout';
import Dashboard from './pages/admin/Dashboard';
import AccountManagement from './pages/admin/AccountManagement';
import BookManagement from './pages/admin/BookManagement';
import AmenityManagement from './pages/admin/AmenityManagement';
import CustomerManagement from './pages/admin/CustomerManagement';
import PaymentManagement from './pages/admin/PaymentManagement';
import Homepage from './pages/user/Homepage';
import Gallery from './pages/user/Gallery';
import Login from './pages/user/Login';
import Register from './pages/user/Register';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<AdminLayout />}>
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/account" element={<AccountManagement />} />
        <Route path="/admin/book" element={<BookManagement />} />
        <Route path="/admin/amenity" element={<AmenityManagement />} />
        <Route path="/admin/customer" element={<CustomerManagement />} />
        <Route path="/admin/payment" element={<PaymentManagement />} />
      </Route>

      <Route element={<UserLayout />}>
        <Route path="/" element={<Homepage />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
    </>
  )
)

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App
