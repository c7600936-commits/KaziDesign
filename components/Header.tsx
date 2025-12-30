
import React, { useState } from 'react';
import { ProjectDetails, ProjectStatus, UserRole, SubscriptionTier, CompanySubscription } from '../types';

interface HeaderProps {
  projectDetails: ProjectDetails;
  onEditProject: () => void;
  onOpenPortfolio: () => void;
  onOpenBilling: () => void;
  portfolioCount: number;
  userRole: UserRole;
  subscription: CompanySubscription;
}

const Header: React.FC<HeaderProps> = ({ 
  projectDetails, 
  onEditProject, 
  onOpenPortfolio, 
  onOpenBilling,
  portfolioCount, 
  userRole,
  subscription
}) => {
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: `Project: ${projectDetails.name} - KaziDesign`,
      text: `Reviewing workflow for ${projectDetails.client} in ${projectDetails.location}. Current Status: ${projectDetails.status}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setIsSharing(true);
        setTimeout(() => setIsSharing(false), 2000);
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.PLANNING: return 'bg-blue-100 text-blue-700 border-blue-200';
      case ProjectStatus.IN_PROGRESS: return 'bg-amber-100 text-amber-700 border-amber-200';
      case ProjectStatus.ON_HOLD: return 'bg-gray-100 text-gray-700 border-gray-200';
      case ProjectStatus.COMPLETED: return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center text-white shrink-0 relative">
              <i className="fas fa-drafting-pencil text-xl"></i>
              {subscription.tier !== SubscriptionTier.FREE && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 border border-white rounded-full flex items-center justify-center">
                  <i className="fas fa-star text-[6px] text-amber-900"></i>
                </div>
              )}
            </div>
            <div className="overflow-hidden">
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-gray-900 tracking-tight truncate max-w-[150px] md:max-w-xs">
                  {projectDetails.name}
                </h1>
                <span className={`hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${getStatusColor(projectDetails.status)}`}>
                  {projectDetails.status}
                </span>
              </div>
              <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider truncate">
                {projectDetails.client} • {projectDetails.location}
              </p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            {userRole === UserRole.DESIGNER && (
              <button 
                onClick={onOpenBilling}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${
                  subscription.tier === SubscriptionTier.FREE 
                    ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                    : 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
                }`}
              >
                <i className={`fas ${subscription.tier === SubscriptionTier.FREE ? 'fa-rocket' : 'fa-crown'} mr-2`}></i>
                {subscription.tier === SubscriptionTier.FREE ? 'Upgrade Pro' : `${subscription.tier} Workspace`}
              </button>
            )}

            <button 
              onClick={onOpenPortfolio}
              className="relative text-gray-600 hover:text-amber-600 px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center"
            >
              <i className="fas fa-briefcase mr-2"></i>
              Portfolio
              {portfolioCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-600 text-[8px] font-bold text-white ring-2 ring-white">
                  {portfolioCount}
                </span>
              )}
            </button>
            
            <div className="flex items-center space-x-2 border-l pl-4 border-gray-100">
              <button 
                onClick={handleShare}
                className="flex items-center space-x-2 text-gray-700 bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-md text-sm font-semibold transition shadow-sm border border-gray-200"
              >
                <i className={`fas ${isSharing ? 'fa-check text-green-600' : 'fa-share-nodes'}`}></i>
                <span>{isSharing ? 'Link Copied!' : 'Share'}</span>
              </button>
              
              {userRole === UserRole.DESIGNER && (
                <button 
                  onClick={onEditProject}
                  className="bg-amber-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-amber-700 transition shadow-sm"
                >
                  <i className="fas fa-plus mr-2 text-xs"></i>
                  New Project
                </button>
              )}
            </div>
          </div>

          <div className="md:hidden flex items-center space-x-3">
             <button onClick={onOpenBilling} className="p-2 text-amber-600">
              <i className="fas fa-crown"></i>
            </button>
             <button onClick={onOpenPortfolio} className="p-2 text-gray-500 hover:text-amber-600 relative">
              <i className="fas fa-briefcase"></i>
              {portfolioCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-amber-600 rounded-full border border-white"></span>}
            </button>
            <button 
              onClick={handleShare}
              className="p-2 text-gray-500 hover:text-amber-600"
              title="Share Project"
            >
              <i className="fas fa-share-nodes"></i>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
