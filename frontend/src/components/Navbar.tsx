import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Phone, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const { user } = useAuth();

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <span className="text-2xl font-bold text-blue-600">Insurance Guy</span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/health-insurance" className="text-gray-700 hover:text-blue-600 font-medium">Health</Link>
                        <Link to="/life-insurance" className="text-gray-700 hover:text-blue-600 font-medium">Life/Term</Link>
                        <Link to="/motor-insurance" className="text-gray-700 hover:text-blue-600 font-medium">Motor</Link>
                        <Link to="/claim-support" className="text-gray-700 hover:text-blue-600 font-medium">Claims</Link>
                        <Link to="/contact" className="text-gray-700 hover:text-blue-600 font-medium">Contact</Link>

                        {(user as any)?.role === 'admin' && (
                            <Link to="/admin" className="text-purple-600 hover:text-purple-800 font-bold">
                                Admin Panel
                            </Link>
                        )}

                        <div className="flex items-center space-x-4">
                            <a href="tel:+919876543210" className="flex items-center text-gray-600 hover:text-blue-600">
                                <Phone className="h-5 w-5 mr-1" />
                                <span className="text-sm font-semibold">98765-43210</span>
                            </a>

                            {user ? (
                                <Link to="/dashboard" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition flex items-center">
                                    <User className="h-4 w-4 mr-2" />
                                    Dashboard
                                </Link>
                            ) : (
                                <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition">
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={toggleMenu}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link to="/health-insurance" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">Health Insurance</Link>
                        <Link to="/life-insurance" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">Life Insurance</Link>
                        <Link to="/motor-insurance" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">Motor Insurance</Link>
                        <Link to="/claim-support" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">Claim Support</Link>
                        <Link to="/contact" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">Contact Us</Link>

                        {(user as any)?.role === 'admin' && (
                            <Link to="/admin" className="block px-3 py-2 rounded-md text-base font-bold text-purple-600 hover:bg-purple-50">Admin Panel</Link>
                        )}

                        {user ? (
                            <Link to="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-blue-600 hover:bg-blue-50">Dashboard</Link>
                        ) : (
                            <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">Login</Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
