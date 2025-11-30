export const formatPhoneNumber = (phone: string): string => {
    // 1. Remove all non-numeric characters
    let cleaned = phone.replace(/\D/g, '');

    // 2. Handle 10 digit numbers (Default Indian mobile)
    if (cleaned.length === 10) {
        return '91' + cleaned;
    }

    // 3. Handle 11 digit numbers starting with 0
    if (cleaned.length === 11 && cleaned.startsWith('0')) {
        return '91' + cleaned.substring(1);
    }

    // 4. Handle 12 digit numbers (already has 91)
    if (cleaned.length === 12 && cleaned.startsWith('91')) {
        return cleaned;
    }

    // Return original if it doesn't match standard patterns (could be landline or international)
    // But for WhatsApp, we generally want the country code. 
    // If it's completely invalid, we might still return it but maybe we should validate?
    // For now, let's return the cleaned version or original if empty.
    return cleaned || phone;
};

export const formatName = (name: string): string => {
    if (!name) return '';
    return name
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};
