import React, { useState } from 'react';
import { Tile, Product, InventoryItem } from '../types';

interface TileModalProps {
  tile: Tile;
  products: Product[];
  onClose: () => void;
  onSave: (items: InventoryItem[]) => void;
}

const TileModal: React.FC<TileModalProps> = ({ tile, products, onClose, onSave }) => {
  const [items, setItems] = useState<InventoryItem[]>([...tile.items]);
  const [addingNew, setAddingNew] = useState(false);
  const [newItem, setNewItem] = useState({
    productId: products[0]?.id || '',
    quantity: 1,
    lotCode: '',
    expirationDate: ''
  });

  const handleAddItem = () => {
    const item: InventoryItem = {
      id: `item-${Date.now()}`,
      ...newItem
    };
    setItems([...items, item]);
    setAddingNew(false);
    setNewItem({ productId: products[0]?.id || '', quantity: 1, lotCode: '', expirationDate: '' });
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const handleUpdateItem = (id: string, updates: Partial<InventoryItem>) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Tile Details</h3>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Coordinates: {tile.x}, {tile.y}</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-white transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
              Contents
            </h4>
            
            {items.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-slate-100 rounded-xl">
                <p className="text-sm text-slate-400">No items in this location</p>
              </div>
            ) : (
              <div className="space-y-4 overflow-y-auto max-h-[300px] pr-1">
                {items.map(item => {
                  const product = products.find(p => p.id === item.productId);
                  return (
                    <div key={item.id} className="flex flex-col gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl group shadow-sm">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-bold text-slate-900 leading-tight">{product?.name}</p>
                        </div>
                        <button 
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all shrink-0"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 pt-1">
                        <div className="flex flex-col gap-1">
                          <label className="text-[8px] font-bold text-indigo-400 uppercase tracking-wider">Quantity</label>
                          <input 
                            type="number"
                            min="0"
                            value={item.quantity}
                            onChange={(e) => handleUpdateItem(item.id, { quantity: parseInt(e.target.value) || 0 })}
                            className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs font-bold text-black"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Lot Code</label>
                          <input 
                            type="text"
                            value={item.lotCode}
                            onChange={(e) => handleUpdateItem(item.id, { lotCode: e.target.value })}
                            placeholder="Lot..."
                            className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs text-black"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Exp Date</label>
                          <input 
                            type="date"
                            value={item.expirationDate || ''}
                            onChange={(e) => handleUpdateItem(item.id, { expirationDate: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded px-1 py-1 text-[10px] text-black"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {addingNew ? (
            <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl space-y-4 shadow-inner">
              <div>
                <label className="block text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1.5">Product</label>
                <select 
                  className="w-full text-sm border border-indigo-200 rounded-lg p-2 bg-white text-black"
                  value={newItem.productId}
                  onChange={(e) => setNewItem({ ...newItem, productId: e.target.value })}
                >
                  {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1.5">Qty</label>
                  <input 
                    type="number"
                    min="1"
                    className="w-full text-sm border border-indigo-200 rounded-lg p-2 bg-white text-black"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1.5">Lot</label>
                  <input 
                    type="text"
                    className="w-full text-sm border border-indigo-200 rounded-lg p-2 bg-white text-black"
                    value={newItem.lotCode}
                    onChange={(e) => setNewItem({ ...newItem, lotCode: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1.5">Exp</label>
                  <input 
                    type="date"
                    className="w-full text-[10px] border border-indigo-200 rounded-lg p-2 bg-white text-black"
                    value={newItem.expirationDate}
                    onChange={(e) => setNewItem({ ...newItem, expirationDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={handleAddItem} className="flex-1 bg-indigo-600 text-white font-bold py-2 rounded-lg text-sm">Add Item</button>
                <button onClick={() => setAddingNew(false)} className="px-4 py-2 text-slate-600 text-sm font-medium">Cancel</button>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => setAddingNew(true)}
              className="w-full py-3 border-2 border-dashed border-indigo-200 text-indigo-600 rounded-2xl flex items-center justify-center gap-2 hover:bg-indigo-50 transition-all font-bold text-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
              Add Product
            </button>
          )}
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button onClick={() => onSave(items)} className="px-6 py-2 bg-slate-900 text-white font-bold rounded-lg shadow-lg hover:bg-slate-800 transition-all text-sm">Save Changes</button>
        </div>
      </div>
    </div>
  );
};

export default TileModal;
