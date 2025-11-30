import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Loader2, Shield, Calendar, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SuccessModal from '../components/SuccessModal';

interface Policy {
    id: string;
    policyNumber: string;
    type: string;
    premium: number;
    expiryDate: string;
    status: string;
}

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [policies, setPolicies] = useState<Policy[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploadType, setUploadType] = useState('Health Insurance');
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPolicies = async () => {
            if (!user) {
                setLoading(false);
                return;
            }
            try {
                const { data } = await api.get('/policies/mine');
                console.log('Fetched policies:', data);
                setPolicies(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error fetching policies:', error);
                setPolicies([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPolicies();
    }, [user]);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const handleUploadPolicy = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!uploadFile) return;

        const formData = new FormData();
        formData.append('type', uploadType);
        formData.append('file', uploadFile);

        try {
            await api.post('/policies/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Refresh policies
            const { data } = await api.get('/policies/mine');
            setPolicies(data);
            setUploadFile(null);
            setShowSuccessModal(true);
        } catch (error: any) {
            console.error('Error uploading policy:', error);
            alert(error.response?.data?.message || 'Failed to upload policy');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <SuccessModal
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                title="Upload Successful!"
                message="Your policy document has been uploaded securely. Our team will verify it shortly."
            />

            {/* Header */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-600">Welcome, {user?.displayName || user?.email}</span>
                        <button
                            onClick={handleLogout}
                            className="flex items-center text-red-600 hover:text-red-800 font-medium"
                        >
                            <LogOut className="h-5 w-5 mr-1" />
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-500 font-medium">Total Policies</h3>
                            <Shield className="h-8 w-8 text-blue-500" />
                        </div>
                        <p className="text-3xl font-bold text-gray-900">{policies.length}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-500 font-medium">Total Premium</h3>
                            <span className="text-2xl font-bold text-green-600">₹</span>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">
                            {policies.reduce((sum, p) => sum + Number(p.premium), 0).toLocaleString()}
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-500 font-medium">Upcoming Renewals</h3>
                            <Calendar className="h-8 w-8 text-orange-500" />
                        </div>
                        <p className="text-3xl font-bold text-gray-900">
                            {policies.filter(p => new Date(p.expiryDate) > new Date() && new Date(p.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)).length}
                        </p>
                    </div>
                </div>

                {/* Upload Policy Section */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Upload Policy</h2>
                    <form onSubmit={handleUploadPolicy} className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1 w-full">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Type</label>
                            <select
                                value={uploadType}
                                onChange={(e) => setUploadType(e.target.value)}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-4 py-2"
                            >
                                <option value="Health Insurance">Health Insurance</option>
                                <option value="Life Insurance">Life Insurance</option>
                                <option value="Motor Insurance (Car)">Motor Insurance (Car)</option>
                                <option value="Motor Insurance (Bike)">Motor Insurance (Bike)</option>
                            </select>
                        </div>
                        <div className="flex-1 w-full">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Policy Document</label>
                            <div className="relative">
                                <input
                                    type="file"
                                    onChange={(e) => setUploadFile(e.target.files ? e.target.files[0] : null)}
                                    className="block w-full text-sm text-gray-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-md file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-blue-50 file:text-blue-700
                                    hover:file:bg-blue-100"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={!uploadFile}
                            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed h-[42px]"
                        >
                            Upload & Add
                        </button>
                    </form>
                </div>

                {/* Policies List */}
                <h2 className="text-xl font-bold text-gray-800 mb-4">Your Policies</h2>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {policies.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            <Shield className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                            <p>No policies found linked to your account.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Policy No</th>
                                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Premium</th>
                                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry Date</th>
                                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {policies.map((policy) => (
                                        <tr key={policy.id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{policy.policyNumber}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                                    {policy.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">₹{Number(policy.premium).toLocaleString()}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                                {new Date(policy.expiryDate).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${policy.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {policy.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                {(policy as any).fileUrl ? (
                                                    <a
                                                        href={(policy as any).fileUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:text-blue-800"
                                                    >
                                                        Download
                                                    </a>
                                                ) : (
                                                    <span className="text-gray-400">No Document</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
