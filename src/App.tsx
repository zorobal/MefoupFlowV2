/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  INITIAL_SAAS_CLIENTS,
  INITIAL_EXPLOITATIONS,
  INITIAL_SITES_AGRICOLES,
  INITIAL_PARCELLES,
  INITIAL_CAMPAGNES,
  INITIAL_CULTURES,
  INITIAL_INTERVENTIONS,
  INITIAL_RECOLTES,
  INITIAL_INCIDENTS_AGRICOLES,
  INITIAL_SITES_ELEVAGE,
  INITIAL_BATIMENTS,
  INITIAL_TROUPEAUX,
  INITIAL_ANIMAUX,
  INITIAL_REPRO_GESTATIONS,
  INITIAL_CARNETS_SANITAIRES,
  INITIAL_FEED_LOGS,
  INITIAL_PROD_ELEVAGES,
  INITIAL_MAGASINS,
  INITIAL_ARTICLES,
  INITIAL_MOUVEMENTS_STOCK,
  INITIAL_EQUIPEMENTS,
  INITIAL_MAINTENANCES,
  INITIAL_FUEL_LOGS,
  INITIAL_FOURNISSEURS,
  INITIAL_DEMANDES_ACHAT,
  INITIAL_BONS_COMMANDE,
  INITIAL_CLIENTS_ACHETEURS,
  INITIAL_DEVIS,
  INITIAL_COMMANDES_CLIENTS,
  INITIAL_FACTURES_CLIENTS,
  INITIAL_ENCAISSEMENTS,
  INITIAL_PIECES_COMPTABLES,
  INITIAL_BUDGETS,
  INITIAL_EMPLOYES,
  INITIAL_PRESENCES,
  INITIAL_BULLETINS,
  INITIAL_DOCUMENTS,
  INITIAL_ALERTE_REGLES,
  INITIAL_NOTIFICATIONS,
  INITIAL_SAAS_LOGS,
  INITIAL_CHAMPS,
  INITIAL_UTILISATEURS,
  INITIAL_COMPTEURS_UTILISATION,
  INITIAL_UTILISATIONS_EQUIPEMENT,
  INITIAL_PLANS_MAINTENANCE,
  INITIAL_PANNES_EQUIPEMENT,
  INITIAL_ASSURANCES_EQUIPEMENT,
  INITIAL_INDICATEURS_KPI,
  INITIAL_RAPPORTS_PROGRAMMES,
  INITIAL_ALERTES_BI
} from './mockData';

import {
  SaaSClient,
  Exploitation,
  SiteAgricole,
  Champ,
  Utilisateur,
  Parcelle,
  Campagne,
  Culture,
  Intervention,
  Recolte,
  IncidentAgricole,
  SiteElevage,
  Batiment,
  Troupeau,
  Animal,
  ReproductionGestation,
  CarnetSanitaire,
  FeedLog,
  ProductionElevage,
  Magasin,
  Article,
  MouvementStock,
  Equipement,
  MaintenanceOrder,
  FuelLog,
  Fournisseur,
  DemandeAchat,
  BonDeCommande,
  ClientAcheteur,
  DevisClient,
  CommandeClient,
  FactureClient,
  EncaissementClient,
  PieceComptable,
  Budget,
  Employe,
  PresencePointage,
  BulletinPaie,
  FichierDocument,
  AlerteRegle,
  NotificationAlerte,
  SaaSLog,
  AuditLog,
  PrevisionMeteo,
  Role,
  CustomLabels,
  SystemSettings,
  TenantDatabase,
  Pays,
  VilleAdmin,
  CompteurUtilisation,
  UtilisationEquipement,
  PlanDeMaintenance,
  PanneEquipement,
  AssuranceEquipement,
  IndicateurKPI,
  TableauDeBord,
  RapportProgramme,
  AlerteBI,
  RequetePersonnalisee
} from './types';

// Importing SaaS modules
import Dashboard from './components/Dashboard';
import AgricultureModule from './components/AgricultureModule';
import ElevageModule from './components/ElevageModule';
import StocksModule from './components/StocksModule';
import CommercialModule from './components/CommercialModule';
import AccountingModule from './components/AccountingModule';
import HRModule from './components/HRModule';
import GEDModule from './components/GEDModule';
import SaaSAdmin from './components/SaaSAdmin';
import SettingsModule from './components/SettingsModule';
import EquipementModule from './components/EquipementModule';
import BIModule from './components/BIModule';
import { MefoupLogo, MefoupRibbon } from './components/MefoupBrand';

import {
  Building2,
  Sprout,
  Egg,
  Package,
  ShoppingBag,
  Book,
  Users,
  FolderOpen,
  Sliders,
  Bell,
  CheckCircle,
  AlertOctagon,
  LogOut,
  Moon,
  Sun,
  ShieldAlert,
  Terminal,
  Activity,
  Award,
  Laptop,
  Lock,
  Unlock,
  Key,
  Database,
  ArrowRight,
  Settings,
  Wrench,
  LineChart,
  Eye,
  EyeOff,
  Download
} from 'lucide-react';

