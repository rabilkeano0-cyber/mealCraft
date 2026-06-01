import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase'; 

interface RegisterProps {
  onRegisterSuccess: () => void;
  onNavigateToLogin: () => void;
}

const Register: React.FC<RegisterProps> = ({ onRegisterSuccess, onNavigateToLogin }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault(); 
    setErrorMsg(''); 
    setSuccessMsg('');

    if (!fullName || !email || !password || !confirmPassword) {
      setErrorMsg('Semua kolom wajib diisi.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Kata sandi dan konfirmasi kata sandi tidak cocok.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Kata sandi harus minimal 6 karakter.');
      return;
    }

    setIsLoading(true); 
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: fullName
      });

      setSuccessMsg('Pendaftaran berhasil! Mengalihkan ke halaman masuk...');
      
      setFullName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');

      setTimeout(() => {
        onRegisterSuccess();
      }, 1500);

    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        setErrorMsg('Email ini sudah terdaftar. Silakan gunakan email lain atau masuk.');
      } else if (error.code === 'auth/invalid-email') {
        setErrorMsg('Format email tidak valid.');
      } else {
        setErrorMsg('Terjadi kesalahan saat mendaftar: ' + error.message);
      }
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <div className="bg-white min-h-screen flex items-center justify-center font-['Inter'] antialiased text-gray-900">
      <div className="w-full max-w-sm p-6">
        
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Mealcraft</h1>
          <p className="text-gray-500 text-sm font-medium">Rasa Dunia, Kualitas Sempurna.</p>
        </div>

        {/* 2 TOMBOL NAVIGASI UTAMA (TAB SWITCHER) */}
        <div className="flex border-b border-gray-200 mb-6">
          <button 
            type="button"
            onClick={() => onNavigateToLogin()}
            className="w-1/2 pb-3 text-sm font-semibold text-gray-400 border-b-2 border-transparent hover:text-gray-600 transition-colors"
          >
            Masuk
          </button>
          <button 
            type="button"
            className="w-1/2 pb-3 text-sm font-bold text-[#22c55e] border-b-2 border-[#22c55e]"
          >
            Daftar
          </button>
        </div>

        <form className="space-y-5" onSubmit={(e) => handleSubmit(e)}>
          
          {errorMsg && (
            <div className="bg-red-50 text-red-600 text-sm font-semibold p-3 rounded-xl border border-red-100 text-center">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="bg-green-50 text-green-600 text-sm font-semibold p-3 rounded-xl border border-green-100 text-center">
              {successMsg}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nama Lengkap</label>
            <input 
              type="text" 
              placeholder="Masukkan nama Anda" 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-3.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:border-transparent transition-all shadow-sm placeholder-gray-400 disabled:bg-gray-100" 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
            <input 
              type="email" 
              placeholder="contoh@email.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-3.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:border-transparent transition-all shadow-sm placeholder-gray-400 disabled:bg-gray-100" 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Kata Sandi</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-3.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:border-transparent transition-all shadow-sm placeholder-gray-400 disabled:bg-gray-100" 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Konfirmasi Kata Sandi</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-3.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:border-transparent transition-all shadow-sm placeholder-gray-400 disabled:bg-gray-100" 
            />
          </div>

          <button 
            type="submit" 
            onClick={(e) => handleSubmit(e)}
            disabled={isLoading}
            className="w-full mt-2 bg-[#22c55e] hover:bg-[#16a34a] disabled:bg-gray-400 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-colors text-sm flex justify-center items-center"
          >
            {isLoading ? 'Memproses...' : 'Daftar'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-8 font-medium">
          Sudah punya akun? 
          <span 
            onClick={() => onNavigateToLogin()} 
            className="text-[#22c55e] font-bold hover:underline ml-1 cursor-pointer"
          >
            Masuk sekarang
          </span>
        </p>

      </div>
    </div>
  );
};

export default Register;