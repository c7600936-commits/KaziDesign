
import { WorkflowStage, Stakeholder } from './types';

export const WORKFLOW_STAGES: WorkflowStage[] = [
  {
    id: 'onboarding',
    title: 'Client Onboarding & Briefing',
    icon: 'fa-handshake',
    description: 'The foundation of the project. Establishing trust, scope, and feasibility within the Kenyan context.',
    stakeholders: [Stakeholder.CLIENT, Stakeholder.DESIGNER],
    deliverables: [
      { title: 'Project Charter', description: 'Signed agreement and scope of work.' },
      { title: 'Site Survey Report', description: 'Detailed measurements and existing condition photos.' },
      { title: 'Project Proposal', description: 'Comprehensive strategy, stakeholders, and timeline.' }
    ],
    insights: [
      { title: 'Payment Culture', tip: 'Kenyan clients often prefer milestone-based payments via M-Pesa or RTGS. Clear contracts on "Commitment Fees" are vital.' },
      { title: 'The "Family" Factor', tip: 'In residential projects, decisions often involve extended family. Identify the primary decision-maker early.' }
    ],
    tasks: [
      'Identify top 5 most important stakeholders',
      'Prepare project proposal (problems, goals, timeline)',
      'Conduct site survey & initial measurements',
      'Present proposal to stakeholders & schedule follow-up',
      'Confirm project scope & sign agreement'
    ]
  },
  {
    id: 'concept',
    title: 'Concept Design',
    icon: 'fa-lightbulb',
    description: 'Defining the visual language and spatial flow using local and global inspirations.',
    stakeholders: [Stakeholder.CLIENT, Stakeholder.DESIGNER],
    deliverables: [
      { title: 'Digital Mood Boards', description: 'Visual direction and color palettes.' },
      { title: 'Space Planning Layouts', description: '2D furniture and traffic flow plans.' },
      { title: 'Material Concepts', description: 'Initial selection of local stones, timbers, and finishes.' }
    ],
    insights: [
      { title: 'Local Materials', tip: 'Incorporate Mazeras or Tanga stone early to manage costs and celebrate Kenyan craftsmanship.' },
      { title: 'Lighting Awareness', tip: 'Natural light is abundant in Kenya; concepts should maximize "Daylighting" to reduce energy costs.' }
    ],
    tasks: [
      'Thematic mood board creation',
      'Space optimization & zoning',
      'Initial material and color selection',
      'Concept presentation & client feedback loop',
      'Final concept approval sign-off'
    ]
  },
  {
    id: 'development',
    title: 'Design Development',
    icon: 'fa-drafting-pencil',
    description: 'Transforming visions into technical realities and realistic visualizations.',
    stakeholders: [Stakeholder.DESIGNER, Stakeholder.ARCHITECT, Stakeholder.ENGINEER],
    deliverables: [
      { title: '3D Renderings', description: 'High-fidelity visualizations of key spaces.' },
      { title: 'Detail Drawings', description: 'Custom joinery and lighting details.' },
      { title: 'Schedules', description: 'Finishes, ironmongery, and sanitaryware lists.' }
    ],
    insights: [
      { title: 'Technical Coordination', tip: 'Ensure ID drawings align with structural and MEP plans (Mechanical, Electrical, Plumbing) common in Nairobi high-rises.' },
      { title: 'Local Standards', tip: 'Use metric units (mm/m) and align with Kenyan Building Code standards for dimensions.' }
    ],
    tasks: [
      '3D modeling & photo-realistic rendering',
      'Detailed joinery drawings (wardrobes, kitchens)',
      'Lighting & Electrical layout coordination',
      'Material specification & performance standards',
      'Review with consultants (Architect/MEP)'
    ]
  },
  {
    id: 'compliance',
    title: 'Statutory & Compliance',
    icon: 'fa-file-shield',
    description: 'Navigating Kenyan regulations and obtaining necessary legal approvals.',
    stakeholders: [Stakeholder.STATUTORY, Stakeholder.ARCHITECT, Stakeholder.DESIGNER],
    deliverables: [
      { title: 'NCA Registration', description: 'National Construction Authority project compliance.' },
      { title: 'County Approval', description: 'Occupation/Renovation permits (e.g., NCC in Nairobi).' },
      { title: 'Safety Certificates', description: 'Fire safety and OSH (Occupational Safety & Health) plans.' }
    ],
    insights: [
      { title: 'NCA Fees', tip: 'Budget for NCA levies (usually 0.5% of contract value for projects over 5M KES).' },
      { title: 'Tenant Fit-out Rules', tip: 'Commercial buildings in Westlands/Upper Hill have website fit-out manuals and security clearance protocols.' }
    ],
    tasks: [
      'Drafting compliance drawings',
      'Submission to County Government for approvals',
      'NCA registration for contractors and project',
      'NEMA assessment (if major structural changes)',
      'Fire & Safety audit coordination'
    ]
  },
  {
    id: 'costing',
    title: 'Costing & Budgeting',
    icon: 'fa-file-invoice-dollar',
    description: 'Precise financial planning to prevent project stalls and ensure value for money.',
    stakeholders: [Stakeholder.CLIENT, Stakeholder.DESIGNER, Stakeholder.CONTRACTOR],
    deliverables: [
      { title: 'Detailed BOQ', description: 'Bill of Quantities with itemized local rates.' },
      { title: 'Value Engineering Report', description: 'Alternatives for high-cost items.' },
      { title: 'Procurement Schedule', description: 'Timeline of payments required.' }
    ],
    insights: [
      { title: 'Price Volatility', tip: 'Nairobi hardware prices (cement, timber, steel) can fluctuate. Include a 10% contingency.' },
      { title: 'Import Duties', tip: 'Factor in KRA duties and clearing costs if importing high-end fixtures from Turkey or China.' }
    ],
    tasks: [
      'Quantity surveying & itemization',
      'Obtaining quotes from local specialist sub-contractors',
      'Comparative pricing analysis',
      'Value engineering sessions with client',
      'Final budget approval & funding plan'
    ]
  },
  {
    id: 'procurement',
    title: 'Procurement & Sourcing',
    icon: 'fa-truck-loading',
    description: 'Managing the supply chain of materials, from local artisans to international imports.',
    stakeholders: [Stakeholder.DESIGNER, Stakeholder.SUPPLIER, Stakeholder.CLIENT],
    deliverables: [
      { title: 'Purchase Orders', description: 'Formal orders for all items.' },
      { title: 'Tracking Sheet', description: 'Lead times and arrival dates.' },
      { title: 'Sample Board', description: 'Physical samples of approved finishes.' }
    ],
    insights: [
      { title: 'Port Delays', tip: 'Items arriving via Mombasa Port can face 2-4 week delays. Order early.' },
      { title: 'Supporting Local', tip: 'Sourcing furniture from workshops in Gikomba or high-end artisans in Karen supports the "Buy Kenya Build Kenya" initiative.' }
    ],
    tasks: [
      'Material sampling & physical approvals',
      'Supplier vetting & quality checks',
      'Order placement & logistics management',
      'Inventory control at site/warehouse',
      'Lead time monitoring & mitigation'
    ]
  },
  {
    id: 'execution',
    title: 'Site Execution & Mgmt',
    icon: 'fa-hard-hat',
    description: 'Active oversight of contractors and "fundis" to ensure design integrity.',
    stakeholders: [Stakeholder.CONTRACTOR, Stakeholder.DESIGNER, Stakeholder.CLIENT],
    deliverables: [
      { title: 'Site Reports', description: 'Weekly progress and site meeting minutes.' },
      { title: 'RFI Log', description: 'Request for Information tracking.' },
      { title: 'Quality Checklists', description: 'Signed-off stages of work.' }
    ],
    insights: [
      { title: 'Fundi Management', tip: 'Direct supervision is often needed. "Measure twice, cut once" is a mantra that needs constant reinforcement on site.' },
      { title: 'Site Meetings', tip: 'Weekly site meetings (often called "Mkutano ya Site") are standard in Kenya to resolve disputes quickly.' }
    ],
    tasks: [
      'Site handover to contractor',
      'Setting out & technical supervision',
      'Weekly progress meetings',
      'Quality control inspections',
      'Health & Safety monitoring'
    ]
  },
  {
    id: 'styling',
    title: 'Installation & Styling',
    icon: 'fa-couch',
    description: 'The final layer of furniture, soft furnishings, and aesthetic detailing.',
    stakeholders: [Stakeholder.DESIGNER, Stakeholder.SUPPLIER, Stakeholder.CLIENT],
    deliverables: [
      { title: 'Snag List', description: 'List of minor defects for rectification.' },
      { title: 'Styled Photography', description: 'Professional photos of the completed space.' },
      { title: 'Furniture Layout', description: 'Final placement of pieces.' }
    ],
    insights: [
      { title: 'Soft Furnishings', tip: 'Kenya has amazing textile options (Kitenge, Maasai shuka accents) that add unique flair during styling.' },
      { title: 'Logistics', tip: 'Lifting furniture to high floors in Nairobi apartments without lifts requires specialized labor (manual lifting).' }
    ],
    tasks: [
      'Furniture assembly & placement',
      'Soft furnishing & curtain installation',
      'Art & accessories styling',
      'Deep cleaning coordination',
      'Final snag list generation'
    ]
  },
  {
    id: 'handover',
    title: 'Handover & Post-Completion',
    icon: 'fa-key',
    description: 'Formal transition of the space to the client and long-term care planning.',
    stakeholders: [Stakeholder.CLIENT, Stakeholder.DESIGNER, Stakeholder.CONTRACTOR],
    deliverables: [
      { title: 'Maintenance Manual', description: 'How to clean and care for materials.' },
      { title: 'Warranty Pack', description: 'Supplier warranties and appliance manuals.' },
      { title: 'Certificate of Completion', description: 'Formal sign-off for final payment.' }
    ],
    insights: [
      { title: 'Retention Fund', tip: 'Kenyan standard practice often involves holding 5% of the contract for 3-6 months (Defects Liability Period).' },
      { title: 'Client Referral', tip: 'A celebratory "House Warming" or "Office Opening" mention is a great way to secure referrals in Kenya.' }
    ],
    tasks: [
      'Final walkthrough & snag rectification',
      'Handover of operation manuals',
      'Settlement of final accounts',
      'Post-occupancy evaluation (1 month later)',
      'Professional project archiving'
    ]
  }
];
