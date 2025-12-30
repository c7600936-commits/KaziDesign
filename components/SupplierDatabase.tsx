
import React, { useState } from 'react';
import { Supplier } from '../types';

interface SupplierDatabaseProps {
  suppliers: Supplier[];
  onAddSupplier: (supplier: Supplier) => void;
}

const PRODUCT_CATEGORIES = [
  'Timber & Wood', 'Tiles & Ceramics', 'Lighting & Electrical', 
  'Sanitaryware', 'Paints & Finishes', 'Furniture & Decor', 'Hardware & Tools'
];

const KENYAN_LOCATIONS = [
  'Nairobi - Westlands', 'Nairobi - Industrial Area', 'Nairobi - Gikomba', 
  'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret'
];

const SupplierDatabase: React.FC<SupplierDatabaseProps> = ({ suppliers, onAddSupplier }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [filter, setFilter] = useState('');
  const [newSupplier, setNewSupplier] = useState<Partial<Supplier>>({
    name: '',
    contact: '',
    products: [],
    rating: 5,
    location: KENYAN_LOCATIONS[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSupplier.name && newSupplier.contact) {
      onAddSupplier({
        ...newSupplier as Supplier,
        id: Date.now().toString(),
        products: newSupplier.products || []
      });
      setNewSupplier({ name: '', contact: '', products: [], rating: 5, location: KENYAN_LOCATIONS[0] });
      setIsAdding(false);
    }
  };

  const filteredSuppliers = suppliers.filter(s => 
    s.name.toLowerCase().includes(filter.toLowerCase()) ||
    s.products.some(p => p.toLowerCase().includes(filter.toLowerCase())) ||
    s.location.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative flex-1 w-full">
          <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input 
            type="text"
            placeholder="Search by name, product (e.g. Timber), or location..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-emerald-700 transition flex items-center shadow-md whitespace-nowrap"
        >
          <i className={`fas ${isAdding ? 'fa-times' : 'fa-plus'} mr-2`}></i>
          {isAdding ? 'Cancel' : 'Add Supplier'}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-emerald-50 p-6 rounded-xl border border-emerald-100 animate-in slide-in-from-top-2 duration-200 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-emerald-800 uppercase mb-1">Business Name</label>
              <input 
                required
                type="text"
                className="w-full px-3 py-2 bg-white border border-emerald-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="e.g., Tile & Carpet Centre"
                value={newSupplier.name}
                onChange={e => setNewSupplier({...newSupplier, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-emerald-800 uppercase mb-1">Contact Info</label>
              <input 
                required
                type="text"
                className="w-full px-3 py-2 bg-white border border-emerald-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="Phone or Email"
                value={newSupplier.contact}
                onChange={e => setNewSupplier({...newSupplier, contact: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-emerald-800 uppercase mb-1">Location</label>
              <select 
                className="w-full px-3 py-2 bg-white border border-emerald-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                value={newSupplier.location}
                onChange={e => setNewSupplier({...newSupplier, location: e.target.value})}
              >
                {KENYAN_LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
              </select>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-emerald-800 uppercase mb-1">Product Types</label>
              <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto p-2 bg-white rounded-lg border border-emerald-100">
                {PRODUCT_CATEGORIES.map(cat => (
                  <label key={cat} className="flex items-center space-x-2 text-xs text-gray-700 cursor-pointer hover:bg-emerald-50 p-1 rounded">
                    <input 
                      type="checkbox" 
                      className="rounded text-emerald-600"
                      checked={newSupplier.products?.includes(cat)}
                      onChange={e => {
                        const products = newSupplier.products || [];
                        setNewSupplier({
                          ...newSupplier,
                          products: e.target.checked 
                            ? [...products, cat]
                            : products.filter(p => p !== cat)
                        });
                      }}
                    />
                    <span>{cat}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex items-end justify-end pt-2">
              <button type="submit" className="w-full bg-emerald-600 text-white py-2 rounded-lg font-bold hover:bg-emerald-700 transition">
                Save to Database
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSuppliers.map(supplier => (
          <div key={supplier.id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition group">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-bold text-gray-900 group-hover:text-emerald-700 transition">{supplier.name}</h4>
                <p className="text-xs text-gray-500 flex items-center mt-0.5">
                  <i className="fas fa-location-dot mr-1 text-emerald-500"></i>
                  {supplier.location}
                </p>
              </div>
              <div className="flex text-amber-400 text-[10px]">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className={`${i < supplier.rating ? 'fas' : 'far'} fa-star`}></i>
                ))}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-1 mb-4">
              {supplier.products.map(p => (
                <span key={p} className="px-2 py-0.5 bg-gray-50 text-gray-600 text-[10px] font-medium rounded border border-gray-100">
                  {p}
                </span>
              ))}
            </div>

            <div className="pt-3 border-t border-gray-50 flex justify-between items-center">
              <span className="text-xs text-gray-600 font-medium">
                <i className="fas fa-phone mr-1 text-gray-400"></i>
                {supplier.contact}
              </span>
              <button className="text-emerald-600 hover:text-emerald-700 text-xs font-bold">
                Details <i className="fas fa-arrow-right ml-1"></i>
              </button>
            </div>
          </div>
        ))}
        {filteredSuppliers.length === 0 && !isAdding && (
          <div className="col-span-full py-12 text-center text-gray-400 italic">
            <i className="fas fa-store-slash text-3xl mb-3 block opacity-20"></i>
            No suppliers found. Try searching for something else or add a new one.
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplierDatabase;
