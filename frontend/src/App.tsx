import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import HealthInsurance from './pages/HealthInsurance';
import LifeInsurance from './pages/LifeInsurance';
import MotorInsurance from './pages/MotorInsurance';
import ClaimSupport from './pages/ClaimSupport';
import ContactPage from './pages/ContactPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import LeadsPage from './pages/admin/LeadsPage';
import UsersPage from './pages/admin/UsersPage';
import CustomerDetailsPage from './pages/admin/CustomerDetailsPage';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="flex flex-col min-h-screen">
                    <Navbar />
                    <main className="flex-grow">
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/health-insurance" element={<HealthInsurance />} />
                            <Route path="/life-insurance" element={<LifeInsurance />} />
                            <Route path="/motor-insurance" element={<MotorInsurance />} />
                            <Route path="/claim-support" element={<ClaimSupport />} />
                            <Route path="/contact" element={<ContactPage />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />

                            {/* Protected User Dashboard */}
                            <Route path="/dashboard" element={
                                <ProtectedRoute>
                                    <ErrorBoundary>
                                        <Dashboard />
                                    </ErrorBoundary>
                                </ProtectedRoute>
                            } />

                            {/* Protected Admin Routes */}
                            <Route path="/admin" element={
                                <ProtectedRoute>
                                    <AdminDashboard />
                                </ProtectedRoute>
                            } />
                            <Route path="/admin/leads" element={
                                <ProtectedRoute>
                                    <LeadsPage />
                                </ProtectedRoute>
                            } />
                            <Route path="/admin/users" element={
                                <ProtectedRoute>
                                    <UsersPage />
                                </ProtectedRoute>
                            } />
                            <Route path="/admin/users/:id" element={
                                <ProtectedRoute>
                                    <CustomerDetailsPage />
                                </ProtectedRoute>
                            } />
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
