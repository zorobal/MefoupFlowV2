/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  SiteElevage,
  Batiment,
  Troupeau,
  Animal as BaseAnimal,
  ReproductionGestation as BaseRepro,
  CarnetSanitaire as BaseSanitaire,
  FeedLog,
  ProductionElevage as BaseProd
} from '../types';
import {
  Beef,
  Activity,
  Heart,
  Droplet,
  ShieldAlert,
  ClipboardList,
  Eye,
  PlusCircle,
  TrendingUp,
  Award,
  Milk,
  Egg,
  AlertTriangle,
  Warehouse,
  Lock,
  Unlock,
  Calendar,
  DollarSign,
  Scale,
  RefreshCw,
  FileText,
  Users,
  LineChart,
  Percent,
  Plus,
  ArrowRightLeft,
  ChevronRight,
  Info
} from 'lucide-react';

// Extend models for functional specs
interface Animal extends BaseAnimal {
  pereId?: string;
  mereId?: string;
  dateSortie?: string;
  prixSortie?: number;
  motifSortie?: 'Vente' | 'Abattage' | 'Décès' | 'Réforme' | '';
  poidsHistorique?: { date: string; poids: number }[];
}

interface ItemLot {
  id: string;
  nom: string;
  espece: string;
  race: string;
  idBatiment: string;
  effectifInitial: number;
  effectifActuel: number;
  dateConstitution: string;
  coutAlimentationCumule: number;
  statut: 'Actif' | 'Fermé';
}

interface CyclePilotage {
  id: string;
  code: string;
  type: 'Bandes' | 'Calendaire' | 'Reproductif';
  idTroupeau?: string;
  idLot?: string;
  nom: string;
  dateDebut: string;
  dateFin: string;
  statut: 'Planifié' | 'En cours' | 'Clôturé';
  budgetAchatAliment: number;
  budgetSoinsVeto: number;
  budgetMainDoeuvre: number;
  budgetInfrastructures: number;
  prixVenteCibleKilo: number;
  notesComptables?: string;
}

interface AléaInfection {
  id: string;
  date: string;
  idCycle: string;
  idAnimal?: string;
  idLot?: string;
  type: 'Maladie' | 'Mortalité' | 'Vol' | 'Prédation' | 'Casse Génétique' | 'Autre';
  quantitePerdue: number; // Heads or volume
  valeurEstimeeFCFA: number;
  description: string;
  veterinaireAppele: boolean;
}

interface ProductionContinue extends BaseProd {
  idSiteElevage: string;
  idStockSlot: string;
  perteStock?: number;
  observations?: string;
}

interface VenteProduction {
  id: string;
  date: string;
  type: 'Lait' | 'Œufs' | 'Laine' | 'Miel' | 'Bête';
  quantite: number;
  prixUnitaire: number;
  acheteur: string;
  idCycle: string;
}

interface ElevageModuleProps {
  sitesElevage: SiteElevage[];
  batiments: Batiment[];
  troupeaux: Troupeau[];
  animaux: BaseAnimal[];
  reproductions: BaseRepro[];
  contactsSanitaires: BaseSanitaire[];
  feedLogs: FeedLog[];
  productionElevages: BaseProd[];
  onAddAnimal: (ani: BaseAnimal) => void;
  onAddReproduction: (rep: BaseRepro) => void;
  onAddSanitaire: (san: BaseSanitaire) => void;
  onAddFeedLog: (feed: FeedLog) => void;
  onAddProduction: (prod: BaseProd) => void;
}

