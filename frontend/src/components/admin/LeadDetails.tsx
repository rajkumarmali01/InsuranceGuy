import React, { useEffect, useState } from 'react';
import { X, Phone, Mail, MapPin, Calendar, Clock, FileText, Edit, CheckCircle, AlertTriangle } from 'lucide-react';
import api from '../../services/api';

interface LeadDetailsProps {
    leadId: string | null;
    onClose: () => void;
}

interface TimelineEntry {
    id: string;
    action: string;
    description: string;
    timestamp: string;
    by: string;
}

interface LeadData {
    id: string;
    name: string;
    email: string;
    phone: string;
    city: string;
    product_type: string;
    status: string;
    vehicle_details?: any;
    sum_insured?: string;
    created_at: string;
    tags?: string[];
}

const LeadDetails: React.FC<LeadDetailsProps> = ({ leadId, onClose }) => {
    const [lead, setLead] = useState<LeadData | null>(null);
    const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [note, setNote] = useState('');
    const [addingNote, setAddingNote] = useState(false);

    useEffect(() => {
        if (leadId) {
            fetchLeadData();
        }
    }, [leadId]);

    const fetchLeadData = async () => {
        setLoading(true);
        try {
            const [leadRes, timelineRes] = await Promise.all([
                api.get(`/leads/${leadId}`),
                api.get(`/leads/${leadId}/timeline`)
            ]);
            setLead(leadRes.data);
            setTimeline(timelineRes.data);
        } catch (error) {
            console.error('Error fetching lead details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddNote = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!note.trim()) return;

        setAddingNote(true);
        try {
            await api.post(`/leads/${leadId}/timeline`, {
                action: 'Note Added',
                description: note
            });
            setNote('');
            // Refresh timeline
            const timelineRes = await api.get(`/leads/${leadId}/timeline`);
            setTimeline(timelineRes.data);
        } catch (error) {
            console.error('Error adding note:', error);
        } finally {
            setAddingNote(false);
        }
    };

    const handleStatusChange = async (newStatus: string) => {
        if (!lead) return;
        try {
            await api.patch(`/leads/${lead.id}`, { status: newStatus });
            setLead({ ...lead, status: newStatus });
            // Refresh timeline to show status change
            const timelineRes = await api.get(`/leads/${leadId}/timeline`);
            setTimeline(timelineRes.data);
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    if (!leadId) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={onClose}
            />

            {/* Drawer Panel */}
            <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl overflow-y-auto transform transition-transform duration-300 ease-in-out">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : lead ? (
                    <div className="flex flex-col h-full">
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-start bg-gray-50">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{lead.name}</h2>
                                <div className="flex items-center mt-2 space-x-3">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                        ${lead.status === 'New' ? 'bg-green-100 text-green-800' :
                                            lead.status === 'Contacted' ? 'bg-yellow-100 text-yellow-800' :
                                                lead.status === 'Converted' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {lead.status}
                                    </span>
                                    <span className="text-sm text-gray-500 flex items-center">
                                        <Clock className="h-4 w-4 mr-1" />
                                        {new Date(lead.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-6 space-y-8">
                            {/* Contact Info */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Contact Details</h3>
                                    <div className="flex items-center text-gray-900">
                                        <Phone className="h-5 w-5 text-gray-400 mr-3" />
                                        {lead.phone}
                                    </div>
                                    <div className="flex items-center text-gray-900">
                                        <Mail className="h-5 w-5 text-gray-400 mr-3" />
                                        {lead.email}
                                    </div>
                                    <div className="flex items-center text-gray-900">
                                        <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                                        {lead.city}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Product Interest</h3>
                                    <div className="flex items-center text-gray-900">
                                        <FileText className="h-5 w-5 text-gray-400 mr-3" />
                                        <span className="font-medium">{lead.product_type}</span>
                                    </div>
                                    {lead.sum_insured && (
                                        <div className="text-sm text-gray-600 ml-8">
                                            Sum Insured: {lead.sum_insured}
                                        </div>
                                    )}
                                    {lead.vehicle_details && (
                                        <div className="text-sm text-gray-600 ml-8">
                                            <pre className="whitespace-pre-wrap font-sans">
                                                {JSON.stringify(lead.vehicle_details, null, 2)}
                                            </pre>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="border-t border-gray-200 pt-6">
                                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Quick Actions</h3>
                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => handleStatusChange('Contacted')}
                                        className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                    >
                                        Mark Contacted
                                    </button>
                                    <button
                                        onClick={() => handleStatusChange('Quote Shared')}
                                        className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                    >
                                        Quote Shared
                                    </button>
                                    <button
                                        onClick={() => handleStatusChange('Converted')}
                                        className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
                                    >
                                        Mark Converted
                                    </button>
                                    <button
                                        onClick={() => handleStatusChange('Lost')}
                                        className="px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-md text-sm font-medium hover:bg-red-100"
                                    >
                                        Mark Lost
                                    </button>
                                </div>
                            </div>

                            {/* Timeline */}
                            <div className="border-t border-gray-200 pt-6">
                                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Activity Timeline</h3>

                                {/* Add Note */}
                                <form onSubmit={handleAddNote} className="mb-6">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={note}
                                            onChange={(e) => setNote(e.target.value)}
                                            placeholder="Add a note..."
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                        />
                                        <button
                                            type="submit"
                                            disabled={addingNote || !note.trim()}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                                        >
                                            Add
                                        </button>
                                    </div>
                                </form>

                                <div className="flow-root">
                                    <ul className="-mb-8">
                                        {timeline.map((entry, idx) => (
                                            <li key={entry.id}>
                                                <div className="relative pb-8">
                                                    {idx !== timeline.length - 1 && (
                                                        <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                                                    )}
                                                    <div className="relative flex space-x-3">
                                                        <div>
                                                            <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white
                                                                ${entry.action === 'Lead Created' ? 'bg-green-500' :
                                                                    entry.action === 'Note Added' ? 'bg-blue-500' : 'bg-gray-500'}`}>
                                                                {entry.action === 'Lead Created' ? <CheckCircle className="h-5 w-5 text-white" /> :
                                                                    entry.action === 'Note Added' ? <Edit className="h-5 w-5 text-white" /> :
                                                                        <Calendar className="h-5 w-5 text-white" />}
                                                            </span>
                                                        </div>
                                                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                                            <div>
                                                                <p className="text-sm text-gray-900 font-medium">{entry.action}</p>
                                                                <p className="text-sm text-gray-500">{entry.description}</p>
                                                            </div>
                                                            <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                                                <time dateTime={entry.timestamp}>
                                                                    {new Date(entry.timestamp).toLocaleString()}
                                                                </time>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="p-6 text-center text-gray-500">Lead not found</div>
                )}
            </div>
        </div>
    );
};

export default LeadDetails;
