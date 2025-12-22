import React, { useState } from 'react';
import { Product, InboundItem } from '../types';

interface InboundPanelProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  inboundItems: InboundItem[];
  setInboundItems: (items: InboundItem[]) => void;
}

const InboundPanel: React.FC<InboundPanelProps> = ({ 
  isOpen, 
  onClose, 
  products, 
  inboundItems, 
  setInboundItems 
}) => {
  const [pasteText, setPasteText] = useState('');
  const [parseError, setParseError] = useState<string | null>(null);

  const handleParse = () => {
    setParseError(null);
    const lines = pasteText.split('\n').filter(line => line.trim());
    const newItems: InboundItem[] = [];

    lines.forEach(line => {
      // Rough parsing: "Product Name 123"
      // Split by space and check if the last part is a number
      const parts = line.trim().split(/\s+/);
      const qtyStr = parts[parts.length - 1];
      const quantity = parseInt(qtyStr);

      if (isNaN(quantity)) {
        setParseError(`Could not find quantity at end of line: "${line}"`);
        return;
      }

      const productName = parts.slice(0, parts.length - 1).join(' ').trim();
      const product = products.find(p => p.name.toLowerCase() === productName.toLowerCase());

      if (product) {
        newItems.push({
          id: `inbound-${Date.now()}-${newItems.length}`,
          productId: product.id,
          quantity
        });
      } else {
        setParseError(`Product not found: "${productName}"`);
      }
    });

    if (newItems.length > 0) {
      setInboundItems([...inboundItems, ...newItems]);
      setPasteText('');
    }
  };

  const handleDragStart = (e: React.DragEvent, productId: string) => {
    e.dataTransfer.setData('productId', productId);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleClear = () => {
    setInboundItems([]);
  };

  return (
    <div 
      className={`fixed right-0 top-0 h-full bg-white border-l border-slate-200 shadow-2xl transition-all duration-300 z-40 flex flex-col ${isOpen ? 'w-80 translate-x-0' : 'w-0 translate-x-full'}`}
    >
      <div className="pt-16 p-6 flex flex-col h-full overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <svg className="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
            Inbound Manager
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded text-slate-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex flex-col gap-4 flex-1 overflow-hidden">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Paste Product List</label>
            <textarea 
              className="w-full h-32 text-xs p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-teal-500 font-mono text-black"
              placeholder="Peppermint Gum Box 24&#10;Ginger Gum Box 12"
              value={pasteText}
              onChange={e => setPasteText(e.target.value)}
            />
            {parseError && <p className="text-[10px] text-red-500 font-medium">{parseError}</p>}
            <button 
              onClick={handleParse}
              className="w-full bg-teal-600 text-white text-xs font-bold py-2 rounded-lg hover:bg-teal-700 transition-colors shadow-sm"
            >
              Add to Queue
            </button>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden min-h-0 border-t border-slate-100 pt-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pending ({inboundItems.length})</h3>
              {inboundItems.length > 0 && (
                <button onClick={handleClear} className="text-[10px] text-slate-400 hover:text-red-500 font-bold uppercase">Clear All</button>
              )}
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {inboundItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 opacity-40 grayscale">
                  <svg className="w-12 h-12 mb-2 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                  <p className="text-xs font-medium text-slate-500 italic">Queue is empty. Paste a list above to get started.</p>
                </div>
              ) : (
                inboundItems.map((item, idx) => {
                  const product = products.find(p => p.id === item.productId);
                  return (
                    <div 
                      key={item.id}
                      draggable
                      onDragStart={e => handleDragStart(e, item.productId)}
                      className="p-3 bg-white border border-slate-200 rounded-xl shadow-sm cursor-grab active:cursor-grabbing hover:border-teal-400 transition-all group flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 text-xs font-black shrink-0">
                          {item.quantity}
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-xs font-bold text-slate-800 truncate">{product?.name}</p>
                          <p className="text-[9px] text-slate-400 uppercase font-black">{product?.category}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setInboundItems(inboundItems.filter((_, i) => i !== idx))}
                        className="p-1.5 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  );
                })
              )}
            </div>
            {inboundItems.length > 0 && (
              <p className="mt-3 text-[10px] text-slate-400 italic text-center">Drag items onto the grid to fulfill them</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InboundPanel;