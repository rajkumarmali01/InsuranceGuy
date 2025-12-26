import React, { useState } from 'react';
import { Phone, Mail, FileText, Upload } from 'lucide-react';

const ClaimSupport = () => {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate submission
        setTimeout(() => setSubmitted(true), 1000);
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full">
                    <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="h-8 w-8 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Received</h2>
                    <p className="text-gray-600 mb-6">
                        Our claims team will contact you within 30 minutes to assist with your claim process.
                    </p>
                    <button
                        onClick={() => setSubmitted(false)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                        Submit another request
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Claim Assistance</h1>
                    <p className="text-gray-600">
                        We are here to help you during your difficult times. Fill the form below for quick assistance.
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Policy Type</label>
                                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                                        <option>Health Insurance</option>
                                        <option>Car Insurance</option>
                                        <option>Bike Insurance</option>
                                        <option>Life Insurance</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Claim Type</label>
                                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                                        <option>Cashless</option>
                                        <option>Reimbursement</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Insurer Name</label>
                                <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. HDFC Ergo, ICICI Lombard" required />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                                    <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                                    <input type="tel" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Brief Description</label>
                                <textarea className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-24" placeholder="Describe the incident or hospitalization reason..."></textarea>
                            </div>

                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-500">Upload Policy Copy or Photos (Optional)</p>
                                <input type="file" className="hidden" />
                            </div>

                            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition">
                                Request Assistance
                            </button>
                        </form>
                    </div>

                    <div className="bg-gray-50 p-6 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center justify-center text-gray-600">
                            <Phone className="h-5 w-5 mr-2" />
                            <span>Call: 8153026777</span>
                        </div>
                        <div className="flex items-center justify-center text-gray-600">
                            <Mail className="h-5 w-5 mr-2" />
                            <span>claims@insuranceguy.in</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClaimSupport;