export default function App() {
  // Helper to determine active tenant ID on start before hook evaluations
  const getStartupActiveTenantId = (): string => {
    const saved = localStorage.getItem('activeTenant');
    if (saved) {
      try {
        return JSON.parse(saved).id;
      } catch (e) {}
    }
    return 'client-1';
  };

  // Authentication states
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  const [authRole, setAuthRole] = useState<'provider' | 'superadmin' | 'demo' | null>(() => {
    return (localStorage.getItem('authRole') as any) || null;
  });
  const [authError, setAuthError] = useState<string>('');
  const [suspendedClientMessage, setSuspendedClientMessage] = useState<string | null>(null);

  // Custom Reset Passcode State (Avoids window.prompt iframe sandbox limits)
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetPasswordInput, setResetPasswordInput] = useState('');
  const [resetStep, setResetStep] = useState<'password' | 'confirm'>('password');
  const [resetError, setResetError] = useState('');

  // SaaS Client Active List Visibility/Masking states
  const [showSaaSList, setShowSaaSList] = useState<boolean>(false);
  const [saaSListPasscode, setSaaSListPasscode] = useState<string>('');
  const [saaSListError, setSaaSListError] = useState<string>('');

  // Signon Input Fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // SaaS Clients Backoffice State
  const [saasClients, setSaasClients] = useState<SaaSClient[]>(() => {
    const saved = localStorage.getItem('saasClients');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_SAAS_CLIENTS;
  });
  const [activeTenant, setActiveTenant] = useState<SaaSClient>(() => {
    const saved = localStorage.getItem('activeTenant');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_SAAS_CLIENTS[0];
  });
  const [saasLogs, setSaasLogs] = useState<SaaSLog[]>(() => {
    const saved = localStorage.getItem('saasLogs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_SAAS_LOGS;
  });

  // SaaS Subscription Plans and limits
  const [saasPlanConfigs, setSaasPlanConfigs] = useState(() => {
    const saved = localStorage.getItem('saasPlanConfigs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      Starter: { id: 'Starter', name: 'STARTER', price: 35000, priceUnit: 'mois', maxUsers: 5, maxSurface: 20, modules: ['dashboard', 'agriculture', 'stocks', 'ged'] },
      Professional: { id: 'Professional', name: 'PROFESSIONAL', price: 95000, priceUnit: 'mois', maxUsers: 25, maxSurface: 100, modules: ['dashboard', 'agriculture', 'elevage', 'stocks', 'commercial', 'compta', 'ged', 'parc-materiel'] },
      Enterprise: { id: 'Enterprise', name: 'ENTERPRISE', price: 250000, priceUnit: 'mois', maxUsers: 100, maxSurface: 500, modules: ['dashboard', 'agriculture', 'elevage', 'stocks', 'commercial', 'compta', 'rh', 'ged', 'settings', 'parc-materiel', 'bi-reporting'] },
      Cooperative: { id: 'Cooperative', name: 'COOPÉRATIVE', price: 800000, priceUnit: 'an', maxUsers: 250, maxSurface: 2000, modules: ['dashboard', 'agriculture', 'elevage', 'stocks', 'commercial', 'compta', 'rh', 'ged', 'settings', 'parc-materiel', 'bi-reporting'] }
    };
  });

  React.useEffect(() => {
    localStorage.setItem('saasPlanConfigs', JSON.stringify(saasPlanConfigs));
  }, [saasPlanConfigs]);

  // -------------------------------------------------------------
  // isolated tenant-database & settings configuration architecture
  // -------------------------------------------------------------
  const DEFAULT_SYSTEM_SETTINGS: SystemSettings = {
    customLabels: {
      prodVegetale: 'Production Végétale',
      prodAnimale: 'Production Animale',
      cultures: 'Cultures',
      animaux: 'Animaux',
      parcelles: 'Parcelles',
      postes: 'Postes / Fonctions',
      produitsServices: 'Produits & Services',
      villes: 'Villes de déploiement',
      quartiersVillages: 'Quartiers / Villages / Secteurs'
    },
    roles: [
      {
        id: 'role-superadmin',
        name: 'Super Administrateur',
        modules: ['dashboard', 'agriculture', 'elevage', 'stocks', 'commercial', 'compta', 'rh', 'ged', 'settings', 'parc-materiel', 'bi-reporting'],
        canModify: true,
        canDelete: true,
        canImport: true,
        canExport: true
      },
      {
        id: 'role-veto',
        name: 'Médecin Vétérinaire / Éleveur',
        modules: ['dashboard', 'elevage', 'stocks', 'ged'],
        canModify: true,
        canDelete: false,
        canImport: false,
        canExport: true
      },
      {
        id: 'role-comptable',
        name: 'Comptable Agréé',
        modules: ['dashboard', 'commercial', 'compta', 'rh', 'ged'],
        canModify: true,
        canDelete: false,
        canImport: true,
        canExport: true
      },
      {
        id: 'role-ouvrier',
        name: 'Ouvrier Agricole',
        modules: ['dashboard', 'agriculture', 'stocks'],
        canModify: false,
        canDelete: false,
        canImport: false,
        canExport: false
      }
    ],
    activeRoleId: 'role-superadmin'
  };

  function getInitialDatabase(tenantId: string): TenantDatabase {
    if (tenantId === 'client-1' || tenantId === 'client-demo') {
      return {
        exploitations: INITIAL_EXPLOITATIONS,
        sitesAgricoles: INITIAL_SITES_AGRICOLES,
        champs: INITIAL_CHAMPS,
        parcelles: INITIAL_PARCELLES,
        utilisateurs: INITIAL_UTILISATEURS,
        campagnes: INITIAL_CAMPAGNES,
        cultures: INITIAL_CULTURES,
        interventions: INITIAL_INTERVENTIONS,
        recoltes: INITIAL_RECOLTES,
        incidents: INITIAL_INCIDENTS_AGRICOLES,
        sitesElevage: INITIAL_SITES_ELEVAGE,
        batiments: INITIAL_BATIMENTS,
        troupeaux: INITIAL_TROUPEAUX,
        animaux: INITIAL_ANIMAUX,
        reproGestations: INITIAL_REPRO_GESTATIONS,
        carnetsSanitaires: INITIAL_CARNETS_SANITAIRES,
        feedLogs: INITIAL_FEED_LOGS,
        prodElevages: INITIAL_PROD_ELEVAGES,
        magasins: INITIAL_MAGASINS,
        articles: INITIAL_ARTICLES,
        mouvementsStock: INITIAL_MOUVEMENTS_STOCK,
        equipements: INITIAL_EQUIPEMENTS,
        maintenances: INITIAL_MAINTENANCES,
        fuelLogs: INITIAL_FUEL_LOGS,
        fournisseurs: INITIAL_FOURNISSEURS,
        demandesAchat: INITIAL_DEMANDES_ACHAT,
        bonsCommande: INITIAL_BONS_COMMANDE,
        clientsAcheteurs: INITIAL_CLIENTS_ACHETEURS,
        devis: INITIAL_DEVIS,
        commandesClients: INITIAL_COMMANDES_CLIENTS,
        factures: INITIAL_FACTURES_CLIENTS,
        encaissements: INITIAL_ENCAISSEMENTS,
        piecesComptables: INITIAL_PIECES_COMPTABLES,
        budgets: INITIAL_BUDGETS,
        employes: INITIAL_EMPLOYES,
        presences: INITIAL_PRESENCES,
        bulletins: INITIAL_BULLETINS,
        documents: INITIAL_DOCUMENTS,
        regles: INITIAL_ALERTE_REGLES,
        notifications: INITIAL_NOTIFICATIONS,
        compteursUtilisation: INITIAL_COMPTEURS_UTILISATION,
        utilisationsEquipement: INITIAL_UTILISATIONS_EQUIPEMENT,
        plansMaintenance: INITIAL_PLANS_MAINTENANCE,
        pannesEquipement: INITIAL_PANNES_EQUIPEMENT,
        assurancesEquipement: INITIAL_ASSURANCES_EQUIPEMENT,
        indicateursKPI: INITIAL_INDICATEURS_KPI,
        tableauxDeBord: [],
        rapportsProgrammes: INITIAL_RAPPORTS_PROGRAMMES,
        alertesBI: INITIAL_ALERTES_BI,
        requetesPerso: [],
        auditLogs: [
          { id: 'aud-1', dateHeure: '2026-06-18 08:00', operateur: 'System Worker', role: 'Comptable', action: 'OHADA_BAL', description: 'Re-calcul global de la balance du grand livre (SYSCOHADA révisé)' },
          { id: 'aud-2', dateHeure: '2026-06-18 09:15', operateur: 'Dr. Amadou Diallo', role: 'Vétérinaire', action: 'VET_DIAG', description: 'Ajout diagnostic mastite sur Bovin COW-00921' },
          { id: 'aud-3', dateHeure: '2026-06-18 10:45', operateur: 'Tchanga Michel', role: 'Super Admin', action: 'STOCK_OUT', description: 'Sortie d’intrants de 30 sacs d’engrais NPK pour parcelle Nord-01' }
        ],
        systemSettings: DEFAULT_SYSTEM_SETTINGS
      };
    } else {
      return {
        exploitations: [],
        sitesAgricoles: [],
        champs: [],
        parcelles: [],
        utilisateurs: [],
        campagnes: [],
        cultures: [],
        interventions: [],
        recoltes: [],
        incidents: [],
        sitesElevage: [],
        batiments: [],
        troupeaux: [],
        animaux: [],
        reproGestations: [],
        carnetsSanitaires: [],
        feedLogs: [],
        prodElevages: [],
        magasins: [],
        articles: [],
        mouvementsStock: [],
        equipements: [],
        maintenances: [],
        fuelLogs: [],
        fournisseurs: [],
        demandesAchat: [],
        bonsCommande: [],
        clientsAcheteurs: [],
        devis: [],
        commandesClients: [],
        factures: [],
        encaissements: [],
        piecesComptables: [],
        budgets: [],
        employes: [],
        presences: [],
        bulletins: [],
        documents: [],
        regles: INITIAL_ALERTE_REGLES,
        notifications: [],
        auditLogs: [
          { id: 'aud-ini', dateHeure: new Date().toISOString().replace('T', ' ').substring(0, 16), operateur: 'Système', role: 'SuperAdmin', action: 'PROVISION_DB', description: 'Base de données isolée initialisée avec succès pour la nouvelle instance.' }
        ],
        systemSettings: DEFAULT_SYSTEM_SETTINGS
      };
    }
  }

  const [databases, setDatabases] = useState<Record<string, TenantDatabase>>(() => {
    const saved = localStorage.getItem('tenantDatabases');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Repair each tenant's roles to ensure Super Administrateur has all modules
        Object.keys(parsed).forEach(tenantId => {
          const db = parsed[tenantId];
          if (db && db.systemSettings && db.systemSettings.roles) {
            const adminRole = db.systemSettings.roles.find((r: any) => r.id === 'role-superadmin');
            if (adminRole) {
              const expectedModules = ['dashboard', 'agriculture', 'elevage', 'stocks', 'commercial', 'compta', 'rh', 'ged', 'settings', 'parc-materiel', 'bi-reporting'];
              expectedModules.forEach(mod => {
                if (!adminRole.modules.includes(mod)) {
                  adminRole.modules.push(mod);
                }
              });
            }
          }
        });
        return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return {
      'client-1': getInitialDatabase('client-1'),
      'client-demo': getInitialDatabase('client-demo'),
    };
  });

  const getInitialDb = (): TenantDatabase => {
    const initialActiveTenantId = getStartupActiveTenantId();
    const savedDbStr = localStorage.getItem('tenantDatabases');
    if (savedDbStr) {
      try {
        const parsed = JSON.parse(savedDbStr);
        if (parsed[initialActiveTenantId]) {
          const db = parsed[initialActiveTenantId];
          // Auto-repair role-superadmin and other roles if systemSettings are present but outdated
          if (db.systemSettings && db.systemSettings.roles) {
            const adminRole = db.systemSettings.roles.find((r: any) => r.id === 'role-superadmin');
            if (adminRole) {
              const expectedModules = ['dashboard', 'agriculture', 'elevage', 'stocks', 'commercial', 'compta', 'rh', 'ged', 'settings', 'parc-materiel', 'bi-reporting'];
              expectedModules.forEach(mod => {
                if (!adminRole.modules.includes(mod)) {
                  adminRole.modules.push(mod);
                }
              });
            }
          }
          return db;
        }
      } catch (e) {}
    }
    return getInitialDatabase(initialActiveTenantId);
  };

  const initialDb = getInitialDb();

  const [systemSettings, setSystemSettings] = useState<SystemSettings>(initialDb.systemSettings || DEFAULT_SYSTEM_SETTINGS);

  // General App Modes: "client-erp" vs "saas-admin"
  const [appMode, setAppMode] = useState<'client-erp' | 'saas-admin'>(() => {
    return (localStorage.getItem('appMode') as any) || 'client-erp';
  });

  // Currently active ERP internal tab
  const [erpTab, setErpTab] = useState<'dashboard' | 'agriculture' | 'elevage' | 'stocks' | 'commercial' | 'compta' | 'rh' | 'ged' | 'settings' | 'parc-materiel' | 'bi-reporting'>(() => {
    return (localStorage.getItem('erpTab') as any) || 'dashboard';
  });

  // Multi-tenant ERP states
  const [exploitations, setExploitations] = useState<Exploitation[]>(initialDb.exploitations);
  const [sitesAgricoles, setSitesAgricoles] = useState<SiteAgricole[]>(initialDb.sitesAgricoles);
  const [champs, setChamps] = useState<Champ[]>(initialDb.champs || []);
  const [parcelles, setParcelles] = useState<Parcelle[]>(initialDb.parcelles);
  const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>(initialDb.utilisateurs || []);
  const [campagnes, setCampagnes] = useState<Campagne[]>(initialDb.campagnes);
  const [cultures, setCultures] = useState<Culture[]>(initialDb.cultures);
  const [interventions, setInterventions] = useState<Intervention[]>(initialDb.interventions);
  const [recoltes, setRecoltes] = useState<Recolte[]>(initialDb.recoltes);
  const [incidents, setIncidents] = useState<IncidentAgricole[]>(initialDb.incidents);

  const [sitesElevage, setSitesElevage] = useState<SiteElevage[]>(initialDb.sitesElevage);
  const [batiments, setBatiments] = useState<Batiment[]>(initialDb.batiments);
  const [troupeaux, setTroupeaux] = useState<Troupeau[]>(initialDb.troupeaux);
  const [animaux, setAnimaux] = useState<Animal[]>(initialDb.animaux);
  const [reproGestations, setReproGestations] = useState<ReproductionGestation[]>(initialDb.reproGestations);
  const [carnetsSanitaires, setCarnetsSanitaires] = useState<CarnetSanitaire[]>(initialDb.carnetsSanitaires);
  const [feedLogs, setFeedLogs] = useState<FeedLog[]>(initialDb.feedLogs);
  const [prodElevages, setProdElevages] = useState<ProductionElevage[]>(initialDb.prodElevages);

  const [magasins, setMagasins] = useState<Magasin[]>(initialDb.magasins);
  const [articles, setArticles] = useState<Article[]>(initialDb.articles);
  const [mouvementsStock, setMouvementsStock] = useState<MouvementStock[]>(initialDb.mouvementsStock);
  const [equipements, setEquipements] = useState<Equipement[]>(initialDb.equipements);
  const [maintenances, setMaintenances] = useState<MaintenanceOrder[]>(initialDb.maintenances);
  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>(initialDb.fuelLogs);

  const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>(initialDb.fournisseurs);
  const [demandesAchat, setDemandesAchat] = useState<DemandeAchat[]>(initialDb.demandesAchat);
  const [bonsCommande, setBonsCommande] = useState<BonDeCommande[]>(initialDb.bonsCommande);
  const [clientsAcheteurs, setClientsAcheteurs] = useState<ClientAcheteur[]>(initialDb.clientsAcheteurs);
  const [devis, setDevis] = useState<DevisClient[]>(initialDb.devis);
  const [commandesClients, setCommandesClients] = useState<CommandeClient[]>(initialDb.commandesClients);
  const [factures, setFactures] = useState<FactureClient[]>(initialDb.factures);
  const [encaissements, setEncaissements] = useState<EncaissementClient[]>(initialDb.encaissements);

  const [piecesComptables, setPiecesComptables] = useState<PieceComptable[]>(initialDb.piecesComptables);
  const [budgets, setBudgets] = useState<Budget[]>(initialDb.budgets);

  // Custom Admin Agricultural Constants (Requested Features)
  const [typesCulture, setTypesCulture] = useState<string[]>(['Maïs Grain', 'Cacao', 'Tomate de Table', 'Haricots', 'Banane Plantain']);
  const [typesOperation, setTypesOperation] = useState<string[]>(['Labour', 'Semis', 'Fertilisation', 'Irrigation', 'Traitement phytosanitaire', 'Récolte']);
  const [responsablesTerrain, setResponsablesTerrain] = useState<{name: string, type: 'Employé' | 'Prestataire Externe', info: string}[]>([
    { name: 'Jean-Pierre Ondoa', type: 'Employé', info: 'Chef de Champ CDI' },
    { name: 'Dr. Amadou Diallo', type: 'Employé', info: 'Vétérinaire Senior' },
    { name: 'ETS Soproicam', type: 'Prestataire Externe', info: 'Charrue & Labour' },
    { name: 'Agro-Services Cam', type: 'Prestataire Externe', info: 'Pulvérisation & Entretien' }
  ]);
  const [substances, setSubstances] = useState<{name: string, type: string, description: string}[]>([
    { name: 'Engrais NPK 20-10-10', type: 'Fertilisant', description: 'Favorise la croissance' },
    { name: 'Urée 46%', type: 'Fertilisant', description: 'Apport en azote' },
    { name: 'Callidim Phytosanitaire', type: 'Fongicide', description: 'Contrôle des parasites' },
    { name: 'Compost Organique', type: 'Amendement', description: 'Restructuration de sol' }
  ]);

  // Geographic management: 1 Country has many Cities, 1 City belongs to one and only one Country
  const [paysList, setPaysList] = useState<Pays[]>([
    { id: 'pays-1', nom: 'Cameroun', codeISO: 'CMR', indicatifTelephonique: '+237' },
    { id: 'pays-2', nom: 'Côte d\'Ivoire', codeISO: 'CIV', indicatifTelephonique: '+225' },
    { id: 'pays-3', nom: 'Sénégal', codeISO: 'SEN', indicatifTelephonique: '+221' }
  ]);

  const [villesList, setVillesList] = useState<VilleAdmin[]>([
    { id: 'ville-1', nom: 'Yaoundé', paysId: 'pays-1', codeRegion: 'Centre' },
    { id: 'ville-2', nom: 'Douala', paysId: 'pays-1', codeRegion: 'Littoral' },
    { id: 'ville-3', nom: 'Obala', paysId: 'pays-1', codeRegion: 'Centre' },
    { id: 'ville-4', nom: 'Abidjan', paysId: 'pays-2', codeRegion: 'Lagunes' },
    { id: 'ville-5', nom: 'Bouaké', paysId: 'pays-2', codeRegion: 'Vallée du Bandama' },
    { id: 'ville-6', nom: 'Dakar', paysId: 'pays-3', codeRegion: 'Dakar' }
  ]);

  const [employes, setEmployes] = useState<Employe[]>(initialDb.employes);
  const [presences, setPresences] = useState<PresencePointage[]>(initialDb.presences);
  const [bulletins, setBulletins] = useState<BulletinPaie[]>(initialDb.bulletins);

  const [documents, setDocuments] = useState<FichierDocument[]>(initialDb.documents);
  const [regles, setRegles] = useState<AlerteRegle[]>(initialDb.regles);
  const [notifications, setNotifications] = useState<NotificationAlerte[]>(initialDb.notifications);

  // Integrated Internal Audit Trails with Operator identification
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialDb.auditLogs);

  // --- FLEET & MAINTENANCE GMAO COMPILER STATE VARIABLES ---
  const [compteursUtilisation, setCompteursUtilisation] = useState<CompteurUtilisation[]>(initialDb.compteursUtilisation || []);
  const [utilisationsEquipement, setUtilisationsEquipement] = useState<UtilisationEquipement[]>(initialDb.utilisationsEquipement || []);
  const [plansMaintenance, setPlansMaintenance] = useState<PlanDeMaintenance[]>(initialDb.plansMaintenance || []);
  const [pannesEquipement, setPannesEquipement] = useState<PanneEquipement[]>(initialDb.pannesEquipement || []);
  const [assurancesEquipement, setAssurancesEquipement] = useState<AssuranceEquipement[]>(initialDb.assurancesEquipement || []);

  // --- BI & DECISIONAL SYSTEMS STATE VARIABLES ---
  const [indicateursKPI, setIndicateursKPI] = useState<IndicateurKPI[]>(initialDb.indicateursKPI || []);
  const [tableauxDeBord, setTableauxDeBord] = useState<TableauDeBord[]>(initialDb.tableauxDeBord || []);
  const [rapportsProgrammes, setRapportsProgrammes] = useState<RapportProgramme[]>(initialDb.rapportsProgrammes || []);
  const [alertesBI, setAlertesBI] = useState<AlerteBI[]>(initialDb.alertesBI || []);
  const [requetesPerso, setRequetesPerso] = useState<RequetePersonnalisee[]>(initialDb.requetesPerso || []);

  const [currentUser, setCurrentUser] = useState<Utilisateur | null>(() => {
    const saved = localStorage.getItem('currentUser');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return null;
  });

  React.useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  // Live auto-repair for superadmin settings, ensuring newly loaded browser states automatically gain newly added modules
  React.useEffect(() => {
    const adminRole = systemSettings?.roles?.find(r => r.id === 'role-superadmin');
    if (adminRole) {
      const expectedModules = ['dashboard', 'agriculture', 'elevage', 'stocks', 'commercial', 'compta', 'rh', 'ged', 'settings', 'parc-materiel', 'bi-reporting'];
      const missing = expectedModules.filter(mod => !adminRole.modules.includes(mod));
      if (missing.length > 0) {
        setSystemSettings(prev => {
          const updatedRoles = prev.roles.map(r => {
            if (r.id === 'role-superadmin') {
              return {
                ...r,
                modules: Array.from(new Set([...r.modules, ...missing]))
              };
            }
            return r;
          });
          return {
            ...prev,
            roles: updatedRoles
          };
        });
      }
    }
  }, [systemSettings]);

  // Real-time weather parameters
  const [currentWeather, setCurrentWeather] = useState<PrevisionMeteo>({
    date: '2026-06-18',
    temperatureCelcius: 28,
    conditionsCiel: 'Orages isolés',
    risquesPluiePourcent: 65,
    humiditeRecense: 82,
    directionVent: 'Sud-Ouest 14 Km/h'
  });

  const [showNotificationCenter, setShowNotificationCenter] = useState(false);

  // UTILITY AUDIT LOGGER
  const logAudit = (action: string, description: string, overrideOperateur?: string, overrideRole?: string) => {
    const activeRoleObj = systemSettings.roles.find(r => r.id === systemSettings.activeRoleId) || systemSettings.roles[0];
    const defaultOperateur = authRole === 'demo' ? 'Visiteur Démo' : (activeTenant?.responsablePrenom ? `${activeTenant.responsablePrenom} ${activeTenant.responsableNom}` : 'Administrateur');
    const operateur = overrideOperateur || defaultOperateur;
    const role = overrideRole || activeRoleObj.name;

    const newLog: AuditLog = {
      id: 'aud-' + Math.floor(Math.random() * 10000),
      dateHeure: new Date().toISOString().replace('T', ' ').substring(0, 16),
      operateur,
      role,
      action,
      description
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Redirect erpTab if the active simulated role loses visibility of the currently open tab
  React.useEffect(() => {
    const activeRoleObj = systemSettings.roles.find(r => r.id === systemSettings.activeRoleId) || systemSettings.roles[0];
    if (activeRoleObj && !activeRoleObj.modules.includes(erpTab as string)) {
      const firstAllowed = activeRoleObj.modules[0] as any;
      if (firstAllowed) {
        setErpTab(firstAllowed);
      }
    }
  }, [systemSettings.activeRoleId]);

  // --- LOCAL PERSISTENCE BACKUP ENGINES ---
  React.useEffect(() => {
    localStorage.setItem('saasClients', JSON.stringify(saasClients));
  }, [saasClients]);

  React.useEffect(() => {
    localStorage.setItem('saasLogs', JSON.stringify(saasLogs));
  }, [saasLogs]);

  React.useEffect(() => {
    localStorage.setItem('isLoggedIn', String(isLoggedIn));
  }, [isLoggedIn]);

  React.useEffect(() => {
    if (authRole) {
      localStorage.setItem('authRole', authRole);
    } else {
      localStorage.removeItem('authRole');
    }
  }, [authRole]);

  React.useEffect(() => {
    localStorage.setItem('appMode', appMode);
  }, [appMode]);

  React.useEffect(() => {
    if (activeTenant) {
      localStorage.setItem('activeTenant', JSON.stringify(activeTenant));
    }
  }, [activeTenant]);

  React.useEffect(() => {
    localStorage.setItem('erpTab', erpTab);
  }, [erpTab]);

  React.useEffect(() => {
    // Sync active tenant states back into databases map dynamically, then persist databases to localStorage
    if (!activeTenant || !activeTenant.id) return;
    setDatabases(prev => {
      const updated = {
        ...prev,
        [activeTenant.id]: {
          exploitations,
          sitesAgricoles,
          champs,
          parcelles,
          utilisateurs,
          campagnes,
          cultures,
          interventions,
          recoltes,
          incidents,
          sitesElevage,
          batiments,
          troupeaux,
          animaux,
          reproGestations,
          carnetsSanitaires,
          feedLogs,
          prodElevages,
          magasins,
          articles,
          mouvementsStock,
          equipements,
          maintenances,
          fuelLogs,
          fournisseurs,
          demandesAchat,
          bonsCommande,
          clientsAcheteurs,
          devis,
          commandesClients,
          factures,
          encaissements,
          piecesComptables,
          budgets,
          employes,
          presences,
          bulletins,
          documents,
          regles,
          notifications,
          auditLogs,
          systemSettings,
          compteursUtilisation,
          utilisationsEquipement,
          plansMaintenance,
          pannesEquipement,
          assurancesEquipement,
          indicateursKPI,
          tableauxDeBord,
          rapportsProgrammes,
          alertesBI,
          requetesPerso
        }
      };
      localStorage.setItem('tenantDatabases', JSON.stringify(updated));
      return updated;
    });
  }, [
    activeTenant?.id,
    exploitations,
    sitesAgricoles,
    champs,
    parcelles,
    utilisateurs,
    campagnes,
    cultures,
    interventions,
    recoltes,
    incidents,
    sitesElevage,
    batiments,
    troupeaux,
    animaux,
    reproGestations,
    carnetsSanitaires,
    feedLogs,
    prodElevages,
    magasins,
    articles,
    mouvementsStock,
    equipements,
    maintenances,
    fuelLogs,
    fournisseurs,
    demandesAchat,
    bonsCommande,
    clientsAcheteurs,
    devis,
    commandesClients,
    factures,
    encaissements,
    piecesComptables,
    budgets,
    employes,
    presences,
    bulletins,
    documents,
    regles,
    notifications,
    auditLogs,
    systemSettings,
    compteursUtilisation,
    utilisationsEquipement,
    plansMaintenance,
    pannesEquipement,
    assurancesEquipement,
    indicateursKPI,
    tableauxDeBord,
    rapportsProgrammes,
    alertesBI,
    requetesPerso
  ]);

  // HANDLERS FOR NEW SEED DATA FROM INDIVIDUAL COMPONENTS //

  // SaaS administrator actions
  const handleProvisionTenant = (newClient: SaaSClient) => {
    // 1. Add client to saasClients list
    setSaasClients(prev => {
      const updated = [...prev, newClient];
      localStorage.setItem('saasClients', JSON.stringify(updated));
      return updated;
    });

    // 2. Initialize dynamic database
    const newDb = getInitialDatabase(newClient.id);
    
    // Seed with the primary super-admin user
    const defaultUser: Utilisateur = {
      id: 'usr-admin-virtuel',
      nom: `${newClient.responsablePrenom} ${newClient.responsableNom}`,
      email: newClient.superAdminLogin || newClient.responsableEmail || '',
      password: newClient.superAdminPassword || '',
      roleId: 'role-superadmin',
      statut: 'Actif',
      mustChangePassword: newClient.mustChangePassword
    };
    newDb.utilisateurs = [defaultUser];

    // Seed audit seed line to confirm encryption key initialisation
    newDb.auditLogs = [
      {
        id: 'aud-seed',
        dateHeure: new Date().toISOString().replace('T', ' ').substring(0, 16),
        operateur: 'Système',
        role: 'SuperAdmin',
        action: 'PROVISION_DB',
        description: 'Licence provisionnée. Super-administrateur créé et clé de chiffrement initialisée.'
      }
    ];

    // Manage role and modules configuration based on the configured plan
    const planConfig = saasPlanConfigs[newClient.plan] || { modules: ['dashboard', 'agriculture', 'stocks', 'ged'] };
    newDb.systemSettings = {
      ...newDb.systemSettings,
      activeRoleId: 'role-superadmin',
      roles: [
        {
          id: 'role-superadmin',
          name: 'Super Administrateur',
          modules: planConfig.modules,
          canModify: true,
          canDelete: true,
          canImport: true,
          canExport: true
        }
      ]
    };

    setDatabases(prev => {
      const updated = { ...prev, [newClient.id]: newDb };
      localStorage.setItem('tenantDatabases', JSON.stringify(updated));
      return updated;
    });

    const log: SaaSLog = {
      id: 'l-' + Math.floor(Math.random() * 10000),
      date: new Date().toISOString().replace('T', ' ').substring(0, 19),
      utilisateur: 'SaaS Admin',
      ip: '192.168.1.100',
      action: `Provisionnement de la licence client : ${newClient.raisonSociale}`,
      module: 'SaaS Engine',
      statut: 'Succès'
    };
    setSaasLogs(prev => [log, ...prev]);
  };

  const handleUpdateTenantStatus = (clientId: string, status: SaaSClient['statut']) => {
    setSaasClients(prev => prev.map(c => c.id === clientId ? { ...c, statut: status } : c));
    
    // If the currently active customer's status became suspended, keep activeTenant in sync to lock views
    if (activeTenant.id === clientId) {
      setActiveTenant(prev => ({ ...prev, statut: status }));
    }
  };

  const handleUpdateClient = (updatedClient: SaaSClient) => {
    setSaasClients(prev => {
      const updated = prev.map(c => c.id === updatedClient.id ? updatedClient : c);
      localStorage.setItem('saasClients', JSON.stringify(updated));
      return updated;
    });
    if (activeTenant?.id === updatedClient.id) {
      setActiveTenant(updatedClient);
      localStorage.setItem('activeTenant', JSON.stringify(updatedClient));
    }
    const log: SaaSLog = {
      id: 'l-' + Math.floor(Math.random() * 10000),
      date: new Date().toISOString().replace('T', ' ').substring(0, 19),
      utilisateur: 'SaaS Admin',
      ip: '192.168.1.100',
      action: `Mise à jour des informations client : ${updatedClient.raisonSociale}`,
      module: 'SaaS Engine',
      statut: 'Succès'
    };
    setSaasLogs(prev => [log, ...prev]);
  };

  const handleUpdateTenantDatabase = (tenantId: string, updatedDb: TenantDatabase) => {
    setDatabases(prev => {
      const updated = { ...prev, [tenantId]: updatedDb };
      localStorage.setItem('tenantDatabases', JSON.stringify(updated));
      return updated;
    });
    if (activeTenant?.id === tenantId) {
      if (updatedDb.utilisateurs) setUtilisateurs(updatedDb.utilisateurs);
    }
  };

  // Restores all payload entities from a selected json file
  const handleRestoreBackup = (backupObj: any) => {
    const payload = backupObj.payload || backupObj;
    
    if (payload.exploitations) setExploitations(payload.exploitations);
    if (payload.parcelles) setParcelles(payload.parcelles);
    if (payload.animaux) setAnimaux(payload.animaux);
    if (payload.employes) setEmployes(payload.employes);
    if (payload.factures) setFactures(payload.factures);
    if (payload.pieces) setPiecesComptables(payload.pieces);
    if (payload.articles) setArticles(payload.articles);

    logAudit('DB_RESTORE', `Restauration de la base de données client opérée par l’Éditeur SaaS.`);
  };

  // User management handlers
  const handleUpdateCurrentUser = (updated: Utilisateur) => {
    setCurrentUser(updated);
  };

  const handleAddUtilisateur = (user: Utilisateur) => {
    setUtilisateurs(prev => [...prev, user]);
  };

  const handleUpdateUtilisateur = (user: Utilisateur) => {
    setUtilisateurs(prev => prev.map(u => u.id === user.id ? user : u));
    if (currentUser && currentUser.id === user.id) {
      setCurrentUser(user);
    }
  };

  const handleDeleteUtilisateur = (id: string) => {
    setUtilisateurs(prev => prev.filter(u => u.id !== id));
  };

  // Agriculture actions
  const handleAddChamp = (newChamp: Champ) => {
    setChamps(prev => [...prev, newChamp]);
    logAudit('AGRI_CHAMP', `Nouveau champ enregistré : ${newChamp.nom} (${newChamp.ville})`);
  };

  const handleUpdateChamp = (updated: Champ) => {
    setChamps(prev => prev.map(c => c.id === updated.id ? updated : c));
    logAudit('AGRI_CHAMP', `Champ modifié : ${updated.nom} (${updated.ville})`);
  };

  const handleDeleteChamp = (id: string) => {
    const champ = champs.find(c => c.id === id);
    setChamps(prev => prev.filter(c => c.id !== id));
    logAudit('AGRI_CHAMP', `Champ supprimé : ${champ?.nom || id}`);
  };

  const handleAddParcelle = (newParc: Parcelle) => {
    setParcelles(prev => [...prev, newParc]);
    logAudit('AGRI_PARCELLE', `Nouvelle parcelle cadastrée : ${newParc.nom} (${newParc.surface} HA)`);
  };

  const handleUpdateParcelle = (updated: Parcelle) => {
    setParcelles(prev => prev.map(p => p.id === updated.id ? updated : p));
    logAudit('AGRI_PARCELLE_SURF', `Mise à jour / Décrémentation de la surface restante de la parcelle ${updated.nom} (${updated.surface} HA)`);
  };

  const handleAddTypeCulture = (tc: string) => {
    setTypesCulture(prev => [...prev, tc]);
    logAudit('ADMIN_AGRI', `Création d'un nouveau Type de Culture : ${tc}`);
  };

  const handleAddTypeOperation = (to: string) => {
    setTypesOperation(prev => [...prev, to]);
    logAudit('ADMIN_AGRI', `Création d'un nouveau Type d'Opération : ${to}`);
  };

  const handleAddResponsableTerrain = (resp: {name: string, type: 'Employé' | 'Prestataire Externe', info: string}) => {
    setResponsablesTerrain(prev => [...prev, resp]);
    logAudit('ADMIN_AGRI', `Création d'un nouveau Responsable Terrain : ${resp.name} (${resp.type})`);
  };

  const handleAddSubstance = (subs: {name: string, type: string, description: string}) => {
    setSubstances(prev => [...prev, subs]);
    logAudit('ADMIN_AGRI', `Création d'une nouvelle Substance Intrant : ${subs.name} (${subs.type})`);
  };

  const handleAddCampagneObj = (camp: Campagne) => {
    setCampagnes(prev => [...prev, camp]);
    logAudit('ADMIN_AGRI', `Ouverture d'une nouvelle Campagne Agricole : ${camp.nom} (${camp.annee})`);
  };

  const handleAddPays = (p: Pays) => {
    setPaysList(prev => [...prev, p]);
    logAudit('ADMIN_GEO', `Ajout d'un pays géographique : ${p.nom} (Code ISO: ${p.codeISO})`);
  };

  const handleAddVille = (v: VilleAdmin) => {
    setVillesList(prev => [...prev, v]);
    const targetPays = paysList.find(p => p.id === v.paysId);
    logAudit('ADMIN_GEO', `Ajout d'une ville géographique : ${v.nom} rattachée au pays : ${targetPays?.nom || v.paysId}`);
  };

  const handleAddCulture = (newCult: Culture) => {
    setCultures(prev => [...prev, newCult]);
    logAudit('AGRI_CULTURE', `Lancement d'une nouvelle culture de ${newCult.nom} sur la parcelle`);
  };

  const handleUpdateCulture = (updatedCult: Culture) => {
    setCultures(prev => prev.map(c => c.id === updatedCult.id ? updatedCult : c));
    logAudit('AGRI_CULTURE', `Mise à jour de la culture de ${updatedCult.nom} (Statut: ${updatedCult.statut})`);
  };

  const handleAddIncident = (newInc: IncidentAgricole) => {
    setIncidents(prev => [...prev, newInc]);
    logAudit('AGRI_INCIDENT', `Nouvel incident/aléa enregistré : ${newInc.type} (${newInc.perteEstimeeFCFA.toLocaleString()} FCFA)`);
  };

  const handleAddIntervention = (newInt: Intervention) => {
    setInterventions(prev => [...prev, newInt]);
    logAudit('AGRI_INT', `Nouvelle intervention culturale enregistrée (${newInt.type})`);
  };

  const handleAddRecolte = (newRec: Recolte) => {
    setRecoltes(prev => [...prev, newRec]);
    logAudit('AGRI_RECOLT', `Pesée générale de récolte enregistrée : ${newRec.quantite} ${newRec.unite}`);
  };

  // Livestock/elevage actions
  const handleAddAnimaux = (newAni: Animal) => {
    setAnimaux(prev => [...prev, newAni]);
    logAudit('VETO_ANI', `Inoculation / Naissance de bête codeUnique : ${newAni.codeUnique}`);
  };

  const handleAddSanitaire = (newCS: CarnetSanitaire) => {
    setCarnetsSanitaires(prev => [...prev, newCS]);
    logAudit('VETO_SAN', `Saisie d'une fiche d'intervention vétérinaire : ${newCS.diagnostic}`);
  };

  const handleAddFeed = (newFeed: FeedLog) => {
    setFeedLogs(prev => [...prev, newFeed]);
    logAudit('FEED_LOG', `Distribution alimentaire au troupeau : ${newFeed.aliment} (${newFeed.quantiteKg} Kg)`);
  };

  const handleAddProductionElevage = (newProd: ProductionElevage) => {
    setProdElevages(prev => [...prev, newProd]);
    logAudit('ELEV_PROD', `Collecte journalière de production enregistrée : ${newProd.quantite} ${newProd.unite} de ${newProd.type}`);
  };

  // Stocks / Warehousing actions
  const handleAddMouvementStock = (newMvt: MouvementStock) => {
    setMouvementsStock(prev => [...prev, newMvt]);
    logAudit('STK_MVT', `Mouvement de stock enregistré: ${newMvt.type} de ${newMvt.quantite} unités`);
  };

  const handleAddMaintenance = (newMaint: MaintenanceOrder) => {
    setMaintenances(prev => [...prev, newMaint]);
    logAudit('TRACK_MAINT', `Planification d'un ordre de maintenance mécanique : ${newMaint.description}`);
  };

  const handleAddFuelLog = (newFuel: FuelLog) => {
    setFuelLogs(prev => [...prev, newFuel]);
    logAudit('CARBURANT', `Consommation fuel enregistrée pour l'engin : ${newFuel.quantiteLitre} Litres`);
  };

  // Sales & Purchases
  const handleAddDemandeAchat = (newDA: DemandeAchat) => {
    setDemandesAchat(prev => [...prev, newDA]);
    logAudit('ACHAT_DA', `Émission d'une demande d'intrants d'achat : ${newDA.designationArticle} (${newDA.quantite} ${newDA.unite})`);
  };

  const handleAddBonCommande = (newBC: BonDeCommande) => {
    setBonsCommande(prev => [...prev, newBC]);
    logAudit('ACHAT_BC2', `Nouveau bon de commande fournisseur validé : ${newBC.code} (${newBC.total} FCFA)`);
  };

  const handleAddClientAcheteur = (newCli: ClientAcheteur) => {
    setClientsAcheteurs(prev => [...prev, newCli]);
    logAudit('CLI_ADD', `Inscription portefeuille client : ${newCli.raisonSociale}`);
  };

  const handleAddDevis = (newDev: DevisClient) => {
    setDevis(prev => [...prev, newDev]);
    logAudit('VEN_DEV', `Établissement devis de négociation client: ${newDev.code}`);
  };

  const handleAddCommandeClient = (newCC: CommandeClient) => {
    setCommandesClients(prev => [...prev, newCC]);
  };

  const handleConvertDevisToCommande = (devisId: string) => {
    const target = devis.find(d => d.id === devisId);
    if (!target) return;
    
    // Switch devis status
    setDevis(prev => prev.map(d => d.id === devisId ? { ...d, statut: 'Accepté' } : d));

    // Register active order
    const newCmd: CommandeClient = {
      id: 'cmd-' + Math.floor(Math.random() * 10000),
      idClient: target.idClient,
      code: 'CMD-CONV-' + Math.floor(100+Math.random()*900),
      date: new Date().toISOString().split('T')[0],
      produit: target.produit,
      quantite: target.quantite,
      prixUnitaire: target.prixUnitaire,
      total: target.total,
      statut: 'En préparation',
      commercialId: 'emp-5'
    };
    setCommandesClients(prev => [...prev, newCmd]);

    // Create Standard Invoice
    const newFac: FactureClient = {
      id: 'fac-' + Math.floor(Math.random() * 10000),
      idClient: target.idClient,
      type: 'Standard',
      code: 'FAC-AUTO-' + Math.floor(100+Math.random()*900),
      date: new Date().toISOString().split('T')[0],
      dateEcheance: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      produit: target.produit,
      quantite: target.quantite,
      total: target.total,
      statut: 'Non payée'
    };
    setFactures(prev => [...prev, newFac]);

    logAudit('DEV_CONVERT', `Conversion automatique Devis ${target.code} ➔ Commande & Facture d’un montant de ${target.total} FCFA`);
  };

  const handleAddFacture = (newFac: FactureClient) => {
    setFactures(prev => [...prev, newFac]);
  };

  const handleAddEncaissementClient = (newEnc: EncaissementClient) => {
    setEncaissements(prev => [...prev, newEnc]);

    // Mark corresponding invoice as partially or fully paid
    setFactures(prev => prev.map(f => f.id === newEnc.idFacture ? { ...f, statut: 'Payée' } : f));

    // Create compensating accounting double-entry in general ledger
    const targetFac = factures.find(f => f.id === newEnc.idFacture);
    if (targetFac) {
      const newPC: PieceComptable = {
        id: 'pc-' + Math.floor(Math.random() * 10000),
        date: newEnc.date,
        codeJournal: 'BQ',
        refePiece: `ENC-${targetFac.code}`,
        libelle: `Encaissement reçu pour ${targetFac.code}`,
        debitCompte: `5211 (Banque ${newEnc.modePaiement})`,
        creditCompte: '4111 (Clients nationaux)',
        montant: newEnc.montant,
        valide: true,
        centreCoutAnalytique: 'Trésorerie Centrale'
      };
      setPiecesComptables(prev => [...prev, newPC]);
    }

    logAudit('CASH_REC', `Saisie de règlement financier de ${newEnc.montant} FCFA réf: ${newEnc.reference}`);
  };

  // Accounting double entry
  const handleAddPieceComptable = (newPiece: PieceComptable) => {
    setPiecesComptables(prev => [...prev, newPiece]);
    logAudit('OHADA_GJNL', `Écriture comptable passée: Débit ${newPiece.debitCompte} / Crédit ${newPiece.creditCompte} [${newPiece.montant.toLocaleString()} FCFA]`);
  };

  const handleAddBudget = (newBud: Budget) => {
    setBudgets(prev => [...prev, newBud]);
    logAudit('BUD_NEW', `Saisie enveloppe prévisionnelle pour département : ${newBud.departement}`);
  };

  const handleUpdateBudgetEngaged = (budgetId: string, amount: number) => {
    setBudgets(prev => prev.map(b => b.id === budgetId ? { ...b, montantEngage: b.montantEngage + amount } : b));
  };

  // HR & Administration
  const handleAddEmploye = (newEmp: Employe) => {
    setEmployes(prev => [...prev, newEmp]);
    logAudit('HR_RECRUT', `Recrutement du collaborateur : ${newEmp.prenom} ${newEmp.nom} comme ${newEmp.poste}`);
  };

  const handleAddPresence = (newPres: PresencePointage) => {
    setPresences(prev => [...prev, newPres]);
  };

  const handleAddBulletin = (newBP: BulletinPaie) => {
    setBulletins(prev => [...prev, newBP]);

    // Register salary payout as accounting debit in analytical ledger
    const targetEmp = employes.find(e => e.id === newBP.idEmploye);
    if (targetEmp) {
      const newPC: PieceComptable = {
        id: 'pc-' + Math.floor(Math.random() * 10000),
        date: new Date().toISOString().split('T')[0],
        codeJournal: 'OD',
        refePiece: `SAL-06-26`,
        libelle: `Règlement salaire net de ${targetEmp.prenom} ${targetEmp.nom}`,
        debitCompte: '6611 (Charges de Personnel)',
        creditCompte: '5211 (Banques)',
        montant: newBP.netAPayer,
        valide: true,
        centreCoutAnalytique: `Frais RH ${targetEmp.department}`
      };
      setPiecesComptables(prev => [...prev, newPC]);
    }

    logAudit('PAIE_VAL', `Mise en paiement du bulletin de ${getEmployeeFullInfo(newBP.idEmploye)} (Net payé: ${newBP.netAPayer.toLocaleString()} FCFA)`);
  };

  // GED Archivage
  const handleAddDocumentObj = (newDoc: FichierDocument) => {
    setDocuments(prev => [...prev, newDoc]);
    logAudit('GED_UPLOAD', `Archivage immuable du fichier : ${newDoc.nom} (Indexed: ${newDoc.indexationTags.join(', ')})`);
  };

  const getEmployeeFullInfo = (empId: string) => {
    const e = employes.find(x => x.id === empId);
    return e ? `${e.prenom} ${e.nom}` : 'Inconnu';
  };

  const unreadNotifications = notifications.filter(n => n.statut === 'Non lue').length;
  const simulatedRole = systemSettings.roles.find(r => r.id === systemSettings.activeRoleId) || systemSettings.roles[0];

  // switchActiveTenant - isolates databases per tenant ID
  const switchActiveTenant = (newTenant: SaaSClient) => {
    // 1. Save current active tenant's states to the databases dictionary
    setDatabases(prev => ({
      ...prev,
      [activeTenant.id]: {
        exploitations,
        sitesAgricoles,
        champs,
        parcelles,
        utilisateurs,
        campagnes,
        cultures,
        interventions,
        recoltes,
        incidents,
        sitesElevage,
        batiments,
        troupeaux,
        animaux,
        reproGestations,
        carnetsSanitaires,
        feedLogs,
        prodElevages,
        magasins,
        articles,
        mouvementsStock,
        equipements,
        maintenances,
        fuelLogs,
        fournisseurs,
        demandesAchat,
        bonsCommande,
        clientsAcheteurs,
        devis,
        commandesClients,
        factures,
        encaissements,
        piecesComptables,
        budgets,
        employes,
        presences,
        bulletins,
        documents,
        regles,
        notifications,
        auditLogs,
        systemSettings
      }
    }));

    // 2. Load next tenant database partition or create a clean empty one
    const nextDb = databases[newTenant.id] || getInitialDatabase(newTenant.id);

    // 3. Load other states
    setExploitations(nextDb.exploitations);
    setSitesAgricoles(nextDb.sitesAgricoles);
    setChamps(nextDb.champs || []);
    setParcelles(nextDb.parcelles);
    setUtilisateurs(nextDb.utilisateurs || []);
    setCampagnes(nextDb.campagnes);
    setCultures(nextDb.cultures);
    setInterventions(nextDb.interventions);
    setRecoltes(nextDb.recoltes);
    setIncidents(nextDb.incidents);
    setSitesElevage(nextDb.sitesElevage);
    setBatiments(nextDb.batiments);
    setTroupeaux(nextDb.troupeaux);
    setAnimaux(nextDb.animaux);
    setReproGestations(nextDb.reproGestations);
    setCarnetsSanitaires(nextDb.carnetsSanitaires);
    setFeedLogs(nextDb.feedLogs);
    setProdElevages(nextDb.prodElevages);
    setMagasins(nextDb.magasins);
    setArticles(nextDb.articles);
    setMouvementsStock(nextDb.mouvementsStock);
    setEquipements(nextDb.equipements);
    setMaintenances(nextDb.maintenances);
    setFuelLogs(nextDb.fuelLogs);
    setFournisseurs(nextDb.fournisseurs);
    setDemandesAchat(nextDb.demandesAchat);
    setBonsCommande(nextDb.bonsCommande);
    setClientsAcheteurs(nextDb.clientsAcheteurs);
    setDevis(nextDb.devis);
    setCommandesClients(nextDb.commandesClients);
    setFactures(nextDb.factures);
    setEncaissements(nextDb.encaissements);
    setPiecesComptables(nextDb.piecesComptables);
    setBudgets(nextDb.budgets);
    setEmployes(nextDb.employes);
    setPresences(nextDb.presences);
    setBulletins(nextDb.bulletins);
    setDocuments(nextDb.documents);
    setRegles(nextDb.regles);
    setNotifications(nextDb.notifications);
    setAuditLogs(nextDb.auditLogs);
    setSystemSettings(nextDb.systemSettings);

    setCompteursUtilisation(nextDb.compteursUtilisation || []);
    setUtilisationsEquipement(nextDb.utilisationsEquipement || []);
    setPlansMaintenance(nextDb.plansMaintenance || []);
    setPannesEquipement(nextDb.pannesEquipement || []);
    setAssurancesEquipement(nextDb.assurancesEquipement || []);
    setIndicateursKPI(nextDb.indicateursKPI || []);
    setTableauxDeBord(nextDb.tableauxDeBord || []);
    setRapportsProgrammes(nextDb.rapportsProgrammes || []);
    setAlertesBI(nextDb.alertesBI || []);
    setRequetesPerso(nextDb.requetesPerso || []);

    // 4. Update the activeTenant state
    setActiveTenant(newTenant);
  };

  // Login handler
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setSuspendedClientMessage(null);

    const emailClean = loginEmail.trim().toLowerCase();
    const passClean = loginPassword.trim();

    // 1. Check for SaaS Editor/Supplier credentials
    if (emailClean === 'provider@mefoup.com' && passClean === 'mefoup2026') {
      setIsLoggedIn(true);
      setAuthRole('provider');
      setAppMode('saas-admin');
      setCurrentUser({
        id: 'usr-provider',
        nom: 'Éditeur Mefoup',
        email: 'provider@mefoup.com',
        password: 'mefoup2026',
        roleId: 'role-superadmin',
        statut: 'Actif'
      });
      return;
    }

    // 2. Check for specific tenant-level registered system users (Utilisateurs) across all database partitions
    let foundUser: Utilisateur | null = null;
    let foundTenant: SaaSClient | null = null;

    for (const client of saasClients) {
      const db = databases[client.id] || getInitialDatabase(client.id);
      const userList = db.utilisateurs || [];
      const userMatch = userList.find(
        u => u.email.toLowerCase() === emailClean && u.password === passClean && u.statut === 'Actif'
      );
      if (userMatch) {
        foundUser = userMatch;
        foundTenant = client;
        break;
      }
    }

    if (foundUser && foundTenant) {
      if (foundTenant.statut === 'Suspendu' || foundTenant.statut === 'Résilié') {
        setSuspendedClientMessage(`Votre restaurant a été désactivé. Veuillez contacter l'administrateur de la plateforme.`);
        return;
      }
      setIsLoggedIn(true);
      setAuthRole('superadmin');
      switchActiveTenant(foundTenant);
      
      // Force initial role mapping based on logged-in user profile!
      setSystemSettings(prev => ({
        ...prev,
        activeRoleId: foundUser!.roleId
      }));
      setAppMode('client-erp');
      setCurrentUser(foundUser);
      return;
    }

    // 3. Fallback check for active or virtual SaaS client super-administrators directly
    const matchedClient = saasClients.find(
      c => c.superAdminLogin?.toLowerCase() === emailClean && c.superAdminPassword === passClean
    );

    if (matchedClient) {
      if (matchedClient.statut === 'Suspendu' || matchedClient.statut === 'Résilié') {
        setSuspendedClientMessage(`Votre restaurant a été désactivé. Veuillez contacter l'administrateur de la plateforme.`);
        return;
      }
      setIsLoggedIn(true);
      setAuthRole('superadmin');
      switchActiveTenant(matchedClient);
      setAppMode('client-erp');
      
      const adminVirtuel: Utilisateur = {
        id: 'usr-admin-virtuel',
        nom: `${matchedClient.responsablePrenom} ${matchedClient.responsableNom}`,
        email: matchedClient.superAdminLogin || '',
        password: matchedClient.superAdminPassword || '',
        roleId: 'role-superadmin',
        statut: 'Actif',
        mustChangePassword: matchedClient.mustChangePassword
      };
      setCurrentUser(adminVirtuel);
      return;
    }

    setAuthError("Email ou mot de passe incorrect. Pour tester le logiciel, cliquez sur le bouton 'Version démonstration' à gauche.");
  };

  // Enters the evaluation/simulation trial mode with prefabricated structures
  const enterDemoMode = () => {
    setIsLoggedIn(true);
    setAuthRole('demo');
    // Prefabricate a dedicated Demo account
    const demoClient: SaaSClient = {
      id: 'client-demo',
      idLicence: 'LIC-2026-DEMO-EXEMPLE',
      raisonSociale: 'FERME PILOTE DE DÉMONSTRATION',
      sigle: 'EVAL-DEMO',
      numContribuable: 'DEMO-CONTRIB-01',
      regCommerce: 'RC/YAU/DEMO',
      secteur: 'Multi-activités (Maraîcher, Porcherie & Élevage avicole)',
      responsableNom: 'Visiteur',
      responsablePrenom: 'Évaluation',
      responsableEmail: 'demo@mefoup-flow.cm',
      responsableTel: '+237 000 000 000',
      pays: 'Cameroun',
      region: 'Centre',
      ville: 'Obala',
      statut: 'Démonstration',
      plan: 'Starter',
      dateCreation: new Date().toISOString().split('T')[0],
      dateExpiration: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      surfaceExploitee: 25,
      maxUtilisateurs: 5
    };
    switchActiveTenant(demoClient);
    setAppMode('client-erp');
    setCurrentUser({
      id: 'usr-1', // maps to first demo user 'Michel Tchanga'
      nom: 'Michel Tchanga',
      email: 'admin@mefoup.com',
      password: 'mefoup2026',
      roleId: 'role-superadmin',
      statut: 'Actif'
    });
  };

  const handleExportClientPageText = () => {
    let today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    let filename = `export-erp-${erpTab}-${new Date().toISOString().split('T')[0]}.txt`;
    let content = "";

    content += `================================================================================\n`;
    content += `  RAPPORT EXPLICATIF ET RECAPITULATIF METIER - PAGE : ${erpTab.toUpperCase()}\n`;
    content += `  ORGANISATION : ${activeTenant.raisonSociale.toUpperCase()} (${activeTenant.sigle})\n`;
    content += `================================================================================\n`;
    content += `Généré le : ${today}\n`;
    content += `Rôle utilisateur actif : ${simulatedRole?.name || 'Super Administrateur'}\n`;
    content += `Période active d'analyse : Année en cours 2026\n`;
    content += `Filtres de dates par défaut : Du 01 Janvier 2026 au 31 Décembre 2026\n`;
    content += `Statut d'intégration : SYNCHRONISÉ AVEC LE SERVEUR PORT: 3000\n\n`;

    if (erpTab === 'dashboard') {
      content += `--------------------------------------------------------------------------------\n`;
      content += `1. PRÉSENTATION DU COCKPIT GÉNÉRAL ET ALERTES D'EXPLOSION\n`;
      content += `--------------------------------------------------------------------------------\n`;
      content += `Le Cockpit Général constitue le tableau de bord d'aide à la décision pour les gestionnaires.\n`;
      content += `Il rassemble les flux d'informations météorologiques directes, le niveau d'alertes par ordre de\n`;
      content += `priorité, et des métriques synthétiques du foncier agricole et de la production animale.\n\n`;

      content += `--------------------------------------------------------------------------------\n`;
      content += `2. DIAGNOSTIC GLOBALE DE L'ACTIVITÉ (CHIFFRES CLÉS)\n`;
      content += `--------------------------------------------------------------------------------\n`;
      content += `- Nombre d'exploitations agricoles actives : ${exploitations.length}\n`;
      content += `- No. de sites d’implantation (champs) : ${champs.length}\n`;
      content += `- Nombre total de parcelles subdivisées : ${parcelles.length}\n`;
      content += `- Cheptel d'animaux sous surveillance : ${animaux.length}\n`;
      content += `- Nombre de collaborateurs enregistrés : ${employes.length}\n`;
      content += `- Règlements clients & facturations : ${factures.length} opérations enregistrées\n\n`;

      content += `--------------------------------------------------------------------------------\n`;
      content += `3. COMPTE-RENDU DES DERNIÈRES ALERTES CRITIQUES ENREGISTRÉES\n`;
      content += `--------------------------------------------------------------------------------\n`;
      if (notifications.length === 0) {
        content += `=> Aucune alerte prioritaire signalée dans le cockpit.\n`;
      } else {
        notifications.forEach((n) => {
          content += `[Alerte du ${n.date}] - Priorité : ${n.priorite}\n`;
          content += `  * Titre : ${n.titre}\n`;
          content += `  * Description : "${n.description}"\n`;
          content += `  ------------------------------------------------------------------------------\n`;
        });
      }
    } else if (erpTab === 'agriculture') {
      content += `--------------------------------------------------------------------------------\n`;
      content += `1. RAPPORT GLOBAL DU MODULE DE PRODUCTION VÉGÉTALE / AGRONOMIE\n`;
      content += `--------------------------------------------------------------------------------\n`;
      content += `Ce rapport détaille la gestion du foncier, l'état de développement des plantes cultivées\n`;
      content += `et le carnet des interventions d’entretien (fertilisation, irrigation, pulvérisation) réalisées.\n`;
      content += `Ces opérations sont fondamentales pour certifier la traçabilité des récoltes livrées aux abonnés.\n\n`;

      content += `--------------------------------------------------------------------------------\n`;
      content += `2. CADRE DE SUIVI DES EXPLOITATIONS ET PARCELLES SÉLECTIONNÉES\n`;
      content += `--------------------------------------------------------------------------------\n`;
      if (parcelles.length === 0) {
        content += `=> Aucune parcelle enregistrée dans l'unité.\n`;
      } else {
        parcelles.forEach((p) => {
          content += `PARCELLE REF: ${p.id} - Nom : ${p.nom}\n`;
          content += `  - Surface : ${p.superficie} Hectares | Type de Sol : ${p.typeSol}\n`;
          content += `  - Statut de Culture : ${p.cultureActive || 'En jachère'}\n`;
          content += `  - Date de début d'exploitation : ${p.dateCreation || 'N/A'}\n`;
          content += `  ------------------------------------------------------------------------------\n`;
        });
      }

      content += `\n--------------------------------------------------------------------------------\n`;
      content += `3. SYNTHÈSE DES INTERVENTIONS PHYTOSANITAIRES ET ENTRETIEN EN COURS\n`;
      content += `--------------------------------------------------------------------------------\n`;
      if (interventions.length === 0) {
        content += `=> Aucun ordre d'intervention enregistré.\n`;
      } else {
        interventions.forEach((it) => {
          content += `[Date: ${it.date}] Intervention : ${it.type} (Parcelle : ${it.parcelleId})\n`;
          content += `  - Responsable affecté : ${it.responsable}\n`;
          content += `  - Substance utilisée : ${it.produitUtilise || 'Aucune'}\n`;
          content += `  - Statut : ${it.statut}\n`;
          content += `  - Description : ${it.notes}\n`;
          content += `  ------------------------------------------------------------------------------\n`;
        });
      }

      content += `\n--------------------------------------------------------------------------------\n`;
      content += `4. JOURNAL HISTORIQUE DES RÉCOLTES\n`;
      content += `--------------------------------------------------------------------------------\n`;
      if (recoltes.length === 0) {
        content += `=> Aucune récolte déclarée pour la saison active.\n`;
      } else {
        recoltes.forEach((r) => {
          content += `Récolte Référence: ${r.id} (Date: ${r.dateRecolte})\n`;
          content += `  - Culture : ${r.cultureId}\n`;
          content += `  - Quantité récoltée : ${r.quantiteRecoltee} ${r.unite || 'Kg'}\n`;
          content += `  - Qualité estimée   : ${r.qualite}\n`;
          content += `  - Destination dépôt : ${r.magasinStockageId || 'Non spécifié'}\n`;
          content += `  ------------------------------------------------------------------------------\n`;
        });
      }
    } else if (erpTab === 'elevage') {
      content += `--------------------------------------------------------------------------------\n`;
      content += `1. EXPLICATION DE L'ACTIVITÉ ET DU SUIVI ZOOTECHNIQUE\n`;
      content += `--------------------------------------------------------------------------------\n`;
      content += `Le volet de Production Animale automatise le carnet de santé, les cycles d'alimentation,\n`;
      content += `la généalogie des troupeaux d’élevage et la mesure des rendements laitiers ou carnés.\n`;
      content += `L'un des objectifs majeurs est la prévention des infections et le suivi vétérinaire rigoureux.\n\n`;

      content += `--------------------------------------------------------------------------------\n`;
      content += `2. METRIQUES DES TROUPEAUX ET DETAILS INDIVIDUELS\n`;
      content += `--------------------------------------------------------------------------------\n`;
      content += `- Nombre de troupeaux distincts : ${troupeaux.length}\n`;
      content += `- Nombre de têtes d'animaux sous inventaire : ${animaux.length}\n\n`;

      if (animaux.length === 0) {
        content += `=> Aucun animal enregistré.\n`;
      } else {
        animaux.forEach((a) => {
          content += `ID UNIQUE ANIMAL: ${a.codeIdentification} (Nom: ${a.nom})\n`;
          content += `  - Espèce / Race : ${a.espece} - ${a.race || 'Non spécifié'}\n`;
          content += `  - Genre / Sexe  : ${a.sexe}\n`;
          content += `  - Date Naissance: ${a.dateNaissance}\n`;
          content += `  - Statut Sanitaire : ${a.statutSante}\n`;
          content += `  ------------------------------------------------------------------------------\n`;
        });
      }

      content += `\n--------------------------------------------------------------------------------\n`;
      content += `3. CARNET SANITAIRE ET ACTIONS PHYTOSANITAIRES RÉCENTES\n`;
      content += `--------------------------------------------------------------------------------\n`;
      if (carnetsSanitaires.length === 0) {
        content += `=> Aucun traitement vétérinaire répertorié.\n`;
      } else {
        carnetsSanitaires.forEach((cs) => {
          content += `[Date: ${cs.dateVisite}] Diagnostic pour l'animal : ${cs.animalId}\n`;
          content += `  - Traitement administré : ${cs.traitementPrescrit}\n`;
          content += `  - Vétérinaire en charge  : ${cs.veterinaireNom || 'N/A'}\n`;
          content += `  - Résultat de l'analyse : ${cs.observations}\n`;
          content += `  ------------------------------------------------------------------------------\n`;
        });
      }
    } else if (erpTab === 'stocks') {
      content += `--------------------------------------------------------------------------------\n`;
      content += `1. COMPTABILITÉ-MATIÈRES ET LOGISTIQUE DE STOCKAGE\n`;
      content += `--------------------------------------------------------------------------------\n`;
      content += `Le Module Stocks administre l'approvisionnement en semences, engrais, nourritures bétail et\n`;
      content += `l'affectation des produits finis issus des récoltes.\n`;
      content += `Il émet des alertes de rupture basées sur des seuils de sécurité configurables par magasin.\n\n`;

      content += `--------------------------------------------------------------------------------\n`;
      content += `2. REPERTOIRE DES ENTREPÔTS ET MAGASINS\n`;
      content += `--------------------------------------------------------------------------------\n`;
      if (magasins.length === 0) {
        content += `=> Aucun magasin enregistré dans l'entité.\n`;
      } else {
        magasins.forEach((m) => {
          content += `- [${m.code}] ${m.nom} - Localisation : ${m.emplacement} (Capacité : ${m.capaciteMax} m³)\n`;
        });
      }

      content += `\n--------------------------------------------------------------------------------\n`;
      content += `3. INVENTAIRE SUR LES ARTICLES COMPTABLES EN DISPONIBILITÉ\n`;
      content += `--------------------------------------------------------------------------------\n`;
      if (articles.length === 0) {
        content += `=> Pas d’article référencé.\n`;
      } else {
        articles.forEach((art) => {
          content += `ARTICLE REF: ${art.codeSku} - ${art.nom}\n`;
          content += `  - Catégorie : ${art.categorie} | Type : ${art.nature}\n`;
          content += `  - Stock Réel Physique : ${art.quantiteStock} ${art.uniteMesure}\n`;
          content += `  - Seuil d'Alerte : ${art.seuilAlerte} ${art.uniteMesure}\n`;
          content += `  - Valeur Unitaire : ${art.prixUnitaireMoyen.toLocaleString()} FCFA\n`;
          content += `  - Statut : ${art.quantiteStock <= art.seuilAlerte ? '🚨 RUPTURE IMMINENTE' : '✓ OK'}\n`;
          content += `  ------------------------------------------------------------------------------\n`;
        });
      }
    } else if (erpTab === 'parc-materiel') {
      content += `--------------------------------------------------------------------------------\n`;
      content += `1. DESCRIPTION GÉNÉRALE DU PARC ET LOGISTIQUES GMAO\n`;
      content += `--------------------------------------------------------------------------------\n`;
      content += `Ce rapport concerne la gestion assistée par ordinateur de nos matériels (tracteurs, semoirs, broyeurs).\n`;
      content += `Il enregistre les heures d'utilisation réelles des engins, gère les plans de maintenance\n`;
      content += `préventive pour éviter les pannes en pleine saison de labour, et orchestre le suivi des assurances.\n\n`;

      content += `--------------------------------------------------------------------------------\n`;
      content += `2. LISTE DU MATÉRIEL MÉCANIQUE SOUS GESTION\n`;
      content += `--------------------------------------------------------------------------------\n`;
      if (equipements.length === 0) {
        content += `=> Aucun engin lourd enregistré.\n`;
      } else {
        equipements.forEach((eq) => {
          content += `MACHINE REF: ${eq.id} - ${eq.nom} (${eq.marque})\n`;
          content += `  - Immatriculation / Série : ${eq.immatriculation || 'N/A'}\n`;
          content += `  - Compteur Horaire : ${eq.compteurHeures} Heures\n`;
          content += `  - Statut Operationnel : ${eq.statut}\n`;
          content += `  ------------------------------------------------------------------------------\n`;
        });
      }

      content += `\n--------------------------------------------------------------------------------\n`;
      content += `3. ENREGISTREMENTS DES PANNES ET ACTIONS PREVENTIVES\n`;
      content += `--------------------------------------------------------------------------------\n`;
      if (pannesEquipement.length === 0) {
        content += `=> Zéro panne mécanique ou anomalie signalée.\n`;
      } else {
        pannesEquipement.forEach((p) => {
          content += `Panne No: ${p.id} (Date: ${p.dateSignalement}) - Gravité : ${p.gravite}\n`;
          content += `  - Équipement impacté : ${p.equipementId}\n`;
          content += `  - Libellé problème : ${p.description}\n`;
          content += `  - Solution apportée : ${p.solutionAction || 'En attente d\'intervention'}\n`;
          content += `  - Statut de la panne : ${p.statut}\n`;
          content += `  ------------------------------------------------------------------------------\n`;
        });
      }
    } else if (erpTab === 'commercial') {
      content += `--------------------------------------------------------------------------------\n`;
      content += `1. RAPPORT METIER - MODULE TRANSACTIONS COMMERCIALES & CRM\n`;
      content += `--------------------------------------------------------------------------------\n`;
      content += `Ce dossier couvre l'ensemble de la chaine de valeur contractuelle : de l'émission\n`;
      content += `des quotes-parts d'achats auprès de nos fournisseurs agréés, jusqu'au suivi de facturation\n`;
      content += `commerciale de nos cultures agricoles vendues aux grossistes de la sous-région CEMAC.\n\n`;

      content += `--------------------------------------------------------------------------------\n`;
      content += `2. SOMMAIRE DU REGISTRE DES CLIENTS ACHETEURS\n`;
      content += `--------------------------------------------------------------------------------\n`;
      if (clientsAcheteurs.length === 0) {
        content += `=> Aucun acheteur dans le CRM.\n`;
      } else {
        clientsAcheteurs.forEach((cl) => {
          content += `- CRM Ref [${cl.id}] : ${cl.nomEntreprise} | Responsable : ${cl.contactNom} (Tel : ${cl.telephone})\n`;
        });
      }

      content += `\n--------------------------------------------------------------------------------\n`;
      content += `3. CAHIER DES FACTURES ET COMMANDES ENCOURS\n`;
      content += `--------------------------------------------------------------------------------\n`;
      if (factures.length === 0) {
        content += `=> Aucune transaction commerciale finalisée.\n`;
      } else {
        factures.forEach((fc) => {
          content += `Facture No: ${fc.codeFacture} (Date: ${fc.dateEmission})\n`;
          content += `  - Destinataire Client : ${fc.clientNom || 'N/A'}\n`;
          content += `  - Montant brut HT    : ${fc.montantHT.toLocaleString()} FCFA\n`;
          content += `  - Règlements perçus  : ${fc.montantPaye.toLocaleString()} FCFA\n`;
          content += `  - Statut d'échéance : ${fc.statutPaiement}\n`;
          content += `  ------------------------------------------------------------------------------\n`;
        });
      }
    } else if (erpTab === 'compta') {
      content += `--------------------------------------------------------------------------------\n`;
      content += `1. RAPPORT DE GESTION COMPTABLE ET CONFORMITÉ DE L'EXERCICE\n`;
      content += `--------------------------------------------------------------------------------\n`;
      content += `L'outil comptable automatise la saisie et le lettrage des pièces justificatives,\n`;
      content += `génère la balance générale et le Grand Livre conformément aux critères OHADA d'Afrique Centrale.\n`;
      content += `Il surveille de près l'exécution du budget alloué par zone d'exploitation.\n\n`;

      content += `--------------------------------------------------------------------------------\n`;
      content += `2. ECRITURES SAISIES DANS LE LIVRE DE COMPTABILITÉ\n`;
      content += `--------------------------------------------------------------------------------\n`;
      if (piecesComptables.length === 0) {
        content += `=> Aucune écriture comptable journalisée.\n`;
      } else {
        piecesComptables.forEach((pc) => {
          content += `PIÈCE REF: ${pc.numeroPiece} (Date: ${pc.dateComptable}) - Journal : [${pc.journalType}]\n`;
          content += `  - Libellé opération : ${pc.libelle}\n`;
          content += `  - Colonne Débit : ${pc.debit.toLocaleString()} FCFA\n`;
          content += `  - Colonne Crédit : ${pc.credit.toLocaleString()} FCFA\n`;
          content += `  - Compte Général de Charge: ${pc.compteGeneral}\n`;
          content += `  ------------------------------------------------------------------------------\n`;
        });
      }

      content += `\n--------------------------------------------------------------------------------\n`;
      content += `3. BUDGET D'EXPLOITATION AGRICOLE COMPILÉ\n`;
      content += `--------------------------------------------------------------------------------\n`;
      if (budgets.length === 0) {
        content += `=> Pas de feuille de budget disponible.\n`;
      } else {
        budgets.forEach((b) => {
          content += `BUDGET : ${b.nom} (Catégorie: ${b.categorie})\n`;
          content += `  - Enveloppe allouée : ${b.montantAlloue.toLocaleString()} FCFA\n`;
          content += `  - Crédits consommés : ${b.montantDepense.toLocaleString()} FCFA\n`;
          content += `  - Marge de sécurité disponible : ${(b.montantAlloue - b.montantDepense).toLocaleString()} FCFA\n`;
          content += `  ------------------------------------------------------------------------------\n`;
        });
      }
    } else if (erpTab === 'rh') {
      content += `--------------------------------------------------------------------------------\n`;
      content += `1. EXPLICATION THÉORIQUE DU CAPITAL HUMAIN ET DE LA PAIE\n`;
      content += `--------------------------------------------------------------------------------\n`;
      content += `La ressource humaine de l'instance centralise l'engagement contractuel du personnel permanent\n`;
      content += `et temporaire (ouvriers journaliers). Le terminal de présence pointe de manière géolocalisée\n`;
      content += `les heures de travail réelles afin d'évaluer les bulletins de paie mensuels en conformité\n`;
      content += `avec la réglementation s'appliquant au code du travail local.\n\n`;

      content += `--------------------------------------------------------------------------------\n`;
      content += `2. ACCES AU REGISTRE DU PERSONNEL EN SERVICE\n`;
      content += `--------------------------------------------------------------------------------\n`;
      if (employes.length === 0) {
        content += `=> Aucun employé listé pour cette instance d'exploitation.\n`;
      } else {
        employes.forEach((emp) => {
          content += `MATRICULE: ${emp.matricule} - Nom Complet : ${emp.nom} ${emp.prenom}\n`;
          content += `  - Fonction / Poste : ${emp.poste}\n`;
          content += `  - Rémunération de base : ${emp.salaireBase.toLocaleString()} FCFA / mois\n`;
          content += `  - Contrat d'embauche : ${emp.typeContrat} | Date début : ${emp.dateEmbauche}\n`;
          content += `  ------------------------------------------------------------------------------\n`;
        });
      }

      content += `\n--------------------------------------------------------------------------------\n`;
      content += `3. DERNIER ÉTAT DE PRÉSENCE JOURNALIÈRE\n`;
      content += `--------------------------------------------------------------------------------\n`;
      if (presences.length === 0) {
        content += `=> Aucun pointage de présence n'a été validé aujourd'hui.\n`;
      } else {
        presences.forEach((pr) => {
          content += `[Date: ${pr.date}] Collaborateur : ${pr.employeId}\n`;
          content += `  - Statut : ${pr.statut} (Arrivée: ${pr.heureArrivee || 'n/a'} - Départ: ${pr.heureDepart || 'n/a'})\n`;
          content += `  - Activités affectées au champ : ${pr.conceptActivite || 'Non spécifiée'}\n`;
          content += `  ------------------------------------------------------------------------------\n`;
        });
      }
    } else if (erpTab === 'ged') {
      content += `--------------------------------------------------------------------------------\n`;
      content += `1. LOGISTIQUES DU COFFRE-FORT NUMÉRIQUE ET LIENS UTILES\n`;
      content += `--------------------------------------------------------------------------------\n`;
      content += `La plateforme de GED (Gestion Électronique des Documents) stocke les relevés cadastraux,\n`;
      content += `les contrats d'achats scannés, les ordonnances du médecin vétérinaire et les factures douanières.\n`;
      content += `Il garantit un hébergement chiffré et sécurisé des données stratégiques des coopératives agricoles.\n\n`;

      content += `--------------------------------------------------------------------------------\n`;
      content += `2. INDEX HISTORIQUE DES ARCHIVES DOCUMENTAIRES ENREGISTRÉES\n`;
      content += `--------------------------------------------------------------------------------\n`;
      if (documents.length === 0) {
        content += `=> Le coffre-fort numérique ne contient pour l'instant aucun document.\n`;
      } else {
        documents.forEach((doc) => {
          content += `FICHIER REF: ${doc.id} - ${doc.nomFichier}\n`;
          content += `  - Type d'archive : ${doc.typeMime} | Taille : ${(doc.tailleKo).toFixed(1)} Ko\n`;
          content += `  - Date d'archivage : ${doc.dateStockage} par ${doc.auteur}\n`;
          content += `  - Catégorie d'organisation : ${doc.categorieUsage}\n`;
          content += `  ------------------------------------------------------------------------------\n`;
        });
      }
    } else if (erpTab === 'bi-reporting') {
      content += `--------------------------------------------------------------------------------\n`;
      content += `1. PRESENTATION DU SYSTEME DE BUSINESS INTELLIGENCE ET REPORTING\n`;
      content += `--------------------------------------------------------------------------------\n`;
      content += `Ce rapport décisionnel évalue les indicateurs clés de performance (KPI) stratégiques\n`;
      content += `sur les couts de revient, rendement des récoltes par hectare et taux de réussite vétérinaire.\n`;
      content += `Il permet de piloter la vision agrotechnologique de l'entente d'exploitation.\n\n`;

      content += `--------------------------------------------------------------------------------\n`;
      content += `2. TABLEAU COMPARATIF DES INDICATEURS KPI ANALYSÉS\n`;
      content += `--------------------------------------------------------------------------------\n`;
      if (indicateursKPI.length === 0) {
        content += `=> Pas d'indicateur KPI modélisé.\n`;
      } else {
        indicateursKPI.forEach((kpi) => {
          content += `KPI : ${kpi.nomCode} (${kpi.moduleCible.toUpperCase()})\n`;
          content += `  - Libellé complet : ${kpi.libelleExplicatif}\n`;
          content += `  - Valeur réelle calculée : ${kpi.valeurReelle} ${kpi.uniteMesure || ''}\n`;
          content += `  - Cible fixée : ${kpi.valeurCible} ${kpi.uniteMesure || ''}\n`;
          content += `  - Ecart enregistré : ${kpi.ecartConstate >= 0 ? '+' : ''}${kpi.ecartConstate}%\n`;
          content += `  - Degré d'atteinte : ${kpi.statutAlarme}\n`;
          content += `  ------------------------------------------------------------------------------\n`;
        });
      }
    } else if (erpTab === 'settings') {
      content += `--------------------------------------------------------------------------------\n`;
      content += `1. DESCRIPTION DES CONFIGURATIONS SYSTEME\n`;
      content += `--------------------------------------------------------------------------------\n`;
      content += `Cette section regroupe les paramètres fondamentaux de personnalisation de l'instance.\n`;
      content += `Elle régit les profils de rôles utilisateurs et l'appellation spécifique des types d'intrants.\n\n`;

      content += `--------------------------------------------------------------------------------\n`;
      content += `2. CHRONOLOGIE DES ROLES APPLICATIFS ACTIFS\n`;
      content += `--------------------------------------------------------------------------------\n`;
      systemSettings.roles.forEach((rol) => {
        content += `RÔLE PROFILE : ${rol.name}\n`;
        content += `  - Modules d'accès autorisés : ${rol.modules.join(', ')}\n`;
        content += `  - Droits de permissions : Modifier = ${rol.canModify ? 'OUI':'NON'} | Supprimer = ${rol.canDelete ? 'OUI':'NON'} | Exporter = ${rol.canExport ? 'OUI':'NON'}\n`;
        content += `  ------------------------------------------------------------------------------\n`;
      });
    }

    // Download text handler
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setAuthRole(null);
    setCurrentUser(null);
    setLoginPassword('');
    setAuthError('');
    setSuspendedClientMessage(null);
    setSystemSettings(prev => ({
      ...prev,
      activeRoleId: 'role-superadmin'
    }));
  };

  // If not logged in, render the gorgeous interactive Landing/Auth portal
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#2B2D30] flex flex-col justify-between font-sans selection:bg-[#8CC63F] selection:text-[#0F3D2E]">
        {/* Header decoration */}
        <header className="p-6 flex items-center justify-between border-b border-slate-800 bg-[#0F3D2E]/40 backdrop-blur-md">
          <MefoupLogo variant="light" size="md" />
          <span className="text-[10px] font-mono text-[#8CC63F]/70 bg-[#0F3D2E] px-2.5 py-1 rounded-md border border-[#1E7A44]/30">
            v2.1 • SYSCOHADA RÉVISÉ
          </span>
        </header>

        {/* Brand Slogan Ribbon at the top */}
        <div className="max-w-5xl mx-auto px-6 mt-4 w-full">
          <MefoupRibbon />
        </div>

        {/* Portal Cards Content */}
        <main className="max-w-5xl mx-auto p-6 md:p-12 w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* LEFT COLUMN: VISITEUR & DEMONSTRATION ACCUEIL */}
          <div className="bg-[#0F3D2E]/30 rounded-2xl border-2 border-[#1E7A44]/30 p-6 md:p-8 flex flex-col justify-between relative overflow-hidden backdrop-blur-xs">
            <div className="absolute inset-0 bg-radial-at-t from-[#8CC63F]/5 to-transparent pointer-events-none" />
            <div className="space-y-4 relative z-10">
              <span className="text-[9px] bg-[#8CC63F]/15 text-[#8CC63F] border border-[#8CC63F]/35 px-3 py-1 rounded-md font-extrabold uppercase tracking-widest">
                PORTAIL ACCUEIL DÉMO
              </span>
              <h2 className="text-2xl font-black text-white leading-tight">
                Découvrez comment se comporte l'ERP <span className="text-[#8CC63F]">MEFOUP-FLOW</span>
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                Accédez instantanément à la version de démonstration pré-configurée. Visualisez l'état des cultures locales, la gestion des stocks d'intrants (fertilisants, vaccins), le suivi du troupeau bovin et la comptabilité analytique aux normes SYSCOHADA.
              </p>

              <div className="bg-[#0F3D2E] border border-[#1E7A44]/45 rounded-xl p-4 space-y-1 relative overflow-hidden">
                <p className="text-[10px] text-[#8CC63F] font-bold uppercase tracking-wider font-mono">Vision & Slogan</p>
                <p className="text-sm italic font-extrabold text-white leading-snug">
                  « Ensemble, cultivons l'avenir de l'Afrique ! »
                </p>
              </div>

              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-[#8CC63F] shrink-0" />
                  <span>Données d'exemples de fermes pré-chargées.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-[#8CC63F] shrink-0" />
                  <span>Explorez librement tous les modules de finance & RH.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-[#8CC63F] shrink-0" />
                  <span>Zéro configuration ou carte bancaire requise.</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 border-t border-slate-700/60 mt-4 relative z-10">
              <button
                onClick={enterDemoMode}
                className="w-full bg-[#1E7A44] hover:bg-[#8CC63F] text-white hover:text-[#0F3D2E] font-extrabold text-xs py-3.5 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-sm scale-100 hover:scale-[1.01] active:scale-[0.98] cursor-pointer"
              >
                Lancer la Version de Démonstration (Gratuit)
                <ArrowRight className="h-4 w-4 text-white" />
              </button>
              <span className="text-[10px] text-slate-400 block text-center mt-2">
                Idéal avant souscription de contrat
              </span>
            </div>

            {/* Direct list of registered SaaS client directories for quick audit and validation */}
            <div className="mt-4 pt-4 border-t border-slate-700/60 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-300 block text-[10.5px] uppercase tracking-wider">
                  🏢 Comptes Clients SaaS Actifs
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (showSaaSList) {
                      setShowSaaSList(false);
                      setSaaSListPasscode('');
                      setSaaSListError('');
                    } else {
                      setSaaSListError('');
                    }
                  }}
                  className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  {showSaaSList ? (
                    <>
                      <EyeOff className="h-3.5 w-3.5" /> Masquer
                    </>
                  ) : (
                    <>
                      <Eye className="h-3.5 w-3.5" /> Déverrouiller
                    </>
                  )}
                </button>
              </div>

              {!showSaaSList ? (
                <div className="bg-slate-900/40 border border-slate-800 p-3 rounded-xl space-y-2">
                  <p className="text-[10.5px] text-slate-400 leading-relaxed font-medium">
                    🔒 Ce volet de diagnostic est masqué par sécurité. Saisissez le code d'administration pour tester.
                  </p>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setSaaSListError('');
                      const checkPass = saaSListPasscode.trim().toLowerCase();
                      if (checkPass === 'vito' || checkPass === 'veto') {
                        setShowSaaSList(true);
                        setSaaSListError('');
                      } else {
                        setSaaSListError('❌ Code d\'accès incorrect.');
                      }
                    }}
                    className="flex gap-2"
                  >
                    <input
                      type="password"
                      placeholder="Mot de passe d'accès..."
                      value={saaSListPasscode}
                      onChange={(e) => setSaaSListPasscode(e.target.value)}
                      className="flex-1 text-[11px] bg-slate-800 text-slate-200 placeholder-slate-500 rounded-lg border border-slate-700 p-1.5 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                    />
                    <button
                      type="submit"
                      className="px-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] rounded-lg transition cursor-pointer shrink-0"
                    >
                      Valider
                    </button>
                  </form>
                  {saaSListError && (
                    <p className="text-[10px] text-rose-400 font-semibold">{saaSListError}</p>
                  )}
                </div>
              ) : (
                <div className="max-h-48 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                  {saasClients.map(c => (
                    <div key={c.id} className="p-2.5 bg-slate-905 bg-slate-900/60 border border-slate-700/50 rounded-lg flex items-center justify-between gap-1.5 hover:border-indigo-500/50 transition">
                      <div className="truncate flex-1">
                        <span className="font-bold text-slate-100 block text-[11px] truncate">{c.raisonSociale}</span>
                        <span className="text-[10px] text-slate-400 block truncate font-mono">Em: {c.superAdminLogin}</span>
                        <span className="text-[9.5px] text-slate-500 block font-mono">Mdp: {c.superAdminPassword}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setLoginEmail(c.superAdminLogin || '');
                          setLoginPassword(c.superAdminPassword || '');
                          setIsLoggedIn(true);
                          setAuthRole('superadmin');
                          switchActiveTenant(c);
                          setAppMode('client-erp');
                        }}
                        className="px-2.5 py-1.5 bg-[#1E7A44] hover:bg-[#8CC63F] hover:text-[#0F3D2E] text-white font-black text-[10px] rounded-md transition shrink-0 uppercase tracking-tight"
                      >
                        1-Clic
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: PRIVÉ & CONNECT AUTH */}
          <div className="bg-white rounded-2xl p-6 md:p-8 flex flex-col justify-between border-2 border-[#1E7A44]/10 shadow-xl">
            <div>
              <span className="text-[9px] bg-[#0F3D2E]/10 text-[#0F3D2E] px-3 py-1 rounded-md font-bold uppercase tracking-wide">
                ESPACE SÉCURISÉ CLIENT & ÉDITEUR
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-3 leading-tight">
                Connexion Super-Administrateur / Éditeur
              </h2>
              <p className="text-xs text-slate-500 mt-1.5">
                Saisissez vos identifiants fournis pour accéder à votre environnement ou à la console d’administration.
              </p>

              {/* Status and Error handling */}
              {authError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-lg text-xs mt-4 leading-relaxed font-medium">
                  {authError}
                </div>
              )}

              {suspendedClientMessage && (
                <div className="bg-rose-900/10 border-2 border-rose-600/40 text-rose-950 p-4 rounded-xl text-xs mt-4 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-rose-800">
                    <ShieldAlert className="h-4 w-4 text-rose-700" />
                    <span>SOUSCRIPTION NON ACTIVE</span>
                  </div>
                  <p>{suspendedClientMessage}</p>
                </div>
              )}

              {/* Description box of MEFOUP-FLOW ERP key features replacing credentials box */}
              <div className="mt-4 p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-3 text-slate-600">
                <span className="font-extrabold text-slate-700 block text-[10px] uppercase tracking-widest text-[#1E7A44]">
                  🚀 FONCTIONNALITÉS CLÉS DU SIG-ERP MEFOUP-FLOW :
                </span>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div className="p-2 bg-white rounded-lg border border-slate-100/80">
                    <span className="font-bold text-slate-800 block">📊 Comptabilité SYSCOHADA</span>
                    <p className="text-[9px] text-slate-500 mt-0.5 leading-relaxed">Journaux, états financiers OHADA et balance analytique automatisée.</p>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-100/80">
                    <span className="font-bold text-slate-800 block">🌱 Gestion Agricole</span>
                    <p className="text-[9px] text-zinc-550 text-slate-500 mt-0.5 leading-relaxed">Suivi des campagnes, consommables et rendements parcellaires.</p>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-100/80">
                    <span className="font-bold text-slate-800 block">🐄 Élevage & Santé</span>
                    <p className="text-[9px] text-slate-500 mt-0.5 leading-relaxed">Fiches d'identité des bêtes, traçabilité et programmation de vaccins.</p>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-100/80">
                    <span className="font-bold text-slate-800 block">📁 Archivage GED</span>
                    <p className="text-[9px] text-slate-500 mt-0.5 leading-relaxed">Numérisation et centralisation sécurisée des pièces justificatives.</p>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                  <span className="text-[9px] text-slate-400 font-sans">Réinitialiser le système</span>
                  <button 
                    type="button" 
                    onClick={() => {
                      setResetPasswordInput('');
                      setResetStep('password');
                      setResetError('');
                      setShowResetModal(true);
                    }} 
                    className="text-[9.5px] text-[#1E7A44] hover:underline font-extrabold transition cursor-pointer"
                  >
                    Réinitialiser
                  </button>
                </div>
              </div>

              {/* Form elements */}
              <form onSubmit={handleLoginSubmit} className="space-y-3.5 mt-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Adresse Email / Login *</label>
                  <input
                    type="text"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="nom@entreprise.com ou admin@coop.cm"
                    className="w-full text-xs rounded-xl border border-slate-300 p-3 focus:outline-hidden focus:ring-1 focus:ring-[#1E7A44]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mot de Passe Sécurisé *</label>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Saisir le mot de passe SuperAdministrateur"
                    className="w-full text-xs rounded-xl border border-slate-300 p-3 focus:outline-hidden focus:ring-1 focus:ring-[#1E7A44]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#0F3D2E] text-white font-extrabold text-xs py-3.5 rounded-xl hover:bg-[#1E7A44] transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Lock className="h-4 w-4" /> Accéder à mon Espace Privé
                </button>
              </form>
            </div>

            <div className="border-t border-slate-100 pt-4 mt-6 text-center">
              <span className="text-[10px] text-slate-400">
                MEFOUP-FLOW utilise un système de chiffrement multicouche de bout en bout conforme OHADA et RGPD.
              </span>
            </div>
          </div>
        </main>

        {/* Footer info brand */}
        <footer className="p-4 border-t border-slate-800 text-center font-mono text-[10px] text-zinc-500">
          © 2026 MEFOUP-FLOW SaaS Agricole • Conçu pour l'Afrique Agro-Industrielle d'aujourd'hui.
        </footer>

        {/* Custom Reset Modal (safe for sandboxed iframes) */}
        {showResetModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4">
            <div className="bg-slate-900 border border-slate-700/80 max-w-md w-full rounded-2xl p-6 shadow-2xl relative space-y-4">
              <button
                type="button"
                onClick={() => {
                  setShowResetModal(false);
                  setResetPasswordInput('');
                  setResetError('');
                  setResetStep('password');
                }}
                className="absolute top-4 right-4 text-slate-400 hover:text-white text-xs font-bold bg-slate-850 px-2 py-1 rounded-md cursor-pointer transition"
              >
                Fermer ✕
              </button>
              
              <div className="text-center space-y-2 mt-2">
                <div className="mx-auto h-12 w-12 bg-rose-500/15 rounded-xl flex items-center justify-center border border-rose-500/30 text-rose-400">
                  <ShieldAlert className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-black text-white">Réinitialisation d'Usine</h3>
                <p className="text-xs text-slate-400">
                  Le système requiert le code d'autorisation pour restaurer les paramètres par défaut.
                </p>
              </div>

              {resetStep === 'password' ? (
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    setResetError('');
                    const checkPass = resetPasswordInput.trim().toLowerCase();
                    if (checkPass === 'vito' || checkPass === 'veto') {
                      setResetStep('confirm');
                    } else {
                      setResetError('❌ Mot de passe administrateur incorrect.');
                    }
                  }} 
                  className="space-y-3.5"
                >
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Mot de passe de sécurité</label>
                    <input
                      type="password"
                      required
                      value={resetPasswordInput}
                      onChange={(e) => setResetPasswordInput(e.target.value)}
                      placeholder="Saisissez 'vito' pour tester..."
                      className="w-full text-xs bg-slate-800 text-slate-100 placeholder-slate-500 rounded-xl border border-slate-705 border-slate-700 p-3 focus:outline-hidden focus:ring-1 focus:ring-rose-500"
                    />
                    {resetError && (
                      <p className="text-xs text-rose-400 font-semibold mt-1.5">{resetError}</p>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-rose-600 font-extrabold text-xs py-3 rounded-xl hover:bg-rose-500 text-white transition shadow-sm cursor-pointer"
                  >
                    Valider le code
                  </button>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="bg-rose-950/30 border border-rose-500/20 p-3.5 rounded-xl text-[11.5px] text-rose-300 leading-relaxed font-medium">
                    ⚠️ <strong>Attention !</strong> Cette action est définitive et irréversible. Toutes les données locales (vos exploitations, clients facturés, budgets saisis, utilisateurs et pièces justificatives GED) seront effacées de votre navigateur.
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowResetModal(false);
                        setResetPasswordInput('');
                        setResetStep('password');
                      }}
                      className="flex-1 border border-slate-700 hover:bg-slate-800 text-slate-300 font-bold text-xs py-2.5 rounded-xl transition cursor-pointer"
                    >
                      Annuler
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        localStorage.clear();
                        window.location.reload();
                      }}
                      className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs py-2.5 rounded-xl transition cursor-pointer"
                    >
                      EFFACER TOUT
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Force Change Password on First Login
  if (isLoggedIn && currentUser?.mustChangePassword) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 md:p-12 font-sans text-white">
        <div className="max-w-md w-full bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl p-6 md:p-8 space-y-6">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 bg-indigo-600/20 rounded-xl flex items-center justify-center mb-4 border border-indigo-500/30 text-indigo-400">
              <Lock className="h-6 w-6" />
            </div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400">Première connexion requise</span>
            <h2 className="text-xl font-black mt-1 text-slate-100">Changement de mot de passe obligatoire</h2>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Pour des raisons de sécurité, veuillez modifier le mot de passe provisoire défini par l'administrateur afin d'activer votre espace.
            </p>
          </div>

          <form onSubmit={(e) => {
            e.preventDefault();
            const newPass = (e.currentTarget.elements.namedItem('newPass') as HTMLInputElement).value.trim();
            const confirmPass = (e.currentTarget.elements.namedItem('confirmPass') as HTMLInputElement).value.trim();
            
            if (newPass.length < 5) {
              alert('Le mot de passe doit contenir au moins 5 caractères.');
              return;
            }
            if (newPass !== confirmPass) {
              alert('Les mots de passe ne correspondent pas.');
              return;
            }

            // Update user in tenant database
            const tenantId = activeTenant.id;
            const tenantDb = databases[tenantId] || getInitialDatabase(tenantId);
            const userList = tenantDb.utilisateurs || [];
            
            // Check if is direct superadmin
            if (activeTenant.superAdminLogin?.toLowerCase() === currentUser.email.toLowerCase()) {
              const updatedClient = {
                ...activeTenant,
                superAdminPassword: newPass,
                mustChangePassword: false
              };
              handleUpdateClient(updatedClient);
            }

            // Also search and update in the specific tenant user lists
            const updatedUsers = userList.map(u => {
              if (u.id === currentUser.id || u.email.toLowerCase() === currentUser.email.toLowerCase()) {
                return { ...u, password: newPass, mustChangePassword: false };
              }
              return u;
            });

            handleUpdateTenantDatabase(tenantId, {
              ...tenantDb,
              utilisateurs: updatedUsers
            });

            // Update local user session state
            setCurrentUser(prev => prev ? { ...prev, password: newPass, mustChangePassword: false } : null);

            logAudit('PASSWORD_RENEWAL', 'Changement obligatoire du mot de passe réussi lors de la première connexion', currentUser.nom, 'Utilisateur');
            alert('✅ Mot de passe modifié avec succès! Vous êtes maintenant connecté.');
          }} className="space-y-4 text-slate-300">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Nouveau Mot de Passe</label>
              <input
                name="newPass"
                type="password"
                required
                placeholder="Nouveau mot de passe"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs outline-hidden text-white focus:border-indigo-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Confirmez le Mot de Passe</label>
              <input
                name="confirmPass"
                type="password"
                required
                placeholder="Confirmez le mot de passe"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs outline-hidden text-white focus:border-indigo-500 transition"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 shadow-md cursor-pointer mt-2"
            >
              <CheckCircle className="h-4 w-4" />
              Activer mon compte & Entrer dans l'ERP
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full bg-slate-700 hover:bg-slate-650 text-slate-300 font-bold text-xs py-2 px-4 rounded-xl transition mt-2 cursor-pointer"
            >
              Retour à l'accueil
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      
      {/* PUBLIC DEMO ATTESTATION OR SPECIAL ADVISORY BANNERS */}
      {authRole === 'demo' && (
        <div className="bg-[#F5A623] text-[#2B2D30] text-center py-2 px-6 text-xs font-black font-sans flex items-center justify-center gap-2 shrink-0 shadow-inner">
          <Award className="h-4 w-4 animate-bounce text-[#0F3D2E]" />
          <span>
            🔴 MODE DÉMONSTRATION ÉVALUATION : Vous testez l'ERP Agricole avec une simulation de base modèle. Slogan : « Ensemble, cultivons l'avenir de l'Afrique ! »
          </span>
        </div>
      )}

      {/* GLOBAL SAAS TOP NAVIGATION BAR */}
      <header className="bg-[#0F3D2E] text-white px-6 py-2.5 shrink-0 flex items-center justify-between border-b border-[#1E7A44]/40 shadow-xl">
        <MefoupLogo variant="light" size="sm" />

        {/* Global Multi-Tenant switcher */}
        <div className="flex items-center gap-2">
          {appMode === 'client-erp' ? (
            <div className="flex items-center gap-1.5 bg-[#2B2D30] border border-[#1E7A44]/30 px-3 py-1.5 rounded-lg text-xs">
              <span className="text-slate-400">Entreprise / Instance active : </span>
              <span className="font-extrabold text-[#8CC63F]">{activeTenant.raisonSociale}</span>
              <span className="text-[10px] bg-[#1E7A44] text-white font-extrabold px-1.5 py-0.5 rounded ml-1.5 uppercase tracking-wide border border-[#8CC63F]/20">
                {activeTenant.plan} Plan
              </span>
            </div>
          ) : (
            <div className="bg-rose-900/30 border border-rose-500/30 text-rose-300 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5">
              <Laptop className="h-4 w-4" /> Tour de Contrôle Backoffice SaaS
            </div>
          )}

          {appMode === 'client-erp' && (
            <button
              id="btn-export-client-page"
              onClick={handleExportClientPageText}
              className="bg-[#1E7A44] hover:bg-[#8CC63F] text-white hover:text-[#0F3D2E] font-extrabold text-xs py-2 px-3.5 rounded-lg border border-[#0F3D2E] transition flex items-center gap-2 cursor-pointer shadow-md"
              title="Exporter le contenu explicatif de la page active en format texte"
            >
              <Download className="h-4 w-4 text-emerald-100" />
              Exporter Page (.txt)
            </button>
          )}

          {/* Switch app mode button - STRICTLY EXCLUSIVE TO PROVIDER ROLE FOR ISOLATION */}
          {authRole === 'provider' && (
            <button
              onClick={() => {
                const targetMode = appMode === 'client-erp' ? 'saas-admin' : 'client-erp';
                setAppMode(targetMode);
                if (targetMode === 'saas-admin') {
                  logAudit('SAAS_SWITCH', 'Administrateur technique retourné au Backoffice SaaS Éditeur', 'SaaS Support', 'Éditeur');
                }
              }}
              className={`cursor-pointer text-xs font-black px-4 py-2 rounded-lg border transition ${
                appMode === 'client-erp'
                  ? 'bg-indigo-600 border-indigo-700 hover:bg-indigo-700 text-white'
                  : 'bg-emerald-600 border-emerald-700 hover:bg-emerald-700 text-white'
              }`}
            >
              {appMode === 'client-erp' ? '⚙️ Entrer Backoffice SaaS' : '⚡ Entrer Console Client ERP'}
            </button>
          )}

          {/* LOGOUT SECURE ACTION */}
          <button
            onClick={handleLogout}
            className="bg-slate-800 hover:bg-slate-700 border border-slate-700 py-2 px-3.5 rounded-lg text-xs font-bold text-slate-300 hover:text-white transition flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Quitter
          </button>

          {/* Notification icon */}
          <div className="relative">
            <button
              onClick={() => setShowNotificationCenter(!showNotificationCenter)}
              className="bg-slate-800 hover:bg-slate-700 p-2 rounded-full text-slate-300 hover:text-white transition relative"
            >
              <Bell className="h-5 w-5" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                  {unreadNotifications}
                </span>
              )}
            </button>

            {/* Simulated Notification center tray */}
            {showNotificationCenter && (
              <div className="absolute right-0 mt-2 z-50 bg-white border rounded-2xl shadow-2xl w-80 text-xs text-slate-700 overflow-hidden">
                <div className="bg-slate-900 text-white p-3 font-semibold flex justify-between items-center">
                  <span>Centre des alertes prioritaires</span>
                  <button onClick={() => setNotifications([])} className="text-[10px] text-slate-300 underline font-normal">marquer tout lu</button>
                </div>
                <div className="divide-y max-h-64 overflow-y-auto">
                  {notifications.map(n => (
                    <div key={n.id} className="p-3 bg-red-50/40 hover:bg-slate-50 transition space-y-1.5">
                      <div className="flex justify-between font-bold items-center text-[10px]">
                        <span className="text-red-700">{n.priorite}</span>
                        <span className="text-slate-400">{n.date}</span>
                      </div>
                      <h4 className="font-bold text-slate-900">{n.titre}</h4>
                      <p className="text-[11px] text-slate-500 italic">"{n.description}"</p>
                    </div>
                  ))}
                  {notifications.length === 0 && (
                    <div className="p-6 text-center text-slate-400 italic">Aucune alerte en attente de traitement.</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* THREE PANELS COLLABORATION LAYOUT */}
      <div className="grow flex overflow-hidden">
        {/* SIDE BAR BUTTONS FOR ERP - Renders only in Client ERP Workspace mode */}
        {appMode === 'client-erp' && (
          <aside className="w-56 bg-[#2B2D30] text-slate-300 shrink-0 flex flex-col justify-between border-r border-[#1E7A44]/20 p-3 space-y-2">
            <div className="space-y-1">
              {simulatedRole.modules.includes('dashboard') && (
                <>
                  <span className="block text-[10px] text-[#8CC63F] font-black px-3 py-1 uppercase tracking-widest">
                    Cockpit Général
                  </span>
                  <button
                    onClick={() => setErpTab('dashboard')}
                    className={`w-full text-left p-2 rounded-lg transition text-xs font-bold flex items-center gap-2.5 ${
                      erpTab === 'dashboard' ? 'bg-[#1E7A44] text-white shadow-xs border-l-4 border-[#8CC63F]' : 'hover:bg-[#0F3D2E] hover:text-white'
                    }`}
                  >
                    <Award className="h-4 w-4 text-[#8CC63F]" /> Cockpit Éxecutif / Météo
                  </button>
                </>
              )}

              {simulatedRole.modules.includes('bi-reporting') && (
                <button
                  onClick={() => setErpTab('bi-reporting')}
                  className={`w-full text-left p-2 rounded-lg transition text-xs font-bold flex items-center gap-2.5 ${
                    erpTab === 'bi-reporting' ? 'bg-[#1E7A44] text-white shadow-xs border-l-4 border-[#8CC63F]' : 'hover:bg-[#0F3D2E] hover:text-white'
                  }`}
                >
                  <LineChart className="h-4 w-4 text-[#8CC63F]" /> BI & Rapports
                </button>
              )}

              {(simulatedRole.modules.includes('agriculture') || simulatedRole.modules.includes('elevage') || simulatedRole.modules.includes('stocks') || simulatedRole.modules.includes('parc-materiel')) && (
                <span className="block text-[10px] text-[#8CC63F] font-black px-3 py-1 uppercase tracking-widest pt-3">
                  Opérations Foncier
                </span>
              )}

              {simulatedRole.modules.includes('agriculture') && (
                <button
                  onClick={() => setErpTab('agriculture')}
                  className={`w-full text-left p-2 rounded-lg transition text-xs font-bold flex items-center gap-2.5 ${
                    erpTab === 'agriculture' ? 'bg-[#1E7A44] text-white shadow-sm border-l-4 border-[#8CC63F]' : 'hover:bg-[#0F3D2E] hover:text-white'
                  }`}
                >
                  <Sprout className="h-4 w-4 text-[#8CC63F]" /> {systemSettings.customLabels.prodVegetale || 'Production Végétale'}
                </button>
              )}

              {simulatedRole.modules.includes('elevage') && (
                <button
                  onClick={() => setErpTab('elevage')}
                  className={`w-full text-left p-2 rounded-lg transition text-xs font-bold flex items-center gap-2.5 ${
                    erpTab === 'elevage' ? 'bg-[#1E7A44] text-white shadow-sm border-l-4 border-[#8CC63F]' : 'hover:bg-[#0F3D2E] hover:text-white'
                  }`}
                >
                  <Egg className="h-4 w-4 text-[#8CC63F]" /> {systemSettings.customLabels.prodAnimale || 'Production Animale'}
                </button>
              )}

              {simulatedRole.modules.includes('stocks') && (
                <button
                  onClick={() => setErpTab('stocks')}
                  className={`w-full text-left p-2 rounded-lg transition text-xs font-bold flex items-center gap-2.5 ${
                    erpTab === 'stocks' ? 'bg-[#1E7A44] text-white shadow-sm border-l-4 border-[#8CC63F]' : 'hover:bg-[#0F3D2E] hover:text-white'
                  }`}
                >
                  <Package className="h-4 w-4 text-[#8CC63F]" /> Stocks & Magasins
                </button>
              )}

              {simulatedRole.modules.includes('parc-materiel') && (
                <button
                  onClick={() => setErpTab('parc-materiel')}
                  className={`w-full text-left p-2 rounded-lg transition text-xs font-bold flex items-center gap-2.5 ${
                    erpTab === 'parc-materiel' ? 'bg-[#1E7A44] text-white shadow-sm border-l-4 border-[#8CC63F]' : 'hover:bg-[#0F3D2E] hover:text-white'
                  }`}
                >
                  <Wrench className="h-4 w-4 text-[#8CC63F]" /> Parc & Maintenance
                </button>
              )}

              {(simulatedRole.modules.includes('commercial') || simulatedRole.modules.includes('compta')) && (
                <span className="block text-[10px] text-[#8CC63F] font-black px-3 py-1 uppercase tracking-widest pt-3">
                  Finance & Comptabilité
                </span>
              )}

              {simulatedRole.modules.includes('commercial') && (
                <button
                  onClick={() => setErpTab('commercial')}
                  className={`w-full text-left p-2 rounded-lg transition text-xs font-bold flex items-center gap-2.5 ${
                    erpTab === 'commercial' ? 'bg-[#1E7A44] text-white shadow-sm border-l-4 border-[#8CC63F]' : 'hover:bg-[#0F3D2E] hover:text-white'
                  }`}
                >
                  <ShoppingBag className="h-4 w-4 text-[#8CC63F]" /> Facturations & Ventes
                </button>
              )}

              {simulatedRole.modules.includes('compta') && (
                <button
                  onClick={() => setErpTab('compta')}
                  className={`w-full text-left p-2 rounded-lg transition text-xs font-bold flex items-center gap-2.5 ${
                    erpTab === 'compta' ? 'bg-[#1E7A44] text-white shadow-sm border-l-4 border-[#8CC63F]' : 'hover:bg-[#0F3D2E] hover:text-white'
                  }`}
                >
                  <Book className="h-4 w-4 text-[#8CC63F]" /> Compta SYSCOHADA
                </button>
              )}

              {(simulatedRole.modules.includes('rh') || simulatedRole.modules.includes('ged') || simulatedRole.modules.includes('settings')) && (
                <span className="block text-[10px] text-[#8CC63F] font-black px-3 py-1 uppercase tracking-widest pt-3">
                  Administration & Sécurité
                </span>
              )}

              {simulatedRole.modules.includes('rh') && (
                <button
                  onClick={() => setErpTab('rh')}
                  className={`w-full text-left p-2 rounded-lg transition text-xs font-bold flex items-center gap-2.5 ${
                    erpTab === 'rh' ? 'bg-[#1E7A44] text-white shadow-sm border-l-4 border-[#8CC63F]' : 'hover:bg-[#0F3D2E] hover:text-white'
                  }`}
                >
                  <Users className="h-4 w-4 text-[#8CC63F]" /> Ressources Humaines
                </button>
              )}

              {simulatedRole.modules.includes('ged') && (
                <button
                  onClick={() => setErpTab('ged')}
                  className={`w-full text-left p-2 rounded-lg transition text-xs font-bold flex items-center gap-2.5 ${
                    erpTab === 'ged' ? 'bg-[#1E7A44] text-white shadow-sm border-l-4 border-[#8CC63F]' : 'hover:bg-[#0F3D2E] hover:text-white'
                  }`}
                >
                  <FolderOpen className="h-4 w-4 text-[#8CC63F]" /> Archivage GED
                </button>
              )}

              {simulatedRole.modules.includes('settings') && (
                <button
                  onClick={() => setErpTab('settings')}
                  className={`w-full text-left p-2 transition text-xs font-bold flex items-center gap-2.5 rounded-lg ${
                    erpTab === 'settings' ? 'bg-[#1E7A44] text-white shadow-sm border-l-4 border-[#8CC63F]' : 'hover:bg-[#0F3D2E] hover:text-[#8CC63F] text-zinc-350'
                  }`}
                >
                  <Settings className="h-4 w-4 shrink-0 text-[#8CC63F]" /> Paramètres Système
                </button>
              )}
            </div>

            {/* Friendly Mascot Advisor widget */}
            <div className="bg-[#0F3D2E]/50 p-2.5 rounded-lg border border-[#8CC63F]/20 flex items-center gap-2.5">
              <div className="shrink-0 w-8 h-8 rounded-full border border-[#8CC63F] bg-[#0F3D2E] flex items-center justify-center overflow-hidden">
                {/* Embedded Mini Mascot Head SVG */}
                <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" className="w-7.5 h-7.5">
                  <defs>
                    <linearGradient id="mascot-straw-grad-mini" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#F5D061" />
                      <stop offset="100%" stopColor="#B5811C" />
                    </linearGradient>
                    <linearGradient id="mascot-skin-grad-mini" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#82513B" />
                      <stop offset="100%" stopColor="#543122" />
                    </linearGradient>
                  </defs>
                  <circle cx="60" cy="70" r="17" fill="url(#mascot-skin-grad-mini)" />
                  <path d="M42 66 C42 80 47 87 60 87 C73 87 78 80 78 66 Z" fill="#1E1E1E" />
                  <ellipse cx="53" cy="66" rx="2.5" ry="3" fill="#FFFFFF" />
                  <circle cx="53" cy="66" r="1.5" fill="#4E342E" />
                  <ellipse cx="67" cy="66" rx="2.5" ry="3" fill="#FFFFFF" />
                  <circle cx="67" cy="66" r="1.5" fill="#4E342E" />
                  <ellipse cx="60" cy="50" rx="35" ry="11" fill="url(#mascot-straw-grad-mini)" stroke="#9F6F16" strokeWidth="1.5" />
                  <path d="M36 47 C36 22 84 22 84 47 Z" fill="url(#mascot-straw-grad-mini)" stroke="#9F6F16" strokeWidth="1.5" />
                  <path d="M36.5 45 Q60 48 83.5 45" fill="none" stroke="#1B5E20" strokeWidth="2" />
                </svg>
              </div>
              <div className="min-w-0">
                <span className="block text-[8px] text-[#8CC63F] font-black uppercase tracking-widest leading-none">Mascotte active</span>
                <span className="block text-[11px] text-white font-black leading-tight mt-0.5 truncate">Le Cultivateur</span>
                <span className="block text-[9.5px] text-slate-350 mt-0.5 truncate">Conseiller SYSCOHADA</span>
              </div>
            </div>

            {/* Quick stats in sidebar */}
            <div className="bg-slate-900 p-3 rounded-lg border border-slate-700 text-[10.5px] space-y-1.5 text-slate-400">
              <div className="flex justify-between">
                <span>Région d'Obala :</span>
                <span className="font-bold text-slate-200">Centre CM</span>
              </div>
              <div className="flex justify-between">
                <span>Devise comptable :</span>
                <span className="font-bold text-slate-200">XAF (FCFA)</span>
              </div>
              <div className="flex justify-between">
                <span>Dernière révision:</span>
                <span className="font-bold text-slate-200">18-Juin-2026</span>
              </div>
            </div>
          </aside>
        )}

        {/* CONTAINER WORKPLACE SCREEN */}
        <main className="grow overflow-y-auto bg-slate-50">
          {appMode === 'saas-admin' ? (
            <SaaSAdmin
              clients={saasClients}
              logs={saasLogs}
              onAddClient={handleProvisionTenant}
              onUpdateClientStatus={handleUpdateTenantStatus}
              onUpdateClient={handleUpdateClient}
              databases={databases}
              onUpdateTenantDatabase={handleUpdateTenantDatabase}
              planConfigs={saasPlanConfigs}
              onUpdatePlanConfigs={setSaasPlanConfigs}
              allData={{
                exploitations,
                parcelles,
                animaux,
                employes,
                factures,
                pieces: piecesComptables,
                articles
              }}
              onRestoreBackup={handleRestoreBackup}
              onSelectClient={switchActiveTenant}
            />
          ) : (
            <>
              {erpTab === 'dashboard' && (
                <Dashboard
                  exploitations={exploitations}
                  parcelles={parcelles}
                  cultures={cultures}
                  troupeaux={troupeaux}
                  animaux={animaux}
                  articles={articles}
                  piecesComptables={piecesComptables}
                  auditLogs={auditLogs}
                  meteo={currentWeather}
                  mouvementsStock={mouvementsStock}
                />
              )}

              {erpTab === 'agriculture' && (
                <AgricultureModule
                  exploitations={exploitations}
                  sites={sitesAgricoles}
                  champs={champs}
                  parcelles={parcelles}
                  campagnes={campagnes}
                  cultures={cultures}
                  interventions={interventions}
                  recoltes={recoltes}
                  incidents={incidents}
                  sitesElevage={sitesElevage}
                  batiments={batiments}
                  onAddExploitation={(newExp) => setExploitations(prev => [...prev, newExp])}
                  onAddParcelle={handleAddParcelle}
                  onAddCulture={handleAddCulture}
                  onUpdateCulture={handleUpdateCulture}
                  onAddIncident={handleAddIncident}
                  onAddIntervention={handleAddIntervention}
                  onAddRecolte={handleAddRecolte}
                  onAddChamp={handleAddChamp}
                  onUpdateChamp={handleUpdateChamp}
                  onDeleteChamp={handleDeleteChamp}
                  onUpdateParcelle={handleUpdateParcelle}
                  typesCulture={typesCulture}
                  typesOperation={typesOperation}
                  responsablesTerrain={responsablesTerrain}
                  substances={substances}
                  customLabels={systemSettings.customLabels}
                />
              )}

              {erpTab === 'elevage' && (
                <ElevageModule
                  sitesElevage={sitesElevage}
                  batiments={batiments}
                  troupeaux={troupeaux}
                  animaux={animaux}
                  reproductions={reproGestations}
                  contactsSanitaires={carnetsSanitaires}
                  feedLogs={feedLogs}
                  productionElevages={prodElevages}
                  onAddAnimal={handleAddAnimaux}
                  onAddReproduction={(newRep) => setReproGestations(prev => [...prev, newRep])}
                  onAddSanitaire={handleAddSanitaire}
                  onAddFeedLog={handleAddFeed}
                  onAddProduction={handleAddProductionElevage}
                />
              )}

              {erpTab === 'stocks' && (
                <StocksModule
                  magasins={magasins}
                  articles={articles}
                  mouvements={mouvementsStock}
                  equipements={equipements}
                  maintenances={maintenances}
                  fuelLogs={fuelLogs}
                  recoltes={recoltes}
                  cultures={cultures}
                  prodElevages={prodElevages}
                  onAddMouvement={handleAddMouvementStock}
                  onAddMaintenance={handleAddMaintenance}
                  onAddFuelLog={handleAddFuelLog}
                  customLabels={systemSettings.customLabels}
                />
              )}

              {erpTab === 'commercial' && (
                <CommercialModule
                  fournisseurs={fournisseurs}
                  demandesAchat={demandesAchat}
                  bonsCommande={bonsCommande}
                  clientsAcheteurs={clientsAcheteurs}
                  devis={devis}
                  commandesClients={commandesClients}
                  factures={factures}
                  encaissements={encaissements}
                  onAddDemandeAchat={handleAddDemandeAchat}
                  onAddBonCommande={handleAddBonCommande}
                  onAddClientAcheteur={handleAddClientAcheteur}
                  onAddDevis={handleAddDevis}
                  onAddCommandeClient={handleAddCommandeClient}
                  onAddFacture={handleAddFacture}
                  onAddEncaissement={handleAddEncaissementClient}
                  onConvertDevisToCommande={handleConvertDevisToCommande}
                  customLabels={systemSettings.customLabels}
                />
              )}

              {erpTab === 'compta' && (
                <AccountingModule
                  pieces={piecesComptables}
                  budgets={budgets}
                  equipements={equipements}
                  onAddPiece={handleAddPieceComptable}
                  onAddBudget={handleAddBudget}
                  onUpdateBudgetEngaged={handleUpdateBudgetEngaged}
                />
              )}

              {erpTab === 'rh' && (
                <HRModule
                  employes={employes}
                  presences={presences}
                  bulletins={bulletins}
                  onAddEmploye={handleAddEmploye}
                  onAddPresence={handleAddPresence}
                  onAddBulletin={handleAddBulletin}
                  customLabels={systemSettings.customLabels}
                />
              )}

              {erpTab === 'ged' && (
                <GEDModule
                  documents={documents}
                  onAddDocument={handleAddDocumentObj}
                />
              )}

              {erpTab === 'settings' && (
                <SettingsModule
                  settings={systemSettings}
                  onUpdateSettings={setSystemSettings}
                  onLogAudit={logAudit}
                  currentUser={currentUser}
                  onUpdateCurrentUser={handleUpdateCurrentUser}
                  utilisateurs={utilisateurs}
                  onAddUtilisateur={handleAddUtilisateur}
                  onUpdateUtilisateur={handleUpdateUtilisateur}
                  onDeleteUtilisateur={handleDeleteUtilisateur}
                  auditLogs={auditLogs}
                  typesCulture={typesCulture}
                  onAddTypeCulture={handleAddTypeCulture}
                  campagnes={campagnes}
                  onAddCampagne={handleAddCampagneObj}
                  typesOperation={typesOperation}
                  onAddTypeOperation={handleAddTypeOperation}
                  responsablesTerrain={responsablesTerrain}
                  onAddResponsableTerrain={handleAddResponsableTerrain}
                  substances={substances}
                  onAddSubstance={handleAddSubstance}
                  employes={employes}
                  fournisseurs={fournisseurs}
                  paysList={paysList}
                  villesList={villesList}
                  onAddPays={handleAddPays}
                  onAddVille={handleAddVille}
                />
              )}

              {erpTab === 'parc-materiel' && (
                <EquipementModule
                  equipements={equipements}
                  setEquipements={setEquipements}
                  maintenances={maintenances}
                  setMaintenances={setMaintenances}
                  fuelLogs={fuelLogs}
                  setFuelLogs={setFuelLogs}
                  compteursUtilisation={compteursUtilisation}
                  setCompteursUtilisation={setCompteursUtilisation}
                  utilisationsEquipement={utilisationsEquipement}
                  setUtilisationsEquipement={setUtilisationsEquipement}
                  plansMaintenance={plansMaintenance}
                  setPlansMaintenance={setPlansMaintenance}
                  pannesEquipement={pannesEquipement}
                  setPannesEquipement={setPannesEquipement}
                  assurancesEquipement={assurancesEquipement}
                  setAssurancesEquipement={setAssurancesEquipement}
                  employes={employes}
                  interventions={interventions}
                  onAddMouvement={handleAddMouvementStock}
                  articles={articles}
                  fournisseurs={fournisseurs}
                />
              )}

              {erpTab === 'bi-reporting' && (
                <BIModule
                  exploitations={exploitations}
                  parcelles={parcelles}
                  cultures={cultures}
                  troupeaux={troupeaux}
                  animaux={animaux}
                  articles={articles}
                  piecesComptables={piecesComptables}
                  mouvementsStock={mouvementsStock}
                  factures={factures}
                  budgets={budgets}
                  employes={employes}
                  equipements={equipements}
                  maintenances={maintenances}
                  pannesEquipement={pannesEquipement}
                  indicateursKPI={indicateursKPI}
                  setIndicateursKPI={setIndicateursKPI}
                  tableauxDeBord={tableauxDeBord}
                  setTableauxDeBord={setTableauxDeBord}
                  rapportsProgrammes={rapportsProgrammes}
                  setRapportsProgrammes={setRapportsProgrammes}
                  alertesBI={alertesBI}
                  setAlertesBI={setAlertesBI}
                  requetesPerso={requetesPerso}
                  setRequetesPerso={setRequetesPerso}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* FOOTER BAR */}
      <footer className="bg-white border-t p-2 px-6 shrink-0 text-[10px] text-slate-400 font-mono flex flex-wrap justify-between items-center">
        <span>© 2026 MEFOUP-FLOW SaaS Agricole. Tous droits réservés.</span>
        <span className="flex items-center gap-1">
          <Terminal className="h-3.5 w-3.5" /> SECURE TRACEABILITY MODE • SYSTEM ACTIVE
        </span>
      </footer>
    </div>
  );
}
