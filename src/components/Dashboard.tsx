/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Exploitation,
  Parcelle,
  Culture,
  Troupeau,
  Animal,
  Article,
  PieceComptable,
  AuditLog,
  PrevisionMeteo,
  MouvementStock
} from '../types';
import {
  TrendingUp,
  DollarSign,
  Droplets,
  CloudRain,
  Sun,
  Shield,
  Clock,
  Egg,
  Sprout,
  Milestone,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  Layers,
  Thermometer
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';

interface DashboardProps {
  exploitations: Exploitation[];
  parcelles: Parcelle[];
  cultures: Culture[];
  troupeaux: Troupeau[];
  animaux: Animal[];
  articles: Article[];
  piecesComptables: PieceComptable[];
  auditLogs: AuditLog[];
  meteo: PrevisionMeteo;
  mouvementsStock?: MouvementStock[];
}

export default function Dashboard({
  exploitations,
  parcelles,
  cultures,
  troupeaux,
  animaux,
  articles,
  piecesComptables,
  auditLogs,
  meteo,
  mouvementsStock = []
}: DashboardProps) {
  // Aggregate KPIs
  const [filterTimestamp, setFilterTimestamp] = useState('');
  const totalParcelles = parcelles.length;
  const totalSuperficie = parcelles.reduce((sum, p) => sum + p.surface, 0);

  // Check if we are in Demo mode by searching for existing demo flocks
  const isDemo = troupeaux.some(t => t.nom.includes('Cobb500') || t.nom.includes('Tilap'));

  // We have cows as individual animals, but we also have flock birds/fish. Only add Cobb500 / Tilapias offsets in Demo mode.
  const totalAnimals = animaux.length + (isDemo ? 13000 : 0);

  // Dynamic calculation of unified revenue
  const computedRevenue = piecesComptables
    .filter(p => p.creditCompte.includes('7011') || p.creditCompte.includes('Vente') || p.creditCompte.includes('703'))
    .reduce((sum, p) => sum + p.montant, 0);
  const totalChiffreAffaires = computedRevenue > 0 ? computedRevenue : (isDemo ? 12450000 : 0);

  // Dynamic stock valuation
  const computedStockValue = articles.reduce((sum, art) => {
    const artMvts = mouvementsStock ? mouvementsStock.filter(m => m.idArticle === art.id) : [];
    let totalQty = 0;
    artMvts.forEach(m => {
      if (m.type === 'Entrée') totalQty += m.quantite;
      else totalQty -= m.quantite;
    });
    const subTotal = totalQty * (art.prixFournisseurMoyen || 0);
    return sum + (subTotal > 0 ? subTotal : 0);
  }, 0);
  const totalValorisation = computedStockValue > 0 ? computedStockValue : (isDemo ? 4850000 : 0);

  // Compute balance
  const activeDebitSum = piecesComptables.filter(p => p.debitCompte.includes('5211') || p.debitCompte.includes('Banque') || p.debitCompte.includes('Caisse')).reduce((sum, p) => sum + p.montant, 0);
  const activeCreditSum = piecesComptables.filter(p => p.creditCompte.includes('7011') || p.creditCompte.includes('Vente')).reduce((sum, p) => sum + p.montant, 0);
  
  // Custom finance dataset for chart
  const financeProgressionData = [
    { name: 'Janvier', Recettes: 1500000, Depenses: 1200000 },
    { name: 'Février', Recettes: 2200000, Depenses: 1500000 },
    { name: 'Mars', Recettes: 1800000, Depenses: 1900000 },
    { name: 'Avril', Recettes: 3500000, Depenses: 2100000 },
    { name: 'Mai', Recettes: 4000000, Depenses: 2500000 },
    { name: 'Juin', Recettes: activeCreditSum > 0 ? activeCreditSum : 4800000, Depenses: activeDebitSum > 0 ? activeDebitSum : 2800000 }
  ];

  // Distribute parcelles crops using cultures prop
  const cultureDistribution: { [key: string]: number } = {};
  cultures.forEach(c => {
    if (c.statut === 'Active') {
      cultureDistribution[c.nom] = (cultureDistribution[c.nom] || 0) + c.surfaceCultivee;
    }
  });

  const pieData = Object.entries(cultureDistribution).map(([name, value]) => ({
    name,
    value: parseFloat(value.toFixed(1))
  }));

  const COLORS = ['#1E7A44', '#8CC63F', '#F5A623', '#0F3D2E', '#2B2D30'];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* 1. Header Banner containing real-time Obala weather simulation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Greetings and Core Slogan Card */}
        <div className="lg:col-span-3 bg-[#0F3D2E] text-white p-6 rounded-2xl shadow-xl border-2 border-[#1E7A44]/30 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-64 h-64 bg-radial-at-tr from-[#8CC63F]/10 to-transparent pointer-events-none" />
          <div className="space-y-2 relative z-10">
            <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
              <Sprout className="text-[#8CC63F] h-7 w-7" />
              MEFOUP-FLOW Cockpit de Pilotage
            </h2>
            <p className="text-xs text-slate-300 font-medium leading-relaxed">
              Console de pilotage intégrée pour Kissine Agro-Industries. Télémétrie géolocalisée d'Obala, calculatrices de rendements et registre des flux comptables unifiés. Slogan : « Ensemble, cultivons l'avenir de l'Afrique ! »
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#1E7A44]/20 relative z-10 flex items-center justify-between text-[11px] text-[#8CC63F] font-bold">
            <span>Ensemble, cultivons l'avenir de l'Afrique !</span>
            <span className="text-slate-400 font-normal">ERP d'Agro-Business v2.1</span>
          </div>
        </div>

        {/* Real-time Obala weather simulation panel */}
        <div className="bg-[#2B2D30] text-white p-6 rounded-2xl shadow-xl border-2 border-[#1E7A44]/30 relative overflow-hidden flex flex-col justify-between lg:col-span-1">
          <div className="relative z-10">
            <span className="text-[10px] text-[#8CC63F] font-black block uppercase tracking-wider">Station Météo : OBALA, Cameroun</span>
            <div className="flex items-center justify-between mt-2">
              <div>
                <h4 className="text-2xl font-black flex items-center gap-1">
                  <Thermometer className="text-[#F5A623] h-5 w-5" />
                  {meteo.temperatureCelcius}°C
                </h4>
                <p className="text-xs font-semibold text-slate-300 mt-1">{meteo.conditionsCiel}</p>
              </div>
              <div className="p-2 bg-[#0F3D2E]/65 rounded-xl border border-[#1E7A44]/30">
                {meteo.risquesPluiePourcent > 50 ? <CloudRain className="h-8 w-8 text-sky-400 animate-bounce" /> : <Sun className="h-8 w-8 text-[#F5A623] animate-spin-slow" />}
              </div>
            </div>
          </div>
          <div className="text-[10px] text-slate-400 mt-4 border-t border-slate-700/60 pt-2 flex items-center gap-2 relative z-10">
            <span className="font-bold text-[#8CC63F]">Humidité :</span> {meteo.humiditeRecense}%
            <span className="font-bold text-[#8CC63F]">Pluie :</span> {meteo.risquesPluiePourcent}%
          </div>
        </div>
      </div>

      {/* 2. KPIs Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white p-4 rounded-xl border-2 border-[#1E7A44]/5 shadow-3xs flex items-center justify-between hover:border-[#1E7A44] transition-all">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Surface Cultivée</span>
            <h3 className="text-xl font-bold text-slate-800">{totalSuperficie} Hectares</h3>
            <p className="text-[10px] text-slate-400">{totalParcelles} Parcelles enregistrées</p>
          </div>
          <div className="p-3 bg-[#0F3D2E]/10 text-[#1E7A44] rounded-xl border border-[#1E7A44]/15">
            <Sprout className="h-6 w-6" />
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-4 rounded-xl border-2 border-[#1E7A44]/5 shadow-3xs flex items-center justify-between hover:border-[#1E7A44] transition-all">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Cheptel totalisé</span>
            <h3 className="text-xl font-bold text-slate-800">{totalAnimals} têtes</h3>
            <p className="text-[10px] text-slate-400">{troupeaux.length} Groupes troupeaux actifs</p>
          </div>
          <div className="p-3 bg-[#0F3D2E]/10 text-[#1E7A44] rounded-xl border border-[#1E7A44]/15">
            <Layers className="h-6 w-6" />
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-4 rounded-xl border-2 border-[#1E7A44]/5 shadow-3xs flex items-center justify-between hover:border-[#F5A623] transition-all">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Chiffre d'Affaire unifié</span>
            <h3 className="text-xl font-bold text-slate-800">{totalChiffreAffaires.toLocaleString()} FCFA</h3>
            <p className="text-[10px] text-[#1E7A44] font-bold flex items-center gap-0.5">
              <ArrowUpRight className="h-3.5 w-3.5" /> {isDemo ? '+15.2% vs. 2025' : 'Calculé en live'}
            </p>
          </div>
          <div className="p-3 bg-[#F5A623]/10 text-[#F5A623] rounded-xl border border-[#F5A623]/20">
            <DollarSign className="h-6 w-6" />
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white p-4 rounded-xl border-2 border-[#1E7A44]/5 shadow-3xs flex items-center justify-between hover:border-[#8CC63F] transition-all">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Valorisation Stocks</span>
            <h3 className="text-xl font-bold text-slate-800">{totalValorisation.toLocaleString()} FCFA</h3>
            <p className="text-[10px] text-slate-400">{articles.length} Intrants référencés</p>
          </div>
          <div className="p-3 bg-[#8CC63F]/10 text-[#0F3D2E] rounded-xl border border-[#8CC63F]/20">
            <Package className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* 3. Recharts Graphics Rows */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue/expenses Progress lines */}
        <div className="lg:col-span-2 bg-white rounded-xl border-2 border-[#1E7A44]/5 p-4 space-y-3 shadow-3xs">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-black text-[#0F3D2E] uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="text-[#1E7A44] h-4.5 w-4.5" />
              Évolution des flux : Recettes vs. Charges d'Exploitations (FCFA)
            </h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={financeProgressionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRecettes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1E7A44" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#1E7A44" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorDepenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F5A623" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#F5A623" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" fontSize={10} stroke="#94A3B8" />
                <YAxis fontSize={10} stroke="#94A3B8" />
                <Tooltip formatter={(value) => `${value.toLocaleString()} FCFA`} />
                <Legend iconType="circle" fontSize={10} wrapperStyle={{ bottom: -10 }} />
                <Area type="monotone" dataKey="Recettes" stroke="#1E7A44" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRecettes)" />
                <Area type="monotone" dataKey="Depenses" stroke="#F5A623" strokeWidth={2.5} fillOpacity={1} fill="url(#colorDepenses)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Crops Distribution Pie */}
        <div className="bg-white rounded-xl border-2 border-[#1E7A44]/5 p-4 space-y-3 shadow-3xs">
          <h3 className="text-xs font-black text-[#0F3D2E] uppercase tracking-wider flex items-center gap-1.5">
            <Sprout className="text-[#1E7A44] h-4.5 w-4.5" />
            Répartition des Cultures par hectare (%)
          </h3>

          <div className="h-44 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData.length > 0 ? pieData : [{ name: 'Générique', value: 100 }]}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value} HA`} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10.5px] font-semibold text-slate-600">
            {pieData.map((item, idx) => (
              <div key={item.name} className="flex items-center gap-1.5 truncate">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                <span>{item.name} ({item.value} HA)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Real-time Audit Trail & Traceability section */}
      <div className="bg-white rounded-xl border-2 border-[#1E7A44]/5 p-4 space-y-3 shadow-3xs text-xs">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-2">
          <h3 className="font-extrabold text-[#0F3D2E] uppercase tracking-wider flex items-center gap-1.5">
            <Shield className="text-[#1E7A44] h-4.5 w-4.5" />
            Journal d'Audit & Sécurité (Traçabilité d'Audit RG-94)
          </h3>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 w-full sm:w-auto">
            <span className="font-bold whitespace-nowrap text-slate-600">Filtrer par ISO Timestamp :</span>
            <input 
              type="text"
              value={filterTimestamp}
              onChange={(e) => setFilterTimestamp(e.target.value)}
              placeholder="Ex: 2026-06 ou Z ou 10:30"
              className="border border-slate-200 rounded p-1.5 bg-slate-50 text-indigo-700 font-mono text-[10px] w-full sm:w-48 placeholder-slate-400 font-bold focus:bg-white focus:ring-1 focus:ring-indigo-500"
            />
            {filterTimestamp && (
              <button 
                type="button" 
                onClick={() => setFilterTimestamp('')}
                className="text-red-500 hover:text-red-700 font-bold text-xs px-1"
              >
                ×
              </button>
            )}
          </div>
        </div>
        <p className="text-[10px] text-slate-400 mt-0.5">
          Toutes les modifications ou créations de fiches de cultures, d'intrants agricoles, d'animaux ou d'écritures SYSCOHADA sont journalisées ci-dessous de manière immuable.
        </p>

        <div className="divide-y border rounded-xl overflow-hidden text-slate-600">
          {(() => {
            const filteredLogs = auditLogs.filter(log => {
              if (!filterTimestamp) return true;
              return log.dateHeure.toLowerCase().includes(filterTimestamp.toLowerCase()) || 
                     log.action.toLowerCase().includes(filterTimestamp.toLowerCase()) ||
                     log.operateur.toLowerCase().includes(filterTimestamp.toLowerCase());
            });
            
            if (filteredLogs.length === 0) {
              return (
                <div className="p-6 text-center text-slate-400 italic font-medium">
                  Aucun log de sécurité ne correspond au timestamp ou texte recherché.
                </div>
              );
            }
            
            return filteredLogs.slice(0, 10).map(log => (
              <div key={log.id} className="p-3 flex items-center justify-between hover:bg-slate-50 transition text-xs">
                <div className="flex items-center gap-3">
                  <div className="p-1 px-2.5 bg-slate-100 text-slate-600 rounded font-bold font-mono text-[10px] uppercase">
                    {log.action}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">{log.description}</h4>
                    <p className="text-[10.5px] text-slate-400 mt-0.5">
                      Par : <span className="font-semibold text-slate-700">{log.operateur}</span> • Rôle: <span className="font-semibold">{log.role}</span>
                    </p>
                  </div>
                </div>
                <div className="text-right flex items-center gap-1.5 text-slate-500 font-mono text-[11px] bg-slate-50 px-2 py-1 rounded border">
                  <Clock className="h-3.5 w-3.5 text-indigo-500" /> {log.dateHeure}
                </div>
              </div>
            ));
          })()}
        </div>
      </div>
    </div>
  );
}
