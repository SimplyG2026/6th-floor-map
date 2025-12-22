import React from 'react';
import { ViewMode } from '../types';
import { InteractionMode } from '../App';

interface HeaderProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  isEditMode: boolean;
  setIsEditMode: (edit: boolean) => void;
  interactionMode: InteractionMode;
  setInteractionMode: (mode: InteractionMode) => void;
  onUndo: () => void;
  canUndo: boolean;
  onRedo: () => void;
  canRedo: boolean;
  onToggleInbound: () => void;
  isInboundOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  viewMode, 
  setViewMode, 
  isEditMode, 
  setIsEditMode,
  interactionMode,
  setInteractionMode,
  onUndo,
  canUndo,
  onRedo,
  canRedo,
  onToggleInbound,
  isInboundOpen
}) => {
  return (
    <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shadow-sm z-50">
      <div className="flex items-center gap-3">
        <div className="bg-indigo-600 p-2 rounded-lg">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-900 leading-tight">Mapper Pro</h1>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Inventory System</p>
        </div>
      </div>

      <nav className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
        <button 
          onClick={() => setViewMode('inventory')}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'inventory' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Floorplan
        </button>
        <button 
          onClick={() => setViewMode('summary')}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'summary' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Global Summary
        </button>
        <button 
          onClick={onToggleInbound}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all relative flex items-center gap-2 ${isInboundOpen ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Inbound
          <span className="w-2 h-2 rounded-full bg-teal-500"></span>
        </button>
      </nav>

      <div className="flex items-center gap-3">
        <div className="flex gap-1">
          <button 
            onClick={onUndo}
            disabled={!canUndo}
            className={`p-2 rounded-lg border transition-all ${canUndo ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50' : 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
          </button>
          <button 
            onClick={onRedo}
            disabled={!canRedo}
            className={`p-2 rounded-lg border transition-all ${canRedo ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50' : 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" /></svg>
          </button>
        </div>

        {viewMode === 'inventory' && (
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
             <button 
              onClick={() => setIsEditMode(!isEditMode)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${isEditMode ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Layout Edit
            </button>
            
            {isEditMode && (
              <>
                <div className="w-px h-4 bg-slate-300 mx-1"></div>
                <button 
                  onClick={() => setInteractionMode(interactionMode === 'move' ? 'default' : 'move')}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${interactionMode === 'move' ? 'bg-orange-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Move
                </button>
                <button 
                  onClick={() => setInteractionMode(interactionMode === 'copy' ? 'default' : 'copy')}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${interactionMode === 'copy' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Copy
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;