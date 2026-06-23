/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Magasin,
  Article,
  MouvementStock,
  Equipement,
  MaintenanceOrder,
  FuelLog,
  Recolte,
  Culture,
  ProductionElevage,
  ProduitAgricole,
  LieuDeStockage,
  LotDeStock,
  MouvementDeStockGen,
  TransformationProduit,
  InventairePhysique,
  StockAleas,
  StockVente
} from '../types';
import {
  Package,
  Wrench,
  Fuel,
  ArrowDownLeft,
  ArrowUpRight,
  AlertOctagon,
  LineChart,
  PlusCircle,
  FileText,
  Truck,
  Eye,
  Layers,
  AlertTriangle,
  TrendingUp,
  RotateCw,
  Boxes,
  FileCheck,
  Gauge,
  History,
  Workflow,
  ShieldCheck,
  Scale,
  Percent,
  Trash2,
  Coins
} from 'lucide-react';

interface StocksModuleProps {
  magasins: Magasin[];
  articles: Article[];
  mouvements: MouvementStock[];
  equipements: Equipement[];
  maintenances: MaintenanceOrder[];
  fuelLogs: FuelLog[];
  recoltes?: Recolte[];
  cultures?: Culture[];
  prodElevages?: ProductionElevage[];
  onAddMouvement: (mvt: MouvementStock) => void;
  onAddMaintenance: (maint: MaintenanceOrder) => void;
  onAddFuelLog: (fuel: FuelLog) => void;
  customLabels?: any;
}

