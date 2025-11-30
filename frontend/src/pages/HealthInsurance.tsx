import React from 'react';
import LeadForm from '../components/LeadForm';
import { Check } from 'lucide-react';

const HealthInsurance = () => {
    const formFields = [
        { name: 'fullName', label: 'Full Name', type: 'text', required: true },
        { name: 'phone', label: 'Mobile Number', type: 'tel', required: true },
        { name: 'city', label: 'City', type: 'text', required: true },
        { name: 'age', label: 'Age of Eldest Member', type: 'number', required: true },
        { name: 'members', label: 'Members to Cover', type: 'select', options: ['Self', 'Self + Spouse', 'Self + Spouse + 1 Child', 'Self + Spouse + 2 Children', 'Parents'], required: true },
        { name: 'existingDisease', label: 'Any Existing Disease?', type: 'select', options: ['No', 'Diabetes', 'Hypertension', 'Heart Condition', 'Other'], required: true },
    ];

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-6">
                            Protect Your Family with Best Health Insurance
                        </h1>
                        <p className="text-lg text-gray-600 mb-8">
                            Get cashless treatment at 10,000+ hospitals. Compare plans from top insurers starting at just ₹500/month.
                        </p>

                        <div className="space-y-4">
                            {[
                                'Cashless Hospitalization',
                                'Pre & Post Hospitalization Cover',
                                'No Claim Bonus up to 100%',
                                'Free Annual Health Check-up',
                                'Tax Benefits u/s 80D'
                            ].map((item, index) => (
                                <div key={index} className="flex items-center">
                                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3">
                                        <Check className="h-4 w-4 text-green-600" />
                                    </div>
                                    <span className="text-gray-700 font-medium">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Form */}
                    <div>
                        <LeadForm
                            productType="health"
                            fields={formFields}
                            title="Get Health Insurance Quotes"
                            subTitle="Fill the details to view plans instantly"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HealthInsurance;
