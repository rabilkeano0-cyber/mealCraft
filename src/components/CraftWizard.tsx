import { useState, useMemo } from 'react';
import { X, ShoppingBag } from 'lucide-react';
import { formatRp } from '../utils';
import { INGREDIENTS } from '../constants';
import { CartItem } from '../types';

export default function CraftWizard({ onClose, onAddToCart }: { onClose: () => void, onAddToCart: (item: CartItem) => void }) {
    const [step, setStep] = useState(1);
    const [base, setBase] = useState<string | null>(null);
    const [protein, setProtein] = useState<string | null>(null);
    const [veggies, setVeggies] = useState<string[]>([]);

    const totalPrice = useMemo(() => {
        let total = 0;
        if (base) total += INGREDIENTS.bases.find(i => i.id === base)!.price;
        if (protein) total += INGREDIENTS.proteins.find(i => i.id === protein)!.price;
        veggies.forEach(vId => {
            total += INGREDIENTS.veggies.find(i => i.id === vId)!.price;
        });
        return total;
    }, [base, protein, veggies]);

    const handleAdd = () => {
        onAddToCart({
            id: 'c' + Date.now(), cartId: String(Date.now()), name: 'Racikan Pilihanmu',
            desc: 'Racikan Khusus (Karbohidrat, Protein, Sayur)', price: totalPrice, distance: 0, img: '',
            category: 'Diet Sehat'
        });
    };

    const isNextDisabled = (step === 1 && !base) || (step === 2 && !protein) || (step === 3 && veggies.length === 0);
    const title = step === 1 ? 'Pilih Karbohidrat (Base)' : step === 2 ? 'Pilih Protein Utama' : step === 3 ? 'Pilih Sayuran' : 'Ringkasan Menu';
    const items = step === 1 ? INGREDIENTS.bases : step === 2 ? INGREDIENTS.proteins : INGREDIENTS.veggies;
    const type = step === 3 ? 'checkbox' : 'radio';
    const selected = step === 1 ? base : step === 2 ? protein : veggies;

    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end md:items-center justify-center animate-fade-in backdrop-blur-sm p-0 md:p-6">
            <div className="bg-white w-full md:w-[500px] h-[85vh] md:h-auto max-h-[90vh] rounded-t-3xl md:rounded-3xl shadow-2xl flex flex-col animate-slide-up overflow-hidden relative">
                <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center z-10"><X className="w-4 h-4" /></button>
                <div className="w-full bg-gray-100 h-1.5 shrink-0"><div className="bg-primary h-1.5 transition-all" style={{ width: `${(step / 4) * 100}%` }}></div></div>
                <div className="flex-1 overflow-y-auto p-6">
                {step < 4 ? (
                    <>
                        <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-bold">{title}</h3><span className="text-sm font-bold text-gray-400">Langkah {step}/3</span></div>
                        <div className="space-y-3 pb-6">
                            {items.map(item => {
                                const isChecked = type === 'radio' ? selected === item.id : (selected as string[]).includes(item.id);
                                return (
                                    <label key={item.id} className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer ${isChecked ? 'border-primary bg-primary/5' : 'border-gray-100'}`}>
                                        <div className="flex items-center gap-3">
                                            <input type={type} className={`w-5 h-5 text-primary ${type === 'radio' ? 'rounded-full' : 'rounded'} border-gray-300`} checked={isChecked} onChange={() => {
                                                if (type === 'radio') { step === 1 ? setBase(item.id) : setProtein(item.id); } 
                                                else { setVeggies(prev => prev.includes(item.id) ? prev.filter(v => v !== item.id) : [...prev, item.id]); }
                                            }} />
                                            <div><div className="font-semibold text-gray-900">{item.name}</div><div className="text-xs text-gray-500">{item.cal} Kkal</div></div>
                                        </div>
                                        <div className="font-medium text-gray-700">{formatRp(item.price)}</div>
                                    </label>
                                );
                            })}
                        </div>
                    </>
                ) : (
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-gray-900">Ringkasan Menu</h3>
                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-3">
                            <div className="flex justify-between text-sm"><span>{INGREDIENTS.bases.find(i => i.id === base)?.name}</span><span className="font-medium">{formatRp(INGREDIENTS.bases.find(i => i.id === base)?.price || 0)}</span></div>
                            <div className="flex justify-between text-sm"><span>{INGREDIENTS.proteins.find(i => i.id === protein)?.name}</span><span className="font-medium">{formatRp(INGREDIENTS.proteins.find(i => i.id === protein)?.price || 0)}</span></div>
                            {veggies.map(vId => { const v = INGREDIENTS.veggies.find(i => i.id === vId); return <div key={vId} className="flex justify-between text-sm"><span>{v?.name}</span><span className="font-medium">{formatRp(v?.price || 0)}</span></div> })}
                        </div>
                        <div className="pt-2 flex justify-between items-center"><span className="text-gray-500 font-medium">Total Harga</span><span className="text-2xl font-bold text-primary">{formatRp(totalPrice)}</span></div>
                    </div>
                )}
                </div>
                <div className="p-5 border-t border-gray-100 bg-white flex items-center justify-between mt-auto shrink-0 pb-safe">
                    <div className="flex flex-col"><span className="text-xs text-gray-500 font-medium">Estimasi Harga</span><span className="text-lg font-bold text-gray-900">{formatRp(totalPrice)}</span></div>
                    <div className="flex gap-3">
                        {step > 1 && <button onClick={() => setStep(s=>s-1)} className="px-5 py-3 rounded-xl font-semibold text-gray-600 bg-gray-100">Kembali</button>}
                        {step < 4 ? <button onClick={() => setStep(s=>s+1)} disabled={isNextDisabled} className="px-6 py-3 rounded-xl font-bold text-white bg-gray-900 disabled:opacity-50">Lanjut</button> 
                                  : <button onClick={handleAdd} className="px-6 py-3 rounded-xl font-bold text-white bg-primary flex items-center gap-2"><ShoppingBag className="w-4 h-4" /> Masukkan</button>}
                    </div>
                </div>
            </div>
        </div>
    );
}
