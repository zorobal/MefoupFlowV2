import React, { useState } from 'react';
import {
  Equipement,
  MaintenanceOrder,
  FuelLog,
  CompteurUtilisation,
  UtilisationEquipement,
  PlanDeMaintenance,
  PanneEquipement,
  AssuranceEquipement,
  Employe,
  Intervention,
  MouvementStock,
  Article,
  Fournisseur
} from '../types';
import {
  Gauge,
  Wrench,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  Calendar,
  User,
  Plus,
  Search,
  Building,
  Fuel,
  Clipboard,
  Activity,
  Clock,
  Sliders,
  Settings,
  ArrowRight,
  ExternalLink,
  FileText,
  CheckCircle2,
  XCircle,
  TrendingDown,
  WrenchIcon,
  LifeBuoy
} from 'lucide-react';

interface EquipementModuleProps {
  equipements: Equipement[];
  setEquipements: React.Dispatch<React.SetStateAction<Equipement[]>>;
  maintenances: MaintenanceOrder[];
  setMaintenances: React.Dispatch<React.SetStateAction<MaintenanceOrder[]>>;
  fuelLogs: FuelLog[];
  setFuelLogs: React.Dispatch<React.SetStateAction<FuelLog[]>>;
  // Extended multi-tenant state hooks passed down from App or managed with local state fallbacks
  compteursUtilisation: CompteurUtilisation[];
  setCompteursUtilisation: React.Dispatch<React.SetStateAction<CompteurUtilisation[]>>;
  utilisationsEquipement: UtilisationEquipement[];
  setUtilisationsEquipement: React.Dispatch<React.SetStateAction<UtilisationEquipement[]>>;
  plansMaintenance: PlanDeMaintenance[];
  setPlansMaintenance: React.Dispatch<React.SetStateAction<PlanDeMaintenance[]>>;
  pannesEquipement: PanneEquipement[];
  setPannesEquipement: React.Dispatch<React.SetStateAction<PanneEquipement[]>>;
  assurancesEquipement: AssuranceEquipement[];
  setAssurancesEquipement: React.Dispatch<React.SetStateAction<AssuranceEquipement[]>>;
  
  employes: Employe[];
  interventions: Intervention[];
  onAddMouvement: (mvt: MouvementStock) => void;
  articles: Article[];
  fournisseurs: Fournisseur[];
}

