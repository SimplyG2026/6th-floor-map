import React, { useState, useMemo } from 'react';
import { Room, Product, Category } from '../types';
import { GRID_ROWS, GRID_COLS } from '../constants';

interface SidebarProps {
  rooms: Room[];
  activeRoomId: string | null;
  setActiveRoomId: (id: string) => void;
  onAddRoom: (name: string, rows: number, cols: number) => void;
  onUpdateRoom: (id: string, name: string, rows: number, cols: number) => void;
  onDeleteRoom: (id: string) => void;
  products: Product[];
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  categories: Category[];
  onAddCategory: (name: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onReorderCategories: (categories: Category[]) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  rooms, 
  activeRoomId, 
  setActiveRoomId, 
  onAddRoom, 
  onUpdateRoom,
  onDeleteRoom,
  products,
  onAddProduct,
  categories,
  onAddCategory,
  isCollapsed,
  onToggleCollapse,
  onReorderCategories
}) => {
  const [newRoomName, setNewRoomName] = useState('');
  const [newRows, setNewRows] = useState(GRID_ROWS);
  const [newCols, setNewCols] = useState(GRID_COLS);
  const [showAddRoomForm, setShowAddRoomForm] = useState(false);
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);

  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const [showAddCategoryForm, setShowAddCategoryForm] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  // Form states
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('');
  const [newCatName, setNewCatName] = useState('');
  
  // Drag category state
  const [draggedCategoryIndex, setDraggedCategoryIndex] = useState<number | null>(null);

  const handleAddRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRoomName.trim()) {
      onAddRoom(newRoomName.trim(), newRows || 1, newCols || 1);
      setNewRoomName('');
      setNewRows(GRID_ROWS);
      setNewCols(GRID_COLS);
      setShowAddRoomForm(false);
    }
  };

  const handleEditRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRoomId && newRoomName.trim()) {
      onUpdateRoom(editingRoomId, newRoomName.trim(), newRows, newCols);
      setEditingRoomId(null);
      setNewRoomName('');
    }
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProdName.trim() && newProdCategory.trim()) {
      onAddProduct({
        name: newProdName.trim(),
        category: newProdCategory.trim()
      });
      setNewProdName('');
      setNewProdCategory('');
      setShowAddProductForm(false);
    }
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCatName.trim()) {
      onAddCategory(newCatName.trim());
      setNewCatName('');
      setShowAddCategoryForm(false);
    }
  };

  const handleDragStartProduct = (e: React.DragEvent, productId: string) => {
    e.dataTransfer.setData('productId', productId);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const productsByCategory = useMemo(() => {
    const groups: Record<string, Product[]> = {};
    products.forEach(p => {
      if (!groups[p.category]) groups[p.category] = [];
      groups[p.category].push(p);
    });
    return groups;
  }, [products]);

  const sortedCategories = useMemo(() => {
    // Current category order logic: Use the list in `categories` state, 
    // and append any that exist in products but not in `categories`.
    const categoryNames = categories.map(c => c.name);
    const productCategories = Object.keys(productsByCategory);
    const missingInState = productCategories.filter(cat => !categoryNames.includes(cat));
    
    return [...categories, ...missingInState.map(name => ({ id: `cat-${name}`, name }))];
  }, [categories, productsByCategory]);

  const toggleCategory = (cat: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [cat]: !prev[cat]
    }));
  };

  const openEditMode = (room: Room) => {
    setEditingRoomId(room.id);
    setNewRoomName(room.name);
    setNewRows(room.rows);
    setNewCols(room.cols);
    setShowAddRoomForm(false);
    if (isCollapsed) onToggleCollapse();
  };

  // Drag and drop logic for categories
  const handleCategoryDragStart = (e: React.DragEvent, index: number) => {
    setDraggedCategoryIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleCategoryDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedCategoryIndex === null || draggedCategoryIndex === index) return;
    
    const newOrder = [...sortedCategories];
    const draggedItem = newOrder[draggedCategoryIndex];
    newOrder.splice(draggedCategoryIndex, 1);
    newOrder.splice(index, 0, draggedItem);
    
    setDraggedCategoryIndex(index);
    onReorderCategories(newOrder);
  };

  return (
    <aside className={`bg-white border-r border-slate-200 flex flex-col transition-all duration-300 relative z-20 h-full ${isCollapsed ? 'w-14' : 'w-72'}`}>
      <button 
        onClick={onToggleCollapse}
        className="absolute -right-3 top-20 bg-white border border-slate-200 rounded-full p-1 shadow-sm hover:bg-slate-50 z-30 transition-transform"
        style={{ transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)' }}
      >
        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Main Content Area */}
      <div className={`flex flex-col h-full overflow-hidden ${isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className="p-4 border-b border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Your Rooms</h3>
            <button 
              onClick={() => {
                setShowAddRoomForm(!showAddRoomForm);
                setEditingRoomId(null);
              }}
              className={`p-1 rounded transition-colors ${showAddRoomForm ? 'bg-slate-100 text-slate-600' : 'text-indigo-600 hover:bg-indigo-50'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={showAddRoomForm ? "M6 18L18 6M6 6l12 12" : "M12 4v16m8-8H4"} />
              </svg>
            </button>
          </div>

          {(showAddRoomForm || editingRoomId) ? (
            <form onSubmit={editingRoomId ? handleEditRoom : handleAddRoom} className="bg-slate-50 p-3 rounded-lg border border-slate-200 mb-4 space-y-3">
              <h4 className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">{editingRoomId ? 'Update Room' : 'New Room'}</h4>
              <input 
                autoFocus
                type="text" 
                placeholder="Room Name" 
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-md outline-none focus:ring-1 focus:ring-indigo-500 text-black"
              />
              <div className="grid grid-cols-2 gap-2">
                <input type="number" value={newRows} onChange={e => setNewRows(parseInt(e.target.value) || 0)} className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-md text-black" placeholder="Rows" />
                <input type="number" value={newCols} onChange={e => setNewCols(parseInt(e.target.value) || 0)} className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-md text-black" placeholder="Cols" />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-md">Save</button>
                <button type="button" onClick={() => { setEditingRoomId(null); setShowAddRoomForm(false); }} className="px-2 py-1.5 text-xs text-slate-400">Cancel</button>
              </div>
            </form>
          ) : (
            <div className="space-y-1 mb-4 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
              {rooms.map(room => (
                <div 
                  key={room.id}
                  onClick={() => setActiveRoomId(room.id)}
                  className={`group flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all ${activeRoomId === room.id ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <svg className={`w-4 h-4 shrink-0 ${activeRoomId === room.id ? 'text-indigo-500' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span className="text-sm font-medium truncate">{room.name}</span>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
                    <button onClick={(e) => { e.stopPropagation(); openEditMode(room); }} className="p-1 hover:text-indigo-600"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                    {rooms.length > 1 && (
                      <button onClick={(e) => { e.stopPropagation(); onDeleteRoom(room.id); }} className="p-1 hover:text-red-500"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Catalog</h3>
            <div className="flex gap-1">
              <button onClick={() => setShowAddCategoryForm(!showAddCategoryForm)} className="p-1 text-teal-600 hover:bg-teal-50 rounded" title="Add Category"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg></button>
              <button onClick={() => setShowAddProductForm(!showAddProductForm)} className="p-1 text-indigo-600 hover:bg-indigo-50 rounded" title="Add Product"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg></button>
            </div>
          </div>

          {showAddCategoryForm && (
            <form onSubmit={handleAddCategory} className="bg-teal-50 p-3 rounded-lg border border-teal-100 space-y-2">
              <input autoFocus value={newCatName} onChange={e => setNewCatName(e.target.value)} placeholder="Category Name" className="w-full text-xs p-1.5 border border-teal-200 rounded text-black" required />
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-teal-600 text-white text-[10px] font-bold py-1 rounded">Add</button>
                <button type="button" onClick={() => setShowAddCategoryForm(false)} className="px-2 text-[10px] text-slate-400">Cancel</button>
              </div>
            </form>
          )}

          {showAddProductForm && (
            <form onSubmit={handleAddProduct} className="bg-indigo-50 p-3 rounded-lg border border-indigo-100 space-y-2">
              <input autoFocus value={newProdName} onChange={e => setNewProdName(e.target.value)} placeholder="Product Name" className="w-full text-xs p-1.5 border border-indigo-200 rounded text-black" required />
              <input list="cat-list" value={newProdCategory} onChange={e => setNewProdCategory(e.target.value)} placeholder="Category" className="w-full text-xs p-1.5 border border-indigo-200 rounded text-black" required />
              <datalist id="cat-list">{sortedCategories.map(c => <option key={c.name} value={c.name} />)}</datalist>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-indigo-600 text-white text-[10px] font-bold py-1 rounded">Add</button>
                <button type="button" onClick={() => setShowAddProductForm(false)} className="px-2 text-[10px] text-slate-400">Cancel</button>
              </div>
            </form>
          )}

          <div className="space-y-1">
            {sortedCategories.map((cat, idx) => {
              const catProducts = productsByCategory[cat.name] || [];
              const isExpanded = expandedCategories[cat.name];
              return (
                <div 
                  key={cat.id} 
                  className={`border border-slate-100 rounded-lg overflow-hidden transition-all ${draggedCategoryIndex === idx ? 'opacity-40' : ''}`}
                  onDragOver={(e) => handleCategoryDragOver(e, idx)}
                  onDrop={() => setDraggedCategoryIndex(null)}
                >
                  <div 
                    draggable
                    onDragStart={(e) => handleCategoryDragStart(e, idx)}
                    className="w-full px-3 py-2 bg-slate-50 flex items-center justify-between cursor-grab active:cursor-grabbing hover:bg-slate-100"
                  >
                    <div className="flex items-center gap-2" onClick={() => toggleCategory(cat.name)}>
                      <svg className="w-3 h-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" /></svg>
                      <span className="text-xs font-bold text-slate-700">{cat.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[9px] text-slate-400 font-bold">{catProducts.length}</span>
                      <button onClick={() => toggleCategory(cat.name)} className="p-0.5">
                        <svg className={`w-3 h-3 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                      </button>
                    </div>
                  </div>
                  
                  {isExpanded && (
                    <div className="p-1.5 space-y-1 bg-white">
                      {catProducts.length === 0 ? <p className="text-[10px] italic text-slate-400 p-2">No products</p> : 
                        catProducts.map(p => (
                          <div 
                            key={p.id} 
                            draggable 
                            onDragStart={e => handleDragStartProduct(e, p.id)} 
                            className="p-1.5 text-[11px] bg-white border border-slate-100 rounded cursor-grab hover:border-indigo-300 flex items-center gap-2"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
                            <span className="truncate text-slate-700 font-medium">{p.name}</span>
                          </div>
                        ))
                      }
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Collapsed State Icons */}
      {isCollapsed && (
        <div className="flex flex-col items-center pt-24 gap-6">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
          </div>
          <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;