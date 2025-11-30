import React from 'react';
import LeadForm from '../components/LeadForm';
import { ShieldCheck } from 'lucide-react';

const LifeInsurance = () => {
    const formFields = [
        { name: 'fullName', label: 'Full Name', type: 'text', required: true },
        { name: 'phone', label: 'Mobile Number', type: 'tel', required: true },
        { name: 'dob', label: 'Date of Birth', type: 'date', required: true },
        { name: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Other'], required: true },
        { name: 'annualIncome', label: 'Annual Income', type: 'select', options: ['Below 5 Lacs', '5-10 Lacs', '10-15 Lacs', '15 Lacs+'], required: true },
        { name: 'tobacco', label: 'Do you consume tobacco/nicotine?', type: 'select', options: ['No', 'Yes'], required: true },
        { name: 'coverage', label: 'Coverage Amount Required', type: 'select', options: ['50 Lacs', '1 Crore', '2 Crores', '5 Crores'], required: true },
    ];

    return (
        <div className="bg-white min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div className="order-2 lg:order-1">
                        <LeadForm
                            productType="term"
                            fields={formFields}
                            title="Compare Term Life Plans"
                            subTitle="Secure your family's future today"
                        />
                    </div>

                    {/* Right Content */}
                    <div className="order-1 lg:order-2">
                        <div className="bg-blue-50 p-8 rounded-2xl">
                            <ShieldCheck className="h-16 w-16 text-blue-600 mb-6" />
                            <h1 className="text-4xl font-extrabold text-gray-900 mb-6">
                                Term Life Insurance
                            </h1>
                            <p className="text-lg text-gray-700 mb-6">
                                Pure protection plans that offer high life cover at affordable premiums. Ensure your family's financial stability even in your absence.
                            </p>
                            <ul className="space-y-3 text-gray-600">
                                <li>• High Cover at Low Premium</li>
                                <li>• Cover up to 85 years age</li>
                                <li>• Tax Benefits u/s 80C</li>
                                <li>• Critical Illness Riders available</li>
                                <li>• Claim Settlement Ratio &gt; 98%</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LifeInsurance;
