
import React, { useState } from 'react';
import { ProjectPhoto } from '../types';

interface ProgressGalleryProps {
  photos: ProjectPhoto[];
  onAddPhoto: (photo: ProjectPhoto) => void;
  projectName: string;
  canAdd?: boolean;
}

const PHOTO_TAGS = ['General', 'Living Room', 'Kitchen', 'Bedroom', 'Bath', 'Outdoor', 'Joinery'];

const ProgressGallery: React.FC<ProgressGalleryProps> = ({ photos, onAddPhoto, projectName, canAdd = true }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [newPhoto, setNewPhoto] = useState<Partial<ProjectPhoto>>({
    url: '',
    description: '',
    tag: 'General',
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPhoto.url && newPhoto.description) {
      onAddPhoto({
        ...newPhoto as ProjectPhoto,
        id: Date.now().toString()
      });
      setNewPhoto({ url: '', description: '', tag: 'General', date: new Date().toISOString().split('T')[0] });
      setIsAdding(false);
    }
  };

  const handleShareGallery = async () => {
    const text = `Check out the latest progress for "${projectName}"! 🏗️📸\n\nI've added ${photos.length} new photos to our project gallery. See the transformation here: ${window.location.href}`;
    
    try {
      if (navigator.share) {
        await navigator.share({ title: projectName, text, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(text);
        setIsSharing(true);
        setTimeout(() => setIsSharing(false), 2000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h4 className="font-bold text-gray-900">Project Progress Visuals</h4>
          <p className="text-xs text-gray-500">Documenting the journey from shell to finish.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button 
            onClick={handleShareGallery}
            className="flex-1 sm:flex-none bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-50 transition flex items-center justify-center shadow-sm"
          >
            <i className={`fas ${isSharing ? 'fa-check text-green-600' : 'fa-share-nodes'} mr-2`}></i>
            {isSharing ? 'Link Copied' : 'Share Gallery'}
          </button>
          {canAdd && (
            <button 
              onClick={() => setIsAdding(!isAdding)}
              className="flex-1 sm:flex-none bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 transition flex items-center justify-center shadow-md"
            >
              <i className={`fas ${isAdding ? 'fa-times' : 'fa-camera'} mr-2`}></i>
              {isAdding ? 'Cancel' : 'Add Progress Photo'}
            </button>
          )}
        </div>
      </div>

      {isAdding && canAdd && (
        <form onSubmit={handleSubmit} className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 animate-in slide-in-from-top-2 duration-200 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-indigo-800 uppercase mb-1">Photo URL</label>
              <input 
                required
                type="url"
                className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="https://images.unsplash.com/..."
                value={newPhoto.url}
                onChange={e => setNewPhoto({...newPhoto, url: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-indigo-800 uppercase mb-1">Date</label>
                <input 
                  type="date"
                  className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={newPhoto.date}
                  onChange={e => setNewPhoto({...newPhoto, date: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-indigo-800 uppercase mb-1">Zone/Tag</label>
                <select 
                  className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={newPhoto.tag}
                  onChange={e => setNewPhoto({...newPhoto, tag: e.target.value})}
                >
                  {PHOTO_TAGS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
          </div>
          <div className="space-y-4 flex flex-col justify-between">
            <div>
              <label className="block text-xs font-bold text-indigo-800 uppercase mb-1">Short Description</label>
              <textarea 
                required
                rows={3}
                className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                placeholder="e.g., Cabinet installation nearly complete in main kitchen."
                value={newPhoto.description}
                onChange={e => setNewPhoto({...newPhoto, description: e.target.value})}
              />
            </div>
            <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg font-bold hover:bg-indigo-700 transition">
              Upload to Progress Log
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {photos.map(photo => (
          <div key={photo.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all group">
            <div className="aspect-video relative overflow-hidden bg-gray-100">
              <img 
                src={photo.url} 
                alt={photo.description}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=800';
                }}
              />
              <div className="absolute top-3 left-3 flex gap-2">
                <span className="px-2 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold rounded-lg uppercase tracking-wider">
                  {photo.tag}
                </span>
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  {new Date(photo.date).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed line-clamp-2">
                {photo.description}
              </p>
            </div>
          </div>
        ))}
        {photos.length === 0 && (
          <div className="col-span-full py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
            <i className="fas fa-images text-4xl mb-3 opacity-20"></i>
            <p className="text-sm font-medium">Your progress photo gallery is empty.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressGallery;
