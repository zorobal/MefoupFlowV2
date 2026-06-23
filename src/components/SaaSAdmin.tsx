/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { SaaSClient, SaaSLog, TenantDatabase, SubscriptionPlan, Utilisateur } from '../types';
import {
  Users,
  Layers,
  Globe,
  PlusCircle,
  Database,
  Search,
  CheckCircle,
  AlertTriangle,
  FolderLock,
  Download,
  Upload,
  Terminal,
  Activity,
  Server,
  Eye,
  Settings,
  Lock,
  UserCheck,
  RefreshCw,
  FileSpreadsheet,
  Edit2,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  ShieldAlert,
  CreditCard,
  MessageSquare,
  Megaphone,
  Cpu,
  Trash2,
  HelpCircle,
  Clock,
  ArrowUpRight,
  Check
} from 'lucide-react';

interface SaaSAdminProps {
  clients: SaaSClient[];
  logs: SaaSLog[];
  onAddClient: (newClient: SaaSClient) => void;
  onUpdateClientStatus: (clientId: string, newStatus: SaaSClient['statut']) => void;
  onUpdateClient: (updatedClient: SaaSClient) => void;
  databases: Record<string, TenantDatabase>;
  onUpdateTenantDatabase: (tenantId: string, updatedDb: TenantDatabase) => void;
  planConfigs: Record<string, { id: string; name: string; price: number; priceUnit: string; maxUsers: number; maxSurface: number; modules: string[] }>;
  onUpdatePlanConfigs: React.Dispatch<React.SetStateAction<any>>;
  allData: {
    exploitations: any[];
    parcelles: any[];
    animaux: any[];
    employes: any[];
    factures: any[];
    pieces: any[];
    articles: any[];
  };
  onRestoreBackup: (backupData: any) => void;
  onSelectClient?: (client: SaaSClient) => void;
}

