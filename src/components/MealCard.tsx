import React, { useState } from 'react';
import { Meal } from '../types';
import { formatRp } from '../utils';
import { Edit2, Check, X } from 'lucide-react';

interface MealCardProps {
  meal: Meal;
  location: string | null;
  onAdd: () => void;
  onUpdateImage?: (newImgUrl: string) => void;
  onUpdateName?: (newName: string) => void;
}

const MealCard: React.FC<MealCardProps> = ({ meal, location, onAdd, onUpdateImage, onUpdateName }) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameValue, setEditNameValue] = useState(meal.name);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result && onUpdateImage) {
          onUpdateImage(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const saveName = () => {
    if (onUpdateName && editNameValue.trim()) {
      onUpdateName(editNameValue.trim());
    }
    setIsEditingName(false);
  };

  return (
    <div className="bg-card rounded-3xl p-5 flex flex-col gap-4 border border-transparent hover:border-primary/20 transition-all group">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
        <img src={meal.img} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300" alt={meal.name} />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-[10px] font-bold shadow-sm">{meal.distance} km</div>
        
        {onUpdateImage && (
          <label className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent pt-8 pb-3 px-3 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
            <span className="text-white text-xs font-bold font-sans flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              Ganti Foto
            </span>
            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </label>
        )}
      </div>
      <div className="flex flex-col flex-1">
        <div className="flex justify-between items-start gap-2">
          {isEditingName ? (
            <div className="flex items-center gap-1 flex-1">
              <input
                autoFocus
                className="w-full border-b border-primary bg-transparent text-lg font-bold text-gray-900 focus:outline-none"
                value={editNameValue}
                onChange={(e) => setEditNameValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && saveName()}
              />
              <button className="text-green-600 hover:bg-green-50 p-1 rounded-full" onClick={saveName}><Check className="w-4 h-4" /></button>
              <button className="text-red-500 hover:bg-red-50 p-1 rounded-full" onClick={() => { setIsEditingName(false); setEditNameValue(meal.name); }}><X className="w-4 h-4" /></button>
            </div>
          ) : (
            <h4 className="font-bold text-lg leading-tight text-gray-900 relative group/title pr-6">
              {meal.name}
              {onUpdateName && (
                <button
                  onClick={() => setIsEditingName(true)}
                  className="absolute right-0 top-0 opacity-0 group-hover/title:opacity-100 text-gray-400 hover:text-primary transition-opacity"
                  title="Ganti Nama"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              )}
            </h4>
          )}
          {!isEditingName && <span className="text-primary font-bold whitespace-nowrap">{formatRp(meal.price)}</span>}
        </div>
        <p className="text-xs text-gray-400 mt-1 uppercase font-bold tracking-wider line-clamp-1">{meal.desc}</p>
        <button onClick={onAdd} className="w-full bg-white border border-gray-200 text-gray-900 py-3 rounded-xl font-bold text-sm shadow-sm hover:bg-gray-50 transition-all mt-auto mt-4">Tambah ke Keranjang</button>
      </div>
    </div>
  );
};

export default MealCard;
