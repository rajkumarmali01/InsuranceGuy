import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../services/api';
import {
    ArrowLeft, Mail, Phone, MapPin, FileText, Download,
    Shield, Clock, CheckCircle, AlertCircle
} from 'lucide-react';

const CustomerDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCustomerDetails();
    }, [id]);

    const fetchCustomerDetails = async () => {
        try {
            const response = await api.get(`/admin/users/${id}`);
            setData(response.data);
        } catch (error) {
            console.error('Error fetching customer details:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="text-gray-500">Loading profile...</div>
                </div>
            </AdminLayout>
        );
    }

    if (!data) {
        return (
            <AdminLayout>
                <div className="text-center py-12">
                    <h2 className="text-xl font-semibold text-gray-900">User not found</h2>
                    <button onClick={() => navigate('/admin/users')} className="mt-4 text-blue-600 hover:underline">
                        Back to Users
                    </button>
                </div>
            </AdminLayout>
        );
    }

    const { user, policies, stats } = data;

    return (
        <AdminLayout>
            <div className="mb-6">
                <button
                    onClick={() => navigate('/admin/users')}
                    className="flex items-center text-sm text-gray-500 hover:text-gray-900 mb-4"
                >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to Users
                </button>
                <h1 className="text-2xl font-bold text-gray-900">Client Profile</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Profile & Timeline */}
                <div className="space-y-6">
                    {/* Profile Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center mb-6">
                            <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-2xl">
                                {user.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div className="ml-4">
                                <h2 className="text-lg font-bold text-gray-900">{user.name}</h2>
                                <p className="text-sm text-gray-500">Client ID: #{user.id.slice(0, 6)}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start">
                                <Mail className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Email</p>
                                    <p className="text-sm text-gray-500">{user.email}</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <Phone className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Phone</p>
                                    <p className="text-sm text-gray-500">{user.phone || 'Not provided'}</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <MapPin className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Address</p>
                                    <p className="text-sm text-gray-500">{user.address || 'Not provided'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-100">
                            <div className="grid grid-cols-2 gap-4 text-center">
                                <div className="bg-blue-50 rounded-lg p-3">
                                    <p className="text-xs text-blue-600 font-medium uppercase">Policies</p>
                                    <p className="text-xl font-bold text-blue-900">{stats.totalPolicies}</p>
                                </div>
                                <div className="bg-green-50 rounded-lg p-3">
                                    <p className="text-xs text-green-600 font-medium uppercase">Active</p>
                                    <p className="text-xl font-bold text-green-900">{stats.activePolicies}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Timeline (Mock for now) */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-gray-900">Timeline</h3>
                        </div>
                        <div className="space-y-6">
                            <div className="relative pl-6 border-l-2 border-gray-200">
                                <div className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></div>
                                <p className="text-sm font-medium text-gray-900">Account Created</p>
                                <p className="text-xs text-gray-500">{new Date(user.createdAt || user.created_at).toLocaleDateString()}</p>
                            </div>
                            {/* We can add more real events later */}
                        </div>
                    </div>
                </div>

                {/* Right Column: Policies & Documents */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Policy List */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Policy List</h3>
                        <div className="space-y-4">
                            {policies.length === 0 ? (
                                <div className="bg-white p-8 rounded-xl border border-gray-100 text-center text-gray-500">
                                    No policies found for this client.
                                </div>
                            ) : (
                                policies.map((policy: any) => (
                                    <div key={policy.id} className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start space-x-4">
                                                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                                                    <Shield className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900">{policy.policyType} Insurance</h4>
                                                    <p className="text-sm text-gray-500">#{policy.policyNumber || 'PENDING'}</p>
                                                    <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
                                                        <span>Premium: ₹{policy.premium || 0}</span>
                                                        <span>•</span>
                                                        <span>Sum Insured: ₹{policy.sumInsured || 0}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                                ${policy.status === 'Active' ? 'bg-green-100 text-green-800' :
                                                    policy.status === 'Pending Verification' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                                                {policy.status}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Documents */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-gray-900">Documents</h3>
                        </div>
                        <div className="space-y-3">
                            {policies.map((policy: any) => (
                                policy.fileUrl && (
                                    <div key={`doc-${policy.id}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group hover:bg-blue-50 transition-colors">
                                        <div className="flex items-center">
                                            <FileText className="h-5 w-5 text-gray-400 group-hover:text-blue-500" />
                                            <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-blue-700">
                                                Policy Document - {policy.policyType}
                                            </span>
                                        </div>
                                        <a
                                            href={policy.fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-400 hover:text-blue-600"
                                        >
                                            <Download className="h-5 w-5" />
                                        </a>
                                    </div>
                                )
                            ))}
                            {policies.filter((p: any) => p.fileUrl).length === 0 && (
                                <p className="text-sm text-gray-500 italic">No documents available.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default CustomerDetailsPage;
