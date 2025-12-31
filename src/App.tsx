import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import Dashboard from './pages/Dashboard';
import RolesPage from './pages/admin/RolesPage';
import MenusPage from './pages/admin/MenusPage';
import UserRightsPage from './pages/admin/UserRightsPage';

const App: React.FC = () => {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/reset-password" element={<ResetPasswordPage />} />

                    {/* Protected Routes */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/dashboard" element={<Dashboard />} />

                        {/* Admin Routes */}
                        <Route path="/admin/roles" element={<RolesPage />} />
                        <Route path="/admin/menus" element={<MenusPage />} />
                        <Route path="/admin/permissions" element={<UserRightsPage />} />

                        {/* Redirect root to dashboard if authenticated */}
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    </Route>

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
};

export default App;