export default function StocksModule({
  magasins,
  articles,
  mouvements,
  equipements,
  maintenances,
  fuelLogs,
  recoltes = [],
  cultures = [],
  prodElevages = [],
  onAddMouvement,
  onAddMaintenance,
  onAddFuelLog,
  customLabels
}: StocksModuleProps) {
  const [activeTab, setActiveTab] = useState<'magasins' | 'enregistrer-mvt' | 'equipements' | 'maintenance' | 'carburant' | 'bio-stocks'>('bio-stocks');

  // Modal control state
  const [showAddMvt, setShowAddMvt] = useState(false);
  const [showAddMaint, setShowAddMaint] = useState(false);
  const [showAddFuel, setShowAddFuel] = useState(false);

  // New stock entry states
  const [newMvtMag, setNewMvtMag] = useState(magasins[0]?.id || '');
  const [newMvtArt, setNewMvtArt] = useState(articles[0]?.id || '');
  const [newMvtType, setNewMvtType] = useState<'Entrée' | 'Sortie'>('Entrée');
  const [newMvtQty, setNewMvtQty] = useState(1);
  const [newMvtMotif, setNewMvtMotif] = useState<'Achat' | 'Consommation Agricole' | 'Consommation Élevage' | 'Vente' | 'Perte'>('Achat');
  const [newMvtCout, setNewMvtCout] = useState(15000);
  const [newMvtResp, setNewMvtResp] = useState('Paul Atangana');

  const [newMaintEq, setNewMaintEq] = useState(equipements[0]?.id || '');
  const [newMaintType, setNewMaintType] = useState<'Préventive' | 'Corrective'>('Préventive');
  const [newMaintTech, setNewMaintTech] = useState('Charles Atangana (Mécano Pro)');
  const [newMaintDesc, setNewMaintDesc] = useState('Remplacement injecteurs et filtres');
  const [newMaintCost, setNewMaintCost] = useState(75000);

  const [newFuelEq, setNewFuelEq] = useState(equipements[0]?.id || '');
  const [newFuelQty, setNewFuelQty] = useState(50);
  const [newFuelCost, setNewFuelCost] = useState(42000);
  const [newFuelChauff, setNewFuelChauff] = useState('Etoa Sébastien');

  // ==========================================
  // UNIFIED BIO-STOCKS CORE STATES & MOCK DATA
  // ==========================================

  const [produitsAgricoles, setProduitsAgricoles] = useState<ProduitAgricole[]>([
    { id: 'pa-1', nom: 'Maïs Grain Séché', categorie: 'Végétal Brut', uniteReference: 'Kg', dureeConservationMax: 180, prixReferenceMarche: 350 },
    { id: 'pa-2', nom: 'Banane Plantain Mûre', categorie: 'Végétal Brut', uniteReference: 'Sacs', dureeConservationMax: 15, prixReferenceMarche: 4500 },
    { id: 'pa-3', nom: 'Lait Cru de Vache', categorie: 'Animal Continu', uniteReference: 'Litres', dureeConservationMax: 3, prixReferenceMarche: 650 },
    { id: 'pa-4', nom: 'Œufs Frais Calibre L', categorie: 'Animal Continu', uniteReference: 'Douzaines', dureeConservationMax: 28, prixReferenceMarche: 1100 },
    { id: 'pa-5', nom: 'Cacao Fèves Séchées', categorie: 'Végétal Brut', uniteReference: 'Kg', dureeConservationMax: 360, prixReferenceMarche: 2200 },
    { id: 'pa-6', nom: 'Fromage Affiné Mbalmayo', categorie: 'Transformé', uniteReference: 'Kg', dureeConservationMax: 90, prixReferenceMarche: 5500 },
    { id: 'pa-7', nom: 'Aliment Volaille Croissance', categorie: 'Transformé', uniteReference: 'Sacs', dureeConservationMax: 120, prixReferenceMarche: 18000 }
  ]);

  const [lieuxDeStockage, setLieuxDeStockage] = useState<LieuDeStockage[]>([
    { id: 'ls-1', nom: 'Silo Métallique A', type: 'Silo', capaciteMax: 20000, conditions: 'Ventilé à humidité contrôlée stable' },
    { id: 'ls-2', nom: 'Tank Réfrigéré Tank-3', type: 'Tank à Lait', capaciteMax: 1500, conditions: 'Température constante 4°C, Agitation' },
    { id: 'ls-3', nom: 'Chambre Froide Positive 1', type: 'Chambre Froide', capaciteMax: 5000, conditions: 'Température 3°C - 5°C, Hygrométrie 85%' },
    { id: 'ls-4', nom: 'Hangar Central Sacs', type: 'Hangar', capaciteMax: 10000, conditions: 'Sur palettes, aération naturelle' }
  ]);

  const [lotsDeStock, setLotsDeStock] = useState<LotDeStock[]>([
    { id: 'lot-101', idProduit: 'pa-1', idLieuStockage: 'ls-1', dateEntree: '2026-06-10', quantiteInitiale: 12000, quantiteDisponible: 8500, origineType: 'Récolte', qualiteEntree: 'Premium', statut: 'Disponible', dateLimiteDegradation: '2026-12-07', coutProductionUnitaire: 210 },
    { id: 'lot-102', idProduit: 'pa-3', idLieuStockage: 'ls-2', dateEntree: '2026-06-20', quantiteInitiale: 450, quantiteDisponible: 320, origineType: 'ProductionContinue', qualiteEntree: 'Premium', statut: 'Disponible', dateLimiteDegradation: '2026-06-23', coutProductionUnitaire: 420 },
    { id: 'lot-103', idProduit: 'pa-2', idLieuStockage: 'ls-4', dateEntree: '2026-06-18', quantiteInitiale: 180, quantiteDisponible: 120, origineType: 'Récolte', qualiteEntree: 'Standard', statut: 'Disponible', dateLimiteDegradation: '2026-07-03', coutProductionUnitaire: 3000 },
    { id: 'lot-104', idProduit: 'pa-4', idLieuStockage: 'ls-3', dateEntree: '2026-06-19', quantiteInitiale: 150, quantiteDisponible: 150, origineType: 'ProductionContinue', qualiteEntree: 'Premium', statut: 'Disponible', dateLimiteDegradation: '2026-07-17', coutProductionUnitaire: 750 },
    { id: 'lot-105', idProduit: 'pa-2', idLieuStockage: 'ls-3', dateEntree: '2026-06-20', quantiteInitiale: 80, quantiteDisponible: 80, origineType: 'Récolte', qualiteEntree: 'Rejet', statut: 'Bloqué', dateLimiteDegradation: '2026-07-05', coutProductionUnitaire: 2800 }
  ]);

  const [mouvementsDeStockGen, setMouvementsDeStockGen] = useState<MouvementDeStockGen[]>([
    { id: 'mvtg-001', idLotStock: 'lot-101', date: '2026-06-10', typeMouvement: 'entrée', quantite: 12000, quantiteApresMouvement: 12000, operateur: 'Jean-Pierre Ondoa' },
    { id: 'mvtg-002', idLotStock: 'lot-101', date: '2026-06-15', typeMouvement: 'sortie_vente', quantite: -3500, quantiteApresMouvement: 8500, referenceLiee: 'vte-1001', operateur: 'Paul Atangana' },
    { id: 'mvtg-003', idLotStock: 'lot-102', date: '2026-06-20', typeMouvement: 'entrée', quantite: 450, quantiteApresMouvement: 450, operateur: 'Marie Ngo' },
    { id: 'mvtg-004', idLotStock: 'lot-102', date: '2026-06-21', typeMouvement: 'transformation', quantite: -130, quantiteApresMouvement: 320, referenceLiee: 'trf-2001', operateur: 'Marie Ngo' },
    { id: 'mvtg-005', idLotStock: 'lot-103', date: '2026-06-18', typeMouvement: 'entrée', quantite: 180, quantiteApresMouvement: 180, operateur: 'Jean-Pierre Ondoa' },
    { id: 'mvtg-006', idLotStock: 'lot-103', date: '2026-06-19', typeMouvement: 'sortie_vente', quantite: -60, quantiteApresMouvement: 120, referenceLiee: 'vte-1002', operateur: 'Paul Atangana' },
    { id: 'mvtg-007', idLotStock: 'lot-104', date: '2026-06-19', typeMouvement: 'entrée', quantite: 150, quantiteApresMouvement: 150, operateur: 'Roger Kemjou' },
    { id: 'mvtg-008', idLotStock: 'lot-105', date: '2026-06-20', typeMouvement: 'entrée', quantite: 80, quantiteApresMouvement: 80, operateur: 'Jean-Pierre Ondoa' }
  ]);

  const [transformationsProduit, setTransformationsProduit] = useState<TransformationProduit[]>([
    { id: 'trf-2001', date: '2026-06-21', lotsConsommes: [{ idLotStock: 'lot-102', quantiteConsommee: 130 }], idLotProduitCree: 'lot-106', coutTransformation: 15000, tauxRendement: 0.15, operateur: 'Marie Ngo' }
  ]);

  const [stockAleas, setStockAleas] = useState<StockAleas[]>([
    { id: 'alea-501', idLotStock: 'lot-101', date: '2026-06-12', type: 'Nuisibles', quantitePerdue: 150, valeurPerdue: 31500, observation: 'Sac endommagé par les rongeurs' }
  ]);

  const [stockVentes, setStockVentes] = useState<StockVente[]>([
    { id: 'vte-1001', idLotStock: 'lot-101', quantiteVendue: 3500, prixVenteUnitaire: 330, montantTotal: 1155000, canalVente: 'Grossiste Régional', acheteur: 'Ets Fokou', date: '2026-06-15' },
    { id: 'vte-1002', idLotStock: 'lot-103', quantiteVendue: 60, prixVenteUnitaire: 4500, montantTotal: 270000, canalVente: 'Boutique locale', acheteur: 'Chez Mama Philo', date: '2026-06-19' }
  ]);

  const [inventairesPhysiques, setInventairesPhysiques] = useState<InventairePhysique[]>([]);

  // Form active modals for Bio-Stocks
  const [showAddBioProd, setShowAddBioProd] = useState(false);
  const [showAddBioLieu, setShowAddBioLieu] = useState(false);
  const [showAddBioLot, setShowAddBioLot] = useState(false);
  const [showAddBioVente, setShowAddBioVente] = useState(false);
  const [showAddBioAlea, setShowAddBioAlea] = useState(false);
  const [showAddBioTrans, setShowAddBioTrans] = useState(false);
  const [showAddBioAudit, setShowAddBioAudit] = useState(false);

  // New Bio Prod Form inputs
  const [newBioProdNom, setNewBioProdNom] = useState('');
  const [newBioProdCat, setNewBioProdCat] = useState<'Végétal Brut' | 'Animal Continu' | 'Transformé'>('Végétal Brut');
  const [newBioProdUnit, setNewBioProdUnit] = useState<'Kg' | 'Litres' | 'Tonnes' | 'Caisses' | 'Sacs' | 'Douzaines' | 'Unités'>('Kg');
  const [newBioProdConsMax, setNewBioProdConsMax] = useState(30);
  const [newBioProdPrixMar, setNewBioProdPrixMar] = useState(1000);

  // New Bio Lieu Form inputs
  const [newBioLieuNom, setNewBioLieuNom] = useState('');
  const [newBioLieuType, setNewBioLieuType] = useState<'Silo' | 'Chambre Froide' | 'Tank à Lait' | 'Entrepôt' | 'Hangar'>('Entrepôt');
  const [newBioLieuCap, setNewBioLieuCap] = useState(1000);
  const [newBioLieuCond, setNewBioLieuCond] = useState('Standard ventilé');

  // New Bio Lot Entry Form inputs
  const [newBioLotProd, setNewBioLotProd] = useState('');
  const [newBioLotLieu, setNewBioLotLieu] = useState('');
  const [newBioLotOrigine, setNewBioLotOrigine] = useState<'Récolte' | 'ProductionContinue' | 'Achat'>('Achat');
  const [newBioLotOrigineId, setNewBioLotOrigineId] = useState('');
  const [newBioLotQty, setNewBioLotQty] = useState(100);
  const [newBioLotQual, setNewBioLotQual] = useState('Premium');
  const [newBioLotCoutProd, setNewBioLotCoutProd] = useState(150);
  const [newBioLotOperator, setNewBioLotOperator] = useState('Jean-Pierre Ondoa');

  // New Bio Vente Form inputs
  const [newBioVenteLot, setNewBioVenteLot] = useState('');
  const [newBioVenteMethod, setNewBioVenteMethod] = useState<'FIFO' | 'Manuel'>('FIFO');
  const [newBioVenteProdId, setNewBioVenteProdId] = useState(''); // for FIFO
  const [newBioVenteQty, setNewBioVenteQty] = useState(10);
  const [newBioVentePrixUnit, setNewBioVentePrixUnit] = useState(500);
  const [newBioVenteCanal, setNewBioVenteCanal] = useState('Marché Local');
  const [newBioVenteAcheteur, setNewBioVenteAcheteur] = useState('Marché Obala');

  // New Bio Aléas Form inputs
  const [newBioAleaLot, setNewBioAleaLot] = useState('');
  const [newBioAleaType, setNewBioAleaType] = useState<'Péremption' | 'Dégradation' | 'Vol' | 'Nuisibles' | 'Froid Rompu' | 'Casse'>('Dégradation');
  const [newBioAleaQty, setNewBioAleaQty] = useState(10);
  const [newBioAleaObs, setNewBioAleaObs] = useState('');

  // New Bio Transformation Form inputs
  const [newBioTransLotInput, setNewBioTransLotInput] = useState('');
  const [newBioTransQtyInput, setNewBioTransQtyInput] = useState(10);
  const [newBioTransProdOutput, setNewBioTransProdOutput] = useState('');
  const [newBioTransQtyOutput, setNewBioTransQtyOutput] = useState(1);
  const [newBioTransLieuOutput, setNewBioTransLieuOutput] = useState('');
  const [newBioTransCoutExtra, setNewBioTransCoutExtra] = useState(5000);

  // New Bio Audit Form inputs
  const [newBioAuditLieu, setNewBioAuditLieu] = useState('');
  // We'll map lot ID -> counted quantity dynamically
  const [auditQuantities, setAuditQuantities] = useState<Record<string, number>>({});

  // Error/Success state notification banners
  const [bioError, setBioError] = useState<string | null>(null);
  const [bioSuccess, setBioSuccess] = useState<string | null>(null);

  // Auto trigger defaults on click or open
  React.useEffect(() => {
    if (produitsAgricoles.length > 0 && !newBioLotProd) setNewBioLotProd(produitsAgricoles[0].id);
    if (lieuxDeStockage.length > 0 && !newBioLotLieu) setNewBioLotLieu(lieuxDeStockage[0].id);
  }, [produitsAgricoles, lieuxDeStockage]);

  // Handle addition of a product
  const handleAddBioProdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBioProdNom.trim()) {
      setBioError("Le nom du produit est requis.");
      return;
    }
    const newProd: ProduitAgricole = {
      id: 'pa-' + Math.floor(Math.random() * 10000),
      nom: newBioProdNom,
      categorie: newBioProdCat,
      uniteReference: newBioProdUnit,
      dureeConservationMax: newBioProdConsMax,
      prixReferenceMarche: newBioProdPrixMar
    };
    setProduitsAgricoles([...produitsAgricoles, newProd]);
    setNewBioProdNom('');
    setShowAddBioProd(false);
    setBioSuccess(`Produit "${newProd.nom}" ajouté avec succès !`);
    setTimeout(() => setBioSuccess(null), 4000);
  };

  // Handle addition of storage place
  const handleAddBioLieuSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBioLieuNom.trim()) {
      setBioError("Le nom de l'emplacement est requis.");
      return;
    }
    const newLieu: LieuDeStockage = {
      id: 'ls-' + Math.floor(Math.random() * 10000),
      nom: newBioLieuNom,
      type: newBioLieuType,
      capaciteMax: newBioLieuCap,
      conditions: newBioLieuCond
    };
    setLieuxDeStockage([...lieuxDeStockage, newLieu]);
    setNewBioLieuNom('');
    setShowAddBioLieu(false);
    setBioSuccess(`Lieu de stockage "${newLieu.nom}" créé avec succès !`);
    setTimeout(() => setBioSuccess(null), 4000);
  };

  // Create Lot Entry (Récolte / Production / Achat) with capacity checks (Règle 5)
  const handleAddBioLotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prod = produitsAgricoles.find(p => p.id === newBioLotProd);
    const lieu = lieuxDeStockage.find(l => l.id === newBioLotLieu);
    if (!prod || !lieu) {
      setBioError("Produit ou Lieu non concordants.");
      return;
    }

    // Capacity checking (Règle 5)
    const existingLotsInLieu = lotsDeStock.filter(l => l.idLieuStockage === lieu.id);
    const totalCurrentQty = existingLotsInLieu.reduce((acc, l) => acc + l.quantiteDisponible, 0);
    if (totalCurrentQty + newBioLotQty > lieu.capaciteMax) {
      const confirmForce = window.confirm(
        `⚠️ Alerte Capacité : Le lieu de stockage "${lieu.nom}" va dépasser sa capacité max ! \n` +
        `Capacité Max : ${lieu.capaciteMax} | Quantité existante : ${totalCurrentQty} | Nouvelle entrée : ${newBioLotQty}.\n` +
        `Souhaitez-vous forcer le stockage ?`
      );
      if (!confirmForce) return;
    }

    // Compute limit date (Règle 4)
    const entryDate = new Date();
    const entryDateStr = entryDate.toISOString().split('T')[0];
    const expDate = new Date();
    expDate.setDate(expDate.getDate() + prod.dureeConservationMax);
    const expDateStr = expDate.toISOString().split('T')[0];

    // Determine lock status based on DAR criteria or manually if selected (Règle 3)
    let initialStatus: 'Disponible' | 'Bloqué' = 'Disponible';
    if (newBioLotOrigine === 'Récolte' && newBioLotOrigineId) {
      // Find matching crop cycle and check if actively sprayed or under DAR
      const chosenRecolte = recoltes.find(r => r.id === newBioLotOrigineId);
      if (chosenRecolte) {
        // Find if culture under active DAR
        const activeInterventionsOfThisCulture = (cultures && cultures.length > 0)
          ? recoltes.find(r => r.id === newBioLotOrigineId)?.idCulture
          : null;
        // If the harvest note itself or manual status says suspect residues, let's block it
        if (chosenRecolte.statutSanitaire === '⚠️ Résidus Suspects') {
          initialStatus = 'Bloqué';
        }
      }
    }

    const newLotId = 'lot-' + Math.floor(Math.random() * 10000);
    const newLot: LotDeStock = {
      id: newLotId,
      idProduit: prod.id,
      idLieuStockage: lieu.id,
      dateEntree: entryDateStr,
      quantiteInitiale: newBioLotQty,
      quantiteDisponible: newBioLotQty,
      origineType: newBioLotOrigine,
      origineId: newBioLotOrigineId || undefined,
      qualiteEntree: newBioLotQual,
      statut: initialStatus,
      dateLimiteDegradation: expDateStr,
      coutProductionUnitaire: newBioLotCoutProd
    };

    const newMvt: MouvementDeStockGen = {
      id: 'mvtg-' + Math.floor(Math.random() * 10000),
      idLotStock: newLotId,
      date: entryDateStr,
      typeMouvement: 'entrée',
      quantite: newBioLotQty,
      quantiteApresMouvement: newBioLotQty,
      operateur: newBioLotOperator
    };

    setLotsDeStock([newLot, ...lotsDeStock]);
    setMouvementsDeStockGen([newMvt, ...mouvementsDeStockGen]);
    setShowAddBioLot(false);
    setBioSuccess(`Nouveau lot "${newLot.id}" entré avec succès (${initialStatus === 'Bloqué' ? '⚠️ BLOQUÉ POUR SÉCURITÉ DAR' : 'Certifié Sain/Disponible'}).`);
    setTimeout(() => setBioSuccess(null), 5000);
  };

  // Perform Sale Depletion (FIFO or Manual Selection - Règle 1, 2, 3)
  const handleAddBioVenteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBioError(null);

    const todayStr = new Date().toISOString().split('T')[0];

    if (newBioVenteMethod === 'Manuel') {
      const lot = lotsDeStock.find(l => l.id === newBioVenteLot);
      if (!lot) {
        setBioError("Lot non trouvé.");
        return;
      }
      if (lot.statut === 'Bloqué') {
        setBioError("⛔ Règle de Blocage : Impossible de vendre ce lot. Statut Bloqué (DAR actif ou Test résidus non conforme) !");
        return;
      }
      if (lot.quantiteDisponible < newBioVenteQty) {
        setBioError(`Quantité insuffisante disponible sur ce lot (Disponible: ${lot.quantiteDisponible}).`);
        return;
      }

      // Atomic update (Règle 2)
      const exactNewQty = lot.quantiteDisponible - newBioVenteQty;
      const updatedLots = lotsDeStock.map(l => {
        if (l.id === lot.id) {
          return {
            ...l,
            quantiteDisponible: exactNewQty,
            statut: exactNewQty === 0 ? 'Épuisé' as const : l.statut
          };
        }
        return l;
      });

      const vteId = 'vte-' + Math.floor(Math.random() * 10000);
      const newVte: StockVente = {
        id: vteId,
        idLotStock: lot.id,
        quantiteVendue: newBioVenteQty,
        prixVenteUnitaire: newBioVentePrixUnit,
        montantTotal: newBioVenteQty * newBioVentePrixUnit,
        canalVente: newBioVenteCanal,
        acheteur: newBioVenteAcheteur,
        date: todayStr
      };

      const newMvt: MouvementDeStockGen = {
        id: 'mvtg-' + Math.floor(Math.random() * 10000),
        idLotStock: lot.id,
        date: todayStr,
        typeMouvement: 'sortie_vente',
        quantite: -newBioVenteQty,
        quantiteApresMouvement: exactNewQty,
        referenceLiee: vteId,
        operateur: 'Agent Commercial ERP'
      };

      setLotsDeStock(updatedLots);
      setStockVentes([newVte, ...stockVentes]);
      setMouvementsDeStockGen([newMvt, ...mouvementsDeStockGen]);
      setShowAddBioVente(false);
      setBioSuccess(`Vente enregistrée pour le Lot ${lot.id}. Marge lot calculée !`);
      setTimeout(() => setBioSuccess(null), 4000);

    } else {
      // FIFO Depletion (Règle 1)
      const matchingLots = lotsDeStock
        .filter(l => l.idProduit === newBioVenteProdId && l.quantiteDisponible > 0)
        .sort((a, b) => a.dateEntree.localeCompare(b.dateEntree)); // oldest first

      if (matchingLots.length === 0) {
        setBioError("Aucun lot disponible pour ce produit.");
        return;
      }

      // Check for any blocked lot that we might attempt to sell
      const hasBlockedLots = matchingLots.some(l => l.statut === 'Bloqué');
      // If the oldest available lots contain any blocked lots, throw error or skip. 
      // Safe play: if the oldest lot is blocked, we can't sell it, but we shouldn't bypass active food safety regulations silently.
      
      const totalAvailable = matchingLots.reduce((sum, l) => l.statut === 'Disponible' ? sum + l.quantiteDisponible : sum, 0);
      if (totalAvailable < newBioVenteQty) {
        setBioError(`Quantité totale saine insuffisante en stock (${totalAvailable} disponibles vs ${newBioVenteQty} demandés). Certains lots sont peut-être bloqués.`);
        return;
      }

      let remainingToDeplete = newBioVenteQty;
      const localLotsToUpdate = [...lotsDeStock];
      const createdVentes: StockVente[] = [];
      const createdMvts: MouvementDeStockGen[] = [];
      const vteGroupId = 'vte-fifo-' + Math.floor(Math.random() * 10000);

      for (const currentLot of matchingLots) {
        if (currentLot.statut === 'Bloqué') continue; // Skip blocked lots for public food safety
        if (remainingToDeplete <= 0) break;

        const lotIndex = localLotsToUpdate.findIndex(l => l.id === currentLot.id);
        const qtyToTake = Math.min(currentLot.quantiteDisponible, remainingToDeplete);
        const exactRemainingInLot = currentLot.quantiteDisponible - qtyToTake;

        // Update lot
        localLotsToUpdate[lotIndex] = {
          ...currentLot,
          quantiteDisponible: exactRemainingInLot,
          statut: exactRemainingInLot === 0 ? 'Épuisé' as const : currentLot.statut
        };

        const individualVteId = 'vte-' + Math.floor(Math.random() * 10000);
        createdVentes.push({
          id: individualVteId,
          idLotStock: currentLot.id,
          quantiteVendue: qtyToTake,
          prixVenteUnitaire: newBioVentePrixUnit,
          montantTotal: qtyToTake * newBioVentePrixUnit,
          canalVente: newBioVenteCanal,
          acheteur: newBioVenteAcheteur,
          date: todayStr
        });

        createdMvts.push({
          id: 'mvtg-' + Math.floor(Math.random() * 10000),
          idLotStock: currentLot.id,
          date: todayStr,
          typeMouvement: 'sortie_vente',
          quantite: -qtyToTake,
          quantiteApresMouvement: exactRemainingInLot,
          referenceLiee: vteGroupId,
          operateur: 'Système FIFO automatique'
        });

        remainingToDeplete -= qtyToTake;
      }

      setLotsDeStock(localLotsToUpdate);
      setStockVentes([...createdVentes, ...stockVentes]);
      setMouvementsDeStockGen([...createdMvts, ...mouvementsDeStockGen]);
      setShowAddBioVente(false);
      setBioSuccess(`Déplétion FIFO complétée ! ${newBioVenteQty} unités réparties sur les lots sains les plus anciens.`);
      setTimeout(() => setBioSuccess(null), 5000);
    }
  };

  // Record Stock Hazard / Loss (Aléa)
  const handleAddBioAleaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lot = lotsDeStock.find(l => l.id === newBioAleaLot);
    if (!lot) {
      setBioError("Lot non spécifié.");
      return;
    }
    if (lot.quantiteDisponible < newBioAleaQty) {
      setBioError(`Quantité inadmissible. Quantité max disponible à perdre : ${lot.quantiteDisponible}`);
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const exactNewQty = lot.quantiteDisponible - newBioAleaQty;
    const computedLossVal = newBioAleaQty * lot.coutProductionUnitaire;

    const updatedLots = lotsDeStock.map(l => {
      if (l.id === lot.id) {
        return {
          ...l,
          quantiteDisponible: exactNewQty,
          statut: exactNewQty === 0 ? 'Épuisé' as const : l.statut
        };
      }
      return l;
    });

    const aleaId = 'alea-' + Math.floor(Math.random() * 10000);
    const newAlea: StockAleas = {
      id: aleaId,
      idLotStock: lot.id,
      date: todayStr,
      type: newBioAleaType,
      quantitePerdue: newBioAleaQty,
      valeurPerdue: computedLossVal,
      observation: newBioAleaObs
    };

    const newMvt: MouvementDeStockGen = {
      id: 'mvtg-' + Math.floor(Math.random() * 10000),
      idLotStock: lot.id,
      date: todayStr,
      typeMouvement: 'sortie_perte',
      quantite: -newBioAleaQty,
      quantiteApresMouvement: exactNewQty,
      referenceLiee: aleaId,
      operateur: 'Contrôleur de pertes Qualité'
    };

    setLotsDeStock(updatedLots);
    setStockAleas([newAlea, ...stockAleas]);
    setMouvementsDeStockGen([newMvt, ...mouvementsDeStockGen]);
    setShowAddBioAlea(false);
    setBioSuccess(`Aléa de stockage enregistré ! Perte valorisée au coût de production (${computedLossVal.toLocaleString()} FCFA).`);
    setTimeout(() => setBioSuccess(null), 4000);
  };

  // Handle Transformation (e.g., Lait -> Fromage, Maize -> Feed)
  const handleAddBioTransSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lotInput = lotsDeStock.find(l => l.id === newBioTransLotInput);
    const prodOutput = produitsAgricoles.find(p => p.id === newBioTransProdOutput);
    const lieuOutput = lieuxDeStockage.find(l => l.id === newBioTransLieuOutput);

    if (!lotInput || !prodOutput || !lieuOutput) {
      setBioError("Sélecions d'intrants/extrants incorrectes.");
      return;
    }
    if (lotInput.quantiteDisponible < newBioTransQtyInput) {
      setBioError(`Le lot d'entrée ne possède pas assez de produit (${lotInput.quantiteDisponible} dispo).`);
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];

    // Decrement Input Lot (Règle 2)
    const afterQtyInput = lotInput.quantiteDisponible - newBioTransQtyInput;
    const updatedLotsTemp = lotsDeStock.map(l => {
      if (l.id === lotInput.id) {
        return {
          ...l,
          quantiteDisponible: afterQtyInput,
          statut: afterQtyInput === 0 ? 'Épuisé' as const : l.statut
        };
      }
      return l;
    });

    // Compute yield & new Cost of production
    const yieldRate = newBioTransQtyOutput / newBioTransQtyInput;
    // New total cost = (Consumed material cost) + extra transformation costs
    const rawMaterialValueUsed = newBioTransQtyInput * lotInput.coutProductionUnitaire;
    const newTotalCostBasis = rawMaterialValueUsed + newBioTransCoutExtra;
    const newUnitCoutProd = Math.round(newTotalCostBasis / newBioTransQtyOutput);

    // Create New Lot
    const newLotId = 'lot-' + Math.floor(Math.random() * 10000);
    const expDate = new Date();
    expDate.setDate(expDate.getDate() + prodOutput.dureeConservationMax);

    const newOutputLot: LotDeStock = {
      id: newLotId,
      idProduit: prodOutput.id,
      idLieuStockage: lieuOutput.id,
      dateEntree: todayStr,
      quantiteInitiale: newBioTransQtyOutput,
      quantiteDisponible: newBioTransQtyOutput,
      origineType: 'Achat', // Treated as processed batch
      qualiteEntree: 'Premium',
      statut: 'Disponible',
      dateLimiteDegradation: expDate.toISOString().split('T')[0],
      coutProductionUnitaire: newUnitCoutProd
    };

    const transId = 'trf-' + Math.floor(Math.random() * 10000);
    const newTrans: TransformationProduit = {
      id: transId,
      date: todayStr,
      lotsConsommes: [{ idLotStock: lotInput.id, quantiteConsommee: newBioTransQtyInput }],
      idLotProduitCree: newLotId,
      coutTransformation: newBioTransCoutExtra,
      tauxRendement: parseFloat(yieldRate.toFixed(4)),
      operateur: 'Chef Fromager/Meunier'
    };

    // Log the movements
    const mvtInput: MouvementDeStockGen = {
      id: 'mvtg-' + Math.floor(Math.random() * 10000),
      idLotStock: lotInput.id,
      date: todayStr,
      typeMouvement: 'transformation',
      quantite: -newBioTransQtyInput,
      quantiteApresMouvement: afterQtyInput,
      referenceLiee: transId,
      operateur: 'Consommation d\'intrant'
    };

    const mvtOutput: MouvementDeStockGen = {
      id: 'mvtg-' + Math.floor(Math.random() * 10000),
      idLotStock: newLotId,
      date: todayStr,
      typeMouvement: 'entrée',
      quantite: newBioTransQtyOutput,
      quantiteApresMouvement: newBioTransQtyOutput,
      referenceLiee: transId,
      operateur: 'Production transformée'
    };

    setLotsDeStock([newOutputLot, ...updatedLotsTemp]);
    setTransformationsProduit([newTrans, ...transformationsProduit]);
    setMouvementsDeStockGen([mvtInput, mvtOutput, ...mouvementsDeStockGen]);
    setShowAddBioTrans(false);
    setBioSuccess(`Transformation complétée ! Lot d'extrant ${newLotId} créé (Coût unitaire recalculé : ${newUnitCoutProd} FCFA/unité).`);
    setTimeout(() => setBioSuccess(null), 6000);
  };

  // Perform Physical Inventory Audit with discrepancy tracking
  const handleAddBioAuditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetLieu = lieuxDeStockage.find(l => l.id === newBioAuditLieu);
    if (!targetLieu) return;

    const todayStr = new Date().toISOString().split('T')[0];
    const lotsInLieu = lotsDeStock.filter(l => l.idLieuStockage === targetLieu.id && l.quantiteDisponible > 0);

    const verifications: { idLotStock: string; quantiteTheorique: number; quantiteConstatee: number; ecart: number }[] = [];
    const localLotsToUpdate = [...lotsDeStock];
    const newMvts: MouvementDeStockGen[] = [];
    const newHelperAleas: StockAleas[] = [];
    const auditId = 'audit-' + Math.floor(Math.random() * 10000);

    for (const lot of lotsInLieu) {
      const theory = lot.quantiteDisponible;
      const physical = auditQuantities[lot.id] !== undefined ? auditQuantities[lot.id] : theory;
      const ecart = physical - theory;

      verifications.push({
        idLotStock: lot.id,
        quantiteTheorique: theory,
        quantiteConstatee: physical,
        ecart: ecart
      });

      if (ecart !== 0) {
        // Find index in main state representation
        const lotIndex = localLotsToUpdate.findIndex(l => l.id === lot.id);
        localLotsToUpdate[lotIndex] = {
          ...lot,
          quantiteDisponible: physical,
          statut: physical === 0 ? 'Épuisé' as const : lot.statut
        };

        // Create adjustment movement
        newMvts.push({
          id: 'mvtg-' + Math.floor(Math.random() * 10000),
          idLotStock: lot.id,
          date: todayStr,
          typeMouvement: 'ajustement_inventaire',
          quantite: ecart,
          quantiteApresMouvement: physical,
          referenceLiee: auditId,
          operateur: 'Auditeur d\'inventaire physique'
        });

        // If ecart was negative, register as stock hazard
        if (ecart < 0) {
          const lossValue = Math.abs(ecart) * lot.coutProductionUnitaire;
          newHelperAleas.push({
            id: 'alea-' + Math.floor(Math.random() * 10000),
            idLotStock: lot.id,
            date: todayStr,
            type: 'Casse',
            quantitePerdue: Math.abs(ecart),
            valeurPerdue: lossValue,
            observation: `Ajustement d'inventaire négatif (écart de ${ecart})`
          });
        }
      }
    }

    const newAudit: InventairePhysique = {
      id: auditId,
      date: todayStr,
      idLieuStockage: targetLieu.id,
      verifications,
      operateur: 'Jean-Pierre Ondoa (Contrôleur Interne)'
    };

    setLotsDeStock(localLotsToUpdate);
    setInventairesPhysiques([newAudit, ...inventairesPhysiques]);
    if (newMvts.length > 0) {
      setMouvementsDeStockGen([...newMvts, ...mouvementsDeStockGen]);
    }
    if (newHelperAleas.length > 0) {
      setStockAleas([...newHelperAleas, ...stockAleas]);
    }

    setShowAddBioAudit(false);
    setAuditQuantities({});
    setBioSuccess(`Audit d'inventaire pour "${targetLieu.nom}" finalisé. ${newMvts.length} ajustements automatiques programmés !`);
    setTimeout(() => setBioSuccess(null), 5000);
  };

  // Helper getters
  const getBioProdName = (id: string) => produitsAgricoles.find(p => p.id === id)?.nom || 'Inconnu';
  const getBioProdRefPrice = (id: string) => produitsAgricoles.find(p => p.id === id)?.prixReferenceMarche || 0;
  const getBioProdUnit = (id: string) => produitsAgricoles.find(p => p.id === id)?.uniteReference || 'Kg';
  const getBioLieuName = (id: string) => lieuxDeStockage.find(l => l.id === id)?.nom || 'Inconnu';

  // Toggle active block status manually
  const toggleLotStatus = (lotId: string) => {
    setLotsDeStock(lotsDeStock.map(l => {
      if (l.id === lotId) {
        const nextStatut = l.statut === 'Bloqué' ? 'Disponible' : 'Bloqué';
        return { ...l, statut: nextStatut };
      }
      return l;
    }));
  };

  // ==========================================
  // KPI COMPUTATIONS FOR SEC 7 of SPEC
  // ==========================================
  const totalBioAssetsValue = lotsDeStock.reduce((sum, l) => sum + (l.quantiteDisponible * l.coutProductionUnitaire), 0);
  
  // Total entries quantity: sum of all positive entry movements
  const totalEnteredQty = mouvementsDeStockGen
    .filter(m => m.typeMouvement === 'entrée')
    .reduce((sum, m) => sum + m.quantite, 0);

  // Total pertes quantities
  const totalPertesQty = stockAleas.reduce((sum, a) => sum + a.quantitePerdue, 0);
  const totalPertesValueVal = stockAleas.reduce((sum, a) => sum + a.valeurPerdue, 0);

  const globalLossRate = totalEnteredQty > 0 ? (totalPertesQty / totalEnteredQty) * 100 : 0;

  // Active locks / blocked lots count
  const blockedLotsCount = lotsDeStock.filter(l => l.statut === 'Bloqué' && l.quantiteDisponible > 0).length;

  // Rotations calculations: total outgoing sales quantity over active remaining stock
  const totalSoldQty = stockVentes.reduce((sum, v) => sum + v.quantiteVendue, 0);
  const totalRemainingQty = lotsDeStock.reduce((sum, l) => sum + l.quantiteDisponible, 0);
  const globalRotationRate = totalRemainingQty > 0 ? (totalSoldQty / totalRemainingQty) : 0;


  // Calculate current computed stock levels for each article
  const getArticleStockLevel = (artId: string) => {
    const artMvts = mouvements.filter(m => m.idArticle === artId);
    let total = 0;
    artMvts.forEach(m => {
      if (m.type === 'Entrée') total += m.quantite;
      else total -= m.quantite;
    });
    return total;
  };

  const getArticleName = (id: string) => {
    const a = articles.find(x => x.id === id);
    return a ? a.designation : 'Inconnu';
  };

  const getMagasinName = (id: string) => {
    const m = magasins.find(x => x.id === id);
    return m ? m.nom : 'Inconnu';
  };

  const getEquipementName = (id: string) => {
    const e = equipements.find(x => x.id === id);
    return e ? `${e.designation} [${e.code}]` : 'Inconnu';
  };

  // Form Submissions
  const handleCreateMvt = (e: React.FormEvent) => {
    e.preventDefault();
    const art = articles.find(item => item.id === newMvtArt);
    const newMvt: MouvementStock = {
      id: 'mvt-' + Math.floor(Math.random() * 10000),
      idMagasin: newMvtMag,
      idArticle: newMvtArt,
      date: new Date().toISOString().split('T')[0],
      type: newMvtType,
      quantite: newMvtQty,
      motif: newMvtMotif as any,
      coutUnitaire: newMvtCout || art?.prixFournisseurMoyen || 1000,
      responsable: newMvtResp
    };
    onAddMouvement(newMvt);
    setShowAddMvt(false);
  };

  const handleCreateMaint = (e: React.FormEvent) => {
    e.preventDefault();
    const newMaint: MaintenanceOrder = {
      id: 'maint-' + Math.floor(Math.random() * 10000),
      idEquipement: newMaintEq,
      type: newMaintType,
      technicien: newMaintTech,
      datePlanifiee: new Date().toISOString().split('T')[0],
      description: newMaintDesc,
      statut: 'En attente',
      coûtFCFA: newMaintCost
    };
    onAddMaintenance(newMaint);
    setShowAddMaint(false);
  };

  const handleCreateFuel = (e: React.FormEvent) => {
    e.preventDefault();
    const newFuel: FuelLog = {
      id: 'fuel-' + Math.floor(Math.random() * 10000),
      idEquipement: newFuelEq,
      date: new Date().toISOString().split('T')[0],
      quantiteLitre: newFuelQty,
      coûtFCFA: newFuelCost,
      chauffeur: newFuelChauff
    };
    onAddFuelLog(newFuel);
    setShowAddFuel(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Module Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Package className="text-blue-600 h-7 w-7" />
            Module de Gestion de Stocks & Matériels d'Équipements
          </h2>
          <p className="text-sm text-slate-500">
            Inventaire des magasins d'intrants, alertes de seuil de rupture, planification de maintenance des tracteurs et registres de carburants consommés.
          </p>
        </div>
        <div className="flex gap-2">
          {activeTab === 'magasins' && (
            <button
              onClick={() => setShowAddMvt(true)}
              className="bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-1.5"
            >
              <PlusCircle className="h-4 w-4" /> Enregistrer Mouvement Stock
            </button>
          )}
          {activeTab === 'maintenance' && (
            <button
              onClick={() => setShowAddMaint(true)}
              className="bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-1.5"
            >
              <PlusCircle className="h-4 w-4" /> Nouvelle Fiche Mécanique
            </button>
          )}
          {activeTab === 'carburant' && (
            <button
              onClick={() => setShowAddFuel(true)}
              className="bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-1.5"
            >
              <Fuel className="h-4 w-4" /> Déclencheur Carburant
            </button>
          )}
        </div>
      </div>

      {/* Alertes de rupture */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
        <AlertOctagon className="text-red-500 h-5 w-5 mt-0.5" />
        <div>
          <h4 className="font-bold text-red-900 text-xs uppercase tracking-wider">État critique des approvisionnements (Ruptures de stocks)</h4>
          <p className="text-xs text-red-700 mt-1">
            Les intrants suivants ont atteint leur seuil critique et nécessitent un approvisionnement immédiat auprès des fournisseurs référencés :
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            {articles.map(art => {
              const current = getArticleStockLevel(art.id);
              if (current <= art.stockMinimum) {
                return (
                  <span key={art.id} className="bg-white border-red-300 text-red-700 text-[10px] font-semibold px-2 py-1 rounded border">
                    {art.designation} (Reste: {current} {art.uniteMesure} / Seuil: {art.stockMinimum})
                  </span>
                );
              }
              return null;
            })}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b flex gap-1 bg-slate-50 p-1.5 rounded-lg border overflow-x-auto">
        <button
          onClick={() => setActiveTab('bio-stocks')}
          className={`px-4 py-2 rounded text-xs font-semibold shrink-0 transition flex items-center gap-1.5 ${
            activeTab === 'bio-stocks' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Boxes className="h-3.5 w-3.5" /> Bio-Stocks Agricoles (Spécif. Unifiée)
        </button>
        <button
          onClick={() => setActiveTab('magasins')}
          className={`px-4 py-2 rounded text-xs font-semibold transition ${
            activeTab === 'magasins' ? 'bg-white shadow-xs text-blue-700' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Magasins & Niveaux Réels de Stocks
        </button>
        <button
          onClick={() => setActiveTab('enregistrer-mvt')}
          className={`px-4 py-2 rounded text-xs font-semibold transition ${
            activeTab === 'enregistrer-mvt' ? 'bg-white shadow-xs text-blue-700' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Historique des Mouvements ({mouvements.length})
        </button>
        <button
          onClick={() => setActiveTab('equipements')}
          className={`px-4 py-2 rounded text-xs font-semibold transition ${
            activeTab === 'equipements' ? 'bg-white shadow-xs text-blue-700' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Parc Roulant & Équipements ({equipements.length})
        </button>
        <button
          onClick={() => setActiveTab('maintenance')}
          className={`px-4 py-2 rounded text-xs font-semibold transition ${
            activeTab === 'maintenance' ? 'bg-white shadow-xs text-blue-700' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Plans de Maintenance active ({maintenances.length})
        </button>
        <button
          onClick={() => setActiveTab('carburant')}
          className={`px-4 py-2 rounded text-xs font-semibold transition ${
            activeTab === 'carburant' ? 'bg-white shadow-xs text-blue-700' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Consommation Carburant (Gasoil)
        </button>
      </div>

      <div className="bg-white rounded-xl border shadow-2xs p-4">
        {/* VIEW 0: UNIFIED BIO-STOCKS SYSTEM */}
        {activeTab === 'bio-stocks' && (
          <div className="space-y-6">
            
            {/* Session Feedback Banners */}
            {bioSuccess && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg flex items-center gap-2 text-xs font-medium animate-fade-in">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>{bioSuccess}</span>
              </div>
            )}
            {bioError && (
              <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg flex items-center gap-2 text-xs font-medium animate-fade-in">
                <AlertOctagon className="h-4 w-4 text-rose-600 shrink-0" />
                <span>{bioError}</span>
              </div>
            )}

            {/* BENTO-GRID KPI BANNER (SPEC SECTION 7) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-900 text-slate-100 p-4 rounded-xl shadow-xs border border-slate-800 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Valeur Active du Bio-Stock</span>
                  <span className="text-xl font-extrabold font-mono text-white block mt-1">{totalBioAssetsValue.toLocaleString()} FCFA</span>
                </div>
                <div className="mt-4 flex items-center gap-1.5 text-[11px] text-indigo-300 bg-slate-800/80 px-2.5 py-1 rounded-md">
                  <Coins className="h-3.5 w-3.5" /> Gel de Trésorerie Immobilisé
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl shadow-2xs border border-slate-200 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Taux de Perte Global (Périssabilité)</span>
                  <span className="text-xl font-extrabold font-mono text-slate-900 block mt-1">{globalLossRate.toFixed(2)} %</span>
                </div>
                <div className="mt-4 text-[11px] text-slate-500">
                  Pertes valorisées à <strong className="font-semibold text-rose-600">{totalPertesValueVal.toLocaleString()} FCFA</strong> ({totalPertesQty} {totalPertesQty > 1 ? 'unités' : 'unité'})
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl shadow-2xs border border-slate-200 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Taux de Rotation des Stocks</span>
                  <span className="text-xl font-extrabold font-mono text-slate-900 block mt-1">{globalRotationRate.toFixed(2)}x</span>
                </div>
                <div className="mt-4 text-[11px] text-slate-500">
                  Ratio de ventes fermières ({totalSoldQty} unités écoulées)
                </div>
              </div>

              <div className={`p-4 rounded-xl shadow-2xs border flex flex-col justify-between transition ${
                blockedLotsCount > 0 ? 'bg-amber-50/70 border-amber-200' : 'bg-white border-slate-200'
              }`}>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Sécurité Bio-Sanitaire & DAR</span>
                  <span className="text-xl font-extrabold font-mono text-amber-800 block mt-1 flex items-center gap-2">
                    {blockedLotsCount} {blockedLotsCount > 1 ? 'lots bloqués' : 'lot bloqué'}
                    {blockedLotsCount > 0 && <AlertTriangle className="h-5 w-5 text-amber-600 animate-pulse" />}
                  </span>
                </div>
                <div className="mt-4 text-[11px] text-slate-500">
                  {blockedLotsCount > 0 ? "⚠️ Règle 5 : Retrait de marché si DAR phytosanitaire ou Résidus Suspects" : "✓ Tous les lots actifs autorisés à la vente."}
                </div>
              </div>
            </div>

            {/* ALERT BOX : EXPIRING AND BLOCKED LOTS (SEC 4 RULE 4) */}
            {lotsDeStock.some(l => l.quantiteDisponible > 0 && Math.ceil((new Date(l.dateLimiteDegradation).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) <= 5) && (
              <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl flex items-start gap-3 text-xs text-amber-900 animate-pulse">
                <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <strong className="font-semibold block text-amber-950">Alerte de Péremption imminente !</strong>
                  <span>Certains lots agroalimentaires de production atteignent leur limite de conservation d'ici 5 jours. Veuillez initier des ventes prioritaires (FIFO) ou des transformations immédiates (ex: lait cru → Fromage).</span>
                </div>
              </div>
            )}

            {/* QUICK ACTIONS PANEL (FORM TRIGGERS) */}
            <div className="flex flex-wrap gap-2.5 pb-2 border-b">
              <button
                onClick={() => {
                  if (produitsAgricoles.length > 0) setNewBioLotProd(produitsAgricoles[0].id);
                  if (lieuxDeStockage.length > 0) setNewBioLotLieu(lieuxDeStockage[0].id);
                  setNewBioLotOrigine('Récolte');
                  setShowAddBioLot(true);
                }}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              >
                <PlusCircle className="h-3.5 w-3.5" /> Entrée Bio-Stock (Fermière)
              </button>
              <button
                onClick={() => {
                  if (produitsAgricoles.length > 0) {
                    setNewBioVenteProdId(produitsAgricoles[0].id);
                    // Match first available lot
                    const eligible = lotsDeStock.find(l => l.idProduit === produitsAgricoles[0].id && l.quantiteDisponible > 0);
                    if (eligible) {
                      setNewBioVenteLot(eligible.id);
                    }
                  }
                  setShowAddBioVente(true);
                }}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              >
                <Coins className="h-3.5 w-3.5" /> Ordonner une Vente (FIFO/Lot)
              </button>
              <button
                onClick={() => {
                  const eligibleInputs = lotsDeStock.filter(l => l.quantiteDisponible > 0);
                  if (eligibleInputs.length > 0) {
                    setNewBioTransLotInput(eligibleInputs[0].id);
                  }
                  const transformableOutputs = produitsAgricoles.filter(p => p.categorie === 'Transformé');
                  if (transformableOutputs.length > 0) {
                    setNewBioTransProdOutput(transformableOutputs[0].id);
                  }
                  if (lieuxDeStockage.length > 0) {
                    setNewBioTransLieuOutput(lieuxDeStockage[0].id);
                  }
                  setShowAddBioTrans(true);
                }}
                className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              >
                <RotateCw className="h-3.5 w-3.5" /> Lancer une Transformation (Recyclage)
              </button>
              <button
                onClick={() => {
                  if (lieuxDeStockage.length > 0) {
                    setNewBioAuditLieu(lieuxDeStockage[0].id);
                    // Prepopulate counted quantities to theoretical
                    const currentLieuLots = lotsDeStock.filter(l => l.idLieuStockage === lieuxDeStockage[0].id && l.quantiteDisponible > 0);
                    const qMap: Record<string, number> = {};
                    currentLieuLots.forEach(l => { qMap[l.id] = l.quantiteDisponible; });
                    setAuditQuantities(qMap);
                  }
                  setShowAddBioAudit(true);
                }}
                className="px-3.5 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              >
                <FileCheck className="h-3.5 w-3.5" /> Audit d'Inventaire Physique
              </button>
            </div>

            {/* STORAGE LOCATION SLOTS & FILLING RATE (RÈGLE 5) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* STOCKS LIEUX CARD COLLECTION */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
                    <Truck className="h-4 w-4 text-indigo-500" /> Taux d'Occupation des Espaces de Stockage
                  </h4>
                  <button
                    onClick={() => setShowAddBioLieu(true)}
                    className="text-[11px] text-indigo-600 hover:underline font-bold flex items-center gap-1"
                  >
                    + Créer un Emplacement
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {lieuxDeStockage.map(lieu => {
                    // Compute storage level
                    const lotsInLieu = lotsDeStock.filter(l => l.idLieuStockage === lieu.id && l.quantiteDisponible > 0);
                    const currentQty = lotsInLieu.reduce((acc, l) => acc + l.quantiteDisponible, 0);
                    const fillPct = Math.min((currentQty / lieu.capaciteMax) * 100, 100);
                    
                    return (
                      <div key={lieu.id} className="bg-slate-50 border p-4 rounded-xl space-y-3 shadow-3xs flex flex-col justify-between">
                        <div className="space-y-1">
                          <div className="flex justify-between items-start">
                            <span className="text-xs font-bold text-slate-900">{lieu.nom}</span>
                            <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-slate-200 rounded text-slate-700">{lieu.type}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 italic leading-tight">{lieu.conditions}</p>
                        </div>

                        <div className="space-y-1.5 mt-2">
                          <div className="flex justify-between text-[11px] font-medium text-slate-600">
                            <span>Remplissage : {currentQty.toLocaleString()} / {lieu.capaciteMax.toLocaleString()}</span>
                            <span className={fillPct >= 90 ? 'text-rose-600 font-bold' : fillPct >= 70 ? 'text-amber-600' : 'text-slate-500'}>
                              {fillPct.toFixed(0)}%
                            </span>
                          </div>
                          {/* Progress bar */}
                          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-300 ${
                                fillPct >= 90 ? 'bg-rose-500' : fillPct >= 70 ? 'bg-amber-500' : 'bg-indigo-600'
                              }`}
                              style={{ width: `${fillPct}%` }}
                            />
                          </div>
                        </div>

                        <div className="pt-2 border-t mt-1 flex justify-between items-center text-[11px]">
                          <span className="text-slate-400 font-mono">{lotsInLieu.length} lot(s) sédimenté(s)</span>
                          <button
                            onClick={() => {
                              setNewBioAuditLieu(lieu.id);
                              const qMap: Record<string, number> = {};
                              lotsInLieu.forEach(l => { qMap[l.id] = l.quantiteDisponible; });
                              setAuditQuantities(qMap);
                              setShowAddBioAudit(true);
                            }}
                            className="text-indigo-600 hover:underline font-semibold"
                          >
                            Auditer l'espace
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* PRODUCTS REFERENTIAL GRID */}
              <div className="bg-slate-50 border p-4 rounded-xl space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
                    <Package className="h-4 w-4 text-emerald-500" /> Référentiel Catalogue Produits ({produitsAgricoles.length})
                  </h4>
                  <button
                    onClick={() => setShowAddBioProd(true)}
                    className="text-[11px] text-emerald-600 hover:underline font-bold"
                  >
                    + Produit
                  </button>
                </div>

                <div className="space-y-2 max-h-[290px] overflow-y-auto pr-1">
                  {produitsAgricoles.map(prod => (
                    <div key={prod.id} className="bg-white border rounded-lg p-2.5 flex justify-between items-center text-xs shadow-3xs">
                      <div>
                        <div className="font-bold text-slate-900">{prod.nom}</div>
                        <div className="text-[10px] text-slate-400">
                          {prod.categorie} • Conservation max : {prod.dureeConservationMax}j
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-slate-900">{prod.prixReferenceMarche} FCFA</div>
                        <div className="text-[10px] text-slate-500">par {prod.uniteReference}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-slate-400 leading-tight">
                  Ce catalogue centralise les produits bios de la production Végétale et Animale pour homogénéiser la business intelligence.
                </p>
              </div>
            </div>

            {/* ACTIVE LOTS TRAJECTORIES LEDGER (SEC 4) */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-bold uppercase text-slate-800 tracking-wider flex items-center gap-2">
                    <History className="h-4 w-4 text-indigo-500" /> Registre de Traçabilité des Lots Actifs
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Cliquez sur l'interrupteur Sécuritaire pour Bloquer/Débloquer la conformité sanitaire de chaque lot (Règle 3).</p>
                </div>
                <div className="text-[11px] text-slate-500 bg-slate-100 px-3 py-1 rounded-md">
                   {lotsDeStock.filter(l => l.quantiteDisponible > 0).length} lot(s) non-épuisé(s) en stock
                </div>
              </div>

              <div className="overflow-x-auto border rounded-xl shadow-3xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 border-b text-slate-600 font-semibold uppercase">
                    <tr>
                      <th className="p-3">ID Lot</th>
                      <th className="p-3">Produit</th>
                      <th className="p-3">Lieu de Stockage</th>
                      <th className="p-3">Entrée</th>
                      <th className="p-3">Origine Tracée</th>
                      <th className="p-3 text-right">Quantité Disponible</th>
                      <th className="p-3 text-right">Coût Production Unitaire</th>
                      <th className="p-3 text-center">Date Exp.</th>
                      <th className="p-3 text-center">Sécurité DAR</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-slate-700 text-xs">
                    {lotsDeStock.map(lot => {
                      const daysLeft = Math.ceil((new Date(lot.dateLimiteDegradation).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                      const isExpired = daysLeft <= 0;
                      const productUnit = getBioProdUnit(lot.idProduit);

                      return (
                        <tr key={lot.id} className={`hover:bg-slate-50 transition ${
                          lot.statut === 'Bloqué' ? 'bg-amber-50/20' : lot.quantiteDisponible === 0 ? 'opacity-50 bg-slate-50' : ''
                        }`}>
                          <td className="p-3 font-mono font-bold text-slate-900">{lot.id}</td>
                          <td className="p-3">
                            <span className="font-bold text-slate-900 block">{getBioProdName(lot.idProduit)}</span>
                            <span className="text-[10px] text-slate-400 capitalize">{lot.qualiteEntree} grade</span>
                          </td>
                          <td className="p-3 font-medium">{getBioLieuName(lot.idLieuStockage)}</td>
                          <td className="p-3 text-slate-500">{lot.dateEntree}</td>
                          <td className="p-3">
                            <div className="flex flex-col">
                              <span className="text-[11px] font-semibold text-slate-800">{lot.origineType}</span>
                              {lot.origineId && <span className="text-[9px] font-mono text-indigo-600">ID: {lot.origineId}</span>}
                            </div>
                          </td>
                          <td className="p-3 text-right font-bold font-mono">
                            {lot.quantiteDisponible.toLocaleString()} {productUnit}
                            {lot.quantiteInitiale > lot.quantiteDisponible && (
                              <span className="text-[9px] text-slate-400 block font-normal">Initial: {lot.quantiteInitiale}</span>
                            )}
                          </td>
                          <td className="p-3 text-right font-mono text-slate-600">{lot.coutProductionUnitaire.toLocaleString()} FCFA</td>
                          <td className="p-3 text-center">
                            <div className="flex flex-col items-center">
                              <span className={`font-mono text-[11px] ${isExpired ? 'text-rose-600 font-bold' : daysLeft <= 5 ? 'text-amber-600 font-bold' : 'text-slate-600'}`}>
                                {lot.dateLimiteDegradation}
                              </span>
                              <span className={`text-[9px] px-1 py-0.2 rounded font-bold ${
                                isExpired ? 'bg-rose-100 text-rose-700' : daysLeft <= 5 ? 'bg-amber-100 text-amber-800 animate-pulse' : 'bg-slate-100 text-slate-500'
                              }`}>
                                {isExpired ? 'Périmé' : `${daysLeft} jours restants`}
                              </span>
                            </div>
                          </td>
                          <td className="p-3 text-center">
                            {lot.statut === 'Bloqué' ? (
                              <button 
                                onClick={() => toggleLotStatus(lot.id)}
                                className="bg-rose-100 text-rose-800 hover:bg-rose-200 text-[10px] px-2.5 py-1 rounded-full font-bold flex items-center gap-1 mx-auto transition"
                                title="Débloquer manuellement"
                              >
                                <AlertTriangle className="h-3 w-3 text-rose-600" />
                                BLOQUÉ (Séc. DAR active)
                              </button>
                            ) : (
                              <button 
                                onClick={() => toggleLotStatus(lot.id)}
                                className="bg-emerald-100 text-emerald-800 hover:bg-amber-100 hover:text-amber-800 text-[10px] px-2.5 py-1 rounded-full font-bold flex items-center gap-1 mx-auto transition"
                                title="Verrouiller par précaution"
                              >
                                <ShieldCheck className="h-3 w-3 text-emerald-600" />
                                SAIN / CONFIRMÉ
                              </button>
                            )}
                          </td>
                          <td className="p-3 text-right space-y-1">
                            {lot.quantiteDisponible > 0 && (
                              <div className="flex justify-end gap-1.5">
                                <button
                                  disabled={lot.statut === 'Bloqué'}
                                  onClick={() => {
                                    setNewBioVenteMethod('Manuel');
                                    setNewBioVenteLot(lot.id);
                                    setNewBioVentePrixUnit(getBioProdRefPrice(lot.idProduit));
                                    setNewBioVenteQty(Math.min(10, lot.quantiteDisponible));
                                    setShowAddBioVente(true);
                                  }}
                                  className={`px-2 py-1 text-[10px] font-bold rounded transition ${
                                    lot.statut === 'Bloqué' 
                                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                                      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                                  }`}
                                  title={lot.statut === 'Bloqué' ? "Bloqué pour sécurité sanitaire" : "Vendre de ce lot"}
                                >
                                  Écouler
                                </button>
                                <button
                                  onClick={() => {
                                    setNewBioAleaLot(lot.id);
                                    setNewBioAleaQty(Math.min(10, lot.quantiteDisponible));
                                    setShowAddBioAlea(true);
                                  }}
                                  className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 text-[10px] font-bold rounded transition"
                                >
                                  Pertes
                                </button>
                              </div>
                            )}
                            {lot.quantiteDisponible === 0 && (
                              <span className="text-[10px] text-slate-400 italic">Vide (Épuisé)</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* CORE TRANSFORMATION REGISTER */}
            {transformationsProduit.length > 0 && (
              <div className="bg-slate-50 border p-4 rounded-xl space-y-3 shadow-3xs">
                <h4 className="text-xs font-bold uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
                  <Workflow className="h-4 w-4 text-emerald-600" /> Registre de Transformation de Matières (Fermière)
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs bg-white rounded-lg border">
                    <thead className="bg-slate-100 border-b text-slate-500 font-semibold uppercase">
                      <tr>
                        <th className="p-2.5">ID Trf</th>
                        <th className="p-2.5">Date</th>
                        <th className="p-2.5">Lot Intrant Consommé</th>
                        <th className="p-2.5 text-right">Quantité Retirée</th>
                        <th className="p-2.5">Lot Extrant Produit</th>
                        <th className="p-2.5 text-center">Taux Rendement</th>
                        <th className="p-2.5 text-right">Frais Supplémentaires</th>
                        <th className="p-2.5">Opérateur</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y text-slate-600">
                      {transformationsProduit.map(trf => (
                        <tr key={trf.id} className="hover:bg-slate-50/50">
                          <td className="p-3 font-mono font-semibold text-slate-900">{trf.id}</td>
                          <td className="p-3">{trf.date}</td>
                          <td className="p-3 font-mono font-semibold">{trf.lotsConsommes[0]?.idLotStock}</td>
                          <td className="p-3 text-right font-bold text-rose-600">-{trf.lotsConsommes[0]?.quantiteConsommee}</td>
                          <td className="p-3 font-mono font-semibold text-emerald-700">{trf.idLotProduitCree}</td>
                          <td className="p-3 text-center">
                            <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-[10px] font-bold">
                              {(trf.tauxRendement * 100).toFixed(1)}%
                            </span>
                          </td>
                          <td className="p-3 text-right font-mono">{trf.coutTransformation.toLocaleString()} FCFA</td>
                          <td className="p-3 font-medium text-slate-800">{trf.operateur}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* COMPREHENSIVE MOVEMENT AUDIT TRAIL JORNAL (RÈGLE 2) */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
                <History className="h-4 w-4 text-indigo-500" /> Journal Général Inaltérable des Bio-Mouvements (Trace Audit)
              </h4>
              <p className="text-[11px] text-slate-400">Ce journal ineffaçable contient toutes les entrées, sorties, ventes, freintes ou corrections d'inventaire physique.</p>
              
              <div className="overflow-x-auto border rounded-xl shadow-3xs max-h-[350px] overflow-y-auto">
                <table className="w-full text-left text-xs bg-white">
                  <thead className="bg-slate-100 border-b text-slate-500 font-semibold sticky top-0 uppercase">
                    <tr>
                      <th className="p-2.5">ID Trace</th>
                      <th className="p-2.5">Lot ID</th>
                      <th className="p-2.5">Date</th>
                      <th className="p-2.5">Type de Flux</th>
                      <th className="p-2.5 text-right">Quantité Écart</th>
                      <th className="p-2.5 text-right">Reste en Stock après</th>
                      <th className="p-2.5">Référence Liée</th>
                      <th className="p-2.5">Responsable Opérationnel</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-slate-600 font-mono text-[11px]">
                    {mouvementsDeStockGen.map(mvt => {
                      const isPositive = mvt.quantite > 0;
                      return (
                        <tr key={mvt.id} className="hover:bg-slate-50/50">
                          <td className="p-2 text-slate-400 font-medium">{mvt.id}</td>
                          <td className="p-2 font-bold text-slate-900">{mvt.idLotStock}</td>
                          <td className="p-2 text-slate-700">{mvt.date}</td>
                          <td className="p-2">
                            <span className={`text-[10px] px-2 py-0.5 rounded font-bold capitalize ${
                              mvt.typeMouvement === 'entrée' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                              mvt.typeMouvement === 'sortie_vente' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                              mvt.typeMouvement === 'sortie_perte' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                              mvt.typeMouvement === 'transformation' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                              'bg-slate-100 text-slate-700 border border-slate-200'
                            }`}>
                              {mvt.typeMouvement.replace('_', ' ')}
                            </span>
                          </td>
                          <td className={`p-2 text-right font-extrabold text-[12px] ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {isPositive ? '+' : ''}{mvt.quantite.toLocaleString()}
                          </td>
                          <td className="p-2 text-right font-bold text-slate-800">{mvt.quantiteApresMouvement.toLocaleString()}</td>
                          <td className="p-2 font-mono text-indigo-500 text-[10px]">{mvt.referenceLiee || 'Aucune'}</td>
                          <td className="p-2 text-slate-600 font-sans font-medium">{mvt.operateur}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* VIEW 1: LEVELS */}
        {activeTab === 'magasins' && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 text-sm">Quantités Théoriques en Magasin</h3>
            <div className="overflow-x-auto border rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b text-slate-600 font-semibold uppercase">
                  <tr>
                    <th className="p-3">ID {customLabels?.produitsServices || "Article"}</th>
                    <th className="p-3">Désignation {customLabels?.produitsServices || "Intrant"}</th>
                    <th className="p-3">Catégorie</th>
                    <th className="p-3">Stock Disponible Relevé</th>
                    <th className="p-3">Unité de mesure</th>
                    <th className="p-3">Seuil D'Alerte Minimum</th>
                    <th className="p-3 text-right">Valeur Moyenne Unitaire</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-slate-700">
                  {articles.map((art) => {
                    const current = getArticleStockLevel(art.id);
                    const alert = current <= art.stockMinimum;
                    return (
                      <tr key={art.id} className="hover:bg-slate-50 transition">
                        <td className="p-3 font-mono font-bold text-slate-500">{art.code}</td>
                        <td className="p-3 font-bold text-slate-900">{art.designation}</td>
                        <td className="p-3 text-slate-500">{art.categorie}</td>
                        <td className="p-3">
                          <span className={`font-black text-sm px-2 py-1 rounded ${alert ? 'text-red-700 bg-red-100 font-extrabold' : 'text-slate-800 bg-slate-100'}`}>
                            {current}
                          </span>
                        </td>
                        <td className="p-3 text-slate-600 font-medium">{art.uniteMesure}</td>
                        <td className="p-3 font-semibold text-slate-600">{art.stockMinimum} {art.uniteMesure}</td>
                        <td className="p-3 text-right font-mono font-bold text-indigo-600">{art.prixFournisseurMoyen.toLocaleString()} FCFA</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW 2: MOVEMENTS HISTORIC */}
        {activeTab === 'enregistrer-mvt' && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 text-sm">Registre des mouvements de stocks</h3>
            <div className="overflow-x-auto border rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b text-slate-600 font-semibold uppercase">
                  <tr>
                    <th className="p-3">Date / Code</th>
                    <th className="p-3">Magasin</th>
                    <th className="p-3">Article</th>
                    <th className="p-3">Mouvement</th>
                    <th className="p-3 text-center">Quantité</th>
                    <th className="p-3">Motif Activité</th>
                    <th className="p-3">Cout Unitaire</th>
                    <th className="p-3">Opérateur</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-slate-700">
                  {mouvements.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50 transition">
                      <td className="p-3 font-mono text-slate-500">{m.date}</td>
                      <td className="p-3 text-slate-600 font-medium">{getMagasinName(m.idMagasin)}</td>
                      <td className="p-3 font-bold text-slate-900">{getArticleName(m.idArticle)}</td>
                      <td className="p-3">
                        <span className={`inline-flex items-center gap-1 font-bold px-2.5 py-0.5 rounded text-[11px] ${
                          m.type === 'Entrée' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'
                        }`}>
                          {m.type === 'Entrée' ? <ArrowDownLeft className="h-3.5 w-3.5 text-emerald-600" /> : <ArrowUpRight className="h-3.5 w-3.5 text-red-600" />}
                          {m.type}
                        </span>
                      </td>
                      <td className="p-3 font-extrabold text-sm text-center">{m.quantite}</td>
                      <td className="p-3 text-slate-600">{m.motif}</td>
                      <td className="p-3 font-mono font-semibold text-indigo-600">{m.coutUnitaire.toLocaleString()} FCFA</td>
                      <td className="p-3 text-slate-500">{m.responsable}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW 3: EQUIPEMENTS */}
        {activeTab === 'equipements' && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 text-sm">Patrimoine Matériel & Tracteurs</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {equipements.map((eq) => {
                const countMain = maintenances.filter(m => m.idEquipement === eq.id).length;
                return (
                  <div key={eq.id} className="border p-4 rounded-xl flex flex-col justify-between hover:border-blue-400 transition shadow-3xs">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded uppercase">
                          {eq.type}
                        </span>
                        <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${eq.etat === 'En service' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                          ● {eq.etat}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-slate-800">{eq.designation}</h4>
                      <p className="text-xs text-slate-500 font-mono">Modèle: {eq.marque} {eq.modele}</p>
                    </div>

                    <div className="border-t border-b py-2 my-3 text-xs text-slate-600 space-y-1">
                      <div className="flex justify-between">
                        <span>Valeur acquisition:</span>
                        <span className="font-bold text-slate-800">{eq.valeurAcquisition.toLocaleString()} FCFA</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Date d'achat:</span>
                        <span className="font-semibold">{eq.dateAchat}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Kilométrage / Heures Moteur:</span>
                        <span className="font-bold text-indigo-600">{eq.heuresMoteurOrKm.toLocaleString()} {eq.type === 'Tracteur' ? 'heures' : 'Km'}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Maintenances registrées</span>
                      <span className="font-black text-slate-700">{countMain} rapports</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 4: MAINTENANCE ORDERS */}
        {activeTab === 'maintenance' && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 text-sm">Suivi des Révisions & Interventions Mécaniques</h3>
            <div className="overflow-x-auto border rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b text-slate-600 font-semibold uppercase">
                  <tr>
                    <th className="p-3">Equipement concerné</th>
                    <th className="p-3">Type Panne / Révision</th>
                    <th className="p-3">Date Planification</th>
                    <th className="p-3">Technicien assigné</th>
                    <th className="p-3">Description intervention</th>
                    <th className="p-3 text-right">Coût estimatif (FCFA)</th>
                    <th className="p-3">Statut de la Fiche</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-slate-700">
                  {maintenances.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50 transition">
                      <td className="p-3 font-bold text-slate-900">{getEquipementName(m.idEquipement)}</td>
                      <td className="p-3 font-semibold text-blue-700">{m.type}</td>
                      <td className="p-3 font-mono">{m.datePlanifiee}</td>
                      <td className="p-3 text-slate-600">{m.technicien}</td>
                      <td className="p-3 italic">"{m.description}"</td>
                      <td className="p-3 text-right font-extrabold text-indigo-600">{m.coûtFCFA.toLocaleString()} FCFA</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 animate-pulse">
                          {m.statut}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW 5: FUEL */}
        {activeTab === 'carburant' && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 text-sm">Gestion du Carburant & Consommation d'engins</h3>
            <div className="overflow-x-auto border rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b text-slate-600 font-semibold uppercase">
                  <tr>
                    <th className="p-3">Date de siphonnage/plein</th>
                    <th className="p-3">Matériel / Engin</th>
                    <th className="p-3 text-center">Volume fourni (Gasoil)</th>
                    <th className="p-3">Chauffeur habilité</th>
                    <th className="p-3 text-right">Dépense de Charge (FCFA)</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-slate-700">
                  {fuelLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 transition">
                      <td className="p-3 font-mono text-slate-500">{log.date}</td>
                      <td className="p-3 font-bold text-slate-900">{getEquipementName(log.idEquipement)}</td>
                      <td className="p-3 text-center font-extrabold text-blue-600">{log.quantiteLitre} Litres</td>
                      <td className="p-3 text-slate-600">{log.chauffeur}</td>
                      <td className="p-3 text-right font-bold text-indigo-600">{log.coûtFCFA.toLocaleString()} FCFA</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* MODALS */}
      {showAddMvt && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4 backdrop-blur-xs text-xs">
          <div className="bg-white rounded-xl max-w-sm w-full border shadow-lg overflow-hidden">
            <div className="bg-blue-600 text-white p-4">
              <h3 className="font-semibold">Enregistrer un mouvement de stock</h3>
            </div>
            <form onSubmit={handleCreateMvt} className="p-4 space-y-3">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Magasin cible</label>
                <select value={newMvtMag} onChange={(e) => setNewMvtMag(e.target.value)} className="w-full border p-2 rounded bg-white">
                  {magasins.map(m => (
                    <option key={m.id} value={m.id}>{m.nom}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">{customLabels?.produitsServices || "Article / Intrant"}</label>
                <select value={newMvtArt} onChange={(e) => setNewMvtArt(e.target.value)} className="w-full border p-2 rounded bg-white">
                  {articles.map(a => (
                    <option key={a.id} value={a.id}>{a.designation}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Type mouvement</label>
                  <select value={newMvtType} onChange={(e) => setNewMvtType(e.target.value as any)} className="w-full border p-2 rounded bg-white">
                    <option value="Entrée">Entrée (Réapprov.)</option>
                    <option value="Sortie">Sortie (Utilisation)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Quantité (Sacs/Kg/L)</label>
                  <input type="number" required value={newMvtQty} onChange={(e) => setNewMvtQty(parseInt(e.target.value) || 0)} className="w-full border p-2 rounded" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Motif</label>
                  <select value={newMvtMotif} onChange={(e) => setNewMvtMotif(e.target.value as any)} className="w-full border p-2 rounded bg-white">
                    <option value="Achat">Achat fournisseur</option>
                    <option value="Consommation Agricole">Traitement agricole</option>
                    <option value="Consommation Élevage">Aliment bêtes</option>
                    <option value="Vente">Vente direct</option>
                    <option value="Perte">Vol ou Perte/Période</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Cout unitaire d'Achat (FCFA)</label>
                  <input type="number" value={newMvtCout} onChange={(e) => setNewMvtCout(parseInt(e.target.value) || 0)} className="w-full border p-2 rounded" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setShowAddMvt(false)} className="bg-slate-100 p-2 rounded">Annuler</button>
                <button type="submit" className="bg-blue-600 text-white p-2 rounded font-bold">Inscrire au grand livre</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddMaint && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4 backdrop-blur-xs text-xs">
          <div className="bg-white rounded-xl max-w-sm w-full border shadow-lg overflow-hidden">
            <div className="bg-blue-600 text-white p-4">
              <h3 className="font-semibold">Créer une fiche technique d'intervention</h3>
            </div>
            <form onSubmit={handleCreateMaint} className="p-4 space-y-3">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Engin / Tracteur *</label>
                <select value={newMaintEq} onChange={(e) => setNewMaintEq(e.target.value)} className="w-full border p-2 rounded bg-white">
                  {equipements.map(e => (
                    <option key={e.id} value={e.id}>{e.designation}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Type de révision</label>
                  <select value={newMaintType} onChange={(e) => setNewMaintType(e.target.value as any)} className="w-full border p-2 rounded bg-white">
                    <option value="Préventive">Préventive (Routine)</option>
                    <option value="Corrective">Panne (Corrective)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Coût Main d'oeuvre (FCFA)</label>
                  <input type="number" value={newMaintCost} onChange={(e) => setNewMaintCost(parseInt(e.target.value) || 0)} className="w-full border p-2 rounded" />
                </div>
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Désignation du Mécanicien / Atelier *</label>
                <input type="text" required value={newMaintTech} onChange={(e) => setNewMaintTech(e.target.value)} className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Symptôme ou description *</label>
                <textarea required value={newMaintDesc} onChange={(e) => setNewMaintDesc(e.target.value)} rows={3} className="w-full border p-2 rounded" />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setShowAddMaint(false)} className="bg-slate-100 p-2 rounded">Annuler</button>
                <button type="submit" className="bg-blue-600 text-white p-2 rounded font-bold">Créer l'ordre de travail</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD PRODUCT TO THE FARM BI-CATALOG */}
      {/* ======================================================== */}
      {showAddBioProd && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4 backdrop-blur-xs text-xs">
          <div className="bg-white rounded-xl max-w-sm w-full border shadow-lg overflow-hidden">
            <div className="bg-indigo-600 text-white p-4">
              <h3 className="font-semibold">Ajouter un produit au catalogue unifié</h3>
            </div>
            <form onSubmit={handleAddBioProdSubmit} className="p-4 space-y-3">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Nom du produit fermier *</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Ex: Fromage de chèvre affiné" 
                  value={newBioProdNom} 
                  onChange={(e) => setNewBioProdNom(e.target.value)} 
                  className="w-full border p-2 rounded" 
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Classification bio</label>
                  <select 
                    value={newBioProdCat} 
                    onChange={(e) => setNewBioProdCat(e.target.value as any)} 
                    className="w-full border p-2 rounded bg-white text-xs"
                  >
                    <option value="Végétal Brut">Végétal Brut</option>
                    <option value="Animal Continu">Animal Continu</option>
                    <option value="Transformé">Produit Transformé</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Unité de mesure</label>
                  <select 
                    value={newBioProdUnit} 
                    onChange={(e) => setNewBioProdUnit(e.target.value as any)} 
                    className="w-full border p-2 rounded bg-white text-xs"
                  >
                    <option value="Kg">Kilogrammes</option>
                    <option value="Litres">Litres</option>
                    <option value="Tonnes">Tonnes</option>
                    <option value="Caisses">Caisses</option>
                    <option value="Sacs">Sacs</option>
                    <option value="Douzaines">Douzaines</option>
                    <option value="Unités">Unités</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Délai conservation (j)</label>
                  <input 
                    type="number" 
                    required 
                    min={1} 
                    value={newBioProdConsMax} 
                    onChange={(e) => setNewBioProdConsMax(parseInt(e.target.value) || 0)} 
                    className="w-full border p-2 rounded text-xs" 
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Prix de Réf. Marché (FCFA)</label>
                  <input 
                    type="number" 
                    required 
                    value={newBioProdPrixMar} 
                    onChange={(e) => setNewBioProdPrixMar(parseInt(e.target.value) || 0)} 
                    className="w-full border p-2 rounded text-xs" 
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setShowAddBioProd(false)} className="bg-slate-100 px-3 py-2 rounded font-medium">Annuler</button>
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded font-bold">Ajouter</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: CREATE STORAGE LOCATION SETUP */}
      {/* ======================================================== */}
      {showAddBioLieu && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4 backdrop-blur-xs text-xs">
          <div className="bg-white rounded-xl max-w-sm w-full border shadow-lg overflow-hidden">
            <div className="bg-indigo-600 text-white p-4">
              <h3 className="font-semibold">Créer un espace de stockage physique</h3>
            </div>
            <form onSubmit={handleAddBioLieuSubmit} className="p-4 space-y-3">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Désignation du lieu *</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Ex: Tank refroidisseur B" 
                  value={newBioLieuNom} 
                  onChange={(e) => setNewBioLieuNom(e.target.value)} 
                  className="w-full border p-2 rounded" 
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Type d'espace</label>
                  <select 
                    value={newBioLieuType} 
                    onChange={(e) => setNewBioLieuType(e.target.value as any)} 
                    className="w-full border p-2 rounded bg-white text-xs"
                  >
                    <option value="Silo">Silo</option>
                    <option value="Chambre Froide">Chambre Froide</option>
                    <option value="Tank à Lait">Tank à Lait</option>
                    <option value="Entrepôt">Entrepôt</option>
                    <option value="Hangar">Hangar</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Capacité maximale volumétrique</label>
                  <input 
                    type="number" 
                    required 
                    min={1} 
                    value={newBioLieuCap} 
                    onChange={(e) => setNewBioLieuCap(parseInt(e.target.value) || 0)} 
                    className="w-full border p-2 rounded text-xs" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Conditions de stockage (Hygro / Température)</label>
                <input 
                  type="text" 
                  placeholder="Ex: Température constante 4°C agité" 
                  value={newBioLieuCond} 
                  onChange={(e) => setNewBioLieuCond(e.target.value)} 
                  className="w-full border p-2 rounded" 
                />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setShowAddBioLieu(false)} className="bg-slate-100 px-3 py-2 rounded font-medium">Annuler</button>
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded font-bold">Créer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: INTEGATED BIOLOGICAL STOCK ENTRY (SEC 4 RULE 6) */}
      {/* ======================================================== */}
      {showAddBioLot && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4 backdrop-blur-xs text-xs">
          <div className="bg-white rounded-xl max-w-md w-full border shadow-lg overflow-hidden">
            <div className="bg-indigo-600 text-white p-4 flex justify-between items-center">
              <h3 className="font-semibold">Entrée de Stock (Traçabilité Amont Fermière)</h3>
              <span className="text-[10px] bg-indigo-800 text-white font-mono px-2 py-0.5 rounded">Règle 6</span>
            </div>
            <form onSubmit={handleAddBioLotSubmit} className="p-4 space-y-3.5">
              
              <div className="bg-indigo-50/75 p-3 rounded-xl border border-indigo-100 space-y-2">
                <label className="block text-slate-700 font-bold mb-1">Origine de la production *</label>
                <div className="grid grid-cols-3 gap-2">
                  <label className="flex items-center gap-1.5 p-2 bg-white rounded border cursor-pointer hover:bg-slate-50">
                    <input 
                      type="radio" 
                      name="bioOrigine"
                      checked={newBioLotOrigine === 'Récolte'}
                      onChange={() => {
                        setNewBioLotOrigine('Récolte');
                        if (recoltes && recoltes.length > 0) {
                          setNewBioLotOrigineId(recoltes[0].id);
                          // Guess the product if possible (e.g. contain Maïs or Plantain)
                          const mappedProd = produitsAgricoles.find(p => p.nom.toLowerCase().includes('maïs') || p.nom.toLowerCase().includes('grain'));
                          if (mappedProd) setNewBioLotProd(mappedProd.id);
                        }
                      }}
                    />
                    <span>Récolte</span>
                  </label>
                  <label className="flex items-center gap-1.5 p-2 bg-white rounded border cursor-pointer hover:bg-slate-50">
                    <input 
                      type="radio" 
                      name="bioOrigine"
                      checked={newBioLotOrigine === 'ProductionContinue'}
                      onChange={() => {
                        setNewBioLotOrigine('ProductionContinue');
                        if (prodElevages && prodElevages.length > 0) {
                          setNewBioLotOrigineId(prodElevages[0].id);
                          const mappedProd = produitsAgricoles.find(p => p.nom.toLowerCase().includes('lait') || p.nom.toLowerCase().includes('vache'));
                          if (mappedProd) setNewBioLotProd(mappedProd.id);
                        }
                      }}
                    />
                    <span>Élevage</span>
                  </label>
                  <label className="flex items-center gap-1.5 p-2 bg-white rounded border cursor-pointer hover:bg-slate-50">
                    <input 
                      type="radio" 
                      name="bioOrigine"
                      checked={newBioLotOrigine === 'Achat'}
                      onChange={() => {
                        setNewBioLotOrigine('Achat');
                        setNewBioLotOrigineId('');
                      }}
                    />
                    <span>Achat Ext.</span>
                  </label>
                </div>

                {/* Sub mapping to real DB structures */}
                {newBioLotOrigine === 'Récolte' && (
                  <div className="space-y-1">
                    <label className="block text-slate-600 font-semibold mb-1">Lier à la récolte végétale active :</label>
                    <select 
                      value={newBioLotOrigineId} 
                      onChange={(e) => {
                        const recId = e.target.value;
                        setNewBioLotOrigineId(recId);
                        const rObj = recoltes.find(x => x.id === recId);
                        if (rObj) {
                          setNewBioLotQty(rObj.quantite);
                          // Auto set quality / health warning
                          if (rObj.statutSanitaire === '⚠️ Résidus Suspects') {
                            setNewBioLotQual('Alerte Qualité (Lock Sanitaire)');
                          } else {
                            setNewBioLotQual(rObj.statutSanitaire || 'Standard');
                          }
                        }
                      }}
                      className="w-full border p-2 rounded bg-white text-xs text-slate-700"
                    >
                      {recoltes && recoltes.length > 0 ? (
                        recoltes.map(r => (
                          <option key={r.id} value={r.id}>
                            [{r.id}] Récolte {r.idCulture.replace('cult-', '')} du {r.date} - {r.quantite} Kg ({r.statutSanitaire || 'Sain'})
                          </option>
                        ))
                      ) : (
                        <option value="">Aucune récolte enregistrée</option>
                      )}
                    </select>
                  </div>
                )}

                {newBioLotOrigine === 'ProductionContinue' && (
                  <div className="space-y-1">
                    <label className="block text-slate-600 font-semibold mb-1">Lier à la collecte quotidienne élevage :</label>
                    <select 
                      value={newBioLotOrigineId} 
                      onChange={(e) => {
                        const prId = e.target.value;
                        setNewBioLotOrigineId(prId);
                        const pObj = prodElevages.find(x => x.id === prId);
                        if (pObj) {
                          setNewBioLotQty(pObj.quantite);
                        }
                      }}
                      className="w-full border p-2 rounded bg-white text-xs text-slate-700"
                    >
                      {prodElevages && prodElevages.length > 0 ? (
                        prodElevages.map(p => (
                          <option key={p.id} value={p.id}>
                            [{p.id}] Collecte {p.type} du {p.date} - {p.quantite} {p.unite}
                          </option>
                        ))
                      ) : (
                        <option value="">Aucun journal de traite/oeufs</option>
                      )}
                    </select>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Produit à stocker</label>
                  <select 
                    value={newBioLotProd} 
                    onChange={(e) => setNewBioLotProd(e.target.value)} 
                    className="w-full border p-2 rounded bg-white"
                  >
                    {produitsAgricoles.map(p => (
                      <option key={p.id} value={p.id}>{p.nom} ({p.uniteReference})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Emplacement de stockage</label>
                  <select 
                    value={newBioLotLieu} 
                    onChange={(e) => setNewBioLotLieu(e.target.value)} 
                    className="w-full border p-2 rounded bg-white"
                  >
                    {lieuxDeStockage.map(l => (
                      <option key={l.id} value={l.id}>{l.nom}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Quantité entrée</label>
                  <input 
                    type="number" 
                    required 
                    min={1} 
                    value={newBioLotQty} 
                    onChange={(e) => setNewBioLotQty(parseInt(e.target.value) || 0)} 
                    className="w-full border p-2 rounded" 
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Qualité constatée</label>
                  <select 
                    value={newBioLotQual} 
                    onChange={(e) => setNewBioLotQual(e.target.value)} 
                    className="w-full border p-2 rounded bg-white"
                  >
                    <option value="Premium">Premium / Certifié Sans Résidus</option>
                    <option value="Standard">Standard / Conforme</option>
                    <option value="Alerte Qualité (Lock Sanitaire)">Non-Conforme / DAR en cours</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Coût de Production unitaire (FCFA)</label>
                  <input 
                    type="number" 
                    required 
                    value={newBioLotCoutProd} 
                    onChange={(e) => setNewBioLotCoutProd(parseInt(e.target.value) || 0)} 
                    className="w-full border p-2 rounded font-mono" 
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Opérateur de stockage</label>
                  <input 
                    type="text" 
                    required 
                    value={newBioLotOperator} 
                    onChange={(e) => setNewBioLotOperator(e.target.value)} 
                    className="w-full border p-2 rounded" 
                  />
                </div>
              </div>

              <div className="bg-amber-50 rounded-lg p-2.5 border border-amber-100 text-[10px] text-amber-800 leading-tight">
                ⚠️ <strong>Note Traçabilité</strong> : L'enregistrement d'un lot va générer une entrée d'inventaire théorique saine, sauf si l'origine comporte un DAR actif (Règle 3).
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddBioLot(false)} className="bg-slate-100 px-3 py-2 rounded font-semibold">Annuler</button>
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded font-bold">Inscrire en stock lot</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: FIFO / MANUAL STOCK SALES AND DEPLETON FLOW */}
      {/* ======================================================== */}
      {showAddBioVente && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4 backdrop-blur-xs text-xs">
          <div className="bg-white rounded-xl max-w-sm w-full border shadow-lg overflow-hidden">
            <div className="bg-emerald-600 text-white p-4 flex justify-between items-center">
              <h3 className="font-semibold">Vente & Sortie de Stock Atomique</h3>
              <span className="text-[10px] bg-emerald-800 text-white font-mono px-2 py-0.5 rounded">FIFO Règle 1 & 3</span>
            </div>
            <form onSubmit={handleAddBioVenteSubmit} className="p-4 space-y-3.5">
              
              <div>
                <label className="block text-slate-600 font-medium mb-1">Méthode de déplétion du stock</label>
                <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
                  <button 
                    type="button" 
                    onClick={() => {
                      setNewBioVenteMethod('FIFO');
                      if (produitsAgricoles.length > 0) setNewBioVenteProdId(produitsAgricoles[0].id);
                    }}
                    className={`flex-1 py-1.5 text-center text-xs font-bold rounded ${newBioVenteMethod === 'FIFO' ? 'bg-white shadow-3xs text-emerald-700' : 'text-slate-500'}`}
                  >
                    Automatique FIFO (Sain)
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      setNewBioVenteMethod('Manuel');
                      const activeLots = lotsDeStock.filter(l => l.quantiteDisponible > 0);
                      if (activeLots.length > 0) setNewBioVenteLot(activeLots[0].id);
                    }}
                    className={`flex-1 py-1.5 text-center text-xs font-bold rounded ${newBioVenteMethod === 'Manuel' ? 'bg-white shadow-3xs text-emerald-700' : 'text-slate-500'}`}
                  >
                    Sélectionner un Lot précis
                  </button>
                </div>
              </div>

              {newBioVenteMethod === 'FIFO' ? (
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Sélectionner le produit fermier à écouler</label>
                  <select 
                    value={newBioVenteProdId} 
                    onChange={(e) => {
                      const pId = e.target.value;
                      setNewBioVenteProdId(pId);
                      setNewBioVentePrixUnit(getBioProdRefPrice(pId));
                    }} 
                    className="w-full border p-2 rounded bg-white"
                  >
                    {produitsAgricoles.map(p => (
                      <option key={p.id} value={p.id}>{p.nom} (Unit: {p.uniteReference})</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Sélectionner le lot unifié à inspecter</label>
                  <select 
                    value={newBioVenteLot} 
                    onChange={(e) => {
                      const lId = e.target.value;
                      setNewBioVenteLot(lId);
                      const lotSelect = lotsDeStock.find(l => l.id === lId);
                      if (lotSelect) setNewBioVentePrixUnit(getBioProdRefPrice(lotSelect.idProduit));
                    }} 
                    className="w-full border p-2 rounded bg-white text-xs"
                  >
                    {lotsDeStock.filter(l => l.quantiteDisponible > 0).map(l => (
                      <option key={l.id} value={l.id}>
                        [{l.id}] {getBioProdName(l.idProduit)} (Dispo: {l.quantiteDisponible} {getBioProdUnit(l.idProduit)}) {l.statut === 'Bloqué' ? '⚠️ BLOQUÉ' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Quantité à vendre</label>
                  <input 
                    type="number" 
                    required 
                    min={1} 
                    value={newBioVenteQty} 
                    onChange={(e) => setNewBioVenteQty(parseInt(e.target.value) || 0)} 
                    className="w-full border p-2 rounded" 
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Prix unitaire convenu (FCFA)</label>
                  <input 
                    type="number" 
                    required 
                    value={newBioVentePrixUnit} 
                    onChange={(e) => setNewBioVentePrixUnit(parseInt(e.target.value) || 0)} 
                    className="w-full border p-2 rounded font-mono" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Canal commercial</label>
                  <input 
                    type="text" 
                    required 
                    value={newBioVenteCanal} 
                    onChange={(e) => setNewBioVenteCanal(e.target.value)} 
                    className="w-full border p-2 rounded" 
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Désignation Acheteur / Client</label>
                  <input 
                    type="text" 
                    required 
                    value={newBioVenteAcheteur} 
                    onChange={(e) => setNewBioVenteAcheteur(e.target.value)} 
                    className="w-full border p-2 rounded" 
                  />
                </div>
              </div>

              <div className="bg-slate-50 border p-2.5 rounded-lg flex justify-between font-mono font-bold text-xs">
                <span className="text-slate-600">Montant Total de la transaction:</span>
                <span className="text-emerald-700">{(newBioVenteQty * newBioVentePrixUnit).toLocaleString()} FCFA</span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddBioVente(false)} className="bg-slate-100 px-3 py-2 rounded font-semibold">Annuler</button>
                <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded font-bold">Confirmer l'expédition</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: SUBSTANCIAL STORAGE HAZARD / LOSS RECORDING (ALÉAS) */}
      {/* ======================================================== */}
      {showAddBioAlea && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4 backdrop-blur-xs text-xs">
          <div className="bg-white rounded-xl max-w-sm w-full border shadow-lg overflow-hidden">
            <div className="bg-rose-600 text-white p-4">
              <h3 className="font-semibold">Déclarer un Aléa de Stockage (Perte physique)</h3>
            </div>
            <form onSubmit={handleAddBioAleaSubmit} className="p-4 space-y-3.5">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Lot de stock impacté *</label>
                <select 
                  value={newBioAleaLot} 
                  onChange={(e) => setNewBioAleaLot(e.target.value)} 
                  className="w-full border p-2 rounded bg-white text-xs font-mono font-bold text-slate-700"
                >
                  {lotsDeStock.filter(l => l.quantiteDisponible > 0).map(l => (
                    <option key={l.id} value={l.id}>
                      [{l.id}] {getBioProdName(l.idProduit)} (En Stock: {l.quantiteDisponible})
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Nature de la perte</label>
                  <select 
                    value={newBioAleaType} 
                    onChange={(e) => setNewBioAleaType(e.target.value as any)} 
                    className="w-full border p-2 rounded bg-white text-xs"
                  >
                    <option value="Dégradation">Dégradation naturelle</option>
                    <option value="Péremption">Péremption / Délai atteint</option>
                    <option value="Vol">Vol suspecté</option>
                    <option value="Nuisibles">Rongeurs / Nuisibles</option>
                    <option value="Froid Rompu">Rupture de chaîne du froid</option>
                    <option value="Casse">Détérioration mécanique (Casse)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Quantité détruite/perdue</label>
                  <input 
                    type="number" 
                    required 
                    min={1} 
                    value={newBioAleaQty} 
                    onChange={(e) => setNewBioAleaQty(parseInt(e.target.value) || 0)} 
                    className="w-full border p-2 rounded" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Observations / Rapport d'incident détaillé</label>
                <textarea 
                  required 
                  placeholder="Ex: Analyse des fûts défectueux ayant rompus d'humidité..." 
                  value={newBioAleaObs} 
                  onChange={(e) => setNewBioAleaObs(e.target.value)} 
                  rows={3} 
                  className="w-full border p-2 rounded text-xs" 
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddBioAlea(false)} className="bg-slate-100 px-3 py-2 rounded font-semibold">Annuler</button>
                <button type="submit" className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-2 rounded font-bold">Consigner la perte</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: BIOLOGICAL PRODUCTION TRANSFORMATION (RECIPES) */}
      {/* ======================================================== */}
      {showAddBioTrans && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4 backdrop-blur-xs text-xs">
          <div className="bg-white rounded-xl max-w-sm w-full border shadow-lg overflow-hidden">
            <div className="bg-amber-600 text-white p-4">
              <h3 className="font-semibold">Transformation & Recyclage (Bio-Process)</h3>
            </div>
            <form onSubmit={handleAddBioTransSubmit} className="p-4 space-y-3.5">
              
              <div className="p-3 bg-amber-50 rounded-lg space-y-2 border border-amber-100">
                <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider">Étape 1 : Consommer l'ingrédient de base</span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Lot d'intrant à consommer</label>
                    <select 
                      value={newBioTransLotInput} 
                      onChange={(e) => setNewBioTransLotInput(e.target.value)} 
                      className="w-full border p-1 rounded bg-white text-xs font-mono font-bold"
                    >
                      {lotsDeStock.filter(l => l.quantiteDisponible > 0).map(l => (
                        <option key={l.id} value={l.id}>
                          [{l.id}] {getBioProdName(l.idProduit)} (Dispo: {l.quantiteDisponible})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Quantité à retirer</label>
                    <input 
                      type="number" 
                      required 
                      min={1} 
                      value={newBioTransQtyInput} 
                      onChange={(e) => setNewBioTransQtyInput(parseInt(e.target.value) || 0)} 
                      className="w-full border p-1 rounded" 
                    />
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-lg space-y-2 border border-emerald-100">
                <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">Étape 2 : Produire l'extrant transformé</span>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Extrant cible (Catalogue : Catégorie Transformé)</label>
                  <select 
                    value={newBioTransProdOutput} 
                    onChange={(e) => setNewBioTransProdOutput(e.target.value)} 
                    className="w-full border p-1 rounded bg-white text-xs"
                  >
                    {produitsAgricoles.map(p => (
                      <option key={p.id} value={p.id}>[{p.nom}] - Réf: {p.prixReferenceMarche} FCFA</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Quantité obtenue</label>
                    <input 
                      type="number" 
                      required 
                      min={1} 
                      value={newBioTransQtyOutput} 
                      onChange={(e) => setNewBioTransQtyOutput(parseInt(e.target.value) || 0)} 
                      className="w-full border p-1 rounded font-bold" 
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Emplacement de stockage cible</label>
                    <select 
                      value={newBioTransLieuOutput} 
                      onChange={(e) => setNewBioTransLieuOutput(e.target.value)} 
                      className="w-full border p-1 bg-white rounded text-xs"
                    >
                      {lieuxDeStockage.map(l => (
                        <option key={l.id} value={l.id}>{l.nom}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Frais de transformation supplémentaires (Energie, main-d'oeuvre) (FCFA)</label>
                <input 
                  type="number" 
                  required 
                  value={newBioTransCoutExtra} 
                  onChange={(e) => setNewBioTransCoutExtra(parseInt(e.target.value) || 0)} 
                  className="w-full border p-2 rounded font-mono text-xs" 
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddBioTrans(false)} className="bg-slate-100 px-3 py-2 rounded font-semibold">Annuler</button>
                <button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-2 rounded font-bold">Lancer le traitement</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddBioAudit && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4 backdrop-blur-xs text-xs">
          <div className="bg-white rounded-xl max-w-md w-full border shadow-lg overflow-hidden">
            <div className="bg-slate-700 text-white p-4">
              <h3 className="font-semibold">Audit de Stock - Saisie Physique Relevée</h3>
            </div>
            <form onSubmit={handleAddBioAuditSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Emplacement géographique audité</label>
                <select 
                  value={newBioAuditLieu} 
                  onChange={(e) => {
                    const lId = e.target.value;
                    setNewBioAuditLieu(lId);
                    // Match quantities
                    const inLieuLots = lotsDeStock.filter(l => l.idLieuStockage === lId && l.quantiteDisponible > 0);
                    const qMap: Record<string, number> = {};
                    inLieuLots.forEach(l => { qMap[l.id] = l.quantiteDisponible; });
                    setAuditQuantities(qMap);
                  }} 
                  className="w-full border p-2 rounded bg-white text-xs"
                >
                  {lieuxDeStockage.map(l => (
                    <option key={l.id} value={l.id}>{l.nom} ({l.type})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2 border-t pt-3.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Saisie des écarts par lot :</span>
                
                <div className="space-y-2 overflow-y-auto max-h-[220px]">
                  {lotsDeStock.filter(l => l.idLieuStockage === newBioAuditLieu && l.quantiteDisponible > 0).length === 0 ? (
                    <p className="text-slate-400 italic text-center py-4">Aucun lot de stock actif dans cet emplacement.</p>
                  ) : (
                    lotsDeStock.filter(l => l.idLieuStockage === newBioAuditLieu && l.quantiteDisponible > 0).map(l => {
                      const computedTheory = l.quantiteDisponible;
                      const enteredVal = auditQuantities[l.id] !== undefined ? auditQuantities[l.id] : computedTheory;
                      const calculatedEcart = enteredVal - computedTheory;

                      return (
                        <div key={l.id} className="p-2 bg-slate-50 rounded border space-y-2">
                          <div className="flex justify-between items-center text-[11px]">
                            <span className="font-mono font-bold text-slate-900">{l.id} - {getBioProdName(l.idProduit)}</span>
                            <span className="text-slate-500">Calculé : {computedTheory} {getBioProdUnit(l.idProduit)}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <label className="text-[10px] text-slate-550 shrink-0">Comptage physique :</label>
                            <input 
                              type="number"
                              required
                              value={enteredVal}
                              onChange={(e) => {
                                const val = parseInt(e.target.value) || 0;
                                setAuditQuantities({
                                  ...auditQuantities,
                                  [l.id]: val
                                });
                              }}
                              className="w-20 border text-center p-1 rounded font-mono font-bold text-xs bg-white text-slate-900"
                            />
                            
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ml-auto ${
                              calculatedEcart > 0 ? 'bg-emerald-100 text-emerald-800' :
                              calculatedEcart < 0 ? 'bg-rose-100 text-rose-800 animate-pulse' :
                              'bg-slate-200 text-slate-650'
                            }`}>
                              Écart: {calculatedEcart > 0 ? '+' : ''}{calculatedEcart}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="bg-slate-50 rounded p-2 text-[10px] text-slate-550 leading-tight border">
                ⚠️ En cliquant sur finaliser, le système va autogénérer des corrections comptables de types "ajustement_inventaire". Tout écart négatif sera inscrit au registre des freintes ( pertes de stockage ).
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddBioAudit(false)} className="bg-slate-100 px-3 py-2 rounded font-semibold">Annuler</button>
                <button type="submit" className="bg-slate-700 hover:bg-slate-800 text-white px-3 py-2 rounded font-bold">Finaliser l'état</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddFuel && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4 backdrop-blur-xs text-xs">
          <div className="bg-white rounded-xl max-w-sm w-full border shadow-lg overflow-hidden">
            <div className="bg-blue-600 text-white p-4">
              <h3 className="font-semibold">Log de ravitaillement fuel (Gasoil)</h3>
            </div>
            <form onSubmit={handleCreateFuel} className="p-4 space-y-3">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Matériel de transport / Tracteur *</label>
                <select value={newFuelEq} onChange={(e) => setNewFuelEq(e.target.value)} className="w-full border p-2 rounded bg-white">
                  {equipements.map(e => (
                    <option key={e.id} value={e.id}>{e.designation}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Litres Gasoil fournis *</label>
                  <input type="number" required value={newFuelQty} onChange={(e) => setNewFuelQty(parseInt(e.target.value) || 0)} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Coût global (FCFA) *</label>
                  <input type="number" required value={newFuelCost} onChange={(e) => setNewFuelCost(parseInt(e.target.value) || 0)} className="w-full border p-2 rounded" />
                </div>
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Chauffeur habilité *</label>
                <input type="text" required value={newFuelChauff} onChange={(e) => setNewFuelChauff(e.target.value)} className="w-full border p-2 rounded" />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setShowAddFuel(false)} className="bg-slate-100 p-2 rounded">Annuler</button>
                <button type="submit" className="bg-blue-600 text-white p-2 rounded font-bold">Affecter le plein</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
