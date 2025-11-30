import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white pt-12 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-1">
                        <h3 className="text-xl font-bold mb-4">Insurance Guy</h3>
                        <p className="text-gray-400 text-sm">
                            Your trusted partner for all insurance needs. Compare and buy the best plans.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-4">Insurance</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link to="/health-insurance" className="hover:text-white">Health Insurance</Link></li>
                            <li><Link to="/life-insurance" className="hover:text-white">Life Insurance</Link></li>
                            <li><Link to="/motor-insurance" className="hover:text-white">Car Insurance</Link></li>
                            <li><Link to="/motor-insurance" className="hover:text-white">Bike Insurance</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-4">Support</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link to="/claim-support" className="hover:text-white">Claim Assistance</Link></li>
                            <li><Link to="/contact" className="hover:text-white">Contact Us</Link></li>
                            <li><Link to="/login" className="hover:text-white">Admin Login</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-4">Disclaimer</h4>
                        <p className="text-xs text-gray-500">
                            Insurance is a subject matter of solicitation. The information provided on this website is for informational purposes only. Please read the policy documents carefully before concluding a sale.
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                            IRDAI Registration No: XXXXXX (Placeholder)
                        </p>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-500">
                    &copy; {new Date().getFullYear()} Insurance Guy. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
