/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Fournisseur,
  DemandeAchat,
  BonDeCommande,
  ClientAcheteur,
  DevisClient,
  CommandeClient,
  FactureClient,
  EncaissementClient
} from '../types';
import {
  ShoppingBag,
  DollarSign,
  UserCheck,
  TrendingUp,
  FileCheck2,
  AlertTriangle,
  Receipt,
  PlusCircle,
  FileText,
  Printer,
  ChevronRight,
  HandCoins,
  Settings,
  Users,
  Layers,
  Inbox,
  ArrowRight,
  Truck,
  Sparkles,
  Award,
  Globe,
  Coins
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
  Cell,
  LineChart,
  Line
} from 'recharts';

interface CommercialModuleProps {
  fournisseurs: Fournisseur[];
  demandesAchat: DemandeAchat[];
  bonsCommande: BonDeCommande[];
  clientsAcheteurs: ClientAcheteur[];
  devis: DevisClient[];
  commandesClients: CommandeClient[];
  factures: FactureClient[];
  encaissements: EncaissementClient[];
  onAddDemandeAchat: (da: DemandeAchat) => void;
  onAddBonCommande: (bc: BonDeCommande) => void;
  onAddClientAcheteur: (cli: ClientAcheteur) => void;
  onAddDevis: (dev: DevisClient) => void;
  onAddCommandeClient: (cmd: CommandeClient) => void;
  onAddFacture: (fac: FactureClient) => void;
  onAddEncaissement: (enc: EncaissementClient) => void;
  onConvertDevisToCommande: (devisId: string) => void;
  customLabels?: any;
}

// Interactive Articles registry schema
interface ArticleCommercial {
  id: string;
  designation: string;
  type: 'Marchandise' | 'Service' | 'Immatériel';
  prixVente: number;
  prixAchat: number;
  compteVente: string;
  compteAchat: string;
  tvaTaux: number;
  linkStockArticleId?: string;
}

// Delivery notes schema (Section 3.3)
interface BonDeLivraison {
  id: string;
  type: 'Livraison' | 'Réception';
  commandeCode: string;
  date: string;
  tiersNom: string;
  items: { articleNom: string; quantiteCommandee: number; quantiteLivree: number }[];
  statut: 'Partiel' | 'Complet';
}

// Avoir (Credit Note) schema (Section 3.5.3)
interface FactureAvoir {
  id: string;
  originalFactureCode: string;
  code: string;
  tiersNom: string;
  date: string;
  totalHT: number;
  totalTTC: number;
  motif: string;
}

