import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    email: {
        type: String,
    },
    city: {
        type: String,
    },
    productType: {
        type: String,
        required: true,
        enum: ['car', 'bike', 'commercial', 'health', 'life', 'term', 'ulip', 'child', 'retirement', 'other'],
    },
    details: {
        type: mongoose.Schema.Types.Mixed, // Flexible for different product fields
        default: {},
    },
    sourcePage: {
        type: String,
    },
    status: {
        type: String,
        enum: ['new', 'contacted', 'converted', 'lost'],
        default: 'new',
    },
}, {
    timestamps: true,
});

const Lead = mongoose.model('Lead', leadSchema);

export default Lead;
