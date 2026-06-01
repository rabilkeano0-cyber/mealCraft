import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase'; 

interface LoginProps {
  onNavigateToRegister: () => void;
  onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onNavigateToRegister, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Email dan kata sandi wajib diisi.');
      return;
    }

    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLoginSuccess();
    } catch (error: any) {
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        setErrorMsg('Email atau kata sandi salah.');
      } else if (error.code === 'auth/invalid-email') {
        setErrorMsg('Format email tidak valid.');
      } else {
        setErrorMsg('Terjadi kesalahan saat masuk: ' + error.message);
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
            className="w-1/2 pb-3 text-sm font-bold text-[#22c55e] border-b-2 border-[#22c55e]"
          >
            Masuk
          </button>
          <button 
            type="button"
            onClick={() => onNavigateToRegister()}
            className="w-1/2 pb-3 text-sm font-semibold text-gray-400 border-b-2 border-transparent hover:text-gray-600 transition-colors"
          >
            Daftar
          </button>
        </div>

        <form className="space-y-5" onSubmit={(e) => handleLogin(e)}>
          
          {errorMsg && (
            <div className="bg-red-50 text-red-600 text-sm font-semibold p-3 rounded-xl border border-red-100 text-center">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
            <input 
              type="email" 
              placeholder="Masukkan email anda" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-3.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:border-transparent transition-all shadow-sm placeholder-gray-400 disabled:bg-gray-100" 
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Kata Sandi</label>
            <input 
              type="password" 
              placeholder="Masukkan kata sandi anda" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-3.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:border-transparent transition-all shadow-sm placeholder-gray-400 disabled:bg-gray-100" 
              required
            />
          </div>

          <button 
            type="submit" 
            onClick={(e) => handleLogin(e)}
            disabled={isLoading}
            className="w-full mt-2 bg-[#22c55e] hover:bg-[#16a34a] disabled:bg-gray-400 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-colors text-sm flex justify-center items-center"
          >
            {isLoading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-8 font-medium">
          Belum punya akun? 
          <span 
            onClick={() => onNavigateToRegister()} 
            className="text-[#22c55e] font-bold hover:underline ml-1 cursor-pointer"
          >
            Daftar sekarang
          </span>
        </p>

      </div>
    </div>
  );
};

export default Login;