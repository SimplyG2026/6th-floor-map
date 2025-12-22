import React, { useMemo, useState } from 'react';
import { Room, Product } from '../types';

interface InventorySummaryProps {
  rooms: Room[];
  products: Product[];
}

const InventorySummary: React.FC<InventorySummaryProps> = ({ rooms, products }) => {
  // Grouped summary: Aggregates quantities by Product + Room
  const groupedSummary = useMemo(() => {
    const groups: Record<string, {
      product: Product,
      quantity: number,
      roomName: string,
      id: string
    }> = {};

    rooms.forEach(room => {
      room.tiles.forEach(tile => {
        tile.items.forEach(item => {
          const product = products.find(p => p.id === item.productId);
          if (product) {
            // Group by product ID and room ID
            const key = `${product.id}-${room.id}`;
            if (!groups[key]) {
              groups[key] = {
                product,
                quantity: 0,
                roomName: room.name,
                id: key
              };
            }
            groups[key].quantity += item.quantity;
          }
        });
      });
    });

    return Object.values(groups).sort((a, b) => 
      a.product.name.localeCompare(b.product.name) || a.roomName.localeCompare(b.roomName)
    );
  }, [rooms, products]);

  const [copied, setCopied] = useState(false);

  const generateFormula = () => {
    const currentUrl = window.location.href;
    return `=IMPORTHTML("${currentUrl}", "table", 1)`;
  };

  const copyToClipboard = () => {
    const header = "Product\tCategory\tRoom\tTotal Quantity\n";
    const tableData = groupedSummary.map(row => 
      `${row.product.name}\t${row.product.category}\t${row.roomName}\t${row.quantity}`
    ).join('\n');
    navigator.clipboard.writeText(header + tableData);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Consolidated Inventory Summary</h2>
          <p className="text-slate-500">Total quantities grouped by Product and Room location</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={copyToClipboard}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all border ${copied ? 'bg-green-500 text-white border-green-500' : 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50'}`}
          >
            {copied ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                Copied CSV
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                Copy for Sheets
              </>
            )}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Product Details</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Room Location</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Total Quantity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {groupedSummary.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-slate-400 italic">No inventory recorded yet.</td>
              </tr>
            ) : (
              groupedSummary.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900 text-sm">{row.product.name}</div>
                    <div className="text-[10px] text-slate-400">{row.product.category}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-bold border border-blue-100">
                      {row.roomName}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-base font-black text-indigo-600">{row.quantity.toLocaleString()}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="bg-indigo-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6H9a1 1 0 0 0 0 2h7.3l-1.6 1.6a1 1 0 0 0 1.4 1.4l3.3-3.3a1 1 0 0 0 0-1.4l-3.3-3.3a1 1 0 0 0-1.4 0zM12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" /></svg>
        </div>
        
        <div className="relative z-10">
          <h3 className="text-xl font-bold mb-2">Google Sheets Integration</h3>
          <p className="text-indigo-200 text-sm mb-6 max-w-lg">
            This table provides a consolidated view of your inventory. Use "Copy for Sheets" to paste directly into Excel or Google Sheets, or use the IMPORTHTML formula to link live data.
          </p>
          
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">IMPORTHTML Formula</label>
            <div className="flex gap-2">
              <code className="flex-1 bg-indigo-950 p-4 rounded-xl text-indigo-100 font-mono text-sm border border-indigo-800 break-all">
                {generateFormula()}
              </code>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(generateFormula());
                  alert('Formula copied!');
                }}
                className="bg-white text-indigo-900 p-4 rounded-xl hover:bg-indigo-50 transition-all shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventorySummary;
