import React, { useState } from 'react';
import api from '../services/api';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface FormField {
    name: string;
    label: string;
    type: string;
    placeholder?: string;
    options?: string[];
    required?: boolean;
}

interface LeadFormProps {
    productType: string;
    fields: FormField[];
    title?: string;
    subTitle?: string;
}

const LeadForm: React.FC<LeadFormProps> = ({ productType, fields, title, subTitle }) => {
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            // Basic validation for required fields
            const missingFields = fields.filter(f => f.required && !formData[f.name]);
            if (missingFields.length > 0) {
                throw new Error(`Please fill in all required fields: ${missingFields.map(f => f.label).join(', ')}`);
            }

            const payload = {
                fullName: formData.fullName || formData.name, // Handle both name fields if present
                phone: formData.phone || formData.mobile,
                email: formData.email,
                city: formData.city,
                productType,
                details: formData, // Send all form data as details
                sourcePage: window.location.pathname,
            };

            await api.post('/leads', payload);
            setSuccess(true);
            setFormData({});
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="bg-green-50 p-8 rounded-xl text-center border border-green-100 shadow-sm">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-green-800 mb-2">Thank You!</h3>
                <p className="text-green-700">We have received your request. Our expert will call you shortly.</p>
                <button
                    onClick={() => setSuccess(false)}
                    className="mt-6 text-green-600 hover:text-green-800 font-medium underline"
                >
                    Submit another request
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-100">
            {title && <h3 className="text-2xl font-bold text-gray-800 mb-2">{title}</h3>}
            {subTitle && <p className="text-gray-500 mb-6">{subTitle}</p>}

            {error && (
                <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 flex items-start text-sm">
                    <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {fields.map((field) => (
                    <div key={field.name}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {field.label} {field.required && <span className="text-red-500">*</span>}
                        </label>
                        {field.type === 'select' ? (
                            <select
                                name={field.name}
                                value={formData[field.name] || ''}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                required={field.required}
                            >
                                <option value="">Select {field.label}</option>
                                {field.options?.map((opt) => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        ) : (
                            <input
                                type={field.type}
                                name={field.name}
                                placeholder={field.placeholder}
                                value={formData[field.name] || ''}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                required={field.required}
                            />
                        )}
                    </div>
                ))}

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition flex justify-center items-center disabled:opacity-70"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin mr-2 h-5 w-5" />
                                Submitting...
                            </>
                        ) : (
                            'Get Best Quote'
                        )}
                    </button>
                    <p className="text-xs text-gray-400 text-center mt-3">
                        By clicking, you agree to our Terms & Privacy Policy.
                    </p>
                </div>
            </form>
        </div>
    );
};

export default LeadForm;