export default function SaaSAdmin({
  clients,
  logs,
  onAddClient,
  onUpdateClientStatus,
  onUpdateClient,
  databases,
  onUpdateTenantDatabase,
  planConfigs,
  onUpdatePlanConfigs,
  allData,
  onRestoreBackup,
  onSelectClient
}: SaaSAdminProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClientForAudit, setSelectedClientForAudit] = useState<SaaSClient | null>(clients[0] || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tabs for the selected client details view
  const [activeDetailTab, setActiveDetailTab] = useState<'audit' | 'edit' | 'users'>('audit');

  // Main SaaS tab for full console layout
  const [saasMainTab, setSaasMainTab] = useState<'clients' | 'billing' | 'tickets' | 'maintenance' | 'telemetry'>('clients');

  // Support Tickets
  const [saasTickets, setSaasTickets] = useState<any[]>(() => {
    const saved = localStorage.getItem('saas_tickets');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'TCK-001', clientId: clients[0]?.id || 'client-1', clientName: clients[0]?.raisonSociale || 'KISSINE AGRO CO', category: 'Comptabilité Syscohada', title: 'Calcul de la balance analytique bloqué', desc: 'Lors de la clôture périodique, la balance par tiers indique une incohérence de 15,000 F CFA.', priority: 'Élevée', date: '2026-06-20', status: 'En Cours', chat: [{ sender: 'client', msg: 'Bonjour support, le calcul est bloqué' }, { sender: 'support', msg: 'Aussi, veillez vérifier l\'imputation du journal des salaires.' }] },
      { id: 'TCK-002', clientId: 'any', clientName: 'COOP CA DU NOUN', category: 'Licence / Paiement', title: 'Renouvellement annuel par Virement BEAC', desc: 'Notre comptable a émis l’ordre de virement pour l’abonnement annuel. Pouvez-vous valider sans attendre l’imputation bancaire ?', priority: 'Normale', date: '2026-06-18', status: 'Nouveau', chat: [] },
      { id: 'TCK-003', clientId: 'any', clientName: 'SOCIÉTÉ CIVILE DU MEFOU', category: 'Bug technique', title: 'Problème d’importation GED pièce jointe', desc: 'Le fichier JPEG de 8.2 Mo n’a pas été numérisé correctement, l’OCR de décalcification indique un délai d’attente dépassé.', priority: 'Normale', date: '2026-06-15', status: 'Résolu', chat: [{ sender: 'support', msg: 'Nous avons optimisé la compression image à 5Mo pour résoudre l’OCR.' }, { sender: 'client', msg: 'Fonctionne parfaitement maintenant, merci !' }] }
    ];
  });

  // Billing & Invoices
  const [saasInvoices, setSaasInvoices] = useState<any[]>(() => {
    const saved = localStorage.getItem('saas_invoices');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'INV-2026-001', clientName: clients[0]?.raisonSociale || 'KISSINE AGRO CO', plan: 'Professional', amount: 350000, date: '2026-06-15', method: 'Orange Money', status: 'Payé' },
      { id: 'INV-2026-002', clientName: 'COOP CA DU NOUN', plan: 'Cooperative', amount: 850000, date: '2026-06-12', method: 'Virement BEAC', status: 'Payé' },
      { id: 'INV-2026-003', clientName: 'AGRIFAST CAMEROUN', plan: 'Starter', amount: 150000, date: '2026-06-10', method: 'MTN Mobile Money', status: 'Payé' },
      { id: 'INV-2026-004', clientName: 'CHOCO-CAM COOP', plan: 'Enterprise', amount: 1250000, date: '2026-06-01', method: 'Virement BEAC', status: 'Payé' },
      { id: 'INV-2026-005', clientName: 'SOCIÉTÉ CIVILE DU MEFOU', plan: 'Professional', amount: 350000, date: '2026-05-28', method: 'Orange Money', status: 'Payé' }
    ];
  });

  // Global Announcements / Maintenance Schedules
  const [saasAnnouncements, setSaasAnnouncements] = useState<any[]>(() => {
    const saved = localStorage.getItem('saas_announcements');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'ANN-001', titre: 'Maintenance programmée : Optimisation serveurs OHADA', message: 'Les serveurs de calcul comptable seront suspendus pour maintenance le Samedi 27 Juin 2026 de 22h00 à 02h00 UTC.', date: '2026-06-22', categorie: 'Maintenance', isLive: true },
      { id: 'ANN-002', titre: 'Mise à jour v3.4 : Modules Élevage & Vaccination', message: 'Les fiches d’élevage intègrent désormais le planning de traçabilité vaccinale automatisé conforme aux directives de la CEMAC.', date: '2026-06-19', categorie: 'Mise à jour', isLive: true }
    ];
  });

  // Persist SaaS administration modules states
  React.useEffect(() => {
    localStorage.setItem('saas_tickets', JSON.stringify(saasTickets));
  }, [saasTickets]);

  React.useEffect(() => {
    localStorage.setItem('saas_invoices', JSON.stringify(saasInvoices));
  }, [saasInvoices]);

  React.useEffect(() => {
    localStorage.setItem('saas_announcements', JSON.stringify(saasAnnouncements));
  }, [saasAnnouncements]);

  // Ticket detail selection state
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [ticketReplyText, setTicketReplyText] = useState('');

  // Announcement fields
  const [newAnnTitle, setNewAnnTitle] = useState('');
  const [newAnnMsg, setNewAnnMsg] = useState('');
  const [newAnnCat, setNewAnnCat] = useState('Annonce');

  // Manual payment state
  const [showAddInvoiceModal, setShowAddInvoiceModal] = useState(false);
  const [newInvClient, setNewInvClient] = useState('');
  const [newInvPlan, setNewInvPlan] = useState('Professional');
  const [newInvAmount, setNewInvAmount] = useState('350000');
  const [newInvMethod, setNewInvMethod] = useState('Orange Money');

  // Plan editor active configuration state
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);

  // States for new client creation
  const [raisonSociale, setRaisonSociale] = useState('');
  const [sigle, setSigle] = useState('');
  const [numContribuable, setNumContribuable] = useState('');
  const [regCommerce, setRegCommerce] = useState('');
  const [responsableNom, setResponsableNom] = useState('');
  const [responsablePrenom, setResponsablePrenom] = useState('');
  const [responsableEmail, setResponsableEmail] = useState('');
  const [responsableTel, setResponsableTel] = useState('');
  const [pays, setPays] = useState('Cameroun');
  const [region, setRegion] = useState('Centre');
  const [ville, setVille] = useState('Yaoundé');
  const [plan, setPlan] = useState<SubscriptionPlan>('Professional');
  const [customLogin, setCustomLogin] = useState('');
  const [customPassword, setCustomPassword] = useState('');

  // Editing single plan parameters states
  const [planEditPrice, setPlanEditPrice] = useState<number>(0);
  const [planEditPriceUnit, setPlanEditPriceUnit] = useState('/ mois');
  const [planEditMaxUsers, setPlanEditMaxUsers] = useState<number>(5);
  const [planEditMaxSurface, setPlanEditMaxSurface] = useState<number>(20);
  const [planEditModules, setPlanEditModules] = useState<string[]>([]);

  // Credentials presentation screen state
  const [newlyCreatedCredentials, setNewlyCreatedCredentials] = useState<{
    raisonSociale: string;
    login: string;
    password: string;
    licence: string;
  } | null>(null);

  // Keep selected client updated if the list changes
  React.useEffect(() => {
    if (selectedClientForAudit) {
      const refreshed = clients.find(c => c.id === selectedClientForAudit.id);
      if (refreshed) {
        setSelectedClientForAudit(refreshed);
      }
    }
  }, [clients]);

  const handleExportTextFile = () => {
    let today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    let filename = `export-saas-${saasMainTab}-${new Date().toISOString().split('T')[0]}.txt`;
    let content = "";

    if (saasMainTab === 'clients') {
      content += `================================================================================\n`;
      content += `  RAPPORT EXPLICATIF DE L'ADMINISTRATION DES INSTANCES SAAS ERP\n`;
      content += `================================================================================\n`;
      content += `Généré le: ${today}\n`;
      content += `Filtre actif de recherche: ${searchQuery ? `"${searchQuery}"` : "Aucun filtre (Tous les clients sont affichés)"}\n\n`;

      content += `--------------------------------------------------------------------------------\n`;
      content += `1. DESCRIPTION DU MODULE DES CLIENTSES & INSTANCES\n`;
      content += `--------------------------------------------------------------------------------\n`;
      content += `Ce volet de l'application SaaS Super-Admin permet de gérer le portefeuille client d’Afrique Centrale (CEMAC).\n`;
      content += `Il supervise l'activation ou la suspension des licences des tenanciers, définit des quotas précis de surface agronomique exploitée (en hectares)\n`;
      content += `et régule le nombre maximum d’utilisateurs autorisés à se connecter simultanément par client.\n\n`;

      content += `--------------------------------------------------------------------------------\n`;
      content += `2. STATISTIQUES SAAS DE LA PLATEFORME\n`;
      content += `--------------------------------------------------------------------------------\n`;
      content += `- Nombre Total d'abonnés enregistrés : ${clients.length}\n`;
      content += `- Comptes d'instances Actifs : ${clients.filter(c => c.statut === 'Actif').length}\n`;
      content += `- Comptes Suspendus pour défaut de paiement : ${clients.filter(c => c.statut === 'Suspendu').length}\n`;
      content += `- Taux moyen de disponibilité constaté par répartition SQL : 99.99%\n\n`;

      content += `--------------------------------------------------------------------------------\n`;
      content += `3. INDEX DETAILLÉ DES CLIENTS MULTITENANCES (FILTRÉS)\n`;
      content += `--------------------------------------------------------------------------------\n`;
      
      const filtered = clients.filter(c =>
        c.raisonSociale.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.sigle.toLowerCase().includes(searchQuery.toLowerCase())
      );

      if (filtered.length === 0) {
        content += `=> Aucun client ne correspond au filtre de recherche "${searchQuery}".\n`;
      } else {
        filtered.forEach((c, idx) => {
          content += `CLIENT N°${idx + 1} : [${c.sigle}] ${c.raisonSociale}\n`;
          content += `  - Immatriculation Commerce: ${c.regCommerce || 'N/A'}\n`;
          content += `  - No. Identifiant Unique : ${c.numContribuable || 'N/A'}\n`;
          content += `  - Localisation Régionale : ${c.ville}, ${c.region}, ${c.pays}\n`;
          content += `  - Responsable Principal  : ${c.responsableNom} ${c.responsablePrenom} (${c.responsableEmail} - Tel: ${c.responsableTel})\n`;
          content += `  - Abonnements & Limites  : Plan ${c.plan} | Max Users: ${c.maxUtilisateurs} | Surface autorisée: ${c.surfaceExploitee} Hectares\n`;
          content += `  - Statut de la Licence   : ${c.statut === 'Actif' ? 'ACTIF (Accès total autorisé)' : 'SUSPENDU (Accès restreint)'}\n`;
          content += `  ------------------------------------------------------------------------------\n`;
        });
      }

      if (selectedClientForAudit) {
        content += `\n--------------------------------------------------------------------------------\n`;
        content += `4. ZOOM - HISTORIQUE D'AUDIT DU CLIENT SÉLECTIONNÉ : ${selectedClientForAudit.raisonSociale}\n`;
        content += `--------------------------------------------------------------------------------\n`;
        const dbSelected = databases[selectedClientForAudit.id];
        if (dbSelected && dbSelected.auditLogs) {
          dbSelected.auditLogs.forEach((log) => {
            content += `[${log.dateHeure}] OP: ${log.operateur} (${log.role})\n`;
            content += `  Action: ${log.action} | ${log.description}\n`;
            content += `  ------------------------------------------------------------------------------\n`;
          });
        } else {
          content += `Aucun log d'audit n'a encore été généré pour ce client.\n`;
        }
      }
    } else if (saasMainTab === 'billing') {
      content += `================================================================================\n`;
      content += `  RAPPORT COMPTABLE SAAS - FACTURATION & ABONNEMENTS COMPTABLES\n`;
      content += `================================================================================\n`;
      content += `Généré le: ${today}\n`;
      content += `Filtre actif de recherche: Toutes les factures encaissées en direct\n\n`;

      content += `--------------------------------------------------------------------------------\n`;
      content += `1. CADRE GLOBAL DE COMPTABILITÉ CEMAC & CONFORMITÉ FINANCIÈRE\n`;
      content += `--------------------------------------------------------------------------------\n`;
      content += `Toutes les factures transitant par notre passerelle Super-Admin sont libellées en Franc CFA (XAF)\n`;
      content += `pour respecter les normes financières édictées par la BEAC et la conformité SYSCOHADA révisée.\n`;
      content += `Les abonnements sont prélevés selon des échéances de factures déterminées à l'activation.\n\n`;

      content += `--------------------------------------------------------------------------------\n`;
      content += `2. ANALYSE SYNTHÉTIQUE DE LA TRÉSORERIE SAAS\n`;
      content += `--------------------------------------------------------------------------------\n`;
      const totalAmount = saasInvoices.reduce((acc, inv) => acc + inv.amount, 0);
      content += `- Volume Financier Encaissé : ${totalAmount.toLocaleString()} FCFA\n`;
      content += `- Nombre de Factures et Règlements rattachés : ${saasInvoices.length}\n`;
      content += `- Statut du recouvrement global : COUVERT À 100% (Paiements d'entrée compensés)\n`;
      content += `- Mode de règlement majoritaire en Afrique Centrale : Orange Money, MTN MoMo, Virement BEAC\n\n`;

      content += `--------------------------------------------------------------------------------\n`;
      content += `3. REGISTRE DES FACTURES ET RÈGLEMENTS PERÇUS\n`;
      content += `--------------------------------------------------------------------------------\n`;
      if (saasInvoices.length === 0) {
        content += `=> Aucune facture enregistrée.\n`;
      } else {
        saasInvoices.forEach((inv) => {
          content += `Facture Référence: ${inv.id}\n`;
          content += `  - Client Bénéficiaire : ${inv.clientName}\n`;
          content += `  - Formule souscrite   : Plan ${inv.plan}\n`;
          content += `  - Montant de la licence: ${inv.amount.toLocaleString()} FCFA\n`;
          content += `  - Date d'encaissement : ${inv.date}\n`;
          content += `  - Moyen de règlement  : ${inv.method}\n`;
          content += `  - Statut comptable    : ${inv.status}\n`;
          content += `  ------------------------------------------------------------------------------\n`;
        });
      }
    } else if (saasMainTab === 'tickets') {
      content += `================================================================================\n`;
      content += `  RAPPORT DU SERVICE SUPPORT CLIENT & CONFORMITÉ SAAS\n`;
      content += `================================================================================\n`;
      content += `Généré le: ${today}\n`;
      content += `Filtre actif de recherche: Liste chronologique des requêtes de support\n\n`;

      content += `--------------------------------------------------------------------------------\n`;
      content += `1. DESCRIPTION GÉNÉRALE DU SERVICE SUPPORT CLIENT\n`;
      content += `--------------------------------------------------------------------------------\n`;
      content += `L'application centralise les demandes d'intervention, réclamations comptables, et blocages techniques\n`;
      content += `provenant directement des tenanciers du progiciel. Un système de catégorisation intelligent\n`;
      content += `assigne des niveaux d'importance pour garantir un temps de réponse inférieur à 2 heures pour les cas critiques.\n\n`;

      content += `--------------------------------------------------------------------------------\n`;
      content += `2. SOMMAIRE DU CARNET DE TICKETS\n`;
      content += `--------------------------------------------------------------------------------\n`;
      content += `- Nombre de réclamations : ${saasTickets.length}\n`;
      content += `- Résolus ou Clos : ${saasTickets.filter(t => t.status === 'Résolu').length}\n`;
      content += `- En cours de traitement : ${saasTickets.filter(t => t.status === 'En Cours').length}\n`;
      content += `- En attente d'attribution : ${saasTickets.filter(t => t.status === 'En Attente').length}\n\n`;

      content += `--------------------------------------------------------------------------------\n`;
      content += `3. LISTE EXPLICATIVE DES TICKETS CRÉÉS PAR LES COMPTES CLIENTS\n`;
      content += `--------------------------------------------------------------------------------\n`;
      saasTickets.forEach((t) => {
        content += `TICKET REF: ${t.id} - ${t.title}\n`;
        content += `  - Client Appartenant  : ${t.clientName}\n`;
        content += `  - Catégorie Incident  : ${t.category}\n`;
        content += `  - Niveau d'Urgence    : ${t.priority}\n`;
        content += `  - Date d'ouverture    : ${t.date}\n`;
        content += `  - Résumé du problème  : "${t.desc}"\n`;
        content += `  - Statut Actuel       : ${t.status}\n`;
        if (t.chat && t.chat.length > 0) {
          content += `  - Échanges dans le Chat de Ticket :\n`;
          t.chat.forEach((msg: any) => {
            content += `    * [${msg.sender === 'support' ? 'SUPPORT CENTRAL' : 'CLIENT ERP'}] : ${msg.msg}\n`;
          });
        }
        content += `  ------------------------------------------------------------------------------\n`;
      });
    } else if (saasMainTab === 'maintenance') {
      content += `================================================================================\n`;
      content += `  RAPPORT EXPOSITIF - DIFFUSIONS DES ANNONCES & PLANNING DE MAINTENANCE\n`;
      content += `================================================================================\n`;
      content += `Généré le: ${today}\n`;
      content += `Filtre actif de recherche: Annonces du catalogue fournisseur\n\n`;

      content += `--------------------------------------------------------------------------------\n`;
      content += `1. RÔLE DES LOGISTIQUES DE COMMUNICATION\n`;
      content += `--------------------------------------------------------------------------------\n`;
      content += `Les messages et annonces programmés ici sont instantanément affichés au sommet des tableaux\n`;
      content += `de bord de tous les tenanciers clients actifs.\n`;
      content += `Ce canal permet de prévenir les coopératives agricoles et les fermes d'élevage industrielles\n`;
      content += `en cas de travaux d'infrastructure, de sauvegardes globales à l'échelle de la BEAC, ou de v3.\n\n`;

      content += `--------------------------------------------------------------------------------\n`;
      content += `2. LISTE DES COMMUNICATIONS EN LIGNE SUR LA PLATEFORME\n`;
      content += `--------------------------------------------------------------------------------\n`;
      if (saasAnnouncements.length === 0) {
        content += `=> Aucune annonce publiée pour le moment.\n`;
      } else {
        saasAnnouncements.forEach((ann) => {
          content += `ANNONCE REF: ${ann.id} | Catégorie : [${ann.categorie}] | Date : ${ann.date}\n`;
          content += `  - Titre principal : ${ann.titre}\n`;
          content += `  - Message intégral : "${ann.message}"\n`;
          content += `  - Statut de diffusion : ACTIF ET VISIBLE\n`;
          content += `  ------------------------------------------------------------------------------\n`;
        });
      }
    } else if (saasMainTab === 'telemetry') {
      content += `================================================================================\n`;
      content += `  RAPPORT INFORMATIQUE - TELEMETRIE SYSTEME & LOGS MULTITENANCES\n`;
      content += `================================================================================\n`;
      content += `Généré le: ${today}\n`;
      content += `Filtre actif de recherche: Télémétrie instantanée du serveur de production\n\n`;

      content += `--------------------------------------------------------------------------------\n`;
      content += `1. DESCRIPTION INFORMATIQUE ET SECURITE REZ DE CHAUSSEE\n`;
      content += `--------------------------------------------------------------------------------\n`;
      content += `Ce tableau rassemble les mesures de performance globales enregistrées par le conteneur cloud.\n`;
      content += `Le serveur principal écoute exclusivement sur le port de communication 3000,\n`;
      content += `acheminé via un reverse-proxy Nginx à latence réduite.\n\n`;

      content += `--------------------------------------------------------------------------------\n`;
      content += `2. CHARGES PHYSIQUES DE LA SOLUTION ERP\n`;
      content += `--------------------------------------------------------------------------------\n`;
      content += `- Ingress Container Node : Port 3000 opérationnel\n`;
      content += `- Pool de Connexion PostgreSQL actif : ${clients.length * 2 + 3} slots utilisés de manière isolée\n`;
      content += `- Latence d'accès moyenne de la base : 12 millisecondes\n`;
      content += `- RAM maximale allouée : 512 Mo par conteneur de déploiement\n`;
      content += `- Charge CPU générale : Stable à 5.4% sous processus Node/Vite\n\n`;

      content += `--------------------------------------------------------------------------------\n`;
      content += `3. ARCHIVE COMPLETE DES LOGS METIERS SÉLECTIONNÉS\n`;
      content += `--------------------------------------------------------------------------------\n`;
      if (!logs || logs.length === 0) {
        content += `=> Aucun log système intercepté dans cette session.\n`;
      } else {
        logs.forEach((l) => {
          content += `[${l.date}] - [${l.statut}] - [${l.module}] par ${l.utilisateur || 'SYSTÈME'}\n`;
          content += `  Action réalisée : ${l.action}\n`;
          content += `  ------------------------------------------------------------------------------\n`;
        });
      }
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

  // Handle plan edit initialization
  const startEditingPlan = (planId: string) => {
    const p = planConfigs[planId];
    if (p) {
      setEditingPlanId(planId);
      setPlanEditPrice(p.price);
      setPlanEditPriceUnit(p.priceUnit);
      setPlanEditMaxUsers(p.maxUsers);
      setPlanEditMaxSurface(p.maxSurface);
      setPlanEditModules(p.modules);
    }
  };

  const handleSavePlanConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlanId) return;

    onUpdatePlanConfigs((prev: any) => ({
      ...prev,
      [editingPlanId]: {
        ...prev[editingPlanId],
        price: planEditPrice,
        priceUnit: planEditPriceUnit,
        maxUsers: planEditMaxUsers,
        maxSurface: planEditMaxSurface,
        modules: planEditModules
      }
    }));

    setEditingPlanId(null);
    alert('✅ Paramètres de la formule mis à jour avec succès! Les nouvelles limitations techniques s\'appliqueront immédiatement.');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!raisonSociale || !responsableEmail) return;

    // Retrieve tech limits configured for selected plan
    const selectedPlanConfig = planConfigs[plan] || { maxUsers: 25, maxSurface: 100, modules: ['dashboard', 'agriculture', 'stocks', 'ged'] };

    const login = customLogin.trim() || responsableEmail.trim().toLowerCase();
    const tempPass = customPassword.trim() || 'Mefoup' + Math.floor(1000 + Math.random() * 9000) + '!';
    const licenceId = 'LIC-' + plan.substring(0, 3).toUpperCase() + '-' + Math.floor(100000 + Math.random() * 900000);

    const generatedClient: SaaSClient = {
      id: 'client-' + Math.floor(Math.random() * 100000),
      idLicence: licenceId,
      raisonSociale,
      sigle: sigle || raisonSociale.substring(0, 4).toUpperCase(),
      numContribuable,
      regCommerce,
      secteur: 'Agro-Industrie',
      responsableNom,
      responsablePrenom,
      responsableEmail,
      responsableTel,
      pays,
      region,
      ville,
      statut: 'Actif',
      plan,
      dateCreation: new Date().toISOString().substring(0, 10),
      dateExpiration: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().substring(0, 10),
      surfaceExploitee: selectedPlanConfig.maxSurface, 
      maxUtilisateurs: selectedPlanConfig.maxUsers,
      superAdminLogin: login,
      superAdminPassword: tempPass,
      mustChangePassword: true // Forces first-login password update!
    };

    onAddClient(generatedClient);

    setNewlyCreatedCredentials({
      raisonSociale: generatedClient.raisonSociale,
      login,
      password: tempPass,
      licence: licenceId
    });

    // Reset Form Fields
    setRaisonSociale('');
    setSigle('');
    setNumContribuable('');
    setRegCommerce('');
    setResponsableNom('');
    setResponsablePrenom('');
    setResponsableEmail('');
    setResponsableTel('');
    setShowAddModal(false);
  };

  const fileInputRefRestore = useRef<HTMLInputElement>(null);

  const triggerRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        onRestoreBackup(json);
        alert("✔️ Base de données restaurée et injectée avec succès !");
      } catch (err) {
        alert("❌ Fichier de restauration invalide ou corrompu.");
      }
    };
    reader.readAsText(file);
  };

  const triggerExport = (client: SaaSClient) => {
    const clientDb = databases[client.id] || { info: "offline" };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      client,
      database: clientDb,
      exportedAt: new Date().toISOString()
    }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `MEFOUP_FLOW_BACKUP_${client.raisonSociale.replace(/\s+/g, '_').toUpperCase()}_${new Date().toISOString().substring(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Filter clients based on search query
  const filteredClients = clients.filter(c =>
    c.raisonSociale.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.sigle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.idLicence.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getAuditStats = (client: SaaSClient) => {
    const db = databases[client.id];
    if (db) {
      return {
        farmsCount: db.exploitations?.length || 0,
        parcellesCount: db.parcelles?.length || 0,
        animalsCount: db.animaux?.length || 0,
        workersCount: db.employes?.length || 0,
        ledgerLength: db.factures?.length || db.piecesComptables?.length || 0,
        invoicedAmount: db.factures?.reduce((acc: number, f: any) => acc + (f.totalTTC || f.montant || 0), 0) || 500000
      };
    }
    // Static estimation for previews
    const seed = client.idLicence ? client.idLicence.charCodeAt(5) || 5 : 5;
    const multiplier = (seed % 4) + 1;
    return {
      farmsCount: Math.round(1 * multiplier) || 1,
      parcellesCount: Math.round(allData.parcelles.length * multiplier) || 2,
      animalsCount: Math.round(allData.animaux.length * multiplier) || 12,
      workersCount: Math.round(allData.employes.length * multiplier) || 6,
      ledgerLength: Math.round(allData.pieces.length * multiplier) || 5,
      invoicedAmount: Math.round(850000 * multiplier)
    };
  };

  const handleResetUserPassword = (user: { id?: string; nom: string; email: string; roleId?: string }) => {
    const tempPass = 'Mefoup' + Math.floor(1000 + Math.random() * 9000) + '!';
    
    if (!selectedClientForAudit) return;

    // 1. If it's the primary customer super-admin, update it in the saasClients too
    if (selectedClientForAudit.superAdminLogin?.toLowerCase() === user.email.toLowerCase()) {
      const updatedClient = {
        ...selectedClientForAudit,
        superAdminPassword: tempPass,
        mustChangePassword: true
      };
      onUpdateClient(updatedClient);
      setSelectedClientForAudit(updatedClient);
    }

    // 2. Locate client database partition & update the password of this user profile
    const clientDb = (databases[selectedClientForAudit.id] || { utilisateurs: [] }) as TenantDatabase;
    const currentUsers = clientDb.utilisateurs || [];
    
    const exists = currentUsers.some((u: any) => u.email.toLowerCase() === user.email.toLowerCase());
    let updatedUsers = [];
    if (exists) {
      updatedUsers = currentUsers.map((u: any) => {
        if (u.email.toLowerCase() === user.email.toLowerCase()) {
          return { ...u, password: tempPass, mustChangePassword: true };
        }
        return u;
      });
    } else {
      updatedUsers = [
        ...currentUsers,
        {
          id: user.id || 'usr-' + Math.floor(Math.random() * 100000),
          nom: user.nom,
          email: user.email,
          password: tempPass,
          roleId: user.roleId || 'role-superadmin',
          statut: 'Actif',
          mustChangePassword: true
        }
      ];
    }

    onUpdateTenantDatabase(selectedClientForAudit.id, {
      ...clientDb,
      utilisateurs: updatedUsers
    });

    alert(`🔑 Réinitialisation accomplie avec succès !\n\nUtilisateur : ${user.email}\nNouveau mot de passe provisoire : ${tempPass}\n\nUn changement de mot de passe obligatoire s'affichera dès sa prochaine connexion.`);
  };

  // Get active users for the currently audited client
  const getSelectedClientUsers = (): any[] => {
    if (!selectedClientForAudit) return [];
    const db = databases[selectedClientForAudit.id];
    
    // Default list
    const mainAdminUser = {
      id: 'usr-admin-virtuel',
      nom: `${selectedClientForAudit.responsablePrenom} ${selectedClientForAudit.responsableNom}`,
      email: selectedClientForAudit.superAdminLogin || selectedClientForAudit.responsableEmail,
      roleId: 'role-superadmin',
      statut: 'Actif',
      mustChangePassword: selectedClientForAudit.mustChangePassword
    };

    if (db && db.utilisateurs && db.utilisateurs.length > 0) {
      return db.utilisateurs;
    }

    return [mainAdminUser];
  };

  const handleUpdateSelectedClientDetails = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedClientForAudit) return;

    const formData = new FormData(e.currentTarget);
    
    const planValue = formData.get('plan') as SubscriptionPlan;
    const planConfig = planConfigs[planValue] || { maxUsers: 5, maxSurface: 20 };

    const updatedClient: SaaSClient = {
      ...selectedClientForAudit,
      raisonSociale: formData.get('raisonSociale') as string,
      sigle: formData.get('sigle') as string,
      numContribuable: formData.get('numContribuable') as string,
      regCommerce: formData.get('regCommerce') as string,
      responsableNom: formData.get('responsableNom') as string,
      responsablePrenom: formData.get('responsablePrenom') as string,
      responsableEmail: formData.get('responsableEmail') as string,
      responsableTel: formData.get('responsableTel') as string,
      pays: formData.get('pays') as string,
      region: formData.get('region') as string,
      ville: formData.get('ville') as string,
      statut: formData.get('statut') as SaaSClient['statut'],
      plan: planValue,
      maxUtilisateurs: Number(formData.get('maxUtilisateurs') || planConfig.maxUsers),
      surfaceExploitee: Number(formData.get('surfaceExploitee') || planConfig.maxSurface)
    };

    onUpdateClient(updatedClient);
    setSelectedClientForAudit(updatedClient);
    alert('✅ Informations de la licence client enregistrées avec succès !');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* SaaS Editor Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 border rounded-2xl shadow-sm">
        <div>
          <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-md font-bold uppercase tracking-wider">
            ESPACE FOURNISSEUR APPLICATION
          </span>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 mt-2 flex items-center gap-2">
            <Layers className="text-indigo-600 h-7 w-7" />
            Portail de Gestion & Activation des Clients
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Activer/suspendre les comptes, provisionner les formules d'abonnement et gérer la restitution ou le téléchargement de leurs bases de données.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={handleExportTextFile}
            className="border-2 border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-700 font-extrabold text-xs py-2.5 px-4 rounded-xl transition flex items-center gap-2 cursor-pointer shadow-3xs"
          >
            <Download className="h-4 w-4 text-indigo-600" />
            Exporter la Page Actuelle (.txt)
          </button>

          <button
            onClick={() => fileInputRefRestore.current?.click()}
            className="border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 font-bold text-xs py-2.5 px-4 rounded-xl transition flex items-center gap-2 cursor-pointer"
          >
            <Upload className="h-4 w-4 text-slate-500" />
            Restituer/Injecter une sauvegarde
          </button>
          <input
            type="file"
            ref={fileInputRefRestore}
            onChange={triggerRestore}
            className="hidden"
            accept=".json"
          />

          <button
            onClick={() => {
              // Pre-fill defaults based on professional plan
              setPlan('Professional');
              setShowAddModal(true);
            }}
            className="bg-indigo-600 text-white font-extrabold text-xs py-2.5 px-5 rounded-xl hover:bg-indigo-700 transition flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <PlusCircle className="h-4 w-4" />
            Créer Compte Client & Super-Admin
          </button>
        </div>
      </div>

      {/* NEWLY CREATED CREDENTIALS BANNER PRESENTATION */}
      {newlyCreatedCredentials && (
        <div className="bg-emerald-50 border-2 border-emerald-300 p-5 rounded-2xl space-y-3 relative animate-in fade-in duration-200">
          <button
            onClick={() => setNewlyCreatedCredentials(null)}
            className="absolute top-4 right-4 text-emerald-800 font-bold hover:text-emerald-950 text-xs"
          >
            Masquer [X]
          </button>
          <div className="flex items-center gap-2">
            <CheckCircle className="text-emerald-600 h-5 w-5 shrink-0" />
            <span className="font-extrabold text-sm text-emerald-900 uppercase">
              Formule Validée ! Compte Super-Administrateur Prêt à l'envoi
            </span>
          </div>
          <p className="text-xs text-emerald-700">
            Le client <strong>{newlyCreatedCredentials.raisonSociale}</strong> a été créé. Veuillez lui communiquer ces identifiants de sécurité. Un changement obligatoire de mot de passe sera demandé lors de leur première connexion :
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-white p-4 rounded-xl border border-emerald-100 font-mono text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Identifiant / Login</span>
              <span className="font-bold text-indigo-700 break-all">{newlyCreatedCredentials.login}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Mot de Passe SuperAdmin</span>
              <span className="font-bold text-slate-800 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">{newlyCreatedCredentials.password}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Licence ERP</span>
              <span className="font-bold text-slate-700">{newlyCreatedCredentials.licence}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Statut Licence</span>
              <span className="font-bold text-emerald-600 flex items-center gap-1">✓ ACTIVÉ / PAYÉ</span>
            </div>
          </div>
        </div>
      )}

      {/* Editor Main Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl shadow-2xs border p-4 flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <Globe className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">Total Clients</div>
            <div className="text-lg font-black text-slate-800">{clients.length}</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-2xs border p-4 flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <UserCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">Clients Actifs</div>
            <div className="text-lg font-black text-emerald-600">{clients.filter(c => c.statut === 'Actif').length}</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-2xs border p-4 flex items-center gap-4">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-lg">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">Suspendus</div>
            <div className="text-lg font-black text-rose-600">{clients.filter(c => c.statut === 'Suspendu').length}</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-2xs border p-4 flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">SaaS Partition SQL</div>
            <div className="text-lg font-black text-slate-800">{clients.length} isolées</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-2xs border p-4 flex items-center gap-4 col-span-2 lg:col-span-1">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">Disponibilité</div>
            <div className="text-lg font-black text-indigo-600">99.99%</div>
          </div>
        </div>
      </div>

      {/* SaaS Admin Modern Modules Sub-navigation */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl border flex-wrap gap-1">
        <button
          type="button"
          onClick={() => setSaasMainTab('clients')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer ${saasMainTab === 'clients' ? 'bg-white shadow-xs text-indigo-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'}`}
        >
          <Users className="h-4 w-4" /> 🏢 Instances & Licences
        </button>
        <button
          type="button"
          onClick={() => setSaasMainTab('billing')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer ${saasMainTab === 'billing' ? 'bg-white shadow-xs text-indigo-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'}`}
        >
          <CreditCard className="h-4 w-4" /> 💳 Facturation & Abonnements
        </button>
        <button
          type="button"
          onClick={() => setSaasMainTab('tickets')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer ${saasMainTab === 'tickets' ? 'bg-white shadow-xs text-indigo-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'}`}
        >
          <MessageSquare className="h-4 w-4" /> 💬 Support & Tickets
        </button>
        <button
          type="button"
          onClick={() => setSaasMainTab('maintenance')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer ${saasMainTab === 'maintenance' ? 'bg-white shadow-xs text-indigo-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'}`}
        >
          <Megaphone className="h-4 w-4" /> 📢 Annonces & Maintenance
        </button>
        <button
          type="button"
          onClick={() => setSaasMainTab('telemetry')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer ${saasMainTab === 'telemetry' ? 'bg-white shadow-xs text-indigo-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'}`}
        >
          <Cpu className="h-4 w-4" /> 💻 Télémétrie & Logs
        </button>
      </div>

      {saasMainTab === 'clients' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Clients Table Panel */}
        <div className="lg:col-span-2 bg-white rounded-2xl border shadow-2xs overflow-hidden flex flex-col">
          <div className="p-4 border-b bg-slate-50 flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">Portefeuille des Instances ERP</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Sélectionnez un client ci-dessous pour modifier ses limites, informations contractuelles ou réinitialiser de passe.</p>
            </div>
            <div className="relative max-w-64">
              <Search className="absolute left-2.5 top-2.5 text-slate-400 h-4 w-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher par raison sociale..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="overflow-x-auto grow">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-600 uppercase font-bold border-b text-[10px]">
                <tr>
                  <th className="p-3">Client (Raison Sociale)</th>
                  <th className="p-3">Identifiants SuperAdmin</th>
                  <th className="p-3">Formule / Plan</th>
                  <th className="p-3">Statut Contrat</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y text-slate-700">
                {filteredClients.map((c) => {
                  const isSelected = selectedClientForAudit?.id === c.id;
                  return (
                    <tr 
                      key={c.id} 
                      onClick={() => {
                        setSelectedClientForAudit(c);
                        onSelectClient?.(c);
                      }}
                      className={`hover:bg-slate-50 transition cursor-pointer ${isSelected ? 'bg-indigo-50/70 border-l-4 border-indigo-600' : ''}`}
                    >
                      <td className="p-3">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-black text-slate-900 block text-xs">{c.raisonSociale}</span>
                            <span className="text-[9px] font-mono font-bold bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded">
                              {c.sigle || 'ND'}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            Licence: {c.idLicence} • {c.ville}, {c.pays}
                          </span>
                        </div>
                      </td>
                      <td className="p-3 font-mono text-[11px]">
                        <div>
                          <span className="text-slate-800 font-bold block">{c.superAdminLogin || 'aucun'}</span>
                          <span className="text-zinc-400 text-[10px]">Pass: {c.superAdminPassword || 'aucun'}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <div>
                          <span className="font-bold text-indigo-700 block uppercase text-[10px]">{c.plan}</span>
                          <span className="text-[10px] text-slate-400 block font-semibold">Max : {c.maxUtilisateurs} users • {c.surfaceExploitee} ha</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            c.statut === 'Actif'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : c.statut === 'Suspendu'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : c.statut === 'Démonstration'
                              ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${c.statut === 'Actif' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                          {c.statut}
                        </span>
                      </td>
                      <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-end items-center gap-2">
                          <select
                            value={c.statut}
                            onChange={(e) => {
                              onUpdateClientStatus(c.id, e.target.value as any);
                              setSelectedClientForAudit(prev => prev && prev.id === c.id ? { ...prev, statut: e.target.value as any } : prev);
                            }}
                            className="bg-white border rounded-lg text-[11px] p-1.5 focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                          >
                            <option value="Actif">Actif</option>
                            <option value="Suspendu">Suspendre</option>
                            <option value="Démonstration">Dossier Démo</option>
                            <option value="Essai Gratuit">Essai Gratuit</option>
                            <option value="Résilié">Résilié</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Client Detaille/Audit and Management TAB-SWITCHED Panel */}
        <div className="bg-white rounded-2xl border shadow-2xs overflow-hidden flex flex-col">
          <div className="p-3.5 border-b bg-slate-50 flex flex-col space-y-2">
            <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="h-4 w-4 text-indigo-600" />
              Instance Ciblée ({selectedClientForAudit?.sigle || 'Sélection'})
            </h3>
            
            {/* Tabs Headers */}
            {selectedClientForAudit && (
              <div className="flex bg-slate-200/60 p-1 rounded-lg text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => setActiveDetailTab('audit')}
                  className={`flex-1 py-1.5 rounded-md text-center transition cursor-pointer ${activeDetailTab === 'audit' ? 'bg-white shadow-xs text-indigo-700' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  📊 Synthèse
                </button>
                <button
                  type="button"
                  onClick={() => setActiveDetailTab('edit')}
                  className={`flex-1 py-1.5 rounded-md text-center transition cursor-pointer ${activeDetailTab === 'edit' ? 'bg-white shadow-xs text-indigo-700' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  ✏️ Coordonnées
                </button>
                <button
                  type="button"
                  onClick={() => setActiveDetailTab('users')}
                  className={`flex-1 py-1.5 rounded-md text-center transition cursor-pointer ${activeDetailTab === 'users' ? 'bg-white shadow-xs text-indigo-700' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  👥 Utilisateurs
                </button>
              </div>
            )}
          </div>

          {selectedClientForAudit ? (
            <div className="p-4 flex-1 flex flex-col justify-between overflow-y-auto max-h-[500px]">
              
              {/* TAB 1: SYNTHESE / VOLUMES */}
              {activeDetailTab === 'audit' && (() => {
                const stats = getAuditStats(selectedClientForAudit);
                return (
                  <div className="space-y-4">
                    <div className="bg-slate-900 text-white rounded-xl p-3.5 border border-slate-800">
                      <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Entreprise / Instance active : </span>
                      <h4 className="text-sm font-black text-white mt-1 uppercase">{selectedClientForAudit.raisonSociale}</h4>
                      <p className="text-[11px] text-zinc-300 mt-1 flex items-center justify-between">
                        <span>Formule : <strong>{selectedClientForAudit.plan.toUpperCase()} Plan</strong></span>
                        <span className="bg-indigo-800 px-2 py-0.5 rounded font-mono text-[9px]">Exp: {selectedClientForAudit.dateExpiration}</span>
                      </p>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-[11px] text-amber-800 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold">
                        <Lock className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                        <span>ISOLATION PHYSIQUE DES BASES</span>
                      </div>
                      <p className="text-[10px] leading-relaxed">
                        Chaque client dispose d'une partition PostgreSQL cryptée. Téléchargez sa sauvegarde pour la lui restituer de droit, ou chargez une ancienne sauvegarde pour la restauration complète.
                      </p>
                    </div>

                    {/* Operational Totals (Read-Only) */}
                    <div className="space-y-2 text-xs">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">volumes opérationnels réels</span>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-slate-50 p-2 text-center rounded-lg border">
                          <span className="text-slate-400 block text-[9px] uppercase font-semibold">Fermes</span>
                          <span className="text-sm font-black text-slate-800">{stats.farmsCount}</span>
                        </div>
                        <div className="bg-slate-50 p-2 text-center rounded-lg border">
                          <span className="text-slate-400 block text-[9px] uppercase font-semibold">Parcelles</span>
                          <span className="text-sm font-black text-slate-800">{stats.parcellesCount} ha</span>
                        </div>
                        <div className="bg-slate-50 p-2 text-center rounded-lg border">
                          <span className="text-slate-400 block text-[9px] uppercase font-semibold">Bétail</span>
                          <span className="text-sm font-black text-slate-800">{stats.animalsCount} têtes</span>
                        </div>
                        <div className="bg-slate-50 p-2 text-center rounded-lg border">
                          <span className="text-slate-400 block text-[9px] uppercase font-semibold">Salariés</span>
                          <span className="text-sm font-black text-slate-800">{stats.workersCount} pers.</span>
                        </div>
                        <div className="bg-slate-50 p-2 text-center rounded-lg border col-span-2">
                          <span className="text-slate-400 block text-[9px] uppercase font-semibold">Ventes Estimées</span>
                          <span className="text-sm font-black text-emerald-600">{(stats.invoicedAmount).toLocaleString()} F CFA</span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-4 space-y-2">
                      <button
                        onClick={() => triggerExport(selectedClientForAudit)}
                        className="w-full bg-slate-900 text-white rounded-xl py-2.5 px-4 text-xs font-bold hover:bg-slate-800 transition flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Download className="h-4 w-4 text-emerald-400" />
                        Sauvegarder / Exporter base (.json)
                      </button>
                      <p className="text-[10px] text-center text-slate-400 leading-normal">
                        Restitution conforme aux dispositions d'archivage du SYSCOHADA révisé.
                      </p>
                    </div>
                  </div>
                );
              })()}

              {/* TAB 2: EDIT COORDINATES & PRICING PLAN */}
              {activeDetailTab === 'edit' && (
                <form onSubmit={handleUpdateSelectedClientDetails} className="space-y-3.5 text-xs text-slate-700">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-450 uppercase mb-0.5">Raison Sociale</label>
                      <input
                        name="raisonSociale"
                        type="text"
                        required
                        defaultValue={selectedClientForAudit.raisonSociale}
                        className="w-full p-2 border rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-450 uppercase mb-0.5">Sigle Court</label>
                      <input
                        name="sigle"
                        type="text"
                        defaultValue={selectedClientForAudit.sigle}
                        className="w-full p-2 border rounded-lg text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-450 uppercase mb-0.5">N° Contribuable</label>
                      <input
                        name="numContribuable"
                        type="text"
                        defaultValue={selectedClientForAudit.numContribuable}
                        className="w-full p-2 border rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-450 uppercase mb-0.5">RC N°</label>
                      <input
                        name="regCommerce"
                        type="text"
                        defaultValue={selectedClientForAudit.regCommerce}
                        className="w-full p-2 border rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <h5 className="font-extrabold text-slate-800 uppercase tracking-tight text-[10px] border-b pb-0.5 mt-2">Responsable Direct</h5>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-450 uppercase mb-0.5">Nom</label>
                      <input
                        name="responsableNom"
                        type="text"
                        required
                        defaultValue={selectedClientForAudit.responsableNom}
                        className="w-full p-2 border rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-450 uppercase mb-0.5">Prénom</label>
                      <input
                        name="responsablePrenom"
                        type="text"
                        defaultValue={selectedClientForAudit.responsablePrenom}
                        className="w-full p-2 border rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-450 uppercase mb-0.5">Email de l'instance</label>
                      <input
                        name="responsableEmail"
                        type="email"
                        required
                        defaultValue={selectedClientForAudit.responsableEmail}
                        className="w-full p-2 border rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-450 uppercase mb-0.5">Téléphone</label>
                      <input
                        name="responsableTel"
                        type="text"
                        required
                        defaultValue={selectedClientForAudit.responsableTel}
                        className="w-full p-2 border rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <h5 className="font-extrabold text-slate-800 uppercase tracking-tight text-[10px] border-b pb-0.5 mt-2">Localisation & Licence</h5>
                  <div className="grid grid-cols-3 gap-1.5">
                    <div>
                      <label className="block text-[9px] font-bold text-slate-450 uppercase mb-0.5">Pays</label>
                      <input
                        name="pays"
                        type="text"
                        defaultValue={selectedClientForAudit.pays}
                        className="w-full p-1.5 border rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-450 uppercase mb-0.5">Région</label>
                      <input
                        name="region"
                        type="text"
                        defaultValue={selectedClientForAudit.region}
                        className="w-full p-1.5 border rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-450 uppercase mb-0.5">Ville</label>
                      <input
                        name="ville"
                        type="text"
                        defaultValue={selectedClientForAudit.ville}
                        className="w-full p-1.5 border rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200 mt-2">
                    <div>
                      <label className="block text-[9px] font-bold text-slate-450 uppercase mb-0.5">Plan / Formule</label>
                      <select
                        name="plan"
                        defaultValue={selectedClientForAudit.plan}
                        className="w-full p-1.5 bg-white border rounded-lg text-xs"
                      >
                        <option value="Starter">Starter</option>
                        <option value="Professional">Professional</option>
                        <option value="Enterprise">Enterprise</option>
                        <option value="Cooperative">Coopérative</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-450 uppercase mb-0.5">Max Users</label>
                      <input
                        name="maxUtilisateurs"
                        type="number"
                        defaultValue={selectedClientForAudit.maxUtilisateurs}
                        className="w-full p-1.5 bg-white border rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-450 uppercase mb-0.5">Max Surface (ha)</label>
                      <input
                        name="surfaceExploitee"
                        type="number"
                        defaultValue={selectedClientForAudit.surfaceExploitee}
                        className="w-full p-1.5 bg-white border rounded-lg text-xs"
                      />
                    </div>
                    <div className="col-span-3">
                      <label className="block text-[9px] font-bold text-slate-450 uppercase mb-0.5">Statut du contrat</label>
                      <select
                        name="statut"
                        defaultValue={selectedClientForAudit.statut}
                        className="w-full p-1.5 bg-white border rounded-lg text-xs font-bold text-indigo-700"
                      >
                        <option value="Actif">Actif</option>
                        <option value="Suspendu">Suspendu (Bloqué)</option>
                        <option value="Démonstration">Dossier Démo</option>
                        <option value="Essai Gratuit">Essai Gratuit</option>
                        <option value="Résilié">Résilié</option>
                        <option value="Archivé">Archivé</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs py-2.5 px-4 rounded-xl transition cursor-pointer"
                  >
                    Enregistrer les modifications
                  </button>
                </form>
              )}

              {/* TAB 3: USERS & COLLABORATORS LIST - PASSWORD RESET TOOL */}
              {activeDetailTab === 'users' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Membres rattachés à la licence</span>
                    <span className="text-[10px] font-bold text-indigo-700 font-mono bg-indigo-50 px-2 py-0.5 rounded-full">
                      {getSelectedClientUsers().length} Comptes enregistrés
                    </span>
                  </div>

                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {getSelectedClientUsers().map((u: any, idx: number) => {
                      const isSuperAdmin = u.roleId === 'role-superadmin' || u.id === 'usr-admin-virtuel';
                      return (
                        <div key={idx} className="p-2.5 bg-slate-50 border rounded-xl flex items-center justify-between gap-1.5">
                          <div className="truncate flex-1 max-w-[160px]">
                            <span className="font-extrabold text-[12px] text-slate-800 block truncate">{u.nom}</span>
                            <span className="text-[10px] text-slate-450 block font-mono truncate">{u.email}</span>
                            <span className={`text-[9px] font-bold inline-block px-1.5 py-0.2 rounded mt-0.5 uppercase ${isSuperAdmin ? 'bg-purple-100 text-purple-800' : 'bg-slate-200 text-slate-700'}`}>
                              {isSuperAdmin ? 'Super-Administrateur' : u.roleId?.replace('role-', '') || 'Urgences'}
                            </span>
                          </div>
                          
                          <div className="text-right">
                            {u.mustChangePassword ? (
                              <span className="text-[9px] bg-amber-100 text-amber-850 px-2 py-0.5 rounded-md font-extrabold block mb-1">
                                ⏳ Reset requis
                              </span>
                            ) : (
                              <span className="text-[9px] text-slate-450 block mb-1 font-mono">Prêt ✔</span>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`Voulez-vous réinitialiser le mot de passe de ${u.email} ? Un mot de passe provisoire lui sera alloué.`)) {
                                  handleResetUserPassword(u);
                                }
                              }}
                              className="px-2 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 hover:border-rose-300 font-extrabold text-[9.5px] rounded-lg transition cursor-pointer"
                            >
                              ⚙️ Réinitialiser
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-lg border text-[10px] text-slate-500 leading-normal">
                    💡 La réinitialisation attribue un mot de passe temporaire unique et positionne la variable de redirection sécurisée pour exiger un changement définitif à la prochaine identification.
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-400 italic">
              Sélectionnez un client dans le portefeuille pour afficher ses informations de facturation, modifier ses coordonnées administratives, ou réinitialiser les mots de passe de collaborateurs.
            </div>
          )}
        </div>
      </div>

      {/* Subscription Plans Card Layout in the SaaS Admin */}
      <div className="bg-slate-50 p-5 rounded-2xl border">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-indigo-600" />
              Paramétrage des Formules & Seuils Techniques
            </h3>
            <p className="text-[10.5px] text-slate-450">Définissez les restrictions d'accès, limites d'utilisateurs, dimensions parcelles critiques et tarifs commerciaux.</p>
          </div>
          {editingPlanId && (
            <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-3 py-1 rounded-full animate-pulse">
              Mode édition de formule actif
            </span>
          )}
        </div>

        {/* Editing Plan Parameters Modal Overlay */}
        {editingPlanId && (
          <div className="bg-white p-5 rounded-xl border-2 border-indigo-500 shadow-sm mb-6 animate-in fade-in slide-in-from-top-4 duration-200">
            <h4 className="text-xs font-black uppercase text-indigo-900 border-b pb-2 mb-3">
              Modifier Limitations de la Formule : {planConfigs[editingPlanId].name}
            </h4>

            <form onSubmit={handleSavePlanConfig} className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs text-slate-700">
              <div>
                <label className="block font-bold text-slate-600 mb-1">Tarif Client (F CFA) *</label>
                <input
                  type="number"
                  required
                  value={planEditPrice}
                  onChange={(e) => setPlanEditPrice(Number(e.target.value))}
                  className="w-full p-2 border rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Période de Facturation *</label>
                <select
                  value={planEditPriceUnit}
                  onChange={(e) => setPlanEditPriceUnit(e.target.value)}
                  className="w-full p-2 bg-white border rounded-lg text-xs"
                >
                  <option value="mois">/ mois</option>
                  <option value="an">/ an</option>
                  <option value="forfait">forfait définitif</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Nombre d'utilisateurs max *</label>
                <input
                  type="number"
                  required
                  value={planEditMaxUsers}
                  onChange={(e) => setPlanEditMaxUsers(Number(e.target.value))}
                  className="w-full p-2 border rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Surface max permise (ha) *</label>
                <input
                  type="number"
                  required
                  value={planEditMaxSurface}
                  onChange={(e) => setPlanEditMaxSurface(Number(e.target.value))}
                  className="w-full p-2 border rounded-lg text-xs"
                />
              </div>

              <div className="col-span-1 md:col-span-4 bg-slate-50 p-3 rounded-lg border">
                <span className="font-extrabold text-slate-700 block mb-2 uppercase tracking-wide text-[10px]">Modules actifs inclus</span>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {[
                    { id: 'dashboard', label: '📊 Tableau de Bord' },
                    { id: 'agriculture', label: '🌾 Cultures Végétales' },
                    { id: 'elevage', label: '🐄 Élevage Cheptel' },
                    { id: 'stocks', label: '📦 Stocks Intrants' },
                    { id: 'commercial', label: '🛒 Ventes & Devis' },
                    { id: 'compta', label: '💼 Comptabilité SYSCOHADA' },
                    { id: 'rh', label: '👥 RH & Payes' },
                    { id: 'ged', label: '📂 Archivage GED' },
                    { id: 'parc-materiel', label: '🚜 Parc & Maintenance' },
                    { id: 'bi-reporting', label: '📈 BI & Analytics' },
                  ].map(mod => {
                    const active = planEditModules.includes(mod.id);
                    return (
                      <label key={mod.id} className="flex items-center gap-1.5 cursor-pointer text-[10.5px]">
                        <input
                          type="checkbox"
                          checked={active}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setPlanEditModules(prev => [...prev, mod.id]);
                            } else {
                              setPlanEditModules(prev => prev.filter(m => m !== mod.id));
                            }
                          }}
                          className="rounded text-indigo-600"
                        />
                        <span className={active ? 'font-bold text-indigo-700' : 'text-slate-600'}>{mod.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="col-span-1 md:col-span-4 flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingPlanId(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-[11.5px] font-bold text-slate-700 transition cursor-pointer"
                >
                  Annuler l'édition
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-650 hover:bg-indigo-600 rounded-lg text-[11.5px] font-black text-white transition cursor-pointer"
                >
                  Enregistrer les modifications
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 4 Plans Presentation Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Object.values(planConfigs).map((p) => {
            const isEditing = editingPlanId === p.id;
            return (
              <div 
                key={p.id} 
                className={`bg-white rounded-xl p-4 border transition-all flex flex-col justify-between ${isEditing ? 'border-indigo-600 ring-2 ring-indigo-300' : 'border-slate-200 hover:border-slate-300 shadow-3xs'}`}
              >
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[9px] font-bold tracking-wider text-slate-400 block">Formule officielle</span>
                      <h4 className="text-base font-black text-slate-800 uppercase tracking-tight">{p.name}</h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => startEditingPlan(p.id)}
                      className="p-1.5 bg-slate-50 hover:bg-indigo-50 text-slate-500 hover:text-indigo-600 border rounded-lg transition"
                      title="Configurer les seuils techniques et prix"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="text-base font-extrabold text-slate-900 mt-2.5 font-mono">
                    {p.price.toLocaleString()} FCFA <span className="text-xs text-slate-400 font-normal">/ {p.priceUnit}</span>
                  </div>

                  <ul className="text-[11px] text-slate-600 mt-3 space-y-1.5 border-t pt-2.5">
                    <li className="flex items-center gap-1.5">
                      <span className="text-indigo-600">👥</span> Limite : <strong>{p.maxUsers} utilisateurs</strong> max
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="text-indigo-600">🚜</span> Surface : <strong>{p.maxSurface} ha</strong> max exploitables
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="text-indigo-600">📦</span> Modules inclus : <strong>{p.modules.length} modules</strong>
                    </li>
                  </ul>
                </div>

                <div className="mt-4 pt-2.5 border-t border-dashed">
                  <div className="text-[10px] text-slate-450 truncate">
                    Mod: {p.modules.map(m => m.substring(0, 4)).join(', ')}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
        </div>
      )}

      {/* BILLING & INVOICES TAB */}
      {saasMainTab === 'billing' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-2xs border p-4 text-left">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Total Facturé</span>
              <div className="text-2xl font-black text-slate-800 mt-1">
                {saasInvoices.reduce((acc, inv) => acc + inv.amount, 0).toLocaleString()} <span className="text-xs text-slate-500">FCFA</span>
              </div>
              <span className="text-[9px] text-emerald-600 font-bold block mt-1">✓ Recouvrement à 100%</span>
            </div>
            <div className="bg-white rounded-xl shadow-2xs border p-4 text-left">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Factures Payées</span>
              <div className="text-2xl font-black text-emerald-600 mt-1">
                {saasInvoices.filter(i => i.status === 'Payé').length} / {saasInvoices.length}
              </div>
              <span className="text-[9px] text-slate-500 block mt-1">Paiements mobiles & virement</span>
            </div>
            <div className="bg-white rounded-xl shadow-2xs border p-4 text-left border-indigo-100 bg-indigo-50/10">
              <span className="text-[10px] font-bold text-slate-450 block uppercase">MRR Récurrent Estimé</span>
              <div className="text-2xl font-black text-indigo-750 mt-1">
                {(clients.length * 350000).toLocaleString()} <span className="text-xs text-slate-500">FCFA</span>
              </div>
              <span className="text-[9px] text-indigo-600 font-bold block mt-1">Inspiré des licences actives</span>
            </div>
            <div className="bg-white rounded-xl shadow-2xs border p-4 text-left">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Méthodes Dominantes</span>
              <div className="text-base font-black text-slate-700 mt-2 flex items-center gap-1">
                BEAC & Orange Money
              </div>
              <span className="text-[9px] text-slate-400 block mt-0.5 font-sans">Traitement d'Afrique Centrale</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl border shadow-2xs overflow-hidden flex flex-col">
              <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
                <div className="text-left">
                  <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">Livre d'Enregistrement des Règlements</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Historique des transactions d'abonnements.</p>
                </div>
                <button
                  onClick={() => {
                    setShowAddInvoiceModal(true);
                    if (clients.length > 0) {
                      setNewInvClient(clients[0].raisonSociale);
                    }
                  }}
                  className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-extrabold text-xs items-center gap-1.5 flex cursor-pointer"
                >
                  <span>+</span> Créer un Règlement
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 uppercase font-bold border-b text-[10px]">
                    <tr>
                      <th className="p-3">Réf Facture</th>
                      <th className="p-3">Client</th>
                      <th className="p-3">Formule</th>
                      <th className="p-3">Montant Encaissé</th>
                      <th className="p-3">Date de Réception</th>
                      <th className="p-3">Mode Règlement</th>
                      <th className="p-3">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-slate-700">
                    {saasInvoices.map((inv, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="p-3 font-mono text-[11px] font-bold text-slate-600">{inv.id}</td>
                        <td className="p-3 font-black text-slate-900">{inv.clientName}</td>
                        <td className="p-3">
                          <span className="px-1.5 py-0.5 text-[9px] font-extrabold rounded-md uppercase bg-sky-100 text-sky-800">
                            {inv.plan}
                          </span>
                        </td>
                        <td className="p-3 font-mono font-bold text-slate-800">
                          {inv.amount.toLocaleString()} F CFA
                        </td>
                        <td className="p-3 text-slate-500">{inv.date}</td>
                        <td className="p-3 text-slate-600 font-semibold">{inv.method}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 text-[10px] rounded-full font-bold bg-green-100 text-green-800">
                            {inv.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Pricing limits overview */}
            <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 rounded-2xl p-6 text-white border border-indigo-950 shadow-lg flex flex-col justify-between text-left">
              <div>
                <span className="text-[10px] tracking-wider uppercase opacity-75 font-bold">Règles de Facturation</span>
                <h4 className="text-lg font-black mt-1">Conformité Trésorerie CEMAC</h4>
                <p className="text-xs mt-2 text-indigo-100 leading-relaxed font-sans font-normal">
                  Toutes les transactions sont exprimées en Franc CFA (XAF) pour l'ensemble des pays d'Afrique Centrale (Cameroun, Gabon, Congo, Centrafrique, Tchad, Guinée Équatoriale).
                </p>
                <div className="mt-5 space-y-3.5 pt-4 border-t border-indigo-800/60">
                  <div className="flex justify-between items-center text-xs">
                    <span className="opacity-80">Fréquence de paiement :</span>
                    <span className="font-bold">Annuelle / Mensuelle</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="opacity-80">Rapprochement bancaire :</span>
                    <span className="font-bold">Automatique (Orange/MTN)</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="opacity-80">Période de grâce de facture :</span>
                    <span className="font-bold">14 jours calendrier</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-indigo-800/40 text-[10px] text-indigo-200/85 leading-snug">
                Le changement des configurations de plans s'applique instantanément aux futures instances générées.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUPPORT & TICKETS TAB */}
      {saasMainTab === 'tickets' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tickets List */}
          <div className="lg:col-span-1 bg-white rounded-2xl border shadow-2xs overflow-hidden flex flex-col">
            <div className="p-4 border-b bg-slate-50 text-left">
              <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">Demandes de Support Client</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Tickets de réclamations comptables ou techniques.</p>
            </div>
            <div className="divide-y max-h-[580px] overflow-y-auto">
              {saasTickets.map((t) => {
                const isSelected = selectedTicketId === t.id;
                let badgeColor = "bg-amber-100 text-amber-950";
                if (t.priority === 'Élevée') badgeColor = "bg-rose-100 text-rose-950";
                if (t.priority === 'Basse') badgeColor = "bg-slate-100 text-slate-700";

                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTicketId(t.id)}
                    className={`p-4 transition cursor-pointer text-left ${isSelected ? 'bg-indigo-50/50 border-l-4 border-indigo-600' : 'hover:bg-slate-50/50'}`}
                  >
                    <div className="flex justify-between items-start gap-1">
                      <span className="text-[10px] font-bold font-mono text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">{t.id}</span>
                      <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded uppercase ${badgeColor}`}>
                        {t.priority}
                      </span>
                    </div>
                    <h4 className="font-bold text-xs text-slate-800 mt-2 line-clamp-1">{t.title}</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5 truncate">Client : <strong>{t.clientName}</strong></p>
                    <div className="flex justify-between items-center mt-3 text-[10px] text-slate-450">
                      <span>{t.date}</span>
                      <span className={`px-1.5 py-0.2 rounded font-extrabold text-[9px] uppercase ${t.status === 'Résolu' ? 'bg-emerald-100 text-emerald-800' : t.status === 'En Cours' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'}`}>
                        {t.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Ticket Messages Panel */}
          <div className="lg:col-span-2 bg-white rounded-2xl border shadow-2xs overflow-hidden flex flex-col min-h-[480px]">
            {selectedTicketId ? (() => {
              const ticket = saasTickets.find(t => t.id === selectedTicketId);
              if (!ticket) return null;
              
              const handleSendReply = (e: React.FormEvent) => {
                e.preventDefault();
                if (!ticketReplyText.trim()) return;
                
                const updated = saasTickets.map(t => {
                  if (t.id === selectedTicketId) {
                    return {
                      ...t,
                      status: 'En Cours',
                      chat: [...(t.chat || []), { sender: 'support', msg: ticketReplyText }]
                    };
                  }
                  return t;
                });
                
                setSaasTickets(updated);
                setTicketReplyText('');
              };

              const handleToggleResolved = () => {
                const updated = saasTickets.map(t => {
                  if (t.id === selectedTicketId) {
                    return { ...t, status: t.status === 'Résolu' ? 'En Cours' : 'Résolu' };
                  }
                  return t;
                });
                setSaasTickets(updated);
              };

              return (
                <div className="flex flex-col h-full justify-between text-left">
                  <div className="p-5 border-b bg-slate-50 flex justify-between items-center flex-wrap gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-indigo-600 bg-white border px-2 py-0.5 rounded">{ticket.id}</span>
                        <h3 className="font-black text-slate-800 text-sm">{ticket.title}</h3>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Client : <span className="text-slate-700 font-bold">{ticket.clientName}</span> | Catégorie : <span className="text-slate-700 font-semibold">{ticket.category}</span>
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={handleToggleResolved}
                        type="button"
                        className={`text-xs px-3 py-1.5 font-bold rounded-lg border transition cursor-pointer ${ticket.status === 'Résolu' ? 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100' : 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100'}`}
                      >
                        {ticket.status === 'Résolu' ? 'Rouvrir le Ticket' : '✓ Marquer Résolu'}
                      </button>
                    </div>
                  </div>

                  {/* Problem Description card */}
                  <div className="p-5 bg-amber-50/50 border-b">
                    <h5 className="text-[10px] font-bold text-amber-800 uppercase tracking-widest">Description initiale :</h5>
                    <p className="text-xs text-slate-700 mt-1.5 leading-relaxed font-semibold italic">
                      "{ticket.desc}"
                    </p>
                  </div>

                  {/* Conversation Timeline */}
                  <div className="p-5 space-y-4 overflow-y-auto bg-slate-50/30 grow min-h-[220px]">
                    <span className="text-[9px] text-slate-400 block text-center uppercase tracking-widest">Début de la conversation sécurisée</span>
                    {ticket.chat && ticket.chat.length > 0 ? (
                      ticket.chat.map((msg: any, idx: number) => {
                        const isSupport = msg.sender === 'support';
                        return (
                          <div key={idx} className={`flex ${isSupport ? 'justify-end' : 'justify-start'}`}>
                            <div className={`p-3 max-w-md rounded-2xl text-xs leading-relaxed shadow-3xs ${isSupport ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-100 text-slate-800 rounded-tl-none'}`}>
                              <span className="block text-[8px] font-bold uppercase tracking-wide opacity-80 mb-1">
                                {isSupport ? '🎯 Support Central' : '👨‍💼 Client ERP'}
                              </span>
                              {msg.msg}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-xs text-slate-400 italic text-center py-4">Pas encore d'échanges sur ce ticket. Saisissez une réponse ci-dessous pour initier la conversation.</p>
                    )}
                  </div>

                  {/* Form input reply */}
                  <form onSubmit={handleSendReply} className="p-4 border-t bg-slate-50 flex gap-2.5 items-center">
                    <input
                      type="text"
                      className="grow bg-white border text-xs px-3 py-2.5 rounded-xl text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                      placeholder="Tapez le message de réponse aux équipes du client..."
                      value={ticketReplyText}
                      onChange={(e) => setTicketReplyText(e.target.value)}
                    />
                    <button
                      type="submit"
                      disabled={!ticketReplyText.trim()}
                      className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 disabled:opacity-50 cursor-pointer"
                    >
                      Répondre
                    </button>
                  </form>
                </div>
              );
            })() : (
              <div className="grow flex flex-col items-center justify-center p-8 text-center text-slate-400">
                <MessageSquare className="h-8 w-8 text-slate-300 stroke-[1.5] mb-2" />
                <p className="text-xs italic">Sélectionnez une demande d'assistance à gauche pour visualiser la conversation et formuler une réponse d'ingénierie.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ANNOUNCEMENTS & MAINTENANCE */}
      {saasMainTab === 'maintenance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 bg-white rounded-2xl border p-5 space-y-4 text-left">
              <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider pb-2 border-b">📢 Diffuser une annonce globale</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Titre de l'Alerte *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Interruption serveurs..."
                    value={newAnnTitle}
                    onChange={(e) => setNewAnnTitle(e.target.value)}
                    className="w-full text-xs rounded-lg border p-2 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Catégorie</label>
                  <select
                    value={newAnnCat}
                    onChange={(e) => setNewAnnCat(e.target.value)}
                    className="w-full text-xs rounded-lg border p-2 bg-white"
                  >
                    <option value="Maintenance">Maintenance programmée</option>
                    <option value="Urgent">Alerte d'Urgence</option>
                    <option value="Mise à jour">Lancement Fonctionnalité / v3</option>
                    <option value="Notification">Information générale</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Message exhaustif *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Saisissez le corps du message diffusé aux administrateurs de tous les tenanciers."
                    value={newAnnMsg}
                    onChange={(e) => setNewAnnMsg(e.target.value)}
                    className="w-full text-xs rounded-lg border p-2 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (!newAnnTitle || !newAnnMsg) return;
                    const newAnn = {
                      id: `ANN-${Math.floor(Math.random() * 900) + 100}`,
                      titre: newAnnTitle,
                      message: newAnnMsg,
                      categorie: newAnnCat,
                      date: new Date().toISOString().split('T')[0],
                      isLive: true
                    };
                    setSaasAnnouncements([newAnn, ...saasAnnouncements]);
                    setNewAnnTitle('');
                    setNewAnnMsg('');
                  }}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs transition cursor-pointer"
                >
                  Publier l'Annonce en Direct ✔
                </button>
              </div>
            </div>

            <div className="lg:col-span-2 bg-white rounded-2xl border shadow-2xs overflow-hidden">
              <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
                <div className="text-left">
                  <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">Catalogue des Annonces Actives</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Ces messages s'affichent sur les tableaux de bord de tous vos clients ERP.</p>
                </div>
              </div>

              <div className="divide-y text-xs max-h-[485px] overflow-y-auto">
                {saasAnnouncements.map((ann) => {
                  let badge = "bg-blue-100 text-blue-800";
                  if (ann.categorie === 'Urgent') badge = "bg-rose-100 text-rose-800 font-bold animate-pulse";
                  if (ann.categorie === 'Maintenance') badge = "bg-amber-100 text-amber-800";
                  if (ann.categorie === 'Mise à jour') badge = "bg-purple-100 text-purple-800";

                  return (
                    <div key={ann.id} className="p-5 hover:bg-slate-50/50 transition flex justify-between items-start gap-3">
                      <div className="space-y-1.5 text-left">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold ${badge}`}>{ann.categorie}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{ann.date}</span>
                        </div>
                        <h4 className="font-extrabold text-slate-800 text-xs">{ann.titre}</h4>
                        <p className="text-[11px] text-slate-600 leading-relaxed font-sans font-normal">{ann.message}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSaasAnnouncements(saasAnnouncements.filter(a => a.id !== ann.id));
                        }}
                        className="text-slate-400 hover:text-rose-600 p-1 bg-slate-50 hover:bg-rose-50 rounded-lg border border-slate-200 transition"
                        title="Archiver/Effacer l'annonce"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TELEMETRY & SYSTEM LOGS */}
      {saasMainTab === 'telemetry' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            <div className="bg-white rounded-xl border p-4">
              <h5 className="text-[10px] font-bold text-slate-400 uppercase">Container Node Ingress</h5>
              <div className="text-lg font-black mt-1 text-slate-850 flex items-center gap-2">
                <span className="inline-block h-2.5 w-2.5 bg-emerald-500 rounded-full animate-ping"></span>
                Port 3000 : Activé
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Nginx reverse proxy opérationnel.</p>
            </div>
            
            <div className="bg-white rounded-xl border p-4">
              <h5 className="text-[10px] font-bold text-slate-400 uppercase">Pool de Connexion PostgreSQL</h5>
              <div className="text-xl font-black mt-1 text-slate-850 font-mono">
                {clients.length * 2 + 3} actifs <span className="text-xs text-slate-400 font-sans font-normal">/ 100 max</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Latence moyenne : 12 ms</p>
            </div>

            <div className="bg-white rounded-xl border p-4">
              <h5 className="text-[10px] font-bold text-slate-400 uppercase">Mémoire d'Instance Totale</h5>
              <div className="text-xl font-black mt-1 text-indigo-750 font-mono">
                512 Mo <span className="text-xs text-slate-400 font-sans font-normal">alloués par conteneur</span>
              </div>
              <p className="text-[10px] mt-1 font-semibold text-emerald-600 font-sans">✓ Charge CPU stable (5.4%)</p>
            </div>
          </div>

          <div className="bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-800 flex flex-col font-mono text-left">
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex justify-between items-center flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-red-500"></div>
                <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                <span className="text-xs text-slate-400 font-bold ml-2">Console centrale des Logs SaaS (Live)</span>
              </div>
              <div className="text-[10px] text-slate-500 font-sans">
                Affiche les appels d'API multitenants
              </div>
            </div>

            <div className="p-4 bg-slate-950 max-h-96 overflow-y-auto text-xs text-slate-300 space-y-2 select-text leading-relaxed">
              {logs && logs.length > 0 ? (
                logs.map((log) => {
                  let alertColor = "text-emerald-400 bg-emerald-950/40 text-emerald-300";
                  if (log.statut === 'Échec') {
                    alertColor = "text-rose-450 font-bold bg-rose-955/40 text-rose-300";
                  } else if (log.statut === 'Infos') {
                    alertColor = "text-sky-400 bg-sky-950/40 text-sky-300";
                  }
                  
                  return (
                    <div key={log.id} className="pb-1 border-b border-slate-800/40 last:border-0 hover:bg-slate-850/30">
                      <span className="text-slate-500 pr-2">[{log.date}]</span>
                      <span className={`px-1.5 py-0.5 rounded mr-3 text-[10px] uppercase ${alertColor}`}>
                        {log.statut}
                      </span>
                      <span className="text-slate-400 mr-2 font-bold font-sans">({log.utilisateur || 'Système'})</span>
                      <span className="text-indigo-300 font-semibold mr-2">[{log.module}]</span>
                      <span className="text-slate-100 font-sans">{log.action}</span>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-6 text-slate-500 italic">Aucun log enregistré dans la session en cours.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MANUAL INVOICE CREATION MODAL */}
      {showAddInvoiceModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full border shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-left">
            <div className="bg-indigo-600 text-white p-5 pr-10 relative">
              <h3 className="text-xs font-black uppercase tracking-wider font-sans">Enregistrer un Règlement Manuel</h3>
              <p className="text-[11px] opacity-80 mt-1 font-sans">Tracez un règlement bancaire ou de paiement mobile reçu en direct d'un client.</p>
              <button
                type="button"
                onClick={() => setShowAddInvoiceModal(false)}
                className="absolute top-5 right-5 text-white/80 hover:text-white font-bold cursor-pointer font-sans"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const newInv = {
                  id: `INV-2026-${Math.floor(Math.random() * 900) + 100}`,
                  clientName: newInvClient || (clients[0]?.raisonSociale || 'KISSINE AGRO CO'),
                  plan: newInvPlan,
                  amount: Number(newInvAmount),
                  date: new Date().toISOString().split('T')[0],
                  method: newInvMethod,
                  status: 'Payé'
                };
                setSaasInvoices([newInv, ...saasInvoices]);
                setShowAddInvoiceModal(false);
              }}
              className="p-5 space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Client *</label>
                <select
                  value={newInvClient}
                  onChange={(e) => setNewInvClient(e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white focus:ring-1 focus:ring-indigo-500"
                >
                  {clients.map(c => (
                    <option key={c.id} value={c.raisonSociale}>{c.raisonSociale}</option>
                  ))}
                  {clients.length === 0 && <option value="KISSINE AGRO CO">KISSINE AGRO CO</option>}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Formule choisie</label>
                  <select
                    value={newInvPlan}
                    onChange={(e) => setNewInvPlan(e.target.value)}
                    className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="Starter">Starter</option>
                    <option value="Professional">Professional</option>
                    <option value="Enterprise">Enterprise</option>
                    <option value="Cooperative">Coopérative</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Mode de paiement</label>
                  <select
                    value={newInvMethod}
                    onChange={(e) => setNewInvMethod(e.target.value)}
                    className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="Orange Money">Orange Money</option>
                    <option value="MTN Mobile Money">MTN Mobile Money</option>
                    <option value="Virement BEAC">Virement BEAC</option>
                    <option value="Chèque de Banque">Chèque de Banque</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Montant encaissé (F CFA) *</label>
                <input
                  type="number"
                  required
                  value={newInvAmount}
                  onChange={(e) => setNewInvAmount(e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-300 p-2.5 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddInvoiceModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg cursor-pointer font-sans"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-lg cursor-pointer font-sans"
                >
                  Valider le Règlement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PROVISIONING MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-905 bg-slate-900/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full border shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-indigo-600 text-white p-6 relative">
              <h3 className="text-lg font-bold">Instance Client Provisioning</h3>
              <p className="text-xs opacity-80 mt-1">
                La validation du formulaire crée une nouvelle base PostgreSQL isolée et génère les identifiants pour le Super-Administrateur. Les paramètres de tarification et de limitations techniques saisis dans les configurations ci-dessous seront appliqués à cette nouvelle instance.
              </p>
              <button
                onClick={() => setShowAddModal(false)}
                className="absolute top-6 right-6 text-white/80 hover:text-white font-bold cursor-pointer font-sans"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[500px] overflow-y-auto">
              <h4 className="text-xs font-bold text-slate-800 border-b pb-1.5 uppercase tracking-wide">1. Identité de l'entreprise</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Raison Sociale *</label>
                  <input
                    type="text"
                    required
                    value={raisonSociale}
                    onChange={(e) => setRaisonSociale(e.target.value)}
                    placeholder="Ex: AGRIMED SA"
                    className="w-full text-xs rounded border border-slate-300 p-2 focus:ring-1 focus:ring-indigo-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Sigle Court</label>
                  <input
                    type="text"
                    value={sigle}
                    onChange={(e) => setSigle(e.target.value)}
                    placeholder="Ex: CBS"
                    className="w-full text-xs rounded border border-slate-300 p-2 focus:ring-1 focus:ring-indigo-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">N° de Contribuable</label>
                  <input
                    type="text"
                    value={numContribuable}
                    onChange={(e) => setNumContribuable(e.target.value)}
                    placeholder="Ex: M102910..."
                    className="w-full text-xs rounded border border-slate-300 p-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Registre du Commerce</label>
                  <input
                    type="text"
                    value={regCommerce}
                    onChange={(e) => setRegCommerce(e.target.value)}
                    placeholder="RC/YAU/..."
                    className="w-full text-xs rounded border border-slate-300 p-2"
                  />
                </div>
              </div>

              <h4 className="text-xs font-bold text-slate-800 border-b pb-1.5 pt-2 uppercase tracking-wide">2. Responsable de l'Instance & Coordonnées</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Nom *</label>
                  <input
                    type="text"
                    required
                    value={responsableNom}
                    onChange={(e) => setResponsableNom(e.target.value)}
                    className="w-full text-xs rounded border border-slate-300 p-2 focus:ring-1 focus:ring-indigo-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Prénom</label>
                  <input
                    type="text"
                    value={responsablePrenom}
                    onChange={(e) => setResponsablePrenom(e.target.value)}
                    className="w-full text-xs rounded border border-slate-300 p-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Email de l’admin * (Sera le Login)</label>
                  <input
                    type="email"
                    required
                    value={responsableEmail}
                    onChange={(e) => setResponsableEmail(e.target.value)}
                    placeholder="Ex: admin@agrimed.cm"
                    className="w-full text-xs rounded border border-slate-300 p-2 focus:ring-1 focus:ring-indigo-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Téléphone de l'instance *</label>
                  <input
                    type="text"
                    required
                    value={responsableTel}
                    onChange={(e) => setResponsableTel(e.target.value)}
                    placeholder="+237 ..."
                    className="w-full text-xs rounded border border-slate-300 p-2"
                  />
                </div>
              </div>

              <h4 className="text-xs font-bold text-slate-800 border-b pb-1.5 pt-2 uppercase tracking-wide">3. Pays & Ville de déploiement</h4>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Pays *</label>
                  <input
                    type="text"
                    required
                    value={pays}
                    onChange={(e) => setPays(e.target.value)}
                    className="w-full text-xs rounded border border-slate-300 p-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Région</label>
                  <input
                    type="text"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full text-xs rounded border border-slate-300 p-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Ville *</label>
                  <input
                    type="text"
                    required
                    value={ville}
                    onChange={(e) => setVille(e.target.value)}
                    className="w-full text-xs rounded border border-slate-300 p-2"
                  />
                </div>
              </div>

              <h4 className="text-xs font-bold text-slate-800 border-b pb-1.5 pt-2 uppercase tracking-wide">4. Formule d'abonnement & Paramètres personnalisés</h4>
              <div className="grid grid-cols-3 gap-4 p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                <div>
                  <label className="block text-xs font-bold text-indigo-900 mb-1">Formule Licence</label>
                  <select
                    value={plan}
                    onChange={(e) => setPlan(e.target.value as any)}
                    className="w-full text-xs font-bold rounded border border-slate-300 p-2 bg-white"
                  >
                    <option value="Starter">Starter</option>
                    <option value="Professional">Professional</option>
                    <option value="Enterprise">Enterprise</option>
                    <option value="Cooperative">Coopérative</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Login (Spécifique)</label>
                  <input
                    type="text"
                    value={customLogin}
                    onChange={(e) => setCustomLogin(e.target.value)}
                    placeholder="Auto (Email admin)"
                    className="w-full text-xs rounded border border-slate-300 p-2 outline-hidden bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Mot De Passe (Spécifique)</label>
                  <input
                    type="text"
                    value={customPassword}
                    onChange={(e) => setCustomPassword(e.target.value)}
                    placeholder="Aléatoire sécurisé"
                    className="w-full text-xs rounded border border-slate-300 p-2 outline-hidden bg-white"
                  />
                </div>
                <div className="col-span-3 text-[10px] text-slate-550 leading-relaxed font-semibold">
                  💡 Note : Le prix configuré actuel ({planConfigs[plan]?.price.toLocaleString()} FCFA / {planConfigs[plan]?.priceUnit}) ainsi que les seuils ({planConfigs[plan]?.maxUsers} utilisateurs maximum, {planConfigs[plan]?.maxSurface} ha) seront alloués sans délais.
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-slate-100 text-slate-700 rounded-lg px-4 py-2 text-xs font-medium hover:bg-slate-200 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 text-white rounded-lg px-5 py-2 text-xs font-bold hover:bg-indigo-700 transition cursor-pointer"
                >
                  Démarrer le Provisionnement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
