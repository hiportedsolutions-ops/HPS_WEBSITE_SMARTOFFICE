// HPS website content — single source of truth for all section data.
// Brand: Hi'ported Professional Services (HPS) — BN:3301544

export const HPS_CONTACT = {
  tagline: "Building Businesses, Creating Opportunities & Sustaining Success.",
  shortName: "Hi'ported Professional Services",
  bn: "BN:3301544",
  address:
    "Suit No. B2 Halima Plaza, Behind Old Sahad Store, Balanga Street, Area 11 Garki Abuja-Nigeria",
  emails: ["hiported@gmail.com", "mail@hiported.com"],
  phones: ["+234 811 611 2447", "+234 703 768 2721"],
  phoneTels: ["+2348116112447", "+2347037682721"],
  whatsapp: "https://wa.me/2348116112447",
  hours: "Mon-Fri · 9:00-17:00 WAT",
};

export const NAV_LINKS = [
  { href: "#solutions", label: "Solutions" },
  { href: "#cac", label: "CAC Registrations" },
  { href: "#services", label: "Services" },
  { href: "#about", label: "About HPS" },
  { href: "#contact", label: "Contact" },
];

export const TRUST_ITEMS = [
  "Professional Accountants",
  "Business Consultants",
  "UK & US Registration",
  "Digital Transformation",
  "Technology-Driven",
];

export const SOLUTIONS = [
  {
    icon: "compass",
    title: "Business Advisory",
    desc: "Better strategic decisions, stronger governance, measurable performance.",
    tags: ["STRATEGY", "FEASIBILITY", "GOVERNANCE", "INTERNAL AUDIT"],
  },
  {
    icon: "calculator",
    title: "Accounting Solutions",
    desc: "Reliable financial management that gives you clarity and control.",
    tags: ["BOOKKEEPING", "FINANCIAL REPORTING", "PAYROLL", "TAX", "BUDGETS"],
  },
  {
    icon: "landmark",
    title: "Business Registration",
    desc: "Legally establish and maintain your business, locally and internationally.",
    tags: ["NIGERIA (CAC)", "UNITED KINGDOM", "UNITED STATES", "COMPLIANCE"],
    anchor: "cac",
  },
  {
    icon: "cpu",
    title: "Automation & Technology",
    desc: "Embrace technology that eliminates inefficiency and enforces accountability.",
    tags: ["SMART OFFICE", "CLOUD ACCOUNTING", "AI INTEGRATION", "WORKFLOWS"],
  },
  {
    icon: "bar-chart",
    title: "Research & Analytics",
    desc: "Data-informed decisions backed by rigorous research and clear reporting.",
    tags: ["BUSINESS INTELLIGENCE", "DATA ANALYSIS", "DASHBOARDS", "WRITING"],
  },
  {
    icon: "graduation-cap",
    title: "Learning & Development",
    desc: "Practical training powered by the Hi'ported Business School.",
    tags: ["CORPORATE TRAINING", "ENTREPRENEURSHIP", "AI FOR BUSINESS", "EXCEL"],
  },
] as const;

export const FRAMEWORK_STEPS = [
  {
    n: "STAGE 01",
    num: 1,
    title: "Discover",
    short: "Understand your business deeply.",
    desc: "We study your business, market and numbers to understand exactly where you are, and where the opportunity lies.",
    icon: "search",
  },
  {
    n: "STAGE 02",
    num: 2,
    title: "Design",
    short: "Develop practical, custom solutions.",
    desc: "We develop practical, tailored solutions: strategy, structure, systems and compliance built for your context.",
    icon: "pen-tool",
  },
  {
    n: "STAGE 03",
    num: 3,
    title: "Deploy",
    short: "Implement systems and strategies effectively.",
    desc: "We implement the systems: accounting setups, automation, registration, controls, done properly, end to end.",
    icon: "rocket",
  },
  {
    n: "STAGE 04",
    num: 4,
    title: "Develop",
    short: "Train, empower and strengthen your people.",
    desc: "We train your team so the capability stays in your organization, not just with your consultants.",
    icon: "users",
  },
  {
    n: "STAGE 05",
    num: 5,
    title: "Dominate",
    short: "Achieve sustainable growth and lasting impact.",
    desc: "With systems running and people equipped, your business competes with confidence and grows sustainably.",
    icon: "trophy",
  },
];