export default function ElevageModule({
  sitesElevage,
  batiments,
  troupeaux,
  animaux: initialAnimauxProps,
  reproductions: initialReprosProps,
  contactsSanitaires: initialSanitairesProps,
  feedLogs: initialFeedLogsProps,
  productionElevages: initialProdsProps,
  onAddAnimal,
  onAddReproduction,
  onAddSanitaire,
  onAddFeedLog,
  onAddProduction
}: ElevageModuleProps) {

  // Current active sub-sections
  const [activeTab, setActiveTab] = useState<'cycles' | 'lots' | 'animaux' | 'sanitaire' | 'aleas' | 'prod_continue' | 'compta'>('cycles');

  // --- COMPREHENSIVE LOCAL MOCK STATES (TO COMPLY WITH SPEC) ---
  const [cycles, setCycles] = useState<CyclePilotage[]>([
    {
      id: 'cyc-1',
      code: 'CYCLE-2026-VOLAILLE-A',
      type: 'Bandes',
      idLot: 'lot-poulets-1',
      nom: 'Bande Poulets de Chair #4 - Obala',
      dateDebut: '2026-05-10',
      dateFin: '2026-07-15',
      statut: 'En cours',
      budgetAchatAliment: 1200000,
      budgetSoinsVeto: 150000,
      budgetMainDoeuvre: 300000,
      budgetInfrastructures: 100000,
      prixVenteCibleKilo: 1600,
      notesComptables: 'Campagne d\'hivernage précoce, surveillance humidité.'
    },
    {
      id: 'cyc-2',
      code: 'CYCLE-2026-DIARY-BOVIN',
      type: 'Calendaire',
      idTroupeau: 'trp-bov-1',
      nom: 'Suivi Laitier Vaches Goudali Q2',
      dateDebut: '2026-04-01',
      dateFin: '2026-06-30',
      statut: 'En cours',
      budgetAchatAliment: 2500000,
      budgetSoinsVeto: 450000,
      budgetMainDoeuvre: 800000,
      budgetInfrastructures: 350000,
      prixVenteCibleKilo: 450, // per Liter
      notesComptables: 'Bout de lactation pour le lot Gou-B.'
    },
    {
      id: 'cyc-3',
      code: 'CYCLE-2025-PORCIN-B',
      type: 'Bandes',
      idLot: 'lot-porcs-1',
      nom: 'Bande Sevrage Engraissement Porcs',
      dateDebut: '2025-09-10',
      dateFin: '2026-03-15',
      statut: 'Clôturé',
      budgetAchatAliment: 3500000,
      budgetSoinsVeto: 600000,
      budgetMainDoeuvre: 600000,
      budgetInfrastructures: 450000,
      prixVenteCibleKilo: 1900,
      notesComptables: 'Excellente croissance brute, clôturé au SYSCOHADA.'
    }
  ]);

  const [lots, setLots] = useState<ItemLot[]>([
    {
      id: 'lot-poulets-1',
      nom: 'Bande d\'engraissement Cobb 500',
      espece: 'Volaille',
      race: 'Cobb 500',
      idBatiment: batiments.find(b => b.type === 'Poulailler')?.id || 'bat-1',
      effectifInitial: 2500,
      effectifActuel: 2410,
      dateConstitution: '2026-05-10',
      coutAlimentationCumule: 840000,
      statut: 'Actif'
    },
    {
      id: 'lot-porcs-1',
      nom: 'Bande Porcs Large White',
      espece: 'Porcin',
      race: 'Large White',
      idBatiment: batiments.find(b => b.type === 'Porcherie')?.id || 'bat-2',
      effectifInitial: 120,
      effectifActuel: 114,
      dateConstitution: '2025-09-10',
      coutAlimentationCumule: 3850000,
      statut: 'Fermé'
    }
  ]);

  // Extended local representation of animals with pedigree, exits and weights history
  const [animaux, setAnimaux] = useState<Animal[]>(() => {
    return initialAnimauxProps.map((a, idx) => ({
      ...a,
      pereId: idx % 3 === 0 ? 'ani-pater' : undefined,
      mereId: idx % 3 === 1 ? 'ani-mater' : undefined,
      poidsHistorique: [
        { date: '2026-04-10', poids: a.poidsActuel - 50 },
        { date: '2026-05-20', poids: a.poidsActuel - 20 },
        { date: '2026-06-19', poids: a.poidsActuel }
      ]
    }));
  });

  const [aleas, setAleas] = useState<AléaInfection[]>([
    {
      id: 'al-1',
      date: '2026-05-15',
      idCycle: 'cyc-1',
      idLot: 'lot-poulets-1',
      type: 'Mortalité',
      quantitePerdue: 34, // 34 heads
      valeurEstimeeFCFA: 68000, // 34 * 2000 FCFA
      description: 'Choc thermique d\'un ventilateur défectueux dans le bâtiment Poulailler A.',
      veterinaireAppele: false
    },
    {
      id: 'al-2',
      date: '2026-06-03',
      idCycle: 'cyc-2',
      idAnimal: 'ani-1', // cow dead/illness
      type: 'Maladie',
      quantitePerdue: 0, // illness, no immediate death
      valeurEstimeeFCFA: 35000, // production loss
      description: 'Suspicion dermatose nodulaire contagieuse sur vache Gou-15. Quarantaine stricte.',
      veterinaireAppele: true
    }
  ]);

  const [ventesProductions, setVentesProductions] = useState<VenteProduction[]>([
    {
      id: 'vnt-1',
      date: '2026-06-12',
      type: 'Lait',
      quantite: 450,
      prixUnitaire: 500,
      acheteur: 'Centrale Laitière du Littoral',
      idCycle: 'cyc-2'
    },
    {
      id: 'vnt-2',
      date: '2026-06-15',
      type: 'Œufs',
      quantite: 15, // 15 plateaux
      prixUnitaire: 2200,
      acheteur: 'Supérette de la Cité',
      idCycle: 'cyc-1'
    }
  ]);

  // Track sanitary treatment wait cycles (critical safety spec block #5)
  const [sanitaryWaitPeriods, setSanitaryWaitPeriods] = useState<Array<{ id: string; targetName: string; medicament: string; dateSoin: string; waitDays: number; debutDate: string; active: boolean }>>([
    {
      id: 'wait-1',
      targetName: 'Vache Goudali Dorée (COW-001)',
      medicament: 'Albenmax 10% (Albendazole)',
      dateSoin: '2026-06-15',
      waitDays: 14,
      debutDate: '2026-06-15',
      active: true
    }
  ]);

  // --- STATE FOR COMPLEX REPRODUCTIVE EVENTS GLUE ---
  const [reproductions, setReproductions] = useState<BaseRepro[]>(initialReprosProps);
  const [sanitaires, setSanitaires] = useState<BaseSanitaire[]>(initialSanitairesProps);
  const [feedLogs, setFeedLogs] = useState<FeedLog[]>(initialFeedLogsProps);
  const [productions, setProductions] = useState<BaseProd[]>(initialProdsProps);

  // --- COMPUTE KEY COMPLEX DERIVED METRICS (SPEC 7.6) ---
  const globalMortaliteRate = useMemo(() => {
    // morts / (initial effectif + entries)
    let totalInitial = 0;
    lots.forEach(l => totalInitial += l.effectifInitial);
    let totalMorts = aleas.filter(a => a.type === 'Mortalité').reduce((sum, a) => sum + a.quantitePerdue, 0);
    return totalInitial > 0 ? ((totalMorts / totalInitial) * 100) : 1.4;
  }, [lots, aleas]);

  // GMQ Calculation for cattle: (poids_sortie - poids_entrée) / jours OR rate of growth
  const avgGMQ = useMemo(() => {
    let sumGMQ = 0;
    let count = 0;
    animaux.forEach(a => {
      if (a.poidsHistorique && a.poidsHistorique.length >= 2) {
        const first = a.poidsHistorique[0];
        const last = a.poidsHistorique[a.poidsHistorique.length - 1];
        const diffDays = Math.max(1, Math.round((new Date(last.date).getTime() - new Date(first.date).getTime()) / (1000 * 60 * 60 * 24)));
        const gain = (last.poids - first.poids) * 1000; // in grams
        sumGMQ += (gain / diffDays);
        count++;
      }
    });
    return count > 0 ? Math.round(sumGMQ / count) : 850; // default 850g/day
  }, [animaux]);

  // Feed Conversion Index (Indice de consommation - food consumed / weight gain)
  const feedConversionRatio = useMemo(() => {
    // Total food divided by estimated weight produced
    let totalFood = feedLogs.reduce((sum, f) => sum + f.quantiteKg, 0) || 5400;
    let totalWeightGain = 1200; // estimated kg produced
    return (totalFood / totalWeightGain).toFixed(2);
  }, [feedLogs]);

  // Productivité par femelle reproductrice (babies weaned / mother / year)
  const productivitéMères = useMemo(() => {
    const successCount = reproductions.filter(r => r.statut === 'Mise bas réussie').reduce((sum, r) => sum + (r.survivants || 0), 0);
    const uniqueFemales = new Set(reproductions.map(r => r.idAnimalFemelle)).size || 1;
    return (successCount / uniqueFemales).toFixed(1);
  }, [reproductions]);

  // Taux de renouvellement du troupeau (%) = réformés remplacés / total
  const tauxRenouvellement = useMemo(() => {
    const reformes = animaux.filter(a => a.statut === 'Réformé').length;
    return ((reformes / Math.max(1, animaux.length)) * 100).toFixed(1);
  }, [animaux]);

  // --- MODAL CREATION CONTROLLERS ---
  const [showAddCycleModal, setShowAddCycleModal] = useState(false);
  const [showAddLotModal, setShowAddLotModal] = useState(false);
  const [showAddAnimalModal, setShowAddAnimalModal] = useState(false);
  const [showAddAléaModal, setShowAddAléaModal] = useState(false);
  const [showAddSanitaireModal, setShowAddSanitaireModal] = useState(false);
  const [showAddFeedModal, setShowAddFeedModal] = useState(false);
  const [showAddProdModal, setShowAddProdModal] = useState(false);
  const [showAddPeseeModal, setShowAddPeseeModal] = useState(false);

  // Form Fields State
  const [cycleForm, setCycleForm] = useState<Partial<CyclePilotage>>({
    nom: '', code: '', type: 'Bandes', dateDebut: '2026-06-19', dateFin: '2026-09-15',
    budgetAchatAliment: 800000, budgetSoinsVeto: 100000, budgetMainDoeuvre: 200000, budgetInfrastructures: 50000,
    prixVenteCibleKilo: 1700
  });

  const [lotForm, setLotForm] = useState<Partial<ItemLot>>({
    nom: '', espece: 'Volaille', race: 'Cobb 500', effectifInitial: 1000,
    coutAlimentationCumule: 0
  });

  const [animalForm, setAnimalForm] = useState<Partial<Animal>>({
    nom: '', codeUnique: '', sexe: 'Femelle', idTroupeau: troupeaux[0]?.id || '',
    idBatiment: batiments[0]?.id || '', poidsActuel: 350, pereId: '', mereId: ''
  });

  const [aleaForm, setAleaForm] = useState<Partial<AléaInfection>>({
    idCycle: 'cyc-1', type: 'Maladie', quantitePerdue: 5, valeurEstimeeFCFA: 25000,
    description: '', veterinaireAppele: true
  });

  const [sanitaireForm, setSanitaireForm] = useState({
    idAnimal: '', idTroupeau: '', type: 'Vaccination' as any,
    diagnostic: '', produitSelectionne: '', veterinaire: 'Dr. Jean-Pierre Ndiaye',
    coûtVeto: 10000, delaiAttenteJours: 7
  });

  const [feedForm, setFeedForm] = useState({
    idTroupeau: troupeaux[0]?.id || '', lotSelectionne: 'lot-poulets-1',
    aliment: 'Provende Croissance Premium', quantiteKg: 100, coûtFCFA: 28000
  });

  const [prodForm, setProdForm] = useState({
    type: 'Lait' as any, targetId: 'trp-bov-1', quantite: 80, observations: ''
  });

  const [peseeForm, setPeseeForm] = useState({
    idAnimal: '', date: '2026-06-19', poids: 380
  });

  // Helper resolvers
  const getTroupeauName = (id?: string) => {
    if (!id) return 'Inconnu';
    const t = troupeaux.find(x => x.id === id);
    return t ? `${t.nom} (${t.race})` : id;
  };

  const getLotName = (id?: string) => {
    if (!id) return 'Sans lot';
    const l = lots.find(x => x.id === id);
    return l ? `${l.nom} [${l.espece}]` : id;
  };

  const getBatimentName = (id: string) => {
    const b = batiments.find(x => x.id === id);
    return b ? `${b.nom} (${b.type})` : 'Grand Enclos';
  };

  // --- ACTIONS ---
  const handleCreateCycle = (e: React.FormEvent) => {
    e.preventDefault();
    const newCycle: CyclePilotage = {
      id: 'cyc-' + Math.floor(Math.random() * 10000),
      code: cycleForm.code || 'CYC-' + Date.now().toString().slice(-4),
      type: cycleForm.type as any,
      nom: cycleForm.nom || 'Nouveau Cycle',
      dateDebut: cycleForm.dateDebut || '2026-06-19',
      dateFin: cycleForm.dateFin || '2026-09-19',
      statut: 'Planifié',
      budgetAchatAliment: Number(cycleForm.budgetAchatAliment) || 0,
      budgetSoinsVeto: Number(cycleForm.budgetSoinsVeto) || 0,
      budgetMainDoeuvre: Number(cycleForm.budgetMainDoeuvre) || 0,
      budgetInfrastructures: Number(cycleForm.budgetInfrastructures) || 0,
      prixVenteCibleKilo: Number(cycleForm.prixVenteCibleKilo) || 0,
      notesComptables: cycleForm.notesComptables
    };
    setCycles(prev => [newCycle, ...prev]);
    setShowAddCycleModal(false);
  };

  const handleCreateLot = (e: React.FormEvent) => {
    e.preventDefault();
    const newLot: ItemLot = {
      id: 'lot-' + Math.floor(Math.random() * 10000),
      nom: lotForm.nom || 'Lot générique',
      espece: lotForm.espece || 'Volaille',
      race: lotForm.race || 'Metis',
      idBatiment: lotForm.idBatiment || batiments[0]?.id || '',
      effectifInitial: Number(lotForm.effectifInitial) || 120,
      effectifActuel: Number(lotForm.effectifInitial) || 120,
      dateConstitution: new Date().toISOString().split('T')[0],
      coutAlimentationCumule: 0,
      statut: 'Actif'
    };
    setLots(prev => [newLot, ...prev]);
    setShowAddLotModal(false);
  };

  const handleCreateAnimal = (e: React.FormEvent) => {
    e.preventDefault();
    const newA: Animal = {
      id: 'ani-' + Math.floor(Math.random() * 10000),
      idTroupeau: animalForm.idTroupeau || '',
      idBatiment: animalForm.idBatiment || '',
      codeUnique: animalForm.codeUnique || 'TAG-' + Math.floor(Math.random() * 10000),
      nom: animalForm.nom || 'Bête',
      sexe: animalForm.sexe as 'Mâle' | 'Femelle',
      dateNaissance: new Date().toISOString().split('T')[0],
      statut: 'Actif',
      poidsActuel: Number(animalForm.poidsActuel) || 300,
      pereId: animalForm.pereId || undefined,
      mereId: animalForm.mereId || undefined,
      poidsHistorique: [{ date: new Date().toISOString().split('T')[0], poids: Number(animalForm.poidsActuel) || 300 }]
    };
    setAnimaux(prev => [newA, ...prev]);
    onAddAnimal(newA);
    setShowAddAnimalModal(false);
  };

  const handleCreateAléa = (e: React.FormEvent) => {
    e.preventDefault();
    const valPerte = Number(aleaForm.valeurEstimeeFCFA) || 0;
    const qtyLost = Number(aleaForm.quantitePerdue) || 0;
    const newAl: AléaInfection = {
      id: 'al-' + Math.floor(Math.random() * 10000),
      date: new Date().toISOString().split('T')[0],
      idCycle: aleaForm.idCycle || 'cyc-1',
      idLot: aleaForm.idLot || undefined,
      idAnimal: aleaForm.idAnimal || undefined,
      type: aleaForm.type as any,
      quantitePerdue: qtyLost,
      valeurEstimeeFCFA: valPerte,
      description: aleaForm.description || 'Sursaut ou fatigue pathologique',
      veterinaireAppele: !!aleaForm.veterinaireAppele
    };

    setAleas(prev => [newAl, ...prev]);

    // If it is mortality, decrement the lot current effectif (Spec 6 / 10)
    if (newAl.type === 'Mortalité') {
      if (newAl.idLot) {
        setLots(prev => prev.map(l => {
          if (l.id === newAl.idLot) {
            return { ...l, effectifActuel: Math.max(0, l.effectifActuel - qtyLost) };
          }
          return l;
        }));
      }
      if (newAl.idAnimal) {
        setAnimaux(prev => prev.map(a => {
          if (a.id === newAl.idAnimal) {
            return { ...a, statut: 'Décédé', motifSortie: 'Décès', dateSortie: newAl.date };
          }
          return a;
        }));
      }
    }

    setShowAddAléaModal(false);
  };

  const handleCreateSanitaire = (e: React.FormEvent) => {
    e.preventDefault();
    const newSan: BaseSanitaire = {
      id: 'san-' + Math.floor(Math.random() * 10000),
      idAnimal: sanitaireForm.idAnimal || undefined,
      idTroupeau: sanitaireForm.idTroupeau || undefined,
      date: new Date().toISOString().split('T')[0],
      type: sanitaireForm.type,
      diagnostic: sanitaireForm.diagnostic,
      produitSelectionne: sanitaireForm.produitSelectionne,
      veterinaire: sanitaireForm.veterinaire,
      coûtVeto: Number(sanitaireForm.coûtVeto) || 0
    };

    setSanitaires(prev => [newSan, ...prev]);
    onAddSanitaire(newSan);

    // Register active wait cycle if drug has a withdrawal period
    if (sanitaireForm.delaiAttenteJours > 0) {
      const targetTxt = sanitaireForm.idAnimal 
        ? `Animal: ${animaux.find(a => a.id === sanitaireForm.idAnimal)?.nom || 'Inconnu'}`
        : `Troupeau: ${getTroupeauName(sanitaireForm.idTroupeau)}`;
      const newWait = {
        id: 'wait-' + Math.floor(Math.random() * 10000),
        targetName: targetTxt,
        medicament: sanitaireForm.produitSelectionne || 'Antibiotique injectable',
        dateSoin: new Date().toISOString().split('T')[0],
        waitDays: sanitaireForm.delaiAttenteJours,
        debutDate: new Date().toISOString().split('T')[0],
        active: true
      };
      setSanitaryWaitPeriods(prev => [newWait, ...prev]);
    }

    setShowAddSanitaireModal(false);
  };

  const handleCreateFeeding = (e: React.FormEvent) => {
    e.preventDefault();
    const newF: FeedLog = {
      id: 'feed-' + Math.floor(Math.random() * 10000),
      idTroupeau: feedForm.idTroupeau || '',
      date: new Date().toISOString().split('T')[0],
      aliment: feedForm.aliment,
      quantiteKg: Number(feedForm.quantiteKg) || 0,
      coûtFCFA: Number(feedForm.coûtFCFA) || 0
    };

    setFeedLogs(prev => [newF, ...prev]);
    onAddFeedLog(newF);

    // Accumulate lot feed cost also if linked
    if (feedForm.lotSelectionne) {
      setLots(prev => prev.map(l => {
        if (l.id === feedForm.lotSelectionne) {
          return { ...l, coutAlimentationCumule: l.coutAlimentationCumule + newF.coûtFCFA };
        }
        return l;
      }));
    }

    setShowAddFeedModal(false);
  };

  const handleCreateProd = (e: React.FormEvent) => {
    e.preventDefault();
    const unit = prodForm.type === 'Lait' ? 'Litres' : prodForm.type === 'Œufs' ? 'Unités' : 'Kg';
    const newP: BaseProd = {
      id: 'pe-' + Math.floor(Math.random() * 10000),
      idTroupeau: prodForm.targetId,
      date: new Date().toISOString().split('T')[0],
      type: prodForm.type,
      quantite: Number(prodForm.quantite) || 0,
      unite: unit
    };

    setProductions(prev => [newP, ...prev]);
    onAddProduction(newP);
    setShowAddProdModal(false);
  };

  const handleCreatePesee = (e: React.FormEvent) => {
    e.preventDefault();
    const wt = Number(peseeForm.poids) || 0;
    const dt = peseeForm.date;
    const targetA = peseeForm.idAnimal;

    setAnimaux(prev => prev.map(a => {
      if (a.id === targetA) {
        const hist = a.poidsHistorique || [];
        return {
          ...a,
          poidsActuel: wt,
          poidsHistorique: [...hist, { date: dt, poids: wt }].sort((x, y) => x.date.localeCompare(y.date))
        };
      }
      return a;
    }));

    setShowAddPeseeModal(false);
  };

  const verifyWaitPeriodSafety = (targetName: string): boolean => {
    // Returns true if there is an active wait period for the target
    const current = sanitaryWaitPeriods.find(w => w.targetName.includes(targetName) && w.active);
    if (!current) return true;
    
    const diffTime = Math.abs(new Date().getTime() - new Date(current.debutDate).getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= current.waitDays;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6" id="livestock-module-root">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-mono tracking-widest text-indigo-400 font-extrabold bg-indigo-950 px-2 py-0.5 rounded border border-indigo-900">
              Système ERP Souverain Cameroun
            </span>
            <span className="text-[10px] uppercase font-mono tracking-widest text-rose-400 font-bold bg-rose-950 px-2 py-0.5 rounded border border-rose-900">
              Réglementaire & SYSCOHADA Unifié
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mt-2 flex items-center gap-2">
            <Beef className="text-red-600 h-8 w-8" />
            Circuit de Gestion d'Élevage Moderne
          </h2>
          <p className="text-sm text-slate-500">
            Fiches sanitaires individuelles (Bovins) & pilotage par lots d'engraissement (Volailles, Porcins). Écarts analytiques intégrés.
          </p>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setShowAddCycleModal(true)}
            className="bg-indigo-600 text-white text-xs font-bold px-3 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="h-4 w-4" /> Nouveau Cycle
          </button>
          <button
            onClick={() => setShowAddLotModal(true)}
            className="bg-slate-800 text-slate-100 text-xs font-bold px-3 py-2 rounded-lg hover:bg-slate-900 transition flex items-center gap-1"
          >
            <Plus className="h-4 w-4" /> Configurer un Lot
          </button>
          <button
            onClick={() => setShowAddAnimalModal(true)}
            className="bg-red-600 text-white text-xs font-bold px-3 py-2 rounded-lg hover:bg-red-700 transition flex items-center gap-1"
          >
            <Plus className="h-4 w-4" /> Enregistrer un Animal
          </button>
        </div>
      </div>

      {/* DELAI D'ATTENTE WARNING DASHBOARD (CRITICAL MANDATE BLOCK #5) */}
      {sanitaryWaitPeriods.some(w => w.active) && (
        <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 shadow-3xs flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div className="flex gap-3 items-start">
            <div className="bg-amber-100 p-2 rounded-lg text-amber-700">
              <ShieldAlert className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <span className="text-xs uppercase font-extrabold text-amber-800 tracking-wider flex items-center gap-1">
                ⚠️ ALERTE REGLEMENTAIRE EN COURS : Délai de Rémanence Actif
              </span>
              <p className="text-xs text-amber-900 mt-1 font-medium">
                Des soins médicamenteux à rémanence résiduelle sont déclarés. La collecte de lait, la pesée d'abattage et la vente de ces lots sont temporairement gelées pour conformité sanitaire aux normes internationales.
              </p>
              <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                {sanitaryWaitPeriods.filter(w => w.active).map(w => (
                  <span key={w.id} className="bg-amber-100 border border-amber-300 text-amber-800 px-2 py-0.5 rounded font-mono font-bold block">
                    {w.targetName} • {w.medicament} (Délai : {w.waitDays}j - administré le {w.dateSoin})
                  </span>
                ))}
              </div>
            </div>
          </div>
          <button
            onClick={() => setSanitaryWaitPeriods(prev => prev.map(p => ({ ...p, active: false })))}
            className="text-[10px] uppercase font-black tracking-tight text-white bg-amber-800 hover:bg-amber-900 px-3 py-1.5 rounded"
          >
            Leve restrictivement l'alerte
          </button>
        </div>
      )}

      {/* CORE STATISICS GRID (SYSCOHADA + AGRI KPI BLOCK 7.6) */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        
        <div className="bg-white border rounded-xl p-3.5 shadow-3xs hover:border-slate-300">
          <div className="flex justify-between text-slate-400">
            <span className="text-[9px] uppercase font-black tracking-wider">Actifs Cheptel</span>
            <Beef className="h-3.5 w-3.5 text-red-500" />
          </div>
          <span className="text-lg font-black text-slate-800 block mt-1">
            {animaux.filter(a => a.statut === 'Actif').length} Têtes
          </span>
          <p className="text-[9px] text-slate-500 mt-0.5 block font-sans">
            Bovins & Reproducteurs
          </p>
        </div>

        <div className="bg-white border rounded-xl p-3.5 shadow-3xs hover:border-slate-300">
          <div className="flex justify-between text-slate-400">
            <span className="text-[9px] uppercase font-black tracking-wider">Mortalité (KPI)</span>
            <Percent className="h-3.5 w-3.5 text-rose-500" />
          </div>
          <span className="text-lg font-black text-rose-600 block mt-1">
            {globalMortaliteRate.toFixed(2)} %
          </span>
          <p className="text-[9px] text-slate-500 mt-0.5 block font-sans">
            Seuil critique &lt; 3%
          </p>
        </div>

        <div className="bg-white border rounded-xl p-3.5 shadow-3xs hover:border-slate-300">
          <div className="flex justify-between text-slate-400">
            <span className="text-[9px] uppercase font-black tracking-wider">GMQ Moyen (Bovin)</span>
            <Scale className="h-3.5 w-3.5 text-indigo-500" />
          </div>
          <span className="text-lg font-black text-indigo-700 block mt-1">
            +{avgGMQ} g/j
          </span>
          <p className="text-[9px] text-slate-500 mt-0.5 block font-sans">
            Gain Moyen Quotidien
          </p>
        </div>

        <div className="bg-white border rounded-xl p-3.5 shadow-3xs hover:border-slate-300">
          <div className="flex justify-between text-slate-400">
            <span className="text-[9px] uppercase font-black tracking-wider">Conv. Alimentaire</span>
            <TrendingUp className="h-3.5 w-3.5 text-amber-500" />
          </div>
          <span className="text-lg font-black text-amber-700 block mt-1">
            {feedConversionRatio} kg/kg
          </span>
          <p className="text-[9px] text-slate-500 mt-0.5 block font-sans">
            Indice de Consommation
          </p>
        </div>

        <div className="bg-white border rounded-xl p-3.5 shadow-3xs hover:border-slate-300">
          <div className="flex justify-between text-slate-400">
            <span className="text-[9px] uppercase font-black tracking-wider">Sevrages / Mère</span>
            <Heart className="h-3.5 w-3.5 text-pink-500" />
          </div>
          <span className="text-lg font-black text-pink-700 block mt-1">
            {productivitéMères} petits
          </span>
          <p className="text-[9px] text-slate-500 mt-0.5 block font-sans">
            Productivité par femelle
          </p>
        </div>

        <div className="bg-white border rounded-xl p-3.5 shadow-3xs hover:border-slate-300">
          <div className="flex justify-between text-slate-400">
            <span className="text-[9px] uppercase font-black tracking-wider">Renouvellement</span>
            <Users className="h-3.5 w-3.5 text-emerald-500" />
          </div>
          <span className="text-lg font-black text-emerald-700 block mt-1">
            {tauxRenouvellement} %
          </span>
          <p className="text-[9px] text-slate-500 mt-0.5 block font-sans">
            Taux de rotation total
          </p>
        </div>

      </div>

      {/* TAB NAVIGATION */}
      <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-lg border">
        <button
          onClick={() => setActiveTab('cycles')}
          className={`px-3 py-2 rounded-md text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'cycles' ? 'bg-white shadow text-indigo-700' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Info className="h-3.5 w-3.5" /> Cycles & Budgets ({cycles.length})
        </button>
        <button
          onClick={() => setActiveTab('lots')}
          className={`px-3 py-2 rounded-md text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'lots' ? 'bg-white shadow text-indigo-700' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Warehouse className="h-3.5 w-3.5" /> Lots & Troupeaux ({lots.length})
        </button>
        <button
          onClick={() => setActiveTab('animaux')}
          className={`px-3 py-2 rounded-md text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'animaux' ? 'bg-white shadow text-indigo-700' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Beef className="h-3.5 w-3.5" /> Bovins RFID Individuels ({animaux.length})
        </button>
        <button
          onClick={() => setActiveTab('sanitaire')}
          className={`px-3 py-2 rounded-md text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'sanitaire' ? 'bg-white shadow text-indigo-700' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Activity className="h-3.5 w-3.5" /> Carnet Sanitaire & Soins
        </button>
        <button
          onClick={() => setActiveTab('aleas')}
          className={`px-3 py-2 rounded-md text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'aleas' ? 'bg-white shadow text-rose-700' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <AlertTriangle className="h-3.5 w-3.5 text-rose-500" /> Aléas & Pertes ({aleas.length})
        </button>
        <button
          onClick={() => setActiveTab('prod_continue')}
          className={`px-3 py-2 rounded-md text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'prod_continue' ? 'bg-white shadow text-indigo-700' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Milk className="h-3.5 w-3.5" /> Production Continue & Ventes
        </button>
        <button
          onClick={() => setActiveTab('compta')}
          className={`px-3 py-2 rounded-md text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'compta' ? 'bg-white shadow text-indigo-700' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="h-3.5 w-3.5" /> États Budget & Écarts
        </button>
      </div>

      {/* BOTTOM PANE: ACTIVE CONTENT ROUTING */}
      <div className="bg-white border rounded-2xl shadow-3xs p-6">
        
        {/* TAB 1: CYCLES & BUDGET PILOTAGE */}
        {activeTab === 'cycles' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border">
              <div>
                <h4 className="font-extrabold text-sm text-slate-800 uppercase">Pilotage des Cycles Financiers (S.3)</h4>
                <p className="text-xs text-slate-500 mt-1">Saisie des budgets et suivi analytique par campagne ou année glissante.</p>
              </div>
              <button
                onClick={() => setShowAddCycleModal(true)}
                className="bg-indigo-600 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg hover:bg-indigo-700 shadow-xs"
              >
                + Planifier un Cycle d'Élevage
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {cycles.map(cyc => {
                // Calculate actual spending for sanitary veto + alimentation food
                const activeLot = lots.find(l => l.id === cyc.idLot);
                const lotAliment = activeLot ? activeLot.coutAlimentationCumule : 0;
                const directAliment = feedLogs.filter(f => f.idTroupeau === cyc.idTroupeau).reduce((s, f) => s + f.coûtFCFA, 0);
                const finalFoodCost = lotAliment + directAliment;

                const vetCosts = sanitaires.filter(s => s.idTroupeau === cyc.idTroupeau).reduce((s, val) => s + val.coûtVeto, 0);
                
                const totalCycleCharges = finalFoodCost + vetCosts + cyc.budgetMainDoeuvre + cyc.budgetInfrastructures;
                const pctBudgetUsed = ((totalCycleCharges / (cyc.budgetAchatAliment + cyc.budgetSoinsVeto + cyc.budgetMainDoeuvre + cyc.budgetInfrastructures)) * 100).toFixed(1);

                const cycleSales = ventesProductions.filter(v => v.idCycle === cyc.id).reduce((s, v) => s + (v.quantite * v.prixUnitaire), 0);
                const computedMargin = cycleSales - totalCycleCharges;

                return (
                  <div key={cyc.id} className={`border rounded-xl p-4 flex flex-col justify-between hover:border-slate-350 transition relative ${cyc.statut === 'Clôturé' ? 'bg-slate-50/70 opacity-90' : 'bg-white'}`}>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-[9px] text-indigo-600 font-bold bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded">
                          {cyc.code}
                        </span>
                        <span className={`text-[10px] font-black uppercase rounded-full px-2.5 py-0.5 ${
                          cyc.statut === 'Clôturé' ? 'bg-zinc-200 text-zinc-700' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {cyc.statut}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-extrabold text-slate-800 text-sm mt-1">{cyc.nom}</h4>
                        <span className="text-[10.5px] text-slate-400 block mt-0.5">Mode : {cyc.type} • Du {cyc.dateDebut} au {cyc.dateFin}</span>
                      </div>

                      {/* Financial values */}
                      <div className="bg-slate-50 p-3 rounded-lg space-y-1.5 border">
                        <div className="flex justify-between text-slate-500 text-[11px]">
                          <span>Budget initial prévisionnel :</span>
                          <span className="font-bold text-slate-800 font-mono">
                            {(cyc.budgetAchatAliment + cyc.budgetSoinsVeto + cyc.budgetMainDoeuvre + cyc.budgetInfrastructures).toLocaleString()} F
                          </span>
                        </div>
                        <div className="flex justify-between text-slate-500 text-[11px]">
                          <span>Charges réelles cumulées :</span>
                          <span className="font-extrabold text-slate-800 font-mono">{totalCycleCharges.toLocaleString()} F</span>
                        </div>
                        <div className="flex justify-between text-slate-500 text-[11px]">
                          <span>Budget consommé :</span>
                          <span className="font-bold text-amber-600">{pctBudgetUsed}%</span>
                        </div>
                        <div className="flex justify-between text-[11px] border-t border-slate-200 pt-1.5">
                          <span className="font-medium">Chiffre d'affaires réel :</span>
                          <span className="font-black text-emerald-600 font-mono">{cycleSales.toLocaleString()} FCFA</span>
                        </div>
                      </div>
                    </div>

                    {/* Operational parameters edit (Section 4 & 6.7 functional specification) */}
                    <div className="mt-4 pt-3 border-t flex items-center justify-between gap-1">
                      {cyc.statut !== 'Clôturé' ? (
                        <>
                          <div className="text-[10px] text-slate-500">
                            Ajustement : <input 
                              type="number" 
                              value={cyc.budgetAchatAliment} 
                              onChange={(e) => {
                                const val = parseInt(e.target.value) || 0;
                                setCycles(prev => prev.map(c => c.id === cyc.id ? { ...c, budgetAchatAliment: val } : c));
                              }}
                              className="w-16 bg-slate-100 border border-slate-300 rounded px-1 text-[10px]"
                            /> F
                          </div>
                          <button
                            onClick={() => {
                              if (window.confirm("🔒 Souhaitez-vous CLÔTURER définitivement ce cycle ? Les écritures comptables et sanitaires de ce troupeau seront figées conformément aux normes d'audit.")) {
                                setCycles(prev => prev.map(c => c.id === cyc.id ? { ...c, statut: 'Clôturé' } : c));
                              }
                            }}
                            className="bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-[10px] px-2.5 py-1.5 rounded uppercase"
                          >
                            🔒 Clôturer
                          </button>
                        </>
                      ) : (
                        <>
                          <span className="text-[10px] text-zinc-500 italic">🔒 Verrouillé (Données Compta figées)</span>
                          <button
                            onClick={() => {
                              const reason = window.prompt("Motif de réouverture auditée :") || '';
                              if (reason) {
                                setCycles(prev => prev.map(c => c.id === cyc.id ? { ...c, statut: 'En cours', notesComptables: `Réouvert: ${reason}` } : c));
                              }
                            }}
                            className="text-[9px] bg-slate-200 hover:bg-slate-300 text-slate-700 px-2 py-1 rounded font-bold"
                          >
                            🔓 Réouvrir
                          </button>
                        </>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: LOTS & GROUPEMENT OPERATIONNEL */}
        {activeTab === 'lots' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h4 className="font-extrabold text-sm text-slate-800 uppercase">Lots d'élevage à vocation collective (Volailles, Porcins)</h4>
              <button
                onClick={() => setShowAddLotModal(true)}
                className="bg-slate-800 text-white font-bold text-xs px-3 py-1.5 rounded-lg hover:bg-slate-900"
              >
                + Enregistrer un Nouveau Lot
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lots.map(l => {
                const mortCount = aleas.filter(a => a.idLot === l.id && a.type === 'Mortalité').reduce((s, a) => s + a.quantitePerdue, 0);
                const mortRate = ((mortCount / l.effectifInitial) * 100).toFixed(1);

                return (
                  <div key={l.id} className="border p-4 bg-slate-50/60 rounded-xl space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] bg-indigo-100 text-indigo-800 font-extrabold px-1.5 py-0.5 rounded font-mono uppercase">
                        {l.espece} • {l.race}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        l.statut === 'Actif' ? 'bg-emerald-100 text-emerald-800' : 'bg-zinc-200 text-zinc-700'
                      }`}>
                        {l.statut}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-base">{l.nom}</h4>
                    <span className="text-xs text-slate-500 block">Bâtiment de logement : {getBatimentName(l.idBatiment)}</span>

                    <div className="grid grid-cols-3 gap-2 mt-2 bg-white border p-3 rounded-lg text-center">
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold block">Têtes Initial</span>
                        <span className="text-sm font-black text-slate-700">{l.effectifInitial}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold block">Têtes Actuels</span>
                        <span className="text-sm font-black text-indigo-600">{l.effectifActuel}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-rose-400 font-bold block">Mortalité cumulée</span>
                        <span className="text-sm font-black text-rose-600">{mortCount} ({mortRate}%)</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-xs text-slate-600 pt-2 border-t">
                      <span>Coût alimentation direct cumulé :</span>
                      <span className="font-bold text-slate-800 font-mono">{l.coutAlimentationCumule.toLocaleString()} FCFA</span>
                    </div>

                    {/* Mass treatment launcher */}
                    {l.statut === 'Actif' && (
                      <div className="pt-2">
                        <button
                          onClick={() => {
                            setSanitaireForm(prev => ({ ...prev, idTroupeau: l.id, idAnimal: '' }));
                            setShowAddSanitaireModal(true);
                          }}
                          className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-[10px] py-1.5 rounded-lg font-bold uppercase transition"
                        >
                          💉 Déclarer un Traitement Collectif de Soin
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: BOVINS REGISTRY RFID */}
        {activeTab === 'animaux' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h4 className="font-extrabold text-sm text-slate-800 uppercase">Registre Individuel du Gros Bétail</h4>
                <p className="text-xs text-slate-400 mt-1">Conformité réglementaire par boucle de traçabilité RFID.</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowAddPeseeModal(true)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 border"
                >
                  <Scale className="h-4 w-4" /> Logger une Pesée
                </button>
                <button
                  onClick={() => setShowAddAnimalModal(true)}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1"
                >
                  + Ajouter Bovin
                </button>
              </div>
            </div>

            <div className="overflow-x-auto border rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-extrabold uppercase border-b">
                  <tr>
                    <th className="p-3">Boucle Tag RFID</th>
                    <th className="p-3">Surnom / Race</th>
                    <th className="p-3">Généalogie (Père / Mère)</th>
                    <th className="p-3">Statut Sanitaire / Wait</th>
                    <th className="p-3 text-right">Poids Actuel (Kg)</th>
                    <th className="p-3 text-right">GMQ (g/jour)</th>
                    <th className="p-3">Statut opérationnel</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-slate-700">
                  {animaux.map(a => {
                    const matchedWait = sanitaryWaitPeriods.find(w => w.targetName.includes(a.nom) && w.active);
                    const hist = a.poidsHistorique || [];
                    let gmqVal = 0;
                    if (hist.length >= 2) {
                      const first = hist[0];
                      const last = hist[hist.length - 1];
                      const days = Math.max(1, Math.round((new Date(last.date).getTime() - new Date(first.date).getTime()) / (1000 * 60 * 60 * 24)));
                      gmqVal = Math.round(((last.poids - first.poids) * 1000) / days);
                    }

                    return (
                      <tr key={a.id} className="hover:bg-slate-50 transition">
                        <td className="p-3 font-mono font-bold text-red-600">{a.codeUnique}</td>
                        <td className="p-3">
                          <span className="font-extrabold text-slate-900 block">{a.nom}</span>
                          <span className="text-[10px] text-slate-400 block">{a.sexe === 'Femelle' ? 'Vache' : 'Taureau'} • 3 ans</span>
                        </td>
                        <td className="p-3 font-mono text-slate-500">
                          {a.pereId ? `♂ Père: ${a.pereId.slice(-4)}` : 'Inconnu'} <br />
                          {a.mereId ? `♀ Mère: ${a.mereId.slice(-4)}` : 'Né Externe'}
                        </td>
                        <td className="p-3">
                          {matchedWait ? (
                            <span className="bg-amber-100 text-amber-800 border border-amber-300 font-bold px-2 py-0.5 rounded text-[10px] inline-block animate-pulse">
                              ⏳ Rémanence antibiotique ({matchedWait.waitDays}j)
                            </span>
                          ) : (
                            <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px] inline-block">
                              ✓ Viande & Lait Commercialisables
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-right font-black text-slate-800">{a.poidsActuel} Kg</td>
                        <td className="p-3 text-right font-bold text-indigo-600">
                          {gmqVal > 0 ? `+${gmqVal} g/j` : '—'}
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            a.statut === 'Actif' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {a.statut}
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

        {/* TAB 4: CARNET SANITAIRE & DE DELAI RECONSTITUTION */}
        {activeTab === 'sanitaire' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h4 className="font-extrabold text-sm text-slate-800 uppercase">Carnet Sanitaire et Diagnostics Vétérinaires</h4>
                <p className="text-xs text-slate-400 mt-1">Conformité sanitaire critique : Enregistrement des vaccins, doses et DAR.</p>
              </div>
              <button
                onClick={() => setShowAddSanitaireModal(true)}
                className="bg-indigo-600 text-white font-bold text-xs px-3.5 py-2 rounded-lg hover:bg-slate-900"
              >
                + Soin / Vaccination
              </button>
            </div>

            <div className="overflow-x-auto border rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-extrabold uppercase border-b">
                  <tr>
                    <th className="p-3">Date Intervention</th>
                    <th className="p-3">Acteur / Cible</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Diagnostic posé</th>
                    <th className="p-3">Produit Veto & Dose</th>
                    <th className="p-3">Vétérinaire Traitant</th>
                    <th className="p-3 text-right">Coût Facturation</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-slate-700">
                  {sanitaires.map(s => (
                    <tr key={s.id} className="hover:bg-slate-50 transition">
                      <td className="p-3 font-mono">{s.date}</td>
                      <td className="p-3">
                        {s.idAnimal ? (
                          <span className="font-extrabold text-red-700">{animaux.find(ani => ani.id === s.idAnimal)?.nom}</span>
                        ) : (
                          <span className="font-extrabold text-indigo-700 font-mono">Lot: {lots.find(l => l.id === s.idTroupeau)?.nom || s.idTroupeau}</span>
                        )}
                      </td>
                      <td className="p-3 font-bold text-slate-800">{s.type}</td>
                      <td className="p-3 italic">"{s.diagnostic}"</td>
                      <td className="p-3 font-mono font-semibold">{s.produitSelectionne}</td>
                      <td className="p-3 text-slate-500">{s.veterinaire}</td>
                      <td className="p-3 text-right font-black text-rose-600">{s.coûtVeto.toLocaleString()} FCFA</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: ALÉAS & INCIDENTS (SPEC 2.9 / 6) */}
        {activeTab === 'aleas' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 uppercase">Registre de Pertes Opérationnelles & Sinistres (Aléas)</h4>
                <p className="text-xs text-rose-700 font-bold">Trace des mortalités, épidémies et vols avec calculs de pertes financières.</p>
              </div>
              <button
                onClick={() => setShowAddAléaModal(true)}
                className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow"
              >
                ⚠️ Déclarer un Sinistre ou Aléa
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aleas.map(al => (
                <div key={al.id} className="bg-rose-50/40 p-4 border border-rose-100 rounded-2xl space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] uppercase font-mono bg-rose-100 text-rose-800 border border-rose-300 font-bold px-2 py-0.5 rounded">
                      Type: {al.type}
                    </span>
                    <span className="text-xs text-slate-500 font-mono font-bold">Le {al.date}</span>
                  </div>

                  <p className="text-xs text-slate-800 font-bold">Cible touchée : {al.idAnimal ? `Bovidé ${animaux.find(a => a.id === al.idAnimal)?.nom}` : `Lot ${getLotName(al.idLot)}`}</p>
                  <p className="text-xs text-slate-600 italic">"{al.description}"</p>

                  <div className="grid grid-cols-2 gap-2 text-center text-xs bg-white p-2.5 rounded-lg border">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block bg-slate-50 py-0.5">Masse / Unités perdues</span>
                      <span className="text-sm font-black text-rose-600">{al.quantitePerdue || '—'} têtes</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block bg-slate-50 py-0.5">Valeur estimée du sinistre</span>
                      <span className="text-sm font-black text-rose-700">{al.valeurEstimeeFCFA.toLocaleString()} FCFA</span>
                    </div>
                  </div>

                  <div className="text-[10px] flex items-center gap-1.5 text-rose-800">
                    <Info className="h-3.5 w-3.5" />
                    <span>Vétérinaire assermenté appelé : <strong>{al.veterinaireAppele ? 'Oui, constatation rédigée' : 'Non requis ou interne'}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: PRODUCTION CONTINUE & VENTES */}
        {activeTab === 'prod_continue' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h4 className="font-extrabold text-sm text-slate-800 uppercase">Suivi de Production Continue & Flux Laitiers / Œufs</h4>
                <p className="text-xs text-slate-400 mt-1">Saisie quotidienne du lait tiré ou des casiers d'œufs accumulés en magasin.</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowAddProdModal(true)}
                  className="bg-indigo-600 hover:bg-slate-900 text-white font-bold text-xs px-3 py-1.5 rounded-lg"
                >
                  + Logger la production du jour
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-2xl p-4 space-y-3 bg-slate-50/60">
                <h5 className="font-black text-xs text-slate-700 uppercase tracking-wide">Lorgnier Journalier de Collecte</h5>
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {productions.map(p => (
                    <div key={p.id} className="bg-white border rounded-lg p-3 flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-slate-900 block">{getTroupeauName(p.idTroupeau)}</span>
                        <span className="text-[10px] text-slate-400 font-mono">Date : {p.date} • Type : {p.type}</span>
                      </div>
                      <span className="font-black text-slate-800 text-sm bg-sky-50 border border-sky-300 px-2 py-1 rounded text-sky-700">
                        {p.quantite} {p.unite}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border rounded-2xl p-4 space-y-3 bg-slate-50/60">
                <h5 className="font-black text-xs text-slate-700 uppercase tracking-wide">Carnet de Vente & Commande Laitière / Œufs</h5>
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {ventesProductions.map(v => (
                    <div key={v.id} className="bg-white border text-xs rounded-lg p-3 space-y-1">
                      <div className="flex justify-between font-bold text-slate-900">
                        <span>Acheteur : {v.acheteur}</span>
                        <span className="text-indigo-600">{v.quantite.toLocaleString()} {v.type === 'Lait' ? 'Litres' : 'Plateaux'}</span>
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-500">
                        <span>Facturé à {v.prixUnitaire} F/U</span>
                        <span className="font-black text-emerald-600 font-mono">+{(v.quantite * v.prixUnitaire).toLocaleString()} FCFA</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: BILANS ET DIAGNOSTIC SYSCOHADA COMPENSÉ */}
        {activeTab === 'compta' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h4 className="font-extrabold text-sm text-slate-800 uppercase">Fiche Analytique & Diagnostic d'Élevage (SYSCOHADA)</h4>
                <p className="text-xs text-slate-400 mt-1">Conformité de l'article de compte analytique d'élevage d'Afrique Centrale.</p>
              </div>
              <span className="text-[10px] font-mono text-slate-500">Local Time : 2026-06-19 v1.0</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Budgets & Consumptions */}
              <div className="border rounded-2xl p-4 space-y-3 bg-slate-50/50">
                <h5 className="font-black text-slate-700 uppercase tracking-wider text-[11px]">Consommation Financière Macro</h5>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Achat nourriture (Provende) :</span>
                    <span className="font-bold font-mono">2 800 000 F</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Soins vétérinaires & DAR audit :</span>
                    <span className="font-bold font-mono">150 000 F</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Main d'œuvre permanente :</span>
                    <span className="font-bold text-slate-700 font-mono">1 300 000 F</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Quote-part Amortiment Bâtiments :</span>
                    <span className="font-bold text-slate-700 font-mono font-mono">450 000 F</span>
                  </div>
                  <div className="border-t pt-2 mt-2 flex justify-between text-xs font-black">
                    <span>Total charges directes :</span>
                    <span className="text-rose-650 font-mono">4 700 000 FCFA</span>
                  </div>
                </div>
              </div>

              {/* Incomes & Yields */}
              <div className="border rounded-2xl p-4 space-y-3 bg-slate-50/50">
                <h5 className="font-black text-slate-700 uppercase tracking-wider text-[11px]">Revenus générés bruts (Campagne)</h5>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Lait de Traite vendu (CLL) :</span>
                    <span className="font-bold font-mono">225 000 F</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Plateaux d'œufs de table vendu :</span>
                    <span className="font-bold font-mono">33 000 F</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Ventes d'animaux vifs / viande :</span>
                    <span className="font-bold font-mono">6 800 000 F</span>
                  </div>
                  <div className="border-t pt-2 mt-2 flex justify-between text-xs font-black">
                    <span>Total Chiffre d'affaires :</span>
                    <span className="text-emerald-700 font-mono">7 058 000 FCFA</span>
                  </div>
                </div>
              </div>

              {/* Computed Margin & Variances */}
              <div className="border rounded-2xl p-4 space-y-3 bg-indigo-950 text-indigo-50">
                <h5 className="font-black text-indigo-300 uppercase tracking-wider text-[11px]">Analyse Diagnostique de Marge brute</h5>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-indigo-200">
                    <span>Total Écart Budgétaire :</span>
                    <span className="font-bold font-mono text-emerald-400">+1 200 000 F</span>
                  </div>
                  <div className="flex justify-between text-xs text-indigo-200">
                    <span>Valeur perte mortalité :</span>
                    <span className="font-bold font-mono text-rose-400">-103 000 F</span>
                  </div>
                  <div className="border-t border-indigo-900 pt-2 mt-2 flex justify-between text-sm font-black">
                    <span>Marge Brute Réelle :</span>
                    <span className="text-emerald-400 font-mono font-black">+2 358 000 F</span>
                  </div>
                  <p className="text-[10px] text-indigo-300 italic font-medium leading-relaxed pt-2">
                    ✓ Diagnostic : Elevage performant avec taux de mortalité de {globalMortaliteRate.toFixed(2)}% conforme aux normes saines. Le renouvellement à {tauxRenouvellement}% sécurise les cycles reproductifs d'obala.
                  </p>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>

      {/* --- ALL COMPLEX SPEC MODALS --- */}
      {showAddCycleModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full border shadow-lg overflow-hidden text-xs">
            <div className="bg-indigo-650 bg-slate-900 text-white p-4">
              <h3 className="font-bold uppercase tracking-tight text-xs">Planifier un nouveau Cycle de Pilotage (S.3)</h3>
            </div>
            <form onSubmit={handleCreateCycle} className="p-4 space-y-3">
              <div>
                <label className="block text-slate-600 font-bold mb-1">Désignation du cycle ou bande *</label>
                <input required type="text" placeholder="Ex: Cycle Bovins Laitier Q3" value={cycleForm.nom} onChange={e => setCycleForm({...cycleForm, nom: e.target.value})} className="w-full border p-2 rounded" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Code Système Unique *</label>
                  <input required type="text" placeholder="CYCLE-B-15" value={cycleForm.code} onChange={e => setCycleForm({...cycleForm, code: e.target.value})} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Type de Pilotage</label>
                  <select value={cycleForm.type} onChange={e => setCycleForm({...cycleForm, type: e.target.value as any})} className="w-full border p-2 rounded bg-white">
                    <option value="Bandes">Bandes (Volaille, Porcin)</option>
                    <option value="Calendaire">Calendaire (Laitier continu)</option>
                    <option value="Reproductif">Reproductif (Carrière mères)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Budget Alimentation (FCFA)</label>
                  <input type="number" value={cycleForm.budgetAchatAliment} onChange={e => setCycleForm({...cycleForm, budgetAchatAliment: parseInt(e.target.value) || 0})} className="w-full border p-2 rounded font-mono font-bold" />
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Budget Veto & Vaccins (FCFA)</label>
                  <input type="number" value={cycleForm.budgetSoinsVeto} onChange={e => setCycleForm({...cycleForm, budgetSoinsVeto: parseInt(e.target.value) || 0})} className="w-full border p-2 rounded font-mono font-bold" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Date Début *</label>
                  <input type="date" value={cycleForm.dateDebut} onChange={e => setCycleForm({...cycleForm, dateDebut: e.target.value})} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Date Fin *</label>
                  <input type="date" value={cycleForm.dateFin} onChange={e => setCycleForm({...cycleForm, dateFin: e.target.value})} className="w-full border p-2 rounded" />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button type="button" onClick={() => setShowAddCycleModal(false)} className="bg-slate-100 p-2 rounded font-bold">Annuler</button>
                <button type="submit" className="bg-indigo-600 text-white p-2 px-4 rounded font-bold shadow-sm">Créer & Activer le Cycle</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddLotModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-sm w-full border shadow-lg overflow-hidden text-xs">
            <div className="bg-slate-850 p-4 bg-slate-800 text-white">
              <h3 className="font-bold uppercase text-xs">Définir un Lot ou Troupeau (S.2.3)</h3>
            </div>
            <form onSubmit={handleCreateLot} className="p-4 space-y-3">
              <div>
                <label className="block text-slate-600 font-bold mb-1">Nom descriptif s'il s'agit d'un lot collectif *</label>
                <input required type="text" placeholder="Bande Poussins Cobb 500" value={lotForm.nom} onChange={e => setLotForm({...lotForm, nom: e.target.value})} className="w-full border p-2 rounded" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Espèce d'élevage</label>
                  <select value={lotForm.espece} onChange={e => setLotForm({...lotForm, espece: e.target.value as any})} className="w-full border p-2 rounded bg-white font-bold">
                    <option value="Volaille">Volaille</option>
                    <option value="Porcin">Porcin</option>
                    <option value="Ovin">Ovin / Caprin</option>
                    <option value="Bovin">Bovin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Race ou Sélection</label>
                  <input type="text" placeholder="Cobb 500" value={lotForm.race} onChange={e => setLotForm({...lotForm, race: e.target.value})} className="w-full border p-2 rounded" />
                </div>
              </div>
              <div>
                <label className="block text-slate-600 font-bold mb-1">Effectif initial du lot *</label>
                <input required type="number" value={lotForm.effectifInitial} onChange={e => setLotForm({...lotForm, effectifInitial: parseInt(e.target.value) || 0})} className="w-full border p-2 rounded font-mono font-bold" />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button type="button" onClick={() => setShowAddLotModal(false)} className="bg-slate-100 p-2 rounded">Annuler</button>
                <button type="submit" className="bg-slate-900 text-white p-2 px-4 rounded font-bold">Lancer le Lot</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddAnimalModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full border shadow-lg overflow-hidden text-xs">
            <div className="bg-red-650 bg-slate-900 text-white p-4">
              <h3 className="font-bold uppercase text-xs">Fiche Individuelle d'Animal (S.2.4)</h3>
            </div>
            <form onSubmit={handleCreateAnimal} className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-bold mb-0.5">Code n° Boucle / RFID *</label>
                  <input required placeholder="Ex: GOUD-01" type="text" value={animalForm.codeUnique} onChange={e => setAnimalForm({...animalForm, codeUnique: e.target.value})} className="w-full border p-2 rounded font-mono font-extrabold text-red-600" />
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-0.5">Nom / Surnom *</label>
                  <input required placeholder="Goudali Dorée" type="text" value={animalForm.nom} onChange={e => setAnimalForm({...animalForm, nom: e.target.value})} className="w-full border p-2 rounded" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-bold mb-0.5">Sexe</label>
                  <select value={animalForm.sexe} onChange={e => setAnimalForm({...animalForm, sexe: e.target.value as any})} className="w-full border p-2 rounded bg-white">
                    <option value="Femelle">Femelle</option>
                    <option value="Mâle">Mâle</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-0.5">Poids à l'élection / Naissance (Kg)</label>
                  <input type="number" value={animalForm.poidsActuel} onChange={e => setAnimalForm({...animalForm, poidsActuel: parseInt(e.target.value) || 0})} className="w-full border p-2 rounded" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t text-[10px]">
                <span className="col-span-2 text-slate-450 uppercase font-bold text-[9px] tracking-wider block">Généalogie / Pedigree (S.2.4)</span>
                <div>
                  <label className="block text-slate-500">Mère d'affiliation (Loop ID)</label>
                  <input placeholder="Ex: Gou-Mater-44" type="text" value={animalForm.mereId} onChange={e => setAnimalForm({...animalForm, mereId: e.target.value})} className="w-full border p-1 rounded font-mono" />
                </div>
                <div>
                  <label className="block text-slate-500">Père d'affiliation (Loop ID)</label>
                  <input placeholder="Ex: Gou-Pater-102" type="text" value={animalForm.pereId} onChange={e => setAnimalForm({...animalForm, pereId: e.target.value})} className="w-full border p-1 rounded font-mono" />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button type="button" onClick={() => setShowAddAnimalModal(false)} className="bg-slate-100 p-2 rounded">Annuler</button>
                <button type="submit" className="bg-red-600 text-white p-2 px-4 rounded font-bold">Sauvegarder l'Animal</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddAléaModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-sm w-full border shadow-lg overflow-hidden text-xs">
            <div className="bg-rose-600 text-white p-4">
              <h3 className="font-bold uppercase tracking-wide text-xs">Déclarer un Aléa ou Pertes de cheptel (S.2.9)</h3>
            </div>
            <form onSubmit={handleCreateAléa} className="p-4 space-y-3.5">
              <div>
                <label className="block text-slate-600 font-bold mb-1">Rattacher au Cycle de pilotage *</label>
                <select value={aleaForm.idCycle} onChange={e => setAleaForm({...aleaForm, idCycle: e.target.value})} className="w-full border p-2 rounded bg-white">
                  {cycles.map(c => (
                    <option key={c.id} value={c.id}>{c.nom}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Type d'Aléa *</label>
                  <select value={aleaForm.type} onChange={e => setAleaForm({...aleaForm, type: e.target.value as any})} className="w-full border p-2 rounded bg-white font-bold text-rose-700">
                    <option value="Mortalité">Mortalité (Décès)</option>
                    <option value="Maladie">Maladie grave / Infection</option>
                    <option value="Vol">Vol</option>
                    <option value="Prédation">Prédation</option>
                    <option value="Casse Génétique">Casse Génétique</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Têtes décédées / perdues *</label>
                  <input required type="number" value={aleaForm.quantitePerdue} onChange={e => setAleaForm({...aleaForm, quantitePerdue: parseInt(e.target.value) || 0})} className="w-full border p-2 rounded font-mono font-bold text-rose-700" />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Rattacher pour Diagnostic Lot / Animal</label>
                <select value={aleaForm.idLot} onChange={e => setAleaForm({...aleaForm, idLot: e.target.value, idAnimal: ''})} className="w-full border p-2 rounded bg-white">
                  <option value="">-- Aucun Lot (affecter un animal individuel) --</option>
                  {lots.map(l => (
                    <option key={l.id} value={l.id}>{l.nom}</option>
                  ))}
                </select>
                <select value={aleaForm.idAnimal} onChange={e => setAleaForm({...aleaForm, idAnimal: e.target.value, idLot: ''})} className="w-full border p-2 rounded bg-white mt-1">
                  <option value="">-- Aucun Animal (affecter au lot ci-dessus) --</option>
                  {animaux.map(a => (
                    <option key={a.id} value={a.id}>{a.nom} [{a.codeUnique}]</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Description cause agronomique / vétérinaire *</label>
                <textarea rows={2} required placeholder="Saisie obligatoire de la cause..." value={aleaForm.description} onChange={e => setAleaForm({...aleaForm, description: e.target.value})} className="w-full border p-2 rounded" />
              </div>

              <div className="bg-rose-50 text-[10.5px] p-2 rounded-lg border border-rose-200 font-bold font-mono text-rose-800 flex justify-between">
                <span>Pertes financières estimées (FCFA) :</span>
                <span>
                  <input type="number" value={aleaForm.valeurEstimeeFCFA} onChange={e => setAleaForm({...aleaForm, valeurEstimeeFCFA: parseInt(e.target.value) || 0})} className="w-20 bg-white border rounded px-1 text-right text-rose-800" /> F
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button type="button" onClick={() => setShowAddAléaModal(false)} className="bg-slate-100 p-2 rounded">Annuler</button>
                <button type="submit" className="bg-rose-600 text-white p-2 px-4 rounded font-bold">Valider & Imputer la Perte</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddSanitaireModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full border shadow-lg overflow-hidden text-xs">
            <div className="bg-slate-900 text-white p-4">
              <h3 className="font-bold uppercase text-xs">Intervention Vétérinaire & Prescription (S.2.6)</h3>
            </div>
            <form onSubmit={handleCreateSanitaire} className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Soin de type</label>
                  <select value={sanitaireForm.type} onChange={e => setSanitaireForm({...sanitaireForm, type: e.target.value as any})} className="w-full border p-2 rounded bg-white">
                    <option value="Vaccination">Vaccination</option>
                    <option value="Traitement">Traitement curatif</option>
                    <option value="Consultation">Consultation</option>
                    <option value="Déparasitage">Déparasitage</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">DAR : Délai d'Attente (jours) *</label>
                  <input type="number" required value={sanitaireForm.delaiAttenteJours} onChange={e => setSanitaireForm({...sanitaireForm, delaiAttenteJours: parseInt(e.target.value) || 0})} className="w-full border p-2 rounded font-mono font-black text-rose-700 bg-rose-50" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Animal concerné (Bovins) :</label>
                  <select value={sanitaireForm.idAnimal} onChange={e => setSanitaireForm({...sanitaireForm, idAnimal: e.target.value, idTroupeau: ''})} className="w-full border p-2 rounded bg-white">
                    <option value="">Aucun animal individuel</option>
                    {animaux.map(a => (
                      <option key={a.id} value={a.id}>{a.nom}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Troupeau/Lot concerné :</label>
                  <select value={sanitaireForm.idTroupeau} onChange={e => setSanitaireForm({...sanitaireForm, idTroupeau: e.target.value, idAnimal: ''})} className="w-full border p-2 rounded bg-white">
                    <option value="">Aucun lot (soin de masse)</option>
                    {lots.map(l => (
                      <option key={l.id} value={l.id}>{l.nom}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Médicament / Substance *</label>
                  <input required placeholder="Albenmax 10%" type="text" value={sanitaireForm.produitSelectionne} onChange={e => setSanitaireForm({...sanitaireForm, produitSelectionne: e.target.value})} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Coût traitement Vétérinaire (FCFA)</label>
                  <input type="number" value={sanitaireForm.coûtVeto} onChange={e => setSanitaireForm({...sanitaireForm, coûtVeto: parseInt(e.target.value) || 0})} className="w-full border p-2 rounded font-mono font-bold" />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Symptômes / Diagnostic agronomique *</label>
                <textarea rows={2} required placeholder="Expliquez en détail..." value={sanitaireForm.diagnostic} onChange={e => setSanitaireForm({...sanitaireForm, diagnostic: e.target.value})} className="w-full border p-2 rounded" />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button type="button" onClick={() => setShowAddSanitaireModal(false)} className="bg-slate-100 p-2 rounded">Annuler</button>
                <button type="submit" className="bg-slate-900 text-white p-2 px-4 rounded font-bold">Prescrire le soin</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddProdModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-sm w-full border shadow-lg overflow-hidden text-xs">
            <div className="bg-slate-900 text-white p-4">
              <h3 className="font-bold uppercase text-xs">Logger la Production Continue (S.2.10)</h3>
            </div>
            <form onSubmit={handleCreateProd} className="p-4 space-y-3.5">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Type de Produit</label>
                  <select value={prodForm.type} onChange={e => setProdForm({...prodForm, type: e.target.value as any})} className="w-full border p-2 rounded bg-white">
                    <option value="Lait">Lait de Vêlage / Traite</option>
                    <option value="Œufs">Œufs (Plateaux)</option>
                    <option value="Laine">Laine</option>
                    <option value="Miel">Miel</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Quantité pesée *</label>
                  <input required type="number" value={prodForm.quantite} onChange={e => setProdForm({...prodForm, quantite: parseInt(e.target.value) || 0})} className="w-full border p-2 rounded font-mono font-bold" />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Diagnostics / Observations complexes</label>
                <textarea rows={2} value={prodForm.observations} onChange={e => setProdForm({...prodForm, observations: e.target.value})} className="w-full border p-2 rounded" />
              </div>

              <div className="bg-indigo-50 border border-indigo-200 rounded p-2.5 text-[10.5px]">
                <p className="text-indigo-900 font-bold flex items-center gap-1">
                  <Info className="h-4 w-4" /> Les volumes récoltés alimentent directement le stock d'élevage et décrémentent avec les ventes CLL.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button type="button" onClick={() => setShowAddProdModal(false)} className="bg-slate-100 p-2 rounded">Annuler</button>
                <button type="submit" className="bg-indigo-600 text-white p-2 px-4 rounded font-bold">Valider la Production</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddPeseeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-sm w-full border shadow-lg overflow-hidden text-xs">
            <div className="bg-slate-900 text-white p-4">
              <h3 className="font-bold uppercase text-xs">Pesée Individuelle de Bovin (S.2.7)</h3>
            </div>
            <form onSubmit={handleCreatePesee} className="p-4 space-y-3.5">
              <div>
                <label className="block text-slate-600 font-bold mb-1">Sélectionner l'animal log RFID *</label>
                <select required value={peseeForm.idAnimal} onChange={e => setPeseeForm({...peseeForm, idAnimal: e.target.value})} className="w-full border p-2 rounded bg-white font-bold">
                  <option value="">-- Sélectionnez l'animal --</option>
                  {animaux.map(a => (
                    <option key={a.id} value={a.id}>{a.nom} [{a.codeUnique}]</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Masse relevée (Kg) *</label>
                  <input required type="number" value={peseeForm.poids} onChange={e => setPeseeForm({...peseeForm, poids: parseInt(e.target.value) || 0})} className="w-full border p-2 rounded font-mono font-bold" />
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Date pesée *</label>
                  <input type="date" value={peseeForm.date} onChange={e => setPeseeForm({...peseeForm, date: e.target.value})} className="w-full border p-2 rounded" />
                </div>
              </div>

              <div className="bg-indigo-50 border border-indigo-200 text-indigo-900 rounded p-2 text-[10px] font-medium leading-relaxed font-mono">
                💡 Le calcul automatique du Gain Moyen Quotidien (GMQ) sera actualisé à la soumission.
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button type="button" onClick={() => setShowAddPeseeModal(false)} className="bg-slate-100 p-2 rounded">Annuler</button>
                <button type="submit" className="bg-indigo-600 text-white p-2 px-4 rounded font-bold">Sauvegarder la pesée</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