export default function EquipementModule({
  equipements = [],
  setEquipements,
  maintenances = [],
  setMaintenances,
  fuelLogs = [],
  setFuelLogs,
  compteursUtilisation = [],
  setCompteursUtilisation,
  utilisationsEquipement = [],
  setUtilisationsEquipement,
  plansMaintenance = [],
  setPlansMaintenance,
  pannesEquipement = [],
  setPannesEquipement,
  assurancesEquipement = [],
  setAssurancesEquipement,
  employes = [],
  interventions = [],
  onAddMouvement,
  articles = [],
  fournisseurs = []
}: EquipementModuleProps) {
  const [activeTab, setActiveTab] = useState<'kpis' | 'fleet' | 'usages' | 'maintenance' | 'breakdowns' | 'insurances'>('kpis');
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Input states for new equipment
  const [showAddEqModal, setShowAddEqModal] = useState(false);
  const [eqDesignation, setEqDesignation] = useState('');
  const [eqCode, setEqCode] = useState('');
  const [eqType, setEqType] = useState<Equipement['type']>('Tracteur');
  const [eqMarque, setEqMarque] = useState('');
  const [eqModele, setEqModele] = useState('');
  const [eqImmatriculation, setEqImmatriculation] = useState('');
  const [eqDateAchat, setEqDateAchat] = useState(new Date().toISOString().split('T')[0]);
  const [eqValeurAcquisition, setEqValeurAcquisition] = useState(15000000);
  const [eqDureeDeVieMois, setEqDureeDeVieMois] = useState(120);
  const [eqLieuStationnement, setEqLieuStationnement] = useState('Hangar Principal');
  const [eqNumeroSerie, setEqNumeroSerie] = useState('');
  const [eqModeAcquisition, setEqModeAcquisition] = useState<'Achat' | 'LLD' | 'Crédit-bail'>('Achat');
  
  // Counter log input state
  const [showAddCounterModal, setShowAddCounterModal] = useState(false);
  const [selectedEqIdForCounter, setSelectedEqIdForCounter] = useState('');
  const [counterType, setCounterType] = useState('Heures moteur');
  const [counterValue, setCounterValue] = useState(10);
  const [counterRelevePar, setCounterRelevePar] = useState('');

  // Usage input states
  const [showAddUsageModal, setShowAddUsageModal] = useState(false);
  const [useEqId, setUseEqId] = useState('');
  const [useDateDebut, setUseDateDebut] = useState(new Date().toISOString().split('T')[0]);
  const [useDateFin, setUseDateFin] = useState(new Date().toISOString().split('T')[0]);
  const [useOperateur, setUseOperateur] = useState('');
  const [useInterventionId, setUseInterventionId] = useState('');
  const [useCompteurDebut, setUseCompteurDebut] = useState(0);
  const [useCompteurFin, setUseCompteurFin] = useState(0);
  const [useCarburantLitres, setUseCarburantLitres] = useState(25);
  const [useCarburantCout, setUseCarburantCout] = useState(21000);
  const [errorUsage, setErrorUsage] = useState('');

  // Plan Maintenance states
  const [showAddPlanModal, setShowAddPlanModal] = useState(false);
  const [planEqId, setPlanEqId] = useState('');
  const [planCategory, setPlanCategory] = useState('');
  const [planTypeOperation, setPlanTypeOperation] = useState('Vidange huile moteur');
  const [planDeclencheur, setPlanDeclencheur] = useState<'périodique' | 'calendaire' | 'mixte'>('périodique');
  const [planSeuilHeures, setPlanSeuilHeures] = useState(250);
  const [planSeuilMois, setPlanSeuilMois] = useState(6);
  const [planSeuilAlerteAnticipee, setPlanSeuilAlerteAnticipee] = useState(20);

  // GMAO order states
  const [showAddOrderModal, setShowAddOrderModal] = useState(false);
  const [orderEqId, setOrderEqId] = useState('');
  const [orderType, setOrderType] = useState<'Préventive' | 'Planifiée' | 'Curative' | 'Réglementaire'>('Préventive');
  const [orderOrigine, setOrderOrigine] = useState('PlanDeMaintenance');
  const [orderDatePlanifiee, setOrderDatePlanifiee] = useState(new Date().toISOString().split('T')[0]);
  const [orderDescription, setOrderDescription] = useState('');
  const [orderPrestenaire, setOrderPrestenaire] = useState('');
  const [orderCoutMainOeuvre, setOrderCoutMainOeuvre] = useState(50000);
  // Spawn spare parts list
  const [orderPartArticleId, setOrderPartArticleId] = useState('');
  const [orderPartQty, setOrderPartQty] = useState(1);
  const [orderSparePartsList, setOrderSparePartsList] = useState<Array<{ referencePiece: string; quantite: number; coutUnitaire: number }>>([]);

  // Report breakdown states
  const [showAddBreakdownModal, setShowAddBreakdownModal] = useState(false);
  const [breakdownEqId, setBreakdownEqId] = useState('');
  const [breakdownDate, setBreakdownDate] = useState(new Date().toISOString().split('T')[0]);
  const [breakdownComponent, setBreakdownComponent] = useState('Transmission / Cardan');
  const [breakdownGravite, setBreakdownGravite] = useState<'Mineure' | 'Majeure' | 'Critique'>('Majeure');
  const [breakdownCause, setBreakdownCause] = useState("Usure normale ou fatigue de l'arbre mécanique");

  // Assurance states
  const [showAddAssuranceModal, setShowAddAssuranceModal] = useState(false);
  const [assEqId, setAssEqId] = useState('');
  const [assPoliceId, setAssPoliceId] = useState('');
  const [assDateDebut, setAssDateDebut] = useState(new Date().toISOString().split('T')[0]);
  const [assDateFin, setAssDateFin] = useState(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [assPrime, setAssPrime] = useState(450000);

  // ------------------------------------------------------------------
  // METRICS & DYNAMIC MATHS (Règle 1, Règle 3, Indicateurs Dérivés)
  // ------------------------------------------------------------------

  // Average age of active fleet
  const getAverageAgeYears = () => {
    if (equipements.length === 0) return 0;
    const currentYear = new Date().getFullYear();
    const sumAges = equipements.reduce((acc, eq) => {
      const buyYear = new Date(eq.dateAchat).getFullYear();
      return acc + (currentYear - buyYear);
    }, 0);
    return Number((sumAges / equipements.length).toFixed(1));
  };

  // Cumulative costs of all completed maintenance jobs
  const getCumulativeMaintenanceCost = (eqId?: string) => {
    const list = eqId ? maintenances.filter(m => m.idEquipement === eqId) : maintenances;
    return list.reduce((acc, m) => acc + (m.coûtFCFA || 0), 0);
  };

  // Cumulative fuel costs
  const getCumulativeFuelCost = (eqId?: string) => {
    const list = eqId ? fuelLogs.filter(f => f.idEquipement === eqId) : fuelLogs;
    return list.reduce((acc, f) => acc + (f.coûtFCFA || 0), 0);
  };

  // Dynamic hourly cost (Règle 1)
  const getDynamicHourlyCost = (eq: Equipement) => {
    // Linear annual amortization: cost / years
    const yearsEstim = eq.dureeDeVieMois / 12 || 10;
    const annualAmortization = eq.valeurAcquisition / yearsEstim;
    
    // Accumulate actual maintenance and fuel
    const maintCost = getCumulativeMaintenanceCost(eq.id);
    const fuelCost = getCumulativeFuelCost(eq.id);
    
    // Total hours logged. If none, fall back to current motor hours or 100 to avoid division by zero
    const loggedHoursList = utilisationsEquipement.filter(u => u.idEquipement === eq.id);
    const loggedHoursTotal = loggedHoursList.reduce((acc, u) => acc + (u.compteurFin - u.compteurDebut), 0);
    const hrs = loggedHoursTotal > 0 ? loggedHoursTotal : (eq.heuresMoteurOrKm > 0 ? eq.heuresMoteurOrKm : 100);

    return Math.round((annualAmortization + maintCost + fuelCost) / hrs);
  };

  // Availability Rate (Taux de disponibilité)
  // availability% = (total_hours - maintenance_hours_immobilized) / total_hours
  const getAvailabilityRate = (eqId?: string) => {
    const defaultTotalHours = 1440; // Approx 60 days of potential 24h service
    const targetEqList = eqId ? equipements.filter(e => e.id === eqId) : equipements;
    if (targetEqList.length === 0) return 100;

    let totalImmobilised = 0;
    // In our system we can look for terminée orders or corrective maintenance
    const relevantOrders = eqId 
      ? maintenances.filter(m => m.idEquipement === eqId)
      : maintenances;
    
    relevantOrders.forEach(o => {
      // simulate 48h (48 hours) immobilization for each completed maintenance by default
      if (o.statut === 'Réalisée') {
        totalImmobilised += 48;
      }
    });

    // Also active equipment in maintenance currently counts as actively immobilized
    targetEqList.forEach(e => {
      if (e.etat === 'En maintenance') {
        totalImmobilised += 120; // 5 days estimated
      }
    });

    const potHours = defaultTotalHours * targetEqList.length;
    const rate = ((potHours - totalImmobilised) / potHours) * 100;
    return Math.min(100, Math.max(0, parseFloat(rate.toFixed(1))));
  };

  // MTBF (Mean Time Between Failures) = Total logged hours / number of breakdowns
  const getMTBF = (eqId?: string) => {
    const filter = eqId ? pannesEquipement.filter(p => p.idEquipement === eqId) : pannesEquipement;
    const failuresCount = filter.length;
    if (failuresCount === 0) return 'Inestimé (aucune panne)';
    
    // Running hours
    let runningHours = 0;
    if (eqId) {
      const eqObj = equipements.find(e => e.id === eqId);
      runningHours = eqObj ? eqObj.heuresMoteurOrKm : 0;
    } else {
      runningHours = equipements.reduce((acc, e) => acc + e.heuresMoteurOrKm, 0);
    }

    return `${Math.round(runningHours / failuresCount)} Heures`;
  };

  // MTTR (Mean Time To Repair)
  const getMTTR = (eqId?: string) => {
    const list = eqId ? pannesEquipement.filter(p => p.idEquipement === eqId) : pannesEquipement;
    if (list.length === 0) return 'N/A';
    // assume average 2.5 days for a breakdown repair, or we calculate it dynamically
    return '48 Heures';
  };

  // Maintenance prevention ratio: preventives / total maintenances
  const getPreventionRatio = () => {
    if (maintenances.length === 0) return 0;
    const prevCount = maintenances.filter(m => m.type === 'Préventive').length;
    return Math.round((prevCount / maintenances.length) * 100);
  };

  // ------------------------------------------------------------------
  // ALERTS ENGINE FOR MAINTENANCE (Règle 3 — Double détection de seuil)
  // ------------------------------------------------------------------
  const getPlanAlertStatus = (plan: PlanDeMaintenance) => {
    const eq = equipements.find(e => e.id === plan.idEquipement);
    if (!eq) return { triggered: false, motif: 'Équipement non trouvé' };

    const hoursTriggered = plan.seuilPeriodiqueHeures 
      ? eq.heuresMoteurOrKm >= plan.seuilPeriodiqueHeures
      : false;

    // Estimate age in months to evaluate calendar threshold
    const dateAchat = new Date(eq.dateAchat);
    const monthsElapsed = (new Date().getFullYear() - dateAchat.getFullYear()) * 12 + (new Date().getMonth() - dateAchat.getMonth());
    const calendarTriggered = plan.seuilCalendaireMois
      ? monthsElapsed >= plan.seuilCalendaireMois
      : false;

    if (plan.declencheur === 'mixte') {
      if (hoursTriggered && calendarTriggered) {
        return { triggered: true, type: 'MIXTE', motif: 'Double seuil franchi (Moteur & Calendrier !)' };
      }
      if (hoursTriggered) {
        return { triggered: true, type: 'HEURES', motif: `Seuil moteur atteint (${eq.heuresMoteurOrKm} h / ${plan.seuilPeriodiqueHeures} h max)` };
      }
      if (calendarTriggered) {
        return { triggered: true, type: 'CALENDRIER', motif: `Seuil calendaire atteint (${monthsElapsed} mois / ${plan.seuilCalendaireMois} mois max)` };
      }
    } else if (plan.declencheur === 'périodique' && hoursTriggered) {
      return { triggered: true, type: 'HEURES', motif: `Seuil d'heures atteint (${eq.heuresMoteurOrKm}h / ${plan.seuilPeriodiqueHeures}h)` };
    } else if (plan.declencheur === 'calendaire' && calendarTriggered) {
      return { triggered: true, type: 'CALENDRIER', motif: `Seuil calendaire atteint (${monthsElapsed} mois / ${plan.seuilCalendaireMois} mois)` };
    }

    return { triggered: false, motif: 'OK' };
  };

  // ------------------------------------------------------------------
  // MUTATION HANDLERS
  // ------------------------------------------------------------------

  const handleCreateEquipment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eqDesignation || !eqCode) return;

    const newEq: Equipement = {
      id: 'eq-' + Date.now(),
      code: eqCode,
      designation: eqDesignation,
      type: eqType,
      marque: eqMarque,
      modele: eqModele,
      immatriculation: eqImmatriculation || undefined,
      dateAchat: eqDateAchat,
      valeurAcquisition: eqValeurAcquisition,
      dureeDeVieMois: eqDureeDeVieMois,
      etat: 'En service',
      heuresMoteurOrKm: 0
    };

    setEquipements(prev => [...prev, newEq]);
    setShowAddEqModal(false);
    
    // reset inputs
    setEqDesignation('');
    setEqCode('');
    setEqMarque('');
    setEqModele('');
    setEqImmatriculation('');
  };

  const handleUpdateStatus = (eqId: string, newStatus: Equipement['etat'] | 'Vendu/Cédé') => {
    // If equipment is sold, we still keep its history but flag it.
    // In our Types state, the status is `'En service' | 'En maintenance' | 'Hors service'`
    // We can cast standard statuses or write custom trackers.
    setEquipements(prev => prev.map(eq => {
      if (eq.id === eqId) {
        return { ...eq, etat: newStatus === 'Vendu/Cédé' ? 'Hors service' : newStatus };
      }
      return eq;
    }));
  };

  const handleAddCounterLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEqIdForCounter) return;

    const newLog: CompteurUtilisation = {
      id: 'cnt-' + Date.now(),
      idEquipement: selectedEqIdForCounter,
      date: new Date().toISOString().split('T')[0],
      typeCompteur: counterType,
      valeurRelevee: Number(counterValue),
      relevePar: counterRelevePar || 'Chauffeur Principal'
    };

    setCompteursUtilisation(prev => [...prev, newLog]);

    // Update equipment actual usage value
    setEquipements(prev => prev.map(eq => {
      if (eq.id === selectedEqIdForCounter) {
        return { ...eq, heuresMoteurOrKm: Math.max(eq.heuresMoteurOrKm, Number(counterValue)) };
      }
      return eq;
    }));

    setShowAddCounterModal(false);
  };

  // Log dynamic deployment (Table of facts - Utilisation - Règle 2 Blocage)
  const handleAddUtilisation = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorUsage('');
    if (!useEqId || !useOperateur) {
      setErrorUsage('Veuillez renseigner un équipement et un opérateur.');
      return;
    }

    const eq = equipements.find(x => x.id === useEqId);
    if (!eq) return;

    // Règle 2 : Blocage de planification sur équipement indisponible
    if (eq.etat === 'En maintenance' || eq.etat === 'Hors service') {
      setErrorUsage(`❌ BLOCAGE DES CIRCUITS METIERS : L'équipement ${eq.code} (${eq.designation}) est actuellement de statut "${eq.etat}". Il ne peut pas être planifié ou déployé sur le terrain !`);
      return;
    }

    if (Number(useCompteurFin) < Number(useCompteurDebut)) {
      setErrorUsage("Le compteur d'arrivée ne peut pas être inférieur au compteur de départ.");
      return;
    }

    const newUse: UtilisationEquipement = {
      id: 'ut-' + Date.now(),
      idEquipement: useEqId,
      dateDebut: useDateDebut,
      dateFin: useDateFin,
      operateur: useOperateur,
      interventionLiee: useInterventionId || undefined,
      compteurDebut: Number(useCompteurDebut),
      compteurFin: Number(useCompteurFin),
      carburantConsommeLitres: Number(useCarburantLitres),
      carburantCoutFCFA: Number(useCarburantCout)
    };

    setUtilisationsEquipement(prev => [...prev, newUse]);

    // Also update current equipment counter
    setEquipements(prev => prev.map(e => e.id === useEqId ? { ...e, heuresMoteurOrKm: Number(useCompteurFin) } : e));
    
    // Automatically log fuel logs
    if (Number(useCarburantLitres) > 0) {
      const newFuelLog: FuelLog = {
        id: 'flog-' + Date.now(),
        idEquipement: useEqId,
        date: useDateFin,
        quantiteLitre: Number(useCarburantLitres),
        coûtFCFA: Number(useCarburantCout),
        chauffeur: useOperateur
      };
      setFuelLogs(prev => [...prev, newFuelLog]);
    }

    setShowAddUsageModal(false);
  };

  // Add preventive template rule
  const handleAddPlanMaintenance = (e: React.FormEvent) => {
    e.preventDefault();
    const newPlan: PlanDeMaintenance = {
      id: 'plm-' + Date.now(),
      idEquipement: planEqId || undefined,
      categorieEquipement: planCategory || undefined,
      typeOperation: planTypeOperation,
      declencheur: planDeclencheur,
      seuilPeriodiqueHeures: planDeclencheur !== 'calendaire' ? Number(planSeuilHeures) : undefined,
      seuilCalendaireMois: planDeclencheur !== 'périodique' ? Number(planSeuilMois) : undefined,
      seuilAlerteAnticipeeHeures: planDeclencheur !== 'calendaire' ? Number(planSeuilAlerteAnticipee) : undefined
    };

    setPlansMaintenance(prev => [...prev, newPlan]);
    setShowAddPlanModal(false);
  };

  // Complete an active maintenance order (Règle 4 — Spare parts stock deduction)
  const handleCompleteOrder = (orderId: string) => {
    const order = maintenances.find(m => m.id === orderId);
    if (!order) return;

    // Règle 4: stock movement exit if pieces are consumed
    // Check if we have parts associated
    // Inside mock/real structure, piecesUtilisees is an array.
    // For each piece, we register as a Mouvement de Stock Exit (Sortie)
    const customOrderPieces = orderSparePartsList; // local form state loaded or default pieces
    
    customOrderPieces.forEach(p => {
      // Find corresponding article inside stock if possible
      const item = articles.find(a => a.id === p.referencePiece || a.designation === p.referencePiece);
      onAddMouvement({
        id: 'mvt-auto-' + Date.now() + Math.random(),
        idMagasin: 'mag-1', // Default maintenance warehouse
        idArticle: item?.id || 'art-1',
        date: new Date().toISOString().split('T')[0],
        type: 'Sortie',
        quantite: p.quantite,
        motif: 'Consommation Agricole',
        coutUnitaire: p.coutUnitaire,
        responsable: 'GMAO Admin'
      });
    });

    // Toggle back equipment status of corresponding machine to "En service"
    setEquipements(prev => prev.map(eq => {
      if (eq.id === order.idEquipement) {
        return { ...eq, etat: 'En service' };
      }
      return eq;
    }));

    // Update order status inside array
    setMaintenances(prev => prev.map(m => {
      if (m.id === orderId) {
        return { ...m, statut: 'Réalisée', dateRealisation: new Date().toISOString().split('T')[0] };
      }
      return m;
    }));

    setOrderSparePartsList([]);
  };

  // Trigger curative order from breakdown (Règle 5 — non elimination)
  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderEqId) return;

    const newOrder: MaintenanceOrder = {
      id: 'maint-' + Date.now(),
      idEquipement: orderEqId,
      type: orderType === 'Curative' ? 'Corrective' : 'Préventive',
      technicien: orderPrestenaire || 'Technicien Interne',
      datePlanifiee: orderDatePlanifiee,
      description: orderDescription,
      statut: 'En attente',
      coûtFCFA: Number(orderCoutMainOeuvre) + orderSparePartsList.reduce((acc, p) => acc + (p.quantite * p.coutUnitaire), 0)
    };

    setMaintenances(prev => [...prev, newOrder]);

    // Turn equipment state of target machine to "En maintenance" (Règle 2 : Block deployments)
    setEquipements(prev => prev.map(eq => {
      if (eq.id === orderEqId) {
        return { ...eq, etat: 'En maintenance' };
      }
      return eq;
    }));

    setShowAddOrderModal(false);
    // clear local state
    setOrderSparePartsList([]);
    setOrderDescription('');
  };

  // Report a breakdown (Panne)
  const handleReportBreakdown = (e: React.FormEvent) => {
    e.preventDefault();
    if (!breakdownEqId) return;

    const breakdownId = 'brk-' + Date.now();
    const orderId = 'maint-curative-' + Date.now();

    const newPanne: PanneEquipement = {
      id: breakdownId,
      idEquipement: breakdownEqId,
      date: breakdownDate,
      composantConcerne: breakdownComponent,
      gravite: breakdownGravite,
      causeIdentifiee: breakdownCause,
      idOrdreMaintenance: orderId
    };

    setPannesEquipement(prev => [...prev, newPanne]);

    // Turn equipment status to "En maintenance"
    setEquipements(prev => prev.map(eq => {
      if (eq.id === breakdownEqId) {
        return { ...eq, etat: 'En maintenance' };
      }
      return eq;
    }));

    // Instantly spawn an associated curative/corrective order inside GMAO so technician can act!
    const curativeOrder: MaintenanceOrder = {
      id: orderId,
      idEquipement: breakdownEqId,
      type: 'Corrective',
      technicien: 'Atangana Charles (Garage Auto Agricole)',
      datePlanifiee: breakdownDate,
      description: `[URGENT - Gravité: ${breakdownGravite}] Panne signalée sur ${breakdownComponent}. Cause présumée: ${breakdownCause}`,
      statut: 'En attente',
      coûtFCFA: breakdownGravite === 'Critique' ? 140000 : 65000
    };

    setMaintenances(prev => [...prev, curativeOrder]);
    setShowAddBreakdownModal(false);
  };

  // Add insurance policy
  const handleAddAssurance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assEqId || !assPoliceId) return;

    const newPol: AssuranceEquipement = {
      id: 'pol-' + Date.now(),
      idEquipement: assEqId,
      policeId: assPoliceId,
      dateDebut: assDateDebut,
      dateFin: assDateFin,
      primeAnnuelleFCFA: Number(assPrime)
    };

    setAssurancesEquipement(prev => [...prev, newPol]);
    setShowAddAssuranceModal(false);
  };

  // Filtered equipment list
  const filteredEquipements = equipements.filter(eq => {
    const matchesSearch = eq.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          eq.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          eq.marque.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          eq.modele.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || eq.type.toLowerCase() === categoryFilter.toLowerCase();
    const matchesStatus = statusFilter === 'all' || eq.etat.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6" id="parc-materiel-section">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 pb-4 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Sliders className="h-6 w-6 text-indigo-600" /> Parc Matériel & Maintenance GMAO
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Garantissez la disponibilité opérationnelle de vos engins agricoles, surveillez les plans périodiques et calculez les coûts réels de mécanisation.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowAddUsageModal(true)}
            className="px-3.5 py-2 hover:bg-slate-100 border border-slate-300 rounded-lg text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Gauge className="h-4 w-4 text-emerald-600" /> Saisir Utilisation
          </button>
          <button
            onClick={() => setShowAddBreakdownModal(true)}
            className="px-3.5 py-2 hover:bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <AlertTriangle className="h-4 w-4 text-red-600" /> Signaler Panne
          </button>
          <button
            onClick={() => setShowAddEqModal(true)}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
          >
            <Plus className="h-4 w-4" /> Nouvel Équipement
          </button>
        </div>
      </div>

      {/* MODULE SHIELD NAVIGATION TABS */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-2 scrollbar-none" id="fleet-subtabs">
        {[
          { id: 'kpis', label: 'Indicateurs de Fiabilité', icon: Activity },
          { id: 'fleet', label: "Référentiel du Parc", icon: Sliders },
          { id: 'usages', label: "Utilisations & Coûts", icon: Gauge },
          { id: 'maintenance', label: 'GMAO & Maintenance', icon: Wrench },
          { id: 'breakdowns', label: 'Historique des Pannes', icon: AlertTriangle },
          { id: 'insurances', label: 'Assurances & Polices', icon: ShieldCheck }
        ].map(tab => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
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

      {/* TAB CONTENT: 1. KPIs CORE DECISIONNELS */}
      {activeTab === 'kpis' && (
        <div className="space-y-6">
          {/* TOP CORE KPI METRICS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
              <div className="p-3 bg-indigo-50 rounded-lg">
                <Sliders className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Taux Disponibilité Global</h3>
                <p className="text-2xl font-bold text-slate-800 mt-1">
                  {getAvailabilityRate()}%
                </p>
                <span className="text-[10px] text-indigo-600 font-medium flex items-center gap-0.5 mt-0.5">
                  <TrendingUp className="h-3 w-3" /> Objectif &gt;90%
                </span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
              <div className="p-3 bg-amber-50 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Temps Moyen Entre Pannes</h3>
                <p className="text-2xl font-bold text-slate-800 mt-1">
                  {getMTBF()}
                </p>
                <span className="text-[10px] text-slate-500 mt-0.5">Indicateur de fatigue (MTBF)</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
              <div className="p-3 bg-teal-50 rounded-lg">
                <Wrench className="h-6 w-6 text-teal-600" />
              </div>
              <div>
                <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Taux Maintenance Préventive</h3>
                <p className="text-2xl font-bold text-slate-800 mt-1">{getPreventionRatio()}%</p>
                <span className="text-[10px] text-teal-600 font-bold flex items-center gap-1 mt-0.5">
                  Ratio GMAO recommandé
                </span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
              <div className="p-3 bg-rose-50 rounded-lg">
                <Clock className="h-6 w-6 text-rose-600" />
              </div>
              <div>
                <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Âge Moyen du Parc</h3>
                <p className="text-2xl font-bold text-slate-800 mt-1">{getAverageAgeYears()} ans</p>
                <span className="text-[10px] text-slate-500 mt-0.5">Renouvellement à anticiper</span>
              </div>
            </div>
          </div>

          {/* DYNAMIC COST CONTROL BOARD */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4 text-indigo-600" /> Règle de Coût Dynamique vs Standard (Amortissement + Entretien)
              </h3>
              
              <div className="space-y-4">
                {equipements.length === 0 ? (
                  <p className="text-slate-400 text-xs text-center py-6">Aucun équipement disponible, veuillez en créer.</p>
                ) : (
                  equipements.map(eq => {
                    const dynamicHourly = getDynamicHourlyCost(eq);
                    return (
                      <div key={eq.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex justify-between items-center">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-extrabold px-1.5 py-0.5 bg-slate-200 rounded text-slate-700">{eq.code}</span>
                            <h4 className="text-xs font-bold text-slate-800">{eq.designation}</h4>
                          </div>
                          <div className="text-[10px] text-slate-400 mt-1">
                            Amortissement annuel : {(eq.valeurAcquisition / (eq.dureeDeVieMois / 12)).toLocaleString()} FCFA | Enregistrements heures : {eq.heuresMoteurOrKm}h
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-extrabold text-indigo-700 block">
                            {dynamicHourly.toLocaleString()} FCFA / h
                          </span>
                          <span className="text-[9px] text-slate-400">Coût horaire recalculé</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              <p className="text-[10px] text-slate-400 mt-3 italic">
                * Conforme à la Règle 1: taux horaire recalculé en temps réel = (Amortissement annuel + maintenance cumulée + carburant) / heures d'utilisation réelles.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
              <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-indigo-600" /> États de Disponibilité & Alerte Mixte de Maintenance
              </h3>

              <div className="space-y-3">
                {plansMaintenance.length === 0 ? (
                  <p className="text-slate-400 text-xs text-center py-6">Aucun plan de maintenance préventive structuré.</p>
                ) : (
                  plansMaintenance.map(plan => {
                    const status = getPlanAlertStatus(plan);
                    const eqObj = equipements.find(e => e.id === plan.idEquipement);
                    return (
                      <div key={plan.id} className={`p-3 rounded-lg border flex justify-between items-center ${
                        status.triggered ? 'bg-red-50 border-red-200' : 'bg-green-50/50 border-green-200'
                      }`}>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded leading-none ${
                              status.triggered ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
                            }`}>
                              {status.triggered ? 'Alerte' : 'Ok'}
                            </span>
                            <span className="text-xs font-bold text-slate-800">{plan.typeOperation}</span>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-0.5">
                            Modèle : {eqObj ? `${eqObj.marque} ${eqObj.modele} (${eqObj.code})` : `Catégorie ${plan.categorieEquipement}`} 
                            | Déclencheur: {plan.declencheur}
                          </p>
                        </div>
                        <div className="text-right text-[10px] text-slate-600 max-w-xs font-medium">
                          {status.triggered ? (
                            <span className="text-red-700 font-bold block">{status.motif}</span>
                          ) : (
                            <span className="text-green-700">Seuils non atteints</span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              <p className="text-[10px] text-slate-400 italic">
                * Conforme à la Règle 3: double seuil de détection simultanée (périodique ET calendaire), l'échéance se déclenche sur le premier seuil obsolète.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 2. REFERENTIEL DU PARC */}
      {activeTab === 'fleet' && (
        <div className="space-y-4">
          {/* SEARCH & FILTERS BAR */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Rechercher engin, marque..."
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-indigo-600 bg-slate-50"
              />
            </div>
            
            <div className="flex flex-wrap w-full md:w-auto items-center gap-2">
              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="p-2 border border-slate-300 bg-white rounded-lg text-xs"
              >
                <option value="all">Toutes Catégories</option>
                <option value="tracteur">Tracteurs</option>
                <option value="véhicule">Véhicules</option>
                <option value="pompe">Motopompes</option>
                <option value="générateur">Générateurs</option>
                <option value="outil">Outils d'élevage / mélanges</option>
              </select>

              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="p-2 border border-slate-300 bg-white rounded-lg text-xs"
              >
                <option value="all">Tous statuts</option>
                <option value="en service">En Service</option>
                <option value="en maintenance">En Maintenance</option>
                <option value="hors service">Immobilisé / HS</option>
              </select>
            </div>
          </div>

          {/* CARDS LIST OF FLEET */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredEquipements.length === 0 ? (
              <div className="col-span-full bg-white p-12 text-center border rounded-xl">
                <p className="text-slate-400 text-sm">Aucun équipement ne correspond aux filtres.</p>
              </div>
            ) : (
              filteredEquipements.map(eq => {
                const calculatedHourly = getDynamicHourlyCost(eq);
                return (
                  <div key={eq.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between">
                    <div className="p-5 space-y-3">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-slate-100 rounded text-slate-500">
                          {eq.type}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          eq.etat === 'En service' ? 'bg-green-100 text-green-700' : 
                          eq.etat === 'En maintenance' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {eq.etat}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-slate-800 truncate" title={eq.designation}>
                          {eq.designation}
                        </h4>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                          <span>{eq.marque}</span>
                          <span>•</span>
                          <span>{eq.modele}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[10.5px] border-t border-b border-dashed border-slate-100 py-2 mt-2">
                        <div>
                          <span className="text-slate-400 block">Code Unique :</span>
                          <span className="font-bold text-slate-700">{eq.code}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Compteur :</span>
                          <span className="font-bold text-slate-700">{eq.heuresMoteurOrKm} h/km</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Date Achat :</span>
                          <span className="font-bold text-slate-700">{eq.dateAchat}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Achat initial :</span>
                          <span className="font-bold text-slate-700">{eq.valeurAcquisition.toLocaleString()} FCFA</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center justify-between gap-1">
                      <div className="text-[10px] text-slate-500">
                        <span>Coût horaire Dynamique:</span>
                        <span className="block font-bold text-indigo-700 text-xs">{calculatedHourly.toLocaleString()} FCFA</span>
                      </div>
                      
                      {/* QUICK STATUS UPDATE FROM REFERENTIEL */}
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => handleUpdateStatus(eq.id, 'En service')}
                          className="p-1.5 hover:bg-green-100 text-green-700 rounded-lg transition"
                          title="Remettre en service"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(eq.id, 'En maintenance')}
                          className="p-1.5 hover:bg-amber-100 text-amber-700 rounded-lg transition"
                          title="Mettre en maintenance"
                        >
                          <Wrench className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(eq.id, 'Vendu/Cédé')}
                          className="p-1.5 hover:bg-red-100 text-red-700 rounded-lg transition"
                          title="Marquer comme Vendu (Règle 5 : Garde l'historique de panne)"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: 3. USAGES & COMPTEURS UTILISATION */}
      {activeTab === 'usages' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* HISTORY LOGS */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 lg:col-span-2 space-y-4">
            <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
              <Gauge className="h-4 w-4 text-indigo-600" /> Indexation des Utilisations réelles sur le terrain
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[10px] font-bold">
                    <th className="p-3">Date</th>
                    <th className="p-3">Engin</th>
                    <th className="p-3">Opérateur</th>
                    <th className="p-3">Compteur (Début / Fin)</th>
                    <th className="p-3">Distance / Heures</th>
                    <th className="p-3 text-right">Carburant consommé</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {utilisationsEquipement.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-slate-400">Aucune utilisation enregistrée sur cette période.</td>
                    </tr>
                  ) : (
                    utilisationsEquipement.map(u => {
                      const eqObj = equipements.find(e => e.id === u.idEquipement);
                      return (
                        <tr key={u.id} className="hover:bg-slate-50/50">
                          <td className="p-3">{u.dateDebut}</td>
                          <td className="p-3">
                            <span className="font-bold text-slate-800 block">{eqObj?.designation}</span>
                            <span className="text-[10px] text-slate-400">{eqObj?.code}</span>
                          </td>
                          <td className="p-3 font-semibold text-slate-700">{u.operateur}</td>
                          <td className="p-3 text-slate-500">{u.compteurDebut} ➔ {u.compteurFin}</td>
                          <td className="p-3 font-bold text-slate-800">{u.compteurFin - u.compteurDebut} h/km</td>
                          <td className="p-3 text-right text-indigo-700 font-bold">
                            {u.carburantConsommeLitres} L ({u.carburantCoutFCFA.toLocaleString()} FCFA)
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* LATEST GENERATIVE COMPTEUR READINGS */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-indigo-600" /> Historique de Relevés Compteurs
              </h3>
              <button
                onClick={() => setShowAddCounterModal(true)}
                className="text-[11px] font-bold text-indigo-600 hover:underline flex items-center mt-1"
              >
                + Relevé
              </button>
            </div>

            <div className="space-y-3.5 max-h-[400px] overflow-y-auto">
              {compteursUtilisation.length === 0 ? (
                <p className="text-slate-400 text-xs text-center py-6">Aucun relevé de compteur loggé.</p>
              ) : (
                compteursUtilisation.map(cnt => {
                  const eqObj = equipements.find(e => e.id === cnt.idEquipement);
                  return (
                    <div key={cnt.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex justify-between items-center text-xs">
                      <div>
                        <span className="font-semibold block text-slate-800">{eqObj?.designation}</span>
                        <span className="text-[10px] text-slate-400">{cnt.date} par {cnt.relevePar}</span>
                      </div>
                      <div className="text-right font-bold text-indigo-800">
                        {cnt.valeurRelevee} {cnt.typeCompteur === 'Kilométrage' ? 'Km' : 'h'}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 4. GMAO & MAINTENANCE ORDERS */}
      {activeTab === 'maintenance' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ACTIVE WORK ORDERS LIST (GMAO) */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                <Wrench className="h-4 w-4 text-indigo-600" /> GMAO - Ordres de Maintenance Planifiés & Curatifs
              </h3>
              <button
                onClick={() => setShowAddOrderModal(true)}
                className="px-2.5 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-slate-100 text-xs font-semibold flex items-center gap-1"
              >
                <Plus className="h-3 w-3" /> Planifier Maint.
              </button>
            </div>

            <div className="space-y-4">
              {maintenances.length === 0 ? (
                <p className="text-slate-400 text-xs text-center py-6">Aucun ordre de maintenance loggée dans le carnet.</p>
              ) : (
                maintenances.map(order => {
                  const eqObj = equipements.find(e => e.id === order.idEquipement);
                  return (
                    <div key={order.id} className="p-4 bg-slate-50/50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded leading-none ${
                            order.type === 'Corrective' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {order.type}
                          </span>
                          <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded leading-none ${
                            order.statut === 'Réalisée' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {order.statut === 'Réalisée' ? 'En Service' : 'À faire'}
                          </span>
                          <span className="text-xs font-bold text-slate-800">{eqObj?.designation} ({eqObj?.code})</span>
                        </div>
                        <p className="text-xs text-slate-600 font-medium">{order.description}</p>
                        <div className="text-[10px] text-slate-400 flex flex-wrap gap-2 pt-1">
                          <span>Mécano: <strong className="text-slate-600">{order.technicien}</strong></span>
                          <span>•</span>
                          <span>Échéance: <strong className="text-slate-600">{order.datePlanifiee}</strong></span>
                        </div>
                      </div>

                      <div className="text-right flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 border-t sm:border-0 pt-2 sm:pt-0">
                        <div>
                          <span className="text-xs text-slate-400 block sm:inline">Coût estimatif : </span>
                          <span className="text-xs font-extrabold text-indigo-700">
                            {order.coûtFCFA.toLocaleString()} FCFA
                          </span>
                        </div>
                        
                        {order.statut === 'En attente' && (
                          <button
                            onClick={() => handleCompleteOrder(order.id)}
                            className="px-2.5 py-1 hover:bg-slate-100 border border-emerald-300 rounded-lg text-emerald-700 text-xs font-semibold flex items-center gap-1 transition"
                          >
                            <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Clôturer (Sorties Pièces)
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* ACTIVE TEMPLATES RULES REFERENCE */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                <Settings className="h-4 w-4 text-indigo-600" /> Modèles de Maintenance Préventive
              </h3>
              <button
                onClick={() => setShowAddPlanModal(true)}
                className="text-[11px] font-bold text-indigo-600 hover:underline"
              >
                + Modèle
              </button>
            </div>

            <div className="space-y-3">
              {plansMaintenance.length === 0 ? (
                <p className="text-slate-400 text-xs text-center py-6">Aucune règle préventive configurée.</p>
              ) : (
                plansMaintenance.map(plan => {
                  const eqObj = equipements.find(e => e.id === plan.idEquipement);
                  return (
                    <div key={plan.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs space-y-1">
                      <div className="font-bold text-slate-800 flex justify-between items-center">
                        <span>{plan.typeOperation}</span>
                        <span className="text-[10px] text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded uppercase">
                          {plan.declencheur}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500">
                        Cible : {eqObj ? `${eqObj.designation} (${eqObj.code})` : `Catégorie ${plan.categorieEquipement}`}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-1 text-[9.5px] text-slate-400 pt-1 border-t border-slate-100/50">
                        {plan.seuilPeriodiqueHeures && (
                          <span>Période: {plan.seuilPeriodiqueHeures}h</span>
                        )}
                        {plan.seuilCalendaireMois && (
                          <span>Calendrier: {plan.seuilCalendaireMois} mois</span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 5. HISTORY OF BREAKDOWNS (Pannes) */}
      {activeTab === 'breakdowns' && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4 text-red-600" /> Historique des Pannes & Éléments Fiabilités (Garde l'historique de panne d'engins vendus)
            </h3>
            <span className="text-xs text-slate-500 italic">Total enregistrements : {pannesEquipement.length}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {pannesEquipement.length === 0 ? (
              <p className="text-slate-400 text-xs text-center py-12 col-span-full">Aucun incident de panne à signaler sur le matériel.</p>
            ) : (
              pannesEquipement.map(p => {
                const eqObj = equipements.find(e => e.id === p.idEquipement);
                return (
                  <div key={p.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        {/* Sold equipments are shown clearly too */}
                        <h4 className="text-sm font-bold text-slate-800">
                          {eqObj ? eqObj.designation : `Matériel Obsolète / Vendu (ID: ${p.idEquipement})`}
                        </h4>
                        <span className="text-[10px] text-slate-400 block mt-0.5">Panne du {p.date}</span>
                      </div>

                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        p.gravite === 'Critique' ? 'bg-red-200 text-red-800 font-extrabold' : 
                        p.gravite === 'Majeure' ? 'bg-orange-100 text-orange-700' : 'bg-yellow-105 text-yellow-800'
                      }`}>
                        {p.gravite}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 space-y-1">
                      <div>Composant affecté : <strong className="text-slate-800">{p.composantConcerne}</strong></div>
                      <div>Causa identifiée : <span className="italic text-slate-500">"{p.causeIdentifiee || 'Non déterminée'}"</span></div>
                    </div>

                    {p.idOrdreMaintenance && (
                      <div className="pt-2 border-t border-slate-100 mt-2 flex justify-between items-center text-[10px] text-indigo-700 font-semibold">
                        <span>Fiche GMAO curative rattachée :</span>
                        <span className="underline">{p.idOrdreMaintenance}</span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: 6. ASSURANCES */}
      {activeTab === 'insurances' && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
          <div className="flex justify-between items-center border-b pb-3 border-slate-100">
            <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600" /> Assurance & Polices d'Équipements Lourds
            </h3>
            <button
              onClick={() => setShowAddAssuranceModal(true)}
              className="px-2.5 py-1 hover:bg-slate-100 border border-slate-300 rounded-lg text-slate-700 text-xs font-semibold flex items-center gap-1 transition"
            >
              + Rattacher Police
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[10px] font-bold">
                  <th className="p-3">Engin agricole</th>
                  <th className="p-3">Numéro Police ID</th>
                  <th className="p-3">Validité active</th>
                  <th className="p-3">Prime Annuelle (FCFA)</th>
                  <th className="p-3 text-right">Statut couverture</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {assurancesEquipement.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-slate-400">Aucun contrat d'assurance rattaché pour l'instant.</td>
                  </tr>
                ) : (
                  assurancesEquipement.map(ass => {
                    const eqObj = equipements.find(e => e.id === ass.idEquipement);
                    const isActive = new Date(ass.dateFin) > new Date();
                    return (
                      <tr key={ass.id}>
                        <td className="p-3 font-bold text-slate-800">{eqObj?.designation}</td>
                        <td className="p-3 font-mono text-slate-600">{ass.policeId}</td>
                        <td className="p-3 text-slate-500">{ass.dateDebut} ➔ {ass.dateFin}</td>
                        <td className="p-3 font-bold text-indigo-700">{ass.primeAnnuelleFCFA.toLocaleString()} FCFA</td>
                        <td className="p-3 text-right">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {isActive ? 'COUVERTURE ACTIVE' : 'PÉRIMÉ'}
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

      {/* --- ADD EQUIPMENT MODAL --- */}
      {showAddEqModal && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl border max-w-lg w-full p-6 animate-in fade-in zoom-in duration-150">
            <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-1.5 border-b pb-3">
              <Plus className="h-5 w-5 text-indigo-600" /> Enregistrer un nouvel équipement / engin
            </h3>
            
            <form onSubmit={handleCreateEquipment} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Désignation *</label>
                  <input
                    type="text"
                    value={eqDesignation}
                    onChange={e => setEqDesignation(e.target.value)}
                    placeholder="Tracteur John Deere..."
                    className="p-2 border rounded-md text-xs w-full bg-slate-50"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Code Interne Unique *</label>
                  <input
                    type="text"
                    value={eqCode}
                    onChange={e => setEqCode(e.target.value)}
                    placeholder="EQ-TRAC-02"
                    className="p-2 border rounded-md text-xs w-full bg-slate-50"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Marque</label>
                  <input
                    type="text"
                    value={eqMarque}
                    onChange={e => setEqMarque(e.target.value)}
                    placeholder="Foton, Toyota..."
                    className="p-1.5 border rounded-md text-xs w-full bg-slate-50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Modèle</label>
                  <input
                    type="text"
                    value={eqModele}
                    onChange={e => setEqModele(e.target.value)}
                    placeholder="D4D Simple..."
                    className="p-1.5 border rounded-md text-xs w-full bg-slate-50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Catégorie *</label>
                  <select
                    value={eqType}
                    onChange={e => setEqType(e.target.value as any)}
                    className="p-1.5 border rounded-md text-xs w-full bg-slate-50"
                  >
                    <option value="Tracteur">Tracteur</option>
                    <option value="Pompe">Motopompe</option>
                    <option value="Véhicule">Pick-up / Véhicule</option>
                    <option value="Générateur">Générateur</option>
                    <option value="Machine agricole">Mélangeuse / Moissonneuse</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Mode d'Acquisition *</label>
                  <select
                    value={eqModeAcquisition}
                    onChange={e => setEqModeAcquisition(e.target.value as any)}
                    className="p-2 border rounded-md text-xs w-full bg-slate-50"
                  >
                    <option value="Achat">Achat direct</option>
                    <option value="LLD">Location Longue Durée (LLD)</option>
                    <option value="Crédit-bail">Crédit-bail / Leasing</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Immatriculation</label>
                  <input
                    type="text"
                    value={eqImmatriculation}
                    onChange={e => setEqImmatriculation(e.target.value)}
                    placeholder="CE-112-LS"
                    className="p-2 border rounded-md text-xs w-full bg-slate-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Montant (FCFA) *</label>
                  <input
                    type="number"
                    value={eqValeurAcquisition}
                    onChange={e => setEqValeurAcquisition(Number(e.target.value))}
                    className="p-1.5 border rounded-md text-xs w-full bg-slate-50"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Durée estimée (mois)</label>
                  <input
                    type="number"
                    value={eqDureeDeVieMois}
                    onChange={e => setEqDureeDeVieMois(Number(e.target.value))}
                    className="p-1.5 border rounded-md text-xs w-full bg-slate-50"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Stationnement</label>
                  <input
                    type="text"
                    value={eqLieuStationnement}
                    onChange={e => setEqLieuStationnement(e.target.value)}
                    className="p-1.5 border rounded-md text-xs w-full bg-slate-50"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t pt-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowAddEqModal(false)}
                  className="px-4 py-2 border rounded-md text-xs text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md text-xs hover:bg-indigo-700 font-semibold"
                >
                  Ajouter au Répartiteur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- RELEVE COMPTEUR MODAL --- */}
      {showAddCounterModal && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl border max-w-md w-full p-6">
            <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-1.5 border-b pb-3">
              <Clock className="h-5 w-5 text-indigo-600" /> Saisir un relevé périodique d'utilisation
            </h3>

            <form onSubmit={handleAddCounterLog} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Équipement cible *</label>
                <select
                  value={selectedEqIdForCounter}
                  onChange={e => setSelectedEqIdForCounter(e.target.value)}
                  className="p-2 border rounded-md text-xs bg-slate-50 w-full"
                  required
                >
                  <option value="">-- Choisir un matériel --</option>
                  {equipements.map(eq => (
                    <option key={eq.id} value={eq.id}>{eq.designation} ({eq.code})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Type Compteur</label>
                  <select
                    value={counterType}
                    onChange={e => setCounterType(e.target.value)}
                    className="p-2 border rounded-md text-xs bg-slate-50 w-full"
                  >
                    <option value="Heures moteur">Heures moteur</option>
                    <option value="Kilométrage">Kilométrage</option>
                    <option value="Hectares travaillés">Hectares travaillés</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Valeur Relevée *</label>
                  <input
                    type="number"
                    value={counterValue}
                    onChange={e => setCounterValue(Number(e.target.value))}
                    className="p-2 border rounded-md text-xs bg-slate-50 w-full"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Relevé effectué par</label>
                <input
                  type="text"
                  value={counterRelevePar}
                  onChange={e => setCounterRelevePar(e.target.value)}
                  placeholder="Jean-Pierre Ondoa, Sébastien Etoa..."
                  className="p-2 border rounded-md text-xs bg-slate-50 w-full"
                />
              </div>

              <div className="flex justify-end gap-2 border-t pt-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowAddCounterModal(false)}
                  className="px-4 py-2 border rounded-md text-xs text-slate-600 font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md text-xs font-semibold"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ADD PLAN MAINTENANCE MODAL --- */}
      {showAddPlanModal && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl border max-w-md w-full p-6">
            <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-1.5 border-b pb-3">
              <Settings className="h-5 w-5 text-indigo-600" /> Définir un modèle de maintenance préventive
            </h3>

            <form onSubmit={handleAddPlanMaintenance} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Équipement Spécifique</label>
                <select
                  value={planEqId}
                  onChange={e => setPlanEqId(e.target.value)}
                  className="p-2 border rounded-md text-xs bg-slate-50 w-full"
                >
                  <option value="">Tous les équipements de la catégorie</option>
                  {equipements.map(e => (
                    <option key={e.id} value={e.id}>{e.designation} ({e.code})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Opération type</label>
                  <input
                    type="text"
                    value={planTypeOperation}
                    onChange={e => setPlanTypeOperation(e.target.value)}
                    placeholder="Vidange des ponts/graissage"
                    className="p-2 border rounded-md text-xs bg-slate-50 w-full"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Déclencheur *</label>
                  <select
                    value={planDeclencheur}
                    onChange={e => setPlanDeclencheur(e.target.value as any)}
                    className="p-2 border rounded-md text-xs bg-slate-50 w-full"
                  >
                    <option value="périodique">Périodique (Heures)</option>
                    <option value="calendaire">Calendaire (Mois)</option>
                    <option value="mixte">Double (Mixte : Heures ET Calendaire)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Seuil Heures</label>
                  <input
                    type="number"
                    value={planSeuilHeures}
                    disabled={planDeclencheur === 'calendaire'}
                    onChange={e => setPlanSeuilHeures(Number(e.target.value))}
                    className="p-1.5 border rounded-md text-xs bg-slate-50 w-full"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Seuil Météo (Mois)</label>
                  <input
                    type="number"
                    value={planSeuilMois}
                    disabled={planDeclencheur === 'périodique'}
                    onChange={e => setPlanSeuilMois(Number(e.target.value))}
                    className="p-1.5 border rounded-md text-xs bg-slate-50 w-full"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Pré-alerte (h)</label>
                  <input
                    type="number"
                    value={planSeuilAlerteAnticipee}
                    disabled={planDeclencheur === 'calendaire'}
                    onChange={e => setPlanSeuilAlerteAnticipee(Number(e.target.value))}
                    className="p-1.5 border rounded-md text-xs bg-slate-50 w-full"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t pt-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowAddPlanModal(false)}
                  className="px-4 py-2 border rounded-md text-xs text-slate-600 font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md text-xs font-semibold"
                >
                  Ajouter Règle GMAO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ADD GMAO REPAIR ORDER MODAL --- */}
      {showAddOrderModal && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl border max-w-lg w-full p-6">
            <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-1.5 border-b pb-3">
              <WrenchIcon className="h-5 w-5 text-indigo-600" /> Planifier un ordre de maintenance (Fiche GMAO)
            </h3>

            <form onSubmit={handleCreateOrder} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Équipement *</label>
                  <select
                    value={orderEqId}
                    onChange={e => setOrderEqId(e.target.value)}
                    className="p-2 border rounded-md text-xs bg-slate-50 w-full"
                    required
                  >
                    <option value="">Choisir un engin</option>
                    {equipements.map(eq => (
                      <option key={eq.id} value={eq.id}>{eq.designation} ({eq.code})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Type d'Ordre *</label>
                  <select
                    value={orderType}
                    onChange={e => setOrderType(e.target.value as any)}
                    className="p-2 border rounded-md text-xs bg-slate-50 w-full"
                  >
                    <option value="Préventive">Préventive (Planifié)</option>
                    <option value="Curative">Corrective / Curative (Panne)</option>
                    <option value="Réglementaire">Contrôle Réglementaire</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Technicien / Prestataire</label>
                  <input
                    type="text"
                    value={orderPrestenaire}
                    onChange={e => setOrderPrestenaire(e.target.value)}
                    placeholder="Mécano Charles, SOPROICAM..."
                    className="p-2 border rounded-md text-xs bg-slate-50 w-full"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Date planifiée *</label>
                  <input
                    type="date"
                    value={orderDatePlanifiee}
                    onChange={e => setOrderDatePlanifiee(e.target.value)}
                    className="p-2 border rounded-md text-xs bg-slate-50 w-full"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Description de l'Opération / Dysfonctionnement *</label>
                <textarea
                  value={orderDescription}
                  onChange={e => setOrderDescription(e.target.value)}
                  placeholder="Détails techniques (pièces à changer, graissage des roulements, réglage de pression...)"
                  className="p-2 border rounded-md text-xs bg-slate-50 w-full h-16"
                  required
                />
              </div>

              {/* CONSUMED PARTS SUB-SCHEMES */}
              <div className="p-3 bg-slate-50 rounded-lg border border-dashed text-xs space-y-2">
                <span className="font-bold text-slate-700 block">Dépenses Pièces Détachées (Règle 4 — Mouvements de stock auto)</span>
                
                <div className="flex gap-2">
                  <select
                    value={orderPartArticleId}
                    onChange={e => setOrderPartArticleId(e.target.value)}
                    className="p-1 border bg-white rounded text-xs grow"
                  >
                    <option value="">Sélectionner une pièce en stock</option>
                    {articles.map(a => (
                      <option key={a.id} value={a.id}>{a.designation} (Achat standard: {a.prixFournisseurMoyen} FCFA)</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={orderPartQty}
                    onChange={e => setOrderPartQty(Number(e.target.value))}
                    className="p-1 border bg-white rounded text-xs w-16"
                    placeholder="Qté"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!orderPartArticleId) return;
                      const matchedItem = articles.find(a => a.id === orderPartArticleId);
                      const unitCost = matchedItem?.prixFournisseurMoyen || 15000;
                      setOrderSparePartsList(prev => [...prev, {
                        referencePiece: orderPartArticleId,
                        quantite: orderPartQty,
                        coutUnitaire: unitCost
                      }]);
                    }}
                    className="px-2 py-1 bg-slate-800 text-white rounded text-xs font-bold"
                  >
                    + Ajouter
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {orderSparePartsList.map((part, index) => (
                    <span key={index} className="px-2 py-0.5 bg-slate-200 text-slate-800 rounded-full text-[10px] font-bold flex items-center gap-1">
                      {part.referencePiece} (x{part.quantite}) - {(part.quantite * part.coutUnitaire).toLocaleString()} FCFA
                      <button
                        type="button"
                        onClick={() => setOrderSparePartsList(prev => prev.filter((_, i) => i !== index))}
                        className="text-red-600 hover:text-red-900 ml-1 font-bold"
                      >
                        x
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Estimation Main d'œuvre (FCFA)</label>
                <input
                  type="number"
                  value={orderCoutMainOeuvre}
                  onChange={e => setOrderCoutMainOeuvre(Number(e.target.value))}
                  className="p-2 border rounded-md text-xs bg-slate-50 w-full"
                />
              </div>

              <div className="flex justify-end gap-2 border-t pt-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowAddOrderModal(false)}
                  className="px-4 py-2 border rounded-md text-xs text-slate-600 font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md text-xs font-semibold"
                >
                  Lancer Ordre GMAO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- RECONCILE BREAKDOWN INCIDENT MODAL --- */}
      {showAddBreakdownModal && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl border max-w-md w-full p-6">
            <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-1.5 border-b pb-3">
              <AlertTriangle className="h-5 w-5 text-red-600" /> Déclarer un incident de panne machine
            </h3>

            <p className="text-[11px] text-slate-500 leading-normal mb-3">
              💡 La déclaration d'une panne bascule l'engin ciblé en statut "En maintenance" (déclenche un blocage de planification) et génère instantanément une fiche corrective de GMAO.
            </p>

            <form onSubmit={handleReportBreakdown} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Équipement en Panne *</label>
                <select
                  value={breakdownEqId}
                  onChange={e => setBreakdownEqId(e.target.value)}
                  className="p-2 border rounded-md text-xs bg-slate-50 w-full"
                  required
                >
                  <option value="">Sélectionner le matériel HS</option>
                  {equipements.map(e => (
                    <option key={e.id} value={e.id}>{e.designation} ({e.code})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Date incident *</label>
                  <input
                    type="date"
                    value={breakdownDate}
                    onChange={e => setBreakdownDate(e.target.value)}
                    className="p-2 border rounded-md text-xs bg-slate-50 w-full"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Gravité d'immobilisation</label>
                  <select
                    value={breakdownGravite}
                    onChange={e => setBreakdownGravite(e.target.value as any)}
                    className="p-2 border rounded-md text-xs bg-slate-50 w-full"
                  >
                    <option value="Mineure">Mineure (Sifflement, fuite mineure)</option>
                    <option value="Majeure">Majeure (Dégradation de performance)</option>
                    <option value="Critique">Critique (Immobilisante complète / Accident)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Composant mécanique concerné</label>
                <input
                  type="text"
                  value={breakdownComponent}
                  onChange={e => setBreakdownComponent(e.target.value)}
                  placeholder="Embrayage, cardans, culasse, flexibles pompe..."
                  className="p-2 border rounded-md text-xs bg-slate-50.w-full"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Cause présumée identifiée</label>
                <textarea
                  value={breakdownCause}
                  onChange={e => setBreakdownCause(e.target.value)}
                  placeholder="Erreur d'utilisation, vieillissement de pièce, débris dur..."
                  className="p-2 border rounded-md text-xs bg-slate-50 w-full h-16"
                />
              </div>

              <div className="flex justify-end gap-2 border-t pt-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowAddBreakdownModal(false)}
                  className="px-4 py-2 border rounded-md text-xs text-slate-600 font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-md text-xs font-semibold hover:bg-red-700"
                >
                  Envoyer aux Ateliers
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ADD DETAILED USAGE DEPLOYMENT WITH R2 BLOCATOR LOCK --- */}
      {showAddUsageModal && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl border max-w-md w-full p-6 animate-in fade-in">
            <h3 className="text-base font-bold text-slate-800 mb-1 flex items-center gap-1.5">
              <Gauge className="h-5 w-5 text-indigo-600" /> Saisie Déploiement / Utilisation Matériel
            </h3>
            <p className="text-[10.5px] text-slate-400 mb-3 leading-normal">
              Contrôlez les heures, km décomptés et carburants consommés pour calculer la valeur reversée d'utilisation de mécanisation.
            </p>

            {errorUsage && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg font-bold border border-red-200 leading-normal mb-3">
                {errorUsage}
              </div>
            )}

            <form onSubmit={handleAddUtilisation} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Équipement à Mobiliser *</label>
                <select
                  value={useEqId}
                  onChange={e => {
                    setUseEqId(e.target.value);
                    const selected = equipements.find(eq => eq.id === e.target.value);
                    if (selected) {
                      setUseCompteurDebut(selected.heuresMoteurOrKm);
                      setUseCompteurFin(selected.heuresMoteurOrKm + 8); // estimate average usage
                    }
                  }}
                  className="p-2 border rounded-md text-xs bg-slate-50 w-full"
                  required
                >
                  <option value="">Sélectionner l'engin</option>
                  {equipements.map(eq => (
                    <option key={eq.id} value={eq.id}>
                      {eq.designation} ({eq.code}) — statut actual: {eq.etat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Chauffeur / Opérateur *</label>
                  <select
                    value={useOperateur}
                    onChange={e => setUseOperateur(e.target.value)}
                    className="p-2 border rounded-md text-xs bg-slate-50 w-full"
                    required
                  >
                    <option value="">Sélectionner</option>
                    {employes.map(emp => (
                      <option key={emp.id} value={`${emp.prenom} ${emp.nom}`}>{emp.prenom} {emp.nom} ({emp.poste})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Lien Intervention Métier</label>
                  <select
                    value={useInterventionId}
                    onChange={e => setUseInterventionId(e.target.value)}
                    className="p-2 border rounded-md text-xs bg-slate-50 w-full"
                  >
                    <option value="">Aucune liaison (Usage interne)</option>
                    {interventions.map(i => (
                      <option key={i.id} value={i.id}>
                        {i.type} sur {i.idParcelle} ({i.date})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Compteur Départ *</label>
                  <input
                    type="number"
                    value={useCompteurDebut}
                    onChange={e => setUseCompteurDebut(Number(e.target.value))}
                    className="p-2 border rounded-md text-xs bg-slate-50 w-full"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Compteur Arrivée *</label>
                  <input
                    type="number"
                    value={useCompteurFin}
                    onChange={e => setUseCompteurFin(Number(e.target.value))}
                    className="p-2 border rounded-md text-xs bg-slate-50 w-full"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Fuel Consommé (Litres)</label>
                  <input
                    type="number"
                    value={useCarburantLitres}
                    onChange={e => setUseCarburantLitres(Number(e.target.value))}
                    className="p-2 border rounded-md text-xs bg-slate-50 w-full"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Coût Carburant (FCFA)</label>
                  <input
                    type="number"
                    value={useCarburantCout}
                    onChange={e => setUseCarburantCout(Number(e.target.value))}
                    className="p-2 border rounded-md text-xs bg-slate-50 w-full"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t pt-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowAddUsageModal(false)}
                  className="px-4 py-2 border rounded-md text-xs text-slate-600 font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md text-xs font-semibold"
                >
                  Valider Déploiement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ADD INSURANCE CONTRACT MODAL --- */}
      {showAddAssuranceModal && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl border max-w-md w-full p-6">
            <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-1.5 border-b pb-3">
              <ShieldCheck className="h-5 w-5 text-indigo-600" /> Rattacher un contrat d'assurance équipement
            </h3>

            <form onSubmit={handleAddAssurance} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Équipement Garanti *</label>
                <select
                  value={assEqId}
                  onChange={e => setAssEqId(e.target.value)}
                  className="p-2 border rounded-md text-xs bg-slate-50 w-full"
                  required
                >
                  <option value="">Sélectionner</option>
                  {equipements.map(e => (
                    <option key={e.id} value={e.id}>{e.designation} ({e.code})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase">N° Police ID d'Assurance *</label>
                <input
                  type="text"
                  value={assPoliceId}
                  onChange={e => setAssPoliceId(e.target.value)}
                  placeholder="POL-2026-X891X"
                  className="p-2 border rounded-md text-xs bg-slate-50 w-full"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Date début couverture *</label>
                  <input
                    type="date"
                    value={assDateDebut}
                    onChange={e => setAssDateDebut(e.target.value)}
                    className="p-2 border rounded-md text-xs bg-slate-50 w-full"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Date d'échéance *</label>
                  <input
                    type="date"
                    value={assDateFin}
                    onChange={e => setAssDateFin(e.target.value)}
                    className="p-2 border rounded-md text-xs bg-slate-50 w-full"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Prime Annuelle (FCFA) *</label>
                <input
                  type="number"
                  value={assPrime}
                  onChange={e => setAssPrime(Number(e.target.value))}
                  className="p-2 border rounded-md text-xs bg-slate-50 w-full"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 border-t pt-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowAddAssuranceModal(false)}
                  className="px-4 py-2 border rounded-md text-xs text-slate-600 font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md text-xs font-semibold"
                >
                  Créer Police Garanti
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
