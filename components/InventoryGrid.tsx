import React, { useState, useMemo } from 'react';
import { Room, Tile, Product, InventoryItem } from '../types';
import { InteractionMode } from '../App';
import TileModal from './TileModal';
import QuickEntryModal from './QuickEntryModal';
import BlockedLabelModal from './BlockedLabelModal';

interface InventoryGridProps {
  room: Room;
  products: Product[];
  isEditMode: boolean;
  interactionMode: InteractionMode;
  onUpdateTiles: (tiles: Tile | Tile[]) => void;
}

const InventoryGrid: React.FC<InventoryGridProps> = ({ room, products, isEditMode, interactionMode, onUpdateTiles }) => {
  const [selectedTile, setSelectedTile] = useState<Tile | null>(null);
  const [dragOverTileId, setDragOverTileId] = useState<string | null>(null);
  const [dropPrompt, setDropPrompt] = useState<{tile: Tile, product: Product} | null>(null);
  const [labelEditorTile, setLabelEditorTile] = useState<Tile | null>(null);
  const [interactionSource, setInteractionSource] = useState<Tile | null>(null);

  const blockedRegions = useMemo(() => {
    const visited = new Set<string>();
    const regions: Array<{
      tiles: Tile[];
      label: string;
      labelColor: string;
      labelFontSize: number;
      labelIsBold: boolean;
      labelIsItalic: boolean;
      bgColor: string;
      id: string;
      minX: number;
      maxX: number;
      minY: number;
      maxY: number;
    }> = [];

    const getTileAt = (x: number, y: number) => room.tiles.find(t => t.x === x && t.y === y);

    room.tiles.forEach(tile => {
      if (tile.isBlocked && !visited.has(tile.id)) {
        const regionTiles: Tile[] = [];
        const queue = [tile];
        visited.add(tile.id);

        let regionLabel = '';
        let regionLabelColor = '#ffffff';
        let regionFontSize = 10;
        let regionBold = true;
        let regionItalic = false;
        let regionBgColor = '#1e293b'; 

        while (queue.length > 0) {
          const t = queue.shift()!;
          regionTiles.push(t);
          
          if (t.label && !regionLabel) {
            regionLabel = t.label;
            regionLabelColor = t.labelColor || '#ffffff';
            regionFontSize = t.labelFontSize || 10;
            regionBold = t.labelIsBold !== false;
            regionItalic = t.labelIsItalic || false;
            regionBgColor = t.blockedBgColor || '#1e293b';
          }

          const neighbors = [
            getTileAt(t.x + 1, t.y),
            getTileAt(t.x - 1, t.y),
            getTileAt(t.x, t.y + 1),
            getTileAt(t.x, t.y - 1),
          ];

          neighbors.forEach(n => {
            if (n && n.isBlocked && !visited.has(n.id)) {
              visited.add(n.id);
              queue.push(n);
            }
          });
        }

        const xs = regionTiles.map(rt => rt.x);
        const ys = regionTiles.map(rt => rt.y);

        regions.push({
          tiles: regionTiles,
          label: regionLabel,
          labelColor: regionLabelColor,
          labelFontSize: regionFontSize,
          labelIsBold: regionBold,
          labelIsItalic: regionItalic,
          bgColor: regionBgColor,
          id: `region-${regionTiles[0].id}`,
          minX: Math.min(...xs),
          maxX: Math.max(...xs),
          minY: Math.min(...ys),
          maxY: Math.max(...ys),
        });
      }
    });

    return regions;
  }, [room.tiles]);

  const handleTileClick = (tile: Tile) => {
    if (interactionMode !== 'default') {
      if (!interactionSource) {
        if (tile.items.length > 0 || tile.isBlocked) {
          setInteractionSource(tile);
        }
      } else {
        if (interactionSource.id === tile.id) {
          setInteractionSource(null);
          return;
        }

        const sourceUpdate = interactionMode === 'move' ? {
          ...interactionSource,
          items: [],
          isBlocked: false,
          label: '',
          blockedBgColor: undefined,
          labelColor: undefined,
          labelFontSize: undefined,
          labelIsBold: undefined,
          labelIsItalic: undefined
        } : interactionSource;

        const targetUpdate = {
          ...tile,
          items: interactionMode === 'copy' 
            ? [...tile.items, ...interactionSource.items.map(i => ({ ...i, id: `copy-${Date.now()}-${i.id}` }))]
            : [...interactionSource.items],
          isBlocked: interactionSource.isBlocked,
          label: interactionSource.label,
          blockedBgColor: interactionSource.blockedBgColor,
          labelColor: interactionSource.labelColor,
          labelFontSize: interactionSource.labelFontSize,
          labelIsBold: interactionSource.labelIsBold,
          labelIsItalic: interactionSource.labelIsItalic
        };

        if (interactionMode === 'move') {
          onUpdateTiles([sourceUpdate, targetUpdate]);
        } else {
          onUpdateTiles(targetUpdate);
        }
        
        setInteractionSource(null);
      }
      return;
    }

    if (isEditMode) {
      if (!tile.isBlocked) {
        onUpdateTiles({ ...tile, isBlocked: true });
      } else {
        setLabelEditorTile(tile);
      }
    } else if (!tile.isBlocked) {
      setSelectedTile(tile);
    }
  };

  const handleQuickEntrySave = (quantity: number, lotCode: string, expirationDate: string) => {
    if (!dropPrompt) return;
    const { tile, product } = dropPrompt;
    const newItem: InventoryItem = {
      id: `item-${Date.now()}`,
      productId: product.id,
      quantity,
      lotCode,
      expirationDate
    };
    onUpdateTiles({ ...tile, items: [...tile.items, newItem] });
    setDropPrompt(null);
  };

  const getBlockedTileStyles = (tile: Tile) => {
    const hasBlockedNeighbor = (dx: number, dy: number) => {
      const neighbor = room.tiles.find(t => t.x === tile.x + dx && t.y === tile.y + dy);
      return neighbor?.isBlocked || false;
    };
    const top = hasBlockedNeighbor(-1, 0);
    const bottom = hasBlockedNeighbor(1, 0);
    const left = hasBlockedNeighbor(0, -1);
    const right = hasBlockedNeighbor(0, 1);
    const customBg = tile.blockedBgColor || '#1e293b';

    return {
      borderTopWidth: top ? '0px' : '1px',
      borderBottomWidth: bottom ? '0px' : '1px',
      borderLeftWidth: left ? '0px' : '1px',
      borderRightWidth: right ? '0px' : '1px',
      borderRadius: '0px',
      backgroundColor: customBg,
      borderColor: 'rgba(0,0,0,0.15)'
    };
  };

  return (
    <div className="relative">
      <div 
        className={`grid gap-0 bg-slate-200 p-4 rounded-2xl shadow-xl overflow-x-auto relative ${interactionMode !== 'default' ? 'cursor-crosshair' : ''}`}
        style={{ 
          gridTemplateColumns: `repeat(${room.cols}, minmax(75px, 1fr))`,
          width: 'fit-content',
          minWidth: '100%'
        }}
      >
        {room.tiles.map((tile) => {
          const itemCount = tile.items.reduce((sum, item) => sum + item.quantity, 0);
          const hasItems = itemCount > 0;
          const isDragOver = dragOverTileId === tile.id;
          const isSource = interactionSource?.id === tile.id;
          const blockedStyles = tile.isBlocked ? getBlockedTileStyles(tile) : {};
          
          return (
            <button
              key={tile.id}
              onClick={() => handleTileClick(tile)}
              onDragOver={(e) => {
                if (tile.isBlocked || isEditMode || interactionMode !== 'default') return;
                e.preventDefault();
                setDragOverTileId(tile.id);
              }}
              onDragLeave={() => setDragOverTileId(null)}
              onDrop={(e) => {
                if (tile.isBlocked || isEditMode || interactionMode !== 'default') return;
                e.preventDefault();
                setDragOverTileId(null);
                const productId = e.dataTransfer.getData('productId');
                const product = products.find(p => p.id === productId);
                if (product) setDropPrompt({ tile, product });
              }}
              style={{
                ...blockedStyles,
                minHeight: '75px'
              }}
              className={`
                grid-tile border flex flex-col items-center justify-center transition-all relative
                ${tile.isBlocked 
                  ? 'cursor-pointer hover:brightness-110' 
                  : isDragOver
                    ? 'bg-indigo-50 border-indigo-500 ring-4 ring-indigo-200 ring-inset z-10'
                    : hasItems 
                      ? 'bg-indigo-600 border-indigo-700 text-white shadow-md z-10 rounded-sm' 
                      : 'bg-white border-slate-100 hover:border-indigo-300 hover:bg-slate-50 text-slate-300 rounded-sm'}
                ${isSource ? (interactionMode === 'move' ? 'ring-4 ring-orange-500 ring-offset-2 z-50 animate-pulse' : 'ring-4 ring-indigo-500 ring-offset-2 z-50 animate-pulse') : ''}
              `}
            >
              {tile.isBlocked ? null : (
                <>
                  {hasItems && (
                    <div className="flex flex-col items-center justify-center w-full h-full p-1 pointer-events-none overflow-hidden text-center">
                      <div className="text-[8px] leading-tight text-center w-full whitespace-normal break-words font-bold uppercase line-clamp-2 mb-0.5 opacity-90">
                        {products.find(p => p.id === tile.items[0].productId)?.name}
                      </div>
                      <span className="text-xs font-black tracking-tighter drop-shadow-sm">{itemCount}</span>
                    </div>
                  )}
                  {!hasItems && !isDragOver && (
                    <span className="text-[8px] opacity-10 font-bold">{tile.x},{tile.y}</span>
                  )}
                </>
              )}
            </button>
          );
        })}

        {blockedRegions.map(region => {
          if (!region.label) return null;
          const width = (region.maxY - region.minY + 1);
          const height = (region.maxX - region.minX + 1);
          return (
            <div 
              key={region.id}
              className="absolute pointer-events-none flex items-center justify-center text-center px-4"
              style={{
                top: 16 + region.minX * 75, 
                left: 16 + region.minY * 75,
                width: width * 75,
                height: height * 75,
                zIndex: 20,
                color: region.labelColor,
                fontSize: `${region.labelFontSize}px`,
                fontWeight: region.labelIsBold ? '800' : '400',
                fontStyle: region.labelIsItalic ? 'italic' : 'normal',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}
            >
              <div className="break-words max-w-full leading-tight uppercase tracking-wide">
                {region.label}
              </div>
            </div>
          );
        })}
      </div>

      {dropPrompt && (
        <QuickEntryModal 
          product={dropPrompt.product}
          onClose={() => setDropPrompt(null)}
          onSave={handleQuickEntrySave}
        />
      )}

      {selectedTile && (
        <TileModal 
          tile={selectedTile}
          products={products}
          onClose={() => setSelectedTile(null)}
          onSave={(updatedItems) => {
            onUpdateTiles({ ...selectedTile, items: updatedItems });
            setSelectedTile(null);
          }}
        />
      )}

      {labelEditorTile && (
        <BlockedLabelModal
          tile={labelEditorTile}
          onClose={() => setLabelEditorTile(null)}
          onSave={(updates) => {
            const region = blockedRegions.find(r => r.tiles.some(rt => rt.id === labelEditorTile.id));
            if (region) {
              const updatedTiles = region.tiles.map(t => ({ ...t, ...updates }));
              onUpdateTiles(updatedTiles);
            } else {
              onUpdateTiles({ ...labelEditorTile, ...updates });
            }
            setLabelEditorTile(null);
          }}
          onUnblock={() => {
            const region = blockedRegions.find(r => r.tiles.some(rt => rt.id === labelEditorTile.id));
            const resetProps = {
              isBlocked: false, 
              label: '', 
              blockedBgColor: undefined, 
              labelColor: undefined,
              labelFontSize: undefined,
              labelIsBold: undefined,
              labelIsItalic: undefined
            };
            if (region) {
              const updatedTiles = region.tiles.map(t => ({ ...t, ...resetProps }));
              onUpdateTiles(updatedTiles);
            } else {
              onUpdateTiles({ ...labelEditorTile, ...resetProps });
            }
            setLabelEditorTile(null);
          }}
        />
      )}
    </div>
  );
};

export default InventoryGrid;