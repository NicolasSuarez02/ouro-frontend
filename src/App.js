import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerificationSent from './pages/VerificationSent';
import VerifyEmail from './pages/VerifyEmail';
import RegisterClient from './pages/RegisterClient';
import Success from './pages/Success';
import AdminDashboard from './pages/AdminDashboard';
import Dashboard from './pages/Dashboard';
import RegisterTherapist from './pages/RegisterTherapist';
import EditTherapist from './pages/EditTherapist';
import Terapeutas from './pages/Terapeutas';
import TherapistDetail from './pages/TherapistDetail';
import ManageAvailability from './pages/ManageAvailability';
import ClientAppointments from './pages/ClientAppointments';
import Recursos from './pages/Recursos';
import SubirRecurso from './pages/SubirRecurso';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verification-sent" element={<VerificationSent />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/register-client" element={<RegisterClient />} />
        <Route path="/success" element={<Success />} />
        <Route path="/terapeutas" element={<Terapeutas />} />
        <Route path="/terapeutas/:id" element={<TherapistDetail />} />
        <Route path="/biblioteca" element={<Recursos category="BIBLIOTECA" titulo="Biblioteca de Alejandría" />} />
        <Route path="/formaciones" element={<Recursos category="FORMACIONES" titulo="Formaciones" />} />
        <Route path="/terminos" element={<TermsPage />} />
        <Route path="/privacidad" element={<PrivacyPage />} />

        {/* Protegidas — requieren sesión */}
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/register-therapist" element={<PrivateRoute><RegisterTherapist /></PrivateRoute>} />
        <Route path="/edit-therapist" element={<PrivateRoute><EditTherapist /></PrivateRoute>} />
        <Route path="/manage-availability" element={<PrivateRoute><ManageAvailability /></PrivateRoute>} />
        <Route path="/mis-turnos" element={<PrivateRoute><ClientAppointments /></PrivateRoute>} />
        <Route path="/subir-recurso" element={<PrivateRoute><SubirRecurso /></PrivateRoute>} />

        {/* Protegida — solo ADMIN */}
        <Route path="/admin" element={<PrivateRoute requiredRole="ADMIN"><AdminDashboard /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
