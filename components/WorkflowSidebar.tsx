
import React from 'react';
import { WorkflowStage } from '../types';

interface SidebarProps {
  stages: WorkflowStage[];
  activeStageId: string;
  onStageSelect: (id: string) => void;
  completedStages: string[];
}

const WorkflowSidebar: React.FC<SidebarProps> = ({ stages, activeStageId, onStageSelect, completedStages }) => {
  return (
    <aside className="w-full md:w-80 bg-white border-r border-gray-200 h-auto md:h-[calc(100vh-64px)] overflow-y-auto">
      <div className="p-6">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-6">Project Lifecycle</h2>
        <div className="space-y-2">
          {stages.map((stage, index) => {
            const isActive = stage.id === activeStageId;
            const isCompleted = completedStages.includes(stage.id);
            
            return (
              <button
                key={stage.id}
                onClick={() => onStageSelect(stage.id)}
                className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 group ${
                  isActive 
                    ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-200' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className="relative mr-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    isActive 
                      ? 'bg-amber-600 text-white' 
                      : isCompleted
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'
                  }`}>
                    {isCompleted ? <i className="fas fa-check"></i> : index + 1}
                  </div>
                  {index < stages.length - 1 && (
                    <div className="absolute top-8 left-1/2 -translate-x-1/2 w-px h-4 bg-gray-200" />
                  )}
                </div>
                <div className="text-left">
                  <p className={`text-sm font-semibold ${isActive ? 'text-amber-900' : 'text-gray-700'}`}>
                    {stage.title}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

export default WorkflowSidebar;
