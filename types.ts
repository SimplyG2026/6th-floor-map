export interface InventoryItem {
  id: string;
  productId: string;
  quantity: number;
  lotCode: string;
  expirationDate?: string;
}

export interface Tile {
  id: string;
  x: number;
  y: number;
  isBlocked: boolean;
  label?: string;
  labelColor?: string;
  labelFontSize?: number;
  labelIsBold?: boolean;
  labelIsItalic?: boolean;
  blockedBgColor?: string;
  items: InventoryItem[];
}

export interface Room {
  id: string;
  name: string;
  rows: number;
  cols: number;
  tiles: Tile[];
}

export interface Product {
  id: string;
  name: string;
  category: string;
}

export interface Category {
  id: string;
  name: string;
  color?: string;
}

export interface InboundItem {
  id: string;
  productId: string;
  quantity: number;
}

export type ViewMode = 'inventory' | 'summary' | 'setup';