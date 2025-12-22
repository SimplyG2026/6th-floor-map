
import { Product } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  // Gum Box
  { id: 'gb-1', name: 'Peppermint Gum Box', category: 'Gum Box' },
  { id: 'gb-2', name: 'Ginger Gum Box', category: 'Gum Box' },
  { id: 'gb-3', name: 'Cinnamon Gum Box', category: 'Gum Box' },
  { id: 'gb-4', name: 'Fennel Gum Box', category: 'Gum Box' },
  { id: 'gb-5', name: 'Coffee Gum Box', category: 'Gum Box' },
  { id: 'gb-6', name: 'Maple Gum Box', category: 'Gum Box' },
  { id: 'gb-7', name: 'Cleanse Gum Box', category: 'Gum Box' },
  { id: 'gb-8', name: 'Spearmint Gum Box', category: 'Gum Box' },
  { id: 'gb-9', name: 'Awaken Gum Box', category: 'Gum Box' },
  { id: 'gb-10', name: "Trader Joe's Gum Box", category: 'Gum Box' },
  { id: 'gb-11', name: 'Pumpkin Spice Gum Box', category: 'Gum Box' },
  { id: 'gb-12', name: 'SF Peppermint Gum Box', category: 'Gum Box' },
  { id: 'gb-13', name: 'SF Spearmint Gum Box', category: 'Gum Box' },
  { id: 'gb-14', name: 'SF Bubblegum Gum Box', category: 'Gum Box' },
  { id: 'gb-15', name: 'Valentines Gum Box', category: 'Gum Box' },
  { id: 'gb-16', name: 'Holiday Gum Box', category: 'Gum Box' },
  { id: 'gb-17', name: 'Wintergreen Gum Box', category: 'Gum Box' },

  // Bulk Gum Box
  { id: 'bgb-1', name: 'Cleanse Bulk Gum Box', category: 'Bulk Gum Box' },
  { id: 'bgb-2', name: 'Spearmint Bulk Gum Box', category: 'Bulk Gum Box' },
  { id: 'bgb-3', name: 'SF Spearmint Bulk Gum Box', category: 'Bulk Gum Box' },
  { id: 'bgb-4', name: 'SF Bubblegum Bulk Gum Box', category: 'Bulk Gum Box' },

  // 12pk Carton
  { id: '12c-1', name: 'Peppermint 12pk Carton', category: '12pk Carton' },
  { id: '12c-2', name: 'Ginger 12pk Carton', category: '12pk Carton' },
  { id: '12c-3', name: 'Cinnamon 12pk Carton', category: '12pk Carton' },
  { id: '12c-4', name: 'Fennel 12pk Carton', category: '12pk Carton' },
  { id: '12c-5', name: 'Coffee 12pk Carton', category: '12pk Carton' },
  { id: '12c-6', name: 'Maple 12pk Carton', category: '12pk Carton' },
  { id: '12c-7', name: 'Cleanse 12pk Carton', category: '12pk Carton' },
  { id: '12c-8', name: 'Spearmint 12pk Carton', category: '12pk Carton' },
  { id: '12c-9', name: 'Awaken 12pk Carton', category: '12pk Carton' },
  { id: '12c-10', name: "Trader Joe's 12pk Carton", category: '12pk Carton' },

  // 6pk Carton
  { id: '6c-1', name: 'Peppermint 6pk Carton', category: '6pk Carton' },
  { id: '6c-2', name: 'Ginger 6pk Carton', category: '6pk Carton' },
  { id: '6c-3', name: 'Cinnamon 6pk Carton', category: '6pk Carton' },
  { id: '6c-4', name: 'Fennel 6pk Carton', category: '6pk Carton' },
  { id: '6c-5', name: 'Coffee 6pk Carton', category: '6pk Carton' },
  { id: '6c-6', name: 'Maple 6pk Carton', category: '6pk Carton' },
  { id: '6c-7', name: 'Cleanse 6pk Carton', category: '6pk Carton' },
  { id: '6c-8', name: 'Spearmint 6pk Carton', category: '6pk Carton' },
  { id: '6c-9', name: 'Pumpkin Spice 6pk Carton', category: '6pk Carton' },
  { id: '6c-10', name: 'SF Peppermint 6pk Carton', category: '6pk Carton' },
  { id: '6c-11', name: 'SF Spearmint 6pk Carton', category: '6pk Carton' },
  { id: '6c-12', name: 'SF Bubblegum 6pk Carton', category: '6pk Carton' },
  { id: '6c-13', name: 'Valentines 6pk Carton', category: '6pk Carton' },
  { id: '6c-14', name: 'Holiday 6pk Carton', category: '6pk Carton' },
  { id: '6c-15', name: 'Wintergreen 6pk Carton', category: '6pk Carton' },

  // 3pk Carton
  { id: '3c-1', name: 'SF Peppermint 3pk Carton', category: '3pk Carton' },
  { id: '3c-2', name: 'Holiday 3pk Carton', category: '3pk Carton' },

  // Bulk Carton
  { id: 'bc-1', name: 'Cleanse Bulk Carton', category: 'Bulk Carton' },
  { id: 'bc-2', name: 'Spearmint Bulk Carton', category: 'Bulk Carton' },
  { id: 'bc-3', name: 'SF Spearmint Bulk Carton', category: 'Bulk Carton' },
  { id: 'bc-4', name: 'SF Bubblegum Bulk Carton', category: 'Bulk Carton' },

  // 70ct Bag
  { id: '70b-1', name: 'Cleanse 70ct Bag', category: '70ct Bag' },
  { id: '70b-2', name: 'Spearmint 70ct Bag', category: '70ct Bag' },

  // 5.3 oz Bag
  { id: '53b-1', name: 'Peach Raspberry 5.3 oz Bag', category: '5.3 oz Bag' },
  { id: '53b-2', name: 'Apple Cherry 5.3 oz Bag', category: '5.3 oz Bag' },

  // 1.8 oz Bag
  { id: '18b-1', name: 'Peach Raspberry 1.8 oz Bag', category: '1.8 oz Bag' },
  { id: '18b-2', name: 'Apple Cherry 1.8 oz Bag', category: '1.8 oz Bag' },

  // 12pk MC
  { id: '12mc-1', name: 'Peppermint 12pk MC', category: '12pk MC' },
  { id: '12mc-2', name: 'Ginger 12pk MC', category: '12pk MC' },
  { id: '12mc-3', name: 'Cinnamon 12pk MC', category: '12pk MC' },
  { id: '12mc-4', name: 'Fennel 12pk MC', category: '12pk MC' },
  { id: '12mc-5', name: 'Coffee 12pk MC', category: '12pk MC' },
  { id: '12mc-6', name: 'Maple 12pk MC', category: '12pk MC' },
  { id: '12mc-7', name: 'Cleanse 12pk MC', category: '12pk MC' },
  { id: '12mc-8', name: 'Spearmint 12pk MC', category: '12pk MC' },
  { id: '12mc-9', name: 'Awaken 12pk MC', category: '12pk MC' },
  { id: '12mc-10', name: "Trader Joe's 12pk MC", category: '12pk MC' },

  // 6pk MC
  { id: '6mc-1', name: 'Peppermint 6pk MC', category: '6pk MC' },
  { id: '6mc-2', name: 'Ginger 6pk MC', category: '6pk MC' },
  { id: '6mc-3', name: 'Cinnamon 6pk MC', category: '6pk MC' },
  { id: '6mc-4', name: 'Fennel 6pk MC', category: '6pk MC' },
  { id: '6mc-5', name: 'Coffee 6pk MC', category: '6pk MC' },
  { id: '6mc-6', name: 'Maple 6pk MC', category: '6pk MC' },
  { id: '6mc-7', name: 'Cleanse 6pk MC', category: '6pk MC' },
  { id: '6mc-8', name: 'Spearmint 6pk MC', category: '6pk MC' },
  { id: '6mc-9', name: 'Pumpkin Spice 6pk MC', category: '6pk MC' },
  { id: '6mc-10', name: 'SF Peppermint 6pk MC', category: '6pk MC' },
  { id: '6mc-11', name: 'SF Spearmint 6pk MC', category: '6pk MC' },
  { id: '6mc-12', name: 'SF Bubblegum 6pk MC', category: '6pk MC' },
  { id: '6mc-13', name: 'Valentines 6pk MC', category: '6pk MC' },
  { id: '6mc-14', name: 'Holiday 6pk MC', category: '6pk MC' },
  { id: '6mc-15', name: 'Wintergreen 6pk MC', category: '6pk MC' },

  // 3pk MC
  { id: '3mc-1', name: 'SF Peppermint 3pk MC', category: '3pk MC' },
  { id: '3mc-2', name: 'Holiday 3pk MC', category: '3pk MC' },

  // Bulk MC
  { id: 'bmc-1', name: 'Cleanse Bulk MC', category: 'Bulk MC' },
  { id: 'bmc-2', name: 'Spearmint Bulk MC', category: 'Bulk MC' },
  { id: 'bmc-3', name: 'SF Spearmint Bulk MC', category: 'Bulk MC' },
  { id: 'bmc-4', name: 'SF Bubblegum Bulk MC', category: 'Bulk MC' },

  // 70ct MC
  { id: '70mc-1', name: 'Cleanse 70ct MC', category: '70ct MC' },
  { id: '70mc-2', name: 'Spearmint 70ct MC', category: '70ct MC' },

  // Mints
  { id: 'm-1', name: 'Peppermint Mints', category: 'Mints' },
  { id: 'm-2', name: 'Ginger Mints', category: 'Mints' },
  { id: 'm-3', name: 'Cinnamon Mints', category: 'Mints' },
  { id: 'm-4', name: 'Awaken Mints', category: 'Mints' },
  { id: 'm-5', name: 'Lemon Mints', category: 'Mints' },
  { id: 'm-6', name: 'Wintergreen Mints', category: 'Mints' },
  { id: 'm-7', name: 'Peppermint Bulk Mints', category: 'Mints' },
  { id: 'm-8', name: 'Ginger Bulk Mints', category: 'Mints' },
  { id: 'm-9', name: 'Cinnamon Bulk Mints', category: 'Mints' },
  { id: 'm-10', name: 'Awaken Bulk Mints', category: 'Mints' },
  { id: 'm-11', name: 'Fruit Punch Mints', category: 'Mints' },
  { id: 'm-12', name: 'Citrus Berry Mints', category: 'Mints' },
  { id: 'm-13', name: 'Fruit Punch Bulk Mints', category: 'Mints' },
  { id: 'm-14', name: 'Citrus Berry Bulk Mints', category: 'Mints' },

  // Mint Pouches
  { id: 'mp-1', name: 'Peppermint Mint Pouches', category: 'Mint Pouches' },
  { id: 'mp-2', name: 'Mint to Be Mint Pouches', category: 'Mint Pouches' },
  { id: 'mp-3', name: 'Bachelorette Mint Pouches', category: 'Mint Pouches' },
  { id: 'mp-4', name: 'Flag Mint Pouches', category: 'Mint Pouches' },

  // Raw FB
  { id: 'rfb-1', name: 'Peach Raw FB', category: 'Raw FB' },
  { id: 'rfb-2', name: 'Raspberry Raw FB', category: 'Raw FB' },
  { id: 'rfb-3', name: 'Apple Raw FB', category: 'Raw FB' },
  { id: 'rfb-4', name: 'Cherry Raw FB', category: 'Raw FB' },

  // Chocolate MC
  { id: 'cmc-1', name: 'Salted Peanut Chocolate MC', category: 'Chocolate MC' },
  { id: 'cmc-2', name: 'Peanut Butter Crispies Chocolate MC', category: 'Chocolate MC' },

  // Brown Boxes
  { id: 'bb-1', name: '12x12 Brown Boxes', category: 'Brown Boxes' },
  { id: 'bb-2', name: '16x13 Brown Boxes', category: 'Brown Boxes' },
  { id: 'bb-3', name: '13x7.5 Brown Boxes', category: 'Brown Boxes' },
  { id: 'bb-4', name: '9x7 Brown Boxes', category: 'Brown Boxes' },

  // Other
  { id: 'ot-1', name: 'Shippers Other', category: 'Other' },
];

export const GRID_ROWS = 13;
export const GRID_COLS = 11;

export const CATEGORY_COLORS: Record<string, string> = {
  'Gum Box': 'bg-blue-500',
  'Bulk Gum Box': 'bg-blue-700',
  '12pk Carton': 'bg-green-600',
  '6pk Carton': 'bg-green-500',
  '3pk Carton': 'bg-green-400',
  'Bulk Carton': 'bg-green-700',
  '70ct Bag': 'bg-teal-500',
  '5.3 oz Bag': 'bg-lime-500',
  '1.8 oz Bag': 'bg-lime-400',
  '12pk MC': 'bg-indigo-600',
  '6pk MC': 'bg-indigo-500',
  '3pk MC': 'bg-indigo-400',
  'Bulk MC': 'bg-indigo-700',
  '70ct MC': 'bg-teal-600',
  'Mints': 'bg-purple-500',
  'Mint Pouches': 'bg-violet-500',
  'Raw FB': 'bg-rose-500',
  'Chocolate MC': 'bg-amber-600',
  'Brown Boxes': 'bg-orange-800',
  'Other': 'bg-slate-500',
};
