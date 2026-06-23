/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Employe, PresencePointage, BulletinPaie, ContratEmploye, ElementVariablePaie } from '../types';
import {
  Users,
  Briefcase,
  History,
  TrendingUp,
  FileCheck2,
  DollarSign,
  PlusCircle,
  FileText,
  BadgeAlert,
  Sliders,
  Flag,
  Fingerprint,
  Calendar,
  Layers,
  Wallet,
  Calculator,
  Percent,
  Check,
  AlertCircle,
  Clock,
  Printer,
  ChevronDown
} from 'lucide-react';

interface HRModuleProps {
  employes: Employe[];
  presences: PresencePointage[];
  bulletins: BulletinPaie[];
  onAddEmploye: (emp: Employe) => void;
  onAddPresence: (pres: PresencePointage) => void;
  onAddBulletin: (bp: BulletinPaie) => void;
  customLabels?: any;
}

export default function HRModule({
  employes,
  presences,
  bulletins,
  onAddEmploye,
  onAddPresence,
  onAddBulletin,
  customLabels
}: HRModuleProps) {
  const [activeTab, setActiveTab] = useState<'liste' | 'contrats' | 'variables' | 'presences' | 'calculateur' | 'bulletins'>('liste');

  // Multi-tenant scoped prefix key generator
  const getTenantId = () => {
    try {
      const saved = localStorage.getItem('activeTenant');
      if (saved) {
        return JSON.parse(saved).id || 'client-1';
      }
    } catch (e) {}
    return 'client-1';
  };
  const tenantId = getTenantId();

  // Country regulatory selected (Cameroun, Gabon, Congo)
  const [selectedCountry, setSelectedCountry] = useState<'Cameroun' | 'Gabon' | 'Congo'>('Cameroun');

  // Local storage lists for extended data with fallback mock data
  const [contrats, setContrats] = useState<ContratEmploye[]>(() => {
    const key = `ka_contrats_${tenantId}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    // Prefabricated contracts linked to existing initial employees
    return [
      {
        id: 'cont-1',
        idEmploye: 'emp-1',
        typeCONTRAT: 'CDI',
        dateDebut: '2023-01-15',
        salaireBaseBrut: 450000,
        indemniteLogement: 50000,
        indemniteTransport: 25000,
        allocationsFamiliales: 4500,
        statut: 'Actif',
        dateSignature: '2023-01-12'
      },
      {
        id: 'cont-2',
        idEmploye: 'emp-2',
        typeCONTRAT: 'CDI',
        dateDebut: '2020-04-01',
        salaireBaseBrut: 250000,
        indemniteLogement: 30000,
        indemniteTransport: 15000,
        allocationsFamiliales: 9000,
        statut: 'Actif',
        dateSignature: '2020-03-25'
      },
      {
        id: 'cont-3',
        idEmploye: 'emp-3',
        typeCONTRAT: 'CDI',
        dateDebut: '2021-08-10',
        salaireBaseBrut: 180000,
        indemniteLogement: 20000,
        indemniteTransport: 10000,
        allocationsFamiliales: 13500,
        statut: 'Actif',
        dateSignature: '2021-08-05'
      },
      {
        id: 'cont-4',
        idEmploye: 'emp-4',
        typeCONTRAT: 'CDD',
        dateDebut: '2025-03-01',
        dateFin: '2026-03-01',
        salaireBaseBrut: 120000,
        indemniteLogement: 10000,
        indemniteTransport: 5000,
        allocationsFamiliales: 0,
        statut: 'Actif',
        dateSignature: '2025-02-28'
      },
      {
        id: 'cont-5',
        idEmploye: 'emp-5',
        typeCONTRAT: 'CDI',
        dateDebut: '2024-02-15',
        salaireBaseBrut: 200000,
        indemniteLogement: 25000,
        indemniteTransport: 12000,
        allocationsFamiliales: 4500,
        statut: 'Actif',
        dateSignature: '2024-02-10'
      }
    ];
  });

  const [variables, setVariables] = useState<ElementVariablePaie[]>(() => {
    const key = `ka_variables_${tenantId}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: 'v-1', idEmploye: 'emp-1', periode: '06-2026', heuresSup130: 4, heuresSup140: 2, primesRendement: 35000, indemniteDeplacements: 15000, avancesRemboursements: 0, joursAbsenceNonJustifiee: 0 },
      { id: 'v-2', idEmploye: 'emp-2', periode: '06-2026', heuresSup130: 8, heuresSup140: 4, primesRendement: 15000, indemniteDeplacements: 5500, avancesRemboursements: 10000, joursAbsenceNonJustifiee: 1 },
      { id: 'v-3', idEmploye: 'emp-3', periode: '06-2026', heuresSup130: 0, heuresSup140: 0, primesRendement: 20000, indemniteDeplacements: 0, avancesRemboursements: 15000, joursAbsenceNonJustifiee: 0 }
    ];
  });

  // Keep lists synced with localstorage context of current active tenant
  useEffect(() => {
    localStorage.setItem(`ka_contrats_${tenantId}`, JSON.stringify(contrats));
  }, [contrats, tenantId]);

  useEffect(() => {
    localStorage.setItem(`ka_variables_${tenantId}`, JSON.stringify(variables));
  }, [variables, tenantId]);

  // Modals Visibility
  const [showAddEmp, setShowAddEmploye] = useState(false);
  const [showAddContrat, setShowAddContrat] = useState(false);
  const [showAddPres, setShowAddPresence] = useState(false);
  const [showAddVariable, setShowAddVariable] = useState(false);
  const [selectedPreviewBP, setSelectedPreviewBP] = useState<BulletinPaie | null>(null);

  // Form Inputs: Employee
  const [newEmpNom, setNewEmpNom] = useState('');
  const [newEmpPrenom, setNewEmpPrenom] = useState('');
  const [newEmpSexe, setNewEmpSexe] = useState<'Mâle' | 'Femelle'>('Femelle');
  const [newEmpPoste, setNewEmpPoste] = useState('Technicien');
  const [newEmpDept, setNewEmpDepartment] = useState<'Administration' | 'Agriculture' | 'Élevage' | 'Commercial'>('Agriculture');
  const [newEmpContract, setNewEmpContract] = useState<'CDI' | 'CDD' | 'Saisonnier' | 'Journalier'>('CDI');
  const [newEmpSalaire, setNewEmpSalaire] = useState(150000);

  // Form Inputs: Contract
  const [ncEmp, setNcEmp] = useState('');
  const [ncType, setNcType] = useState<'CDI' | 'CDD' | 'Saisonnier' | 'Journalier'>('CDI');
  const [ncDebut, setNcDebut] = useState('2026-06-01');
  const [ncFin, setNcFin] = useState('');
  const [ncBase, setNcBase] = useState(150000);
  const [ncLogement, setNcLogement] = useState(15000);
  const [ncTransport, setNcTransport] = useState(10000);
  const [ncAbsenceAllowance, setNcAbsenceAllowance] = useState(0);

  // Form Inputs: Variable Inputs
  const [nvEmp, setNvEmp] = useState('');
  const [nvPeriode, setNvPeriode] = useState('06-2026');
  const [nvHs130, setNvHs130] = useState(0);
  const [nvHs140, setNvHs140] = useState(0);
  const [nvPrimes, setNvPrimes] = useState(10000);
  const [nvDeplacement, setNvDeplacement] = useState(0);
  const [nvAvances, setNvAvances] = useState(0);
  const [nvAbsDays, setNvAbsDays] = useState(0);

  // Form Inputs: Presence Pointages
  const [newPresEmp, setNewPresEmp] = useState('');
  const [newPresStat, setNewPresStat] = useState<'Présent' | 'Retard' | 'Absence Justifiée' | 'Absence Injustifiée'>('Présent');
  const [newPresDate, setNewPresDate] = useState(new Date().toISOString().split('T')[0]);

  // Calculator Screen Sandbox variables
  const [calcEmpId, setCalcEmpId] = useState('');
  const [calcPeriode, setCalcPeriode] = useState('06-2026');

  // Trigger default selectors on data change
  useEffect(() => {
    if (employes.length > 0) {
      if (!newPresEmp) setNewPresEmp(employes[0].id);
      if (!ncEmp) setNcEmp(employes[0].id);
      if (!nvEmp) setNvEmp(employes[0].id);
      if (!calcEmpId) setCalcEmpId(employes[0].id);
    }
  }, [employes]);

  // Helpers
  const getEmployeeName = (id: string) => {
    const e = employes.find(x => x.id === id);
    return e ? `${e.prenom} ${e.nom}` : 'Inconnu';
  };

  const getActiveContractForEmp = (empId: string) => {
    return contrats.find(c => c.idEmploye === empId && c.statut === 'Actif') || contrats.find(c => c.idEmploye === empId);
  };

  const getVariablesForEmp = (empId: string, period: string) => {
    return variables.find(v => v.idEmploye === empId && v.periode === period) || {
      id: '', idEmploye: empId, periode: period,
      heuresSup130: 0, heuresSup140: 0, primesRendement: 0,
      indemniteDeplacements: 0, avancesRemboursements: 0, joursAbsenceNonJustifiee: 0
    };
  };

  // Tax/Social Calculation Engine
  const calculatePayslipDetail = (empId: string, period: string, country: 'Cameroun' | 'Gabon' | 'Congo') => {
    const emp = employes.find(x => x.id === empId);
    if (!emp) return null;

    const contract = getActiveContractForEmp(empId);
    const baseRaw = contract ? contract.salaireBaseBrut : emp.salaireBase;
    const logement = contract ? contract.indemniteLogement : 0;
    const transport = contract ? contract.indemniteTransport : 0;
    const fam = contract ? contract.allocationsFamiliales : 0;

    const v = getVariablesForEmp(empId, period);

    // Calculate daily rate for absence deductions
    const dailyRate = Math.round(baseRaw / 30);
    const deductionAbsence = v.joursAbsenceNonJustifiee * dailyRate;

    // Hourly rate based on official normal monthly working hours (ex: 173.33 hr/month)
    const hourlyRate = baseRaw / 173.33;
    const overtimePay = Math.round((v.heuresSup130 * hourlyRate * 1.3) + (v.heuresSup140 * hourlyRate * 1.4));

    // Gross Taxable Income (Salaire Brut Imposable)
    // Base - Absences + Overtime + Rendement Primes + Housing + Transport + Expenses
    const grossSalaryStrut = baseRaw - deductionAbsence + overtimePay + v.primesRendement + logement + transport + v.indemniteDeplacements;
    const grossIncome = Math.max(0, grossSalaryStrut);

    // country specific factors
    let cnps = 0;
    let cfc = 0; // Credit Foncier
    let irp = 0; // Income tax / IGR

    if (country === 'Cameroun') {
      // CNPS Cameroon: 4.2% of taxable capped at 750,000 FCFA
      const cnpsBase = Math.min(grossIncome, 750000);
      cnps = Math.round(cnpsBase * 0.042);
      
      // Credit foncier (CFC): 1% of gross taxable
      cfc = Math.round(grossIncome * 0.01);

      // Progressive tax brackets emulation
      const taxableNetRating = grossIncome - cnps - cfc;
      if (taxableNetRating > 500000) {
        irp = Math.round((taxableNetRating - 500) * 0.25 + 47500);
      } else if (taxableNetRating > 300000) {
        irp = Math.round((taxableNetRating - 300000) * 0.15 + 15000);
      } else if (taxableNetRating > 150000) {
        irp = Math.round((taxableNetRating - 150000) * 0.10);
      } else {
        irp = 0;
      }
    } else if (country === 'Gabon') {
      // Pension basic CNSS (Part salariale 5%, capped at 1,500,000)
      const cnssBase = Math.min(grossIncome, 1500000);
      cnps = Math.round(cnssBase * 0.05);

      // Maladie CNAMGS : 2.5% of Gross
      cfc = Math.round(grossIncome * 0.025); // mapped as secondary charge

      // TCS (Taxe Complémentaire de Salaire) flat 5%
      irp = Math.round(grossIncome * 0.05);
    } else {
      // Congo
      // Pension basic CNSS (Part salariale 4%, capped at 1,200,500)
      const cnssBase = Math.min(grossIncome, 1200500);
      cnps = Math.round(cnssBase * 0.04);

      // Unique general tax flat 7.5%
      irp = Math.round(grossIncome * 0.075);
    }

    const netPay = grossIncome - cnps - cfc - irp - v.avancesRemboursements + fam;

    return {
      empName: `${emp.prenom} ${emp.nom}`,
      matricule: emp.matricule,
      poste: emp.poste,
      dept: emp.department,
      contratType: contract ? contract.typeCONTRAT : emp.contratType,
      salaireBase: baseRaw,
      absencesDeduction: deductionAbsence,
      absenceDaysCount: v.joursAbsenceNonJustifiee,
      overtimeValue: overtimePay,
      primes: v.primesRendement + v.indemniteDeplacements,
      housingAllowance: logement,
      transportAllowance: transport,
      familyAllowance: fam,
      grossSalary: grossIncome,
      socialCNPS: cnps,
      socialCFC: cfc,
      fiscalTax: irp,
      advances: v.avancesRemboursements,
      netToPay: Math.round(netPay)
    };
  };

  // Submit Handlers
  const handleAddNewEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmpNom || !newEmpPrenom) return;
    const randomizedMatricule = 'KA-2026-' + Math.floor(10 + Math.random() * 90);
    const newEmpId = 'emp-' + Math.floor(Math.random() * 10000);
    const newEmp: Employe = {
      id: newEmpId,
      matricule: randomizedMatricule,
      nom: newEmpNom.toUpperCase(),
      prenom: newEmpPrenom,
      sexe: newEmpSexe,
      dateNaissance: '1990-01-01',
      tel: '+237 600 000 050',
      email: `${newEmpPrenom.toLowerCase().replace(' ', '')}.${newEmpNom.toLowerCase().replace(' ', '')}@kissineagro.cm`,
      poste: newEmpPoste,
      department: newEmpDept as any,
      contratType: newEmpContract as any,
      dateEmbauche: new Date().toISOString().split('T')[0],
      salaireBase: newEmpSalaire,
      statut: 'Actif'
    };

    // Auto generate an initial contract card for this new recruit
    const firstContract: ContratEmploye = {
      id: 'cont-' + Math.floor(Math.random() * 10000),
      idEmploye: newEmpId,
      typeCONTRAT: newEmpContract,
      dateDebut: newEmp.dateEmbauche,
      salaireBaseBrut: newEmpSalaire,
      indemniteLogement: Math.round(newEmpSalaire * 0.1),
      indemniteTransport: Math.round(newEmpSalaire * 0.05),
      allocationsFamiliales: 0,
      statut: 'Actif',
      dateSignature: newEmp.dateEmbauche
    };

    onAddEmploye(newEmp);
    setContrats(prev => [...prev, firstContract]);
    setShowAddEmploye(false);
    setNewEmpNom('');
    setNewEmpPrenom('');
  };

  const handleAddNewContrat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ncEmp) return;

    // Terminate other active contracts of this employee to ensure safety
    setContrats(prev => prev.map(c => c.idEmploye === ncEmp ? { ...c, statut: 'Terminé' } : c));

    const newCont: ContratEmploye = {
      id: 'cont-' + Math.floor(Math.random() * 10000),
      idEmploye: ncEmp,
      typeCONTRAT: ncType,
      dateDebut: ncDebut,
      dateFin: ncFin || undefined,
      salaireBaseBrut: ncBase,
      indemniteLogement: ncLogement,
      indemniteTransport: ncTransport,
      allocationsFamiliales: ncAbsenceAllowance,
      statut: 'Actif',
      dateSignature: new Date().toISOString().split('T')[0]
    };

    setContrats(prev => [...prev, newCont]);
    setShowAddContrat(false);
  };

  const handleAddNewPresence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPresEmp) return;

    const newPres: PresencePointage = {
      id: 'p-' + Math.floor(Math.random() * 10000),
      idEmploye: newPresEmp,
      date: newPresDate,
      heureEntree: '07:30',
      heureSortie: '16:30',
      dureeHeures: 9.0,
      statut: newPresStat as any
    };

    onAddPresence(newPres);
    setShowAddPresence(false);
  };

  const handleAddNewVariable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nvEmp) return;

    const newVar: ElementVariablePaie = {
      id: 'v-' + Math.floor(Math.random() * 10000),
      idEmploye: nvEmp,
      periode: nvPeriode,
      heuresSup130: nvHs130,
      heuresSup140: nvHs140,
      primesRendement: nvPrimes,
      indemniteDeplacements: nvDeplacement,
      avancesRemboursements: nvAvances,
      joursAbsenceNonJustifiee: nvAbsDays
    };

    setVariables(prev => {
      // weed out existing variables for this employee + same period to avoid dupes
      const filtered = prev.filter(item => !(item.idEmploye === nvEmp && item.periode === nvPeriode));
      return [...filtered, newVar];
    });

    setShowAddVariable(false);
  };

  const executePayrollCalculation = () => {
    if (!calcEmpId) return;
    const model = calculatePayslipDetail(calcEmpId, calcPeriode, selectedCountry);
    if (!model) return;

    // Map to the parent's generic format for serialization & storage in global state
    const newBP: BulletinPaie = {
      id: 'bp-' + Math.floor(Math.random() * 10000),
      idEmploye: calcEmpId,
      periode: calcPeriode,
      salaireBase: model.salaireBase,
      heuresSupMontant: model.overtimeValue,
      primes: model.primes,
      avancesRetenues: model.advances,
      cotisationCNPS: model.socialCNPS,
      impotIGR: model.fiscalTax + model.socialCFC, // aggregated taxes
      netAPayer: model.netToPay,
      statut: 'Brouillon'
    };

    onAddBulletin(newBP);
    // Auto preview the computed payslip!
    setSelectedPreviewBP(newBP);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Module Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2 tracking-tight">
            <Users className="text-violet-600 h-7 w-7" />
            Module RH & Gestion Avancée de la Paie
          </h2>
          <p className="text-xs text-slate-500">
            Dossiers numériques du personnel, édition des contrats OHADA, relevé des variables et calculateur de paie multicritères (Cameroun, Gabon, Congo).
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              if (activeTab === 'liste') setShowAddEmploye(true);
              if (activeTab === 'contrats') setShowAddContrat(true);
              if (activeTab === 'variables') setShowAddVariable(true);
              if (activeTab === 'presences') setShowAddPresence(true);
              if (activeTab === 'calculateur') executePayrollCalculation();
            }}
            className="bg-violet-600 text-white text-xs font-black px-4.5 py-2.5 rounded-xl hover:bg-violet-700 transition flex items-center gap-1.5 shadow-sm"
          >
            <PlusCircle className="h-4 w-4" />
            {activeTab === 'liste' && "Recruter un Ouvrier"}
            {activeTab === 'contrats' && "Emettre un Contrat"}
            {activeTab === 'variables' && "Ajouter Saisie Variable"}
            {activeTab === 'presences' && "Logger Pointage Présence"}
            {activeTab === 'calculateur' && "Lancer Calcul Moteur Paie"}
            {activeTab === 'bulletins' && "Emettre un bulletin direct"}
          </button>
        </div>
      </div>

      {/* Country selection slider for CEMAC taxation brackets */}
      <div className="bg-gradient-to-r from-violet-900 to-indigo-900 p-4 rounded-2xl text-white shadow-md flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-white/15 rounded-lg">
            <Sliders className="h-5 w-5 text-violet-300" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-violet-200">Législation Fiscale Applicatrice</h4>
            <p className="text-[10px] text-slate-300">Sélectionnez la juridiction pour charger les barèmes sociaux (CNPS, CNSS, CFC, d'impôts IGR CEMAC)</p>
          </div>
        </div>
        <div className="flex bg-black/25 p-1 rounded-xl gap-1">
          {(['Cameroun', 'Gabon', 'Congo'] as const).map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCountry(c)}
              className={`px-4 py-1.5 rounded-lg text-xs font-black transition flex items-center gap-1 border-0 ${
                selectedCountry === c ? 'bg-violet-600 shadow-sm text-white' : 'hover:bg-white/10 text-slate-300'
              }`}
            >
              <Flag className="h-3.5 w-3.5" />
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* ERP Responsive Tab Index */}
      <div className="border-b flex flex-wrap gap-1 bg-slate-100 p-1 rounded-xl border">
        {[
          { key: 'liste', name: 'Annuaire' },
          { key: 'contrats', name: 'Fiches Contrats' },
          { key: 'presences', name: 'Horaires & Pointages' },
          { key: 'variables', name: 'Variables du mois' },
          { key: 'calculateur', name: '⚡ Simulateur / Calculateur' },
          { key: 'bulletins', name: 'Bulletins Générés' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2 rounded-lg text-xs font-extrabold transition ${
              activeTab === tab.key ? 'bg-white shadow-xs text-violet-700' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border shadow-xs p-5">
        
        {/* VIEW 1: ANNUAIRE */}
        {activeTab === 'liste' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <h3 className="font-bold text-slate-800 text-sm">Rassemblement Général du Personnel</h3>
              <span className="text-[10px] bg-slate-100 px-3 py-1 rounded-full text-slate-500 font-mono">Effectif : {employes.length}</span>
            </div>
            <div className="overflow-x-auto border rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-3">Matricule</th>
                    <th className="p-3">Personnel</th>
                    <th className="p-3">Sexe</th>
                    <th className="p-3">Département Assigné</th>
                    <th className="p-3">Poste Standard</th>
                    <th className="p-3">Contrat de Travail</th>
                    <th className="p-3">Barème de Base</th>
                    <th className="p-3 text-right">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-slate-700">
                  {employes.map((emp) => {
                    const c = getActiveContractForEmp(emp.id);
                    return (
                      <tr key={emp.id} className="hover:bg-slate-50 transition">
                        <td className="p-3 font-mono font-black text-violet-700">{emp.matricule}</td>
                        <td className="p-3">
                          <div className="font-extrabold text-slate-900">{emp.prenom} {emp.nom}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{emp.email} • {emp.tel}</div>
                        </td>
                        <td className="p-3 text-slate-600">{emp.sexe}</td>
                        <td className="p-3">
                          <span className="bg-slate-100 border text-slate-700 px-2 py-0.5 rounded text-[10px] font-bold">
                            {emp.department}
                          </span>
                        </td>
                        <td className="p-3 font-semibold text-slate-800">{emp.poste}</td>
                        <td className="p-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                            c?.typeCONTRAT === 'CDI' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {c ? c.typeCONTRAT : emp.contratType}
                          </span>
                        </td>
                        <td className="p-3 font-bold text-indigo-700">
                          {(c ? c.salaireBaseBrut : emp.salaireBase).toLocaleString()} FCFA
                        </td>
                        <td className="p-3 text-right">
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                            emp.statut === 'Actif' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-600'
                          }`}>
                            ● {emp.statut}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW 2: CONTRACTS */}
        {activeTab === 'contrats' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Registres des Engagements Contractuels</h3>
                <p className="text-[10.5px] text-slate-500">Edition et archive des primes fixes d’hébergement, transport, et allocations additionnelles.</p>
              </div>
              <button 
                onClick={() => setShowAddContrat(true)} 
                className="text-xs bg-slate-900 text-white rounded-lg px-3 py-1.5 hover:bg-violet-700 transition font-bold"
              >
                + Créer un nouveau contrat
              </button>
            </div>
            <div className="overflow-x-auto border rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b text-slate-500 font-bold uppercase">
                  <tr>
                    <th className="p-3">Réf</th>
                    <th className="p-3">Collabrateur</th>
                    <th className="p-3">Forme</th>
                    <th className="p-3">Date d'embauche</th>
                    <th className="p-3 text-right">Base Salaire</th>
                    <th className="p-3 text-right">Indemnité Logement</th>
                    <th className="p-3 text-right">Indemnité Transport</th>
                    <th className="p-3 text-right">Allocations Fam</th>
                    <th className="p-3 text-right">Statut du contrat</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-slate-700">
                  {contrats.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50 transition">
                      <td className="p-3 font-mono font-bold text-slate-500">{c.id}</td>
                      <td className="p-3 font-extrabold text-slate-900">{getEmployeeName(c.idEmploye)}</td>
                      <td className="p-3">
                        <span className="bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded border text-[10px]">{c.typeCONTRAT}</span>
                      </td>
                      <td className="p-3 font-mono text-slate-400">{c.dateDebut} {c.dateFin ? `au ${c.dateFin}` : 'indéterminée'}</td>
                      <td className="p-3 text-right font-bold text-indigo-700">{c.salaireBaseBrut.toLocaleString()} FCFA</td>
                      <td className="p-3 text-right font-mono text-slate-650">+{c.indemniteLogement.toLocaleString()} FCFA</td>
                      <td className="p-3 text-right font-mono text-slate-650">+{c.indemniteTransport.toLocaleString()} FCFA</td>
                      <td className="p-3 text-right font-mono text-slate-650">+{c.allocationsFamiliales.toLocaleString()} FCFA</td>
                      <td className="p-3 text-right font-bold">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          c.statut === 'Actif' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-400'
                        }`}>
                          ● {c.statut}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW 3: PRESENCES */}
        {activeTab === 'presences' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <h3 className="font-bold text-slate-800 text-sm">Registre d'incorporation des pointages d'heures</h3>
              <span className="text-[10px] bg-slate-100 px-3 py-1 rounded-full text-slate-500 font-mono">Simulé via GPS de garde</span>
            </div>
            <div className="overflow-x-auto border rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b text-slate-500 font-bold uppercase">
                  <tr>
                    <th className="p-3">Date</th>
                    <th className="p-3">Employé</th>
                    <th className="p-3">Heure Arrivée</th>
                    <th className="p-3">Heure Sortie</th>
                    <th className="p-3">Durée Cumulée</th>
                    <th className="p-3">Statut pointage</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-slate-700">
                  {presences.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 transition">
                      <td className="p-3 font-mono text-slate-550 font-semibold">{p.date}</td>
                      <td className="p-3 font-extrabold text-slate-900">{getEmployeeName(p.idEmploye)}</td>
                      <td className="p-3 font-mono text-slate-500">{p.heureEntree}</td>
                      <td className="p-3 font-mono text-slate-500">{p.heureSortie}</td>
                      <td className="p-3 font-bold text-slate-800">{p.dureeHeures} heures</td>
                      <td className="p-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          p.statut === 'Présent' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          ● {p.statut}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW 4: VARIABLES DES SALAIRES */}
        {activeTab === 'variables' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Relevé des Éléments Variables Mensuels</h3>
                <p className="text-[10.5px] text-slate-500">Saisie des heures supplémentaires effectuées, primes d'assiduité, absences injustifiées et acomptes.</p>
              </div>
              <button 
                onClick={() => setShowAddVariable(true)} 
                className="text-xs bg-slate-900 text-white rounded-lg px-3 py-1.5 hover:bg-violet-700 transition font-bold"
              >
                + Ajouter Saisie Variable
              </button>
            </div>
            <div className="overflow-x-auto border rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b text-slate-500 font-bold uppercase">
                  <tr>
                    <th className="p-3">Période</th>
                    <th className="p-3">Employé</th>
                    <th className="p-3 text-right">Heures Sup (30%)</th>
                    <th className="p-3 text-right">Heures Sup (40%)</th>
                    <th className="p-3 text-right">Primes Exceptionnelles</th>
                    <th className="p-3 text-right">Frais Déplacement</th>
                    <th className="p-3 text-right">Absences Injustifiées</th>
                    <th className="p-3 text-right text-red-650">Acomptes Déduits</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-slate-700">
                  {variables.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-50 transition">
                      <td className="p-3 font-mono font-bold text-slate-500">{v.periode}</td>
                      <td className="p-3 font-extrabold text-slate-900">{getEmployeeName(v.idEmploye)}</td>
                      <td className="p-3 text-right font-bold text-slate-700">{v.heuresSup130} hrs</td>
                      <td className="p-3 text-right font-bold text-slate-700">{v.heuresSup140} hrs</td>
                      <td className="p-3 text-right text-emerald-600 font-mono">+{v.primesRendement.toLocaleString()} FCFA</td>
                      <td className="p-3 text-right text-emerald-600 font-mono">+{v.indemniteDeplacements.toLocaleString()} FCFA</td>
                      <td className="p-3 text-right">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${v.joursAbsenceNonJustifiee > 0 ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-slate-100 text-slate-400'}`}>
                          {v.joursAbsenceNonJustifiee} jours
                        </span>
                      </td>
                      <td className="p-3 text-right text-red-600 font-black">-{v.avancesRemboursements.toLocaleString()} FCFA</td>
                    </tr>
                  ))}
                  {variables.length === 0 && (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-slate-400 italic font-medium">Aucun élément variable enregistré pour cette période.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW 5: SIMULATEUR / CALCULATEUR DE PAIE */}
        {activeTab === 'calculateur' && (
          <div className="space-y-6">
            <div className="pb-4 border-b">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Calculator className="h-5 w-5 text-violet-600" />
                Moteur de Paie & Simulation Métiers de la CEMAC
              </h3>
              <p className="text-[11px] text-slate-500">Injectez d'un clic les variables collectées et générez des fiches comptables automatiques dans le Grand Livre.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div className="bg-slate-50 border p-4 rounded-2xl space-y-3.5">
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Lanceur Simulation Individuelle</h4>
                  
                  <div>
                    <label className="block text-slate-600 text-[11px] font-bold mb-1">Employé Cible *</label>
                    <select
                      value={calcEmpId}
                      onChange={(e) => setCalcEmpId(e.target.value)}
                      className="w-full border text-xs p-2.5 rounded-xl bg-white focus:ring-1 focus:ring-violet-500 focus:outline-hidden"
                    >
                      {employes.map(e => (
                        <option key={e.id} value={e.id}>
                          {e.prenom} {e.nom} [Poste: {e.poste}]
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-600 text-[11px] font-bold mb-1">Période du relevé *</label>
                    <input
                      type="text"
                      value={calcPeriode}
                      onChange={(e) => setCalcPeriode(e.target.value)}
                      placeholder="Ex: 06-2026"
                      className="w-full border text-xs p-2.5 rounded-xl focus:ring-1 focus:ring-violet-500 focus:outline-hidden"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={executePayrollCalculation}
                      type="button"
                      className="w-full bg-violet-600 hover:bg-violet-700 text-white font-extrabold text-xs py-3 rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <Calculator className="h-4 w-4" />
                      Calculer le Bulletin de Paie
                    </button>
                  </div>
                </div>

                <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-xl space-y-2 text-[11px] text-amber-900 leading-relaxed">
                  <h5 className="font-extrabold flex items-center gap-1">
                    <Percent className="h-4 w-4" />
                    Barème Fiscale appliqué ({selectedCountry}) :
                  </h5>
                  {selectedCountry === 'Cameroun' && (
                    <ul className="list-disc pl-4 space-y-1">
                      <li>CNPS Part Salariale de 4.2% plafonnée à 750,000 FCFA.</li>
                      <li>Credit Foncier (CFC) Part Salariale de 1% du Brut global.</li>
                      <li>IGR Progressive Bracket: 10% (150k+), 15% (300k+), 25% (500k+).</li>
                    </ul>
                  )}
                  {selectedCountry === 'Gabon' && (
                    <ul className="list-disc pl-4 space-y-1">
                      <li>CNSS Part Salariale de 5.0% plafonnée à 1,500,000 FCFA.</li>
                      <li>CNAMGS (Assurance Maladie) de 2.5% du Brut global.</li>
                      <li>Taxe Complémentaire de Salaire (TCS) à 5.0% flat.</li>
                    </ul>
                  )}
                  {selectedCountry === 'Congo' && (
                    <ul className="list-disc pl-4 space-y-1">
                      <li>CNSS Part Salariale de 4.0% plafonnée à 1,200,500 FCFA.</li>
                      <li>IUS (Impôt Unique sur Salaires) de 7.5% flat du net comptable.</li>
                    </ul>
                  )}
                </div>
              </div>

              {/* LIVE SIMULATED SLIP PREVIEW */}
              <div className="md:col-span-2">
                {calcEmpId ? (() => {
                  const data = calculatePayslipDetail(calcEmpId, calcPeriode, selectedCountry);
                  if (!data) return null;
                  return (
                    <div className="border border-slate-300 rounded-2xl shadow-md bg-[#fafafa] p-6 text-slate-800 font-sans text-xs space-y-4">
                      {/* Payslip Header */}
                      <div className="flex justify-between items-start border-b border-dashed border-slate-300 pb-3">
                        <div>
                          <span className="font-mono text-[9px] text-violet-600 block uppercase font-bold tracking-widest leading-none">MEFOUP-FLOW GESTION RH</span>
                          <h3 className="font-extrabold text-sm text-slate-900 leading-normal">{data.empName}</h3>
                          <p className="text-[11px] text-slate-500">{data.poste} • {data.dept}</p>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">Matricule: {data.matricule} • {data.contratType}</p>
                        </div>
                        <div className="text-right font-mono">
                          <span className="bg-violet-100 text-violet-800 font-bold px-2 py-0.5 rounded text-[10px]">PREVIEW CALCULATEUR</span>
                          <p className="text-[10px] text-slate-400 mt-1">Période : {calcPeriode}</p>
                          <p className="text-[10px] text-slate-400">Jurisdiction : {selectedCountry}</p>
                        </div>
                      </div>

                      {/* Line Item Breakdown */}
                      <div className="space-y-1.5">
                        <div className="flex font-semibold text-[10px] uppercase text-slate-500 pb-1 border-b">
                          <span className="grow">Description / Rubriques</span>
                          <span className="w-24 text-right">Gains / Primes</span>
                          <span className="w-24 text-right">Retenues / Cotis</span>
                        </div>

                        {/* Base Pay */}
                        <div className="flex py-0.5">
                          <span className="grow text-slate-900 font-medium">Salaire de Base Conventionnel</span>
                          <span className="w-24 text-right font-mono">{data.salaireBase.toLocaleString()} FCFA</span>
                          <span className="w-24 text-right font-mono text-slate-300">-</span>
                        </div>

                        {/* Absence Deduction */}
                        {data.absencesDeduction > 0 && (
                          <div className="flex py-0.5 text-rose-700">
                            <span className="grow font-medium">Absence non Justifiée ({data.absenceDaysCount} j)</span>
                            <span className="w-24 text-right font-mono">-</span>
                            <span className="w-24 text-right font-mono">-{data.absencesDeduction.toLocaleString()} FCFA</span>
                          </div>
                        )}

                        {/* Overtime */}
                        {data.overtimeValue > 0 && (
                          <div className="flex py-0.5 text-emerald-700">
                            <span className="grow font-medium">Heures Supplémentaires Majorées</span>
                            <span className="w-24 text-right font-mono">+{data.overtimeValue.toLocaleString()} FCFA</span>
                            <span className="w-24 text-right font-mono text-slate-300">-</span>
                          </div>
                        )}

                        {/* Variable Primes */}
                        {data.primes > 0 && (
                          <div className="flex py-0.5 text-emerald-700">
                            <span className="grow font-medium">Primes de Rendement exceptionnelles</span>
                            <span className="w-24 text-right font-mono">+{data.primes.toLocaleString()} FCFA</span>
                            <span className="w-24 text-right font-mono text-slate-300">-</span>
                          </div>
                        )}

                        {/* Housing & Transport Allowances */}
                        {data.housingAllowance > 0 && (
                          <div className="flex py-0.5">
                            <span className="grow text-slate-650">Indemnité de Logement Fixe</span>
                            <span className="w-24 text-right font-mono">+{data.housingAllowance.toLocaleString()} FCFA</span>
                            <span className="w-24 text-right font-mono text-slate-300">-</span>
                          </div>
                        )}
                        {data.transportAllowance > 0 && (
                          <div className="flex py-0.5">
                            <span className="grow text-slate-650">Indemnité de Transport Fixe</span>
                            <span className="w-24 text-right font-mono">+{data.transportAllowance.toLocaleString()} FCFA</span>
                            <span className="w-24 text-right font-mono text-slate-300">-</span>
                          </div>
                        )}

                        {/* Social Deductions */}
                        <div className="flex py-0.5 text-amber-800">
                          <span className="grow">Prélèvement social prévoyance CNPS/CNSS ({selectedCountry})</span>
                          <span className="w-24 text-right font-mono text-slate-300">-</span>
                          <span className="w-24 text-right font-mono">-{data.socialCNPS.toLocaleString()} FCFA</span>
                        </div>

                        {selectedCountry === 'Cameroun' && (
                          <div className="flex py-0.5 text-amber-800 font-semibold">
                            <span className="grow">Crédit Foncier Camerounais (CFC 1%)</span>
                            <span className="w-24 text-right font-mono text-slate-300">-</span>
                            <span className="w-24 text-right font-mono">-{data.socialCFC.toLocaleString()} FCFA</span>
                          </div>
                        )}

                        {selectedCountry === 'Gabon' && (
                          <div className="flex py-0.5 text-amber-800">
                            <span className="grow">Assurance Maladie Obligatoire CNAMGS (2.5%)</span>
                            <span className="w-24 text-right font-mono text-slate-300">-</span>
                            <span className="w-24 text-right font-mono">-{data.socialCFC.toLocaleString()} FCFA</span>
                          </div>
                        )}

                        {/* Progressive / Flat taxes */}
                        {data.fiscalTax > 0 && (
                          <div className="flex py-0.5 text-amber-800">
                            <span className="grow">Retenues à la Source d'impôts direct</span>
                            <span className="w-24 text-right font-mono text-slate-300">-</span>
                            <span className="w-24 text-right font-mono">-{data.fiscalTax.toLocaleString()} FCFA</span>
                          </div>
                        )}

                        {/* Family allowances */}
                        {data.familyAllowance > 0 && (
                          <div className="flex py-0.5 text-emerald-700">
                            <span className="grow font-medium">Prestations Familiales directes (Allocations)</span>
                            <span className="w-24 text-right font-mono">+{data.familyAllowance.toLocaleString()} FCFA</span>
                            <span className="w-24 text-right font-mono text-slate-300">-</span>
                          </div>
                        )}

                        {/* Advances deduction */}
                        {data.advances > 0 && (
                          <div className="flex py-0.5 text-red-700">
                            <span className="grow font-semibold">Remboursement Avance/Acomptes perçus</span>
                            <span className="w-24 text-right font-mono text-slate-300">-</span>
                            <span className="w-24 text-right font-mono">-{data.advances.toLocaleString()} FCFA</span>
                          </div>
                        )}
                      </div>

                      {/* Summary Aggregates */}
                      <div className="border-t border-dashed border-slate-300 pt-3.5 space-y-1">
                        <div className="flex justify-between font-bold text-[11px] text-slate-800">
                          <span>Cumul salaire brut imposable :</span>
                          <span className="font-mono">{data.grossSalary.toLocaleString()} FCFA</span>
                        </div>
                        <div className="flex justify-between font-black text-sm text-indigo-800 bg-indigo-50 p-2.5 rounded-xl border border-indigo-200 mt-2">
                          <span>NET À PAYER POUR LA PÉRIODE :</span>
                          <span className="font-mono text-base">{data.netToPay.toLocaleString()} FCFA</span>
                        </div>
                      </div>

                      {/* Footer approval signoff */}
                      <div className="text-[10px] text-slate-400 text-center italic mt-2.5">
                        * Document de travail informatisé généré conformément aux règles fiscales de l'année 2026.
                      </div>
                    </div>
                  );
                })() : (
                  <div className="p-12 text-center text-slate-400 bg-slate-50 border rounded-2xl border-dashed">
                    Selectionnez un personnel et cliquez sur le bouton de génération pour afficher son décompte salarial en temps réel.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 6: BULLETINS DE PAIE EMIS */}
        {activeTab === 'bulletins' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Bulletins Mensuels Enregistrés</h3>
                <p className="text-[10.5px] text-slate-500">Registre légal d'acquittement des salaires et cotisations avec déversement comptable SYSCOHADA.</p>
              </div>
            </div>
            <div className="overflow-x-auto border rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b text-slate-500 font-bold uppercase">
                  <tr>
                    <th className="p-3">Num Bulletin</th>
                    <th className="p-3">Période</th>
                    <th className="p-3">Employé bénéficiaire</th>
                    <th className="p-3 text-right">Base Salaire</th>
                    <th className="p-3 text-right">Primes nettes</th>
                    <th className="p-3 text-right">CNPS/Retenues</th>
                    <th className="p-3 text-right">Impôts / IGR</th>
                    <th className="p-3 text-right">Net à Payer (FCFA)</th>
                    <th className="p-3 text-right">Règlement</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-slate-700">
                  {bulletins.map((bp) => (
                    <tr key={bp.id} className="hover:bg-slate-50 transition">
                      <td className="p-3 font-mono font-bold text-slate-500">{bp.id}</td>
                      <td className="p-3 font-mono font-bold text-slate-400">{bp.periode}</td>
                      <td className="p-3 font-extrabold text-slate-900">{getEmployeeName(bp.idEmploye)}</td>
                      <td className="p-3 text-right font-mono">{bp.salaireBase.toLocaleString()} FCFA</td>
                      <td className="p-3 text-right font-mono text-emerald-600">+{bp.primes.toLocaleString()} FCFA</td>
                      <td className="p-3 text-right font-mono text-red-650">-{bp.cotisationCNPS.toLocaleString()} FCFA</td>
                      <td className="p-3 text-right font-mono text-red-650">-{bp.impotIGR.toLocaleString()} FCFA</td>
                      <td className="p-3 text-right font-black text-indigo-800 bg-indigo-50/20">{bp.netAPayer.toLocaleString()} FCFA</td>
                      <td className="p-3 text-right">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                          bp.statut === 'Payé' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800 animate-pulse'
                        }`}>
                          {bp.statut}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {bulletins.length === 0 && (
                    <tr>
                      <td colSpan={9} className="p-8 text-center text-slate-400 italic font-medium">Aucun bulletin de paie généré dans le registre pour le moment.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* MODAL 1: ADD EMPLOYEE */}
      {showAddEmp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4 backdrop-blur-3xs text-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full border shadow-2xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150">
            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white p-5">
              <h3 className="font-extrabold text-sm flex items-center gap-1">
                <Users className="h-4 w-4" />
                Inscrire un Collaborateur de Terrain
              </h3>
              <p className="text-[10px] text-violet-200 mt-0.5 font-medium">Saisie du dossier administratif et affectation par pôle d'activité.</p>
            </div>
            <form onSubmit={handleAddNewEmployee} className="p-5 space-y-3.5">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Nom Patronymique *</label>
                  <input type="text" required value={newEmpNom} onChange={(e) => setNewEmpNom(e.target.value)} placeholder="Ex: NDEDI" className="w-full border p-2.5 rounded-xl focus:ring-1 focus:ring-violet-500 focus:outline-hidden" />
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Prénom *</label>
                  <input type="text" required value={newEmpPrenom} onChange={(e) => setNewEmpPrenom(e.target.value)} placeholder="Ex: Samuel" className="w-full border p-2.5 rounded-xl focus:ring-1 focus:ring-violet-500 focus:outline-hidden" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Sexe</label>
                  <select value={newEmpSexe} onChange={(e) => setNewEmpSexe(e.target.value as any)} className="w-full border p-2.5 rounded-xl bg-white focus:ring-1 focus:ring-violet-500 focus:outline-hidden">
                    <option value="Mâle">Mâle</option>
                    <option value="Femelle">Femelle</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">{customLabels?.postes || 'Poste Fonctionnel'}</label>
                  <input type="text" value={newEmpPoste} onChange={(e) => setNewEmpPoste(e.target.value)} placeholder="Ex: Éleveur Porcherie" className="w-full border p-2.5 rounded-xl focus:ring-1 focus:ring-violet-500 focus:outline-hidden" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Département Assigné *</label>
                  <select value={newEmpDept} onChange={(e) => setNewEmpDepartment(e.target.value as any)} className="w-full border p-2.5 rounded-xl bg-white focus:ring-1 focus:ring-violet-500 focus:outline-hidden">
                    <option value="Agriculture">Agriculture Production</option>
                    <option value="Élevage">Élevage / Gardien</option>
                    <option value="Administration">Direction / Compta</option>
                    <option value="Commercial">Commerciale</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Type Contrat Initial</label>
                  <select value={newEmpContract} onChange={(e) => setNewEmpContract(e.target.value as any)} className="w-full border p-2.5 rounded-xl bg-white focus:ring-1 focus:ring-violet-500 focus:outline-hidden">
                    <option value="CDI">CDI (Permanent)</option>
                    <option value="CDD">CDD (Saisonnier)</option>
                    <option value="Saisonnier">Collaborateur Journalier</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-slate-600 font-bold mb-1">Salaire de Base Brut Mensuel (FCFA) *</label>
                <input type="number" required value={newEmpSalaire} onChange={(e) => setNewEmpSalaire(parseInt(e.target.value) || 0)} className="w-full border p-2.5 rounded-xl focus:ring-1 focus:ring-violet-550 focus:outline-hidden" />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setShowAddEmploye(false)} className="bg-slate-150 p-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold">Annuler</button>
                <button type="submit" className="bg-violet-600 text-white p-2.5 rounded-xl font-black">Inscrire le personnel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD CONTRACT */}
      {showAddContrat && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4 backdrop-blur-3xs text-xs">
          <div className="bg-white rounded-2xl max-w-md w-full border shadow-2xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150">
            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white p-5">
              <h3 className="font-extrabold text-sm flex items-center gap-1">
                <Briefcase className="h-4 w-4" />
                Rédiger un contrat de travail OHADA
              </h3>
              <p className="text-[10px] text-violet-200 mt-0.5">Enregistrez les indemnités pérennes de logement et transport conventionnel.</p>
            </div>
            <form onSubmit={handleAddNewContrat} className="p-5 space-y-3.5">
              <div>
                <label className="block text-slate-600 font-bold mb-1">Employé bénéficiaire *</label>
                <select value={ncEmp} onChange={(e) => setNcEmp(e.target.value)} className="w-full border p-2.5 rounded-xl bg-white focus:ring-1 focus:ring-violet-500 focus:outline-hidden">
                  {employes.map(e => (
                    <option key={e.id} value={e.id}>{e.prenom} {e.nom}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Type Contrat</label>
                  <select value={ncType} onChange={(e) => setNcType(e.target.value as any)} className="w-full border p-2.5 rounded-xl bg-white focus:ring-1 focus:ring-violet-500">
                    <option value="CDI">CDI Permanent</option>
                    <option value="CDD">CDD Déterminé</option>
                    <option value="Saisonnier">Saisonnier Agricole</option>
                    <option value="Journalier">Journalier / Tâche</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Salaire de Base Brut *</label>
                  <input type="number" required value={ncBase} onChange={(e) => setNcBase(parseInt(e.target.value) || 0)} className="w-full border p-2.5 rounded-xl" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Indemnite Logement Mensuel</label>
                  <input type="number" value={ncLogement} onChange={(e) => setNcLogement(parseInt(e.target.value) || 0)} className="w-full border p-2.5 rounded-xl" />
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Indemnite Transport Mensuel</label>
                  <input type="number" value={ncTransport} onChange={(e) => setNcTransport(parseInt(e.target.value) || 0)} className="w-full border p-2.5 rounded-xl" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Date Signature</label>
                  <input type="date" value={ncDebut} onChange={(e) => setNcDebut(e.target.value)} className="w-full border p-2.5 rounded-xl" />
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Allocations Familiales Fixe</label>
                  <input type="number" value={ncAbsenceAllowance} onChange={(e) => setNcAbsenceAllowance(parseInt(e.target.value) || 0)} className="w-full border p-2.5 rounded-xl" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setShowAddContrat(false)} className="bg-slate-100 p-2.5 rounded-xl border font-bold text-slate-600">Annuler</button>
                <button type="submit" className="bg-violet-600 text-white p-2.5 rounded-xl font-extrabold shadow-sm">Valider & Rédiger</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD PRESENCE */}
      {showAddPres && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4 backdrop-blur-3xs text-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full border shadow-2xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150">
            <div className="bg-violet-600 text-white p-4">
              <h3 className="font-semibold flex items-center gap-1"><Fingerprint className="h-4 w-4" /> Logger pointage d'horaire d'équipe</h3>
            </div>
            <form onSubmit={handleAddNewPresence} className="p-4 space-y-3">
              <div>
                <label className="block text-slate-650 font-bold mb-1">Employé concerné *</label>
                <select value={newPresEmp} onChange={(e) => setNewPresEmp(e.target.value)} className="w-full border p-2.5 rounded-xl bg-white">
                  {employes.map(e => (
                    <option key={e.id} value={e.id}>{e.prenom} {e.nom}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-650 font-bold mb-1">Date effective</label>
                <input type="date" value={newPresDate} onChange={(e) => setNewPresDate(e.target.value)} className="w-full border p-2.5 rounded-xl font-mono" />
              </div>
              <div>
                <label className="block text-slate-650 font-bold mb-1">Statut Présence Pointé</label>
                <select value={newPresStat} onChange={(e) => setNewPresStat(e.target.value as any)} className="w-full border p-2.5 rounded-xl bg-white font-bold">
                  <option value="Présent">Présent (Horaires d'embauche normaux)</option>
                  <option value="Retard">Arrivé Tardive / Retard d'assemblage</option>
                  <option value="Absence Justifiée">Absence Autorisée / Congé Maladie</option>
                  <option value="Absence Injustifiée">Absence non Justifiée (Défalcation base)</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setShowAddPresence(false)} className="bg-slate-100 p-2 rounded">Annuler</button>
                <button type="submit" className="bg-violet-600 text-white p-2 rounded font-black">Valider le log</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: ADD VARIABLE LOG */}
      {showAddVariable && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4 backdrop-blur-3xs text-xs">
          <div className="bg-white rounded-2xl max-w-md w-full border shadow-2xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150">
            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white p-5">
              <h3 className="font-extrabold text-sm flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Saisie des Éléments de Modulation (Variables)
              </h3>
              <p className="text-[10px] text-violet-200 mt-0.5 font-medium">Spécifiez les correctifs salariaux de la période active.</p>
            </div>
            <form onSubmit={handleAddNewVariable} className="p-5 space-y-3.5">
              <div>
                <label className="block text-slate-650 font-bold mb-1">Membre du Personnel *</label>
                <select value={nvEmp} onChange={(e) => setNvEmp(e.target.value)} className="w-full border p-2.5 rounded-xl bg-white focus:ring-1 focus:ring-violet-500">
                  {employes.map(e => (
                    <option key={e.id} value={e.id}>{e.prenom} {e.nom}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-650 font-bold mb-1">Mois / Période *</label>
                  <input type="text" required value={nvPeriode} onChange={(e) => setNvPeriode(e.target.value)} placeholder="MM-YYYY" className="w-full border p-2.5 rounded-xl" />
                </div>
                <div>
                  <label className="block text-slate-650 font-bold mb-1">Primes exceptionnelles</label>
                  <input type="number" value={nvPrimes} onChange={(e) => setNvPrimes(parseInt(e.target.value) || 0)} className="w-full border p-2.5 rounded-xl" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-650 font-bold mb-1">Heures Sup (30% - normal)</label>
                  <input type="number" value={nvHs130} onChange={(e) => setNvHs130(parseFloat(e.target.value) || 0)} className="w-full border p-2.5 rounded-xl font-mono" />
                </div>
                <div>
                  <label className="block text-slate-650 font-bold mb-1">Heures Sup (40% - dimanche)</label>
                  <input type="number" value={nvHs140} onChange={(e) => setNvHs140(parseFloat(e.target.value) || 0)} className="w-full border p-2.5 rounded-xl font-mono" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-650 font-bold mb-1">Déplacements / Indemnités</label>
                  <input type="number" value={nvDeplacement} onChange={(e) => setNvDeplacement(parseInt(e.target.value) || 0)} className="w-full border p-2.5 rounded-xl" />
                </div>
                <div>
                  <label className="block text-slate-650 font-bold mb-1 text-red-600">Acomptes / Avances à déduire</label>
                  <input type="number" value={nvAvances} onChange={(e) => setNvAvances(parseInt(e.target.value) || 0)} className="w-full border p-2.5 rounded-xl font-mono text-red-650 font-bold" />
                </div>
              </div>
              <div>
                <label className="block text-slate-650 font-bold mb-1 text-red-600">Jours d'Absence injustifiée (déduction automatique de base)</label>
                <input type="number" value={nvAbsDays} onChange={(e) => setNvAbsDays(parseInt(e.target.value) || 0)} className="w-full border p-2.5 rounded-xl font-mono font-bold" />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setShowAddVariable(false)} className="bg-slate-100 p-2.5 rounded-xl border text-slate-600 font-bold">Annuler</button>
                <button type="submit" className="bg-violet-600 text-white p-2.5 rounded-xl font-extrabold shadow-sm">Valider & Consigner</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
