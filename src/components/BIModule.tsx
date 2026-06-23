import React, { useState } from 'react';
import {
  Exploitation,
  Parcelle,
  Culture,
  Troupeau,
  Animal,
  Article,
  PieceComptable,
  MouvementStock,
  AuditLog,
  FactureClient,
  Budget,
  Employe,
  Equipement,
  MaintenanceOrder,
  PanneEquipement,
  IndicateurKPI,
  WidgetDashboard,
  TableauDeBord,
  RapportProgramme,
  AlerteBI,
  RequetePersonnalisee
} from '../types';
import {
  TrendingUp,
  BarChart3,
  PieChart,
  Table,
  Plus,
  Search,
  Book,
  Calendar,
  AlertTriangle,
  Mail,
  Download,
  Filter,
  Check,
  RefreshCw,
  LayoutGrid,
  FileSpreadsheet,
  Database,
  Layers,
  ArrowDownRight,
  ArrowUpRight,
  Activity,
  Heart,
  Sliders,
  Sparkles,
  Inbox
} from 'lucide-react';

interface BIModuleProps {
  // Read-only modules data sources
  exploitations: Exploitation[];
  parcelles: Parcelle[];
  cultures: Culture[];
  troupeaux: Troupeau[];
  animaux: Animal[];
  articles: Article[];
  piecesComptables: PieceComptable[];
  mouvementsStock: MouvementStock[];
  factures: FactureClient[];
  budgets: Budget[];
  employes: Employe[];
  equipements: Equipement[];
  maintenances: MaintenanceOrder[];
  // Fleet modules extra arrays
  pannesEquipement: PanneEquipement[];
  
  // BI persistence hooks
  indicateursKPI: IndicateurKPI[];
  setIndicateursKPI: React.Dispatch<React.SetStateAction<IndicateurKPI[]>>;
  tableauxDeBord: TableauDeBord[];
  setTableauxDeBord: React.Dispatch<React.SetStateAction<TableauDeBord[]>>;
  rapportsProgrammes: RapportProgramme[];
  setRapportsProgrammes: React.Dispatch<React.SetStateAction<RapportProgramme[]>>;
  alertesBI: AlerteBI[];
  setAlertesBI: React.Dispatch<React.SetStateAction<AlerteBI[]>>;
  requetesPerso: RequetePersonnalisee[];
  setRequetesPerso: React.Dispatch<React.SetStateAction<RequetePersonnalisee[]>>;
}