export const INDUSTRIES = [
  "Startups",
  "SMEs",
  "NGOs",
  "Churches",
  "Educational Institutions",
  "Manufacturing",
  "Healthcare",
  "Agriculture",
  "Hospitality",
  "Retail",
  "Financial Institutions",
  "Professional Firms",
  "Government Agencies",
];

export const WHY_HPS = [
  {
    title: "Chartered Professionals",
    desc: "Experienced accountants, auditors and consultants who hold themselves to professional and ethical standards.",
  },
  {
    title: "Technology-Driven",
    desc: "Cloud accounting, automation and AI built into our service delivery, not bolted on as an afterthought.",
  },
  {
    title: "Faith-Centered Integrity",
    desc: "We do the right thing even when no one is watching. Your trust is the foundation of our work.",
  },
  {
    title: "Affordable Pricing",
    desc: "Professional-grade services structured to be accessible to startups and growing SMEs.",
  },
  {
    title: "Global Business Support",
    desc: "Register and operate in Nigeria, the UK and the US with a single trusted partner.",
  },
  {
    title: "End-to-End Solutions",
    desc: "From registration to reporting to training, one partner for the entire journey.",
  },
];

export const STORIES = [
  {
    challenge:
      "A growing SME had no reliable financial records and was losing money to untracked expenses.",
    solution:
      "Cloud accounting setup, monthly reporting and a simple internal control framework.",
    result:
      "Clear visibility of cash flow and a 20% reduction in unnecessary spending within six months.",
  },
  {
    challenge:
      "An NGO faced compliance risk with unfiled annual returns and unclear governance structures.",
    solution:
      "Regularized filings, trustee documentation and a governance advisory engagement.",
    result: "Full regulatory compliance restored and renewed donor confidence.",
  },
  {
    challenge:
      "A founder needed to serve international clients but had no legal presence outside Nigeria.",
    solution:
      "UK company registration with full documentation and cross-border advisory support.",
    result:
      "International invoicing and banking within weeks, and a platform for global growth.",
  },
];

export const CAC_PACKAGES = [
  {
    name: "Business Name",
    who: "For sole traders, freelancers & small enterprises",
    features: [
      "CAC name availability search",
      "Business name registration",
      "Certificate of registration",
      "Certified status report",
      "TIN guidance for bank account opening",
    ],
    featured: false,
    serviceParam: "business-name",
    formUrl: "https://forms.gle/Enxqq43wjRYiDx4PA",
  },
  {
    name: "Limited Company (LTD)",
    who: "For startups, growing SMEs & contract-ready businesses",
    features: [
      "CAC name availability search",
      "Company incorporation (LTD)",
      "Certificate of incorporation",
      "Memorandum & Articles of Association",
      "Status report with directors & shareholding",
      "TIN & corporate account guidance",
    ],
    featured: true,
    serviceParam: "ltd",
    formUrl: "https://forms.gle/LinpnZVRbeSxGFuP6",
  },
  {
    name: "NGO / Incorporated Trustees",
    who: "For NGOs, churches, foundations & associations",
    features: [
      "Name search & reservation",
      "Trustees documentation",
      "Constitution drafting support",
      "Newspaper publication guidance",
      "Certificate of incorporation",
    ],
    featured: false,
    serviceParam: "ngo",
    formUrl: "https://forms.gle/LinpnZVRbeSxGFuP6",
  },
];

