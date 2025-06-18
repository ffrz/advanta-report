// src/utils/constants.js
import React from 'react'; // Untuk menggunakan JSX di Icon komponen
import { Icon } from '../assets/icons/Icon'; // Path relatif yang benar

export const activityTypes = [
    { id: 'FM', label: 'Field Monitoring', icon: <Icon name="chart" className="w-5 h-5" /> },
    { id: 'ODP', label: 'On Demplot Program', icon: <Icon name="demplot" className="w-5 h-5" /> },
    { id: 'STUDY', label: 'Study & Discussion', icon: <Icon name="book" className="w-5 h-5" /> },
    { id: 'FFD', label: 'Farmer Field Day', icon: <Icon name="farmer" className="w-5 h-5" /> },
    // Tambahkan lebih banyak jenis kegiatan jika ada
];

export const userRoles = {
    BS: 'BS',
    Agronomis: 'Agronomis',
};

// Anda bisa menambahkan path koleksi Firestore di sini jika ingin lebih sentral
export const FIRESTORE_COLLECTIONS = {
    USERS: 'artifacts/advanta-report/users',
    BS_USERS_PUBLIC: 'artifacts/advanta-report/public/data/bs_users',
    DEMPLOT_REPORTS: 'artifacts/advanta-report/public/data/demplots',
    ACTIVITY_REPORTS: 'artifacts/advanta-report/public/data/activities',
    TARGETS: 'artifacts/advanta-report/public/data/targets',
};