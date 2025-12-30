
import React, { useState, useEffect } from 'react';
import { WORKFLOW_STAGES } from './constants';
import { WorkflowStage, ProjectDetails, ProjectStatus, Supplier, ProjectPhoto, ProjectArchive, User, UserRole, SubscriptionTier, CompanySubscription } from './types';
import Header from './components/Header';
import WorkflowSidebar from './components/WorkflowSidebar';
import AIConsultant from './components/AIConsultant';
import MaterialsTemplate from './components/MaterialsTemplate';
import SupplierDatabase from './components/SupplierDatabase';
import ProgressGallery from './components/ProgressGallery';
import PortfolioBrowser from './components/PortfolioBrowser';
import SubscriptionManager from './components/SubscriptionManager';
import Login from './components/Login';
import RichTextEditor from './components/RichTextEditor';
import { generateProjectProposal } from './services/geminiService';

const INITIAL_SUPPLIERS: Supplier[] = [
  { id: '1', name: 'Tile & Carpet Centre', contact: '0722 000 000', products: ['Tiles & Ceramics', 'Sanitaryware'], rating: 5, location: 'Nairobi - Westlands' },
  { id: '2', name: 'Crown Paints Depot', contact: '0733 111 222', products: ['Paints & Finishes'], rating: 4, location: 'Nairobi - Industrial Area' },
  { id: '3', name: 'Antarc Furniture', contact: 'antarc-ke.com', products: ['Furniture & Decor'], rating: 5, location: 'Nairobi - Mombasa Road' },
  { id: '4', name: 'Gikomba Timber Yard', contact: 'Manual Pick-up', products: ['Timber & Wood'], rating: 3, location: 'Nairobi - Gikomba' }
];

