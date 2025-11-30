import React from 'react';
import { CheckCircle, X } from 'lucide-react';

interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose, title, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm transform transition-all scale-100">
                <div className="flex justify-end">
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <div className="flex flex-col items-center text-center">
                    <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle className="h-10 w-10 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
                    <p className="text-gray-600 mb-6">{message}</p>
                    <button
                        onClick={onClose}
                        className="w-full bg-green-600 text-white py-2.5 rounded-xl font-semibold hover:bg-green-700 transition shadow-lg shadow-green-200"
                    >
                        Awesome!
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SuccessModal;