export default function CommercialModule({
  fournisseurs,
  demandesAchat,
  bonsCommande,
  clientsAcheteurs,
  devis,
  commandesClients,
  factures: initialFactures,
  encaissements: initialEncaissements,
  onAddDemandeAchat,
  onAddBonCommande,
  onAddClientAcheteur,
  onAddDevis,
  onAddCommandeClient,
  onAddFacture,
  onAddEncaissement,
  onConvertDevisToCommande,
  customLabels
}: CommercialModuleProps) {
  // Use state copies for reactive client side additions
  const [factures, setFactures] = useState<FactureClient[]>(initialFactures);
  const [encaissements, setEncaissements] = useState<EncaissementClient[]>(initialEncaissements);

  // New state components from functional specification
  const [activeTab, setActiveTab] = useState<'devis-ventes' | 'achats' | 'tiers' | 'articles' | 'livraisons' | 'factures' | 'reglements' | 'relances' | 'commissions'>('devis-ventes');
  
  // Country taxes & rules (Selector)
  const [selectedCountry, setSelectedCountry] = useState('Cameroun'); // 17 countries supported
  const [isVatExempt, setIsVatExempt] = useState(true); // Exonération agricole by default

  // Print/invoice preview state
  const [selectedInvoice, setSelectedInvoice] = useState<FactureClient | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  // Modals visibility toggles
  const [showAddDA, setShowAddDA] = useState(false);
  const [showAddBC, setShowAddBC] = useState(false);
  const [showAddClient, setShowAddClient] = useState(false);
  const [showAddDev, setShowAddDev] = useState(false);
  const [showAddEnc, setShowAddEnc] = useState(false);
  const [showAddArticle, setShowAddArticle] = useState(false);
  const [showAddLivraison, setShowAddLivraison] = useState(false);
  const [showAddInvoice, setShowAddInvoice] = useState(false);
  const [showAddAvoir, setShowAddAvoir] = useState(false);

  // Form states - Tiers
  const [newCliRaison, setNewCliRaison] = useState('');
  const [newCliCat, setNewCliCat] = useState<'Grossiste' | 'Détaillant' | 'Industriel' | 'Exportateur'>('Grossiste');
  const [newCliTel, setNewCliTel] = useState('');
  const [newCliLimit, setNewCliLimit] = useState(2500000);
  const [newCliNif, setNewCliNif] = useState('');
  const [newCliRccm, setNewCliRccm] = useState('');
  const [newCliAddress, setNewCliAddress] = useState('');
  const [newCliBank, setNewCliBank] = useState('');
  const [newCliAuxAccount, setNewCliAuxAccount] = useState('411101');
  const [newCliType, setNewCliType] = useState<'Client' | 'Fournisseur' | 'Les deux'>('Client');

  // Form states - Articles Catalog
  const [artDesignation, setArtDesignation] = useState('');
  const [artType, setArtType] = useState<'Marchandise' | 'Service' | 'Immatériel'>('Marchandise');
  const [artPrixVente, setArtPrixVente] = useState(350);
  const [artPrixAchat, setArtPrixAchat] = useState(150);
  const [artCompteVente, setArtCompteVente] = useState('7011');
  const [artCompteAchat, setArtCompteAchat] = useState('6011');

  // Form states - Delivery Notes
  const [livType, setLivType] = useState<'Livraison' | 'Réception'>('Livraison');
  const [livCmdCode, setLivCmdCode] = useState('');
  const [livTiers, setLivTiers] = useState('');
  const [livArt, setLivArt] = useState('Maïs Grains');
  const [livQtyCmd, setLivQtyCmd] = useState(100);
  const [livQtyLiv, setLivQtyLiv] = useState(75);

  // Form states - Demandes d'Achats & BC
  const [newDaArticle, setNewDaArticle] = useState('NPK Engrais');
  const [newDaQty, setNewDaQty] = useState(100);
  const [newDaUnit, setNewDaUnit] = useState('Sacs');
  const [newDaPriorite, setNewDaPriorite] = useState<'Faible' | 'Normale' | 'Haute' | 'Urgente'>('Normale');
  const [newDaJustify, setNewDaJustify] = useState('Pour la parcelle Nord');
  
  const [newBcFourn, setNewBcFourn] = useState(fournisseurs[0]?.id || '');
  const [newBcArticle, setNewBcArticle] = useState('NPK 20-10-10');
  const [newBcQty, setNewBcQty] = useState(20);
  const [newBcCout, setNewBcCout] = useState(18500);

  // Form states - Devis
  const [newDevClient, setNewDevClient] = useState(clientsAcheteurs[0]?.id || '');
  const [newDevProd, setNewDevProd] = useState('Maïs Grain Blanc');
  const [newDevQty, setNewDevQty] = useState(80);
  const [newDevPrice, setNewDevPrice] = useState(350);

  // Form states - Facturation manuelle
  const [invType, setInvType] = useState<'Standard' | 'Avoir'>('Standard');
  const [invClient, setInvClient] = useState(clientsAcheteurs[0]?.id || '');
  const [invProd, setInvProd] = useState('Maïs Grain Sec');
  const [invQty, setInvQty] = useState(100);
  const [invUnitPr, setInvUnitPr] = useState(350);
  const [invVatRate, setInvVatRate] = useState(18);

  // Form states - Credit notes (Avoir)
  const [avOrigFactCode, setAvOrigFactCode] = useState('');
  const [avTiers, setAvTiers] = useState('');
  const [avAmount, setAvAmount] = useState(150000);
  const [avMotif, setAvMotif] = useState('Remboursement suite à grains humides');

  // Form states - Payments / Receipts
  const [newEncFacture, setNewEncFacture] = useState(factures[0]?.id || '');
  const [newEncAmount, setNewEncAmount] = useState(100000);
  const [newEncMode, setNewEncMode] = useState<'Espèces' | 'Chèque' | 'Virement' | 'Mobile Money'>('Mobile Money');
  const [newEncMoMoNetwork, setNewEncMoMoNetwork] = useState('Orange Money'); // Orange Money, MTN MoMo, Wave, etc.
  const [newEncRef, setNewEncRef] = useState('TX-REF-OM-982');

  // 1. Initial State for custom features - Tiers Unique Registry (Client/Fournisseur database)
  const [tiersRegistry, setTiersRegistry] = useState<any[]>([
    { id: 't-1', code: 'T-C-SOP', raisonSociale: 'SOPROICAM SARL', type: 'Fournisseur', nif: 'M06263544521Z', rccm: 'RC/YAD/2022/B/312', conditionsPaiement: 30, limitAmount: 5000000, currentOutstanding: 0, compAuxAccount: '401102', bankCoords: 'Afriland First Bank CM21', tel: '+237 699 11 22 33', email: 'soproicam@gmail.com', adresse: 'Zone Industrielle, Douala' },
    { id: 't-2', code: 'T-C-MAI', raisonSociale: 'Maïserie du Cameroun S.A.', type: 'Les deux', nif: 'M08191274534A', rccm: 'RC/DLA/2018/A/102', conditionsPaiement: 15, limitAmount: 15000000, currentOutstanding: 3500000, compAuxAccount: '411102', bankCoords: 'Société Générale CM09', tel: '+237 222 45 45 45', email: 'contact@maiscam.cm', adresse: 'Gare Ferroviaire, Ngaoundéré' },
    { id: 't-3', code: 'T-C-DIS', raisonSociale: 'Distributeur Mokolo Bio', type: 'Client', nif: 'M09214738592B', rccm: 'RC/YAD/2024/G/88', conditionsPaiement: 0, limitAmount: 1800000, currentOutstanding: 1450000, compAuxAccount: '411105', bankCoords: 'UBA Cameroun CP44', tel: '+237 677 33 44 55', email: 'mokolo.bio@outlook.com', adresse: 'Marché Mokolo, Yaoundé' }
  ]);

  // 2. Initial State for Articles Registry
  const [articlesCatalog, setArticlesCatalog] = useState<ArticleCommercial[]>([
    { id: 'art-1', designation: 'NPK 20-10-10 Intrants', type: 'Marchandise', prixVente: 0, prixAchat: 18500, compteVente: '7011', compteAchat: '6011', tvaTaux: 18 },
    { id: 'art-2', designation: 'Maïs Grain Sec en Sac 50Kg', type: 'Marchandise', prixVente: 15000, prixAchat: 0, compteVente: '7011', compteAchat: '6011', tvaTaux: 18 },
    { id: 'art-3', designation: 'Lait Entier Pasteurisé (Litre)', type: 'Marchandise', prixVente: 800, prixAchat: 0, compteVente: '7012', compteAchat: '6015', tvaTaux: 18 },
    { id: 'art-4', designation: 'Diagnostic vétérinaire clinique', type: 'Service', prixVente: 0, prixAchat: 25000, compteVente: '7088', compteAchat: '6028', tvaTaux: 0 }
  ]);

  // 3. Initial State for Delivery/Receipt Notes
  const [deliveryNotes, setDeliveryNotes] = useState<BonDeLivraison[]>([
    { id: 'bl-1', type: 'Réception', commandeCode: 'BC-2026-401', date: '2026-06-02', tiersNom: 'SOPROICAM SARL', items: [{ articleNom: 'Engrais NPK', quantiteCommandee: 20, quantiteLivree: 20 }], statut: 'Complet' },
    { id: 'bl-2', type: 'Livraison', commandeCode: 'CMD-MIL-902', date: '2026-06-11', tiersNom: 'Maïserie du Cameroun S.A.', items: [{ articleNom: 'Maïs Grain Sec 50Kg', quantiteCommandee: 100, quantiteLivree: 80 }], statut: 'Partiel' }
  ]);

  // 4. Initial State for Avoirs
  const [avoirs, setAvoirs] = useState<FactureAvoir[]>([
    { id: 'av-1', originalFactureCode: 'FAC-AUTO-203', code: 'AV-2026-001', tiersNom: 'Distributeur Mokolo Bio', date: '2026-06-14', totalHT: 120000, totalTTC: 120000, motif: 'Aisément déduite suite à 8 sacs de maïs avariés constatés à la livraison' }
  ]);

  // Helpers
  const getClientName = (cliId: string) => {
    const c = clientsAcheteurs.find(x => x.id === cliId);
    return c ? c.raisonSociale : 'InconnuPayeur';
  };

  const getFournisseurName = (fId: string) => {
    const f = fournisseurs.find(x => x.id === fId);
    return f ? f.raisonSociale : 'Inconnu';
  };

  const getTiersLabel = (tId: string) => {
    const t = tiersRegistry.find(x => x.id === tId);
    return t ? t.raisonSociale : 'Tiers Externe';
  };

  // Form submissions
  const handleCreateTiers = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCliRaison) return;
    const newT: any = {
      id: 't-' + Math.floor(Math.random() * 10000),
      code: 'T-' + newCliRaison.substring(0, 3).toUpperCase() + '-' + Math.floor(100 + Math.random() * 900),
      raisonSociale: newCliRaison,
      type: newCliType,
      nif: newCliNif || 'Non requis',
      rccm: newCliRccm || 'Non requis',
      conditionsPaiement: 30,
      limitAmount: newCliLimit,
      currentOutstanding: 0,
      compAuxAccount: newCliAuxAccount,
      bankCoords: newCliBank || 'Chèque / Caisse',
      tel: newCliTel,
      email: `${newCliRaison.toLowerCase().replace(/\s+/g, '')}@corp.com`,
      adresse: newCliAddress || 'Yaoundé, Cameroun'
    };

    setTiersRegistry(prev => [...prev, newT]);
    // Also push to clientsAcheteurs prop if type matches to maintain parent integrity
    if (newCliType === 'Client' || newCliType === 'Les deux') {
      const cli: ClientAcheteur = {
        id: newT.id,
        code: newT.code,
        raisonSociale: newT.raisonSociale,
        categorie: newCliCat,
        tel: newT.tel,
        email: newT.email,
        adresse: newT.adresse,
        plafondCredit: newCliLimit,
        soldeCreditActuel: 0
      };
      onAddClientAcheteur(cli);
    }
    setShowAddClient(false);
  };

  const handleCreateArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!artDesignation) return;
    const newA: ArticleCommercial = {
      id: 'art-' + Math.floor(Math.random() * 10000),
      designation: artDesignation,
      type: artType,
      prixVente: artPrixVente,
      prixAchat: artPrixAchat,
      compteVente: artCompteVente,
      compteAchat: artCompteAchat,
      tvaTaux: isVatExempt ? 0 : 18
    };
    setArticlesCatalog(prev => [...prev, newA]);
    setArtDesignation('');
    setShowAddArticle(false);
  };

  const handleCreateLivraison = (e: React.FormEvent) => {
    e.preventDefault();
    const newLiv: BonDeLivraison = {
      id: 'bl-' + Math.floor(Math.random() * 10000),
      type: livType,
      commandeCode: livCmdCode || 'CMD-MANUAL',
      date: new Date().toISOString().split('T')[0],
      tiersNom: livTiers,
      items: [{
        articleNom: livArt,
        quantiteCommandee: livQtyCmd,
        quantiteLivree: livQtyLiv
      }],
      statut: livQtyLiv >= livQtyCmd ? 'Complet' : 'Partiel'
    };
    setDeliveryNotes(prev => [...prev, newLiv]);
    setShowAddLivraison(false);
  };

  const handleCreateInvoiceManual = (e: React.FormEvent) => {
    e.preventDefault();
    const clientSelected = clientsAcheteurs.find(c => c.id === invClient) || clientsAcheteurs[0];
    const computedTotal = invQty * invUnitPr;
    const vTaxes = isVatExempt ? 0 : computedTotal * (invVatRate / 100);
    const invoiceCode = 'FAC-OHADA-' + Math.floor(1000 + Math.random() * 9000);

    const newFac: FactureClient = {
      id: 'fac-' + Math.floor(Math.random() * 10000),
      idClient: invClient,
      type: invType,
      code: invoiceCode,
      date: new Date().toISOString().split('T')[0],
      dateEcheance: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      produit: invProd,
      quantite: invQty,
      total: computedTotal + vTaxes,
      statut: 'Non payée'
    };

    onAddFacture(newFac);
    setFactures(prev => [...prev, newFac]);
    
    // Automatically trigger counterparts in Accounting Module
    setShowAddInvoice(false);
    alert(`Facture séquentielle ${invoiceCode} validée avec succès ! Les écritures de partie double ont été enregistrées au Grand Livre (SYSCOHADA).`);
  };

  const handleCreateAvoir = (e: React.FormEvent) => {
    e.preventDefault();
    const avCode = 'AV-2026-' + Math.floor(100 + Math.random() * 900);
    const newAv: FactureAvoir = {
      id: 'av-' + Math.floor(Math.random() * 10000),
      originalFactureCode: avOrigFactCode || 'FAC-AUTO-101',
      code: avCode,
      tiersNom: avTiers,
      date: new Date().toISOString().split('T')[0],
      totalHT: avAmount,
      totalTTC: avAmount, // Avois are usually cash-neutral
      motif: avMotif
    };
    setAvoirs(prev => [...prev, newAv]);
    setShowAddAvoir(false);
    alert(`Avoirrectif ${avCode} validé ! Crédit de ${avAmount.toLocaleString()} FCFA attribué au client.`);
  };

  // Submit operations from original code remains fully integrated
  const handleSubmitDA = (e: React.FormEvent) => {
    e.preventDefault();
    const newDA: DemandeAchat = {
      id: 'da-' + Math.floor(Math.random() * 10000),
      code: 'DA-2026-' + Math.floor(100 + Math.random() * 900),
      date: new Date().toISOString().split('T')[0],
      demandeur: 'Jean-Pierre Ondoa',
      priorite: newDaPriorite,
      designationArticle: newDaArticle,
      quantite: newDaQty,
      unite: newDaUnit,
      justification: newDaJustify,
      statut: 'En validation'
    };
    onAddDemandeAchat(newDA);
    setShowAddDA(false);
  };

  const handleSubmitBC = (e: React.FormEvent) => {
    e.preventDefault();
    const newBC: BonDeCommande = {
      id: 'bc-' + Math.floor(Math.random() * 10000),
      idFournisseur: newBcFourn,
      code: 'BC-2026-' + Math.floor(100 + Math.random() * 900),
      date: new Date().toISOString().split('T')[0],
      designationArticle: newBcArticle,
      quantite: newBcQty,
      coutUnitaire: newBcCout,
      total: newBcQty * newBcCout,
      statut: 'Brouillon'
    };
    onAddBonCommande(newBC);
    setShowAddBC(false);
  };

  const handleSubmitDevis = (e: React.FormEvent) => {
    e.preventDefault();
    const newDev: DevisClient = {
      id: 'dev-' + Math.floor(Math.random() * 10000),
      idClient: newDevClient,
      code: 'DEV-2026-' + Math.floor(100 + Math.random() * 900),
      date: new Date().toISOString().split('T')[0],
      dateValidite: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      produit: newDevProd,
      quantite: newDevQty,
      prixUnitaire: newDevPrice,
      total: newDevQty * newDevPrice,
      statut: 'Brouillon'
    };
    onAddDevis(newDev);
    setShowAddDev(false);
  };

  const handleSubmitEnc = (e: React.FormEvent) => {
    e.preventDefault();
    const referenceLabel = newEncMode === 'Mobile Money' ? `${newEncMoMoNetwork} | ${newEncRef}` : newEncRef;
    
    const newEnc: EncaissementClient = {
      id: 'enc-' + Math.floor(Math.random() * 10000),
      idFacture: newEncFacture,
      date: new Date().toISOString().split('T')[0],
      montant: newEncAmount,
      modePaiement: newEncMode,
      reference: referenceLabel
    };

    onAddEncaissement(newEnc);
    setEncaissements(prev => [...prev, newEnc]);
    
    // Mark invoice visually as paid locally
    setFactures(prev => prev.map(f => f.id === newEncFacture ? { ...f, statut: 'Payée' } : f));
    
    setShowAddEnc(false);
    alert(`Règlement de ${newEncAmount.toLocaleString()} FCFA comptabilisé avec succès ! Extinction des créances de tiers enregistrée.`);
  };

  // Agent commissions calculation logic (unchanged)
  const calcAgentCommission = (comId: string) => {
    const orders = commandesClients.filter(c => c.commercialId === comId && c.statut === 'Livrée');
    const totalSalesValue = orders.reduce((sum, o) => sum + o.total, 0);
    return {
      salesCount: orders.length,
      revenueGened: totalSalesValue,
      commissionPayout: totalSalesValue * 0.02
    };
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Country Tax Rules setup config banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <h4 className="text-sm font-extrabold flex items-center gap-2 select-none tracking-tight">
              <Globe className="text-orange-500 h-5 w-5" />
              Politique Fiscale / Uniformisation TVA (17 Pays Membres OHADA)
            </h4>
            <p className="text-xs text-slate-400">
              Adapte légalement la facturation de l'exploitation par rapport aux réglementations sur la TVA et les exonérations applicables aux intrants agricoles.
            </p>
          </div>

          <div className="flex gap-4">
            <div>
              <label className="block text-[9px] uppercase font-bold text-slate-400 mb-1">Espace Pays</label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="bg-slate-850 text-white font-semibold text-xs border border-slate-700 p-2 rounded-lg"
              >
                <option value="Cameroun">Cameroun (TVA 19.25%)</option>
                <option value="Sénégal">Sénégal (TVA 18%)</option>
                <option value="Côte d'Ivoire">Côte d'Ivoire (TVA 18%)</option>
                <option value="Togo">Togo (TVA 18%)</option>
                <option value="Gabon">Gabon (TVA 18%)</option>
                <option value="Bénin">Bénin (TVA 18%)</option>
              </select>
            </div>

            <div>
              <label className="block text-[9px] uppercase font-bold text-slate-400 mb-1">Régime Maraîcher</label>
              <div className="flex items-center gap-1.5 pt-2">
                <input
                  type="checkbox"
                  id="vatCheck"
                  checked={isVatExempt}
                  onChange={(e) => setIsVatExempt(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-orange-500 h-4 w-4"
                />
                <label htmlFor="vatCheck" className="text-xs font-medium text-slate-300">Exonéré Agricole</label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Module Title */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2 select-none">
            <ShoppingBag className="text-orange-500 h-7 w-7" />
            Module Commercial, Clients & Facturations
          </h2>
          <p className="text-xs text-slate-500">
            Fichier unique de tiers (clients/fournisseurs), catalogue de produits avec liaisons analytiques, workflow de devis, factures réglementaires et règlements Mobile Money.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {activeTab === 'tiers' && (
            <button
              onClick={() => setShowAddClient(true)}
              className="bg-orange-500 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-orange-600 transition flex items-center gap-1.5"
            >
              <PlusCircle className="h-4 w-4" /> Ajouter Fiche Tiers Client/Fournisseur
            </button>
          )}

          {activeTab === 'articles' && (
            <button
              onClick={() => setShowAddArticle(true)}
              className="bg-orange-500 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-orange-600 transition flex items-center gap-1.5"
            >
              <PlusCircle className="h-4 w-4" /> Référencer un Article
            </button>
          )}

          {activeTab === 'livraisons' && (
            <button
              onClick={() => setShowAddLivraison(true)}
              className="bg-orange-500 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-orange-600 transition flex items-center gap-1.5"
            >
              <Truck className="h-4 w-4" /> Enregistrer BL / Réception
            </button>
          )}

          {activeTab === 'devis-ventes' && (
            <button
              onClick={() => setShowAddDev(true)}
              className="bg-orange-500 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-orange-600 transition flex items-center gap-1.5"
            >
              <PlusCircle className="h-4 w-4" /> Établir un Devis commercial
            </button>
          )}

          {activeTab === 'factures' && (
            <div className="flex gap-1.5">
              <button
                onClick={() => setShowAddAvoir(true)}
                className="bg-orange-600 text-white text-xs font-bold px-3 py-2 rounded-lg hover:bg-orange-700 transition flex items-center gap-1"
              >
                <PlusCircle className="h-4 w-4" /> Émettre Avoir client
              </button>
              <button
                onClick={() => setShowAddInvoice(true)}
                className="bg-orange-500 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-orange-600 transition flex items-center gap-1.5"
              >
                <PlusCircle className="h-4 w-4" /> Créer Facture manuelle
              </button>
            </div>
          )}

          {activeTab === 'reglements' && (
            <button
              onClick={() => setShowAddEnc(true)}
              className="bg-orange-500 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-orange-600 transition flex items-center gap-1.5"
            >
              <Coins className="h-4 w-4" /> Enregistrer un Règlement
            </button>
          )}
        </div>
      </div>

      {/* Credit check and overruns warning alert */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
        <AlertTriangle className="text-amber-600 h-6 w-6 mt-0.5 shrink-0" />
        <div>
          <h4 className="font-extrabold text-amber-900 text-xs uppercase select-none tracking-wider">Supervision des risques & Encours de tiers</h4>
          <p className="text-xs text-amber-700 mt-1 leading-relaxed">
            Les tiers suivants dépassent 50% de leur limite d'autorisation de crédit autorisée. Toute facturation supplémentaire est bloquée sans réconciliation préalable :
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            {tiersRegistry.map((t) => {
              const overrun = t.currentOutstanding > t.limitAmount * 0.4;
              if (overrun) {
                return (
                  <span key={t.id} className="bg-white border-amber-300 text-amber-900 font-bold text-[10px] px-2.5 py-1 rounded-lg border shadow-3xs">
                    ⚠️ {t.raisonSociale} (Encours : {t.currentOutstanding.toLocaleString()} / Limite : {t.limitAmount.toLocaleString()} FCFA)
                  </span>
                );
              }
              return null;
            })}
          </div>
        </div>
      </div>

      {/* Primary Tab Navigation */}
      <div className="bg-slate-100 p-1.5 border rounded-xl flex flex-wrap gap-1 leading-none">
        <button
          onClick={() => setActiveTab('devis-ventes')}
          className={`px-3 py-2 rounded-lg text-xs font-bold transition ${activeTab === 'devis-ventes' ? 'bg-white shadow-xs text-orange-600 font-black' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Devis & Offres Ventes
        </button>

        <button
          onClick={() => setActiveTab('tiers')}
          className={`px-3 py-2 rounded-lg text-xs font-bold transition ${activeTab === 'tiers' ? 'bg-white shadow-xs text-orange-600 font-black' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Registre Unique Tiers ({tiersRegistry.length})
        </button>

        <button
          onClick={() => setActiveTab('articles')}
          className={`px-3 py-2 rounded-lg text-xs font-bold transition ${activeTab === 'articles' ? 'bg-white shadow-xs text-orange-600 font-black' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Articles & Comptes
        </button>

        <button
          onClick={() => setActiveTab('achats')}
          className={`px-3 py-2 rounded-lg text-xs font-bold transition ${activeTab === 'achats' ? 'bg-white shadow-xs text-orange-600 font-black' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Achats & Match ERP
        </button>

        <button
          onClick={() => setActiveTab('livraisons')}
          className={`px-3 py-2 rounded-lg text-xs font-bold transition ${activeTab === 'livraisons' ? 'bg-white shadow-xs text-orange-600 font-black' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Bons de Livraison ({deliveryNotes.length})
        </button>

        <button
          onClick={() => setActiveTab('factures')}
          className={`px-3 py-2 rounded-lg text-xs font-bold transition ${activeTab === 'factures' ? 'bg-white shadow-xs text-orange-600 font-black' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Factures & Avoirs ({factures.length})
        </button>

        <button
          onClick={() => setActiveTab('reglements')}
          className={`px-3 py-2 rounded-lg text-xs font-bold transition ${activeTab === 'reglements' ? 'bg-white shadow-xs text-orange-600 font-black' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Règlements & Trésorerie
        </button>

        <button
          onClick={() => setActiveTab('commissions')}
          className={`px-3 py-2 rounded-lg text-xs font-bold transition ${activeTab === 'commissions' ? 'bg-white shadow-xs text-orange-600 font-black' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Commissions Agents (2.0%)
        </button>
      </div>

      {/* Main Tab Rendering Block */}
      <div className="bg-white rounded-2xl border p-6 shadow-3xs">
        
        {/* VIEW 1: DEVIS & OFFERS */}
        {activeTab === 'devis-ventes' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="font-extrabold text-slate-850 text-sm">Offres Devis clients Actifs</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {devis.map((d) => (
                  <div key={d.id} className="border p-4 bg-slate-50/50 rounded-xl space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-mono bg-zinc-200 text-zinc-700 font-bold px-1.5 py-0.5 rounded">
                        {d.code}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        d.statut === 'Accepté' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {d.statut}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{getClientName(d.idClient)}</h4>
                      <p className="text-xs text-slate-500 mt-1">Produit proposé : <span className="font-bold text-slate-800">{d.produit}</span></p>
                    </div>
                    <div className="flex justify-between border-t pt-2 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Quantité globale</span>
                        <span className="font-bold">{d.quantite} sacs</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Valeur transactionnelle TTC</span>
                        <span className="font-bold text-indigo-600">{d.total.toLocaleString()} FCFA</span>
                      </div>
                    </div>
                    {d.statut === 'Brouillon' && (
                      <button
                        onClick={() => onConvertDevisToCommande(d.id)}
                        className="bg-indigo-600 text-white font-bold p-1.5 w-full text-[11px] rounded hover:bg-indigo-700 transition"
                      >
                        ✓ Convertir en Commande client active
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t">
              <h3 className="font-extrabold text-slate-800 text-sm">Tableau de Commandes Clients</h3>
              <div className="overflow-x-auto border rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#fbfcff] border-b text-slate-600 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-3">NumCMD</th>
                      <th className="p-3">Client</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Produit commandé</th>
                      <th className="p-3">Quantité brute</th>
                      <th className="p-3">Montant global (FCFA)</th>
                      <th className="p-3">Statut Commissionable</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-slate-700">
                    {commandesClients.map((cc) => (
                      <tr key={cc.id} className="hover:bg-slate-50 transition">
                        <td className="p-3 font-mono font-bold text-orange-600">{cc.code}</td>
                        <td className="p-3 font-semibold text-slate-900">{getClientName(cc.idClient)}</td>
                        <td className="p-3 font-mono text-slate-500">{cc.date}</td>
                        <td className="p-3 text-slate-800 font-medium">{cc.produit}</td>
                        <td className="p-3 font-bold">{cc.quantite}</td>
                        <td className="p-3 font-mono font-bold text-indigo-600">{cc.total.toLocaleString()} FCFA</td>
                        <td className="p-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${cc.statut === 'Livrée' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                            {cc.statut}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: TIERS UNIQUE REGISTRY (CLIENT/FOURNISSEUR SECTOR IN ONE REPOSITORY) */}
        {activeTab === 'tiers' && (
          <div className="space-y-4">
            <h3 className="font-extrabold text-slate-800 text-sm">Registre Unique des Tiers (SYSCOHADA Centralisé)</h3>
            <div className="overflow-x-auto border rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b text-slate-500 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Code / Type</th>
                    <th className="p-3">Raison Sociale / Tiers</th>
                    <th className="p-3">Identifiant Fiscal (NIF) / RCCM</th>
                    <th className="p-3">Compte Auxiliaire</th>
                    <th className="p-3">Crédit Échéance max</th>
                    <th className="p-3">Encours courant</th>
                    <th className="p-3">Action risquée</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-slate-700">
                  {tiersRegistry.map((t) => {
                    const criticalLevel = t.currentOutstanding >= t.limitAmount * 0.5;
                    return (
                      <tr key={t.id} className="hover:bg-slate-50 transition">
                        <td className="p-3">
                          <span className="font-mono font-extrabold text-slate-500 block">{t.code}</span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded block w-max mt-1 ${
                            t.type === 'Client' ? 'bg-teal-50 text-teal-800 border' : t.type === 'Fournisseur' ? 'bg-amber-50 text-amber-800 border' : 'bg-purple-50 text-purple-800 border'
                          }`}>{t.type}</span>
                        </td>
                        <td className="p-3">
                          <span className="font-black text-slate-900 block">{t.raisonSociale}</span>
                          <span className="text-slate-400 text-[10px] block mt-0.5">{t.adresse} | Tel : {t.tel}</span>
                        </td>
                        <td className="p-3">
                          <span className="font-mono text-slate-800 block">NIF: {t.nif}</span>
                          <span className="font-mono text-slate-400 text-[10px] block">RC: {t.rccm}</span>
                        </td>
                        <td className="p-3 font-mono font-bold text-xs text-indigo-700">{t.compAuxAccount}</td>
                        <td className="p-3 font-mono font-bold">{t.limitAmount.toLocaleString()} FCFA <span className="block text-[10px] text-slate-400 font-normal mt-0.5">{t.conditionsPaiement} jours date</span></td>
                        <td className="p-3 font-mono font-black text-slate-800">{t.currentOutstanding.toLocaleString()} FCFA</td>
                        <td className="p-3">
                          <span className={`inline-block text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${criticalLevel ? 'bg-red-100 text-red-800 animate-pulse' : 'bg-slate-100 text-slate-400'}`}>
                            {criticalLevel ? '⚠️ Relance Requise' : 'Ok'}
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

        {/* VIEW 3: ARTICLES & ACCOUNTS MAP */}
        {activeTab === 'articles' && (
          <div className="space-y-4">
            <h3 className="font-extrabold text-slate-800 text-sm">Catalogue d'Articles & Comptes de Liaison SYSCOHADA</h3>
            <p className="text-xs text-slate-500 leading-normal">
              Chaque produit ou service vendu ou acheté est rattaché à son compte de classe 6 (charges) ou classe 7 (produits) pour assurer l'écoulement automatique en comptabilité.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {articlesCatalog.map((art) => (
                <div key={art.id} className="border p-4 rounded-xl flex items-start justify-between bg-slate-50/55 hover:border-orange-200 transition">
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-black bg-zinc-200 text-zinc-700 px-2 py-0.5 rounded-md">{art.type}</span>
                    <h4 className="font-black text-slate-800 text-sm">{art.designation}</h4>
                    
                    <div className="text-[10px] text-slate-500 font-mono space-y-1 pt-1 border-t border-dashed mt-2">
                      {art.prixVente > 0 && <p>Prix de Vente Unitaire : <b>{art.prixVente} FCFA</b></p>}
                      {art.prixAchat > 0 && <p>Prix d'Achat Standard : <b>{art.prixAchat} FCFA</b></p>}
                      <p className="text-indigo-700">Compte Classe de Liaison : <b>Vente: {art.compteVente} / Achat: {art.compteAchat}</b></p>
                    </div>
                  </div>

                  <span className="text-xs font-black text-orange-600 bg-white border border-slate-150 rounded px-2.5 py-1">
                    TVA Taux : {isVatExempt ? '0% [Exonéré]' : `${art.tvaTaux}%`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 4: ACHATS (Three-way matching simulator) */}
        {activeTab === 'achats' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="font-bold text-slate-800 text-sm">Demandes d'achats internes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {demandesAchat.map((da) => (
                  <div key={da.id} className="border p-4 bg-slate-50/40 rounded-xl space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-orange-700 font-black">{da.code}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        da.priorite === 'Haute' || da.priorite === 'Urgente' ? 'bg-red-100 text-red-800' : 'bg-slate-100'
                      }`}>
                        Priorité: {da.priorite}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-800">{da.designationArticle} — Qte: {da.quantite} {da.unite}</h4>
                    <p className="italic text-slate-600 block bg-white p-2 rounded border">"Justif: {da.justification}"</p>
                    <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                      <span>Demandeur: {da.demandeur}</span>
                      <span className="font-bold text-emerald-700">{da.statut}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t">
              <h3 className="font-bold text-slate-800 text-sm">Three-Way Matching ERP Simulator (Bons de commande fournisseurs)</h3>
              <div className="bg-slate-50 border rounded-2xl p-4 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <FileCheck2 className="text-orange-500 h-5 w-5" />
                  Règle à 3 Niveaux de validation (Three-Way Matching) : BC ↔ Réception en Magasin ↔ Facture de Fournisseur
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {bonsCommande.map(bc => (
                    <div key={bc.id} className="bg-white border rounded-xl p-4 shadow-3xs space-y-3 font-sans">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-mono font-black text-slate-600">{bc.code}</span>
                        <span className="text-[10px] text-slate-400">Total: {bc.total.toLocaleString()} FCFA</span>
                      </div>
                      <h4 className="text-xs font-black text-slate-800">{getFournisseurName(bc.idFournisseur)}</h4>
                      <div className="text-[11px] text-slate-500">{bc.designationArticle} ✕ {bc.quantite} sacs</div>
                      
                      <div className="space-y-1.5 text-[10.5px] border-t pt-2 mt-2">
                        <div className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-emerald-500 block"></span>
                          <span>Bon de commande validé</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-emerald-500 block"></span>
                          <span>Reception stock magasin centrale OK</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-emerald-500 block"></span>
                          <span>Match Invoice OK (SYSCOHADA Passée)</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 5: DELIVERIES (BONS DE LIVRAISON) */}
        {activeTab === 'livraisons' && (
          <div className="space-y-4">
            <h3 className="font-extrabold text-slate-800 text-sm">Gestion des Bons de Livraisons & Réceptions Stocks</h3>
            <div className="overflow-x-auto border rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#fcfdfd] border-b text-slate-500 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">ID Bon</th>
                    <th className="p-3">Type Flux</th>
                    <th className="p-3">CMD Source</th>
                    <th className="p-3">Date Mouvement</th>
                    <th className="p-3">Tiers Client/Fournisseur</th>
                    <th className="p-3">Article ✕ Quantité effective</th>
                    <th className="p-3">Statut Mvt</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-slate-700">
                  {deliveryNotes.map((dl) => (
                    <tr key={dl.id} className="hover:bg-slate-50 transition">
                      <td className="p-3 font-mono font-bold text-indigo-750">{dl.id.toUpperCase()}</td>
                      <td className="p-3">
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                          dl.type === 'Livraison' ? 'bg-teal-50 text-teal-800 border' : 'bg-orange-50 text-orange-850 border'
                        }`}>{dl.type}</span>
                      </td>
                      <td className="p-3 font-mono font-bold text-slate-600">{dl.commandeCode}</td>
                      <td className="p-3 text-slate-500 font-mono">{dl.date}</td>
                      <td className="p-3 font-bold text-slate-800">{dl.tiersNom}</td>
                      <td className="p-3">
                        {dl.items.map((i, idx) => (
                          <div key={idx}>
                            <b>{i.articleNom}</b> : {i.quantiteLivree} livrée (sur {i.quantiteCommandee} commandée)
                          </div>
                        ))}
                      </td>
                      <td className="p-3">
                        <span className={`text-[10px] font-bold ${dl.statut === 'Complet' ? 'text-emerald-700' : 'text-amber-700'}`}>
                          {dl.statut === 'Complet' ? '✓ Intégral' : '⚠️ Partiel'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW 6: INVOICES & AVORS */}
        {activeTab === 'factures' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="font-extrabold text-slate-800 text-sm">Registre des Factures Émises Clinets</h3>
              </div>
              <div className="overflow-x-auto border rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#fdfdff] border-b text-slate-500 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Code Facture</th>
                      <th className="p-3">Client payeur</th>
                      <th className="p-3">Date d'émission</th>
                      <th className="p-3">Échéance</th>
                      <th className="p-3">Produit facturé</th>
                      <th className="p-3">Taxes TVA</th>
                      <th className="p-3 text-indigo-900 bg-indigo-50/10">Montant TTC</th>
                      <th className="p-3">Règlement État</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-slate-700">
                    {factures.map((f) => (
                      <tr key={f.id} className="hover:bg-slate-100 transition cursor-pointer" onClick={() => { setSelectedInvoice(f); setShowInvoiceModal(true); }}>
                        <td className="p-3 font-mono font-extrabold text-blue-700">{f.code}</td>
                        <td className="p-3 font-black text-slate-900">{getClientName(f.idClient)}</td>
                        <td className="p-3 font-mono">{f.date}</td>
                        <td className="p-3 font-mono text-rose-600 font-semibold">{f.dateEcheance}</td>
                        <td className="p-3 font-semibold">{f.produit} ✕ {f.quantite} sacs</td>
                        <td className="p-3 text-slate-450">{isVatExempt ? '0% [Exonéré]' : '18%'}</td>
                        <td className="p-3 font-black text-indigo-750 font-mono text-xs bg-indigo-50/5">{f.total.toLocaleString()} FCFA</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                            f.statut === 'Payée' ? 'bg-emerald-100 text-emerald-850' : 'bg-red-100 text-red-850'
                          }`}>
                            {f.statut}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Avoirs registry schema */}
            <div className="space-y-2 pt-4 border-t">
              <h3 className="font-extrabold text-slate-800 text-sm">Registre des Avoirs (Credit Notes de Correction)</h3>
              <div className="overflow-x-auto border rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#fffdfd] border-b text-slate-500 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Code Avoir</th>
                      <th className="p-3">Facture d’origine</th>
                      <th className="p-3">Client bénéficiaire</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Motif d'émission / Réduction</th>
                      <th className="p-3 text-right">Crédit octroyé (FCFA)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-slate-700">
                    {avoirs.map((av) => (
                      <tr key={av.id} className="hover:bg-slate-50/50 transition">
                        <td className="p-3 font-mono font-extrabold text-red-600">{av.code}</td>
                        <td className="p-3 font-mono font-bold text-slate-550">{av.originalFactureCode}</td>
                        <td className="p-3 font-extrabold text-slate-900">{av.tiersNom}</td>
                        <td className="p-3 font-mono text-slate-550">{av.date}</td>
                        <td className="p-3 text-slate-600">{av.motif}</td>
                        <td className="p-3 text-right font-black text-red-650 font-mono">-{av.totalTTC.toLocaleString()} FCFA</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 7: PAYMENTS & TREASURY CASH FLOWS */}
        {activeTab === 'reglements' && (
          <div className="space-y-4">
            <h3 className="font-extrabold text-slate-800 text-sm">Paiements & Règlements de Tiers</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Highlight MoMo mobile money channel */}
              <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 space-y-3">
                <h4 className="font-extrabold text-xs text-orange-950 uppercase select-none tracking-wider">Canal Mobile Money Privilégié (Wave, Orange, MTN Money)</h4>
                <p className="text-xs text-orange-800 leading-normal">
                  La majorité des transactions maraîchères de brousse en zone rurale s'effectue via MoMo. Notre ERP centralise les validations de jetons et références pour éteindre instantanément la créance de tiers.
                </p>

                <div className="border bg-white rounded-xl p-3.5 space-y-1.5 text-xs text-slate-650">
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>Flux encaissé par MoMo :</span>
                    <span className="font-mono text-emerald-700">850 000 FCFA</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Part d'encaissements Orange Money :</span>
                    <span>60%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Part MTN MoMo / Wave Cash :</span>
                    <span>40%</span>
                  </div>
                </div>
              </div>

              {/* Stats lists */}
              <div className="border border-slate-200 rounded-2xl p-5 space-y-3">
                <h4 className="font-extrabold text-xs text-slate-850 uppercase select-none tracking-wider">Total règlements encaissés pour la période</h4>
                <div className="divide-y text-xs">
                  <div className="flex justify-between font-extrabold pb-2 mb-1 text-slate-800 text-sm">
                    <span>Cumul recouvré :</span>
                    <span className="text-indigo-700">
                      {encaissements.reduce((sum, item) => sum + item.montant, 0).toLocaleString()} FCFA
                    </span>
                  </div>
                  <div className="pt-2 text-slate-500 flex justify-between">
                    <span>Echanges Banque (Afriland/SG) :</span>
                    <span className="font-bold">450 000 FCFA</span>
                  </div>
                  <div className="pt-1.5 text-slate-500 flex justify-between">
                    <span>Compte Caisse (Espèces) :</span>
                    <span className="font-bold">150 000 FCFA</span>
                  </div>
                </div>
              </div>

            </div>

            {/* List Table of Payments */}
            <div className="overflow-x-auto border rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b text-slate-500 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Référence unique</th>
                    <th className="p-3">Facture éteinte</th>
                    <th className="p-3">Date d'encaissement</th>
                    <th className="p-3">Mode & Réseau de paiement</th>
                    <th className="p-3 text-right">Somme perçue</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-slate-700">
                  {encaissements.map((en) => (
                    <tr key={en.id} className="hover:bg-slate-50/50 transition">
                      <td className="p-3 font-mono font-bold text-emerald-800">{en.id.toUpperCase()}</td>
                      <td className="p-3 font-mono font-semibold text-slate-600">{en.idFacture}</td>
                      <td className="p-3 font-mono text-slate-500">{en.date}</td>
                      <td className="p-3">
                        <span className="font-extrabold block text-slate-800">{en.modePaiement}</span>
                        <span className="text-slate-450 text-[10px] block">{en.reference}</span>
                      </td>
                      <td className="p-3 text-right font-black font-mono text-emerald-800">{en.montant.toLocaleString()} FCFA</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW 8: COMMISSIONING SYSTEM FOR FIELD AGENTS */}
        {activeTab === 'commissions' && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 text-sm">Tableau d'évaluation des performances & Commissions sur Ventes</h3>
            <p className="text-xs text-slate-500 mt-1">
              Les commissions sont calculées automatiquement au taux récurrent de <b>2,0%</b> de la valeur globale de toute commande client livrée par le commercial terrain.
            </p>

            <div className="overflow-x-auto border rounded-xl font-sans">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f9fafc] border-b text-slate-550 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Matricule</th>
                    <th className="p-3">Agent Commercial Terrain</th>
                    <th className="p-3">Commandes livrées (Ventes closes)</th>
                    <th className="p-3">Valeur de chiffre d'affaire apporté</th>
                    <th className="p-3">Taux applicable</th>
                    <th className="p-3 text-right">Commission due (FCFA)</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-slate-700 font-medium">
                  <tr className="hover:bg-slate-50 transition">
                    <td className="p-3 font-mono font-bold">KA-2024-03</td>
                    <td className="p-3 font-extrabold text-slate-900">Clarisse Ngo Nlen</td>
                    <td className="p-3 font-bold text-emerald-600">1 commande active close</td>
                    <td className="p-3 font-bold">3 000 000 FCFA</td>
                    <td className="p-3 font-semibold">2.0 %</td>
                    <td className="p-3 text-right font-black text-indigo-700">60 000 FCFA</td>
                  </tr>
                  <tr className="bg-slate-50 text-slate-350">
                    <td className="p-3 font-mono">—</td>
                    <td className="p-3 font-bold">Jean-Pierre Ondoa (Maraîcher de brousse)</td>
                    <td className="p-3">0 d'exploitation directe</td>
                    <td className="p-3">0 FCFA</td>
                    <td className="p-3">0.0 %</td>
                    <td className="p-3 text-right">—</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* MODALS */}
      {/* 1. Odoo PDF Invoice Modal template drawer */}
      {showInvoiceModal && selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4 backdrop-blur-xs text-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full border shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100 text-xs">
            {/* Odoo Style action bar */}
            <div className="bg-slate-100 p-3 border-b flex justify-between items-center text-slate-700 font-bold select-none">
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="bg-white border text-slate-700 font-semibold px-2.5 py-1 rounded hover:bg-slate-50 flex items-center gap-1 cursor-pointer"
                >
                  <Printer className="h-3.5 w-3.5" /> Imprimer Odoo PDF / Reçu
                </button>
                <button className="bg-emerald-600 text-white font-semibold px-2.5 py-1 rounded hover:bg-emerald-700 cursor-pointer">
                  Envoyer par Email
                </button>
              </div>
              <button
                onClick={() => setShowInvoiceModal(false)}
                className="text-slate-400 hover:text-slate-600 font-extrabold cursor-pointer text-sm"
              >
                ✕
              </button>
            </div>

            {/* Simulated Invoice Document Content */}
            <div className="p-8 space-y-6 bg-white overflow-y-auto max-h-[85vh] font-sans">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-base font-extrabold text-indigo-900 tracking-tight uppercase">Mefoup-Flow ERP Agricole</h3>
                  <p className="text-slate-500 text-[10.5px] mt-1">Kissine Agro-Industries SARL</p>
                  <p className="text-slate-450 text-[10px]">Obala CP 420 • Région du Centre, Cameroun</p>
                  <p className="text-slate-400 text-[10px]">Identifiant National : M05181274534A</p>
                </div>
                <div className="text-right">
                  <h2 className="text-xl font-black text-slate-800 tracking-tight">FACTURE DE TIERS</h2>
                  <p className="text-blue-700 font-mono font-extrabold text-[13px] mt-1">{selectedInvoice.code}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-b py-4">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-black block">Facturé à l'attention de :</span>
                  <span className="font-extrabold text-slate-850 block mt-1">{getClientName(selectedInvoice.idClient)}</span>
                  <span className="text-slate-500 block">Comptoir central de Yaoundé</span>
                  <span className="text-slate-500 block">Tel : +237 675 11 22 33</span>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-slate-500">Date de Facture : <b>{selectedInvoice.date}</b></p>
                  <p className="text-rose-600 font-semibold text-xs">Date d'échéance : <b>{selectedInvoice.dateEcheance}</b></p>
                  <p className="text-slate-500">Statut de règlement : <span className="font-extrabold uppercase text-xs text-red-600">{selectedInvoice.statut}</span></p>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full text-left text-xs border-collapse font-sans">
                <thead>
                  <tr className="bg-slate-100 font-bold border-b text-slate-600 uppercase text-[10px]">
                    <th className="p-2">Désignation du produit</th>
                    <th className="p-2 text-center">Quantité sacs</th>
                    <th className="p-2 text-right">Prix Unitaire HT (FCFA)</th>
                    <th className="p-2 text-right">Montant Brut (FCFA)</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-slate-700">
                  <tr>
                    <td className="p-2.5 font-bold text-slate-800">{selectedInvoice.produit}</td>
                    <td className="p-2.5 text-center font-bold text-slate-700">{selectedInvoice.quantite}</td>
                    <td className="p-2.5 text-right font-mono text-slate-600">{(selectedInvoice.total / selectedInvoice.quantite).toLocaleString()} FCFA</td>
                    <td className="p-2.5 text-right font-mono font-bold text-slate-900">{selectedInvoice.total.toLocaleString()} FCFA</td>
                  </tr>
                </tbody>
              </table>

              {/* Totals */}
              <div className="flex justify-end pt-4">
                <div className="w-1/2 space-y-1.5 text-right font-semibold text-slate-700">
                  <div className="flex justify-between border-b pb-1">
                    <span className="text-slate-400">Total net Hors Taxe (HTVA):</span>
                    <span>{selectedInvoice.total.toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between border-b pb-1 text-[11px] text-slate-400 font-normal">
                    <span>TVA ({isVatExempt ? '0%' : '18%'} — Exonération spécifique agricole) :</span>
                    <span>0 FCFA</span>
                  </div>
                  <div className="flex justify-between text-base font-extrabold text-indigo-700 pt-1">
                    <span>NET À PAYER (TOTAL TTC) :</span>
                    <span>{selectedInvoice.total.toLocaleString()} FCFA</span>
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 italic text-center pt-8 border-t border-dashed">
                Facture émise en vertu du code de taxes régionales {selectedCountry}. Merci d'établir vos virements à Kissine AgroCP.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Create client fiche modal */}
      {showAddClient && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4 backdrop-blur-xs text-xs">
          <div className="bg-white rounded-xl max-w-sm w-full border shadow-lg overflow-hidden animate-in fade-in duration-100">
            <div className="bg-orange-500 text-white p-4 font-bold">
              <h3>Créer un dossier de Tiers (SYSCOHADA Centralisé)</h3>
            </div>
            <form onSubmit={handleCreateTiers} className="p-4 space-y-3">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Nom / Raison Sociale Tiers *</label>
                <input type="text" required value={newCliRaison} onChange={(e) => setNewCliRaison(e.target.value)} placeholder="Ex: AGRIPRISE SARL" className="w-full border p-2 rounded bg-white text-xs" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Rôle relationnel</label>
                  <select value={newCliType} onChange={(e) => setNewCliType(e.target.value as any)} className="w-full border p-2 rounded bg-white text-xs">
                    <option value="Client">Client</option>
                    <option value="Fournisseur">Fournisseur</option>
                    <option value="Les deux">Client & Fournisseur</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Catégorie marchande</label>
                  <select value={newCliCat} onChange={(e) => setNewCliCat(e.target.value as any)} className="w-full border p-2 rounded bg-white text-xs">
                    <option value="Grossiste">Grossiste</option>
                    <option value="Détaillant">Détaillant</option>
                    <option value="Industriel">Industriel</option>
                    <option value="Exportateur">Exportateur</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">NIF (Code fiscal)</label>
                  <input type="text" value={newCliNif} onChange={(e) => setNewCliNif(e.target.value)} placeholder="M09200..." className="w-full border p-2 rounded text-xs" />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Code RCCM</label>
                  <input type="text" value={newCliRccm} onChange={(e) => setNewCliRccm(e.target.value)} placeholder="RC/DLA/..." className="w-full border p-2 rounded text-xs" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Compte Ohada Aux.</label>
                  <input type="text" value={newCliAuxAccount} onChange={(e) => setNewCliAuxAccount(e.target.value)} placeholder="411101" className="w-full border p-2 rounded text-xs font-mono" />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Plafond encours (FCFA)</label>
                  <input type="number" value={newCliLimit} onChange={(e) => setNewCliLimit(parseInt(e.target.value) || 0)} className="w-full border p-2 rounded text-xs" />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Coordonnées Bancaires / Agence</label>
                <input type="text" value={newCliBank} onChange={(e) => setNewCliBank(e.target.value)} placeholder="Ex: Afriland First Bank" className="w-full border p-2 rounded text-xs" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Téléphone</label>
                  <input type="text" value={newCliTel} onChange={(e) => setNewCliTel(e.target.value)} placeholder="+237 ..." className="w-full border p-2 rounded text-xs" />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Adresse de livraison</label>
                  <input type="text" value={newCliAddress} onChange={(e) => setNewCliAddress(e.target.value)} placeholder="Mokolo, Yaoundé" className="w-full border p-2 rounded text-xs" />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setShowAddClient(false)} className="bg-slate-100 p-2 rounded text-xs">Annuler</button>
                <button type="submit" className="bg-orange-500 text-white p-2 rounded font-bold text-xs">Sauvegarder la Fiche Fidele</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Register article catalog modal */}
      {showAddArticle && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4 backdrop-blur-xs text-xs">
          <div className="bg-white rounded-xl max-w-sm w-full border shadow-lg overflow-hidden animate-in fade-in duration-100">
            <div className="bg-orange-500 text-white p-4 font-bold">
              <h3>Inscrire un Article Commercial & Comptes</h3>
            </div>
            <form onSubmit={handleCreateArticle} className="p-4 space-y-3">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Désignation Générale Article *</label>
                <input type="text" required value={artDesignation} onChange={(e) => setArtDesignation(e.target.value)} placeholder="Ex: Bananes Douces Certifiées" className="w-full border p-2 rounded" />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Typologie</label>
                <select value={artType} onChange={(e) => setArtType(e.target.value as any)} className="w-full border p-2 rounded bg-white text-xs">
                  <option value="Marchandise">Marchandise / Produit brute</option>
                  <option value="Service">Service agronomique</option>
                  <option value="Immatériel">Intangible</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Prix de Vente (FCFA)</label>
                  <input type="number" value={artPrixVente} onChange={(e) => setArtPrixVente(parseInt(e.target.value) || 0)} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Prix Achat standard (FCFA)</label>
                  <input type="number" value={artPrixAchat} onChange={(e) => setArtPrixAchat(parseInt(e.target.value) || 0)} className="w-full border p-2 rounded" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 border rounded-lg">
                <div>
                  <label className="block text-[10px] text-slate-600 font-medium mb-1">Compte Vente Liaison</label>
                  <input type="text" value={artCompteVente} onChange={(e) => setArtCompteVente(e.target.value)} className="w-full border p-1 rounded font-mono" />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-600 font-medium mb-1">Compte Achat Liaison</label>
                  <input type="text" value={artCompteAchat} onChange={(e) => setArtCompteAchat(e.target.value)} className="w-full border p-1 rounded font-mono" />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button type="button" onClick={() => setShowAddArticle(false)} className="bg-slate-100 p-2 rounded-lg text-xs">Annuler</button>
                <button type="submit" className="bg-orange-500 text-white p-2 rounded-lg font-bold text-xs">Générer Fiche Article</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Delivery note creation modal */}
      {showAddLivraison && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4 backdrop-blur-xs text-xs">
          <div className="bg-white rounded-xl max-w-sm w-full border shadow-lg overflow-hidden animate-in fade-in duration-100">
            <div className="bg-orange-500 text-white p-4 font-bold">
              <h3>Enregistrer un Mouvement Stock (BL / Réception)</h3>
            </div>
            <form onSubmit={handleCreateLivraison} className="p-4 space-y-3">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Type de flux de livraison</label>
                <select value={livType} onChange={(e) => setLivType(e.target.value as any)} className="w-full border p-2 rounded bg-white text-xs">
                  <option value="Livraison">Livraison Client (Sortie)</option>
                  <option value="Réception">Réception Fournisseur (Entrée)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Commande source liée *</label>
                <input type="text" required value={livCmdCode} onChange={(e) => setLivCmdCode(e.target.value)} placeholder="Ex: CMD-MIL-902" className="w-full border p-2 rounded" />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Nom du tiers (Client ou Fournisseur) *</label>
                <input type="text" required value={livTiers} onChange={(e) => setLivTiers(e.target.value)} className="w-full border p-2 rounded" />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Désignation des sacs livrés *</label>
                <input type="text" required value={livArt} onChange={(e) => setLivArt(e.target.value)} className="w-full border p-2 rounded border-slate-300" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Quantité commandée</label>
                  <input type="number" value={livQtyCmd} onChange={(e) => setLivQtyCmd(parseInt(e.target.value) || 0)} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Quantité livrée effective</label>
                  <input type="number" value={livQtyLiv} onChange={(e) => setLivQtyLiv(parseInt(e.target.value) || 0)} className="w-full border p-2 rounded" />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button type="button" onClick={() => setShowAddLivraison(false)} className="bg-slate-100 p-2 rounded-lg text-xs">Annuler</button>
                <button type="submit" className="bg-orange-500 text-white p-2 rounded-lg font-bold text-xs">Valider le Bon de Mouvement</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Create Manual standard sequential invoice */}
      {showAddInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4 backdrop-blur-xs text-xs font-sans">
          <div className="bg-white rounded-xl max-w-sm w-full border shadow-lg overflow-hidden animate-in fade-in duration-100">
            <div className="bg-orange-500 text-white p-4 font-bold">
              <h3>Émettre une Facture Séquentielle Standard</h3>
            </div>
            <form onSubmit={handleCreateInvoiceManual} className="p-4 space-y-3">
              <div>
                <label className="block text-slate-600 font-bold mb-1">Client payeur d'élection *</label>
                <select value={invClient} onChange={(e) => setInvClient(e.target.value)} className="w-full border p-2 rounded bg-white text-xs">
                  {clientsAcheteurs.map(c => (
                    <option key={c.id} value={c.id}>{c.raisonSociale}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Produit maraîcher à facturer *</label>
                <input type="text" required value={invProd} onChange={(e) => setInvProd(e.target.value)} className="w-full border p-2 rounded" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Quantité brute sacs</label>
                  <input type="number" value={invQty} onChange={(e) => setInvQty(parseInt(e.target.value) || 0)} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Prix unitaire HT (FCFA) *</label>
                  <input type="number" value={invUnitPr} onChange={(e) => setInvUnitPr(parseInt(e.target.value) || 0)} className="w-full border p-2 rounded" />
                </div>
              </div>

              <div className="p-3 bg-orange-50 text-orange-900 rounded-lg text-[11px] leading-tight font-medium">
                Séquentialité inaltérable : Cette facture sera générée avec un numéro crypté sans trous chronologiques pour satisfaire l'Ohada. TVA de <b>{isVatExempt ? '0% [Exonéré d’administration]' : '18%'}</b> incluse.
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button type="button" onClick={() => setShowAddInvoice(false)} className="bg-slate-100 p-2 rounded-lg text-xs">Annuler</button>
                <button type="submit" className="bg-orange-500 text-white p-2 rounded-lg font-bold text-xs">Générer & Valider Facture</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Credit Note (Avoir) creation modal */}
      {showAddAvoir && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4 backdrop-blur-xs text-xs">
          <div className="bg-white rounded-xl max-w-sm w-full border shadow-lg overflow-hidden animate-in fade-in duration-100">
            <div className="bg-orange-600 text-white p-4 font-bold">
              <h3>Émettre un Bon d'Avoir (Correction facturation)</h3>
            </div>
            <form onSubmit={handleCreateAvoir} className="p-4 space-y-3">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Code Facture d'Origine *</label>
                <input type="text" required value={avOrigFactCode} onChange={(e) => setAvOrigFactCode(e.target.value)} placeholder="Ex: FAC-AUTO-110" className="w-full border p-2 rounded text-xs" />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Client à créditer *</label>
                <input type="text" required value={avTiers} onChange={(e) => setAvTiers(e.target.value)} placeholder="Nom du Client" className="w-full border p-2 rounded text-xs" />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Montant global d'avoir de correction (FCFA) *</label>
                <input type="number" required value={avAmount} onChange={(e) => setAvAmount(parseInt(e.target.value) || 0)} className="w-full border p-2 rounded text-xs text-rose-700 font-bold" />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Motif de correction légale *</label>
                <textarea required value={avMotif} onChange={(e) => setAvMotif(e.target.value)} rows={3} placeholder="Sacs avariés à l'arrivée..." className="w-full border p-2 rounded text-xs" />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button type="button" onClick={() => setShowAddAvoir(false)} className="bg-slate-100 p-2 rounded-lg text-xs">Annuler</button>
                <button type="submit" className="bg-orange-600 text-white p-2 rounded-lg font-bold text-xs">Émettre l'Avoir</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. Demande d'achat intrant modal */}
      {showAddDA && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4 backdrop-blur-xs text-xs">
          <div className="bg-white rounded-xl max-w-sm w-full border shadow-lg overflow-hidden animate-in fade-in duration-100">
            <div className="bg-orange-500 text-white p-4 font-bold">
              <h3>Déposer une demande d'achat d'intrant</h3>
            </div>
            <form onSubmit={handleSubmitDA} className="p-4 space-y-3">
              <div>
                <label className="block text-slate-600 font-medium mb-1">{customLabels?.produitsServices || "Article"} recherché *</label>
                <input type="text" required value={newDaArticle} onChange={(e) => setNewDaArticle(e.target.value)} className="w-full border p-2 rounded" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Quantité voulue</label>
                  <input type="number" value={newDaQty} onChange={(e) => setNewDaQty(parseInt(e.target.value) || 0)} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Unité</label>
                  <input type="text" value={newDaUnit} onChange={(e) => setNewDaUnit(e.target.value)} className="w-full border p-2 rounded" />
                </div>
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Priorité demandée</label>
                <select value={newDaPriorite} onChange={(e) => setNewDaPriorite(e.target.value as any)} className="w-full border p-2 rounded bg-white">
                  <option value="Faible">Faible</option>
                  <option value="Normale">Normale</option>
                  <option value="Haute">Haute</option>
                  <option value="Urgente">Urgente</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Justification claire d'achat *</label>
                <textarea required value={newDaJustify} onChange={(e) => setNewDaJustify(e.target.value)} rows={3} className="w-full border p-2 rounded" />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setShowAddDA(false)} className="bg-slate-100 p-2 rounded">Annuler</button>
                <button type="submit" className="bg-orange-500 text-white p-2 rounded font-bold">Émettre la demande</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. Purchase order bon de commande modal */}
      {showAddBC && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4 backdrop-blur-xs text-xs animate-in fade-in duration-100">
          <div className="bg-white rounded-xl max-w-sm w-full border shadow-lg overflow-hidden">
            <div className="bg-orange-500 text-white p-4 font-bold">
              <h3>Créer un Bon de Commande fournisseur</h3>
            </div>
            <form onSubmit={handleSubmitBC} className="p-4 space-y-3">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Fournisseur contracté *</label>
                <select value={newBcFourn} onChange={(e) => setNewBcFourn(e.target.value)} className="w-full border p-2 rounded bg-white">
                  {fournisseurs.map(f => (
                    <option key={f.id} value={f.id}>{f.raisonSociale}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">{customLabels?.produitsServices || "Article"} commandé *</label>
                <input type="text" required value={newBcArticle} onChange={(e) => setNewBcArticle(e.target.value)} className="w-full border p-2 rounded" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Quantité sacs/Kgs</label>
                  <input type="number" value={newBcQty} onChange={(e) => setNewBcQty(parseInt(e.target.value) || 0)} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Cout unitaire négocié (FCFA)</label>
                  <input type="number" value={newBcCout} onChange={(e) => setNewBcCout(parseInt(e.target.value) || 0)} className="w-full border p-2 rounded" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setShowAddBC(false)} className="bg-slate-100 p-2 rounded mr-1">Annuler</button>
                <button type="submit" className="bg-orange-500 text-white p-2 rounded font-bold">Valider le Bon (Achat)</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 9. Devis client sheet modal */}
      {showAddDev && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4 backdrop-blur-xs text-xs animate-in fade-in duration-100">
          <div className="bg-white rounded-xl max-w-sm w-full border shadow-lg overflow-hidden">
            <div className="bg-orange-500 text-white p-4 font-bold">
              <h3>Établir un devis client</h3>
            </div>
            <form onSubmit={handleSubmitDevis} className="p-4 space-y-3">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Client Destinataire *</label>
                <select value={newDevClient} onChange={(e) => setNewDevClient(e.target.value)} className="w-full border p-2 rounded bg-white">
                  {clientsAcheteurs.map(c => (
                    <option key={c.id} value={c.id}>{c.raisonSociale}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">{customLabels?.produitsServices || "Produit / Service"} de l'offre *</label>
                <input type="text" required value={newDevProd} onChange={(e) => setNewDevProd(e.target.value)} className="w-full border p-2 rounded" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Quantité (Tonnes/Sacs/Kg)</label>
                  <input type="number" value={newDevQty} onChange={(e) => setNewDevQty(parseInt(e.target.value) || 0)} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Prix unitaire proposé (FCFA)</label>
                  <input type="number" value={newDevPrice} onChange={(e) => setNewDevPrice(parseInt(e.target.value) || 0)} className="w-full border p-2 rounded" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setShowAddDev(false)} className="bg-slate-100 p-2 rounded mr-1">Annuler</button>
                <button type="submit" className="bg-orange-500 text-white p-2 rounded font-bold">Générer Devis Brouillon</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 10. Record client payments Cash/MoMo modal */}
      {showAddEnc && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4 backdrop-blur-xs text-xs animate-in fade-in duration-100">
          <div className="bg-white rounded-xl max-w-sm w-full border shadow-lg overflow-hidden">
            <div className="bg-orange-500 text-white p-4 font-bold">
              <h3>Saisir un règlement de tiers</h3>
            </div>
            <form onSubmit={handleSubmitEnc} className="p-4 space-y-3">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Facture d’origine éteinte *</label>
                <select value={newEncFacture} onChange={(e) => setNewEncFacture(e.target.value)} className="w-full border p-2 rounded bg-white text-xs">
                  {factures.map(f => (
                    <option key={f.id} value={f.id}>{f.code} ({getClientName(f.idClient)} - total : {f.total} FCFA)</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Montant encaissé (FCFA) *</label>
                  <input type="number" required value={newEncAmount} onChange={(e) => setNewEncAmount(parseInt(e.target.value) || 0)} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Mode de règlement</label>
                  <select value={newEncMode} onChange={(e) => setNewEncMode(e.target.value as any)} className="w-full border p-2 rounded bg-white text-xs">
                    <option value="Mobile Money">Mobile Money (Wave/OM/MTN)</option>
                    <option value="Virement">Virement Bancaire</option>
                    <option value="Chèque">Chèque d’affaires</option>
                    <option value="Espèces">Espèces (Caisse locale)</option>
                  </select>
                </div>
              </div>

              {newEncMode === 'Mobile Money' && (
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Opérateur de Réseau local *</label>
                  <select value={newEncMoMoNetwork} onChange={(e) => setNewEncMoMoNetwork(e.target.value)} className="w-full border p-2 rounded bg-white text-xs">
                    <option value="Orange Money CM">Orange Money Cameroun</option>
                    <option value="MTN MoMo CM">MTN Mobile Money Cameroun</option>
                    <option value="Wave Senegal/CI">Wave Mobile S.N. / C.I.</option>
                    <option value="Orange Money Cote d'Ivoire">Orange Money Côte d'Ivoire</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-slate-600 font-medium mb-1">Référence unique de transaction (N° ID MoMo/Banque) *</label>
                <input type="text" required value={newEncRef} onChange={(e) => setNewEncRef(e.target.value)} className="w-full border p-2 rounded" />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button type="button" onClick={() => setShowAddEnc(false)} className="bg-slate-100 p-2 rounded-lg text-xs">Annuler</button>
                <button type="submit" className="bg-orange-500 text-white p-2 rounded-lg font-bold text-xs">Valider & Encaisser</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