const INITIAL_PHOTOS: ProjectPhoto[] = [
  { id: 'p1', url: 'https://images.unsplash.com/photo-1503387762-592dee58c160?auto=format&fit=crop&q=80&w=800', description: 'Structural shell complete. Ready for plastering and plumbing rough-ins.', date: '2023-11-15', tag: 'General' },
  { id: 'p2', url: 'https://images.unsplash.com/photo-1556912177-f277a0279647?auto=format&fit=crop&q=80&w=800', description: 'Cabinet frames for the kitchen islands being assembled by the joinery team.', date: '2023-12-02', tag: 'Joinery' }
];

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeStageId, setActiveStageId] = useState(WORKFLOW_STAGES[1].id);
  const [completedStages, setCompletedStages] = useState<string[]>([]);
  const [stageNotes, setStageNotes] = useState<Record<string, string>>({});
  
  const [subscription, setSubscription] = useState<CompanySubscription>({
    tier: SubscriptionTier.FREE,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    isAutoRenew: true
  });

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [isMaterialsModalOpen, setIsMaterialsModalOpen] = useState(false);
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false);
  const [isBillingModalOpen, setIsBillingModalOpen] = useState(false);
  const [isGeneratingProposal, setIsGeneratingProposal] = useState(false);
  const [generatedProposal, setGeneratedProposal] = useState<string>('');
  
  const [suppliers, setSuppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [photos, setPhotos] = useState<ProjectPhoto[]>(INITIAL_PHOTOS);
  const [portfolio, setPortfolio] = useState<ProjectArchive[]>([]);
  
  const [projectDetails, setProjectDetails] = useState<ProjectDetails>({
    name: 'Mansionette Renovation',
    client: 'The Wanjiku Family',
    location: 'Karen, Nairobi',
    status: ProjectStatus.IN_PROGRESS
  });

  const [tempProjectDetails, setTempProjectDetails] = useState<ProjectDetails>(projectDetails);

  const CLIENT_STAGES_IDS = ['concept', 'development', 'compliance', 'costing', 'execution', 'styling', 'handover'];
  
  const filteredStages = currentUser?.role === UserRole.CLIENT 
    ? WORKFLOW_STAGES.filter(s => CLIENT_STAGES_IDS.includes(s.id))
    : WORKFLOW_STAGES;

  const isClient = currentUser?.role === UserRole.CLIENT;
  const isDesigner = currentUser?.role === UserRole.DESIGNER;
  const isPro = subscription.tier !== SubscriptionTier.FREE;
  
  useEffect(() => {
    const savedPortfolio = localStorage.getItem('kazi_portfolio');
    if (savedPortfolio) setPortfolio(JSON.parse(savedPortfolio));

    const savedNotes = localStorage.getItem('kazi_stage_notes');
    if (savedNotes) setStageNotes(JSON.parse(savedNotes));

    const savedSub = localStorage.getItem('kazi_subscription');
    if (savedSub) setSubscription(JSON.parse(savedSub));
    
    const savedUser = sessionStorage.getItem('kazi_user');
    if (savedUser) setCurrentUser(JSON.parse(savedUser));
  }, []);

  useEffect(() => {
    localStorage.setItem('kazi_portfolio', JSON.stringify(portfolio));
    localStorage.setItem('kazi_stage_notes', JSON.stringify(stageNotes));
    localStorage.setItem('kazi_subscription', JSON.stringify(subscription));
  }, [portfolio, stageNotes, subscription]);

  const activeStage = WORKFLOW_STAGES.find(s => s.id === activeStageId) || WORKFLOW_STAGES[1];

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    sessionStorage.setItem('kazi_user', JSON.stringify(user));
    if (user.role === UserRole.CLIENT && !CLIENT_STAGES_IDS.includes(activeStageId)) {
      setActiveStageId('concept');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('kazi_user');
  };

  const handleUpgrade = (tier: SubscriptionTier) => {
    setSubscription({
      ...subscription,
      tier,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    });
  };

  const toggleComplete = (id: string) => {
    if (isClient) return;
    setCompletedStages(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const updateStageNote = (html: string) => {
    setStageNotes(prev => ({ ...prev, [activeStageId]: html }));
  };

  const progressPercentage = Math.round((completedStages.length / WORKFLOW_STAGES.length) * 100);

  const handleSaveProjectDetails = (e: React.FormEvent) => {
    e.preventDefault();
    setProjectDetails(tempProjectDetails);
    setIsProjectModalOpen(false);
  };

  const openProjectModal = () => {
    if (isClient) return;
    setTempProjectDetails(projectDetails);
    setIsProjectModalOpen(true);
  };

  const handleGenerateProposal = async () => {
    if (!isPro && completedStages.length > 5) {
      setIsBillingModalOpen(true);
      return;
    }
    setIsGeneratingProposal(true);
    const proposal = await generateProjectProposal(projectDetails);
    setGeneratedProposal(proposal || 'Failed to generate proposal.');
    setIsGeneratingProposal(false);
    setIsProposalModalOpen(true);
  };

  const handleAddSupplier = (newSupplier: Supplier) => {
    setSuppliers([...suppliers, newSupplier]);
  };

  const handleAddPhoto = (newPhoto: ProjectPhoto) => {
    setPhotos([newPhoto, ...photos]);
  };

  const handleArchiveProject = () => {
    if (!isPro && portfolio.length >= 1) {
      alert("Free tier is limited to 1 archived project. Upgrade to Pro for unlimited archives.");
      setIsBillingModalOpen(true);
      return;
    }
    const archiveItem: ProjectArchive = {
      id: Date.now().toString(),
      details: { ...projectDetails, status: ProjectStatus.COMPLETED },
      completedStages,
      photos,
      suppliers,
      archivedDate: new Date().toISOString()
    };
    setPortfolio([archiveItem, ...portfolio]);
    alert(`Project "${projectDetails.name}" has been saved to your company portfolio.`);
  };

  const handleLoadProject = (archive: ProjectArchive) => {
    setProjectDetails(archive.details);
    setCompletedStages(archive.completedStages);
    setPhotos(archive.photos);
    setSuppliers(archive.suppliers);
    setActiveStageId(WORKFLOW_STAGES[1].id);
    setIsPortfolioModalOpen(false);
  };

  const handleDeleteFromPortfolio = (id: string) => {
    if (confirm("Are you sure you want to remove this project from your portfolio?")) {
      setPortfolio(portfolio.filter(p => p.id !== id));
    }
  };

  const handleNewProject = () => {
    setProjectDetails({
      name: 'New Interior Project',
      client: 'Prospective Client',
      location: 'Nairobi',
      status: ProjectStatus.PLANNING
    });
    setCompletedStages([]);
    setPhotos([]);
    setStageNotes({});
    setSuppliers(INITIAL_SUPPLIERS);
    setActiveStageId('onboarding');
    setIsProjectModalOpen(true);
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative">
      <Header 
        projectDetails={projectDetails} 
        onEditProject={openProjectModal} 
        onOpenPortfolio={() => setIsPortfolioModalOpen(true)}
        onOpenBilling={() => setIsBillingModalOpen(true)}
        portfolioCount={portfolio.length}
        userRole={currentUser.role}
        subscription={subscription}
      />
      
      {/* Role & Status Badge */}
      <div className="absolute top-[70px] right-6 z-[60] flex items-center gap-3">
         <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm border ${
           isClient ? 'bg-indigo-100 text-indigo-700 border-indigo-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200'
         }`}>
           <i className={`fas ${isClient ? 'fa-user' : 'fa-user-tie'} mr-1.5`}></i>
           {isClient ? 'Client View' : 'Designer Mode'}
         </div>
         <button 
           onClick={handleLogout}
           className="p-1.5 bg-white border border-gray-200 text-gray-400 hover:text-red-500 rounded-lg shadow-sm transition-colors"
           title="Sign Out"
         >
           <i className="fas fa-sign-out-alt"></i>
         </button>
      </div>

      <div className="flex flex-col md:flex-row flex-1">
        <WorkflowSidebar 
          stages={filteredStages} 
          activeStageId={activeStageId} 
          onStageSelect={setActiveStageId}
          completedStages={completedStages}
        />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-5xl mx-auto">
            {/* Top Stats/Progress */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center space-x-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg bg-gradient-to-br from-amber-500 to-amber-700`}>
                  <i className={`fas ${activeStage.icon}`}></i>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{activeStage.title}</h2>
                  <p className="text-sm text-gray-500 flex items-center">
                    <span className="mr-2">Stage {WORKFLOW_STAGES.indexOf(activeStage) + 1} of {WORKFLOW_STAGES.length}</span>
                    {completedStages.includes(activeStageId) && (
                      <span className="text-green-600 font-medium flex items-center">
                        <i className="fas fa-check-circle mr-1"></i> Completed
                      </span>
                    )}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col items-end">
                <div className="w-full md:w-48 bg-gray-100 rounded-full h-2 mb-2">
                  <div 
                    className="bg-amber-600 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <p className="text-xs font-bold text-gray-500">{progressPercentage}% Total Progress</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {/* Designer-only Private Notes */}
                {isDesigner && (
                  <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 animate-in fade-in slide-in-from-top-4 duration-500 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none">
                      <i className="fas fa-user-secret text-6xl"></i>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-900 flex items-center">
                        <i className="fas fa-sticky-note mr-2 text-amber-500"></i>
                        Designer Private Notes
                      </h3>
                      {!isPro && (
                        <button onClick={() => setIsBillingModalOpen(true)} className="text-[10px] text-indigo-600 font-bold hover:underline">
                          Pro Feature <i className="fas fa-lock ml-1"></i>
                        </button>
                      )}
                    </div>
                    {isPro ? (
                      <RichTextEditor 
                        value={stageNotes[activeStageId] || ''} 
                        onChange={updateStageNote} 
                        placeholder={`Jot down specific thoughts for the ${activeStage.title} phase...`}
                      />
                    ) : (
                      <div className="p-8 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-center">
                        <p className="text-xs text-gray-500 mb-3">Upgrade to Pro to unlock private stage-specific brainstorming notes.</p>
                        <button onClick={() => setIsBillingModalOpen(true)} className="text-xs font-bold text-amber-600 hover:text-amber-700">Get Pro Access</button>
                      </div>
                    )}
                  </section>
                )}

                {/* Workflow Actions... */}
                {isDesigner && activeStageId === 'onboarding' && (
                  <section className="bg-gradient-to-r from-amber-600 to-amber-700 rounded-xl p-6 shadow-lg text-white animate-in fade-in duration-500">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center space-x-4">
                        <div className="bg-white/20 p-3 rounded-full">
                          <i className="fas fa-magic text-2xl"></i>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold">Proposal Builder</h3>
                          <p className="text-amber-100 text-sm">Draft a professional strategy based on your 3-step professional framework.</p>
                        </div>
                      </div>
                      <button 
                        onClick={handleGenerateProposal}
                        disabled={isGeneratingProposal}
                        className="bg-white text-amber-700 px-6 py-2 rounded-lg font-bold text-sm hover:bg-amber-50 transition shadow-sm disabled:opacity-50 whitespace-nowrap"
                      >
                        {isGeneratingProposal ? <i className="fas fa-spinner fa-spin mr-2"></i> : 'Generate Proposal'}
                      </button>
                    </div>
                  </section>
                )}

                <section>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Overview</h3>
                  <div className="prose prose-sm text-gray-600 max-w-none">
                    <p className="text-base leading-relaxed">{activeStage.description}</p>
                  </div>
                </section>

                <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="font-bold text-gray-900">Stage Checklist</h3>
                    {isDesigner && (
                      <button 
                        onClick={() => toggleComplete(activeStageId)}
                        className={`text-xs font-bold px-3 py-1 rounded-full transition ${
                          completedStages.includes(activeStageId)
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-amber-600 text-white hover:bg-amber-700'
                        }`}
                      >
                        {completedStages.includes(activeStageId) ? 'Mark as Incomplete' : 'Mark Stage as Finished'}
                      </button>
                    )}
                  </div>
                  <div className="p-6">
                    <ul className="space-y-4">
                      {activeStage.tasks.map((task, idx) => (
                        <li key={idx} className="flex items-start">
                          <div className="flex-shrink-0 mt-0.5">
                            <input 
                              type="checkbox" 
                              disabled={isClient}
                              className={`w-5 h-5 rounded text-amber-600 focus:ring-amber-500 border-gray-300 ${isClient ? 'cursor-default opacity-50' : 'cursor-pointer'}`} 
                            />
                          </div>
                          <span className="ml-3 text-sm text-gray-700">{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>
              </div>

              <div className="space-y-8">
                <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 bg-blue-50 border-b border-blue-100">
                    <h3 className="font-bold text-blue-900 flex items-center">
                      <i className="fas fa-landmark mr-2"></i> Local Insights
                    </h3>
                  </div>
                  <div className="p-6 space-y-6">
                    {activeStage.insights.map((insight, idx) => (
                      <div key={idx}>
                        <h4 className="font-bold text-sm text-gray-900 mb-1">{insight.title}</h4>
                        <p className="text-sm text-gray-600 leading-relaxed italic border-l-2 border-amber-400 pl-3">
                          "{insight.tip}"
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
                <AIConsultant currentStageTitle={activeStage.title} userRole={currentUser.role} />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modals... */}
      {isBillingModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl h-[90vh] overflow-hidden animate-in zoom-in duration-300 flex flex-col">
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <div className="flex items-center space-x-4 text-amber-900">
                <div className="w-12 h-12 bg-gray-900 text-white rounded-2xl flex items-center justify-center text-2xl shadow-lg">
                  <i className="fas fa-credit-card"></i>
                </div>
                <div>
                  <h3 className="font-bold text-xl">Workspace Billing</h3>
                  <p className="text-xs text-gray-500">Manage your subscription and local payment methods.</p>
                </div>
              </div>
              <button onClick={() => setIsBillingModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-2">
                <i className="fas fa-times text-2xl"></i>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 bg-gray-50/50">
              <SubscriptionManager 
                currentSubscription={subscription} 
                onUpgrade={handleUpgrade} 
              />
            </div>
          </div>
        </div>
      )}

      {/* Portfolio Browser Modal */}
      {isPortfolioModalOpen && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl h-[90vh] overflow-hidden animate-in zoom-in duration-300 flex flex-col">
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <div className="flex items-center space-x-4 text-amber-900">
                <div className="w-12 h-12 bg-amber-600 text-white rounded-2xl flex items-center justify-center text-2xl shadow-lg">
                  <i className="fas fa-briefcase"></i>
                </div>
                <div>
                  <h3 className="font-bold text-xl">{isDesigner ? "Company Project Portfolio" : "Transformation Showcase"}</h3>
                  <p className="text-xs text-gray-500">{isDesigner ? "Documented history and archives of your design firm." : "Photos and results from our previous client projects."}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {isDesigner && (
                  <button 
                    onClick={handleNewProject}
                    className="bg-amber-600 text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-amber-700 transition shadow-lg shadow-amber-600/20"
                  >
                    <i className="fas fa-plus mr-2"></i> Start New Project
                  </button>
                )}
                <button onClick={() => setIsPortfolioModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-2">
                  <i className="fas fa-times text-2xl"></i>
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-8 bg-gray-50/50">
              <PortfolioBrowser 
                portfolio={portfolio} 
                onLoadProject={handleLoadProject}
                onDeleteProject={handleDeleteFromPortfolio}
                userRole={currentUser.role}
              />
            </div>
          </div>
        </div>
      )}

      {/* Other Modals (Gallery, Supplier, Materials, Proposal, Details) - Same as before */}
      {isGalleryModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] overflow-hidden animate-in zoom-in duration-300 flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-indigo-50">
              <div className="flex items-center space-x-3 text-indigo-900">
                <i className="fas fa-images text-xl"></i>
                <h3 className="font-bold text-lg">Project Progress Gallery</h3>
              </div>
              <button onClick={() => setIsGalleryModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-2">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
              <ProgressGallery 
                photos={photos} 
                onAddPhoto={handleAddPhoto} 
                projectName={projectDetails.name}
                canAdd={isDesigner}
              />
            </div>
          </div>
        </div>
      )}

      {/* Render rest of the modals exactly as they were in the previous version... */}
      {isDesigner && isSupplierModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] overflow-hidden animate-in zoom-in duration-300 flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-emerald-50">
              <div className="flex items-center space-x-3 text-emerald-900">
                <i className="fas fa-database text-xl"></i>
                <h3 className="font-bold text-lg">Local Supplier Database</h3>
              </div>
              <button onClick={() => setIsSupplierModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-2">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
              <SupplierDatabase suppliers={suppliers} onAddSupplier={handleAddSupplier} />
            </div>
          </div>
        </div>
      )}

      {/* Materials Modal */}
      {isMaterialsModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] overflow-hidden animate-in zoom-in duration-300 flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-blue-50">
              <div className="flex items-center space-x-3 text-blue-900">
                <i className="fas fa-table-list text-xl"></i>
                <h3 className="font-bold text-lg">{isDesigner ? "Kenya Materials & Finishes Guide" : "Project Budget Breakdown"}</h3>
              </div>
              <button onClick={() => setIsMaterialsModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-2">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
              {isDesigner ? <MaterialsTemplate /> : <div className="p-8">Budget data loading...</div>}
            </div>
          </div>
        </div>
      )}

      {/* Proposal Modal */}
      {isProposalModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl h-[85vh] overflow-hidden animate-in slide-in-from-bottom-4 duration-300 flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-900 text-lg">Project Proposal Draft</h3>
              <button onClick={() => setIsProposalModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 prose prose-amber max-w-none prose-sm">
              <pre className="whitespace-pre-wrap font-sans text-gray-700 text-base leading-relaxed">
                {generatedProposal}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {isDesigner && isProjectModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-amber-50/50">
              <h3 className="font-bold text-gray-900 text-lg">Project Settings</h3>
              <button onClick={() => setIsProjectModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <form onSubmit={handleSaveProjectDetails} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Project Name</label>
                <input 
                  type="text" 
                  value={tempProjectDetails.name}
                  onChange={(e) => setTempProjectDetails({...tempProjectDetails, name: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 text-gray-900"
                  required
                />
              </div>
              <button type="submit" className="w-full py-2 bg-amber-600 text-white font-bold rounded-lg shadow-lg">Save</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
