import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../services/api';
import { Search, Filter, ChevronLeft, ChevronRight, Plus, Download } from 'lucide-react';
import AddLeadModal from '../../components/admin/AddLeadModal';
import LeadDetails from '../../components/admin/LeadDetails';

const LeadsPage = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalLeads, setTotalLeads] = useState(0);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

    // Filters
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [productType, setProductType] = useState('');
    const [city, setCity] = useState('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchLeads();
    }, [page, status, productType, city]); // Refetch when these change

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setPage(1); // Reset to page 1 on search
            fetchLeads();
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const fetchLeads = async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '50',
                ...(search && { search }),
                ...(status && { status }),
                ...(productType && { productType }),
                ...(city && { city }),
            });

            const response = await api.get(`/leads?${params}`);
            setLeads(response.data.leads || []); // Default to empty array
            setTotalPages(response.data.pages || 1);
            setTotalLeads(response.data.total || 0);
        } catch (err: any) {
            console.error('Error fetching leads:', err);
            const msg = err.response?.data?.message || err.message || 'Failed to load leads';
            setError(msg);
            setLeads([]);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    return (
        <AdminLayout>
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Leads Management</h1>
                    <p className="text-sm text-gray-500 mt-1">Total Leads: {totalLeads}</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                    </button>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Lead
                    </button>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search name, email, phone..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                        />
                    </div>

                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
                    >
                        <option value="">All Statuses</option>
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Quote Shared">Quote Shared</option>
                        <option value="Converted">Converted</option>
                        <option value="Lost">Lost</option>
                    </select>

                    <select
                        value={productType}
                        onChange={(e) => setProductType(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
                    >
                        <option value="">All Products</option>
                        <option value="Health Insurance">Health Insurance</option>
                        <option value="Life Insurance">Life Insurance</option>
                        <option value="Motor Insurance">Motor Insurance</option>
                    </select>

                    <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
                    >
                        <option value="">All Cities</option>
                        {/* We could populate this dynamically later */}
                        <option value="Mumbai">Mumbai</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Bangalore">Bangalore</option>
                    </select>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">
                                {error}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">City</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                        Loading leads...
                                    </td>
                                </tr>
                            ) : leads.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                        No leads found matching your filters.
                                    </td>
                                </tr>
                            ) : (
                                leads.map((lead: any) => (
                                    <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                                            {lead.tags && lead.tags.includes('Duplicate') && (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 mt-1">
                                                    Duplicate
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">{lead.phone}</div>
                                            <div className="text-xs text-gray-500">{lead.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                                {lead.product_type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{lead.city}</td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={lead.status}
                                                onChange={async (e) => {
                                                    const newStatus = e.target.value;
                                                    // Optimistic update
                                                    const updatedLeads = leads.map((l: any) =>
                                                        l.id === lead.id ? { ...l, status: newStatus } : l
                                                    );
                                                    setLeads(updatedLeads as any);

                                                    try {
                                                        await api.patch(`/leads/${lead.id}`, { status: newStatus });
                                                    } catch (error) {
                                                        console.error('Failed to update status', error);
                                                        // Revert on failure
                                                        fetchLeads();
                                                    }
                                                }}
                                                className={`text-xs font-medium px-2.5 py-1 rounded-full border-0 cursor-pointer focus:ring-2 focus:ring-blue-500
                                                    ${lead.status === 'New' ? 'bg-green-100 text-green-800' :
                                                        lead.status === 'Contacted' ? 'bg-yellow-100 text-yellow-800' :
                                                            lead.status === 'Converted' ? 'bg-purple-100 text-purple-800' :
                                                                lead.status === 'Lost' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}
                                            >
                                                <option value="New">New</option>
                                                <option value="Contacted">Contacted</option>
                                                <option value="Quote Shared">Quote Shared</option>
                                                <option value="Converted">Converted</option>
                                                <option value="Lost">Lost</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(lead.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => setSelectedLeadId(lead.id)}
                                                className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                        Page {page} of {totalPages}
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 1}
                            className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page === totalPages}
                            className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>

            <AddLeadModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={fetchLeads}
            />

            <LeadDetails
                leadId={selectedLeadId}
                onClose={() => setSelectedLeadId(null)}
            />
        </AdminLayout>
    );
};

export default LeadsPage;
