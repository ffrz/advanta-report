// src/utils/dateUtils.js
export const calculateAge = (tanamDate) => {
    if (!tanamDate) return '-';
    // Firebase Timestamp object has a toDate() method
    const date = tanamDate.toDate ? tanamDate.toDate() : new Date(tanamDate);
    const today = new Date();
    const diffTime = Math.abs(today - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} hari`;
};

export const formatFirebaseTimestamp = (timestamp) => {
    if (!timestamp || !timestamp.toDate) return '-';
    const date = timestamp.toDate();
    return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
};