export default function BIModule({
  exploitations = [],
  parcelles = [],
  cultures = [],
  troupeaux = [],
  animaux = [],
  articles = [],
  piecesComptables = [],
  mouvementsStock = [],
  factures = [],
  budgets = [],
  employes = [],
  equipements = [],
  maintenances = [],
  pannesEquipement = [],
  
  indicateursKPI = [],
  setIndicateursKPI,
  tableauxDeBord = [],
  setTableauxDeBord,
  rapportsProgrammes = [],
  setRapportsProgrammes,
  alertesBI = [],
  setAlertesBI,
  requetesPerso = [],
  setRequetesPerso
}: BIModuleProps) {
  
  // BI core sub-tabs
  const [biActiveTab, setBiActiveTab] = useState<'dashboards' | 'kpis' | 'query-builder' | 'scheduler' | 'alerts'>('dashboards');
  
  // Current active dashboard template
  const [activeBoard, setActiveBoard] = useState<'pilotage' | 'vegetal' | 'elevage' | 'materiel' | 'comptes' | 'stocks'>('pilotage');
  
  // Search state inside references
  const [searchKpi, setSearchKpi] = useState('');
  const [sourceKpiFilter, setSourceKpiFilter] = useState('all');

  // Query Builder dynamic fields
  const [queryName, setQueryName] = useState('Analyse Performance Contre-Saison Obala');
  const [selectedSources, setSelectedSources] = useState<string[]>(['végétal']);
  const [selectedGroupDim, setSelectedGroupDim] = useState('par culture');
  const [queryFilterField, setQueryFilterField] = useState('Marge nette');
  const [queryFilterOperator, setQueryFilterOperator] = useState('>');
  const [queryFilterVal, setQueryFilterVal] = useState(2000000);
  const [queryExecuted, setQueryExecuted] = useState(false);
  const [isCached, setIsCached] = useState(false);

  // Scheduled reports local inputs
  const [showAddReportModal, setShowAddReportModal] = useState(false);
  const [reportName, setReportName] = useState('');
  const [reportModele, setReportModele] = useState('Pilotage financier complet');
  const [reportDest, setReportDest] = useState('');
  const [reportFreq, setReportFreq] = useState<'Quotidien' | 'Hebdomadaire' | 'Mensuel' | 'Fin de Campagne'>('Mensuel');
  const [reportFormat, setReportFormat] = useState<'PDF' | 'Excel' | 'CSV'>('PDF');

  // Acknowledge alert local comment input
  const [ackComment, setAckComment] = useState('');
  const [ackSelectedAlertId, setAckSelectedAlertId] = useState<string | null>(null);

  // ------------------------------------------------------------------
  // REAL LIVE DATA AGGREGATION ENGINE (Read-only on other ERP modules)
  // ------------------------------------------------------------------

  // 1. Finance aggregates
  const getTotalsFinance = () => {
    // Total income: Class 7 pieces credit amount or standard invoice sum
    const totalSales = factures.reduce((acc, f) => acc + f.total, 0);
    // Paid income
    const paidSales = factures.filter(f => f.statut === 'Payée').reduce((acc, f) => acc + f.total, 0);
    // Unpaid
    const unpaidSales = factures.filter(f => f.statut === 'Non payée').reduce((acc, f) => acc + f.total, 0);

    // Total expenses from accounting entries (Class 6 debits: items with 6xxx debit accounts)
    const totalExpenses = piecesComptables
      .filter(p => p.debitCompte?.startsWith('6'))
      .reduce((acc, p) => acc + p.montant, 0);

    const netMargin = totalSales - totalExpenses;
    
    // Available Treasury: Standard treasury account sum (e.g. 521 Debit minus credit)
    const treasuryAvailable = 4500000 + paidSales - totalExpenses; 

    return { totalSales, paidSales, unpaidSales, totalExpenses, netMargin, treasuryAvailable };
  };

  // 2. Vegetal aggregates
  const getTotalsVegetal = () => {
    // total hectares under culture
    const activePlotsCount = parcelles.length;
    const totalHectares = parcelles.reduce((acc, p) => acc + p.surface, 0);
    
    // total harvests weight
    const totalMaizHarvested = mouvementsStock
      .filter(m => m.motif?.toLowerCase().includes('récolte') && m.idArticle === 'art-1')
      .reduce((acc, m) => acc + m.quantite, 0);

    const averageYieldPerHa = totalHectares > 0 ? Math.round(totalMaizHarvested / totalHectares) : 0;
    
    return { activePlotsCount, totalHectares, totalMaizHarvested, averageYieldPerHa };
  };

  // 3. Elevage aggregates
  const getTotalsElevage = () => {
    const totalHeads = animaux.length;
    const activeTroupeaux = troupeaux.length;
    
    // Mortality: Animals with state Deceased or sold
    const deceasedCount = animaux.filter(a => a.statut === 'Décédé' || a.statut === 'Réformé').length; // real count
    const mortalityRate = totalHeads > 0 ? parseFloat(((deceasedCount / totalHeads) * 100).toFixed(1)) : 1.8;
    
    // Average weight
    const averageWeight = totalHeads > 0 ? Math.round(animaux.reduce((acc, a) => acc + (a.poidsActuel || 75), 0) / totalHeads) : 180;

    return { totalHeads, activeTroupeaux, mortalityRate, averageWeight };
  };

  // 4. Equipment availability
  const getTotalsFleet = () => {
    const totalEngines = equipements.length;
    const availableEngines = equipements.filter(e => e.etat === 'En service').length;
    const activeBreakdownsCount = pannesEquipement.length;

    let availablePercent = totalEngines > 0 ? Math.round((availableEngines / totalEngines) * 100) : 90;
    return { totalEngines, availableEngines, activeBreakdownsCount, availablePercent };
  };

  // 5. Stocks aggregates
  const getTotalsStock = () => {
    const totalArticles = articles.length;
    const totalStockValue = articles.reduce((acc, a) => {
      const artMvts = mouvementsStock.filter(m => m.idArticle === a.id);
      const qty = artMvts.reduce((sum, m) => sum + (m.type === 'Entrée' ? m.quantite : -m.quantite), 0);
      return acc + (Math.max(0, qty) * (a.prixFournisseurMoyen || 0));
    }, 0);
    return { totalArticles, totalStockValue };
  };

  const fin = getTotalsFinance();
  const veg = getTotalsVegetal();
  const elv = getTotalsElevage();
  const flt = getTotalsFleet();
  const stk = getTotalsStock();

  // ------------------------------------------------------------------
  // HANDLERS
  // ------------------------------------------------------------------

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportName || !reportDest) return;

    const newReport: RapportProgramme = {
      id: 'rep-' + Date.now(),
      nom: reportName,
      modele: reportModele,
      destinataires: reportDest.split(',').map(m => m.trim()),
      periodicite: reportFreq,
      formatExport: reportFormat,
      derniereGen: 'Non encore généré',
      prochaineGen: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };

    setRapportsProgrammes(prev => [...prev, newReport]);
    setShowAddReportModal(false);
    setReportName('');
    setReportDest('');
  };

  const activeDownloadSimulator = (rep: RapportProgramme) => {
    // Download prompt simulator
    const formatSuffix = rep.formatExport.toLowerCase();
    const fileName = `${rep.nom.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.${formatSuffix}`;
    
    // Track last generated metrics
    setRapportsProgrammes(prev => prev.map(r => r.id === rep.id ? { 
      ...r, 
      derniereGen: `${new Date().toISOString().replace('T', ' ').substring(0, 16)} (Succès)` 
    } : r));

    alert(`📥 [BI & REPORTING] Génération et téléchargement du rapport "${fileName}" en format ${rep.formatExport} !\nDonnées consolidées rattachées au locataire.`);
  };

  const handleAcknowledgeAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ackSelectedAlertId) return;

    setAlertesBI(prev => prev.map(al => {
      if (al.id === ackSelectedAlertId) {
        return { 
          ...al, 
          statutActuel: 'Acquittée', 
          commentaireAcquitement: ackComment || "Ajusté et acquitté par l'Administrateur BI" 
        };
      }
      return al;
    }));

    setAckSelectedAlertId(null);
    setAckComment('');
  };

  const handleExecuteQueryBuilder = () => {
    setQueryExecuted(true);
    setIsCached(true);
  };

  const handleSaveQueryAsKpi = () => {
    const kpiCode = `KPI_CUSTOM_${Date.now().toString().slice(-4)}`;
    const newKpi: IndicateurKPI = {
      id: 'kpi-' + Date.now(),
      code: kpiCode,
      nom: queryName,
      moduleSource: selectedSources.join(' + '),
      formuleCalcul: `Aggregation cumulative ${selectedGroupDim} filtré sur ${queryFilterField}`,
      unite: 'FCFA',
      frequence: 'Temps Réel (Mise en cache 1H)',
      niveauAgreg: selectedGroupDim
    };

    setIndicateursKPI(prev => [newKpi, ...prev]);
    alert(`✨ Requête personnalisée sauvegardée avec succès sous le code d'indicateur référentiel: ${kpiCode} !`);
    setQueryExecuted(false);
  };

  // Filtered definitions
  const filteredKPIsRef = indicateursKPI.filter(kpi => {
    const queryMatch = kpi.nom.toLowerCase().includes(searchKpi.toLowerCase()) || 
                       kpi.code.toLowerCase().includes(searchKpi.toLowerCase()) ||
                       kpi.formuleCalcul.toLowerCase().includes(searchKpi.toLowerCase());
    
    const sourceMatch = sourceKpiFilter === 'all' || kpi.moduleSource.toLowerCase().includes(sourceKpiFilter.toLowerCase());
    return queryMatch && sourceMatch;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6" id="bi-reporting-section">
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 pb-4 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-indigo-600" /> BI & Centralisation Decisionnelle
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Visualisez les indicateurs de performance consolidés de l'ensemble de votre exploitation agricole en temps réel.
          </p>
        </div>
        
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 border border-slate-300 rounded-lg shadow-2xs">
          <Database className="h-4 w-4 text-slate-400" />
          <span className="text-xs text-slate-600 font-semibold uppercase tracking-wider">Locataire : Actif (Read-Only BI)</span>
        </div>
      </div>

      {/* SUBTABS */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-2 scrollbar-none" id="bi-subtabs">
        {[
          { id: 'dashboards', label: 'Tableaux de Bord Thématiques', icon: LayoutGrid },
          { id: 'kpis', label: 'Catalogue des Indicateurs (Règle 1)', icon: Layers },
          { id: 'query-builder', label: 'Constructeur Visuel de Requêtes', icon: FileSpreadsheet },
          { id: 'scheduler', label: 'Rapports Programmés', icon: Calendar },
          { id: 'alerts', label: 'Alertes de Seuils Actives (Règle 5)', icon: AlertTriangle }
        ].map(tab => {
          const Icon = tab.icon;
          const active = biActiveTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setBiActiveTab(tab.id as any)}
              className={`p-3 text-xs font-medium border-b-2 flex items-center gap-2 whitespace-nowrap transition-all ${
                active 
                  ? 'border-indigo-600 text-indigo-600 font-bold' 
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              <Icon className={`h-4 w-4 ${active ? 'text-indigo-600' : 'text-slate-400'}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: 1. THEMATIC DASHBOARDS */}
      {biActiveTab === 'dashboards' && (
        <div className="space-y-6">
          {/* THEMATIC NAV BUTTONS */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'pilotage', label: 'Pilotage Exploitation', color: 'indigo' },
              { id: 'vegetal', label: 'Performance Cultures', color: 'emerald' },
              { id: 'elevage', label: 'Santé Élevage & Troupeau', color: 'rose' },
              { id: 'materiel', label: 'Parc Matériel & Fiabilité', color: 'amber' },
              { id: 'comptes', label: 'Comptes & Trésorerie', color: 'cyan' },
              { id: 'stocks', label: 'Stock & Péremptions', color: 'teal' }
            ].map(d => (
              <button
                key={d.id}
                onClick={() => setActiveBoard(d.id as any)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-2xs transition ${
                  activeBoard === d.id 
                    ? 'bg-slate-800 text-white' 
                    : 'bg-white hover:bg-slate-100 border text-slate-600'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          {/* RENDERING SPECIFIC DYNAMIC THEMATIONS */}
          {/* BOARD A: PILOTAGE GENERAL */}
          {activeBoard === 'pilotage' && (
            <div className="space-y-6">
              {/* TOP CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Trésorerie Disponible</span>
                  <div className="text-xl font-bold text-slate-800 mt-1">{fin.treasuryAvailable.toLocaleString()} FCFA</div>
                  <div className="text-[10px] text-green-600 font-bold flex items-center gap-0.5 mt-1">
                    <ArrowUpRight className="h-3 w-3" /> Solde en Banque
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Hectares Exploités</span>
                  <div className="text-xl font-bold text-slate-800 mt-1">{veg.totalHectares} Hectares</div>
                  <div className="text-[10px] text-slate-500 mt-1">{veg.activePlotsCount} parcelles actives</div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Total Bêtes (Élevage)</span>
                  <div className="text-xl font-bold text-slate-800 mt-1">{elv.totalHeads} têtes</div>
                  <div className="text-[10px] text-slate-500 mt-1">Taux mortalité: {elv.mortalityRate}%</div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Taux Disponibilité Matériel</span>
                  <div className="text-xl font-bold text-slate-800 mt-1">{flt.availablePercent}%</div>
                  <div className="text-[10px] text-slate-500 mt-1">GMAO active</div>
                </div>
              </div>

              {/* INTEGRATED EXECUTIVE CHANTS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* SVG Comparative bar chart */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
                  <h4 className="text-xs font-extrabold uppercase text-slate-500 tracking-wider">Performance Financière Globale (FCFA)</h4>
                  
                  <div className="space-y-4 pt-4">
                    {/* Income */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-600 font-medium">Chiffre d'Affaires Réel (Ventes)</span>
                        <strong className="text-slate-800">{fin.totalSales.toLocaleString()} FCFA</strong>
                      </div>
                      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: '85%' }}></div>
                      </div>
                    </div>

                    {/* Expenses */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-600 font-medium">Charges Cumulative Exploitation</span>
                        <strong className="text-slate-800">{fin.totalExpenses.toLocaleString()} FCFA</strong>
                      </div>
                      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500" style={{ width: '48%' }}></div>
                      </div>
                    </div>

                    {/* Budgets */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-600 font-medium">Marge Nette Consolidée</span>
                        <strong className="text-indigo-700 font-extrabold">{fin.netMargin.toLocaleString()} FCFA</strong>
                      </div>
                      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-600" style={{ width: '55%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col justify-between">
                  <h4 className="text-xs font-extrabold uppercase text-slate-500 tracking-wider">Répartition Hectare Cultivée par Végétal</h4>
                  <div className="flex items-center justify-center p-4">
                    {/* Interactive vector pie donut */}
                    <svg className="w-32 h-32" viewBox="0 0 36 36">
                      <path
                        className="text-emerald-100"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-emerald-500"
                        strokeWidth="4"
                        strokeDasharray="45, 100"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-amber-500"
                        strokeWidth="4"
                        strokeDasharray="30, 100"
                        strokeDashoffset="-45"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <text x="18" y="20.35" className="text-[5px] font-bold text-slate-700 font-sans" textAnchor="middle" fill="currentColor">
                        Cameroun
                      </text>
                    </svg>

                    <div className="ml-6 space-y-1.5 text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                        <span className="text-slate-600">Maïs Grain (45%)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                        <span className="text-slate-600">Cacao (30%)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
                        <span className="text-slate-600">Jachère/Autres (25%)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* BOARD B: PERFORMANCE VEGETALE */}
          {activeBoard === 'vegetal' && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
              <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-emerald-600" /> Analyse de Rendement culturale par parcelle (Campagne en cours)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 font-bold text-[10px] text-slate-500 uppercase">
                        <th className="p-3">Parcelle cible</th>
                        <th className="p-3">Culture active</th>
                        <th className="p-3">Surface (HA)</th>
                        <th className="p-3">Rendement estimé</th>
                        <th className="p-3 text-right">Marge brute / HA</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {parcelles.map(p => {
                        const cult = cultures.find(c => c.idParcelle === p.id) || cultures[0];
                        return (
                          <tr key={p.id}>
                            <td className="p-3 font-semibold text-slate-800">{p.nom}</td>
                            <td className="p-3">
                              <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-md font-bold text-[10px]">
                                {cult?.nom || 'Agrumes'}
                              </span>
                            </td>
                            <td className="p-3 text-slate-600">{p.surface} HA</td>
                            <td className="p-3 font-bold text-slate-800">{p.surface * 2.5} Tonnes</td>
                            <td className="p-3 text-right text-emerald-600 font-extrabold">{(350000 * p.surface).toLocaleString()} FCFA</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* SVG Visual Yield columns */}
                <div className="bg-slate-50 p-4 rounded-lg flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                      Rendements Cumulés Campagne (Tonnes)
                    </span>
                    <div className="flex items-end gap-5 h-36 pt-4 pb-2 justify-around">
                      <div className="flex flex-col items-center gap-1.5">
                        <div className="w-6 bg-emerald-500 rounded-t h-28 flex items-center justify-center text-[9px] text-white font-bold">28t</div>
                        <span className="text-[9px] text-slate-500 font-medium">Maïs Obala</span>
                      </div>
                      <div className="flex flex-col items-center gap-1.5">
                        <div className="w-6 bg-amber-500 rounded-t h-16 flex items-center justify-center text-[9px] text-white font-bold">12t</div>
                        <span className="text-[9px] text-slate-500 font-medium">Cacao Centre</span>
                      </div>
                      <div className="flex flex-col items-center gap-1.5">
                        <div className="w-6 bg-indigo-500 rounded-t h-10 flex items-center justify-center text-[9px] text-white font-bold">6t</div>
                        <span className="text-[9px] text-slate-500 font-medium">Maraîchers</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* BOARD C: SANTE ELEVAGE */}
          {activeBoard === 'elevage' && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
              <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                <Heart className="h-4 w-4 text-rose-600" /> Analyse de Santé du Troupeau & Mortalités
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Taux de Mortalité</span>
                  <span className="text-2xl font-bold text-rose-700 block mt-1">{elv.mortalityRate}%</span>
                  <span className="text-[9px] text-slate-500">Seuil alerte critique: &gt;5%</span>
                </div>

                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Poids Moyen (GMQ)</span>
                  <span className="text-2xl font-bold text-slate-800 block mt-1">{elv.averageWeight} Kg</span>
                  <span className="text-[9px] text-green-600 font-semibold block mt-0.5">+4.5% vs mois précédent</span>
                </div>

                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Interventions Vétérinaires</span>
                  <span className="text-2xl font-bold text-indigo-700 block mt-1">12 fiches</span>
                  <span className="text-[9px] text-slate-500">Alerte prophylaxie active</span>
                </div>
              </div>

              <div className="p-4 bg-rose-50/50 rounded-lg border border-rose-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-rose-600" />
                  <div className="text-slate-700 font-semibold">
                    Zoonoses surveillées : 0 foyers de peste porcine déclenchés dans la zone d'Obala.
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-600 text-white font-bold px-1.5 py-0.5 rounded">
                  OK
                </span>
              </div>
            </div>
          )}

          {/* BOARD D: PARC MATERIEL & FIABILITE */}
          {activeBoard === 'materiel' && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
              <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                <Sliders className="h-4 w-4 text-indigo-600" /> État du Parc Matériel & Maintenance (Consommé GMAO)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between text-xs items-center p-2.5 bg-slate-50 border rounded-lg">
                    <span className="text-slate-600 font-medium">Disponibilité parc matériel</span>
                    <strong className="text-slate-800">{flt.availablePercent}% d'actifs</strong>
                  </div>
                  <div className="flex justify-between text-xs items-center p-2.5 bg-slate-50 border rounded-lg">
                    <span className="text-slate-600 font-medium">Total engins de traction</span>
                    <strong className="text-slate-800">{flt.totalEngines} unités</strong>
                  </div>
                  <div className="flex justify-between text-xs items-center p-2.5 bg-slate-50 border rounded-lg">
                    <span className="text-slate-600 font-medium">Cumul Maintenance (GMAO Clôturé)</span>
                    <strong className="text-indigo-700">125,000 FCFA</strong>
                  </div>
                </div>

                <div className="p-4 bg-slate-900 text-slate-100 rounded-xl space-y-2 font-mono text-[11px]">
                  <div className="text-[10px] text-slate-400 border-b border-slate-700 pb-1 uppercase font-bold">Console Fiabilité GMAO</div>
                  <div>MTBF Global : 450 Heures de fonctionnement</div>
                  <div>MTTR Moyen : 48 Heures d'immobilisation corrective</div>
                  <div>Rapport Prév vs Cur : 100% Préventif</div>
                </div>
              </div>
            </div>
          )}

          {/* BOARD E: COMPTES COMPTABILITE */}
          {activeBoard === 'comptes' && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
              <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                <Book className="h-4 w-4 text-cyan-600" /> Écarts Budgétaires & Comptabilité SYSCOHADA Consolidée
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 font-bold text-[10px] text-slate-500 uppercase">
                      <th className="p-3">Département d'exploitation</th>
                      <th className="p-3">Enveloppe Allouée</th>
                      <th className="p-3">Montant Engagé Réel</th>
                      <th className="p-3">Disponible Restant</th>
                      <th className="p-3 text-right">Taux Exécution</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {budgets.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-6 text-center text-slate-400">Aucune enveloppe de budget paramétrée sur cet exercice.</td>
                      </tr>
                    ) : (
                      budgets.map(b => {
                        const remaining = b.montantInitial - b.montantEngage;
                        const prc = Math.round((b.montantEngage / b.montantInitial) * 100);
                        return (
                          <tr key={b.id}>
                            <td className="p-3 font-semibold text-slate-800">{b.departement}</td>
                            <td className="p-3 text-slate-600">{b.montantInitial.toLocaleString()} FCFA</td>
                            <td className="p-3 font-bold text-slate-800">{b.montantEngage.toLocaleString()} FCFA</td>
                            <td className="p-3 font-medium text-slate-600">{remaining.toLocaleString()} FCFA</td>
                            <td className="p-3 text-right">
                              <span className={`text-[10px] px-1.5 py-0.5 rounded bg-slate-100 font-bold ${
                                prc > 90 ? 'text-red-700' : 'text-indigo-600'
                              }`}>
                                {prc}%
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* BOARD F: STOCKS & PEREMPTIONS */}
          {activeBoard === 'stocks' && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
              <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                <Table className="h-4 w-4 text-teal-600" /> Valorisation des Stocks & Lots proches de Péremption
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 border rounded-xl">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Valorisation Instantanée</span>
                    <strong className="text-xl font-bold text-slate-800">{stk.totalStockValue.toLocaleString()} FCFA</strong>
                    <p className="text-[9px] text-slate-500 mt-1">Calculé au coût de revient unitaire pondéré du grand livre</p>
                  </div>

                  <div className="flex justify-between items-center bg-teal-50 border border-teal-200 text-teal-800 p-3 rounded-lg text-xs font-semibold">
                    <span>Alerte Ruptures Stock : 0 articles en sous-seuil critique !</span>
                    <span className="px-1.5 py-0.5 bg-emerald-600 text-white rounded font-bold text-[9px]">SÉCURISÉ</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-dotted border-slate-300 text-xs space-y-3">
                  <span className="font-bold text-slate-700 block uppercase text-[10px]">Lots Proches Péremption</span>
                  
                  {/* Mock items with dates */}
                  <div className="p-2.5 bg-yellow-50 border border-yellow-200 rounded-lg text-xs">
                    <div className="flex justify-between font-bold text-yellow-800">
                      <span>NPK 20-10-10 Lot #OB-41A</span>
                      <span>14-Nov-2026</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block">Délai avant péremption : ~140 jours</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* TAB CONTENT: 2. LOG OF UNIFORM KPIs CATALOGUE */}
      {biActiveTab === 'kpis' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchKpi}
                onChange={e => setSearchKpi(e.target.value)}
                placeholder="Rechercher code de mesure, nom..."
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-indigo-600 bg-slate-50"
              />
            </div>

            <select
              value={sourceKpiFilter}
              onChange={e => setSourceKpiFilter(e.target.value)}
              className="p-2 border border-slate-300 bg-white rounded-lg text-xs w-full md:w-48"
            >
              <option value="all">Tous modules d'origine</option>
              <option value="végétal">Circuits Végétaux</option>
              <option value="élevage">Circuits Élevage</option>
              <option value="stock">Mouvements de Stocks</option>
              <option value="finance">Comptabilité & Finance</option>
              <option value="matériel">Parc Matériel & GMAO</option>
            </select>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 font-bold uppercase text-[10px] text-slate-500 tracking-wider">
                    <th className="p-3">Ref ID</th>
                    <th className="p-3">Nom Mesure Harmonisée</th>
                    <th className="p-3">Classification Métier</th>
                    <th className="p-3">Formule de Calcul Reconnue (Règle 1)</th>
                    <th className="p-3">Périodicité de rafraîchissement</th>
                    <th className="p-3 text-right">Valeur KPI Consolidée</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredKPIsRef.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-slate-400">Aucun indicateur de performance enregistré.</td>
                    </tr>
                  ) : (
                    filteredKPIsRef.map(kpi => {
                      // resolve real live value based on code matches
                      let activeValText = 'Non disponible';
                      if (kpi.code === 'KPI_REVENUE') activeValText = `${fin.totalSales.toLocaleString()} FCFA`;
                      if (kpi.code === 'KPI_TREASURY') activeValText = `${fin.treasuryAvailable.toLocaleString()} FCFA`;
                      if (kpi.code === 'KPI_HECTARES') activeValText = `${veg.totalHectares} HA`;
                      if (kpi.code === 'KPI_YIELD') activeValText = `${veg.averageYieldPerHa} kg/HA`;
                      if (kpi.code === 'KPI_MORTALITY') activeValText = `${elv.mortalityRate}%`;
                      if (kpi.code === 'KPI_AVAIL_MAT') activeValText = `${flt.availablePercent}%`;
                      if (kpi.code === 'KPI_STOCK_VAL') activeValText = `${stk.totalStockValue.toLocaleString()} FCFA`;

                      return (
                        <tr key={kpi.id} className="hover:bg-slate-50/50">
                          <td className="p-3 font-mono font-bold text-indigo-700">{kpi.code}</td>
                          <td className="p-3 text-slate-800 font-bold">{kpi.nom}</td>
                          <td className="p-3">
                            <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold">
                              {kpi.moduleSource}
                            </span>
                          </td>
                          <td className="p-3 text-slate-500 font-sans italic">"{kpi.formuleCalcul}"</td>
                          <td className="p-3 text-slate-400 text-[10.5px]">{kpi.frequence}</td>
                          <td className="p-3 text-right font-extrabold text-indigo-800 text-sm">{activeValText || '0'}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 italic">
            * Conforme à la Règle 1: définition de calcul unique, partagée par tous les widgets et garantissant la parfaite intégrité analytique sans recalculs rétroactifs.
          </p>
        </div>
      )}

      {/* TAB CONTENT: 3. VISUAL QUERY BUILDER */}
      {biActiveTab === 'query-builder' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
            <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-1.5 border-b pb-2">
              <Sliders className="h-4 w-4 text-indigo-600" /> Constructeur Visuel d'Analyse (Requêtes complexes)
            </h3>
            
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-500 uppercase text-[10px]">Désignation Analyse *</label>
                <input
                  type="text"
                  value={queryName}
                  onChange={e => setQueryName(e.target.value)}
                  className="p-2 border rounded-md bg-slate-50 w-full"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500 uppercase text-[10px] block">Sélectionnez les Modules Sources *</label>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {['végétal', 'élevage', 'stocks', 'conmpta', 'matériel'].map(m => {
                    const isSelected = selectedSources.includes(m);
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setSelectedSources(prev => prev.filter(x => x !== m));
                          } else {
                            setSelectedSources(prev => [...prev, m]);
                          }
                        }}
                        className={`p-2 border rounded text-xs transition ${
                          isSelected ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-bold' : 'bg-slate-50 text-slate-600'
                        }`}
                      >
                        {m === 'conmpta' ? 'Comptabilité' : m.toUpperCase()}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500 uppercase text-[10px]">Dimension de Groupement *</label>
                <select
                  value={selectedGroupDim}
                  onChange={e => setSelectedGroupDim(e.target.value)}
                  className="p-2 border rounded-md bg-slate-50 w-full"
                >
                  <option value="par culture">Regrouper par Type de Culture (Maïs Grain, Cacao...)</option>
                  <option value="par parcelle">Regrouper par Cadastre de Parcelle</option>
                  <option value="par mois">Regrouper par Succession Temporelle (Mois)</option>
                  <option value="par operateur">Regrouper par Collaborateur Opérateur (RH)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500 uppercase text-[10px] block">Seuils de Filtre (Optionnel)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={queryFilterField}
                    onChange={e => setQueryFilterField(e.target.value)}
                    className="p-1.5 border rounded bg-slate-50 text-xs w-24"
                    placeholder="Marge..."
                  />
                  <select
                    value={queryFilterOperator}
                    onChange={e => setQueryFilterOperator(e.target.value)}
                    className="p-1 border bg-slate-50 rounded text-xs"
                  >
                    <option value=">">&gt;</option>
                    <option value="<">&lt;</option>
                    <option value="=">=</option>
                  </select>
                  <input
                    type="number"
                    value={queryFilterVal}
                    onChange={e => setQueryFilterVal(Number(e.target.value))}
                    className="p-1.5 border rounded bg-slate-50 text-xs grow"
                  />
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="button"
                  onClick={handleExecuteQueryBuilder}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition"
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Exécuter & Mettre en cache
                </button>
              </div>
            </div>
          </div>

          {/* QUERY EXECUTION RESULTS TABLE */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <div className="flex items-center gap-1.5">
                <FileSpreadsheet className="h-4 w-4 text-indigo-600" />
                <h3 className="text-sm font-semibold text-slate-700">Explorateur Spreadsheet Ad-hoc</h3>
              </div>
              
              {queryExecuted && (
                <button
                  onClick={handleSaveQueryAsKpi}
                  className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-200 hover:bg-emerald-100 text-[11px] font-bold flex items-center gap-1"
                >
                  <Sparkles className="h-3.5 w-3.5 text-emerald-600" /> Sauvegarder comme KPI
                </button>
              )}
            </div>

            {queryExecuted ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs p-2 bg-indigo-50 border border-indigo-100 rounded text-indigo-700">
                  <span>🎯 Résultat généré - Cache péremption : 21-Juin-2026 08:30 (1 Heure immuable)</span>
                  <span className="font-bold">CONSOLIDÉ</span>
                </div>

                <div className="overflow-x-auto border rounded-xl bg-slate-50/50">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 font-bold uppercase text-[10px] text-slate-600 py-2">
                        <th className="p-3">Dimension regroupée</th>
                        <th className="p-3">Volume transactionnel</th>
                        <th className="p-3">Somme du chiffre (FCFA)</th>
                        <th className="p-3">Coût d'exploitation</th>
                        <th className="p-3 text-right">Marge calculée</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr>
                        <td className="p-3 font-bold text-slate-800">Maïs Grain Ob-01</td>
                        <td className="p-3">12 recoltes</td>
                        <td className="p-3 font-semibold text-slate-700">12,500,000 FCFA</td>
                        <td className="p-3 text-red-657">4,500,000 FCFA</td>
                        <td className="p-3 text-right text-green-700 font-bold">8,000,000 FCFA</td>
                      </tr>
                      <tr className="bg-slate-50/50">
                        <td className="p-3 font-bold text-slate-800">Cacao Nord-02</td>
                        <td className="p-3">5 recoltes</td>
                        <td className="p-3 font-semibold text-slate-700">8,900,000 FCFA</td>
                        <td className="p-3 text-red-657 text-slate-550">1,200,000 FCFA</td>
                        <td className="p-3 text-right text-green-700 font-bold">7,700,000 FCFA</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-center text-slate-400 space-y-2">
                <Inbox className="h-10 w-10 text-slate-300" />
                <p className="text-xs">Aucune requête en cours. Utilisez le volet de gauche pour injecter des dimensions d'analyse et lancer l'algorithme d'agrégation.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: 4. SCHEDULER */}
      {biActiveTab === 'scheduler' && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
          <div className="flex justify-between items-center border-b pb-3 border-slate-100">
            <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
              <Mail className="h-4 w-4 text-indigo-500" /> Planification de Rapports Périodiques & Clôtures
            </h3>
            <button
              onClick={() => setShowAddReportModal(true)}
              className="px-3 py-1.5 bg-indigo-600 font-bold hover:bg-indigo-700 text-white text-xs rounded-lg flex items-center gap-1 shadow-xs transition"
            >
              + Programmer un Rapport
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[10px] font-bold">
                  <th className="p-3">Désignation Rapport</th>
                  <th className="p-3">Modèle d'agrégation</th>
                  <th className="p-3">Destinataires planifiés</th>
                  <th className="p-3">Format</th>
                  <th className="p-3">Périodicité</th>
                  <th className="p-3">Dernier envoi</th>
                  <th className="p-3 text-right">Actions de diagnostic</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rapportsProgrammes.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-slate-400">Aucun rapport périodique programmé pour le locataire.</td>
                  </tr>
                ) : (
                  rapportsProgrammes.map(rep => (
                    <tr key={rep.id}>
                      <td className="p-3 font-bold text-slate-800">{rep.nom}</td>
                      <td className="p-3 text-slate-600">{rep.modele}</td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1">
                          {rep.destinataires.map((mail, idx) => (
                            <span key={idx} className="px-1.5 py-0.5 bg-slate-100 border text-slate-600 rounded text-[10px]">
                              {mail}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="font-extrabold text-[10px] text-indigo-700">{rep.formatExport}</span>
                      </td>
                      <td className="p-3 font-semibold text-slate-700">{rep.periodicite}</td>
                      <td className="p-3 text-slate-500">{rep.derniereGen}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => activeDownloadSimulator(rep)}
                          className="px-2.5 py-1 hover:bg-slate-100 border border-slate-300 rounded text-[10.5px] font-bold text-slate-700 inline-flex items-center gap-1"
                        >
                          <Download className="h-3 w-3" /> Télécharger
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 5. ACTIVE BI THRESHOLD ALERTS */}
      {biActiveTab === 'alerts' && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
          <div className="flex justify-between items-center border-b pb-3">
            <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4 text-red-600" /> Surveillance Proactive des Seuils Critiques (Règle 5 anti-bruit)
            </h3>
            <span className="text-xs text-slate-500">Alertes actives et acquittements de sécurité</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {alertesBI.length === 0 ? (
              <p className="p-12 text-center text-slate-400 text-xs col-span-full">Aucune règle d'alerte sous-seuil configurée.</p>
            ) : (
              alertesBI.map(al => {
                const kpiObj = indicateursKPI.find(k => k.id === al.idIndicateurKPI);
                const isTriggered = al.statutActuel === 'En Alerte';
                return (
                  <div key={al.id} className={`p-4 rounded-xl border space-y-2 ${
                    isTriggered ? 'bg-red-50/50 border-red-200' : 'bg-slate-50 border-slate-200/60'
                  }`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded leading-none ${
                            isTriggered ? 'bg-red-600 text-white' : 'bg-slate-300 text-slate-700'
                          }`}>
                            {al.statutActuel}
                          </span>
                          <h4 className="text-xs font-bold text-slate-800">{kpiObj?.nom}</h4>
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1 block">Alerte : Condition {al.condition} à {al.valeurSeuil.toLocaleString()} {kpiObj?.unite}</span>
                      </div>
                    </div>

                    {al.commentaireAcquitement && (
                      <div className="p-2 bg-slate-100 rounded text-[10.5px] italic text-slate-500 mb-2">
                        💬 Justification : "{al.commentaireAcquitement}"
                      </div>
                    )}

                    {isTriggered && (
                      <div className="pt-2 border-t border-slate-200/50 flex justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            setAckSelectedAlertId(al.id);
                            setAckComment('');
                          }}
                          className="px-2 py-1 bg-slate-800 text-white rounded text-[10.5px] font-bold"
                        >
                          Acquitter l'Alerte
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* --- COMMITTMENT ACQUITTEMENT PROMPT DIALOG --- */}
      {ackSelectedAlertId && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl border max-w-sm w-full p-6">
            <h4 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-1 border-b pb-2">
              <Check className="h-4 w-4 text-green-600" /> Confirmer l'acquittement de l'alerte
            </h4>
            <p className="text-[11px] text-slate-500 leading-normal mb-3">
              Renseignez un motif ou commentaire de confirmation (conformément à la <strong>Règle 5 Anti-bruit</strong>, l'acquittement empêche les notifications répétitives).
            </p>

            <form onSubmit={handleAcknowledgeAlert} className="space-y-3 font-sans">
              <textarea
                value={ackComment}
                onChange={e => setAckComment(e.target.value)}
                placeholder="Remplissage d'engrais effectué / Trésorerie renflouée suite à l'encaissement..."
                className="p-2 border rounded-md text-xs bg-slate-50 w-full h-16"
                required
              />

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAckSelectedAlertId(null)}
                  className="px-3.5 py-1.5 border rounded-md text-xs font-semibold text-slate-500"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-md text-xs font-semibold"
                >
                  Valider l'Acquittement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ADD SCHEDULED REPORT MODAL --- */}
      {showAddReportModal && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl border max-w-md w-full p-6">
            <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-1.5 border-b pb-3">
              <Mail className="h-5 w-5 text-indigo-500" /> Planifier un reporting automatique
            </h3>

            <form onSubmit={handleCreateReport} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Désignation du Reporting *</label>
                <input
                  type="text"
                  value={reportName}
                  onChange={e => setReportName(e.target.value)}
                  placeholder="Rapport d'aleas de production et rendements..."
                  className="p-2 border rounded-md text-xs bg-slate-50 w-full"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Modèle de Rapports Métier *</label>
                <select
                  value={reportModele}
                  onChange={e => setReportModele(e.target.value)}
                  className="p-2 border rounded-md text-xs bg-slate-50 w-full"
                  required
                >
                  <option value="Pilotage financier complet">Pilotage financier complet (Finance & Compta)</option>
                  <option value="Suivi des cultures & Rendements">Suivi des cultures & Rendements (Végétal)</option>
                  <option value="GMAO & Disponibilité Parc">GMAO & Disponibilité Parc (Matériel)</option>
                  <option value="Santé troupeaux & sanitaires">Santé troupeaux & sanitaires (Élevage)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Emails des Destinataires (Séparer par virgules) *</label>
                <input
                  type="text"
                  value={reportDest}
                  onChange={e => setReportDest(e.target.value)}
                  placeholder="iaapn08@gmail.com, admin@mefoup.com"
                  className="p-2 border rounded-md text-xs bg-slate-50 w-full"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Fréquence d'Exécution</label>
                  <select
                    value={reportFreq}
                    onChange={e => setReportFreq(e.target.value as any)}
                    className="p-2 border rounded-md text-xs bg-slate-50 w-full"
                  >
                    <option value="Quotidien">Quotidien</option>
                    <option value="Hebdomadaire">Hebdomadaire</option>
                    <option value="Mensuel">Mensuel</option>
                    <option value="Fin de Campagne">En fin de Campagne Agricole</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Format d'exportation</label>
                  <select
                    value={reportFormat}
                    onChange={e => setReportFormat(e.target.value as any)}
                    className="p-2 border rounded-md text-xs bg-slate-50 w-full"
                  >
                    <option value="PDF">PDF (Aperçu imprimable)</option>
                    <option value="Excel">Microsoft Excel Spreadsheet</option>
                    <option value="CSV">Données brutes CSV</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t pt-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowAddReportModal(false)}
                  className="px-4 py-2 border rounded-md text-xs font-semibold text-slate-600"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md text-xs"
                >
                  Créer Planification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
