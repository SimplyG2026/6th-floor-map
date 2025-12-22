import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Room, Tile, InventoryItem, Product, ViewMode, Category, InboundItem } from './types';
import { INITIAL_PRODUCTS, GRID_ROWS, GRID_COLS, CATEGORY_COLORS } from './constants';
import InventoryGrid from './components/InventoryGrid';
import InventorySummary from './components/InventorySummary';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import InboundPanel from './components/InboundPanel';

export type InteractionMode = 'default' | 'copy' | 'move';

const App: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [history, setHistory] = useState<Room[][]>([]);
  const [redoHistory, setRedoHistory] = useState<Room[][]>([]);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(() => {
    const uniqueCats = Array.from(new Set(INITIAL_PRODUCTS.map(p => p.category)));
    return uniqueCats.map(cat => ({
      id: `cat-${cat}`,
      name: cat,
      color: CATEGORY_COLORS[cat]
    }));
  });
  const [viewMode, setViewMode] = useState<ViewMode>('inventory');
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [interactionMode, setInteractionMode] = useState<InteractionMode>('default');
  
  // UI States
  const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useState(false);
  const [isInboundPanelOpen, setIsInboundPanelOpen] = useState(false);
  const [inboundItems, setInboundItems] = useState<InboundItem[]>([]);

  // Initialize with one default room if empty
  useEffect(() => {
    if (rooms.length === 0) {
      const defaultRoom: Room = {
        id: 'room-1',
        name: 'Warehouse A',
        rows: GRID_ROWS,
        cols: GRID_COLS,
        tiles: Array.from({ length: GRID_ROWS * GRID_COLS }).map((_, i) => ({
          id: `tile-${i}`,
          x: Math.floor(i / GRID_COLS),
          y: i % GRID_COLS,
          isBlocked: false,
          items: []
        }))
      };
      setRooms([defaultRoom]);
      setActiveRoomId(defaultRoom.id);
    }
  }, [rooms.length]);

  const activeRoom = useMemo(() => 
    rooms.find(r => r.id === activeRoomId) || null,
  [rooms, activeRoomId]);

  const saveToHistory = useCallback((currentRooms: Room[]) => {
    setHistory(prev => {
      const newHistory = [JSON.parse(JSON.stringify(currentRooms)), ...prev];
      return newHistory.slice(0, 30); // Keep last 30 actions
    });
    setRedoHistory([]); // Clear redo history whenever a new action is performed
  }, []);

  const handleUpdateTiles = (updated: Tile | Tile[]) => {
    if (!activeRoomId) return;
    saveToHistory(rooms);
    
    const updatedArray = Array.isArray(updated) ? updated : [updated];
    const updateIds = new Set(updatedArray.map(t => t.id));
    
    setRooms(prev => prev.map(room => {
      if (room.id !== activeRoomId) return room;
      return {
        ...room,
        tiles: room.tiles.map(tile => {
          if (updateIds.has(tile.id)) {
            return updatedArray.find(ut => ut.id === tile.id)!;
          }
          return tile;
        })
      };
    }));
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const currentState = JSON.parse(JSON.stringify(rooms));
    const previousState = history[0];
    
    setRedoHistory(prev => [currentState, ...prev]);
    setRooms(previousState);
    setHistory(prev => prev.slice(1));
  };

  const handleRedo = () => {
    if (redoHistory.length === 0) return;
    const currentState = JSON.parse(JSON.stringify(rooms));
    const nextState = redoHistory[0];

    setHistory(prev => [currentState, ...prev]);
    setRooms(nextState);
    setRedoHistory(prev => prev.slice(1));
  };

  const handleAddRoom = (name: string, rows: number, cols: number) => {
    saveToHistory(rooms);
    const newRoom: Room = {
      id: `room-${Date.now()}`,
      name,
      rows: rows,
      cols: cols,
      tiles: Array.from({ length: rows * cols }).map((_, i) => ({
        id: `tile-${Date.now()}-${i}`,
        x: Math.floor(i / cols),
        y: i % cols,
        isBlocked: false,
        items: []
      }))
    };
    setRooms([...rooms, newRoom]);
    setActiveRoomId(newRoom.id);
  };

  const handleUpdateRoom = (id: string, name: string, rows: number, cols: number) => {
    saveToHistory(rooms);
    setRooms(prev => prev.map(room => {
      if (room.id !== id) return room;
      
      const newTiles: Tile[] = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const existingTile = room.tiles.find(t => t.x === r && t.y === c);
          if (existingTile) {
            newTiles.push(existingTile);
          } else {
            newTiles.push({
              id: `tile-${Date.now()}-${r}-${c}`,
              x: r,
              y: c,
              isBlocked: false,
              items: []
            });
          }
        }
      }

      return {
        ...room,
        name,
        rows,
        cols,
        tiles: newTiles
      };
    }));
  };

  const handleDeleteRoom = (id: string) => {
    if (rooms.length <= 1) return;
    saveToHistory(rooms);
    const newRooms = rooms.filter(r => r.id !== id);
    setRooms(newRooms);
    if (activeRoomId === id) {
      setActiveRoomId(newRooms[0].id);
    }
  };

  const handleAddProduct = (product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: `prod-${Date.now()}`
    };
    setProducts(prev => [newProduct, ...prev]);
    if (!categories.find(c => c.name === product.category)) {
      setCategories(prev => [...prev, { id: `cat-${product.category}`, name: product.category }]);
    }
  };

  const handleAddCategory = (name: string) => {
    if (categories.find(c => c.name === name)) return;
    setCategories(prev => [...prev, { id: `cat-${Date.now()}`, name }]);
  };

  const handleReorderCategories = (newCategories: Category[]) => {
    setCategories(newCategories);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
      <Header 
        viewMode={viewMode} 
        setViewMode={setViewMode} 
        isEditMode={isEditMode} 
        setIsEditMode={(val) => {
          setIsEditMode(val);
          if (!val) setInteractionMode('default');
        }}
        interactionMode={interactionMode}
        setInteractionMode={setInteractionMode}
        onUndo={handleUndo}
        canUndo={history.length > 0}
        onRedo={handleRedo}
        canRedo={redoHistory.length > 0}
        onToggleInbound={() => setIsInboundPanelOpen(!isInboundPanelOpen)}
        isInboundOpen={isInboundPanelOpen}
      />
      
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar 
          rooms={rooms} 
          activeRoomId={activeRoomId} 
          setActiveRoomId={setActiveRoomId}
          onAddRoom={handleAddRoom}
          onUpdateRoom={handleUpdateRoom}
          onDeleteRoom={handleDeleteRoom}
          products={products}
          onAddProduct={handleAddProduct}
          categories={categories}
          onAddCategory={handleAddCategory}
          isCollapsed={isLeftSidebarCollapsed}
          onToggleCollapse={() => setIsLeftSidebarCollapsed(!isLeftSidebarCollapsed)}
          onReorderCategories={handleReorderCategories}
        />

        <main className={`flex-1 overflow-auto p-6 transition-all duration-300 ${isLeftSidebarCollapsed ? 'pl-20' : ''} ${isInboundPanelOpen ? 'pr-80' : ''}`}>
          {viewMode === 'inventory' && activeRoom && (
            <div className="max-w-6xl mx-auto">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">{activeRoom.name}</h2>
                  <p className="text-slate-500 text-sm">
                    {activeRoom.rows}x{activeRoom.cols} Grid • 
                    {interactionMode === 'move' ? ' Select source then destination to MOVE' : 
                     interactionMode === 'copy' ? ' Select source then destination to COPY' :
                     isEditMode ? ' Edit Layout Mode' : ' Inventory Mode'}
                  </p>
                </div>
                <div className="flex gap-2">
                   <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-md shadow-sm border border-slate-200 text-[10px] font-bold uppercase text-slate-400">
                     <span className="w-2 h-2 bg-white border border-slate-300 rounded-sm"></span>
                     <span>Available</span>
                   </div>
                   <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-md shadow-sm border border-slate-200 text-[10px] font-bold uppercase text-slate-400">
                     <span className="w-2 h-2 bg-slate-800 rounded-sm"></span>
                     <span>Blocked</span>
                   </div>
                   <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-md shadow-sm border border-slate-200 text-[10px] font-bold uppercase text-slate-400">
                     <span className="w-2 h-2 bg-blue-500 rounded-sm"></span>
                     <span>In Stock</span>
                   </div>
                </div>
              </div>
              <InventoryGrid 
                room={activeRoom} 
                products={products}
                isEditMode={isEditMode}
                interactionMode={interactionMode}
                onUpdateTiles={handleUpdateTiles}
              />
            </div>
          )}

          {viewMode === 'summary' && (
            <div className="max-w-5xl mx-auto">
              <InventorySummary rooms={rooms} products={products} />
            </div>
          )}
        </main>

        <InboundPanel 
          isOpen={isInboundPanelOpen}
          onClose={() => setIsInboundPanelOpen(false)}
          products={products}
          inboundItems={inboundItems}
          setInboundItems={setInboundItems}
        />
      </div>
    </div>
  );
};

export default App;