export const CAC_STEPS = [
  {
    title: "Free consultation",
    desc: "We confirm the right structure for your goals: business name, LTD or incorporated trustees.",
  },
  {
    title: "Name search & reservation",
    desc: "We check availability and reserve your preferred name with CAC (bring two options).",
  },
  {
    title: "Documentation",
    desc: "You provide the required details and ID; we prepare and review every document for accuracy.",
  },
  {
    title: "Filing & payment",
    desc: "We file with CAC and handle all statutory fees and stamp duties transparently.",
  },
  {
    title: "Follow-up & queries",
    desc: "If CAC raises any query, we resolve it. You don't chase anyone.",
  },
  {
    title: "Certificate delivery",
    desc: "You receive your certificate and full documentation, plus guidance on TIN and opening your corporate bank account.",
  },
];

export const CAC_CHECKLISTS = [
  {
    title: "Business Name Registration",
    items: [
      "Two proposed business names",
      "Nature of business",
      "Business address",
      "Proprietor's full name, phone & email",
      "Valid ID (NIN, passport, driver's licence or voter's card)",
      "Passport photograph",
    ],
  },
  {
    title: "Limited Company (LTD)",
    items: [
      "Two proposed company names",
      "Registered office address",
      "Details of directors & shareholders (minimum of one)",
      "Share capital & shareholding structure",
      "Valid ID and passport photo for each director/shareholder",
      "Company objects (what the company will do)",
    ],
  },
];

export const CAC_FAQS = [
  {
    q: "How long does CAC registration take?",
    a: "Business names are typically completed within a few working days once documentation is complete. Company incorporation usually takes one to two weeks depending on CAC processing times and name approval. We keep you updated at every stage.",
  },
  {
    q: "What is the difference between a Business Name and a Limited Company?",
    a: "A business name is simpler and cheaper but does not separate you legally from the business. A limited company (LTD) is a separate legal entity. It protects your personal assets, looks more credible to banks and corporate clients, and is required for many contracts and grants. We'll advise you on which fits your situation during the free consultation.",
  },
  {
    q: "Can I register from outside Abuja, or outside Nigeria?",
    a: "Yes. The entire process is handled remotely nationwide, and we regularly register companies for Nigerians in the diaspora. Everything can be done via WhatsApp and email.",
  },
  {
    q: "What happens after registration?",
    a: "We guide you through obtaining your TIN, opening a corporate bank account, and staying compliant, including annual returns filing so your company is never marked inactive. HPS can also handle your bookkeeping and tax registration as your business grows.",
  },
  {
    q: "Can HPS also register my company in the UK or US?",
    a: "Yes. We provide UK company registration and US LLC registration with full documentation support, ideal if you serve international clients or need foreign invoicing and banking. Ask us about it during your consultation.",
  },
];

