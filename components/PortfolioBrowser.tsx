
import React from 'react';
import { ProjectArchive, ProjectStatus, UserRole } from '../types';

interface PortfolioBrowserProps {
  portfolio: ProjectArchive[];
  onLoadProject: (archive: ProjectArchive) => void;
  onDeleteProject: (id: string) => void;
  userRole: UserRole;
}

const PortfolioBrowser: React.FC<PortfolioBrowserProps> = ({ portfolio, onLoadProject, onDeleteProject, userRole }) => {
  const isClient = userRole === UserRole.CLIENT;

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.PLANNING: return 'bg-blue-100 text-blue-700';
      case ProjectStatus.IN_PROGRESS: return 'bg-amber-100 text-amber-700';
      case ProjectStatus.COMPLETED: return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="font-bold text-gray-900">Company Portfolio</h4>
          <p className="text-xs text-gray-500">
            {isClient ? "Browse our previous transformations." : "History of all archived projects and their documentation."}
          </p>
        </div>
        {!isClient && (
          <div className="bg-amber-50 px-4 py-2 rounded-lg border border-amber-100">
            <span className="text-sm font-bold text-amber-800">{portfolio.length} Projects Archived</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolio.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col group">
            <div className={`relative overflow-hidden ${isClient ? 'h-64' : 'h-40 bg-gray-100'}`}>
              {item.photos.length > 0 ? (
                <img 
                  src={item.photos[0].url} 
                  alt={item.details.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">
                  <i className="fas fa-image text-4xl"></i>
                </div>
              )}
              
              {!isClient && (
                <div className="absolute top-3 left-3">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider shadow-sm ${getStatusColor(item.details.status)}`}>
                    {item.details.status}
                  </span>
                </div>
              )}

              {isClient && (
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <h5 className="font-bold text-white text-lg">{item.details.name}</h5>
                  <p className="text-white/70 text-xs font-medium">{item.details.location}</p>
                </div>
              )}
            </div>
            
            {!isClient && (
              <div className="p-5 flex-1 flex flex-col">
                <h5 className="font-bold text-gray-900 mb-1 group-hover:text-amber-600 transition-colors">{item.details.name}</h5>
                <p className="text-xs text-gray-500 mb-4 flex items-center">
                  <i className="fas fa-user-circle mr-1 text-gray-400"></i> {item.details.client} 
                  <span className="mx-2 text-gray-300">|</span>
                  <i className="fas fa-map-marker-alt mr-1 text-gray-400"></i> {item.details.location}
                </p>
                
                <div className="grid grid-cols-2 gap-2 mb-6">
                  <div className="bg-gray-50 p-2 rounded-lg border border-gray-100 text-center">
                    <div className="text-xs font-bold text-gray-900">{item.completedStages.length}/9</div>
                    <div className="text-[10px] text-gray-400 uppercase font-medium">Stages</div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-lg border border-gray-100 text-center">
                    <div className="text-xs font-bold text-gray-900">{item.photos.length}</div>
                    <div className="text-[10px] text-gray-400 uppercase font-medium">Photos</div>
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-50 flex gap-2">
                  <button 
                    onClick={() => onLoadProject(item)}
                    className="flex-1 bg-amber-600 text-white py-2 rounded-lg text-xs font-bold hover:bg-amber-700 transition shadow-sm shadow-amber-600/20"
                  >
                    <i className="fas fa-folder-open mr-2"></i> Open Project
                  </button>
                  <button 
                    onClick={() => onDeleteProject(item.id)}
                    className="w-10 h-10 flex items-center justify-center border border-red-100 text-red-500 rounded-lg hover:bg-red-50 transition"
                    title="Remove from Portfolio"
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {portfolio.length === 0 && (
          <div className="col-span-full py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <i className="fas fa-archive text-3xl opacity-20"></i>
            </div>
            <p className="text-sm font-bold text-gray-600">No projects archived yet.</p>
            <p className="text-xs text-gray-400 mt-1">
              {isClient ? "Check back later for our latest updates." : "Complete your workflow and archive projects to build your company portfolio."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioBrowser;
