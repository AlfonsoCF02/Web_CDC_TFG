import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './AuthProvider';
import Header from './components/shared/Header';
import Footer from './components/shared/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/login/LoginPage';
import ForgotPasswordPage from './pages/login/ForgotPasswordPage';
import ResetPasswordPage from './pages/login/ResetPasswordPage';
import RegisterPage from './pages/register/RegisterPage';
import ManageUsersPage from './pages/admin/manageUsers';
import EditUserPage from './pages/user/modifyUserPage';
import ProfilePage from './pages/user/profilePage';
import ManageCategories from './pages/admin/manageCategories';
import ManageProductos from './pages/admin/products/manageProducts';
import CreateProduct from './pages/admin/products/createProduct';
import EditProduct from './pages/admin/products/editProduct';
import CataloguePage from './pages/user/cataloguePage';
import BasketPage from './pages/user/basketPage';
import PaymentPage from './pages/user/paymentPage';
import ManageOrders from './pages/admin/manageOrders';
import MyOrdersPage from './pages/user/myOrdersPage';
import ReservationPage from './pages/user/reservationPage';
import ManageReservations from './pages/admin/manageReservations';
import ManageMyReservations from './pages/user/manageMyReservations';
import NotFoundPage from './pages/NotFoundPage';
import AccessDeniedPage from './pages/AccessDeniedPage';

/******************************************************************************
 *
 * @author          Alfonso Cabezas Fernández
 * 
 * Con la ayuda de la herramienta de inteligencia artificial ChatGPT
 * 
 * @description    Herramienta de carga de las rutas de la aplicación
 * 
 ******************************************************************************/

interface ProtectedRouteProps {
  children: any;
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const type = localStorage.getItem('type');
  const location = useLocation();
  if (!type) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  } else if (!allowedRoles.includes(type)) {
    return <Navigate to="/access-denied" replace />;
  }
  return children;
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegisterPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/manage-users" element={<ProtectedRoute allowedRoles={['admin']}><ManageUsersPage /></ProtectedRoute>} />
          <Route path="/edit-user/:id" element={<ProtectedRoute allowedRoles={['user', 'admin']}><EditUserPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute allowedRoles={['user', 'admin']}><ProfilePage /></ProtectedRoute>} />
          <Route path="/manage-categories" element={<ProtectedRoute allowedRoles={['admin']}><ManageCategories /></ProtectedRoute>} />
          <Route path="/manage-products" element={<ProtectedRoute allowedRoles={['admin']}><ManageProductos /></ProtectedRoute>} />
          <Route path="/create-product" element={<ProtectedRoute allowedRoles={['admin']}><CreateProduct /></ProtectedRoute>} />
          <Route path="/edit-product/:id" element={<ProtectedRoute allowedRoles={['admin']}><EditProduct /></ProtectedRoute>} />
          <Route path="/catalogue" element={<CataloguePage />} />
          <Route path="/basket" element={<BasketPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/manage-orders" element={<ProtectedRoute allowedRoles={['admin']}><ManageOrders /></ProtectedRoute>} />
          <Route path="/my-orders" element={<ProtectedRoute allowedRoles={['user', 'admin']}><MyOrdersPage /></ProtectedRoute>} />
          <Route path="/reservations" element={<ReservationPage />} />
          <Route path="/manage-reservations" element={<ProtectedRoute allowedRoles={['admin']}><ManageReservations /></ProtectedRoute>} />
          <Route path="/my-reservations" element={<ProtectedRoute allowedRoles={['user', 'admin']}><ManageMyReservations /></ProtectedRoute>} />
          <Route path="/access-denied" element={<AccessDeniedPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Footer />
      </AuthProvider>
    </Router>
  );
};

export default App;
