import React, { useState } from 'react';
import api from '../services/api';
import { Mail, Phone, MapPin, Loader2, CheckCircle } from 'lucide-react';

const ContactPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/contact', formData);
            setSuccess(true);
            setFormData({ name: '', email: '', phone: '', message: '' });
        } catch (error) {
            console.error(error);
            alert('Failed to send message. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
                    <p className="text-gray-600 text-lg">Have questions? We'd love to hear from you.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <div className="bg-blue-50 p-8 rounded-2xl">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
                        <div className="space-y-6">
                            <div className="flex items-start">
                                <div className="bg-white p-3 rounded-full shadow-sm mr-4">
                                    <Phone className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Phone</h3>
                                    <p className="text-gray-600">+91 98765 43210</p>
                                    <p className="text-gray-500 text-sm">Mon-Sat 9am to 7pm</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="bg-white p-3 rounded-full shadow-sm mr-4">
                                    <Mail className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Email</h3>
                                    <p className="text-gray-600">hello@insuranceguy.in</p>
                                    <p className="text-gray-500 text-sm">We reply within 24 hours</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="bg-white p-3 rounded-full shadow-sm mr-4">
                                    <MapPin className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Office</h3>
                                    <p className="text-gray-600">123, Insurance Plaza, Sector 18,<br />Noida, Uttar Pradesh - 201301</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div>
                        {success ? (
                            <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-green-50 rounded-2xl border border-green-100">
                                <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                                <h3 className="text-2xl font-bold text-green-800 mb-2">Message Sent!</h3>
                                <p className="text-green-700">Thanks for reaching out. We will get back to you shortly.</p>
                                <button
                                    onClick={() => setSuccess(false)}
                                    className="mt-6 text-green-600 hover:text-green-800 font-medium underline"
                                >
                                    Send another message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                        <input
                                            type="tel"
                                            required
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                    <textarea
                                        required
                                        rows={4}
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition flex justify-center items-center"
                                >
                                    {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Send Message'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
