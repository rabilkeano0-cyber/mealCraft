import React, { useState, useEffect } from 'react';
import { 
  LogOut, MapPin, Award, Wand2, Search, 
  ShoppingCart, Trash2, ArrowRight, User as UserIcon, 
  Compass, Home as HomeIcon, CheckCircle2, ChevronRight,
  CreditCard, History, Info, UtensilsCrossed
} from 'lucide-react';

// db dan firestore dihilangkan karena tidak lagi mengecek role admin
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

// Pastikan tipe User di file types.ts kamu juga sudah tidak mewajibkan properti isAdmin
import { User, CartItem, Transaction } from './types';
import { MOCK_MEALS, PAYMENT_METHODS } from './constants';
import { formatRp } from './utils';
import MealCard from './components/MealCard';
import CraftWizard from './components/CraftWizard';
import MapLocationPicker from './components/MapLocationPicker';

import Login from './components/Login';
import Register from './components/Register';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<'login'|'home'|'explore'|'order'|'profile'>('login');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [location, setLocation] = useState<string | null>(null);
  useEffect(() => {
    console.log("LOCATION STATE:", location);
  }, [location]);

  const [purchaseCount, setPurchaseCount] = useState(0);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [toasts, setToasts] = useState<{id: number, message: string, type: 'success' | 'info' | 'error'}[]>([]);
  const [meals, setMeals] = useState(MOCK_MEALS);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'Semua'>('Semua');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showAddressesModal, setShowAddressesModal] = useState(false);
  const [showPaymentsModal, setShowPaymentsModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [history, setHistory] = useState<Transaction[]>([]);
  const [editName, setEditName] = useState('');
  const [pendingCheckout, setPendingCheckout] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(PAYMENT_METHODS[0]);
  
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Langsung set user tanpa perlu mengecek Firestore
        setUser({ 
          name: firebaseUser.displayName || firebaseUser.email || 'Pengguna', 
          email: firebaseUser.email || '', 
          tier: calculateTier(purchaseCount), 
          purchaseCount: purchaseCount
        });
        setView('home');
      } else {
        setUser(null);
        setView('login');
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, [purchaseCount]);

  const calculateTier = (count: number) => {
    if(count < 5) return 'Pemula - Bronze';
    if(count < 15) return 'Pecinta Rasa Nusantara - Silver';
    return 'Sultan - Gold';
  }

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => { setToasts(prev => prev.filter(t => t.id !== id)); }, 3000);
  };

  const logout = async () => {
    await signOut(auth);
    setCart([]); setLocation(null);
  };

  const requestLocation = () => setShowLocationModal(true);

  const addToCart = (mealId: string) => {
    const meal = meals.find(m => m.id === mealId)!;
    setCart(prev => [...prev, { ...meal, cartId: String(Date.now()) }]);
    showToast(`${meal.name} ditambahkan!`);
  };

  const removeCartItem = (cartId: string) => setCart(prev => prev.filter(i => i.cartId !== cartId));

  const checkout = () => {
    console.log("LOCATION CHECKOUT:", location);

    if (!location)
      return showToast(
        'Harap set lokasi pengiriman terlebih dahulu di Beranda.',
        'error'
      );

    if (!cart.length)
      return showToast('Keranjang kosong', 'error');

    setPendingCheckout(true);
    setShowPaymentsModal(true);
  };

  const processPayment = (pm: string) => {
    if (pendingCheckout) {
      const subtotal = cart.reduce((s, i) => s + i.price, 0);
      const fee = location ? 15000 : 0;
      const total = subtotal + fee;
      
      const newTransaction: Transaction = {
        id: `TRX-${Date.now()}`,
        date: new Date().toLocaleDateString('id-ID'),
        items: [...cart],
        total
      };
      
      setHistory(prev => [newTransaction, ...prev]);
      setCart([]);
      
      const newCount = purchaseCount + 1;
      setPurchaseCount(newCount);
      
      if (user) {
          setUser({ ...user, purchaseCount: newCount, tier: calculateTier(newCount) });
      }

      if (newCount % 10 === 0) {
        showToast(`Pembayaran dengan ${pm} berhasil! SELAMAT! Anda mendapatkan Diskon Spesial 🎉`, 'success');
      } else {
        showToast(`Pembayaran dengan ${pm} berhasil diproses.`);
      }
      
      setPendingCheckout(false);
      setShowPaymentsModal(false);
      setView('home');
    } else {
      setSelectedPayment(pm);
      showToast(`Metode pembayaran utama diubah ke ${pm}`);
      setShowPaymentsModal(false);
    }
  }

  if (authLoading) return <div className="flex h-screen items-center justify-center bg-gray-50"><div className="w-12 h-12 border-4 border-[#22c55e] border-t-transparent rounded-full animate-spin"></div></div>;

  const renderAuth = () => {
    if (authMode === 'register') {
      return (
        <Register 
          onNavigateToLogin={() => setAuthMode('login')} 
          onRegisterSuccess={() => setAuthMode('login')} 
        />
      );
    }
    
    return (
      <Login 
        onNavigateToRegister={() => setAuthMode('register')} 
        onLoginSuccess={() => setView('home')} 
      />
    );
  };

  const renderHome = () => {
    const isDiscountReady = purchaseCount > 0 && purchaseCount % 10 === 0;
    const progress = purchaseCount % 10;
    const remaining = 10 - progress;
    
    return (
    <div className="animate-fade-in flex flex-col h-full">
      <header className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-8 gap-4">
        <div>
          {/* Label Admin Dihapus */}
          <h1 className="text-4xl font-bold tracking-tight font-display text-gray-900">Selamat Pagi, {user?.name.split(' ')[0]}.</h1>
          <p className="text-gray-500 font-medium mt-1">Siap untuk menikmati sajian asli nusantara hari ini?</p>
        </div>
        <div className="flex items-center gap-4 bg-white border border-gray-100 p-2 pl-4 rounded-full shadow-sm">
          <div className="text-right">
            <p className="text-xs font-bold uppercase text-gray-400 tracking-wider">Tier Loyalitas</p>
            <p className="text-sm font-bold text-[#FF7A00]">{user?.tier}</p>
          </div>
          <div className="w-10 h-10 bg-[#FF7A00]/10 rounded-full flex items-center justify-center text-[#FF7A00]">
            <Award className="w-5 h-5" />
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className={`md:col-span-2 ${isDiscountReady ? 'bg-gradient-to-r from-promo to-pink-600' : 'bg-[#1A1A1A]'} rounded-[2.5rem] p-8 text-white relative overflow-hidden flex flex-col justify-between transition-colors duration-500`}>
          <div className="relative z-10">
            {isDiscountReady ? (
              <>
                <span className="bg-white text-promo text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter shadow-sm">Selamat 🎉</span>
                <h2 className="text-4xl font-bold mt-4 mb-2">Diskon 10% Menanti!</h2>
                <p className="text-white/90 max-w-sm text-sm">Kamu telah mencapai 10 pesanan. Diskon spesial otomatis aktif di pesanan kamu selanjutnya.</p>
              </>
            ) : (
              <>
                <span className="bg-[#27AE60] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter">Promo Berlangsung</span>
                <h2 className="text-4xl font-light mt-4 mb-2">Kejar Diskon <span className="font-bold italic text-[#27AE60]">10%</span></h2>
                <p className="text-gray-400 max-w-xs text-sm">Selesaikan {remaining} pesanan lagi untuk membuka voucher eksklusif bulan ini.</p>
              </>
            )}
          </div>
          <div className="mt-8 relative z-10 w-full max-w-md">
            <div className="flex justify-between items-end mb-2">
              <span className={`text-xs font-bold uppercase tracking-widest ${isDiscountReady ? 'text-white' : 'text-gray-500'}`}>Progress Loyalitas</span>
              <span className="text-xl font-bold">{progress}<span className={isDiscountReady ? 'text-white/70' : 'text-gray-600'}>/10</span></span>
            </div>
            <div className={`h-2 w-full ${isDiscountReady ? 'bg-white/30' : 'bg-gray-800'} rounded-full overflow-hidden`}>
              <div className={`h-full ${isDiscountReady ? 'bg-white' : 'bg-[#27AE60]'} rounded-full transition-all duration-1000`} style={{ width: `${isDiscountReady ? 100 : (progress / 10) * 100}%` }}></div>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        <div onClick={() => setIsWizardOpen(true)} className="bg-[#27AE60] rounded-[2.5rem] p-8 text-white flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-[#219150] shadow-sm transition-colors active:scale-95">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
            <Wand2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold leading-tight">Ciptakan<br/>Menu Sendiri</h3>
          <p className="text-white/70 text-sm mt-2">Craft Wizard</p>
        </div>
      </section>

      <section className="flex-1">
        <div className="flex justify-between items-end mb-6">
          <h3 className="text-3xl font-bold tracking-tight font-display text-gray-900">Rekomendasi Favorit</h3>
          <button onClick={() => setView('explore')} className="text-sm font-bold text-[#27AE60] underline underline-offset-4 hover:text-[#219150] transition-colors cursor-pointer">Lihat Semua</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Props Admin Dihapus */}
          {meals.filter(m => (!location || m.distance % 2 === (location.length % 2))).slice(0, 3).map(meal => <MealCard key={meal.id} meal={meal} location={location} onAdd={() => addToCart(meal.id)} />)}
        </div>
      </section>
    </div>
    );
  };

  const renderExplore = () => {
    const filteredMeals = meals.filter(m => {
      const matchSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.desc.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = activeCategory === 'Semua' || m.category === activeCategory;
      return matchSearch && matchCat;
    });
    
    return (
    <div className="animate-fade-in space-y-6 pb-10">
      <h2 className="text-3xl font-bold tracking-tight font-display text-gray-900">Eksplor Menu</h2>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input type="text" placeholder="Cari menu..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-white border border-gray-200 rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-primary shadow-sm" />
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
        {['Semua'].map((cat) => (
          <button key={cat} onClick={() => setActiveCategory(cat as any)} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeCategory === cat ? 'bg-primary text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{cat}</button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Props Admin Dihapus */}
        {filteredMeals.length > 0 ? filteredMeals.map(meal => <MealCard key={meal.id} meal={meal} location={location} onAdd={() => addToCart(meal.id)} />) : (
          <div className="col-span-full py-20 text-center text-gray-500">Menu tidak ditemukan.</div>
        )}
      </div>
    </div>
    );
  };

  const renderOrder = () => {
    if (!cart.length) return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center animate-fade-in">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4"><ShoppingCart className="w-10 h-10 text-gray-400" /></div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Keranjang Kosong</h3>
        <p className="text-gray-500 mb-6">Belum ada menu sehat yang kamu pilih.</p>
        <button onClick={() => setView('home')} className="bg-[#22c55e] text-white font-semibold py-3 px-8 rounded-xl shadow-md hover:bg-[#16a34a]">Cari Makanan</button>
      </div>
    );
    const subtotal = cart.reduce((s, i) => s + i.price, 0);
    const fee = location ? 15000 : 0;
    return (
      <div className="animate-fade-in flex flex-col h-full">
        <h2 className="text-3xl font-bold tracking-tight font-display text-gray-900 mb-6">Pesananmu</h2>
        <div className="flex-1 space-y-4 mb-6">
          {cart.map(item => (
            <div key={item.cartId} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4 items-center">
              {item.img ? <img src={item.img} className="w-16 h-16 rounded-xl object-cover" /> : <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center"><Wand2 className="w-6 h-6 text-primary" /></div>}
              <div className="flex-1"><h4 className="font-bold text-gray-900">{item.name}</h4>{item.desc && <p className="text-xs text-gray-500 mt-0.5 max-w-[200px] truncate">{item.desc}</p>}<p className="text-[#22c55e] font-semibold mt-1">{formatRp(item.price)}</p></div>
              <button onClick={() => removeCartItem(item.cartId)} className="w-8 h-8 flex items-center justify-center bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 space-y-3 mb-4">
          <div className="flex justify-between text-gray-600 text-sm"><span>Subtotal</span><span>{formatRp(subtotal)}</span></div>
          <div className="flex justify-between text-gray-600 text-sm"><span>Ongkos Kirim {!location && '(Set Lokasi Dulu)'}</span><span>{location ? formatRp(fee) : '-'}</span></div>
          <div className="border-t border-gray-100 pt-3 flex justify-between items-center"><span className="font-bold text-gray-900">Total</span><span className="font-bold text-xl text-gray-900">{formatRp(subtotal + fee)}</span></div>
        </div>
        <button onClick={checkout} className="w-full bg-gray-900 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-black active:scale-95 flex items-center justify-center gap-2">Checkout Sekarang <ArrowRight className="w-5 h-5" /></button>
      </div>
    );
  };

  const renderProfile = () => (
    <div className="animate-fade-in space-y-6">
      <h2 className="text-3xl font-bold tracking-tight font-display text-gray-900 mb-6">Profil</h2>
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5 relative">
        <div className="w-20 h-20 bg-[#22c55e] rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-md shadow-green-500/30 uppercase">{user?.name.charAt(0)}</div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-xl text-gray-900">{user?.name}</h3>
            <button onClick={() => { setEditName(user?.name || ''); setShowEditProfileModal(true); }} className="text-gray-400 hover:text-[#22c55e] text-sm underline">Edit</button>
          </div>
          <p className="text-gray-500 text-sm">{user?.email}</p>
          <div className="inline-flex items-center gap-1 bg-accent/10 text-accent px-3 py-1 rounded-full text-xs font-bold mt-3"><Award className="w-4 h-4" /> {user?.tier} (Total Pesanan: {user?.purchaseCount})</div>
        </div>
      </div>
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <button onClick={() => setShowAddressesModal(true)} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 border-b border-gray-50 cursor-pointer">
          <div className="flex items-center gap-3 text-gray-700 font-medium"><div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-[#22c55e]"><MapPin className="w-4 h-4" /></div>Alamat Tersimpan ({location ? 1 : 0})</div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>
        <button onClick={() => setShowPaymentsModal(true)} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 border-b border-gray-50 cursor-pointer">
          <div className="flex items-center gap-3 text-gray-700 font-medium"><div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-[#22c55e]"><CreditCard className="w-4 h-4" /></div>Metode Pembayaran</div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>
        <button onClick={() => setShowHistoryModal(true)} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer">
          <div className="flex items-center gap-3 text-gray-700 font-medium"><div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-[#22c55e]"><History className="w-4 h-4" /></div>Riwayat Transaksi ({history.length})</div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>
      </div>
      <button onClick={logout} className="w-full bg-white border border-gray-200 text-red-500 font-bold py-4 rounded-2xl shadow-sm hover:bg-red-50 flex items-center justify-center md:hidden gap-2"><LogOut className="w-5 h-5" /> Keluar Akun</button>
    </div>
  );

  return (
    <div className="flex h-screen w-full max-w-[1440px] mx-auto bg-white relative shadow-2xl overflow-hidden font-sans text-gray-900">
      {user && (
        <aside className="hidden md:flex flex-col w-64 border-r border-gray-100 bg-white z-20 p-8">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-[#22c55e] rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-green-500/20"><UtensilsCrossed className="w-6 h-6" /></div>
            <span className="font-bold text-2xl tracking-tighter capitalize font-display">Mealcraft</span>
          </div>
          
          <nav className="flex-1 space-y-6">
            {[ {id: 'home', icon: HomeIcon, label: 'Beranda'}, {id: 'explore', icon: Compass, label: 'Eksplor Menu'}, {id: 'order', icon: ShoppingCart, label: 'Pesanan Saya', badge: cart.length}, {id: 'profile', icon: UserIcon, label: 'Profil'} ].map(n => (
              <button key={n.id} onClick={() => setView(n.id as any)} className={`flex items-center gap-4 w-full text-left font-medium transition-colors relative ${view === n.id ? 'text-[#22c55e] font-semibold' : 'text-gray-400 hover:text-gray-900'}`}>
                <n.icon className="w-5 h-5" strokeWidth={2.5} /> {n.label} {n.badge ? <span className="absolute -right-2 top-0 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{n.badge}</span> : ''}
              </button>
            ))}
          </nav>

          <div className="mt-auto flex flex-col gap-4">
            <div className="bg-gray-50 rounded-2xl p-4 cursor-pointer hover:bg-gray-100 transition-colors" onClick={requestLocation}>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Status Lokasi</p>
              <div className={`flex items-center gap-2 text-sm font-semibold max-w-full ${location ? 'text-[#22c55e]' : 'text-gray-600'}`}>
                <MapPin className="w-4 h-4 shrink-0" strokeWidth={2.5} />
                <span className="truncate">{location || 'Set Lokasi Pengiriman'}</span>
              </div>
            </div>
            <button onClick={logout} className="flex items-center gap-3 text-gray-400 hover:text-red-500 w-full font-medium px-2 py-1 transition-colors"><LogOut className="w-5 h-5" strokeWidth={2.5} /> Keluar</button>
          </div>
        </aside>
      )}

      <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-white">
        {user && (
          <header className="md:hidden flex items-center justify-between p-5 bg-white z-10 border-b border-gray-100">
            <div className="flex items-center gap-2"><div className="w-8 h-8 bg-[#22c55e] rounded-lg flex justify-center items-center text-white font-bold">M</div><span className="font-bold text-lg uppercase">Mealcraft</span></div>
            <div className="relative cursor-pointer" onClick={() => setView('order')}>
              <ShoppingCart className="w-6 h-6 text-gray-700" />
              {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{cart.length}</span>}
            </div>
          </header>
        )}

        <div className="flex-1 overflow-y-auto p-5 md:p-10 pb-24 md:pb-10">
          {view === 'login' ? renderAuth() : view === 'home' ? renderHome() : view === 'explore' ? renderExplore() : view === 'order' ? renderOrder() : renderProfile()}
        </div>

        {user && (
          <nav className="md:hidden absolute bottom-0 w-full bg-white/90 backdrop-blur-md border-t border-gray-100 flex justify-around items-center py-4 px-2 z-20 pb-safe">
            {[ {id: 'home', icon: HomeIcon, label: 'Beranda'}, {id: 'explore', icon: Compass, label: 'Eksplor'}, {id: 'order', icon: ShoppingCart, label: 'Pesanan'}, {id: 'profile', icon: UserIcon, label: 'Profil'} ].map(n => (
              <button key={n.id} onClick={() => setView(n.id as any)} className={`flex flex-col items-center gap-1 p-2 w-16 ${view === n.id ? 'text-[#22c55e]' : 'text-gray-400'}`}>
                <n.icon className={`w-6 h-6 ${view === n.id ? 'fill-green-100' : ''}`} /><span className="text-[10px] font-medium">{n.label}</span>
              </button>
            ))}
          </nav>
        )}
      </main>

      {isWizardOpen && <CraftWizard onClose={() => setIsWizardOpen(false)} onAddToCart={item => { setCart(p=>[...p, item]); setIsWizardOpen(false); showToast('Menu racikan berhasil ditambahkan!'); }} />}

      {/* Modals */}
      {showLocationModal && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in"
            onClick={() => setShowLocationModal(false)}
          >
          <div
            className="bg-white p-6 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Pilih Lokasi Pengiriman
          </h3>

          <MapLocationPicker
            location={location}
            setLocation={setLocation}
          />

          <button
            onClick={() => setShowLocationModal(false)}
            className="mt-4 w-full py-3 bg-[#22c55e] text-white rounded-xl font-semibold"
          >
              Simpan Lokasi
            </button>
          </div>
        </div>
      )}

      {showEditProfileModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowEditProfileModal(false)}>
          <div className="bg-white p-6 rounded-3xl shadow-2xl max-w-sm w-full" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Edit Nama Profil</h3>
            <input type="text" value={editName} onChange={e => setEditName(e.target.value)} className="w-full border border-gray-200 rounded-xl p-3 mb-4 focus:outline-none focus:border-[#22c55e]" />
            <div className="flex gap-2">
              <button onClick={() => setShowEditProfileModal(false)} className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold">Batal</button>
              <button onClick={() => { if(user) setUser({...user, name: editName || 'User', email: (editName || 'user').toLowerCase().replace(/\s+/g, '.') + '@gmail.com'}); setShowEditProfileModal(false); showToast('Profil diperbarui'); }} className="flex-1 py-3 bg-[#22c55e] text-white rounded-xl font-semibold">Simpan</button>
            </div>
          </div>
        </div>
      )}

      {showAddressesModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowAddressesModal(false)}>
          <div className="bg-white p-6 rounded-3xl shadow-2xl max-w-md w-full max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Alamat Tersimpan</h3>
            <div className="overflow-y-auto space-y-3 flex-1 hide-scrollbar">
              {location ? (
                <div className="p-4 border border-green-200 bg-green-50 rounded-xl">
                  <div className="font-bold flex items-center gap-2 mb-1"><MapPin className="w-4 h-4 text-[#22c55e]" /> Alamat Saat Ini</div>
                  <p className="text-sm text-gray-600">{location}</p>
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic p-4 text-center">Belum ada lokasi yang diatur.</p>
              )}
            </div>
            <button onClick={() => { setShowAddressesModal(false); setShowLocationModal(true); }} className="mt-4 w-full py-3 bg-[#22c55e] text-white rounded-xl font-semibold">Ubah Alamat Pengiriman</button>
          </div>
        </div>
      )}

      {showPaymentsModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in" onClick={() => {setShowPaymentsModal(false); setPendingCheckout(false);}}>
          <div className="bg-white p-6 rounded-3xl shadow-2xl max-w-md w-full flex flex-col" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Pilih Metode Pembayaran</h3>
            {pendingCheckout && <p className="text-sm text-gray-500 mb-4">Silahkan pilih metode untuk menyelesaikan transaksi sebesar {formatRp(cart.reduce((s, i) => s + i.price, 0) + (location ? 15000 : 0))}</p>}
            <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2 hide-scrollbar">
              {PAYMENT_METHODS.map(pm => (
                <button key={pm} onClick={() => processPayment(pm)} className={`w-full p-4 border rounded-xl flex items-center gap-3 transition-colors text-left ${selectedPayment === pm && !pendingCheckout ? 'border-[#22c55e] bg-green-50' : 'border-gray-100 hover:bg-gray-50'}`}>
                  <CreditCard className={`w-5 h-5 ${selectedPayment === pm && !pendingCheckout ? 'text-[#22c55e]' : 'text-gray-400'}`} /> 
                  <span className={`font-semibold ${selectedPayment === pm && !pendingCheckout ? 'text-[#22c55e]' : 'text-gray-700'}`}>{pm}</span>
                  {selectedPayment === pm && !pendingCheckout && <CheckCircle2 className="w-5 h-5 text-[#22c55e] ml-auto" />}
                </button>
              ))}
            </div>
            <button onClick={() => {setShowPaymentsModal(false); setPendingCheckout(false);}} className="mt-4 w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold">Batal</button>
          </div>
        </div>
      )}

      {showHistoryModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowHistoryModal(false)}>
          <div className="bg-white p-6 rounded-3xl shadow-2xl max-w-md w-full max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Riwayat Transaksi</h3>
            <div className="overflow-y-auto space-y-4 flex-1 pr-2 hide-scrollbar">
              {history.length > 0 ? history.map(trx => (
                <div key={trx.id} className="p-4 border border-gray-100 rounded-xl shadow-sm">
                  <div className="flex justify-between items-center mb-2 border-b border-gray-50 pb-2">
                    <span className="text-xs font-bold text-gray-500">{trx.id}</span>
                    <span className="text-xs text-gray-400">{trx.date}</span>
                  </div>
                  <div className="space-y-1 mb-3">
                    {trx.items.map(item => (
                      <div key={item.cartId} className="flex justify-between text-sm">
                        <span className="text-gray-700 truncate max-w-[200px]">{item.name}</span>
                        <span className="font-semibold text-gray-900">{formatRp(item.price)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="font-bold text-[#22c55e]">{formatRp(trx.total)}</span>
                  </div>
                </div>
              )) : (
                <div className="py-10 text-center text-gray-500">Belum ada riwayat transaksi.</div>
              )}
            </div>
            <button onClick={() => setShowHistoryModal(false)} className="mt-4 w-full py-3 bg-gray-900 text-white rounded-xl font-semibold">Tutup</button>
          </div>
        </div>
      )}

      <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[60] flex flex-col gap-3 pointer-events-none w-[90%] max-w-sm">
        {toasts.map(t => (
          <div key={t.id} className={`${t.type === 'success' ? 'bg-gray-900' : t.type === 'error' ? 'bg-red-500' : 'bg-gray-900'} text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-sm font-medium animate-slide-up`}>
            {t.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-[#22c55e]" /> : <Info className="w-5 h-5 text-white" />}{t.message}
          </div>
        ))}
      </div>
    </div>
  );
}