
import React, { useState } from 'react';

interface MaterialItem {
  name: string;
  unit: string;
  price: string;
  category: string;
  application: string;
}

const KENYAN_MATERIALS: MaterialItem[] = [
  // Flooring
  { name: 'Mazeras Stone (Standard)', unit: 'm²', price: '1,200 - 1,600', category: 'Flooring', application: 'Outdoor/Verandah/Feature Walls' },
  { name: 'Saj Ceramics Floor Tiles', unit: 'm²', price: '950 - 1,400', category: 'Flooring', application: 'General living areas/Kitchen' },
  { name: 'Imported Porcelain Tiles (Spain/India)', unit: 'm²', price: '2,500 - 4,500', category: 'Flooring', application: 'High-end living spaces' },
  { name: 'Laminated Wood Flooring', unit: 'm²', price: '1,800 - 2,800', category: 'Flooring', application: 'Bedrooms' },
  { name: 'Tanga Stone (Rough)', unit: 'm²', price: '1,500 - 2,000', category: 'Flooring', application: 'Landscaping/Driveways' },
  
  // Wall Finishes
  { name: 'Crown Vinyl Matt (20L)', unit: 'Bucket', price: '8,500 - 10,500', category: 'Wall Finishes', application: 'Interior ceilings/Standard walls' },
  { name: 'Crown Silk Emulsion (20L)', unit: 'Bucket', price: '13,000 - 16,000', category: 'Wall Finishes', application: 'Washable interior walls' },
  { name: 'Textured Paint (Ruff n Tuff)', unit: '25kg', price: '4,500 - 6,000', category: 'Wall Finishes', application: 'Exterior walls/Feature pillars' },
  { name: 'Wallpapers (Standard Rolls)', unit: 'Roll', price: '2,500 - 5,000', category: 'Wall Finishes', application: 'Feature walls' },
  
  // Joinery & Timber
  { name: 'Cypress Timber (Planed 4x2)', unit: 'ft', price: '85 - 110', category: 'Joinery', application: 'Roofing/Structural frames' },
  { name: 'Mahogany Timber (1 inch)', unit: 'ft', price: '400 - 550', category: 'Joinery', application: 'Door frames/Furniture' },
  { name: 'MDF Board (18mm Standard)', unit: 'Sheet', price: '3,800 - 4,500', category: 'Joinery', application: 'Wardrobe/Cabinet carcasses' },
  { name: 'High Gloss Boards (Imported)', unit: 'Sheet', price: '8,500 - 12,000', category: 'Joinery', application: 'Modern Kitchen shutters' },
  { name: 'Blue Gum (Post)', unit: 'pc', price: '250 - 400', category: 'Joinery', application: 'Temporary site hoarding/Fencing' },
  
  // Ceilings
  { name: 'Gypsum Board (9mm standard)', unit: 'Sheet', price: '850 - 1,050', category: 'Ceilings', application: 'False ceilings' },
  { name: 'Gypsum Studs (Steel)', unit: 'pc', price: '220 - 300', category: 'Ceilings', application: 'Ceiling framing' },
  { name: 'Cornice (Polystyrene 2.4m)', unit: 'pc', price: '350 - 600', category: 'Ceilings', application: 'Ceiling edges' },
  
  // Sanitary & Hardware
  { name: 'Twyford Close Coupled WC', unit: 'Set', price: '12,000 - 18,000', category: 'Hardware', application: 'General washrooms' },
  { name: 'Granite Countertop (Standard Grey)', unit: 'm', price: '6,500 - 9,000', category: 'Hardware', application: 'Kitchen counters' },
  { name: 'Stainless Steel Sink (Double)', unit: 'pc', price: '5,500 - 12,000', category: 'Hardware', application: 'Kitchen' }
];

const MaterialsTemplate: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(KENYAN_MATERIALS.map(m => m.category)))];

  const filteredMaterials = KENYAN_MATERIALS.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || m.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6 space-y-4">
        <div className="relative">
          <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input 
            type="text"
            placeholder="Search Kenyan materials (e.g., Mazeras, Crown...)"
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 text-xs font-semibold rounded-full border transition-colors ${
                activeCategory === cat 
                  ? 'bg-amber-600 border-amber-600 text-white' 
                  : 'bg-white border-gray-200 text-gray-600 hover:border-amber-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm bg-white">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Material / Finish</th>
              <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Unit</th>
              <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">KES (Est.)</th>
              <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Typical Use</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredMaterials.map((m, idx) => (
              <tr key={idx} className="hover:bg-amber-50/30 transition-colors group">
                <td className="px-4 py-3">
                  <div className="font-bold text-gray-900 text-sm">{m.name}</div>
                  <div className="text-[10px] text-amber-600 font-medium uppercase tracking-tight">{m.category}</div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{m.unit}</td>
                <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right">{m.price}</td>
                <td className="px-4 py-3 text-xs text-gray-500 italic hidden sm:table-cell">{m.application}</td>
              </tr>
            ))}
            {filteredMaterials.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-gray-400 italic text-sm">
                  No materials found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <p className="text-[10px] text-blue-800 leading-relaxed font-medium">
          <i className="fas fa-info-circle mr-1"></i>
          Note: Prices are estimated based on current market rates in Nairobi (Hardware retailers). 
          Costs may vary in Mombasa, Kisumu, or rural areas due to transport logistics. 
          Always include a 10-15% contingency for bulk orders and price fluctuations.
        </p>
      </div>
    </div>
  );
};

export default MaterialsTemplate;
