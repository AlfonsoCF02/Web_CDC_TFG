import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/shared/Header';
import Footer from './components/shared/Footer';
import LoginPage from './pages/login/LoginPage';
import ForgotPasswordPage from './pages/login/ForgotPasswordPage';
import ResetPasswordPage from './pages/login/ResetPasswordPage';
import RegisterPage from './pages/register/RegisterPage';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegisterPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
