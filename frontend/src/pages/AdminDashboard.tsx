import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
    Users, FileText, TrendingUp, Activity, Calendar, MapPin, ArrowRight
} from 'lucide-react';
import AdminLayout from '../components/admin/AdminLayout';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await api.get('/admin/stats');
            setData(response.data);
        } catch (error) {
            console.error('Error fetching admin data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-screen">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            </AdminLayout>
        );
    }

    if (!data) return null;

    const { leads, users, policies } = data;

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                    <div className="text-sm text-gray-500">
                        Last updated: {new Date().toLocaleTimeString()}
                    </div>
                </div>

                {/* Top Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <SummaryCard
                        title="Total Leads"
                        value={leads.total}
                        subtext={`${leads.today} New Today`}
                        icon={TrendingUp}
                        color="blue"
                    />
                    <SummaryCard
                        title="Conversion Rate"
                        value={`${leads.conversionRate}%`}
                        subtext={`${leads.month} Leads this Month`}
                        icon={Activity}
                        color="purple"
                    />
                    <SummaryCard
                        title="Active Users"
                        value={users.total}
                        subtext={`${users.withPolicy} with Policy`}
                        icon={Users}
                        color="green"
                    />
                    <SummaryCard
                        title="Active Policies"
                        value={policies.active}
                        subtext={`₹${(policies.totalPremium / 100000).toFixed(1)}L Premium`}
                        icon={FileText}
                        color="yellow"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Leads Overview */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Leads Breakdown */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-bold text-gray-900">Leads Overview</h2>
                                <button onClick={() => navigate('/admin/leads')} className="text-sm text-blue-600 hover:underline">View All</button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">By Status</h3>
                                    <div className="space-y-2">
                                        {Object.entries(leads.byStatus).map(([status, count]: any) => (
                                            <div key={status} className="flex justify-between items-center text-sm">
                                                <span className="text-gray-600">{status}</span>
                                                <div className="flex items-center">
                                                    <div className="w-24 h-2 bg-gray-100 rounded-full mr-3 overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full ${status === 'New' ? 'bg-green-500' :
                                                                status === 'Contacted' ? 'bg-yellow-500' :
                                                                    status === 'Converted' ? 'bg-purple-500' : 'bg-gray-500'
                                                                }`}
                                                            style={{ width: `${(count / leads.total) * 100}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="font-medium text-gray-900">{count}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">By Product</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {Object.entries(leads.byProduct).map(([product, count]: any) => (
                                            <span key={product} className="px-3 py-1 bg-gray-50 text-gray-700 rounded-full text-xs font-medium border border-gray-200">
                                                {product}: {count}
                                            </span>
                                        ))}
                                    </div>
                                    <h3 className="text-xs font-semibold text-gray-500 uppercase mt-4 mb-3">Top Cities</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {leads.topCities.map((city: any) => (
                                            <span key={city.city} className="flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                                                <MapPin className="h-3 w-3 mr-1" />
                                                {city.city} ({city.count})
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Leads Table */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                                <h2 className="text-lg font-bold text-gray-900">Recent Leads</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Name</th>
                                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Product</th>
                                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {leads.recent.map((lead: any) => (
                                            <tr key={lead.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-3 text-sm font-medium text-gray-900">{lead.name}</td>
                                                <td className="px-6 py-3 text-sm text-gray-600">{lead.product_type}</td>
                                                <td className="px-6 py-3">
                                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${lead.status === 'New' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                        }`}>{lead.status}</span>
                                                </td>
                                                <td className="px-6 py-3 text-sm text-gray-500">{new Date(lead.created_at).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Users & Renewals */}
                    <div className="space-y-6">
                        {/* Renewals Widget */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center mb-4">
                                <Calendar className="h-5 w-5 text-orange-500 mr-2" />
                                <h2 className="text-lg font-bold text-gray-900">Upcoming Renewals</h2>
                            </div>
                            <div className="space-y-4">
                                {policies.renewals.length === 0 ? (
                                    <p className="text-sm text-gray-500">No renewals in next 30 days.</p>
                                ) : (
                                    policies.renewals.map((renewal: any) => (
                                        <div key={renewal.id} className="flex justify-between items-center p-3 bg-orange-50 rounded-lg border border-orange-100">
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">{renewal.user}</p>
                                                <p className="text-xs text-gray-600">{renewal.product} • {new Date(renewal.expiryDate).toLocaleDateString()}</p>
                                            </div>
                                            <button
                                                onClick={() => navigate(`/admin/users/${renewal.userId}`)}
                                                className="text-orange-600 hover:text-orange-800"
                                            >
                                                <ArrowRight className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Recent Users */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-bold text-gray-900">New Users</h2>
                                <button onClick={() => navigate('/admin/users')} className="text-sm text-blue-600 hover:underline">View All</button>
                            </div>
                            <div className="space-y-4">
                                {users.recent.map((u: any) => (
                                    <div key={u.id} className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-xs">
                                                {u.name?.charAt(0).toUpperCase() || 'U'}
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm font-medium text-gray-900">{u.name}</p>
                                                <p className="text-xs text-gray-500">{u.email}</p>
                                            </div>
                                        </div>
                                        <span className="text-xs text-gray-400">{new Date(u.createdAt || u.created_at).toLocaleDateString()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

const SummaryCard = ({ title, value, subtext, icon: Icon, color }: any) => {
    const colorClasses: any = {
        blue: 'bg-blue-50 text-blue-600',
        purple: 'bg-purple-50 text-purple-600',
        green: 'bg-green-50 text-green-600',
        yellow: 'bg-yellow-50 text-yellow-600',
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
                    <p className="text-xs text-gray-500 mt-1">{subtext}</p>
                </div>
                <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
                    <Icon className="h-6 w-6" />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
