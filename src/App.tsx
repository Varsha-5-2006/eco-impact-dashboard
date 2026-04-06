import { StatCard } from './components/StatCard';
import { SectorIcon } from './components/SectorIcon';

import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import { 
  Leaf, 
  TrendingDown, 
  DollarSign, 
  Building2, 
  Home, 
  ShoppingBag, 
  Plane, 
  Info,
  ChevronRight,
  Calculator,
  ArrowRight,
  Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---

interface CaseStudy {
  id: string;
  title: string;
  sector: 'Housing' | 'Office' | 'Retail' | 'Tourism' | 'Transport';
  location: string;
  description: string;
  co2Reduction: number; // in tons/year
  costSavings: number; // in USD/year
  investment: number; // in USD
  paybackPeriod: number; // in years
  strategies: string[];
  data: {
    month: string;
    baseline: number;
    actual: number;
  }[];
}

// --- Mock Data ---

const EMISSION_SOURCES = [
  { category: 'Energy', count: 45 },
  { category: 'Transport', count: 32 },
  { category: 'Waste', count: 18 },
  { category: 'Materials', count: 25 },
  { category: 'Water', count: 12 },
];

const CASE_STUDIES: CaseStudy[] = [
  {
    id: '1',
    title: 'Green Office Hub',
    sector: 'Office',
    location: 'Berlin, Germany',
    description: 'Retrofitting a 1980s office building with smart HVAC, LED lighting, and rooftop solar panels.',
    co2Reduction: 120,
    costSavings: 45000,
    investment: 180000,
    paybackPeriod: 4,
    strategies: ['Smart HVAC', 'LED Retrofit', 'Solar PV', 'Employee Awareness'],
    data: [
      { month: 'Jan', baseline: 45, actual: 30 },
      { month: 'Feb', baseline: 42, actual: 28 },
      { month: 'Mar', baseline: 38, actual: 22 },
      { month: 'Apr', baseline: 30, actual: 18 },
      { month: 'May', baseline: 25, actual: 15 },
      { month: 'Jun', baseline: 22, actual: 12 },
    ]
  },
  {
    id: '2',
    title: 'Eco-Village Community',
    sector: 'Housing',
    location: 'Oregon, USA',
    description: 'A co-housing project utilizing passive solar design, greywater recycling, and shared electric vehicles.',
    co2Reduction: 85,
    costSavings: 28000,
    investment: 120000,
    paybackPeriod: 4.3,
    strategies: ['Passive Solar', 'Greywater Reuse', 'EV Sharing', 'Composting'],
    data: [
      { month: 'Jan', baseline: 30, actual: 18 },
      { month: 'Feb', baseline: 28, actual: 16 },
      { month: 'Mar', baseline: 25, actual: 14 },
      { month: 'Apr', baseline: 20, actual: 10 },
      { month: 'May', baseline: 18, actual: 8 },
      { month: 'Jun', baseline: 15, actual: 6 },
    ]
  },
  {
    id: '3',
    title: 'Sustainable Retail Chain',
    sector: 'Retail',
    location: 'London, UK',
    description: 'Implementing zero-waste packaging and local sourcing across 5 major retail outlets.',
    co2Reduction: 210,
    costSavings: 65000,
    investment: 95000,
    paybackPeriod: 1.5,
    strategies: ['Zero-Waste Packaging', 'Local Sourcing', 'Optimized Logistics'],
    data: [
      { month: 'Jan', baseline: 60, actual: 45 },
      { month: 'Feb', baseline: 58, actual: 42 },
      { month: 'Mar', baseline: 55, actual: 38 },
      { month: 'Apr', baseline: 52, actual: 35 },
      { month: 'May', baseline: 50, actual: 32 },
      { month: 'Jun', baseline: 48, actual: 30 },
    ]
  },
  {
    id: '4',
    title: 'Zero-Emission Resort',
    sector: 'Tourism',
    location: 'Maldives',
    description: 'A luxury resort powered 100% by solar and wind energy with on-site organic farming.',
    co2Reduction: 450,
    costSavings: 150000,
    investment: 1200000,
    paybackPeriod: 8,
    strategies: ['Renewable Energy', 'Organic Farming', 'Desalination', 'Electric Boats'],
    data: [
      { month: 'Jan', baseline: 100, actual: 20 },
      { month: 'Feb', baseline: 95, actual: 18 },
      { month: 'Mar', baseline: 90, actual: 15 },
      { month: 'Apr', baseline: 85, actual: 12 },
      { month: 'May', baseline: 80, actual: 10 },
      { month: 'Jun', baseline: 75, actual: 8 },
    ]
  },
  {
    id: '5',
    title: 'City Logistics Fleet',
    sector: 'Transport',
    location: 'Tokyo, Japan',
    description: 'Transitioning a last-mile delivery fleet from diesel vans to electric cargo bikes and EVs.',
    co2Reduction: 320,
    costSavings: 85000,
    investment: 400000,
    paybackPeriod: 4.7,
    strategies: ['Electric Vehicles', 'Cargo Bikes', 'Route Optimization'],
    data: [
      { month: 'Jan', baseline: 80, actual: 50 },
      { month: 'Feb', baseline: 78, actual: 48 },
      { month: 'Mar', baseline: 75, actual: 45 },
      { month: 'Apr', baseline: 72, actual: 42 },
      { month: 'May', baseline: 70, actual: 40 },
      { month: 'Jun', baseline: 68, actual: 38 },
    ]
  }
];

// --- Components ---

const StatCard = ({ label, value, icon: Icon, color, textColor }: { label: string, value: string, icon: any, color: string, textColor: string }) => (
  <div className="bg-white h-[120px] p-6 rounded-2xl border border-zinc-100 shadow-sm flex items-center justify-between">
    <div className="flex-1">
      <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">{label}</p>
      <h3 className={cn("text-3xl font-bold", textColor)}>{value}</h3>
    </div>
    <div className={cn("p-4 rounded-2xl shrink-0 ml-4", color)}>
      <Icon className="w-8 h-8 text-white" />
    </div>
  </div>
);

const SectorIcon = ({ sector }: { sector: CaseStudy['sector'] }) => {
  switch (sector) {
    case 'Housing': return <Home className="w-5 h-5" />;
    case 'Office': return <Building2 className="w-5 h-5" />;
    case 'Retail': return <ShoppingBag className="w-5 h-5" />;
    case 'Tourism': return <Plane className="w-5 h-5" />;
    case 'Transport': return <TrendingDown className="w-5 h-5" />;
  }
};

export default function App() {
  const [selectedId, setSelectedId] = useState<string>(CASE_STUDIES[0].id);
  const [simulationScale, setSimulationScale] = useState(1);
  const [filterSector, setFilterSector] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'table' | 'map'>('table');

  const sectors = ['All', ...Array.from(new Set(CASE_STUDIES.map(c => c.sector)))];

  const filteredCaseStudies = useMemo(() => 
    filterSector === 'All' ? CASE_STUDIES : CASE_STUDIES.filter(c => c.sector === filterSector)
  , [filterSector]);

  const selectedCase = useMemo(() => 
    filteredCaseStudies.find(c => c.id === selectedId) || filteredCaseStudies[0] || CASE_STUDIES[0]
  , [selectedId, filteredCaseStudies]);

  const totalCO2 = CASE_STUDIES.reduce((acc, curr) => acc + curr.co2Reduction, 0);
  const totalSavings = CASE_STUDIES.reduce((acc, curr) => acc + curr.costSavings, 0);
  const avgPayback = (CASE_STUDIES.reduce((acc, curr) => acc + curr.paybackPeriod, 0) / CASE_STUDIES.length).toFixed(1);

  const sectorData = useMemo(() => {
    const data: Record<string, number> = {};
    CASE_STUDIES.forEach(c => {
      data[c.sector] = (data[c.sector] || 0) + c.co2Reduction;
    });
    return Object.entries(data).map(([name, value]) => ({ name, value }));
  }, []);

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444'];

  const simulatedImpact = useMemo(() => ({
    co2: selectedCase.co2Reduction * simulationScale,
    savings: selectedCase.costSavings * simulationScale,
    investment: selectedCase.investment * simulationScale
  }), [selectedCase, simulationScale]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-zinc-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Header */}
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-600 p-2.5 rounded-xl">
              <Leaf className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">EcoImpact</h1>
              <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-tighter">Low-Carbon Case Study Dashboard</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-sm font-medium text-emerald-600 border-b-2 border-emerald-600 pb-1">Dashboard</a>
            <a href="#" className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">Case Studies</a>
            <a href="#" className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">Methodology</a>
          </nav>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-zinc-400 uppercase">Filter:</span>
              <select 
                value={filterSector}
                onChange={(e) => setFilterSector(e.target.value)}
                className="bg-zinc-100 border-none rounded-lg text-sm font-bold px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                {sectors.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <button className="bg-zinc-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors">
              Share Insights
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Row 1: KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            label="CO₂ Reduced" 
            value={`${totalCO2} Tons`} 
            icon={TrendingDown} 
            color="bg-emerald-500" 
            textColor="text-emerald-600"
          />
          <StatCard 
            label="Cost Savings" 
            value={`$${(totalSavings / 1000).toFixed(0)}k`} 
            icon={DollarSign} 
            color="bg-blue-500" 
            textColor="text-blue-600"
          />
          <StatCard 
            label="Case Studies" 
            value={CASE_STUDIES.length.toString()} 
            icon={Building2} 
            color="bg-amber-500" 
            textColor="text-amber-600"
          />
          <StatCard 
            label="Payback" 
            value={`${avgPayback} Yrs`} 
            icon={Target} 
            color="bg-purple-500" 
            textColor="text-purple-600"
          />
        </div>

        {/* Row 2: Sector Distribution & Monthly Trend */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm">
            <h3 className="text-xl font-bold mb-6">CO₂ Reduction by Sector</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sectorData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {sectorData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm">
            <h3 className="text-xl font-bold mb-6">Monthly CO₂ Reduction Trend</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={selectedCase.data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#94a3b8' }} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#94a3b8' }} 
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="actual" 
                    stroke="#10b981" 
                    strokeWidth={4}
                    dot={{ r: 6, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Row 3: Emission Sources & Case Study Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm">
            <h3 className="text-xl font-bold mb-6">Major Sources of Carbon Emissions</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={EMISSION_SOURCES} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                  <YAxis 
                    dataKey="category" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#4b5563', fontWeight: 600 }} 
                    width={100}
                  />
                  <Tooltip 
                    cursor={{ fill: '#f9fafb' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="count" fill="#10b981" radius={[0, 8, 8, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Case Study Summary</h3>
              <div className="flex bg-zinc-100 p-1 rounded-lg">
                <button 
                  onClick={() => setViewMode('table')}
                  className={cn(
                    "px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md transition-all",
                    viewMode === 'table' ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
                  )}
                >
                  Table
                </button>
                <button 
                  onClick={() => setViewMode('map')}
                  className={cn(
                    "px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md transition-all",
                    viewMode === 'map' ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
                  )}
                >
                  Map
                </button>
              </div>
            </div>
            
            <div className="flex-1 min-h-[300px]">
              {viewMode === 'table' ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-100">
                        <th className="pb-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Project</th>
                        <th className="pb-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">CO₂ Red.</th>
                        <th className="pb-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">Savings</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50">
                      {CASE_STUDIES.slice(0, 5).map((study) => (
                        <tr key={study.id} className="group hover:bg-zinc-50 transition-colors">
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-zinc-100 rounded-lg group-hover:bg-white transition-colors">
                                <SectorIcon sector={study.sector} />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-zinc-900">{study.title}</p>
                                <p className="text-[10px] text-zinc-500 font-medium">{study.location}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 text-right">
                            <span className="text-sm font-bold text-emerald-600">{study.co2Reduction}t</span>
                          </td>
                          <td className="py-4 text-right">
                            <span className="text-sm font-bold text-blue-600">${(study.costSavings / 1000).toFixed(0)}k</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center bg-zinc-50 rounded-xl border border-dashed border-zinc-200 p-4">
                  <div className="relative w-full max-w-md aspect-[2/1] bg-emerald-50/50 rounded-lg overflow-hidden border border-emerald-100">
                    {/* Simple SVG World Map Placeholder */}
                    <svg viewBox="0 0 800 400" className="w-full h-full opacity-20 fill-emerald-900">
                      <path d="M150,100 Q200,80 250,120 T350,100 T450,130 T550,90 T650,110 T750,100 L750,300 Q650,320 550,280 T450,310 T350,270 T250,300 T150,280 Z" />
                    </svg>
                    
                    {/* Case Study Markers */}
                    <div className="absolute inset-0">
                      <div className="absolute top-[30%] left-[45%] group cursor-pointer">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping absolute" />
                        <div className="w-3 h-3 bg-emerald-600 rounded-full relative" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-zinc-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10">
                          Berlin, Germany
                        </div>
                      </div>
                      <div className="absolute top-[40%] left-[15%] group cursor-pointer">
                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-ping absolute" />
                        <div className="w-3 h-3 bg-blue-600 rounded-full relative" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-zinc-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10">
                          Oregon, USA
                        </div>
                      </div>
                      <div className="absolute top-[25%] left-[42%] group cursor-pointer">
                        <div className="w-3 h-3 bg-amber-500 rounded-full animate-ping absolute" />
                        <div className="w-3 h-3 bg-amber-600 rounded-full relative" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-zinc-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10">
                          London, UK
                        </div>
                      </div>
                      <div className="absolute top-[70%] left-[65%] group cursor-pointer">
                        <div className="w-3 h-3 bg-purple-500 rounded-full animate-ping absolute" />
                        <div className="w-3 h-3 bg-purple-600 rounded-full relative" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-zinc-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10">
                          Maldives
                        </div>
                      </div>
                      <div className="absolute top-[45%] left-[85%] group cursor-pointer">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-ping absolute" />
                        <div className="w-3 h-3 bg-red-600 rounded-full relative" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-zinc-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10">
                          Tokyo, Japan
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-4">Geographic Distribution of Case Studies</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Row 4: Map / Table (Case Study Explorer) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar: Case Study List */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold flex items-center gap-2">
                Case Studies
                <span className="text-xs font-normal bg-zinc-200 px-2 py-0.5 rounded-full text-zinc-600">
                  {filteredCaseStudies.length}
                </span>
              </h2>
            </div>
            <div className="space-y-3 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredCaseStudies.map((study) => (
                <button
                  key={study.id}
                  onClick={() => setSelectedId(study.id)}
                  className={cn(
                    "w-full text-left p-4 rounded-xl border transition-all duration-200 group",
                    selectedId === study.id 
                      ? "bg-white border-emerald-600 shadow-md ring-1 ring-emerald-600" 
                      : "bg-white border-zinc-200 hover:border-zinc-300 hover:shadow-sm"
                  )}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className={cn(
                      "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded flex items-center gap-1",
                      selectedId === study.id ? "bg-emerald-100 text-emerald-700" : "bg-zinc-100 text-zinc-500"
                    )}>
                      <SectorIcon sector={study.sector} />
                      {study.sector}
                    </span>
                    <ChevronRight className={cn(
                      "w-4 h-4 transition-transform",
                      selectedId === study.id ? "text-emerald-600 translate-x-1" : "text-zinc-300"
                    )} />
                  </div>
                  <h3 className="font-bold text-zinc-900 group-hover:text-emerald-700 transition-colors">{study.title}</h3>
                  <p className="text-xs text-zinc-500 mt-1 line-clamp-1">{study.location}</p>
                </button>
              ))}
              {filteredCaseStudies.length === 0 && (
                <div className="p-8 text-center bg-white rounded-xl border border-zinc-200">
                  <p className="text-zinc-500 text-sm">No case studies found for this sector.</p>
                </div>
              )}
            </div>
          </div>

          {/* Main Content: Detailed View */}
          <div className="lg:col-span-8 space-y-8">
            {selectedCase && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden"
                >
                  {/* Hero Section */}
                  <div className="p-8 border-b border-zinc-100 bg-gradient-to-br from-white to-zinc-50">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded">
                            {selectedCase.sector}
                          </span>
                          <span className="text-zinc-400 text-sm">•</span>
                          <span className="text-zinc-500 text-sm font-medium">{selectedCase.location}</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-zinc-900 tracking-tight">{selectedCase.title}</h2>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Payback Period</p>
                          <p className="text-xl font-bold text-zinc-900">{selectedCase.paybackPeriod} Years</p>
                        </div>
                        <div className="w-14 h-14 rounded-full border-4 border-emerald-500/20 flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
                            <Target className="w-6 h-6 text-white" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-zinc-600 leading-relaxed max-w-2xl">
                      {selectedCase.description}
                    </p>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 border-b border-zinc-100">
                    <div className="p-8 border-r border-zinc-100">
                      <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Annual CO₂ Savings</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black text-emerald-600">{selectedCase.co2Reduction}</span>
                        <span className="text-sm font-bold text-zinc-500">Tons</span>
                      </div>
                    </div>
                    <div className="p-8 border-r border-zinc-100">
                      <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Annual Cost Savings</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black text-blue-600">${(selectedCase.costSavings / 1000).toFixed(0)}k</span>
                        <span className="text-sm font-bold text-zinc-500">USD</span>
                      </div>
                    </div>
                    <div className="p-8">
                      <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Initial Investment</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black text-zinc-900">${(selectedCase.investment / 1000).toFixed(0)}k</span>
                        <span className="text-sm font-bold text-zinc-500">USD</span>
                      </div>
                    </div>
                  </div>

                  {/* Strategies */}
                  <div className="p-8 bg-zinc-50">
                    <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">Implementation Strategies</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedCase.strategies.map((strategy, idx) => (
                        <span key={idx} className="bg-white px-4 py-2 rounded-full border border-zinc-200 text-sm font-medium text-zinc-700 shadow-sm flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          {strategy}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}

            {/* What-If Simulator */}
            <div className="bg-zinc-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Calculator className="w-32 h-32" />
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-emerald-500 p-2.5 rounded-xl">
                    <Calculator className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold">Impact Simulator</h2>
                </div>
                
                <p className="text-zinc-400 mb-8 max-w-xl">
                  What if you adopted this model at scale? Adjust the multiplier to see the potential impact for your organization or community.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <label className="text-sm font-medium text-zinc-300">Scale Multiplier</label>
                        <span className="text-2xl font-bold text-emerald-400">{simulationScale}x</span>
                      </div>
                      <input 
                        type="range" 
                        min="1" 
                        max="50" 
                        value={simulationScale}
                        onChange={(e) => setSimulationScale(parseInt(e.target.value))}
                        className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                      <div className="flex justify-between mt-2 text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                        <span>Single Unit</span>
                        <span>Large Scale (50x)</span>
                      </div>
                    </div>

                    <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-800">
                      <div className="flex items-center gap-3">
                        <Info className="w-4 h-4 text-emerald-400" />
                        <p className="text-xs text-zinc-400">
                          Estimates are based on the <span className="text-white font-medium">{selectedCase?.title}</span> benchmark.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-emerald-500/50 transition-colors">
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Potential CO₂ Reduction</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-emerald-400">{simulatedImpact.co2.toLocaleString()}</span>
                        <span className="text-xs font-medium text-zinc-400">Tons / Year</span>
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-blue-500/50 transition-colors">
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Potential Cost Savings</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-blue-400">${(simulatedImpact.savings / 1000).toFixed(0)}k</span>
                        <span className="text-xs font-medium text-zinc-400">USD / Year</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-2">
                      {[1,2,3].map(i => (
                        <img 
                          key={i}
                          src={`https://picsum.photos/seed/user${i}/32/32`} 
                          className="w-8 h-8 rounded-full border-2 border-zinc-900"
                          referrerPolicy="no-referrer"
                        />
                      ))}
                    </div>
                    <p className="text-xs text-zinc-400">
                      <span className="text-white font-medium">124 users</span> simulated impact today
                    </p>
                  </div>
                  <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold transition-all group">
                    Download Full Report
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-zinc-200 mt-12 py-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="w-5 h-5 text-emerald-600" />
              <span className="font-bold text-xl">EcoImpact</span>
            </div>
            <p className="text-zinc-500 text-sm max-w-sm leading-relaxed">
              Empowering communities and businesses with data-driven insights to accelerate the transition to a low-carbon future. Our case studies are verified by independent sustainability experts.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-sm uppercase tracking-widest text-zinc-400">Resources</h4>
            <ul className="space-y-2 text-sm text-zinc-600">
              <li><a href="#" className="hover:text-emerald-600 transition-colors">Carbon Calculator</a></li>
              <li><a href="#" className="hover:text-emerald-600 transition-colors">Best Practices Guide</a></li>
              <li><a href="#" className="hover:text-emerald-600 transition-colors">API Documentation</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-sm uppercase tracking-widest text-zinc-400">Connect</h4>
            <ul className="space-y-2 text-sm text-zinc-600">
              <li><a href="#" className="hover:text-emerald-600 transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-emerald-600 transition-colors">Newsletter</a></li>
              <li><a href="#" className="hover:text-emerald-600 transition-colors">Twitter</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-400 font-medium uppercase tracking-widest">
          <p>© 2026 EcoImpact Dashboard. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
