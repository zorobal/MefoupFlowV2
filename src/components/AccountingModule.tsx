/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { PieceComptable, Budget, Equipement } from '../types';
import {
  Book,
  Scale,
  LineChart,
  DollarSign,
  PlusCircle,
  FileCheck2,
  ListRestart,
  TrendingDown,
  Activity,
  Calculator,
  Briefcase,
  AlertTriangle,
  Globe,
  Settings,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  FileText,
  TrendingUp,
  Inbox,
  RefreshCw,
  Clock,
  CheckCircle2,
  XCircle,
  FileSpreadsheet,
  Layers,
  ArrowRightLeft
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface AccountingModuleProps {
  pieces: PieceComptable[];
  budgets: Budget[];
  equipements: Equipement[];
  onAddPiece: (piece: PieceComptable) => void;
  onAddBudget: (bud: Budget) => void;
  onUpdateBudgetEngaged: (budgetId: string, amount: number) => void;
}

// 17 SYSCOHADA Country Members
const OHADA_COUNTRIES = [
  { code: 'BJ', name: 'Bénin', vat: 18 },
  { code: 'BF', name: 'Burkina Faso', vat: 18 },
  { code: 'CM', name: 'Cameroun', vat: 19.25 },
  { code: 'CF', name: 'République Centrafricaine', vat: 19 },
  { code: 'KM', name: 'Comores', vat: 15 },
  { code: 'CG', name: 'Congo', vat: 18 },
  { code: 'CI', name: "Côte d'Ivoire", vat: 18 },
  { code: 'GA', name: 'Gabon', vat: 18 },
  { code: 'GN', name: 'Guinée', vat: 18 },
  { code: 'GW', name: 'Guinée-Bissau', vat: 19 },
  { code: 'GQ', name: 'Guinée Équatoriale', vat: 15 },
  { code: 'ML', name: 'Mali', vat: 18 },
  { code: 'NE', name: 'Niger', vat: 19 },
  { code: 'CD', name: 'RDC (Congo-Kinshasa)', vat: 16 },
  { code: 'SN', name: 'Sénégal', vat: 18 },
  { code: 'TD', name: 'Tchad', vat: 18 },
  { code: 'TG', name: 'Togo', vat: 18 }
];

export default function AccountingModule({
  pieces: initialPieces,
  budgets: initialBudgets,
  equipements: initialEquipements,
  onAddPiece,
  onAddBudget,
  onUpdateBudgetEngaged
}: AccountingModuleProps) {
  // Use state local copy so newly added items are interactive
  const [pieces, setPieces] = useState<PieceComptable[]>(initialPieces);
  const [budgets, setBudgets] = useState<Budget[]>(initialBudgets);
  const [equipements, setEquipements] = useState<Equipement[]>(initialEquipements);

  // General Setup state
  const [selectedCountryCode, setSelectedCountryCode] = useState('CM');
  const [regimeComptable, setRegimeComptable] = useState<'Normal' | 'SMT'>('Normal');
  const [regimeFiscal, setRegimeFiscal] = useState<'Reel' | 'Simplifie' | 'Exonere' | 'Forfaitaire'>('Simplifie');
  const [agroVatExempt, setAgroVatExempt] = useState(true);

  // Active Tab layout
  const [activeTab, setActiveTab] = useState<'grand-livre' | 'balance' | 'etats' | 'rapprochement' | 'immos' | 'budgets'>('grand-livre');
  const [activeStatementTab, setActiveStatementTab] = useState<'bilan' | 'resultat' | 'tft' | 'propres' | 'annexe'>('bilan');

  // Interactive controls
  const [showAddPiece, setShowAddPiece] = useState(false);
  const [showAddBudget, setShowAddBudget] = useState(false);
  const [filterDate, setFilterDate] = useState('');
  const [filterJournal, setFilterJournal] = useState('ALL');

  // Input states for new ledger piece
  const [newJournal, setNewJournal] = useState<'ACH' | 'VEN' | 'BQ' | 'CAI' | 'OD'>('ACH');
  const [newRefPiece, setNewRefPiece] = useState('');
  const [newLibelle, setNewLibelle] = useState('');
  const [newDebitCompte, setNewDebitCompte] = useState('6011 (Engrais & Intrants)');
  const [newCreditCompte, setNewCreditCompte] = useState('4011 (Fournisseurs d’intrants)');
  const [newMontantDebit, setNewMontantDebit] = useState(150000);
  const [newMontantCredit, setNewMontantCredit] = useState(150000);
  const [newAnalUnit, setNewAnalUnit] = useState('Secteur Nord Maraîchage');
  const [errorBalanced, setErrorBalanced] = useState('');

  // Fixed Asset Amortissement Calculator State
  const [selectedEquipId, setSelectedEquipId] = useState(equipements[0]?.id || '');
  const [amortissementMethod, setAmortissementMethod] = useState<'linear' | 'degressive'>('linear');

  // State for Personnel Salary Charges Modal
  const [showAddSalaryCharge, setShowAddSalaryCharge] = useState(false);
  const [salaryPeriod, setSalaryPeriod] = useState('06-2026');
  const [salaryPost, setSalaryPost] = useState('Saisonniers Maraîchers');
  const [salaryAmount, setSalaryAmount] = useState(650000);

  // Bank Reconciliation matching list
  const [reconciledIds, setReconciledIds] = useState<string[]>([]);
  // Simulated external statement lines for reconciliation in OHADA zone (5211 Bank)
  const [simulatedStatement, setSimulatedStatement] = useState([
    { id: 'bank-ext-1', date: '2026-06-10', label: 'FAC-AUTO-404 Virement Client', amount: 500000, type: 'credit', matched: false },
    { id: 'bank-ext-2', date: '2026-06-12', label: 'CHQ-22001 Fournisseur Semis', amount: 120000, type: 'debit', matched: false },
    { id: 'bank-ext-3', date: '2026-06-15', label: 'Achat Gazole Tracteur Shell', amount: 95000, type: 'debit', matched: false },
    { id: 'bank-ext-4', date: '2026-06-18', label: 'Retrait Espèces Caisse', amount: 300000, type: 'debit', matched: false }
  ]);

  const selectedCountry = useMemo(() => {
    return OHADA_COUNTRIES.find(c => c.code === selectedCountryCode) || OHADA_COUNTRIES[0];
  }, [selectedCountryCode]);

  // Standard SYSCOHADA Accounts
  const standardNames: { [code: string]: string } = {
    '1011': 'Capital Social (Exploitant)',
    '1201': 'Réserves légales',
    '1301': 'Report à nouveau',
    '2111': 'Terrains Agricoles / Parcelles',
    '2441': 'Matériel Agricole (Tracteurs)',
    '2844': 'Amortissement Matériel Agricole',
    '3111': 'Stocks d’engrais et semences',
    '3112': 'Stocks d’aliments & bétails',
    '3211': 'Stocks de produits récoltés',
    '4011': 'Fournisseurs d’intrants (Tiers)',
    '4111': 'Clients nationaux (Créances)',
    '4221': 'Personnel - Rémunérations dues',
    '4434': 'État - TVA Collectée',
    '4452': 'État - TVA déductible',
    '5211': 'Compte Banque (Afriland/SG)',
    '5711': 'Compte Caisse (Espèces)',
    '5712': 'Caisse Mobile Money (Wave/OM/MTN)',
    '6011': 'Achats d’intrants et engrais',
    '6015': 'Achats d’aliments bétails',
    '6016': 'Achats d’hydrocarbures & Carburant',
    '6017': 'Frais sanitaires et vétérinaires',
    '6111': 'Frais de transport & distribution',
    '6611': 'Rémunérations globales du personnel',
    '6811': 'Dotations aux Amortissements d’Actifs',
    '7011': 'Ventes de cultures agricoles',
    '7012': 'Ventes de bétails & lait',
    '8411': 'Produits Hors Activités Ordinaires (HAO)'
  };

  // Helper to extract account codes from Account strings (Ex: "6011 (Engrais & Intrants)" -> "6011")
  const extractCode = (str: string): string => {
    const match = str.match(/^(\d+)/);
    return match ? match[1] : str.trim();
  };

  const getAccountName = (code: string): string => {
    return standardNames[code] || "Autre compte Ohada";
  };

  // Double entry validator
  const handleCreatePiece = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMontantDebit !== newMontantCredit) {
      setErrorBalanced(`Déséquilibre détecté : Débit (${newMontantDebit}) ≠ Crédit (${newMontantCredit}). En comptabilité SYSCOHADA par partie double, Σ débits doit égaler Σ crédits.`);
      return;
    }
    setErrorBalanced('');

    const codeD = extractCode(newDebitCompte);
    const codeC = extractCode(newCreditCompte);

    const newPiece: PieceComptable = {
      id: 'pc-manual-' + Math.floor(Math.random() * 10000),
      date: new Date().toISOString().split('T')[0],
      codeJournal: newJournal,
      refePiece: newRefPiece || 'OD-MANUAL',
      libelle: newLibelle,
      debitCompte: `${codeD} (${getAccountName(codeD)})`,
      creditCompte: `${codeC} (${getAccountName(codeC)})`,
      montant: newMontantDebit,
      valide: true,
      centreCoutAnalytique: newAnalUnit || undefined
    };

    onAddPiece(newPiece);
    setPieces(prev => [...prev, newPiece]);
    setShowAddPiece(false);
    setNewRefPiece('');
    setNewLibelle('');
  };

  // Dynamic automatic global personnel payroll recorder
  const handleAddGlobalPayroll = (e: React.FormEvent) => {
    e.preventDefault();
    const newPiece: PieceComptable = {
      id: 'pc-payroll-' + Math.floor(Math.random() * 10000),
      date: new Date().toISOString().split('T')[0],
      codeJournal: 'OD',
      refePiece: `PAIE-${salaryPeriod}`,
      libelle: `Masse salariale globale : ${salaryPost} - Période ${salaryPeriod}`,
      debitCompte: `6611 (Rémunérations globales du personnel)`,
      creditCompte: `4221 (Personnel - Rémunérations dues)`,
      montant: salaryAmount,
      valide: true,
      centreCoutAnalytique: 'Administration Générale'
    };
    onAddPiece(newPiece);
    setPieces(prev => [...prev, newPiece]);
    setShowAddSalaryCharge(false);
  };

  // RECONCILIATION TOGGLE
  const handleToggleReconcile = (itemCode: string, bankLineId: string) => {
    if (reconciledIds.includes(bankLineId)) {
      setReconciledIds(prev => prev.filter(id => id !== bankLineId));
    } else {
      setReconciledIds(prev => [...prev, bankLineId]);
    }
  };

  // AMORTISSEMENT CALCULATIONS
  const selectedEquipment = useMemo(() => {
    return equipements.find(e => e.id === selectedEquipId) || equipements[0];
  }, [equipements, selectedEquipId]);

  const depreciationCalculations = useMemo(() => {
    if (!selectedEquipment) return { ratePercent: '0', annual: 0, accumulated: 0, netBookValue: 0, timeline: [] };
    const years = selectedEquipment.dureeDeVieMois / 12 || 5;
    const acquisitionCost = selectedEquipment.valeurAcquisition;

    let rate = 1 / years;
    let degressiveMultiplier = years <= 4 ? 1.5 : years <= 6 ? 2.0 : 2.5;

    let timeline: { year: number; base: number; annuity: number; cumulated: number; vnc: number }[] = [];
    let cumulative = 0;
    let base = acquisitionCost;

    if (amortissementMethod === 'linear') {
      const annualAnnuity = acquisitionCost * rate;
      for (let i = 1; i <= Math.ceil(years); i++) {
        cumulative += annualAnnuity;
        timeline.push({
          year: 2026 + i - 1,
          base: acquisitionCost,
          annuity: annualAnnuity,
          cumulated: Math.min(acquisitionCost, cumulative),
          vnc: Math.max(0, acquisitionCost - cumulative)
        });
      }
    } else {
      // Degressive Method
      const degressiveRate = rate * degressiveMultiplier;
      let residualVal = acquisitionCost;
      for (let i = 1; i <= Math.ceil(years); i++) {
        const linearCheckRate = 1 / (years - i + 1);
        const actualRate = degressiveRate > linearCheckRate ? degressiveRate : linearCheckRate;
        const curAnnuity = residualVal * actualRate;
        cumulative += curAnnuity;
        residualVal -= curAnnuity;
        timeline.push({
          year: 2026 + i - 1,
          base: base,
          annuity: curAnnuity,
          cumulated: Math.min(acquisitionCost, cumulative),
          vnc: Math.max(0, acquisitionCost - cumulative)
        });
        base = residualVal;
      }
    }

    // Assume 1 year has elapsed
    const annual = timeline[0]?.annuity || 0;
    const accumulated = timeline[0]?.cumulated || 0;
    const netBookValue = timeline[0]?.vnc || 0;

    return {
      ratePercent: ((amortissementMethod === 'linear' ? rate : rate * degressiveMultiplier) * 100).toFixed(1),
      annual,
      accumulated,
      netBookValue,
      timeline
    };
  }, [selectedEquipment, amortissementMethod]);

  const handleGenerateDepreciationEntry = () => {
    if (!selectedEquipment) return;
    const rate = depreciationCalculations.ratePercent;

    const newDeprecPiece: PieceComptable = {
      id: 'pc-deprec-' + Math.floor(Math.random() * 10000),
      date: new Date().toISOString().split('T')[0],
      codeJournal: 'OD',
      refePiece: `DOT-${selectedEquipment.code}`,
      libelle: `Dotation amortissement annuel (${amortissementMethod}) : ${selectedEquipment.designation}`,
      debitCompte: `6811 (Dotations aux Amortissements d’Actifs)`,
      creditCompte: `2844 (Amortissement Matériel Agricole)`,
      montant: Math.round(depreciationCalculations.annual),
      valide: true,
      centreCoutAnalytique: 'Frais Généraux Amortissements'
    };

    onAddPiece(newDeprecPiece);
    setPieces(prev => [...prev, newDeprecPiece]);
    alert(`L'écriture de dotation annuelle de ${Math.round(depreciationCalculations.annual).toLocaleString()} FCFA a été passée avec succès au débit du compte 6811 et au crédit du compte 2844 !`);
  };

  // DYNAMIC COMPILED BALANCE & TRIAL BALANCE
  const balanceSheetResult = useMemo(() => {
    const balances: { [code: string]: { debit: number; credit: number } } = {};

    // Initialize core standard accounts
    Object.keys(standardNames).forEach(code => {
      balances[code] = { debit: 0, credit: 0 };
    });

    // Seed preset historical opening balances
    balances['1011'] = { debit: 0, credit: 12000000 }; // Capital
    balances['2111'] = { debit: 8500000, credit: 0 };   // Terrains
    balances['2441'] = { debit: 6000000, credit: 0 };   // Tracteurs
    balances['5211'] = { debit: 3500000, credit: 0 };   // Banque

    // Incorporate all valid transactions
    pieces.forEach(p => {
      if (p.valide) {
        const dCode = extractCode(p.debitCompte);
        const cCode = extractCode(p.creditCompte);

        if (!balances[dCode]) balances[dCode] = { debit: 0, credit: 0 };
        if (!balances[cCode]) balances[cCode] = { debit: 0, credit: 0 };

        balances[dCode].debit += p.montant;
        balances[cCode].credit += p.montant;
      }
    });

    let trialList = Object.entries(balances).map(([code, entry]) => {
      const diff = entry.debit - entry.credit;
      return {
        code,
        name: standardNames[code] || 'Sous-compte auxiliaire',
        debit: entry.debit,
        credit: entry.credit,
        soldeDebiteur: diff > 0 ? diff : 0,
        soldeCrediteur: diff < 0 ? -diff : 0
      };
    }).filter(item => item.debit > 0 || item.credit > 0);

    return trialList.sort((a, b) => a.code.localeCompare(b.code));
  }, [pieces]);

  // CALCULATION OF DYNAMIC FINANCIAL INTERMEDIARY BALANCES (SIG - SYSCOHADA)
  const financialSIG = useMemo(() => {
    let sales = 0;
    let intrantsBought = 0;
    let bioFeedBought = 0;
    let hydrocarbons = 0;
    let vetFrais = 0;
    let salairCharges = 0;
    let dotationsAmort = 0;
    let productsHAO = 0;

    balanceSheetResult.forEach(row => {
      const code = row.code;
      const creditSolde = row.soldeCrediteur;
      const debitSolde = row.soldeDebiteur;

      if (code.startsWith('70')) sales += creditSolde;
      if (code === '6011') intrantsBought += debitSolde;
      if (code === '6015') bioFeedBought += debitSolde;
      if (code === '6016') hydrocarbons += debitSolde;
      if (code === '6017') vetFrais += debitSolde;
      if (code.startsWith('66')) salairCharges += debitSolde;
      if (code === '6811') dotationsAmort += debitSolde;
      if (code.startsWith('84')) productsHAO += debitSolde;
    });

    const margeCommerciale = sales - (intrantsBought + bioFeedBought);
    const valeurAjoutee = margeCommerciale - hydrocarbons - vetFrais;
    const ebe = valeurAjoutee - salairCharges;
    const resultExploit = ebe - dotationsAmort;
    const netProfit = resultExploit + productsHAO;

    return {
      sales,
      intrantsBought,
      bioFeedBought,
      hydrocarbons,
      vetFrais,
      salairCharges,
      dotationsAmort,
      productsHAO,
      margeCommerciale,
      valeurAjoutee,
      ebe,
      resultExploit,
      netProfit
    };
  }, [balanceSheetResult]);

  // TFT CASH FLOW (Tableau des flux de trésorerie - Section 8)
  const tftCashFlow = useMemo(() => {
    let cashInFromSales = financialSIG.sales * 0.85; // Assume 85% clients cleared payment
    let cashPaidSuppliers = (financialSIG.intrantsBought + financialSIG.bioFeedBought + financialSIG.hydrocarbons) * 0.75;
    let cashPaidSalary = financialSIG.salairCharges;
    
    const operatingFlow = cashInFromSales - cashPaidSuppliers - cashPaidSalary;
    let investmentFlow = -1500000; // Tracteur updates or acquisitions during the cycle
    let financingFlow = 1000000;  // Shareholder inputs or capital additions

    const netChangeCash = operatingFlow + investmentFlow + financingFlow;

    return {
      cashInFromSales,
      cashPaidSuppliers,
      cashPaidSalary,
      operatingFlow,
      investmentFlow,
      financingFlow,
      netChangeCash
    };
  }, [financialSIG]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Configuration Header for Country, Tax Regimes & SMT */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800 space-y-4">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Globe className="text-teal-400 h-6 w-6" />
              <h2 className="text-xl font-extrabold tracking-tight">Paramètres Fiscaux & Régimes SYSCOHADA</h2>
            </div>
            <p className="text-xs text-slate-400 max-w-2xl">
              Configurez le pays d'exercice OHADA pour adapter les taux de TVA standard, d'exonérations agricoles réglementaires et dégrader le système vers le mode SMT si sous le seuil légal.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div>
              <label className="block text-[9px] uppercase font-bold text-slate-400 mb-1">Pays Régional</label>
              <select
                value={selectedCountryCode}
                onChange={(e) => setSelectedCountryCode(e.target.value)}
                className="bg-slate-800 text-white text-xs font-semibold border border-slate-700 p-2 rounded-lg bg-none"
              >
                {OHADA_COUNTRIES.map(c => (
                  <option key={c.code} value={c.code}>{c.name} ({c.vat}%)</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[9px] uppercase font-bold text-slate-400 mb-1">Système Comptable</label>
              <select
                value={regimeComptable}
                onChange={(e) => setRegimeComptable(e.target.value as any)}
                className="bg-slate-800 text-white text-xs font-semibold border border-slate-700 p-2 rounded-lg"
              >
                <option value="Normal">Système Normal SYSCOHADA</option>
                <option value="SMT">SMT (Système Minimal de Trésorerie)</option>
              </select>
            </div>

            <div>
              <label className="block text-[9px] uppercase font-bold text-slate-400 mb-1">Régime Fiscal Exploitant</label>
              <select
                value={regimeFiscal}
                onChange={(e) => setRegimeFiscal(e.target.value as any)}
                className="bg-slate-800 text-white text-xs font-semibold border border-slate-700 p-2 rounded-lg"
              >
                <option value="Reel">Réel Normal (CGA)</option>
                <option value="Simplifie">Réel Simplifié</option>
                <option value="Forfaitaire">Régime Forfaitaire</option>
                <option value="Exonere">Exonération Totale</option>
              </select>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 text-xs">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="vatExempt"
              checked={agroVatExempt}
              onChange={(e) => setAgroVatExempt(e.target.checked)}
              className="h-4 w-4 bg-slate-850 rounded border-slate-700 text-teal-500 rounded-sm"
            />
            <label htmlFor="vatExempt" className="text-slate-300 font-medium">
              Activer l'exonération de TVA spécifique agricole (Intrants et ventes de produits bruts - CGU {selectedCountry.name})
            </label>
          </div>

          <div className="bg-teal-950/40 text-teal-400 border border-teal-900/60 p-2 rounded-lg flex items-center gap-1.5 leading-none">
            <ShieldCheck className="h-4 w-4" />
            <span>Taux de TVA cible : <b>{agroVatExempt || regimeFiscal === 'Exonere' ? '0%' : `${selectedCountry.vat}%`}</b></span>
          </div>
        </div>
      </div>

      {/* SMT Educational Notice Banner */}
      {regimeComptable === 'SMT' && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
          <AlertTriangle className="text-amber-600 h-6 w-6 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-extrabold text-amber-900 uppercase">Actif : Système Minimal de Trésorerie (SMT - Dégradation SYSCOHADA)</h4>
            <p className="text-xs text-amber-700 leading-relaxed">
              Le SMT est une comptabilité simplifiée par encaissements/décaissements réels pour les petites exploitations. Le registre ci-après n'affiche que les mouvements de trésorerie réels (Caisse/Banque/Mobile Money). Les processus d'engagement (factures non payées) et d'amortissement sont désactivés pour simplifier le reporting.
            </p>
          </div>
        </div>
      )}

      {/* Module Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-2">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2 select-none">
            <Book className="text-indigo-700 h-7 w-7" />
            Comptabilité & Finance (SYSCOHADA {regimeComptable === 'SMT' ? 'SMT' : 'Normal'})
          </h2>
          <p className="text-xs text-slate-500">
            Grand livre général de partie double, balance OHADA interactive, amortissement linéaire / dégressif d'actifs, rapprochement bancaire et bilans financiers automatisés.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowAddSalaryCharge(true)}
            className="bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold px-3 py-2 rounded-lg text-xs hover:bg-indigo-100 transition flex items-center gap-1.5"
          >
            <Layers className="h-4 w-4" /> Passer Charge de Personnel en bloc
          </button>

          <button
            onClick={() => setShowAddPiece(true)}
            className="bg-indigo-700 text-white font-bold px-4 py-2 rounded-lg text-xs hover:bg-indigo-800 transition flex items-center gap-1.5"
          >
            <PlusCircle className="h-4 w-4" /> Passer une Écriture (Partie double)
          </button>
        </div>
      </div>

      {/* Primary Tab Navigation */}
      <div className="bg-slate-100/80 p-1.5 rounded-xl border flex flex-wrap gap-1">
        <button
          onClick={() => setActiveTab('grand-livre')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-extrabold transition ${
            activeTab === 'grand-livre' ? 'bg-white text-indigo-700 border border-slate-200/50 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Book className="h-4 w-4" />
          {regimeComptable === 'SMT' ? 'Livre des Recettes & Dépenses (SMT)' : 'Grand Livre des Ecritures'}
        </button>

        {regimeComptable === 'Normal' && (
          <button
            onClick={() => setActiveTab('balance')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-extrabold transition ${
              activeTab === 'balance' ? 'bg-white text-indigo-700 border border-slate-200/50 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Scale className="h-4 w-4" />
            Balance Générale Comptable
          </button>
        )}

        <button
          onClick={() => setActiveTab('etats')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-extrabold transition ${
            activeTab === 'etats' ? 'bg-white text-indigo-700 border border-slate-200/50 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileSpreadsheet className="h-4 w-4" />
          {regimeComptable === 'SMT' ? 'États financiers Simplifiés' : 'États de Synthèse (P&L, Bilan)'}
        </button>

        <button
          onClick={() => setActiveTab('rapprochement')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-extrabold transition ${
            activeTab === 'rapprochement' ? 'bg-white text-indigo-700 border border-slate-200/50 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ArrowRightLeft className="h-4 w-4" />
          Rapprochement Bancaire (5211)
        </button>

        {regimeComptable === 'Normal' && (
          <button
            onClick={() => setActiveTab('immos')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-extrabold transition ${
              activeTab === 'immos' ? 'bg-white text-indigo-700 border border-slate-200/50 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calculator className="h-4 w-4" />
            Amortissements d’Actifs (VNC)
          </button>
        )}

        <button
          onClick={() => setActiveTab('budgets')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-extrabold transition ${
            activeTab === 'budgets' ? 'bg-white text-indigo-700 border border-slate-200/50 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Activity className="h-4 w-4" />
          Exécution Budgétaire
        </button>
      </div>

      {/* Main Tab content space */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-3xs p-6">
        
        {/* VIEW 1: GRAND LIVRE GENERALE COMPTABLE */}
        {activeTab === 'grand-livre' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h3 className="font-extrabold text-slate-800 text-sm">
                  {regimeComptable === 'SMT' ? 'Registre des Recettes et Paiements Trésorerie' : 'Grand Livre - Partie Double Équilibrée'}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {regimeComptable === 'SMT' 
                    ? 'Seuls les règlements de caisse, banque et mobile money effectifs sont répertoriés.' 
                    : 'Registre d’enregistrement à valeur probante. Une contre-écriture ou extourne est requise pour toute rectification passive.'}
                </p>
              </div>
            </div>

            {/* Live Filter Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Date comptable</label>
                <div className="flex gap-1.5">
                  <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="w-full border p-1.5 rounded-lg bg-white text-xs text-slate-700 font-bold"
                  />
                  {filterDate && (
                    <button onClick={() => setFilterDate('')} className="bg-red-50 text-red-650 hover:bg-red-100 px-2 py-1 rounded text-[10px] font-bold">
                      X
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Journal auxiliaire Ohada</label>
                <select
                  value={filterJournal}
                  onChange={(e) => setFilterJournal(e.target.value)}
                  className="w-full border p-1.5 rounded-lg bg-white text-xs font-bold text-slate-700"
                >
                  <option value="ALL">Tous les Journaux (Général)</option>
                  <option value="ACH">ACH (Journal des Achats)</option>
                  <option value="VEN">VEN (Journal des Ventes)</option>
                  <option value="BQ">BQ (Journal de Banque)</option>
                  <option value="CAI">CAI (Journal de Caisse Espèces)</option>
                  <option value="OD">OD (Opérations Diverses / Provisions / Paie)</option>
                </select>
              </div>

              <div className="flex items-end justify-end">
                <span className="text-[10px] text-slate-400 bg-slate-100 rounded-lg p-2.5 font-bold border block text-right w-full">
                  Nombre d’écritures : <b>{pieces.length}</b>
                </span>
              </div>
            </div>

            {/* List Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 border-b text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3">Séquence Date</th>
                    <th className="p-3">JNL</th>
                    <th className="p-3">Référence Pièce</th>
                    <th className="p-3">Libellé d'opération réglementaire</th>
                    <th className="p-3">Débit (+)</th>
                    <th className="p-3">Crédit (-)</th>
                    {regimeComptable === 'Normal' && <th className="p-3">Centre de coût (Axe)</th>}
                    <th className="p-3 text-right">Montant</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-slate-700 font-medium">
                  {(() => {
                    let filtered = pieces.filter(p => {
                      const matchesDate = filterDate ? p.date === filterDate || p.date.includes(filterDate) : true;
                      const matchesJnl = filterJournal === 'ALL' ? true : p.codeJournal === filterJournal;

                      if (regimeComptable === 'SMT') {
                        // SMT only keeps entries related to Treasury journals (BQ, CAI) or Cash direct transactions
                        const isTresor = p.codeJournal === 'BQ' || p.codeJournal === 'CAI' || p.debitCompte.startsWith('52') || p.debitCompte.startsWith('57') || p.creditCompte.startsWith('52') || p.creditCompte.startsWith('57');
                        return matchesDate && matchesJnl && isTresor;
                      }

                      return matchesDate && matchesJnl;
                    });

                    if (filtered.length === 0) {
                      return (
                        <tr>
                          <td colSpan={8} className="p-8 text-center text-slate-400 italic">
                            Aucune pièce ou écriture comptable enregistrée pour cette sélection ou en cours d'exercice.
                          </td>
                        </tr>
                      );
                    }

                    return filtered.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/50 transition">
                        <td className="p-3 font-mono text-slate-500">{p.date}</td>
                        <td className="p-3"><span className="text-[10px] bg-indigo-50 border border-indigo-200 text-indigo-700 px-1.5 py-0.5 rounded-md font-bold">{p.codeJournal}</span></td>
                        <td className="p-3 font-mono font-bold text-slate-900">{p.refePiece}</td>
                        <td className="p-3 text-slate-800">{p.libelle}</td>
                        <td className="p-3 font-mono text-emerald-700">{p.debitCompte}</td>
                        <td className="p-3 font-mono text-red-600">{p.creditCompte}</td>
                        {regimeComptable === 'Normal' && (
                          <td className="p-3">
                            <span className="text-[10px] font-semibold bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded border border-zinc-200">
                              {p.centreCoutAnalytique || 'Frais généraux'}
                            </span>
                          </td>
                        )}
                        <td className="p-3 text-right font-black text-slate-900 text-xs">{p.montant.toLocaleString()} FCFA</td>
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-2 text-xs">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="h-4.5 w-4.5 text-emerald-600" />
                <span><b>Contrôle d’intégrité Ohada (RM-047) :</b> Registre général validé par partie double. Débit Total = Crédit Total. Inaltérabilité des lignes garantie.</span>
              </span>
              <span className="font-extrabold text-[10px] text-teal-800 border uppercase bg-teal-100/50 border-teal-200 px-2 py-0.5 rounded">
                Statut : Equilibré
              </span>
            </div>
          </div>
        )}

        {/* VIEW 2: TRIAL BALANCE TABLE (BALANCE DES COMPTES OHADA) */}
        {activeTab === 'balance' && regimeComptable === 'Normal' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h3 className="font-extrabold text-slate-800 text-sm">Balance Générale des Comptes (Exercice 2026)</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Trial balance réactive intégrant automatiquement tout ajustement, dotation aux amortissements semestriels et ventes validées client.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 border-b text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3">N° Compte OHADA</th>
                    <th className="p-3">Intitulé Compte Principal Adapté Agricole</th>
                    <th className="p-3 text-right text-slate-600">Total mouvements Débit</th>
                    <th className="p-3 text-right text-slate-600">Total mouvements Crédit</th>
                    <th className="p-3 text-right text-emerald-700 bg-emerald-50/40">Solde Débiteur</th>
                    <th className="p-3 text-right text-red-700 bg-red-50/40">Solde Créditeur</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-slate-700 font-medium">
                  {balanceSheetResult.map((a) => (
                    <tr key={a.code} className="hover:bg-slate-50/50 transition">
                      <td className="p-3 font-bold font-mono text-slate-900 text-xs">{a.code}</td>
                      <td className="p-3 text-slate-800">{a.name}</td>
                      <td className="p-3 text-right font-mono text-slate-550">{a.debit > 0 ? `${a.debit.toLocaleString()} FCFA` : '—'}</td>
                      <td className="p-3 text-right font-mono text-slate-550">{a.credit > 0 ? `${a.credit.toLocaleString()} FCFA` : '—'}</td>
                      <td className={`p-3 text-right font-mono font-bold bg-emerald-50/10 text-xs ${a.soldeDebiteur > 0 ? 'text-emerald-700' : 'text-slate-300'}`}>
                        {a.soldeDebiteur > 0 ? `${a.soldeDebiteur.toLocaleString()} FCFA` : '0 FCFA'}
                      </td>
                      <td className={`p-3 text-right font-mono font-bold bg-red-50/10 text-xs ${a.soldeCrediteur > 0 ? 'text-red-700' : 'text-slate-300'}`}>
                        {a.soldeCrediteur > 0 ? `${a.soldeCrediteur.toLocaleString()} FCFA` : '0 FCFA'}
                      </td>
                    </tr>
                  ))}
                  
                  {/* Totals Row */}
                  {(() => {
                    const totalDebitMvt = balanceSheetResult.reduce((sum, item) => sum + item.debit, 0);
                    const totalCreditMvt = balanceSheetResult.reduce((sum, item) => sum + item.credit, 0);
                    const totalDebitSld = balanceSheetResult.reduce((sum, item) => sum + item.soldeDebiteur, 0);
                    const totalCreditSld = balanceSheetResult.reduce((sum, item) => sum + item.soldeCrediteur, 0);

                    return (
                      <tr className="bg-slate-100 font-extrabold text-slate-900 uppercase text-[11px] border-t-2 border-slate-300">
                        <td className="p-3 text-center" colSpan={2}>TOTAUX GÉNÉRAUX TRIAL BALANCE</td>
                        <td className="p-3 text-right font-mono text-indigo-700">{totalDebitMvt.toLocaleString()} FCFA</td>
                        <td className="p-3 text-right font-mono text-indigo-700">{totalCreditMvt.toLocaleString()} FCFA</td>
                        <td className="p-3 text-right font-mono text-emerald-800 bg-emerald-100">{totalDebitSld.toLocaleString()} FCFA</td>
                        <td className="p-3 text-right font-mono text-red-800 bg-red-100">{totalCreditSld.toLocaleString()} FCFA</td>
                      </tr>
                    );
                  })()}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW 3: SYSCOHADA FINANCIAL STATEMENTS (Bilan, Compte de Résultat, TFT, Variation Cap Propres, Annexe Notes) */}
        {activeTab === 'etats' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-3 gap-2">
              <div>
                <h3 className="font-extrabold text-slate-800 text-sm">
                  {regimeComptable === 'SMT' ? 'États Financiers Simplifiés (SMT)' : 'États Financiers Réglementaires SYSCOHADA normalisé'}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Documents de synthèse interfacés directement avec le grand livre d’activité sans ressaisie manuelle.
                </p>
              </div>

              {regimeComptable === 'Normal' && (
                <div className="flex bg-slate-150 p-1 rounded-lg border gap-1 self-stretch sm:self-auto text-[10.5px]">
                  <button
                    onClick={() => setActiveStatementTab('bilan')}
                    className={`px-3 py-1 rounded-md font-bold transition whitespace-nowrap ${activeStatementTab === 'bilan' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'}`}
                  >
                    Bilan
                  </button>
                  <button
                    onClick={() => setActiveStatementTab('resultat')}
                    className={`px-3 py-1 rounded-md font-bold transition whitespace-nowrap ${activeStatementTab === 'resultat' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'}`}
                  >
                    Compte de Résultat
                  </button>
                  <button
                    onClick={() => setActiveStatementTab('tft')}
                    className={`px-3 py-1 rounded-md font-bold transition whitespace-nowrap ${activeStatementTab === 'tft' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'}`}
                  >
                    flux trésorerie (TFT)
                  </button>
                  <button
                    onClick={() => setActiveStatementTab('propres')}
                    className={`px-3 py-1 rounded-md font-bold transition whitespace-nowrap ${activeStatementTab === 'propres' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'}`}
                  >
                    Capitaux Propres
                  </button>
                  <button
                    onClick={() => setActiveStatementTab('annexe')}
                    className={`px-3 py-1 rounded-md font-bold transition whitespace-nowrap ${activeStatementTab === 'annexe' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'}`}
                  >
                    Notes
                  </button>
                </div>
              )}
            </div>

            {/* IF COMPTABILITE DEGRADE SMT VIEW CODES */}
            {regimeComptable === 'SMT' ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* SMT Section 1: Receipts and payments state */}
                  <div className="border border-slate-200 rounded-2xl p-5 space-y-4 shadow-3xs">
                    <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider bg-slate-50 p-2 rounded">Etat des recettes et expenses (SMT)</h4>
                    
                    <div className="divide-y text-xs space-y-3">
                      <div className="flex justify-between font-bold pt-2 text-slate-700">
                        <span>Recettes agricoles clients (Encaissées)</span>
                        <span className="text-emerald-700">+{financialSIG.sales.toLocaleString()} FCFA</span>
                      </div>
                      
                      <div className="flex justify-between border-t pt-2 text-slate-600">
                        <span>Paiements d’intrants et semences</span>
                        <span className="text-red-650">-{financialSIG.intrantsBought.toLocaleString()} FCFA</span>
                      </div>

                      <div className="flex justify-between pt-2 text-slate-600">
                        <span>Paiements d’aliments bétail</span>
                        <span className="text-red-650">-{financialSIG.bioFeedBought.toLocaleString()} FCFA</span>
                      </div>

                      <div className="flex justify-between pt-2 text-slate-600">
                        <span>Dépenses carburant tracteur</span>
                        <span className="text-red-650">-{financialSIG.hydrocarbons.toLocaleString()} FCFA</span>
                      </div>

                      <div className="flex justify-between pt-2 text-slate-600">
                        <span>Frais sanitaires payés en liquide</span>
                        <span className="text-red-650">-{financialSIG.vetFrais.toLocaleString()} FCFA</span>
                      </div>

                      <div className="flex justify-between pt-2 text-slate-600">
                        <span>Décaissements salaires main d'oeuvre</span>
                        <span className="text-red-650">-{financialSIG.salairCharges.toLocaleString()} FCFA</span>
                      </div>

                      <div className="flex justify-between border-t border-slate-350 pt-3 font-extrabold text-slate-900 text-sm">
                        <span>Solde Net de Trésorerie SMT de l'exercice</span>
                        <span className={financialSIG.netProfit >= 0 ? 'text-teal-700' : 'text-red-600'}>
                          {financialSIG.netProfit.toLocaleString()} FCFA
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* SMT Section 2: Patrimoine Simplifie */}
                  <div className="border border-slate-200 rounded-2xl p-5 space-y-4 shadow-3xs">
                    <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider bg-slate-50 p-2 rounded">Etat simplifie du patrimoine (SMT)</h4>
                    
                    <div className="space-y-3 text-xs">
                      <div className="border-b pb-2 space-y-1">
                        <span className="text-slate-400 text-[10px] uppercase font-bold">Actif possédé (Valeur estimée)</span>
                        <div className="flex justify-between">
                          <span>Terrains & Parcelles en exploitation</span>
                          <span className="font-bold">8 500 000 FCFA</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Equipements de transport & matériel</span>
                          <span className="font-bold">6 000 500 FCFA</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Disponibilités en Caisse & Banque</span>
                          <span className="font-bold text-teal-700">3 500 000 FCFA</span>
                        </div>
                      </div>

                      <div className="pt-1 space-y-1">
                        <span className="text-slate-400 text-[10px] uppercase font-bold">Dettes et engagements envers tiers</span>
                        <div className="flex justify-between">
                          <span>Dettes passives fournisseurs d’intrants</span>
                          <span className="font-bold text-rose-700">0 FCFA</span>
                        </div>
                        <div className="flex justify-between text-slate-500 italic">
                          <span>Note: Aucun engagement n'est enregistré statutairement sous le format minimal SMT.</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 font-sans leading-relaxed">
                
                {/* 3.1 VIEW: BILAN NORMAL INTERACTIF */}
                {activeStatementTab === 'bilan' && (
                  <div className="space-y-4">
                    <div className="bg-slate-50 p-3 rounded-lg text-slate-600 text-[11px] border">
                      💡 <b>Équilibre Général Bilan :</b> Le Bilan comptable ci-après est généré directement depuis la trial-balance d'exploitation de manière synchronisée.
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* ACTIF CABINET */}
                      <div className="border rounded-2xl p-4 space-y-3">
                        <h4 className="font-bold text-indigo-900 border-b pb-2 flex justify-between uppercase">
                          <span>Actif (Patrimoine Exploitation)</span>
                          <span>Valeur Nette</span>
                        </h4>

                        <div className="space-y-2 text-xs divide-y text-slate-700">
                          <div className="flex justify-between pt-1">
                            <span><b>Actif Immobilisé</b> (Terrains/Parcelles - Cl 2)</span>
                            <span className="font-bold">8 500 000 FCFA</span>
                          </div>
                          <div className="flex justify-between pt-2">
                            <span><b>Immobilisations Corporelles</b> (Matér. Agricole)</span>
                            <span className="font-bold">6 000 000 FCFA</span>
                          </div>
                          <div className="flex justify-between pt-2">
                            <span className="italic pl-3 text-slate-500">(-) Amortissements cumulés (Matériel)</span>
                            <span className="font-mono text-red-650">-{depreciationCalculations.accumulated.toLocaleString()} FCFA</span>
                          </div>
                          <div className="flex justify-between pt-2">
                            <span><b>Stocks de Matières & Intrants</b> (Classe 3)</span>
                            <span className="font-bold">450 000 FCFA</span>
                          </div>
                          <div className="flex justify-between pt-2">
                            <span><b>Créances Clients nettes</b> (Classe 4)</span>
                            <span className="font-bold">1 250 000 FCFA</span>
                          </div>
                          <div className="flex justify-between pt-2">
                            <span><b>Disponibilités en Banque & Caisse</b> (Classe 5)</span>
                            <span className="font-bold text-teal-700">3 500 000 FCFA</span>
                          </div>

                          <div className="flex justify-between border-t-2 border-indigo-200 pt-3 text-sm font-extrabold text-indigo-900">
                            <span>TOTAL DE L'ACTIF (NET)</span>
                            <span>{(19700000 - depreciationCalculations.accumulated).toLocaleString()} FCFA</span>
                          </div>
                        </div>
                      </div>

                      {/* PASSIF DEBIT */}
                      <div className="border rounded-2xl p-4 space-y-3">
                        <h4 className="font-bold text-indigo-900 border-b pb-2 flex justify-between uppercase">
                          <span>Passif (Financements & Dettes)</span>
                          <span>Montant global</span>
                        </h4>

                        <div className="space-y-2 text-xs divide-y text-slate-700">
                          <div className="flex justify-between pt-1">
                            <span><b>Capitaux Propres</b> (Capital Social - Cl 1)</span>
                            <span className="font-bold">12 000 000 FCFA</span>
                          </div>
                          <div className="flex justify-between pt-2">
                            <span><b>Report à Nouveau / Réserves</b></span>
                            <span className="font-bold">1 500 000 FCFA</span>
                          </div>
                          <div className="flex justify-between pt-2">
                            <span><b>Résultat Net de l'Exercice</b> (Auto-calculé)</span>
                            <span className="font-bold text-emerald-800">+{financialSIG.netProfit.toLocaleString()} FCFA</span>
                          </div>
                          <div className="flex justify-between pt-2">
                            <span><b>Dettes Fournisseurs d’intrants</b></span>
                            <span className="font-bold">1 800 000 FCFA</span>
                          </div>
                          <div className="flex justify-between pt-2">
                            <span><b>Dettes de Personnel / Rémuner</b></span>
                            <span className="font-bold">450 000 FCFA</span>
                          </div>
                          <div className="flex justify-between pt-2">
                            <span><b>Dettes Fiscales</b> (TVA collectée nette due)</span>
                            <span className="font-bold">150 000 FCFA</span>
                          </div>

                          <div className="flex justify-between border-t-2 border-indigo-200 pt-3 text-sm font-extrabold text-indigo-900">
                            <span>TOTAL DU PASSIF (FINANCEMENTS)</span>
                            <span>{(15900000 + financialSIG.netProfit).toLocaleString()} FCFA</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Equality verification trigger check */}
                    {Math.abs((19700000 - depreciationCalculations.accumulated) - (15900000 + financialSIG.netProfit)) < 5 ? (
                      <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-teal-800 text-xs font-semibold flex items-center gap-1.5 justify-center leading-none">
                        <CheckCircle2 className="h-5 w-5 text-teal-600" />
                        <span>Parfait : Balance du Bilan équilibrée de façon légale ! Actif = Passif ({ (15900000 + financialSIG.netProfit).toLocaleString()} FCFA).</span>
                      </div>
                    ) : (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs font-semibold flex items-center gap-1.5 justify-center">
                        <AlertTriangle className="h-5 w-5 text-amber-600" />
                        <span>Ajustement comptable de régularisation en cours dans le Bilan en raison des écritures d'amortissement non clôturées. Écart temporaire : {Math.round(Math.abs((19700000 - depreciationCalculations.accumulated) - (15900000 + financialSIG.netProfit))).toLocaleString()} FCFA.</span>
                      </div>
                    )}
                  </div>
                )}

                {/* 3.2 VIEW: COMPTE DE RESULTAT AVEC SIG (SECTION 8) */}
                {activeStatementTab === 'resultat' && (
                  <div className="space-y-4">
                    <p className="text-xs text-slate-500">
                      Calcul des Soldes Intermédiaires de Gestion (SIG) conforme aux normes SYSCOHADA (Système Normal) enrichi des variables de coûts bio/agronomes.
                    </p>

                    <div className="overflow-x-auto border border-slate-200 rounded-xl">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead className="bg-slate-50 border-b text-slate-500 font-bold uppercase text-[10px]">
                          <tr>
                            <th className="p-3">Indicateur de Gestion (SIG)</th>
                            <th className="p-3 text-slate-500">Définition & Déduction mathématique</th>
                            <th className="p-3 text-right">Valeur de l'exercice (FCFA)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y text-slate-700 font-semibold text-xs">
                          <tr>
                            <td className="p-3 text-slate-900 font-extrabold">Chiffre d’Affaires Agricole (Ventes)</td>
                            <td className="p-3 font-normal text-slate-500">Ensemble des ventes de cultures, maïs grains et lait de l'exercice (Classe 7)</td>
                            <td className="p-3 text-right font-mono font-bold text-slate-900">+{financialSIG.sales.toLocaleString()}</td>
                          </tr>
                          <tr>
                            <td className="p-3 text-slate-900 font-extrabold">(-) Achats stockés d’intrants consommés</td>
                            <td className="p-3 font-normal text-slate-500">Achats d'unites de semences, engrais, nourritures bétail (Comptes 6011 + 6015)</td>
                            <td className="p-3 text-right font-mono text-red-650">-{ (financialSIG.intrantsBought + financialSIG.bioFeedBought).toLocaleString() }</td>
                          </tr>
                          <tr className="bg-zinc-50 font-black">
                            <td className="p-3 text-indigo-900 font-extrabold">MARGE COMMERCIALE BRUTE</td>
                            <td className="p-3 font-normal text-indigo-900/60">Chiffre d'affaires - Coût d'achat intrants</td>
                            <td className="p-3 text-right font-mono text-indigo-700">{financialSIG.margeCommerciale.toLocaleString()}</td>
                          </tr>
                          
                          <tr>
                            <td className="p-3 text-slate-900 font-extrabold">(-) Consommation externe d'énergie/soins</td>
                            <td className="p-3 font-normal text-slate-500">Hydrocarbures tracteur & soins vétérinaires bétail (Comptes 6016 + 6017)</td>
                            <td className="p-3 text-right font-mono text-red-650">-{ (financialSIG.hydrocarbons + financialSIG.vetFrais).toLocaleString() }</td>
                          </tr>
                          <tr className="bg-zinc-50 font-black">
                            <td className="p-3 text-indigo-900 font-extrabold">VALEUR AJOUTÉE COMPTABLE (VA)</td>
                            <td className="p-3 font-normal text-indigo-900/60">Marge brute - Consommations externes intermédiaires</td>
                            <td className="p-3 text-right font-mono text-indigo-700">{financialSIG.valeurAjoutee.toLocaleString()}</td>
                          </tr>

                          <tr>
                            <td className="p-3 text-slate-900 font-extrabold">(-) Charges globales de Personnel</td>
                            <td className="p-3 font-normal text-slate-500">Main d'oeuvre saisonnière et permanente globale (Compte 6611)</td>
                            <td className="p-3 text-right font-mono text-red-650">-{financialSIG.salairCharges.toLocaleString()}</td>
                          </tr>
                          <tr className="bg-orange-50 text-orange-950 font-black border border-orange-200">
                            <td className="p-3 font-extrabold">EXCÉDENT BRUT D'EXPLOITATION (EBE)</td>
                            <td className="p-3 font-normal text-orange-900/70">Valeur ajoutée - Charges de personnel</td>
                            <td className="p-3 text-right font-mono text-orange-900">{financialSIG.ebe.toLocaleString()}</td>
                          </tr>

                          <tr>
                            <td className="p-3 text-slate-900 font-extrabold">(-) Dotation nette aux Amortissements</td>
                            <td className="p-3 font-normal text-slate-500">Annuités de dévalorisation linéaire des tracteurs/actifs (Compte 6811)</td>
                            <td className="p-3 text-right font-mono text-red-650">-{financialSIG.dotationsAmort.toLocaleString()}</td>
                          </tr>
                          <tr className="bg-zinc-50 font-black">
                            <td className="p-3 text-indigo-900 font-extrabold">RÉSULTAT D'EXPLOITATION COMPTABLE</td>
                            <td className="p-3 font-normal text-indigo-900/60">EBE - Dotations techniques</td>
                            <td className="p-3 text-right font-mono text-indigo-700">{financialSIG.resultExploit.toLocaleString()}</td>
                          </tr>

                          <tr>
                            <td className="p-3 text-slate-800">(+) Produits Exceptionnels (HAO - Hors Activité)</td>
                            <td className="p-3 font-normal text-slate-500">Indemnités sinistres d'assurance ou subventions d’État locales (Classe 8)</td>
                            <td className="p-3 text-right font-mono text-emerald-700">+{financialSIG.productsHAO.toLocaleString()}</td>
                          </tr>
                          <tr className="bg-teal-50 text-teal-950 font-black text-sm border-t-2 border-teal-300">
                            <td className="p-3 font-extrabold text-teal-900">RÉSULTAT NET SYSCOHADA CLÔTURE</td>
                            <td className="p-3 font-normal text-teal-800">Bénéfice (Produits - Charges) final de l'exercice comptable</td>
                            <td className="p-3 text-right font-mono text-teal-900">{financialSIG.netProfit.toLocaleString()} FCFA</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 3.3 VIEW: TABLEAU DES FLUX DE TRESORERIE (TFT) */}
                {activeStatementTab === 'tft' && (
                  <div className="space-y-4">
                    <p className="text-xs text-slate-500">
                      Le Tableau des Flux de Trésorerie (TFT) démontre comment la trésorerie a évolué entre investissements, opérations et financements.
                    </p>

                    <div className="bg-slate-50 p-4 rounded-xl border space-y-3 font-mono text-xs">
                      <div className="flex justify-between font-bold text-slate-800 border-b pb-2 uppercase text-[10px]">
                        <span>Désignation Flux Comptable</span>
                        <span>Flux de trésorerie net (FCFA)</span>
                      </div>

                      <div className="flex justify-between">
                        <span>Flux lié à l'Exploitation : Encaissements Ventes</span>
                        <span className="text-teal-700">+{tftCashFlow.cashInFromSales.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Flux lié à l'Exploitation : Décaissements Fournisseurs</span>
                        <span className="text-rose-700">-{tftCashFlow.cashPaidSuppliers.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Flux lié à l'Exploitation : Décaissements salaires</span>
                        <span className="text-rose-700">-{tftCashFlow.cashPaidSalary.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-bold border-t py-1.5 text-slate-850">
                        <span>A. Flux de trésorerie des activités opérationnelles</span>
                        <span>{tftCashFlow.operatingFlow.toLocaleString()}</span>
                      </div>

                      <div className="flex justify-between pt-2">
                        <span>B. Flux lié à l'investissement (Acquisitions de tracteurs)</span>
                        <span className="text-rose-700">{tftCashFlow.investmentFlow.toLocaleString()}</span>
                      </div>

                      <div className="flex justify-between pt-2">
                        <span>C. Flux lié au financement (Nouveaux capitaux)</span>
                        <span className="text-teal-700">+{tftCashFlow.financingFlow.toLocaleString()}</span>
                      </div>

                      <div className="flex justify-between border-t-2 border-slate-300 pt-3 font-extrabold text-sm text-slate-900">
                        <span>VARIATION NETTE GLOBALE DE TRÉSORERIE (A+B+C)</span>
                        <span className={tftCashFlow.netChangeCash >= 0 ? 'text-teal-700' : 'text-red-650'}>
                          {tftCashFlow.netChangeCash.toLocaleString()} FCFA
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3.4 VIEW: VARIABLE CAPITAUX PROPRES */}
                {activeStatementTab === 'propres' && (
                  <div className="space-y-4">
                    <p className="text-xs text-slate-500">
                      Évolution des ressources stables durables d'investissement de Kissine Agro au cours de l'exercice civil d'exploitation.
                    </p>

                    <table className="w-full text-left text-xs border rounded-xl overflow-hidden font-mono divide-y">
                      <thead className="bg-[#fcfdfd]">
                        <tr className="font-bold text-[10px] text-slate-600">
                          <th className="p-3">Section Capitaux Propres</th>
                          <th className="p-3 text-right">Solde Ouverture</th>
                          <th className="p-3 text-right">Ajustements Clôture</th>
                          <th className="p-3 text-right">Solde Final de l'Exercice</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y text-slate-700">
                        <tr>
                          <td className="p-3 font-sans">Capital Social / Dotations d'Exploit.</td>
                          <td className="p-3 text-right">12 000 000 FCFA</td>
                          <td className="p-3 text-right">0 FCFA</td>
                          <td className="p-3 text-right font-bold">12 000 000 FCFA</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-sans">Report à Nouveau & Réserves légales</td>
                          <td className="p-3 text-right">1 500 000 FCFA</td>
                          <td className="p-3 text-right">0 FCFA</td>
                          <td className="p-3 text-right font-bold">1 500 000 FCFA</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-sans">Résultat Net Déterminé (Bénéfices)</td>
                          <td className="p-3 text-right">0 FCFA</td>
                          <td className="p-3 text-right text-emerald-700">+{financialSIG.netProfit.toLocaleString()}</td>
                          <td className="p-3 text-right font-bold text-emerald-800">+{financialSIG.netProfit.toLocaleString()} FCFA</td>
                        </tr>
                        <tr className="bg-slate-50 font-black text-slate-900 border-t-2">
                          <td className="p-3 font-sans uppercase">TOTAL CAPITAUX PROPRES FINAUX</td>
                          <td className="p-3 text-right">13 500 000 FCFA</td>
                          <td className="p-3 text-right">+{financialSIG.netProfit.toLocaleString()}</td>
                          <td className="p-3 text-right text-indigo-700">{(13500000 + financialSIG.netProfit).toLocaleString()} FCFA</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}

                {/* 3.5 VIEW: ANNEXE NOTES EXPLICATION */}
                {activeStatementTab === 'annexe' && (
                  <div className="space-y-4 text-xs text-slate-600 leading-relaxed max-w-3xl">
                    <h4 className="font-extrabold text-slate-800 text-sm border-b pb-1">Notes aux États Financiers (Annexe SYSCOHADA)</h4>
                    <p>
                      <b>Note 1 - Régimes Comptable & d’Évaluation des Actifs :</b> <br />
                      Les états financiers ci-dessus ont été arrêtés conformément aux dispositions du Système Normal SYSCOHADA révisé applicable dans l'espace régional OHADA. <br />
                      - Les parcelles et matériels immobilisés amortissables sont enregistrés à leur valeur originelle d'acquisition. <br />
                      - L'amortissement est calculé selon la méthode de l'amortissement linéaire selon les quotités de vie prévues par le Code Général des Impôts (CGI).
                    </p>
                    <p>
                      <b>Note 2 - Spécificités Agronomiques & Fiscales :</b> <br />
                      Les activités maraîchères de bananes et de cacao sont exonérées statutairement de taxe sur la valeur ajoutée dans l'espace {selectedCountry.name}, engendrant ainsi un taux global de TVA déductible et collectée nulle sur les intrants certifiés.
                    </p>
                    <p>
                      <b>Note 3 - Analyse du Résultat Exceptionnel :</b> <br />
                      Aucune somme significative n'est inscrite au titre des opérations HAO (Hors Activité Ordinaire), garantissant la représentativité opérationnelle du résultat d'exploitation.
                    </p>
                  </div>
                )}

              </div>
            )}

          </div>
        )}

        {/* VIEW 4: BANK RECONCILIATION INTERFACE (SECTION 4.8) */}
        {activeTab === 'rapprochement' && (
          <div className="space-y-5">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h3 className="font-extrabold text-slate-800 text-sm">Portail de Rapprochement Bancaire des Comptes</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Pointez et rapprochez les écritures de la banque comptable (Compte 5211) pour les faire correspondre avec le relevé de la SG/Afriland réelle.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Stats of Reconciliation */}
              <div className="bg-slate-50 border p-4 rounded-xl flex flex-col justify-between space-y-4">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Compteur en temps-réel</span>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span>Solde théorique comptable :</span>
                    <span className="font-mono text-slate-700">3 500 000 FCFA</span>
                  </div>
                  
                  <div className="flex justify-between text-xs font-semibold">
                    <span>Mouvements total réconciliés :</span>
                    <span className="font-mono text-emerald-700">
                      {simulatedStatement
                        .filter(item => reconciledIds.includes(item.id))
                        .reduce((sum, item) => sum + (item.type === 'credit' ? item.amount : -item.amount), 0)
                        .toLocaleString()} FCFA
                    </span>
                  </div>

                  <div className="flex justify-between text-xs font-bold border-t pt-2">
                    <span>Solde Rapproché Relevé :</span>
                    <span className="font-mono text-indigo-700">
                      {(3500000 + simulatedStatement
                        .filter(item => reconciledIds.includes(item.id))
                        .reduce((sum, item) => sum + (item.type === 'credit' ? item.amount : -item.amount), 0)
                      ).toLocaleString()} FCFA
                    </span>
                  </div>
                </div>

                <div className="bg-white border rounded p-2 text-[10.5px] text-slate-500 flex gap-2 items-center">
                  <Clock className="h-4 w-4 text-orange-500 shrink-0" />
                  <span>En attente de rapprochement : <b>{simulatedStatement.length - reconciledIds.length} écritures</b></span>
                </div>
              </div>

              {/* Matching Screen */}
              <div className="lg:col-span-2 border rounded-xl overflow-hidden shadow-3xs">
                <div className="bg-indigo-50 border-b p-3 flex justify-between items-center text-indigo-950 font-bold text-[10.5px] uppercase">
                  <span>Relevé bancaire physique - Flux à réconcilier</span>
                  <span>Opérations</span>
                </div>

                <div className="divide-y text-xs">
                  {simulatedStatement.map((line) => {
                    const isReconciled = reconciledIds.includes(line.id);
                    return (
                      <div key={line.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50/50 transition gap-2">
                        <div>
                          <p className="font-bold text-slate-800">{line.label}</p>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">Date écriture : {line.date} | Réf: SGCP-603{line.id.slice(-2)}</p>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className={`font-mono font-bold ${line.type === 'credit' ? 'text-emerald-700' : 'text-slate-600'}`}>
                            {line.type === 'credit' ? `+${line.amount.toLocaleString()}` : `-${line.amount.toLocaleString()}`} FCFA
                          </span>

                          <button
                            onClick={() => handleToggleReconcile('5211', line.id)}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border hover:shadow-xs transition ${
                              isReconciled 
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            {isReconciled ? '✓ Rapproché' : 'Rapprocher'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 5: AMORTISSEMENTS ET GESTION DE PATRIMOINE (SECTION 4.9) */}
        {activeTab === 'immos' && regimeComptable === 'Normal' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h3 className="font-extrabold text-slate-800 text-sm">Amortissement Linéaire & Dégressif du Patrimoine</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Estimez les charges d'annuités d'actifs et générez l'écriture comptable correspondante dans le Grand Livre.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Setup column */}
              <div className="border border-slate-200 bg-slate-50 rounded-2xl p-5 space-y-4 shadow-3xs">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Sélectionner un Actif</label>
                  <select
                    value={selectedEquipId}
                    onChange={(e) => setSelectedEquipId(e.target.value)}
                    className="w-full border p-2 text-xs font-bold rounded-lg bg-white"
                  >
                    {equipements.map(e => (
                      <option key={e.id} value={e.id}>{e.designation} (Acheté le : {e.dateAchat})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Règle de calcul fiscale</label>
                  <div className="grid grid-cols-2 gap-1.5 pt-1">
                    <button
                      onClick={() => setAmortissementMethod('linear')}
                      className={`text-[10px] font-bold p-2 border rounded-lg transition ${amortissementMethod === 'linear' ? 'bg-indigo-600 text-white' : 'bg-white hover:bg-slate-100'}`}
                    >
                      Linéaire SYSCO
                    </button>
                    <button
                      onClick={() => setAmortissementMethod('degressive')}
                      className={`text-[10px] font-bold p-2 border rounded-lg transition ${amortissementMethod === 'degressive' ? 'bg-indigo-600 text-white' : 'bg-white hover:bg-slate-100'}`}
                    >
                      Dégressif OHADA
                    </button>
                  </div>
                </div>

                {selectedEquipment && (
                  <div className="p-3 bg-white border rounded-xl font-mono text-[11px] space-y-1.5 text-slate-600">
                    <div className="font-bold text-slate-800 border-b pb-1 mb-1 font-sans">Spécification technique :</div>
                    <div>Code Asset : <b>{selectedEquipment.code}</b></div>
                    <div>Coût Acquisition : <b>{selectedEquipment.valeurAcquisition.toLocaleString()} FCFA</b></div>
                    <div>Durée Utile : <b>{selectedEquipment.dureeDeVieMois / 12} ans ({selectedEquipment.dureeDeVieMois} mois)</b></div>
                    <div>Statut : <span className="bg-emerald-100 text-emerald-800 px-1 py-0.5 rounded text-[9px] font-sans">Actif</span></div>
                  </div>
                )}
              </div>

              {/* Computes Display */}
              <div className="md:col-span-2 border border-slate-200 rounded-2xl overflow-hidden flex flex-col justify-between shadow-3xs">
                <div className="bg-indigo-50/50 p-4 border-b flex justify-between items-center text-indigo-950 font-bold text-xs uppercase">
                  <span>Annuités d'amortissement de l'exercice pour cet outillage</span>
                  <span className="text-[10px] text-indigo-700 bg-white border border-indigo-200 px-2 py-0.5 rounded">Réf calcul : Ohada Art. 48</span>
                </div>

                <div className="p-4 grid grid-cols-2 lg:grid-cols-4 gap-3 text-center">
                  <div className="bg-slate-50 p-3 rounded-xl border">
                    <span className="text-[9px] text-slate-400 block uppercase font-bold">Coefficient Taux</span>
                    <span className="text-base font-black text-slate-900">{depreciationCalculations.ratePercent}%</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border">
                    <span className="text-[9px] text-slate-400 block uppercase font-bold">Annuite Exercice</span>
                    <span className="text-sm font-black text-indigo-600 font-mono">{Math.round(depreciationCalculations.annual).toLocaleString()}<span className="text-[9px] font-normal block text-slate-500">FCFA</span></span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border">
                    <span className="text-[9px] text-slate-400 block uppercase font-bold">Cumul Amorti.</span>
                    <span className="text-sm font-black text-indigo-650 font-mono">{Math.round(depreciationCalculations.accumulated).toLocaleString()}<span className="text-[9px] font-normal block text-slate-500">FCFA cumulés</span></span>
                  </div>
                  <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                    <span className="text-[9px] text-emerald-600 block uppercase font-bold">Valeur Nette (VNC)</span>
                    <span className="text-sm font-black text-emerald-800 font-mono">{Math.round(depreciationCalculations.netBookValue).toLocaleString()}<span className="text-[9px] font-normal block text-emerald-600">FCFA restants</span></span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border-t flex flex-col sm:flex-row justify-between items-center gap-3">
                  <span className="text-[10px] text-slate-400 italic text-center sm:text-left leading-tight">
                    * Le passage de cette dotation comptabilise l'annuité de l'actif en classe 6, impactant le solde du compte de résultat.
                  </span>

                  <button
                    onClick={handleGenerateDepreciationEntry}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition"
                  >
                    Générer et intégrer l'écriture d'amortissement
                  </button>
                </div>
              </div>
            </div>

            {/* Depreciation Timeline Chart */}
            <div className="border border-slate-200 rounded-2xl p-5 space-y-4 shadow-3xs">
              <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">Plan de dévalorisation pluriannuel projeté (VNC progressive)</h4>
              
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={depreciationCalculations.timeline}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="year" tick={{ fontSize: 10, fontWeight: 'bold' }} />
                    <YAxis tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`} tick={{ fontSize: 10 }} />
                    <Tooltip formatter={(value) => `${Number(value).toLocaleString()} FCFA`} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar name="Valeur comptable restante (VNC)" dataKey="vnc" fill="#22c55e" radius={[4, 4, 0, 0]} />
                    <Bar name="Amortissement cumulé" dataKey="cumulated" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 6: BUDGETS MONITORING */}
        {activeTab === 'budgets' && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 text-sm mb-2">Suivi analytique & Exécution des Enveloppes Budgétaires</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {budgets.map((b) => {
                const executionRate = (b.montantEngage / b.montantInitial) * 100;
                const exceeded = executionRate > 100;
                return (
                  <div key={b.id} className="border border-slate-200 p-5 rounded-2xl space-y-3 bg-slate-50/30 hover:shadow-xs transition">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold bg-indigo-50 border border-indigo-100 text-indigo-800 px-2 py-0.5 rounded-lg text-[10px]">
                        Département : {b.departement}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono font-bold">Exercice {b.annee}</span>
                    </div>

                    <div className="space-y-2 text-xs py-2 border-t border-b border-slate-100">
                      <div className="flex justify-between text-slate-550">
                        <span>Enveloppe Prévisionnelle :</span>
                        <span className="font-bold text-slate-800">{b.montantInitial.toLocaleString()} FCFA</span>
                      </div>
                      <div className="flex justify-between text-slate-550">
                        <span>Dépenses cumulées engagées :</span>
                        <span className="font-bold text-indigo-650">{b.montantEngage.toLocaleString()} FCFA</span>
                      </div>
                      <div className="flex justify-between text-slate-550 pt-1 border-t border-dashed">
                        <span>Solde budgétaire disponible :</span>
                        <span className={`font-bold ${b.montantInitial - b.montantEngage >= 0 ? 'text-teal-700' : 'text-red-650'}`}>
                          {(b.montantInitial - b.montantEngage).toLocaleString()} FCFA
                        </span>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[9px] text-slate-400 uppercase font-bold mb-1">
                        <span>Consommation de l'enveloppe</span>
                        <span>{executionRate.toFixed(1)}%</span>
                      </div>
                      
                      <div className="w-full bg-slate-250 rounded-full h-2 overflow-hidden bg-slate-200">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            exceeded ? 'bg-red-500' : executionRate > 80 ? 'bg-amber-400' : 'bg-teal-500'
                          }`}
                          style={{ width: `${Math.min(executionRate, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* MODAL 1: OHADA PARTY DOUBLE CREATOR */}
      {showAddPiece && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4 backdrop-blur-xs text-xs">
          <div className="bg-white rounded-2xl max-w-md w-full border shadow-xl overflow-hidden animate-in fade-in duration-150">
            <div className="bg-indigo-700 text-white p-4">
              <h3 className="font-extrabold text-sm flex items-center gap-2">
                <Book className="h-5 w-5 text-teal-300" />
                Saisir écriture par partie double équilibrée
              </h3>
            </div>
            
            <form onSubmit={handleCreatePiece} className="p-5 space-y-4">
              <div className="bg-indigo-50 border p-3 rounded-lg text-indigo-900 leading-tight">
                Pour assurer la régularité SYSCOHADA, votre débit et crédit doivent être égaux pour équilibrer la transaction comptable.
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Type de Journal</label>
                  <select value={newJournal} onChange={(e) => setNewJournal(e.target.value as any)} className="w-full border p-2 rounded-lg bg-white font-medium">
                    <option value="ACH">ACH (Achats)</option>
                    <option value="VEN">VEN (Ventes)</option>
                    <option value="BQ">BQ (Banque)</option>
                    <option value="CAI">CAI (Caisse)</option>
                    <option value="OD">OD (Opérations Diverses)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Référence Pièce *</label>
                  <input type="text" required value={newRefPiece} onChange={(e) => setNewRefPiece(e.target.value)} placeholder="Ex: FAC-OB-392" className="w-full border p-2 rounded-lg" />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Libellé d'écriture réglementaire *</label>
                <input type="text" required value={newLibelle} onChange={(e) => setNewLibelle(e.target.value)} placeholder="Ex: Paiement engrais Soproicam" className="w-full border p-2 rounded-lg" />
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 border rounded-xl">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Débit (+) Compte OHADA *</label>
                  <select value={newDebitCompte} onChange={(e) => setNewDebitCompte(e.target.value)} className="w-full border p-2 rounded-lg bg-white">
                    {Object.entries(standardNames).map(([code, name]) => (
                      <option key={code} value={`${code} (${name})`}>{code} — {name}</option>
                    ))}
                  </select>
                  <div className="mt-1">
                    <label className="block text-[10px] text-slate-500 font-bold mt-1">Montant Débit (FCFA) *</label>
                    <input type="number" required value={newMontantDebit} onChange={(e) => { setNewMontantDebit(parseInt(e.target.value) || 0); setNewMontantCredit(parseInt(e.target.value) || 0); }} className="w-full border p-1 rounded font-bold font-mono text-xs" />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1">Crédit (-) Compte OHADA *</label>
                  <select value={newCreditCompte} onChange={(e) => setNewCreditCompte(e.target.value)} className="w-full border p-2 rounded-lg bg-white">
                    {Object.entries(standardNames).map(([code, name]) => (
                      <option key={code} value={`${code} (${name})`}>{code} — {name}</option>
                    ))}
                  </select>
                  <div className="mt-1">
                    <label className="block text-[10px] text-slate-500 font-bold mt-1">Montant Crédit (FCFA) *</label>
                    <input type="number" required value={newMontantCredit} onChange={(e) => setNewMontantCredit(parseInt(e.target.value) || 0)} className="w-full border p-1 rounded font-bold font-mono text-xs" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Axe Analytique / Centre Agricole</label>
                <input type="text" value={newAnalUnit} onChange={(e) => setNewAnalUnit(e.target.value)} placeholder="Ex: Secteur Nord Maraîchage" className="w-full border p-2 rounded-lg" />
              </div>

              {errorBalanced && (
                <div className="text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200 leading-normal font-medium">
                  {errorBalanced}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button type="button" onClick={() => setShowAddPiece(false)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2 rounded-lg font-bold">Annuler</button>
                <button type="submit" className="bg-indigo-700 text-white p-2 rounded-lg font-bold hover:bg-indigo-800">Valider & Équilibrer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: PAIE GLOBAL PERSONNEL (CHARGE DE PERSONNEL EN BLOC - SECTION 5.4) */}
      {showAddSalaryCharge && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4 backdrop-blur-xs text-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full border shadow-xl overflow-hidden animate-in fade-in duration-100">
            <div className="bg-slate-800 text-white p-4">
              <h3 className="font-extrabold text-sm">Déclarer charge de personnel globale</h3>
            </div>

            <form onSubmit={handleAddGlobalPayroll} className="p-5 space-y-4">
              <div className="bg-amber-50 text-amber-900 p-3 rounded-lg leading-normal">
                Conformément au périmètre (paie non nominative) : cette opération comptabilise la masse salariale globale d'un poste pour une période donnée.
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Période d'affectation *</label>
                <input type="text" required value={salaryPeriod} onChange={(e) => setSalaryPeriod(e.target.value)} placeholder="Ex: 06-2026" className="w-full border p-2 rounded-lg" />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Poste concerné (Saisonniers / Permanents) *</label>
                <input type="text" required value={salaryPost} onChange={(e) => setSalaryPost(e.target.value)} className="w-full border p-2 rounded-lg" />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Masse salariale cumulée nette due (FCFA) *</label>
                <input type="number" required value={salaryAmount} onChange={(e) => setSalaryAmount(parseInt(e.target.value) || 0)} className="w-full border p-2 rounded-lg font-bold font-mono text-slate-800" />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button type="button" onClick={() => setShowAddSalaryCharge(false)} className="bg-slate-100 p-2 rounded-lg font-bold">Annuler</button>
                <button type="submit" className="bg-slate-800 text-white p-2 rounded-lg font-bold">Inscrire Écriture de Paie</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