export const SERVICE_GROUPS = [
  {
    id: "registration",
    title: "Business Registration & Corporate Compliance",
    desc: "Legally establish and maintain your business, in Nigeria and internationally.",
    services: [
      "CAC Business Name Registration",
      "Company Incorporation (LTD)",
      "NGO / Incorporated Trustees",
      "Annual Returns Filing",
      "Company Secretarial Support",
      "Regulatory Compliance Advisory",
      "UK Company Registration",
      "US LLC Registration",
      "Foreign Business Documentation",
    ],
  },
  {
    id: "accounting",
    title: "Accounting & Bookkeeping",
    desc: "Reliable financial management that gives you clarity, control and confidence.",
    services: [
      "Bookkeeping",
      "Financial Statements Preparation",
      "Accounting System Setup",
      "Monthly Financial Reporting",
      "Payroll Management",
      "Cash Flow Management",
      "Budget Preparation",
      "Cloud Accounting",
      "Financial Data Analytics",
    ],
  },
  {
    id: "tax",
    title: "Tax Advisory & Compliance",
    desc: "Stay tax compliant while minimizing unnecessary tax risk.",
    services: [
      "Tax Registration",
      "Tax Clearance Certificate Processing",
      "VAT Administration",
      "PAYE Management",
      "Company Income Tax Advisory",
      "Tax Planning",
    ],
  },
  {
    id: "audit",
    title: "Internal Audit & Risk Management",
    desc: "Strengthen governance, accountability and internal control.",
    services: [
      "Internal Audit Services",
      "Risk Assessment",
      "Internal Control Review",
      "Fraud Prevention Framework",
      "Compliance & Operational Audit",
      "Process Improvement",
    ],
  },
  {
    id: "advisory",
    title: "Business Advisory & SME Development",
    desc: "Better strategic decisions, from startup to scale.",
    services: [
      "Business Strategy Development",
      "Business Plan Development",
      "Feasibility Studies",
      "Corporate Governance Advisory",
      "Business Health Check",
      "Investment Readiness",
      "Organizational Restructuring",
      "Growth Strategy",
      "Business Mentorship",
    ],
  },
  {
    id: "tech",
    title: "Automation, AI & Digital Business Solutions",
    desc: "Technology that eliminates inefficiency and enforces accountability, including our Smart Office workflow and approval automation system.",
    services: [
      "Business Automation",
      "Smart Office Solutions",
      "Accounting System Implementation",
      "AI for Business Productivity",
      "Digital Record Keeping",
      "Process Digitization",
    ],
  },
  {
    id: "research",
    title: "Research & Professional Writing",
    desc: "Rigorous research and documentation for academics, institutions and professionals.",
    services: [
      "Research Proposal Development",
      "Data Analysis",
      "Business & Technical Reports",
      "Company Profiles & SOPs",
    ],
  },
  {
    id: "school",
    title: "Corporate Training & Entrepreneurship Development",
    desc: "Practical learning powered by the Hi'ported Business School.",
    services: [
      "Accounting & Financial Management",
      "Internal Audit Training",
      "Entrepreneurship & Bootcamps",
      "AI for Business",
      "Data Analytics",
      "Microsoft Excel for Business",
      "Leadership & Governance",
      "Youth Enterprise Development",
      "Women Entrepreneurship Programmes",
    ],
  },
];

export const VALUES = [
  {
    title: "Integrity",
    desc: "We do the right thing, even when no one is watching. Faith-centered honesty guides every engagement.",
  },
  {
    title: "Professionalism",
    desc: "Chartered-standard work, delivered with discipline and respect for your time.",
  },
  {
    title: "Innovation",
    desc: "Automation, AI and cloud tools built into how we deliver, not bolted on.",
  },
  {
    title: "Excellence",
    desc: "We measure ourselves by outcomes, not activity.",
  },
  {
    title: "Accountability",
    desc: "Clear scopes, transparent fees, and responsibility for results.",
  },
  {
    title: "Client Success",
    desc: "Your growth is the metric. Everything else is a means to it.",
  },
  {
    title: "Continuous Learning",
    desc: "We teach what we practise, and keep learning ourselves.",
  },
  {
    title: "Affordability",
    desc: "Professional-grade support structured for startups and SMEs, not just big corporates.",
  },
];

export const SERVICE_OPTIONS = [
  "CAC Registration (Business Name)",
  "CAC Registration (Limited Company)",
  "NGO / Incorporated Trustees",
  "UK / US Company Registration",
  "Accounting & Bookkeeping",
  "Tax Advisory & Compliance",
  "Internal Audit & Risk",
  "Business Advisory / Business Plan",
  "Automation, AI & Smart Office",
  "Research & Professional Writing",
  "Corporate Training / Business School",
  "Other",
];

// Map URL ?service= param values to the matching dropdown option text.
export const SERVICE_PARAM_MAP: Record<string, string> = {
  "business-name": "CAC Registration (Business Name)",
  ltd: "CAC Registration (Limited Company)",
  ngo: "NGO / Incorporated Trustees",
};
