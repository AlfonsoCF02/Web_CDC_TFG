import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/shared/Header';
import Footer from './components/shared/Footer';
import LoginPage from './pages/login/LoginPage';
import ForgotPasswordPage from './pages/login/ForgotPasswordPage';
import ResetPasswordPage from './pages/login/ResetPasswordPage';
import RegisterPage from './pages/register/RegisterPage';
import ManageUsersPage from './pages/admin/manageUsers';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import EditUserPage from './pages/user/modifyUserPage';
import ProfilePage from './pages/profilePage';
import ManageCategories from './pages/admin/manageCategories';

import { AuthProvider } from './AuthProvider';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegisterPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/manage-users" element={<ManageUsersPage />} />
          <Route path="/edit-user/:id" element={<EditUserPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/manage-categories" element={<ManageCategories />} />
        </Routes>
        <Footer />
      </AuthProvider>
    </Router>
  );
};

export default App;
