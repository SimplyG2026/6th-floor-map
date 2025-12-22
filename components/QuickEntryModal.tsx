
import React, { useState } from 'react';
import { Product } from '../types';

interface QuickEntryModalProps {
  product: Product;
  onClose: () => void;
  onSave: (quantity: number, lotCode: string, expirationDate: string) => void;
}

const QuickEntryModal: React.FC<QuickEntryModalProps> = ({ product, onClose, onSave }) => {
  const [quantity, setQuantity] = useState(1);
  const [lotCode, setLotCode] = useState('');
  const [expDate, setExpDate] = useState('');

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-indigo-200">
        <div className="bg-indigo-600 px-6 py-4 text-white">
          <h3 className="text-lg font-bold">New Entry</h3>
          <p className="text-xs text-indigo-100 font-medium truncate">{product.name}</p>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Quantity</label>
            <input 
              autoFocus
              type="number"
              min="1"
              className="w-full text-lg font-bold border border-slate-200 rounded-lg p-3 bg-slate-50 focus:ring-2 focus:ring-indigo-400 outline-none text-black"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
              onKeyDown={(e) => e.key === 'Enter' && onSave(quantity, lotCode, expDate)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Lot Code</label>
              <input 
                type="text"
                placeholder="e.g. L901"
                className="w-full text-sm border border-slate-200 rounded-lg p-2 bg-slate-50 focus:ring-2 focus:ring-indigo-400 outline-none text-black"
                value={lotCode}
                onChange={(e) => setLotCode(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onSave(quantity, lotCode, expDate)}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Exp Date</label>
              <input 
                type="date"
                className="w-full text-[11px] border border-slate-200 rounded-lg p-2 bg-slate-50 focus:ring-2 focus:ring-indigo-400 outline-none text-black"
                value={expDate}
                onChange={(e) => setExpDate(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onSave(quantity, lotCode, expDate)}
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button 
              onClick={() => onSave(quantity, lotCode, expDate)}
              className="flex-1 bg-indigo-600 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-indigo-700 active:scale-95 transition-all"
            >
              Add to Stock
            </button>
            <button 
              onClick={onClose}
              className="px-4 py-3 text-slate-500 font-medium hover:text-slate-800"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickEntryModal;
