
import React, { useState } from 'react';
import { Tile } from '../types';

interface BlockedLabelModalProps {
  tile: Tile;
  onClose: () => void;
  onSave: (updates: Partial<Tile>) => void;
  onUnblock: () => void;
}

const BlockedLabelModal: React.FC<BlockedLabelModalProps> = ({ tile, onClose, onSave, onUnblock }) => {
  const [label, setLabel] = useState(tile.label || '');
  const [fontSize, setFontSize] = useState(tile.labelFontSize || 10);
  const [labelColor, setLabelColor] = useState(tile.labelColor || '#ffffff');
  const [bgColor, setBgColor] = useState(tile.blockedBgColor || '#1e293b');
  const [isBold, setIsBold] = useState(tile.labelIsBold !== false); // default true
  const [isItalic, setIsItalic] = useState(tile.labelIsItalic || false);

  const handleSave = () => {
    onSave({
      label,
      labelFontSize: fontSize,
      labelColor,
      blockedBgColor: bgColor,
      labelIsBold: isBold,
      labelIsItalic: isItalic
    });
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200">
        <div className="bg-slate-800 px-6 py-4 text-white flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold">Customize Blocked Area</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Grid Position: {tile.x}, {tile.y}</p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Display Label</label>
            <input 
              autoFocus
              type="text"
              placeholder="e.g. LOADING DOCK..."
              className="w-full text-base font-bold border border-slate-200 rounded-lg p-2 bg-slate-50 focus:ring-2 focus:ring-slate-400 outline-none text-black"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Font Size (px)</label>
              <input 
                type="number"
                min="6"
                max="48"
                className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:ring-2 focus:ring-slate-400 outline-none text-sm text-black"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value) || 10)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Formatting</label>
              <div className="flex gap-2">
                <button 
                  onClick={() => setIsBold(!isBold)}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-bold border transition-all ${isBold ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                >
                  B
                </button>
                <button 
                  onClick={() => setIsItalic(!isItalic)}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm italic border transition-all ${isItalic ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                >
                  I
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Text Color</label>
              <div className="flex items-center gap-2 border border-slate-200 rounded-lg p-1.5 bg-slate-50">
                <input 
                  type="color"
                  className="w-8 h-8 rounded border-0 cursor-pointer p-0 bg-transparent"
                  value={labelColor}
                  onChange={(e) => setLabelColor(e.target.value)}
                />
                <span className="text-xs font-mono text-slate-500 uppercase">{labelColor}</span>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Background</label>
              <div className="flex items-center gap-2 border border-slate-200 rounded-lg p-1.5 bg-slate-50">
                <input 
                  type="color"
                  className="w-8 h-8 rounded border-0 cursor-pointer p-0 bg-transparent"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                />
                <span className="text-xs font-mono text-slate-500 uppercase">{bgColor}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-4">
            <button 
              onClick={handleSave}
              className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-indigo-700 transition-all"
            >
              Apply Styles to Region
            </button>
            <div className="flex gap-2">
              <button 
                onClick={onUnblock}
                className="flex-1 px-4 py-2 bg-red-50 text-red-600 font-bold text-xs rounded-xl hover:bg-red-100 transition-all border border-red-100"
              >
                Unblock Region
              </button>
              <button 
                onClick={onClose}
                className="flex-1 px-4 py-2 text-slate-500 font-medium hover:text-slate-800 transition-colors text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockedLabelModal;
