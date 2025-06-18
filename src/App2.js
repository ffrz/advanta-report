// src/App.js (Setelah Modularisasi)
import React, { useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext'; // Atau useAuth hook saja jika tanpa context
import { AppModalProvider, useAppModal } from './context/AppContext';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import DashboardBS from './components/dashboard/DashboardBS';
import DashboardAgronomist from './components/dashboard/DashboardAgronomist';
import EditProfilePage from './components/profile/EditProfilePage';
import { LoadingSpinner, Modal } from './components/common';
import { initializeFirebase } from './api/firebase'; // Fungsi inisialisasi Firebase

// Pindahkan konfigurasi Firebase ke api/firebase.js

function AppContent() {
  const { user, userProfile, isLoading: authLoading, error: authError } = useAuth(); // Ambil dari custom hook
  const { appModalMessage, setAppModalMessage, imageInModal, setImageInModal } = useAppModal(); // Ambil dari custom hook

  const [page, setPage] = React.useState('loading'); // State untuk routing internal

  // Inisialisasi Firebase sekali saat mount
  useEffect(() => {
    initializeFirebase(); // Panggil fungsi inisialisasi dari api/firebase.js
  }, []);

  // Effect untuk mengatur halaman berdasarkan status otentikasi
  useEffect(() => {
    if (authLoading) {
      setPage('loading');
      return;
    }
    if (user) {
      // Setelah user profile dimuat
      if (userProfile) {
        setPage('dashboard');
      } else {
        // Jika user login tapi profil belum ada (misal, baru register), arahkan ke register/edit profile
        setPage('register'); // Atau 'edit-profile' jika sudah ada user tapi belum lengkap profilnya
      }
    } else {
      setPage('login');
    }
  }, [user, userProfile, authLoading]);

  const navigateTo = (newPage) => {
    setPage(newPage);
    // Mungkin bersihkan error atau modal message di sini
    setAppModalMessage('');
  };

  const renderPage = () => {
    if (authLoading) return <LoadingSpinner />;
    if (authError) return <p className="text-red-500 text-center mt-4">Error: {authError.message}</p>;

    switch (page) {
      case 'login': return <LoginPage navigateTo={navigateTo} />;
      case 'register': return <RegisterPage navigateTo={navigateTo} />;
      case 'edit-profile': return userProfile ? <EditProfilePage navigateTo={navigateTo} /> : <LoadingSpinner />;
      case 'dashboard':
        if (userProfile?.role === 'BS') {
          return <DashboardBS userProfile={userProfile} navigateTo={navigateTo} />;
        }
        if (userProfile?.role === 'Agronomis') {
          return <DashboardAgronomist userProfile={userProfile} navigateTo={navigateTo} />;
        }
        return <LoadingSpinner />; // Atau halaman error jika role tidak ditemukan
      default: return <LoginPage navigateTo={navigateTo} />;
    }
  };

  return (
    <>
      {renderPage()}
      {appModalMessage && (
        <Modal onClose={() => setAppModalMessage('')}>
          <div className="bg-white p-8 rounded-lg text-center shadow-xl">
            <p>{appModalMessage}</p>
          </div>
        </Modal>
      )}
      {imageInModal && (
        <Modal onClose={() => setImageInModal(null)}>
          <img src={imageInModal} alt="Tampilan diperbesar" className="max-w-full max-h-[80vh] rounded-lg" />
        </Modal>
      )}
    </>
  );
}

// Pembungkus Context Providers
function App() {
  return (
    <AuthProvider>
      <AppModalProvider>
        <AppContent />
      </AppModalProvider>
    </AuthProvider>
  );
}

export default App;