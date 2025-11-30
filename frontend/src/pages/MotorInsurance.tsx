import React, { useState } from 'react';
import LeadForm from '../components/LeadForm';
import { Car, Bike, Truck } from 'lucide-react';

const MotorInsurance = () => {
    const [activeTab, setActiveTab] = useState<'car' | 'bike' | 'commercial'>('car');

    const commonFields = [
        { name: 'fullName', label: 'Full Name', type: 'text', required: true },
        { name: 'phone', label: 'Mobile Number', type: 'tel', required: true },
        { name: 'regNumber', label: 'Vehicle Registration No.', type: 'text', placeholder: 'MH-01-AB-1234', required: true },
    ];

    const carFields = [
        ...commonFields,
        { name: 'makeModel', label: 'Car Make & Model', type: 'text', required: true },
        { name: 'regYear', label: 'Registration Year', type: 'number', required: true },
        { name: 'policyExpiry', label: 'Previous Policy Expiry', type: 'date', required: true },
    ];

    const bikeFields = [
        ...commonFields,
        { name: 'makeModel', label: 'Bike Make & Model', type: 'text', required: true },
        { name: 'regYear', label: 'Registration Year', type: 'number', required: true },
    ];

    const commercialFields = [
        ...commonFields,
        { name: 'vehicleType', label: 'Vehicle Type', type: 'select', options: ['Truck', 'Bus', 'Taxi', 'Auto Rickshaw', 'Other'], required: true },
    ];

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Motor Insurance</h1>
                    <p className="text-gray-600">Save up to 80% on your vehicle insurance renewal.</p>
                </div>

                {/* Tabs */}
                <div className="flex justify-center mb-8">
                    <div className="bg-white p-1 rounded-xl shadow-sm inline-flex">
                        <button
                            onClick={() => setActiveTab('car')}
                            className={`flex items-center px-6 py-3 rounded-lg font-medium transition ${activeTab === 'car' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            <Car className="mr-2 h-5 w-5" /> Car
                        </button>
                        <button
                            onClick={() => setActiveTab('bike')}
                            className={`flex items-center px-6 py-3 rounded-lg font-medium transition ${activeTab === 'bike' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            <Bike className="mr-2 h-5 w-5" /> Bike
                        </button>
                        <button
                            onClick={() => setActiveTab('commercial')}
                            className={`flex items-center px-6 py-3 rounded-lg font-medium transition ${activeTab === 'commercial' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            <Truck className="mr-2 h-5 w-5" /> Commercial
                        </button>
                    </div>
                </div>

                {/* Form Container */}
                <div className="max-w-xl mx-auto">
                    {activeTab === 'car' && (
                        <LeadForm
                            key="car"
                            productType="car"
                            fields={carFields}
                            title="Car Insurance Quote"
                        />
                    )}
                    {activeTab === 'bike' && (
                        <LeadForm
                            key="bike"
                            productType="bike"
                            fields={bikeFields}
                            title="Two-Wheeler Insurance Quote"
                        />
                    )}
                    {activeTab === 'commercial' && (
                        <LeadForm
                            key="commercial"
                            productType="commercial"
                            fields={commercialFields}
                            title="Commercial Vehicle Quote"
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default MotorInsurance;
