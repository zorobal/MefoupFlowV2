/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Exploitation,
  SiteAgricole,
  Parcelle,
  Campagne,
  Culture,
  Intervention,
  Recolte,
  IncidentAgricole,
  SiteElevage,
  Batiment,
  Champ
} from '../types';
import {
  Sprout,
  Compass,
  MapPin,
  Flame,
  User,
  Calendar,
  Layers,
  PlusCircle,
  FileCheck,
  TrendingUp,
  LineChart,
  Trash2,
  DollarSign,
  Map,
  Locate,
  Warehouse,
  Eye,
  Activity,
  Check,
  Lock,
  Unlock,
  AlertTriangle,
  RefreshCw,
  FileText,
  HelpCircle
} from 'lucide-react';

interface AgricultureModuleProps {
  exploitations: Exploitation[];
  sites: SiteAgricole[];
  champs: Champ[];
  parcelles: Parcelle[];
  campagnes: Campagne[];
  cultures: Culture[];
  interventions: Intervention[];
  recoltes: Recolte[];
  incidents: IncidentAgricole[];
  sitesElevage?: SiteElevage[];
  batiments?: Batiment[];
  onAddExploitation: (exp: Exploitation) => void;
  onAddParcelle: (par: Parcelle) => void;
  onAddCulture: (cult: Culture) => void;
  onUpdateCulture?: (cult: Culture) => void;
  onAddIncident?: (inc: IncidentAgricole) => void;
  onAddIntervention: (inter: Intervention) => void;
  onAddRecolte: (rec: Recolte) => void;
  onAddChamp: (champ: Champ) => void;
  onUpdateChamp: (champ: Champ) => void;
  onDeleteChamp: (id: string) => void;
  onUpdateParcelle?: (par: Parcelle) => void;
  typesCulture?: string[];
  typesOperation?: string[];
  responsablesTerrain?: {name: string, type: 'Employé' | 'Prestataire Externe', info: string}[];
  substances?: {name: string, type: string, description: string}[];
  customLabels?: any;
}

export default function AgricultureModule({
  exploitations,
  sites,
  champs,
  parcelles,
  campagnes,
  cultures,
  interventions,
  recoltes,
  incidents,
  sitesElevage = [],
  batiments = [],
  onAddExploitation,
  onAddParcelle,
  onAddCulture,
  onUpdateCulture,
  onAddIncident,
  onAddIntervention,
  onAddRecolte,
  onAddChamp,
  onUpdateChamp,
  onDeleteChamp,
  onUpdateParcelle,
  typesCulture = ['Maïs Grain', 'Cacao', 'Tomate de Table', 'Haricots', 'Banane Plantain'],
  typesOperation = ['Labour', 'Semis', 'Fertilisation', 'Irrigation', 'Traitement phytosanitaire', 'Récolte'],
  responsablesTerrain = [
    { name: 'Jean-Pierre Ondoa', type: 'Employé', info: 'Chef de Champ' }
  ],
  substances = [
    { name: 'Engrais NPK 20-10-10', type: 'Fertilisant', description: 'Favorise la croissance végétale' }
  ],
  customLabels
}: AgricultureModuleProps) {
  const [activeTab, setActiveTab] = useState<'exploitations' | 'parcelles' | 'cultures' | 'interventions' | 'recoltes' | 'champs'>('cultures');
  
  // Track selected exploitation for detailed site mapping & multi-farm consolidation
  const [selectedExploitationId, setSelectedExploitationId] = useState<string>(exploitations[0]?.id || 'exp-1');

  // Form states
  const [showAddExploitation, setShowAddExploitation] = useState(false);
  const [showAddParcelle, setShowAddParcelle] = useState(false);
  const [showAddCulture, setShowAddCulture] = useState(false);
  const [showAddIntervention, setShowAddIntervention] = useState(false);
  const [showAddRecolte, setShowAddRecolte] = useState(false);

  // New item state holders
  const [newExpNom, setNewExpNom] = useState('');
  const [newExpCode, setNewExpCode] = useState('');
  const [newExpSurf, setNewExpSurf] = useState(120);
  const [newExpSurfCultivable, setNewExpSurfCultivable] = useState(100);
  const [newExpVille, setNewExpVille] = useState('Obala');
  const [newExpRegion, setNewExpRegion] = useState('Centre');
  const [newExpType, setNewExpType] = useState<'Végétale' | 'Élevage' | 'Mixte' | 'Agro-industrielle'>('Mixte');
  const [newExpResponsable, setNewExpResponsable] = useState('Jean-Pierre Ondoa');
  const [newExpDesc, setNewExpDesc] = useState('Nouvelle exploitation foncière.');
  const [newExpLat, setNewExpLat] = useState(4.1667);
  const [newExpLng, setNewExpLng] = useState(11.5333);

  const [newParNom, setNewParNom] = useState('');
  const [newParCode, setNewParCode] = useState('');
  const [newParSurf, setNewParSurf] = useState(5.0);
  const [newParSol, setNewParSol] = useState('Argilo-humifère');
  const [newParPh, setNewParPh] = useState(6.0);
  const [newParEau, setNewParEau] = useState('Forage motopompe');
  const [newParChampId, setNewParChampId] = useState('');
  const [newParLat, setNewParLat] = useState(4.1680);
  const [newParLng, setNewParLng] = useState(11.5340);
  const [newParExpertValide, setNewParExpertValide] = useState(true);
  const [newParExpertDesc, setNewParExpertDesc] = useState('Analyse préliminaire favorable.');

  // Fields (Champs) state managers
  const [showAddChamp, setShowAddChamp] = useState(false);
  const [selectedChampForEdit, setSelectedChampForEdit] = useState<Champ | null>(null);
  const [newChampNom, setNewChampNom] = useState('');
  const [newChampCode, setNewChampCode] = useState('');
  const [newChampVille, setNewChampVille] = useState('Obala');
  const [newChampLocalite, setNewChampLocalite] = useState('Secteur Nord Maraîchage');
  const [newChampCoordonneesGps, setNewChampCoordonneesGps] = useState('4.1680, 11.5340');

  const [newCultNom, setNewCultNom] = useState('Maïs Grain');
  const [newCultVariete, setNewCultVariete] = useState('Pioneer Hybride');
  const [newCultParcelle, setNewCultParcelle] = useState(parcelles[0]?.id || '');
  const [newCultCampagne, setNewCultCampagne] = useState(campagnes[0]?.id || '');
  const [newCultSurf, setNewCultSurf] = useState(5);
  const [newCultCible, setNewCultCible] = useState(4000);
  const [newCultBudget, setNewCultBudget] = useState(650000);
  const [newCultPrixVentePrev, setNewCultPrixVentePrev] = useState(380);
  const [newCultIsLouee, setNewCultIsLouee] = useState(false);
  const [newCultCoutLocation, setNewCultCoutLocation] = useState(0);
  const [newCultStatutInit, setNewCultStatutInit] = useState<'Planifiée' | 'Active'>('Active');

  // Aléas (Loss events/Incidents) state managers
  const [showAddIncidentModal, setShowAddIncidentModal] = useState(false);
  const [newIncType, setNewIncType] = useState<'Sécheresse' | 'Inondation' | 'Incendie' | 'Vol' | 'Maladies' | 'Ravageurs'>('Maladies');
  const [newIncDescription, setNewIncDescription] = useState('Attaque de chenilles légionnaires d\'automne.');
  const [newIncTauxPerte, setNewIncTauxPerte] = useState(15); // 15% loss
  const [newIncSurfaceImpactee, setNewIncSurfaceImpactee] = useState(1); // 1 Ha
  const [newIncCultureId, setNewIncCultureId] = useState('');

  const [newInterType, setNewInterType] = useState<'Labour' | 'Semis' | 'Fertilisation' | 'Irrigation' | 'Traitement phytosanitaire' | 'Récolte'>('Labour');
  const [newInterCulture, setNewInterCulture] = useState(cultures[0]?.id || '');
  const [newInterIntrant, setNewInterIntrant] = useState('');
  const [newInterIntrantQ, setNewInterIntrantQ] = useState(0);
  const [newInterIntrantU, setNewInterIntrantU] = useState('Kg');
  const [newInterCost, setNewInterCost] = useState(15000);
  const [newInterResp, setNewInterResp] = useState('Jean-Pierre Ondoa');
  const [newInterDarDays, setNewInterDarDays] = useState<number>(0);

  // Track plot selection FIRST and matching crop cycle SECOND for harvest logging
  const [newRecParcelle, setNewRecParcelle] = useState(parcelles[0]?.id || '');
  const [newRecCulture, setNewRecCulture] = useState(cultures[0]?.id || '');
  const [newRecQuant, setNewRecQuant] = useState(500);
  const [newRecQual, setNewRecQual] = useState<'Premium' | 'Standard' | 'Rejet'>('Premium');
  const [newRecUnit, setNewRecUnit] = useState<'Kg' | 'Tonnes' | 'Sacs'>('Kg');
  const [newRecPrice, setNewRecPrice] = useState(300);
  const [newRecStatutSanitaire, setNewRecStatutSanitaire] = useState<'Conforme' | '⚠️ Résidus Suspects'>('Conforme');
  const [newRecNoteSanitaire, setNewRecNoteSanitaire] = useState<string>('');

  // Active Crop Logbook (Cahier Cultural Expert Option)
  const [selectedCahierCultId, setSelectedCahierCultId] = useState<string | null>(null);

  const isCultureUnderDar = (cultureId: string) => {
    const activeInterventionsOfThisCulture = interventions.filter(i => i.idCulture === cultureId);
    const phytosanitaryInterventions = activeInterventionsOfThisCulture.filter(
      i => i.type === 'Traitement phytosanitaire' && i.darExpiration
    );
    if (phytosanitaryInterventions.length === 0) return null;
    const todayStr = new Date().toISOString().split('T')[0];
    const activeDars = phytosanitaryInterventions.filter(i => i.darExpiration && i.darExpiration >= todayStr);
    if (activeDars.length > 0) {
      activeDars.sort((a, b) => b.darExpiration!.localeCompare(a.darExpiration!));
      return activeDars[0];
    }
    return null;
  };

  // Math totals for dashboard
  const totalHectares = parcelles.reduce((acc, p) => acc + p.surface, 0);
  const activeCropsCount = cultures.filter(c => c.statut === 'Active').length;

  const handleCreateExploitation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpNom) return;
    const generatedId = 'exp-' + Math.floor(Math.random() * 10000);
    const newExp: Exploitation = {
      id: generatedId,
      code: (newExpCode || 'EXP-' + Math.floor(100+Math.random()*900)).toUpperCase(),
      nom: newExpNom,
      description: newExpDesc || 'Exploitation agro-pastorale.',
      typeExploitation: newExpType,
      responsable: newExpResponsable || 'Jean-Pierre Ondoa',
      pays: 'Cameroun',
      region: newExpRegion || 'Centre',
      ville: newExpVille || 'Obala',
      latitude: newExpLat || 4.1667,
      longitude: newExpLng || 11.5333,
      surfaceTotale: newExpSurf || 100,
      surfaceCultivable: newExpSurfCultivable || (newExpSurf * 0.85),
      dateCreation: new Date().toISOString().split('T')[0],
      statut: 'Actif'
    };
    onAddExploitation(newExp);
    setSelectedExploitationId(generatedId);
    setShowAddExploitation(false);
    // Reset form
    setNewExpNom('');
    setNewExpCode('');
    setNewExpDesc('Nouvelle exploitation foncière.');
  };

  const handleCreateParcelle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newParNom || !newParCode) return;
    const newPar: Parcelle = {
      id: 'par-' + Math.floor(Math.random() * 10000),
      idSite: 'site-1',
      idChamp: newParChampId || undefined,
      code: newParCode,
      nom: newParNom,
      surface: newParSurf,
      latitude: newParLat,
      longitude: newParLng,
      typeSol: newParSol,
      ph: newParPh,
      sourceEau: newParEau,
      expertValide: newParExpertValide,
      expertDescription: newParExpertDesc
    };
    onAddParcelle(newPar);
    setShowAddParcelle(false);
    // Reset states
    setNewParNom('');
    setNewParCode('');
    setNewParSurf(5.0);
    setNewParSol('Argilo-humifère');
    setNewParPh(6.0);
    setNewParEau('Forage motopompe');
    setNewParChampId('');
    setNewParLat(4.1680);
    setNewParLng(11.5340);
    setNewParExpertValide(true);
    setNewParExpertDesc('Analyse préliminaire favorable.');
  };

  const handleCreateChamp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChampNom) return;
    const finalCode = (newChampCode || 'REF-CMP-' + Math.floor(100 + Math.random() * 900)).toUpperCase();
    const generatedChamp: Champ = {
      id: 'champ-' + Math.floor(Math.random() * 10000),
      code: finalCode,
      nom: newChampNom,
      ville: newChampVille,
      localite: newChampLocalite,
      coordonneesGps: newChampCoordonneesGps
    };
    onAddChamp(generatedChamp);
    setShowAddChamp(false);
    // Reset
    setNewChampNom('');
    setNewChampCode('');
    setNewChampVille('Obala');
    setNewChampLocalite('Secteur Nord Maraîchage');
    setNewChampCoordonneesGps('4.1680, 11.5340');
  };

  const handleEditChampSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChampForEdit) return;
    const updated: Champ = {
      ...selectedChampForEdit,
      nom: newChampNom,
      code: newChampCode,
      ville: newChampVille,
      localite: newChampLocalite,
      coordonneesGps: newChampCoordonneesGps
    };
    onUpdateChamp(updated);
    setSelectedChampForEdit(null);
    setShowAddChamp(false);
    // Reset
    setNewChampNom('');
    setNewChampCode('');
    setNewChampVille('Obala');
    setNewChampLocalite('Secteur Nord Maraîchage');
    setNewChampCoordonneesGps('4.1680, 11.5340');
  };

  const startEditChamp = (champ: Champ) => {
    setSelectedChampForEdit(champ);
    setNewChampNom(champ.nom);
    setNewChampCode(champ.code);
    setNewChampVille(champ.ville);
    setNewChampLocalite(champ.localite);
    setNewChampCoordonneesGps(champ.coordonneesGps);
    setShowAddChamp(true);
  };

  const handleCreateCulture = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCultNom) return;

    // Check if the selected plot has enough space based on previous states
    const targetParcelle = parcelles.find(p => p.id === newCultParcelle);
    if (!targetParcelle) return;

    const occupiedSurf = cultures
      .filter(c => c.idParcelle === targetParcelle.id && c.statut === 'Active')
      .reduce((sum, c) => sum + c.surfaceCultivee, 0);
    const availableSurf = targetParcelle.surface - occupiedSurf;

    if (newCultSurf > availableSurf) {
      alert(`Surface disponible insuffisante sur la parcelle "${targetParcelle.nom}". disponible: ${availableSurf.toFixed(2)} Ha, demandé: ${newCultSurf} Ha.`);
      return;
    }

    const newCult: Culture = {
      id: 'cult-' + Math.floor(Math.random() * 10000),
      idCampagne: newCultCampagne,
      idParcelle: newCultParcelle,
      responsable: 'Jean-Pierre Ondoa',
      nom: newCultNom,
      variete: newCultVariete,
      surfaceCultivee: newCultSurf,
      dateSemis: new Date().toISOString().split('T')[0],
      dateRecoltePrevue: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      rendementCible: newCultCible,
      statut: newCultStatutInit,
      budgetPrevisionnel: newCultBudget,
      prixVentePrevisionnel: newCultPrixVentePrev,
      isLouee: newCultIsLouee,
      coutLocation: newCultIsLouee ? newCultCoutLocation : 0
    };

    onAddCulture(newCult);

    // Decrement the parcel's surface as requested "Et quant cela est fait on decremente la surface de la parcelle choisie."
    if (onUpdateParcelle) {
      onUpdateParcelle({
        ...targetParcelle,
        surface: Math.max(0, targetParcelle.surface - newCultSurf)
      });
    }

    setShowAddCulture(false);
  };

  const handleCreateIntervention = (e: React.FormEvent) => {
    e.preventDefault();
    const cult = cultures.find(c => c.id === newInterCulture);
    const dateStr = new Date().toISOString().split('T')[0];
    
    // Compute expiration date if treatment and DAR specified
    const darDaysValue = newInterType === 'Traitement phytosanitaire' ? newInterDarDays : undefined;
    let darExpirationValue: string | undefined;
    if (darDaysValue && darDaysValue > 0) {
      const expDate = new Date();
      expDate.setDate(expDate.getDate() + darDaysValue);
      darExpirationValue = expDate.toISOString().split('T')[0];
    }

    const newInter: Intervention = {
      id: 'int-' + Math.floor(Math.random() * 10000),
      idParcelle: cult?.idParcelle || parcelles[0]?.id || '',
      idCulture: newInterCulture,
      date: dateStr,
      type: newInterType,
      substanceIntrant: newInterIntrant || undefined,
      quantiteIntrant: newInterIntrantQ || undefined,
      uniteIntrant: newInterIntrantU || undefined,
      mainDOeuvreCoût: newInterCost,
      responsable: newInterResp,
      statut: 'Validée',
      darDays: darDaysValue,
      darExpiration: darExpirationValue
    };
    onAddIntervention(newInter);
    setShowAddIntervention(false);
    setNewInterDarDays(0);
  };

  const handleCreateIncident = (e: React.FormEvent) => {
    e.preventDefault();
    const activeId = newIncCultureId || (cultures[0]?.id || '');
    const cult = cultures.find(c => c.id === activeId);
    if (!cult) return;

    // Calculate approximate estimated loss based on quantity lost * price
    const Q_lost = ((newIncTauxPerte || 15) / 100) * cult.rendementCible * cult.surfaceCultivee;
    const computedLossVal = Q_lost * (cult.prixVentePrevisionnel || 350);

    const newInc: IncidentAgricole = {
      id: 'inc-' + Math.floor(Math.random() * 10000),
      idParcelle: cult.idParcelle,
      idCulture: cult.id,
      date: new Date().toISOString().split('T')[0],
      type: newIncType,
      description: newIncDescription,
      perteEstimeeFCFA: computedLossVal,
      surfaceImpactee: newIncSurfaceImpactee,
      tauxPerte: newIncTauxPerte,
      quantitePerdue: Q_lost
    };

    if (onAddIncident) {
      onAddIncident(newInc);
    }
    setShowAddIncidentModal(false);
  };

  const handleCreateRecolte = (e: React.FormEvent) => {
    e.preventDefault();
    const newRec: Recolte = {
      id: 'rec-' + Math.floor(Math.random() * 10000),
      idCulture: newRecCulture,
      date: new Date().toISOString().split('T')[0],
      quantite: newRecQuant,
      qualite: newRecQual,
      unite: newRecUnit as any,
      prixVenteUnitairePoids: newRecPrice,
      statutSanitaire: newRecStatutSanitaire,
      noteSanitaire: newRecNoteSanitaire
    };
    onAddRecolte(newRec);
    setShowAddRecolte(false);
    setNewRecStatutSanitaire('Conforme');
    setNewRecNoteSanitaire('');
  };

  // Helper: find details
  const getParcelleName = (parcelleId: string) => {
    const p = parcelles.find(item => item.id === parcelleId);
    return p ? `${p.nom} (${p.code})` : 'Inconnue';
  };

  const getCultureName = (cultureId: string) => {
    const c = cultures.find(item => item.id === cultureId);
    return c ? `${c.nom} — ${c.variete}` : 'Inconnue';
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Module Title */}
      <div className="bg-white p-6 rounded-2xl border-2 border-[#1E7A44]/10 shadow-3xs space-y-2">
        <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2.5">
          <Sprout className="text-[#1E7A44] h-7 w-7" />
          Module de Gestion Agricole & Cultures
        </h2>
        <p className="text-xs text-slate-500 font-medium leading-relaxed">
          Suivi foncier, planification des travaux agricoles, calcul de rendement des récoltes et de productivité, et analyse fine des coûts réels de production végétale. Calibré avec les normes SYSCOHADA révisées pour Kissine Agro-Industries. Slogan : « Ensemble, cultivons l'avenir de l'Afrique ! ».
        </p>
      </div>

      {/* Action buttons wrapper */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div />
        <div className="flex gap-2">
          {activeTab === 'cultures' && (
            <button
              onClick={() => setShowAddCulture(true)}
              className="bg-emerald-600 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-emerald-700 transition flex items-center gap-1.5"
            >
              <PlusCircle className="h-4 w-4" /> Nouvelle Culture
            </button>
          )}
          {activeTab === 'champs' && (
            <button
              onClick={() => {
                setSelectedChampForEdit(null);
                setNewChampNom('');
                setNewChampCode('');
                setNewChampVille('Obala');
                setNewChampLocalite('Secteur Nord Maraîchage');
                setNewChampCoordonneesGps('4.1680, 11.5340');
                setShowAddChamp(true);
              }}
              className="bg-emerald-600 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-emerald-700 transition flex items-center gap-1.5"
            >
              <PlusCircle className="h-4 w-4" /> Nouveau Champ
            </button>
          )}
          {activeTab === 'parcelles' && (
            <button
              onClick={() => {
                setNewParChampId(champs[0]?.id || '');
                setShowAddParcelle(true);
              }}
              className="bg-emerald-600 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-emerald-700 transition flex items-center gap-1.5"
            >
              <PlusCircle className="h-4 w-4" /> Nouvelle Parcelle
            </button>
          )}
          {activeTab === 'interventions' && (
            <button
              onClick={() => setShowAddIntervention(true)}
              className="bg-emerald-600 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-emerald-700 transition flex items-center gap-1.5"
            >
              <PlusCircle className="h-4 w-4" /> Enregistrer Travail
            </button>
          )}
          {activeTab === 'recoltes' && (
            <button
              onClick={() => setShowAddRecolte(true)}
              className="bg-emerald-600 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-emerald-700 transition flex items-center gap-1.5"
            >
              <PlusCircle className="h-4 w-4" /> Saisir Récolte
            </button>
          )}
        </div>
      </div>

      {/* Mini KPIs Banner */}
      {(() => {
        const todayString = new Date().toISOString().split('T')[0];
        const activeDarsCount = interventions.filter(
          i => i.type === 'Traitement phytosanitaire' && i.darExpiration && i.darExpiration >= todayString
        ).length;
        const totalHarvestedVolume = recoltes.reduce((sum, r) => sum + r.quantite, 0);

        return (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-white rounded-xl border p-4 shadow-3xs hover:border-emerald-300 transition">
              <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Surface Totale Gérée</div>
              <p className="text-2xl font-extrabold text-slate-800 mt-1">{totalHectares.toFixed(1)} <span className="text-xs text-slate-500 font-normal">ha</span></p>
              <span className="text-[10px] text-emerald-600 font-semibold block mt-1">✓ {parcelles.length} Parcelles cartographiées</span>
            </div>

            <div className="bg-white rounded-xl border p-4 shadow-3xs hover:border-emerald-300 transition">
              <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Cultures Actives</div>
              <p className="text-2xl font-extrabold text-slate-800 mt-1">{activeCropsCount}</p>
              <span className="text-[10px] text-slate-500 block mt-1">Saison de Pluies 2026</span>
            </div>

            <div className="bg-white rounded-xl border p-4 shadow-3xs hover:border-rose-300 transition">
              <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Sécurité & Lock DAR</div>
              <p className={`text-2xl font-extrabold mt-1 ${activeDarsCount > 0 ? 'text-rose-650 text-rose-600' : 'text-emerald-600'}`}>
                {activeDarsCount} {activeDarsCount > 1 ? 'parcelles' : 'parcelle'}
              </p>
              <span className={`text-[10px] font-bold block mt-1 ${activeDarsCount > 0 ? 'text-rose-550 text-rose-500 animate-pulse' : 'text-emerald-600'}`}>
                {activeDarsCount > 0 ? '⚠️ Traitement DAR en cours' : '✓ Alimentation 100% Saine'}
              </span>
            </div>

            <div className="bg-white rounded-xl border p-4 shadow-3xs hover:border-emerald-300 transition">
              <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Volume Total Récolté</div>
              <p className="text-2xl font-extrabold text-indigo-650 text-indigo-600 mt-1">
                {(totalHarvestedVolume / 1000).toFixed(1)} <span className="text-xs text-slate-500 font-normal">tonnes</span>
              </p>
              <span className="text-[10px] text-slate-500 block mt-1">Suivi global de pesées</span>
            </div>

            <div className="bg-white rounded-xl border p-4 shadow-3xs hover:border-rose-300 transition">
              <div className="text-[10px] uppercase tracking-wider font-bold text-rose-500">Incidents Majeurs</div>
              <p className="text-2xl font-extrabold text-rose-600 mt-1">{incidents.length}</p>
              <span className="text-[10px] text-slate-500 block mt-1">Pertes estimées: 350K FCFA</span>
            </div>
          </div>
        );
      })()}

      {/* Mode Navigation Tabs */}
      <div className="border-b flex gap-1 bg-slate-50 p-1.5 rounded-lg border">
        <button
          onClick={() => setActiveTab('exploitations')}
          className={`px-4 py-2 rounded text-xs font-semibold transition ${
            activeTab === 'exploitations' ? 'bg-white shadow-xs text-emerald-700' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Exploitations & Sites
        </button>
        <button
          onClick={() => setActiveTab('champs')}
          className={`px-4 py-2 rounded text-xs font-semibold transition ${
            activeTab === 'champs' ? 'bg-white shadow-xs text-emerald-700' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Champs & Villes {champs.length > 0 && `(${champs.length})`}
        </button>
        <button
          onClick={() => setActiveTab('parcelles')}
          className={`px-4 py-2 rounded text-xs font-semibold transition ${
            activeTab === 'parcelles' ? 'bg-white shadow-xs text-emerald-700' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Parcelles & Sol {parcelles.length > 0 && `(${parcelles.length})`}
        </button>
        <button
          onClick={() => setActiveTab('cultures')}
          className={`px-4 py-2 rounded text-xs font-semibold transition ${
            activeTab === 'cultures' ? 'bg-white shadow-xs text-emerald-700' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Cultures & Campagnes {cultures.length > 0 && `(${cultures.length})`}
        </button>
        <button
          onClick={() => setActiveTab('interventions')}
          className={`px-4 py-2 rounded text-xs font-semibold transition ${
            activeTab === 'interventions' ? 'bg-white shadow-xs text-emerald-700' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Travaux & Intrants {interventions.length > 0 && `(${interventions.length})`}
        </button>
        <button
          onClick={() => setActiveTab('recoltes')}
          className={`px-4 py-2 rounded text-xs font-semibold transition ${
            activeTab === 'recoltes' ? 'bg-white shadow-xs text-emerald-700' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Récoltes & Rendements
        </button>
      </div>

      {/* Dynamic Content Views */}
      <div className="bg-white rounded-xl border shadow-2xs p-4">
        {/* VIEW 1: EXPLOITATIONS */}
        {activeTab === 'exploitations' && (() => {
          // Find currently focused Farm
          const selectedExp = exploitations.find(e => e.id === selectedExploitationId) || exploitations[0];
          if (!selectedExp) return <div className="text-slate-500 py-8 text-center text-xs">Aucune exploitation n'est créée. Cliquez sur "Nouvelle Exploitation" pour débuter.</div>;

          // Consolidated calculations for the focused farm
          const expSites = sites.filter(s => s.idExploitation === selectedExp.id);
          const expSiteIds = expSites.map(s => s.id);
          const expParcelles = parcelles.filter(p => expSiteIds.includes(p.idSite));
          const totalParcellesSurf = expParcelles.reduce((sum, p) => sum + p.surface, 0);

          const expSitesElevage = sitesElevage.filter(se => se.idExploitation === selectedExp.id);
          const expSiteEvIds = expSitesElevage.map(se => se.id);
          const expBatiments = batiments.filter(b => expSiteEvIds.includes(b.idSiteElevage));
          const totalBatCapacity = expBatiments.reduce((sum, b) => sum + b.capaciteMax, 0);

          // Full SaaS portfolio stats (Data consolidation)
          const totalPortfolioSurf = exploitations.reduce((sum, e) => sum + e.surfaceTotale, 0);
          const totalPortfolioCultivable = exploitations.reduce((sum, e) => sum + e.surfaceCultivable, 0);

          return (
            <div className="space-y-6">
              {/* TOP HEADER & GLOBAL PORTFOLIO CONSOLIDATION BANNER */}
              <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 bg-gradient-to-r from-slate-900 to-slate-850 text-white p-5 rounded-2xl shadow-sm border border-slate-800">
                <div>
                  <h3 className="font-extrabold text-base tracking-tight text-white flex items-center gap-2">
                    <Layers className="text-emerald-400 h-5 w-5" />
                    Consolidation Multi-Exploitations Foncères
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 max-w-xl">
                    Vue unifiée en temps réel du portefeuille agro-industriel. Sélectionnez une exploitation pour inspecter sa topologie, ses parcelles de cultures et ses infrastructures connectées.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 lg:self-center">
                  <div className="bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700/60 min-w-[120px]">
                    <span className="text-[10px] text-slate-400 block uppercase font-medium">Fermes Totales</span>
                    <span className="font-extrabold text-white text-base font-mono">{exploitations.length} sites</span>
                  </div>
                  <div className="bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700/60 min-w-[140px]">
                    <span className="text-[10px] text-slate-400 block uppercase font-medium">Foncier National</span>
                    <span className="font-extrabold text-emerald-400 text-base font-mono">{totalPortfolioSurf.toLocaleString()} ha</span>
                  </div>
                  <button
                    onClick={() => setShowAddExploitation(true)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-md hover:shadow-emerald-900/40 flex items-center gap-2"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Nouvelle Ferme
                  </button>
                </div>
              </div>

              {/* TWO PANEL BENTO VIEW */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* LEFT CONSOLE: MULTI-FARM SELECTION RAIL */}
                <div className="lg:col-span-1 space-y-4">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
                    <span>Sélectionner un site d'exploitation ({exploitations.length})</span>
                    <Map className="h-3.5 w-3.5" />
                  </div>
                  <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
                    {exploitations.map((exp) => {
                      const isActive = exp.id === selectedExploitationId;
                      const activeType = exp.typeExploitation || 'Mixte';
                      
                      let typeBadgeColor = 'bg-violet-100 text-violet-800 border-violet-200';
                      if (activeType === 'Végétale') typeBadgeColor = 'bg-emerald-50 text-emerald-800 border-emerald-200';
                      if (activeType === 'Élevage') typeBadgeColor = 'bg-amber-100 text-amber-800 border-amber-200';
                      if (activeType === 'Agro-industrielle') typeBadgeColor = 'bg-blue-100 text-blue-800 border-blue-200';

                      return (
                        <div
                          key={exp.id}
                          onClick={() => setSelectedExploitationId(exp.id)}
                          className={`relative border-2 p-4 rounded-xl cursor-pointer transition text-xs flex flex-col justify-between ${
                            isActive
                              ? 'border-emerald-600 bg-emerald-50/25 shadow-xs'
                              : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                          }`}
                        >
                          {isActive && (
                            <span className="absolute top-3 right-3 flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                            </span>
                          )}
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-mono text-[9px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded-sm font-bold">
                                {exp.code}
                              </span>
                              <span className={`text-[9px] px-1.5 py-0.5 rounded-sm font-bold border ${typeBadgeColor}`}>
                                {activeType}
                              </span>
                            </div>
                            <h4 className="text-slate-800 font-extrabold text-sm mt-2">{exp.nom}</h4>
                            <p className="text-slate-500 text-[11px] mt-1 line-clamp-2">{exp.description}</p>
                          </div>

                          <div className="grid grid-cols-2 gap-1 border-t mt-3 pt-2 text-[11px] text-slate-600 font-medium">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                              <span className="truncate">{exp.ville}</span>
                            </div>
                            <div className="flex items-center gap-1 justify-end">
                              <span className="text-slate-400">Surface:</span>
                              <span className="font-bold text-slate-800">{exp.surfaceTotale} ha</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Portfolio Consolidation Widgets */}
                  <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-3">
                    <h5 className="font-bold text-slate-700 text-xs uppercase tracking-wide">Aménagement consolidé</h5>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                          <span>Usage Foncier Cultivable</span>
                          <span className="font-bold">{((totalPortfolioCultivable/totalPortfolioSurf)*100).toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: `${(totalPortfolioCultivable/totalPortfolioSurf)*100}%` }}></div>
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 leading-normal">
                        <strong>{(totalPortfolioSurf - totalPortfolioCultivable).toLocaleString()} Hectares</strong> réservés à la sylviculture, aux bâtiments d’étables durables et aux zones de protection d’eau.
                      </p>
                    </div>
                  </div>
                </div>

                {/* RIGHT CONSOLE: FOCUSED SITE DETAILED ANALYTICS AND INTERACTIVE SIG MAP */}
                <div className="lg:col-span-2 space-y-4">
                  {/* Farm details & Quick Stats */}
                  <div className="bg-white rounded-2xl border border-slate-100 p-4 space-y-3 shadow-xs">
                    <div className="flex flex-wrap justify-between items-start gap-2">
                      <div>
                        <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Ferme Active Sélectionnée</div>
                        <h4 className="text-lg font-black text-slate-900">{selectedExp.nom}</h4>
                        <p className="text-xs text-slate-500 mt-1">{selectedExp.description}</p>
                      </div>
                      <div className="bg-emerald-50 text-emerald-800 border border-emerald-100 px-3 py-1 rounded-lg text-xs font-bold">
                        {selectedExp.typeExploitation || 'Mixte'}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs border-t pt-3 p-1">
                      <div className="bg-slate-50 p-2.5 rounded-lg">
                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">Responsable</span>
                        <span className="font-bold text-slate-800 break-words block mt-0.5">{selectedExp.responsable}</span>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-lg">
                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">Surfaces exploitations</span>
                        <span className="font-bold text-slate-800 block mt-0.5">
                          {selectedExp.surfaceCultivable} ha cult. / {selectedExp.surfaceTotale} ha tot.
                        </span>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-lg">
                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">Localisation SIG</span>
                        <span className="font-bold text-slate-800 block mt-0.5">{selectedExp.latitude}°N, {selectedExp.longitude}°E</span>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-lg">
                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">Statut global</span>
                        <span className="font-bold text-emerald-700 flex items-center gap-1 block mt-0.5">
                          <Check className="h-3.5 w-3.5" /> Actif & Audité
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* INTERACTIVE GIS MAP (CARTOGRAPHIE INTERACTIVE DES PARCELLES ET BATIMENTS) */}
                  <div className="border border-slate-200/95 shadow-xs rounded-2xl bg-white overflow-hidden">
                    <div className="bg-slate-50 border-b p-3.5 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                      <div>
                        <h4 className="text-xs font-extrabold text-slate-800 uppercase flex items-center gap-1.5">
                          <Compass className="text-emerald-600 h-4 w-4" />
                          Cartographie SIG Interactive - Visualisation Topochronologique
                        </h4>
                        <p className="text-[10px] text-slate-500">
                          Parcelles végétales vert/bleu (cliquables) & structures de bâtiments d'élevage rouges/oranges.
                        </p>
                      </div>
                      <div className="flex gap-1.5 self-start sm:self-auto text-[10px] font-semibold">
                        <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-200">
                          {expParcelles.length} Parcelles
                        </span>
                        <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md border border-amber-200">
                          {expBatiments.length} Bâtiments
                        </span>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-100 relative">
                      {/* SVG INTERACTIVE INTERFACE MAP */}
                      <div className="w-full h-[260px] bg-emerald-500/10 border rounded-2xl relative overflow-hidden flex items-center justify-center">
                        {/* Map Grid Pattern background */}
                        <div className="absolute inset-0 opacity-15" style={{ 
                          backgroundImage: `radial-gradient(#10b981 1.5px, transparent 1.5px), radial-gradient(#10b981 1.5px, #ecfdf5 1.5px)`, 
                          backgroundSize: '24px 24px', 
                          backgroundPosition: '0 0, 12px 12px' 
                        }}></div>

                        {/* Latitude / longitude grid markers */}
                        <div className="absolute top-1 left-2 font-mono text-[9px] text-slate-400">Lat Limit: {(selectedExp.latitude + 0.05).toFixed(4)}°N</div>
                        <div className="absolute bottom-1 right-2 font-mono text-[9px] text-slate-400">Long Limit: {(selectedExp.longitude - 0.05).toFixed(4)}°E</div>

                        {/* Interactive SVG Group */}
                        <svg className="w-full h-full absolute inset-0 text-xs" viewBox="0 0 600 260">
                          
                          {/* 1. SECTOR DIVISIONS AND NATURAL BARRIERS */}
                          <line x1="0" y1="130" x2="600" y2="130" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3,3" className="opacity-40" />
                          <line x1="300" y1="0" x2="300" y2="260" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3,3" className="opacity-40" />
                          
                          {/* River / water resource visualization */}
                          <path d="M 0 50 Q 150 120 300 70 T 600 100" fill="none" stroke="#60a5fa" strokeWidth="6" className="opacity-30" />
                          <text x="450" y="85" fill="#2563eb" className="text-[9px] font-bold tracking-widest opacity-40 font-mono">COUR D'EAU / IRRIGATION</text>

                          {/* 2. MAIN CENTER HQ MARKER */}
                          <g transform="translate(300, 130)" className="cursor-pointer">
                            <circle r="12" fill="#d97706" className="animate-pulse opacity-25" />
                            <circle r="7" fill="#d97706" stroke="#fff" strokeWidth="1.5" />
                            <text y="-14" textAnchor="middle" fill="#78350f" className="font-extrabold text-[8px] uppercase tracking-wider bg-white">QUARTIER CENTRAL HQ ({selectedExp.code})</text>
                            <title>Siège Principal de l'Exploitation : {selectedExp.responsable}</title>
                          </g>

                          {/* 3. PARCELS VISUALIZATION (VEGETAL) */}
                          {expParcelles.length === 0 ? (
                            <text x="300" y="200" textAnchor="middle" fill="#94a3b8" className="text-[11px] font-medium italic">Aucune parcelle de culture enregistrée</text>
                          ) : expParcelles.map((p, i) => {
                            // Layout parcels spread across sectors
                            // Coordinate offset based on parcel index
                            const offsetX = [60, 160, 420, 480][i % 4] || 100;
                            const offsetY = [40, 170, 50, 150][i % 4] || 100;
                            const width = 110;
                            const height = 65;

                            // Color assignment based on parcel size/pH/water
                            const fillColors = [
                              'fill-emerald-600/70 stroke-emerald-700 hover:fill-emerald-600',
                              'fill-green-600/70 stroke-green-700 hover:fill-green-600',
                              'fill-teal-600/70 stroke-teal-700 hover:fill-teal-600',
                              'fill-lime-600/70 stroke-lime-700 hover:fill-lime-600'
                            ];
                            const designClass = fillColors[i % fillColors.length];

                            return (
                              <g key={p.id} className="group cursor-pointer">
                                <rect
                                  x={offsetX}
                                  y={offsetY}
                                  width={width}
                                  height={height}
                                  rx="8"
                                  className={`${designClass} stroke-1.5 transition-all duration-250`}
                                />
                                <text x={offsetX + width/2} y={offsetY + 20} textAnchor="middle" fill="#fff" className="font-extrabold text-[9px] drop-shadow-xs">{p.code}</text>
                                <text x={offsetX + width/2} y={offsetY + 35} textAnchor="middle" fill="#f0fdf4" className="text-[8px] opacity-90">{p.nom.split(' ')[0]}</text>
                                <text x={offsetX + width/2} y={offsetY + 50} textAnchor="middle" fill="#fff" className="text-[9px] font-bold bg-slate-900/40 rounded px-1">{p.surface} ha</text>
                                
                                {/* Hover interactive info box simulation on standard browser tags */}
                                <title>
                                  PARCELLE : {p.nom} ({p.code})&#10;
                                  Superficie : {p.surface} ha&#10;
                                  Type de Sol : {p.typeSol}&#10;
                                  pH du sol : {p.ph || 'Inconnu'}&#10;
                                  Irrigation : {p.sourceEau}
                                </title>
                              </g>
                            );
                          })}

                          {/* 4. BUILDINGS VISUALIZATION (LIVESTOCK / ELEVAGE) */}
                          {expBatiments.length > 0 && expBatiments.map((b, i) => {
                            // Layout buildings in the right sector of SVG card
                            const bOffsetX = [80, 200, 380, 480][i % 4] || 380;
                            const bOffsetY = [105, 75, 175, 30][i % 4] || 150;
                            
                            // Yellow/amber scheme for livestock infrastructure
                            const colorClass = 'fill-amber-500/75 stroke-amber-700 hover:fill-amber-500';

                            return (
                              <g key={b.id} className="group cursor-pointer">
                                <circle
                                  cx={bOffsetX}
                                  cy={bOffsetY}
                                  r="24"
                                  className={`${colorClass} stroke-2 transition-all duration-200`}
                                />
                                {/* Building tiny stylized icon simulation */}
                                <rect x={bOffsetX - 8} y={bOffsetY - 8} width="16" height="12" rx="2" fill="#fff" className="opacity-90 stroke-amber-800 stroke-[1px]" />
                                <polygon points={`${bOffsetX-10},${bOffsetY-7} ${bOffsetX},${bOffsetY-15} ${bOffsetX+10},${bOffsetY-7}`} fill="#78350f" />
                                
                                <text x={bOffsetX} y={bOffsetY + 16} textAnchor="middle" fill="#451a03" className="font-black text-[7px] tracking-wide bg-amber-50/80 rounded px-1 uppercase">{b.type}</text>
                                
                                <title>
                                  BÂTIMENT : {b.nom}&#10;
                                  Type : {b.type}&#10;
                                  Capacité maximale : {b.capaciteMax}&#10;
                                  Dimension : {b.surface} m²
                                </title>
                              </g>
                            );
                          })}
                        </svg>

                        {/* Overlaid UI components panel inside the map */}
                        <div className="absolute right-2 bottom-2 bg-slate-900/80 text-white rounded-lg p-2 text-[9px] backdrop-blur-xs font-mono border border-slate-700 space-y-1">
                          <div className="font-bold border-b border-slate-700 pb-1 mb-1 text-emerald-400">SIG LÉGENDE</div>
                          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-emerald-600 rounded"></div> Parcelle Cultivée</div>
                          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-amber-500 rounded-full"></div> Structure Élevage</div>
                          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-blue-500 rounded-sm"></div> Cours d’eau / Forage</div>
                          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-amber-600 rounded-full animate-ping"></div> Siège Central (GPS)</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* RESOURCES LIST ATTACHED TO THE ACTIVE SITE */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Parcelles List */}
                    <div className="border border-slate-100 rounded-2xl bg-white p-4">
                      <div className="flex justify-between items-center pb-2.5 border-b mb-3">
                        <h4 className="text-xs font-bold text-slate-800 uppercase flex items-center gap-1">
                          <Sprout className="text-emerald-600 h-4 w-4" />
                          Parcelles végétales ({expParcelles.length})
                        </h4>
                        <span className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-bold">
                          {totalParcellesSurf} ha cultivés
                        </span>
                      </div>
                      {expParcelles.length === 0 ? (
                        <div className="text-slate-400 text-center py-6 text-xs italic">Aucune parcelle végétale rattachée.</div>
                      ) : (
                        <div className="space-y-2 max-h-[200px] overflow-y-auto">
                          {expParcelles.map(p => (
                            <div key={p.id} className="p-2.5 rounded-xl border border-slate-50 bg-slate-50/40 flex justify-between items-center text-xs">
                              <div>
                                <span className="font-bold text-slate-900 block">{p.nom}</span>
                                <span className="text-[10px] text-slate-500 font-mono">Code: {p.code} | {p.typeSol}</span>
                              </div>
                              <div className="text-right">
                                <span className="font-extrabold text-emerald-700 block">{p.surface} ha</span>
                                <span className="text-[10px] text-slate-400 block">pH: {p.ph}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Bâtiments List */}
                    <div className="border border-slate-100 rounded-2xl bg-white p-4">
                      <div className="flex justify-between items-center pb-2.5 border-b mb-3">
                        <h4 className="text-xs font-bold text-slate-800 uppercase flex items-center gap-1">
                          <Warehouse className="text-amber-500 h-4 w-4" />
                          Bâtiments d’Élevage ({expBatiments.length})
                        </h4>
                        <span className="text-[10px] bg-amber-50 text-amber-800 px-2 py-0.5 rounded font-bold">
                          Capacité: {totalBatCapacity.toLocaleString()} têtes
                        </span>
                      </div>
                      {expBatiments.length === 0 ? (
                        <div className="text-slate-400 text-center py-6 text-xs italic">Aucune infrastructure d'élevage sur ce site.</div>
                      ) : (
                        <div className="space-y-2 max-h-[200px] overflow-y-auto">
                          {expBatiments.map(b => (
                            <div key={b.id} className="p-2.5 rounded-xl border border-slate-50 bg-slate-50/40 flex justify-between items-center text-xs">
                              <div>
                                <span className="font-bold text-slate-900 block">{b.nom}</span>
                                <span className="text-[10px] text-slate-500 font-mono">Type: {b.type} | Surface: {b.surface} m²</span>
                              </div>
                              <div className="text-right">
                                <span className="font-extrabold text-amber-700 block">{b.capaciteMax.toLocaleString()}</span>
                                <span className="text-[10px] text-slate-400 block">Max têtes</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* VIEW: CHAMPS AGRICOLES */}
        {activeTab === 'champs' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Champs & Forêts de Culture</h3>
                <p className="text-[11px] text-slate-500">Un champ regroupe plusieurs parcelles géographiquement unifiées dans une même localité.</p>
              </div>
            </div>

            {champs.length === 0 ? (
              <div className="p-12 text-center bg-slate-50/50 rounded-2xl border border-dashed">
                <Sprout className="h-10 w-10 text-emerald-400 mx-auto mb-2 tracking-widest" />
                <h4 className="text-slate-700 font-bold text-xs uppercase mb-1">Aucun Champ répertorié</h4>
                <p className="text-slate-400 text-[11px] max-w-sm mx-auto mb-4">
                  Pour organiser vos parcelles, créez d'abord un champ régional en spécifiant sa ville et sa localité d'exploitation.
                </p>
                <button
                  onClick={() => setShowAddChamp(true)}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-black animate-pulse"
                >
                  Ajouter le premier Champ
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {champs.map((champ) => {
                  const linkedPlots = parcelles.filter(p => p.idChamp === champ.id);
                  const totalPlotsSurf = linkedPlots.reduce((sum, p) => sum + p.surface, 0);

                  return (
                    <div key={champ.id} className="bg-white border rounded-2xl p-4 shadow-3xs flex flex-col justify-between hover:shadow-2xs transition">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-mono text-[10px] uppercase font-bold tracking-wider rounded border border-emerald-100">
                              {champ.code}
                            </span>
                            <h4 className="font-bold text-slate-900 text-sm mt-1.5">{champ.nom}</h4>
                          </div>
                          
                          <div className="flex gap-1">
                            <button
                              onClick={() => startEditChamp(champ)}
                              className="p-1 px-2 text-[10px] font-bold text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded"
                            >
                              Modifier
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Êtes-vous certain de vouloir supprimer le champ "${champ.nom}" ? Les parcelles rattachées ne seront pas supprimées mais n'auront plus de rattachement.`)) {
                                  onDeleteChamp(champ.id);
                                }
                              }}
                              className="p-1 px-2 text-[10px] font-bold text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                            >
                              Supprimer
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 bg-slate-50/75 p-2.5 rounded-lg border">
                          <div>
                            <span className="font-semibold text-slate-400 block uppercase text-[8px]">Ville / Territoire</span>
                            <span className="font-bold text-slate-700">{champ.ville}</span>
                          </div>
                          <div>
                            <span className="font-semibold text-slate-400 block uppercase text-[8px]">Localité</span>
                            <span className="font-bold text-slate-700 truncate block">{champ.localite}</span>
                          </div>
                          <div className="col-span-2 pt-1.5 border-t border-slate-200">
                            <span className="font-semibold text-slate-400 block uppercase text-[8px]">Coordonnées GPS</span>
                            <span className="font-mono text-[10px] text-slate-600">{champ.coordonneesGps}</span>
                          </div>
                        </div>

                        <div className="space-y-1.5 pt-1">
                          <div className="flex justify-between text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                            <span>Secteurs & Parcelles ({linkedPlots.length})</span>
                            <span className="text-emerald-700">{totalPlotsSurf.toFixed(1)} ha cumulés</span>
                          </div>

                          {linkedPlots.length === 0 ? (
                            <div className="text-[10px] text-slate-400 italic bg-slate-50 p-2 rounded text-center">
                              Aucune parcelle rattachée à ce champ.
                            </div>
                          ) : (
                            <div className="divide-y border rounded-lg bg-white overflow-hidden max-h-32 overflow-y-auto">
                              {linkedPlots.map(p => {
                                const activeCult = cultures.find(c => c.idParcelle === p.id && c.statut === 'Active');
                                return (
                                  <div key={p.id} className="p-2 flex justify-between items-center text-[11px] hover:bg-slate-50/50 transition">
                                    <div className="font-medium text-slate-750">
                                      {p.nom} <span className="text-[9px] text-slate-400 font-mono">({p.code})</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 font-bold">
                                      {activeCult ? (
                                        <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-sm text-[9px] border border-emerald-100">
                                          🌱 {activeCult.nom}
                                        </span>
                                      ) : (
                                        <span className="text-[9px] text-slate-400 font-normal italic">
                                          En jachère
                                        </span>
                                      )}
                                      <span className="text-slate-600 text-[10px]">{p.surface} ha</span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: PARCELLES */}
        {activeTab === 'parcelles' && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 text-sm">Parcelles & Analyses de Sols</h3>
            <div className="overflow-x-auto border rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b text-slate-600 font-semibold uppercase">
                  <tr>
                    <th className="p-3">Ref Code</th>
                    <th className="p-3">Désignation</th>
                    <th className="p-3">Surface</th>
                    <th className="p-3">Texture & Type Sol</th>
                    <th className="p-3">PH Sol</th>
                    <th className="p-3">Hydrologie / Eau</th>
                    <th className="p-3">Latitude / Longitude</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-slate-700">
                  {parcelles.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 transition">
                      <td className="p-3 font-mono font-bold text-emerald-700">{p.code}</td>
                      <td className="p-3 font-semibold text-slate-900">{p.nom}</td>
                      <td className="p-3 font-bold">{p.surface} ha</td>
                      <td className="p-3 text-slate-600">{p.typeSol}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded font-semibold text-xs ${p.ph < 6 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                          {p.ph} PH
                        </span>
                      </td>
                      <td className="p-3 text-slate-600">{p.sourceEau}</td>
                      <td className="p-3 font-mono text-[10px] text-slate-500">
                        {p.latitude.toFixed(4)}, {p.longitude.toFixed(4)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Custom SVG mapping canvas */}
            <div className="bg-slate-50 border p-4 rounded-xl">
              <h4 className="text-xs font-bold text-slate-700 uppercase mb-3 flex items-center gap-1.5">
                <Compass className="h-4 w-4 text-emerald-600" />
                Cartographie Interactive & Géolocalisation Fictive (Visualisation SIG)
              </h4>
              <div className="border bg-emerald-50/40 rounded-lg h-48 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                
                {/* Représenter des parcelles graphiquement */}
                <div className="absolute top-8 left-12 w-32 h-20 bg-emerald-600/20 border-2 border-emerald-600 rounded-md flex items-center justify-center text-center p-1">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-800 block">P_OB-N1</span>
                    <span className="text-[9px] text-emerald-600">Maïs (12.5 ha)</span>
                  </div>
                </div>

                <div className="absolute top-6 right-16 w-24 h-24 bg-teal-600/20 border-2 border-teal-600 rounded-md flex items-center justify-center text-center p-1">
                  <div>
                    <span className="text-[10px] font-bold text-teal-800 block">P_OB-N2</span>
                    <span className="text-[9px] text-teal-600">Tomates (8 ha)</span>
                  </div>
                </div>

                <div className="absolute bottom-4 left-36 w-48 h-14 bg-green-600/20 border-2 border-green-600 rounded-md flex items-center justify-center text-center p-1">
                  <div>
                    <span className="text-[10px] font-bold text-green-800 block">P_OB-E1</span>
                    <span className="text-[9px] text-green-600">Plantain (35 ha)</span>
                  </div>
                </div>

                <div className="absolute bottom-3 right-6 flex items-center gap-1 text-[10px] text-slate-600 bg-white/90 px-2 py-1 rounded border">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 block"></span>
                  SIG Connecté
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: CULTURES */}
        {activeTab === 'cultures' && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 text-sm">Cycles de Cultures Actifs</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {cultures.map((c) => {
                const totalCost = interventions
                  .filter(i => i.idCulture === c.id)
                  .reduce((sum, i) => sum + i.mainDOeuvreCoût, 0);

                const countInt = interventions.filter(i => i.idCulture === c.id).length;

                return (
                  <div key={c.id} className="border p-4 rounded-xl shadow-3xs space-y-3 hover:border-emerald-400 transition">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[9px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-bold">
                          {c.statut}
                        </span>
                        <h4 className="text-base font-bold text-slate-800 mt-1">{c.nom}</h4>
                        <span className="text-xs text-slate-500 block">Variété: {c.variete}</span>
                      </div>
                      <Sprout className="text-emerald-500 h-6 w-6" />
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600 border-t border-b py-2">
                      <div className="flex justify-between">
                        <span>Parcelle d'affectation:</span>
                        <span className="font-semibold text-slate-800">{getParcelleName(c.idParcelle)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Surface cultivée:</span>
                        <span className="font-bold text-slate-800">{c.surfaceCultivee} ha</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Date de semis:</span>
                        <span className="font-semibold">{c.dateSemis}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Récolte prévue le:</span>
                        <span className="font-semibold text-indigo-600">{c.dateRecoltePrevue}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cible Rendement:</span>
                        <span className="font-semibold">{c.rendementCible} kg/ha</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-xs border-b pb-2">
                      <div>
                        <span className="block text-[10px] text-slate-400">Coûts de Main d'Oeuvre</span>
                        <span className="font-extrabold text-indigo-600">{totalCost.toLocaleString()} FCFA</span>
                      </div>
                      <div className="text-right">
                        <span className="block text-[10px] text-slate-400">Travaux validés</span>
                        <span className="font-bold text-slate-700">{countInt} interventions</span>
                      </div>
                    </div>

                    {/* Open Cahier Cultural button */}
                    <button
                      type="button"
                      onClick={() => setSelectedCahierCultId(selectedCahierCultId === c.id ? null : c.id)}
                      className={`w-full py-2.5 rounded-lg text-xs font-black transition flex items-center justify-center gap-1.5 ${
                        selectedCahierCultId === c.id
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                      }`}
                    >
                      <Eye className="h-4 w-4" />
                      {selectedCahierCultId === c.id ? 'Fermer le Cahier Cultural' : 'Ouvrir le Cahier Cultural'}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* CAHIER CULTURAL CHRONOLOGICAL GRAPH & TRAIL - EXPERT INTERACTIVE PANEL */}
            {selectedCahierCultId && (() => {
              const cult = cultures.find(cu => cu.id === selectedCahierCultId);
              if (!cult) return null;
              
              const matchingInts = interventions.filter(i => i.idCulture === cult.id);
              const matchingRecs = recoltes.filter(r => r.idCulture === cult.id);
              const matchingIncidents = incidents.filter(inc => inc.idCulture === cult.id);

              const totalMoCost = matchingInts.reduce((sum, i) => sum + i.mainDOeuvreCoût, 0);
              const totalHarvestWeight = matchingRecs.reduce((sum, r) => sum + r.quantite, 0);
              const defaultSalePrice = cult.prixVentePrevisionnel || 380;
              const totalHarvestValue = matchingRecs.reduce((sum, r) => sum + (r.quantite * (r.prixVenteUnitairePoids || defaultSalePrice)), 0);

              const landLeaseCost = cult.coutLocation || (cult.isLouee ? 450000 : 0);
              const computedIndirectCost = Math.round(cult.surfaceCultivee * 15000); // 15 000 FCFA/ha
              const computedAmortisation = Math.round(cult.surfaceCultivee * 8000);   // 8 000 FCFA/ha
              const totalCharges = totalMoCost + computedIndirectCost + computedAmortisation + landLeaseCost;

              const budgetPrevisionnel = cult.budgetPrevisionnel || 650000;
              const yieldPrevisionnelTotal = cult.rendementCible * cult.surfaceCultivee; // kg
              const CA_previsionnel = yieldPrevisionnelTotal * (cult.prixVentePrevisionnel || 380);

              const totalLossFCFA = matchingIncidents.reduce((sum, inc) => sum + inc.perteEstimeeFCFA, 0);
              const totalLossQty = Math.round(matchingIncidents.reduce((sum, inc) => sum + (inc.quantitePerdue || 0), 0));

              const margeBruteReelle = totalHarvestValue - totalCharges;
              const margeBrutePrevisionnelle = CA_previsionnel - budgetPrevisionnel;

              return (
                <div className="bg-slate-900 text-slate-100 rounded-2xl p-6 border border-slate-700 shadow-md space-y-6 mt-6 animate-fade-in" id="cahier-cultural-root">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-4 gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400 font-extrabold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-950">
                          Circuit Production Végétale Structuré
                        </span>
                        <span className="text-[10px] uppercase font-mono tracking-widest text-indigo-400 font-bold bg-indigo-950 px-2 py-0.5 rounded border border-indigo-950">
                          Bilan Agronomique & SYSCOHADA (6 Macro-blocs)
                        </span>
                      </div>
                      <h4 className="text-lg font-black text-white mt-1.5 flex items-center gap-2">
                        <Sprout className="h-5 w-5 text-emerald-500" />
                        Circuit de production : {cult.nom} ({cult.variete}) — {cult.statut === 'Clôturée' ? '🔒 Clôturée (Lecture seule)' : '🔓 Active'}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1">
                        Séquence fonctionnelle complète : Cadrage prévisionnel, travaux en champ, enregistrement des pertes (Aléas), récolte certifiée, stockage et clôture définitive.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        type="button"
                        onClick={() => {
                          const conf = window.confirm("Souhaitez-vous réinitialiser ce cadrage aux valeurs de base ?");
                          if (conf && onUpdateCulture) {
                            onUpdateCulture({
                              ...cult,
                              budgetPrevisionnel: 650000,
                              prixVentePrevisionnel: 380,
                              isLouee: false,
                              coutLocation: 0,
                              statut: 'Active'
                            });
                          }
                        }}
                        className="text-[10px] font-bold text-slate-400 hover:text-white bg-slate-800 border border-slate-700 px-2.5 py-1.5 rounded"
                      >
                        <RefreshCw className="h-3 w-3 inline mr-1" /> Reset Cadrage
                      </button>
                      <button 
                        type="button"
                        onClick={() => setSelectedCahierCultId(null)} 
                        className="text-xs font-bold text-slate-350 hover:text-white bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg"
                      >
                        Fermer le Journal
                      </button>
                    </div>
                  </div>

                  {/* CHRONOLOGY PATHWAYS GRAPHICS - 6 COLUMNS */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 relative">
                    
                    {/* ÉTAPE 1: CADRAGE FONCIER & BUDGET */}
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/85 space-y-3 relative hover:border-indigo-500 transition">
                      <div className="absolute -top-3 left-4 bg-slate-800 text-[10px] font-black px-2 py-0.5 rounded-full text-indigo-400 uppercase tracking-wider border border-indigo-900/60">
                        Étape 1 : Cadrage
                      </div>
                      <div className="flex justify-between items-start pt-1.5">
                        <h5 className="font-extrabold text-white text-xs uppercase">Cadrage & Budget</h5>
                        <HelpCircle className="h-4 w-4 text-indigo-400" />
                      </div>
                      
                      <div className="text-[11px] text-slate-400 space-y-2 border-b border-slate-800 pb-2.5">
                        <div className="flex justify-between">
                          <span>Surface Cadrée :</span>
                          <span className="text-slate-200 font-bold">{cult.surfaceCultivee} Ha</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Statut Foncier :</span>
                          <span className="text-slate-200 font-semibold">{cult.isLouee ? 'Louée (Bail)' : 'Possédée'}</span>
                        </div>
                        {cult.isLouee && (
                          <div className="flex justify-between text-indigo-300">
                            <span>Coût Location :</span>
                            <span className="font-bold">{landLeaseCost.toLocaleString()} FCFA</span>
                          </div>
                        )}
                        <div className="flex justify-between text-emerald-400">
                          <span>CA Prévisionnel :</span>
                          <span className="font-bold font-mono">{CA_previsionnel.toLocaleString()} F</span>
                        </div>
                      </div>

                      {/* Live edit parameters - Section 4 & 6.7 of functional specification */}
                      {cult.statut !== 'Clôturée' ? (
                        <div className="space-y-2 bg-slate-900 p-2 rounded-lg border border-slate-800 text-[10px]">
                          <span className="font-bold text-indigo-400 block uppercase text-[8.5px]">Ajustement Cadrage</span>
                          <div>
                            <label className="block text-slate-400 mb-0.5">Budget Prév (FCFA) :</label>
                            <input 
                              type="number" 
                              value={budgetPrevisionnel} 
                              onChange={(e) => {
                                if (onUpdateCulture) {
                                  onUpdateCulture({ ...cult, budgetPrevisionnel: parseInt(e.target.value) || 0 });
                                }
                              }}
                              className="w-full bg-slate-950 border border-slate-800 text-white rounded px-1.5 py-0.5 font-bold"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-400 mb-0.5">Prix de vente prév. (/Kg) :</label>
                            <input 
                              type="number" 
                              value={defaultSalePrice} 
                              onChange={(e) => {
                                if (onUpdateCulture) {
                                  onUpdateCulture({ ...cult, prixVentePrevisionnel: parseInt(e.target.value) || 0 });
                                }
                              }}
                              className="w-full bg-slate-950 border border-slate-800 text-white rounded px-1.5 py-0.5 font-bold"
                            />
                          </div>
                          <div className="flex items-center gap-1.5 pt-1">
                            <input 
                              type="checkbox" 
                              id={`isLoueed-${cult.id}`}
                              checked={!!cult.isLouee} 
                              onChange={(e) => {
                                if (onUpdateCulture) {
                                  onUpdateCulture({ ...cult, isLouee: e.target.checked });
                                }
                              }}
                              className="rounded border-slate-700 bg-slate-950 text-indigo-600"
                            />
                            <label htmlFor={`isLoueed-${cult.id}`} className="text-slate-300 cursor-pointer">Terrain Loué</label>
                          </div>
                          {cult.isLouee && (
                            <div>
                              <input 
                                type="number" 
                                placeholder="Coût location direct"
                                value={cult.coutLocation || 0} 
                                onChange={(e) => {
                                  if (onUpdateCulture) {
                                    onUpdateCulture({ ...cult, coutLocation: parseInt(e.target.value) || 0 });
                                  }
                                }}
                                className="w-full bg-slate-950 border border-slate-800 text-white rounded px-1.5 py-0.5 font-bold"
                              />
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-[10px] bg-indigo-950/25 border border-indigo-900/30 text-indigo-300 p-1.5 rounded-lg font-mono text-center">
                          🔒 Cadrage verrouillé définitivement
                        </div>
                      )}
                    </div>

                    {/* ÉTAPE 2: SEMIS & VARIÉTÉS */}
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-2.5 relative hover:border-emerald-500 transition">
                      <div className="absolute -top-3 left-4 bg-emerald-700 text-[10px] font-black px-2 py-0.5 rounded-full text-white uppercase tracking-wider">
                        Étape 2 : Semis
                      </div>
                      <div className="flex justify-between items-start pt-1.5">
                        <h5 className="font-extrabold text-white text-xs uppercase">Labour & Semis</h5>
                        <Calendar className="h-4 w-4 text-emerald-500 text-emerald-105" />
                      </div>
                      <div className="text-[11px] text-slate-400 space-y-1.5">
                        <div className="flex justify-between">
                          <span>Date de Semis :</span>
                          <span className="text-slate-200 font-mono font-bold">{cult.dateSemis}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Variété Semée :</span>
                          <span className="text-indigo-300 font-bold">{cult.variete}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Rendement Cible :</span>
                          <span className="text-slate-200 font-mono font-semibold">{cult.rendementCible} Kg/Ha</span>
                        </div>
                        <div className="flex justify-between border-t border-slate-800 pt-1.5">
                          <span>Rendement Estimé :</span>
                          <span className="text-slate-200 font-bold">{yieldPrevisionnelTotal.toLocaleString()} Kg</span>
                        </div>
                      </div>
                      <div className="text-[10px] bg-slate-950 border border-slate-800 text-emerald-400 p-1.5 rounded text-center font-bold">
                        🌱 Cycle Démarré
                      </div>
                    </div>

                    {/* ÉTAPE 3: SUIVI CULTURAL (INTERVENTIONS) */}
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-1.5 relative hover:border-amber-500 transition">
                      <div className="absolute -top-3 left-4 bg-amber-600 text-[10px] font-black px-2 py-0.5 rounded-full text-white uppercase tracking-wider">
                        Étape 3 : Suivi
                      </div>
                      <div className="flex justify-between items-start pt-1.5">
                        <h5 className="font-extrabold text-white text-xs uppercase">Suivi Cultural</h5>
                        <Activity className="h-4 w-4 text-amber-500" />
                      </div>
                      {matchingInts.length === 0 ? (
                        <div className="text-[11px] text-slate-500 py-6 text-center italic">
                          Aucun travail culturaux enregistré.
                        </div>
                      ) : (
                        <div className="space-y-1 max-h-[140px] overflow-y-auto pr-1">
                          {matchingInts.map(i => (
                            <div key={i.id} className="text-[10px] bg-slate-900 border border-slate-850 p-1 rounded space-y-0.5">
                              <div className="flex justify-between font-bold text-slate-200">
                                <span className="truncate">{i.type}</span>
                                <span className="font-mono text-slate-400">{i.date}</span>
                              </div>
                              <div className="text-slate-400 flex justify-between">
                                <span className="font-bold text-amber-400">{i.mainDOeuvreCoût.toLocaleString()} F</span>
                                <span className="truncate text-slate-500"> {i.responsable.substring(0, 10)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="text-[10px] border-t border-slate-850 pt-2 space-y-0.5 text-slate-400 font-medium">
                        <div className="flex justify-between">
                          <span>Quote-part Indirects :</span>
                          <span className="font-bold text-slate-350">{computedIndirectCost.toLocaleString()} F</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Quote-part Amort. :</span>
                          <span className="font-semibold text-slate-350">{computedAmortisation.toLocaleString()} F</span>
                        </div>
                        <div className="flex justify-between text-slate-200 font-bold border-t border-slate-800/50 pt-1">
                          <span>Charges Cumulées :</span>
                          <span className="font-extrabold text-amber-400 font-mono">{totalCharges.toLocaleString()} FCFA</span>
                        </div>
                      </div>
                    </div>

                    {/* ÉTAPE 4: SORTIE DE CHAMP & LOSS DEFECTIONS (ALÉAS) */}
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-2 relative hover:border-red-500 transition">
                      <div className="absolute -top-3 left-4 bg-red-700 text-[10px] font-black px-2 py-0.5 rounded-full text-white uppercase tracking-wider">
                        Étape 4 : Aléas
                      </div>
                      <div className="flex justify-between items-start pt-1.5">
                        <h5 className="font-extrabold text-white text-xs uppercase">Gestion des Pertes</h5>
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      </div>

                      {matchingIncidents.length === 0 ? (
                        <div className="text-[11px] text-slate-500 py-3 text-center italic">
                          Météo & Agronomie stables. Aucun incident majeur.
                        </div>
                      ) : (
                        <div className="space-y-1 max-h-[140px] overflow-y-auto pr-1">
                          {matchingIncidents.map(inc => (
                            <div key={inc.id} className="text-[10px] bg-red-950/20 border border-red-900/40 p-1.5 rounded">
                              <div className="flex justify-between font-bold text-red-300">
                                <span>{inc.type}</span>
                                <span>{inc.tauxPerte ? `${inc.tauxPerte}%` : 'Perte'}</span>
                              </div>
                              <p className="text-[9.5px] text-slate-400 truncate">{inc.description}</p>
                              <div className="flex justify-between items-center text-[9px] text-slate-500 mt-0.5 border-t border-red-950/40 pt-0.5">
                                <span>Perte Est.:</span>
                                <span className="font-bold text-red-400">-{inc.perteEstimeeFCFA.toLocaleString()} FCFA</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="text-[10px] border-t border-slate-850 pt-1 text-slate-400 space-y-0.5">
                        <div className="flex justify-between">
                          <span>Pertes cumulées (Kg) :</span>
                          <span className="font-extrabold text-red-400">{totalLossQty.toLocaleString()} Kg</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Perte Valorisée :</span>
                          <span className="font-bold text-red-400">{totalLossFCFA.toLocaleString()} F</span>
                        </div>
                      </div>

                      {cult.statut !== 'Clôturée' && (
                        <div className="pt-1.5 border-t border-slate-850">
                          <button
                            type="button"
                            onClick={() => {
                              setNewIncCultureId(cult.id);
                              setShowAddIncidentModal(true);
                            }}
                            className="w-full bg-red-950 hover:bg-red-900 text-red-300 border border-red-900 text-[9px] py-1 rounded font-bold uppercase tracking-tight transition"
                          >
                            ⚠️ Déclarer un Aléa
                          </button>
                        </div>
                      )}
                    </div>

                    {/* ÉTAPE 5: STOCKS / AVAL DE CHAMP */}
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-2 relative hover:border-purple-500 transition">
                      <div className="absolute -top-3 left-4 bg-purple-700 text-[10px] font-black px-2 py-0.5 rounded-full text-white uppercase tracking-wider">
                        Étape 5 : Aval
                      </div>
                      <div className="flex justify-between items-start pt-1.5">
                        <h5 className="font-extrabold text-white text-xs uppercase">Récoltes & Stock</h5>
                        <Warehouse className="h-4 w-4 text-purple-400" />
                      </div>

                      {matchingRecs.length === 0 ? (
                        <div className="text-[11px] text-slate-500 py-6 text-center italic">
                          En attente de récolte, pesée et scellage du lot.
                        </div>
                      ) : (
                        <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                          {matchingRecs.map(r => (
                            <div key={r.id} className="text-[10px] bg-purple-950/20 border border-purple-900/40 p-1.5 rounded">
                              <div className="flex justify-between text-purple-300 font-extrabold">
                                <span>{r.quantite.toLocaleString()} Kg</span>
                                <span>Grade {r.qualite}</span>
                              </div>
                              <span className="block text-slate-500 text-[8.5px] font-mono">Date : {r.date}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="text-[10px] border-t border-slate-800 pt-1.5 space-y-1 text-slate-400">
                        <div className="flex justify-between font-medium">
                          <span>Total pesé :</span>
                          <span className="font-extrabold text-slate-200">{totalHarvestWeight.toLocaleString()} Kg</span>
                        </div>
                        {cult.surfaceCultivee > 0 && totalHarvestWeight > 0 && (
                          <div className="flex justify-between">
                            <span>Rendement Réel :</span>
                            <span className="font-bold text-purple-300">{(totalHarvestWeight / cult.surfaceCultivee).toFixed(1)} Kg/Ha</span>
                          </div>
                        )}
                        <div className="flex justify-between border-t border-slate-850 pt-1 text-[9px] text-slate-450 block truncate">
                          <span>Lot Traçabilité :</span>
                          <span className="font-mono text-purple-400 font-bold">LOT-{cult.id.substring(5).toUpperCase()}</span>
                        </div>
                      </div>
                    </div>

                    {/* ÉTAPE 6: CLÔTURE FINANCIÈRE & ANALYSE SYSCOHADA */}
                    <div className={`p-4 rounded-xl border relative transition flex flex-col justify-between ${
                      cult.statut === 'Clôturée'
                        ? 'bg-amber-950/25 border-amber-500/60 text-amber-50 shadow-sm'
                        : 'bg-slate-950 border-slate-800/80 hover:border-amber-500'
                    }`}>
                      <div className={`absolute -top-3 left-4 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider border ${
                        cult.statut === 'Clôturée'
                          ? 'bg-amber-500 text-slate-950 border-amber-300'
                          : 'bg-slate-800 text-amber-400 border-amber-900/40'
                      }`}>
                        Étape 6 : Clôture
                      </div>
                      
                      <div className="space-y-2 pt-1.5">
                        <div className="flex justify-between items-start">
                          <h5 className="font-extrabold text-white text-xs uppercase">Clôture Financière</h5>
                          {cult.statut === 'Clôturée' ? (
                            <Lock className="h-4 w-4 text-amber-500 animate-pulse" />
                          ) : (
                            <Unlock className="h-4 w-4 text-slate-500" />
                          )}
                        </div>

                        <div className="text-[11px] text-slate-400 space-y-1.5 border-b border-slate-800/60 pb-1.5">
                          <div className="flex justify-between">
                            <span>Marge Brute :</span>
                            <span className={`font-extrabold text-xs font-mono ${margeBruteReelle >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {margeBruteReelle.toLocaleString()} F
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>CA réel :</span>
                            <span className="text-white font-bold">{totalHarvestValue.toLocaleString()} F</span>
                          </div>
                        </div>
                      </div>

                      {/* State transition logic - Section 7 of functional spec */}
                      <div className="mt-3 pt-2">
                        {cult.statut !== 'Clôturée' ? (
                          <div className="space-y-1.5">
                            <span className="text-[9.2px] text-slate-450 italic block text-center">
                              Sécurise toutes les opérations et immobilise les charges.
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const confirmClose = window.confirm(
                                  `🔒 Voulez-vous CLÔTURER définitivement la campagne rattachée à la culture "${cult.nom}" ? \n\nCette action va FIGER toutes les données comptables et agronomiques conformément à l'article SYSCOHADA.`
                                );
                                if (confirmClose && onUpdateCulture) {
                                  onUpdateCulture({
                                    ...cult,
                                    statut: 'Clôturée',
                                    noteCloture: `Clôture validée par le Directeur d'Exploitation le ${new Date().toLocaleDateString('fr-FR')}`
                                  });
                                }
                              }}
                              className="w-full bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs py-2 rounded-lg transition shadow-md uppercase tracking-tight flex items-center justify-center gap-1"
                            >
                              <Lock className="h-3 w-3" /> Clôturer la campagne
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="bg-amber-950/40 p-1.5 rounded border border-amber-900/50 text-[9px] text-amber-350">
                              🤝 Tracé Audité : {cult.noteCloture || 'Clôture validée.'}
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const reason = window.prompt("Saisissez le motif de réouverture de cette campagne verrouillée :");
                                if (reason && onUpdateCulture) {
                                  onUpdateCulture({
                                    ...cult,
                                    statut: 'Active',
                                    noteCloture: `Réouverte : "${reason}" (Log date: ${new Date().toLocaleString()})`
                                  });
                                }
                              }}
                              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-[9.5px] py-1.5 rounded border border-slate-700 transition uppercase tracking-tight flex items-center justify-center gap-1"
                            >
                              <Unlock className="h-3 w-3" /> Réouvrir la Campagne
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                  </div>

                  {/* SPECIAL SECTION 9: SYSCOHADA COMPARATIVE DASHBOARD ON "CLÔTURE" OR DETAILED COMPARATIVE VIEW */}
                  <div className="bg-slate-950/60 p-5 rounded-xl border border-slate-800 space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-850 pb-2">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-indigo-400" />
                        <h6 className="font-extrabold text-xs uppercase text-slate-100 tracking-wide">
                          Rapport Analytique de Rentabilité & Diagnostic des Écarts
                        </h6>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">Formules : Section 6 & 6.8 de la spécification</span>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                      <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-850 space-y-1">
                        <span className="text-[9px] text-slate-500 uppercase block font-semibold">Rendement Réel obtenu</span>
                        <span className="text-sm font-extrabold text-slate-100 font-mono">
                          {totalHarvestWeight > 0 ? `${(totalHarvestWeight / cult.surfaceCultivee).toFixed(1)} Kg/Ha` : '0 kg/ha'}
                        </span>
                        <p className="text-[8.5px] text-slate-450 block font-sans">
                          Cible : {cult.rendementCible.toLocaleString()} Kg/Ha
                        </p>
                      </div>

                      <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-850 space-y-1">
                        <span className="text-[9px] text-slate-500 uppercase block font-semibold">Coût de Production Unit.</span>
                        <span className="text-sm font-extrabold text-indigo-400 font-mono">
                          {totalHarvestWeight > 0 ? `${Math.round(totalCharges / totalHarvestWeight).toLocaleString()} F/Kg` : '0 F/Kg'}
                        </span>
                        <p className="text-[8.5px] text-slate-450">
                          Prix de vente cible : {defaultSalePrice} F/Kg
                        </p>
                      </div>

                      <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-850 space-y-1">
                        <span className="text-[9px] text-slate-500 uppercase block font-semibold">Marge brute par Hectare</span>
                        <span className="text-sm font-extrabold text-emerald-400 font-mono">
                          {Math.round(margeBruteReelle / cult.surfaceCultivee).toLocaleString()} F/Ha
                        </span>
                        <p className="text-[8.5px] text-slate-450">
                          Sur {cult.surfaceCultivee} Ha exploités
                        </p>
                      </div>

                      <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-850 space-y-1">
                        <span className="text-[9px] text-slate-500 uppercase block font-semibold">Taux de Perte Global</span>
                        <span className={`text-sm font-extrabold font-mono ${totalLossQty > 0 ? 'text-red-400' : 'text-slate-200'}`}>
                          {yieldPrevisionnelTotal > 0 ? `${((totalLossQty / yieldPrevisionnelTotal) * 100).toFixed(1)} %` : '0.0 %'}
                        </span>
                        <p className="text-[8.5px] text-slate-450">
                          Masse compromise : {totalLossQty.toLocaleString()} Kg
                        </p>
                      </div>

                      <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-850 space-y-1 col-span-2 lg:col-span-1 border-l">
                        <span className="text-[9px] text-slate-500 uppercase block font-semibold">Consommation du Budget</span>
                        <span className="text-sm font-extrabold text-amber-500 font-mono">
                          {((totalCharges / budgetPrevisionnel) * 100).toFixed(1)} %
                        </span>
                        <p className="text-[8.5px] text-slate-450">
                          Budget : {budgetPrevisionnel.toLocaleString()} FCFA
                        </p>
                      </div>
                    </div>

                    {/* COMPARATIVE DEVIATIONS PANEL - SECTION 6.6 */}
                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-850 space-y-3">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wide block border-b border-slate-850 pb-1.5">
                        🧮 Écarts de Comptes de Gestion Co-Cadrés & Écarts Budgétaires
                      </span>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        
                        {/* Ecart charges */}
                        <div className="flex justify-between items-center text-xs p-2.5 bg-slate-950 rounded border border-slate-800">
                          <div>
                            <span className="block text-[10px] text-slate-500 font-bold uppercase">Écart Charges (S.6.6)</span>
                            <span className="block text-[8.5px] text-slate-450 font-sans">Réel ({totalCharges.toLocaleString()}) - Prév ({budgetPrevisionnel.toLocaleString()})</span>
                          </div>
                          <div className={`text-right font-mono font-black text-xs ${totalCharges - budgetPrevisionnel <= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {totalCharges - budgetPrevisionnel > 0 ? '+' : ''}{(totalCharges - budgetPrevisionnel).toLocaleString()} F
                          </div>
                        </div>

                        {/* Ecart chiffre d'affaires */}
                        <div className="flex justify-between items-center text-xs p-2.5 bg-slate-950 rounded border border-slate-800">
                          <div>
                            <span className="block text-[10px] text-slate-500 font-bold uppercase">Écart Chiffre d'Affaires</span>
                            <span className="block text-[8.5px] text-slate-450 font-sans">Réel ({totalHarvestValue.toLocaleString()}) - Prév ({CA_previsionnel.toLocaleString()})</span>
                          </div>
                          <div className={`text-right font-mono font-black text-xs ${totalHarvestValue - CA_previsionnel >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {totalHarvestValue - CA_previsionnel > 0 ? '+' : ''}{(totalHarvestValue - CA_previsionnel).toLocaleString()} F
                          </div>
                        </div>

                        {/* Ecart marge */}
                        <div className="flex justify-between items-center text-xs p-2.5 bg-slate-950 rounded border border-slate-800">
                          <div>
                            <span className="block text-[10px] text-slate-500 font-bold uppercase">Écart Marge Brute (S.6.6)</span>
                            <span className="block text-[8.5px] text-slate-450 font-sans">Réelle ({margeBruteReelle.toLocaleString()}) - Prév ({margeBrutePrevisionnelle.toLocaleString()})</span>
                          </div>
                          <div className={`text-right font-mono font-black text-xs ${margeBruteReelle - margeBrutePrevisionnelle >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {margeBruteReelle - margeBrutePrevisionnelle > 0 ? '+' : ''}{(margeBruteReelle - margeBrutePrevisionnelle).toLocaleString()} F
                          </div>
                        </div>

                      </div>

                      {/* Brief explanatory dynamic text */}
                      <p className="text-[10px] text-slate-400 italic block border-t border-slate-850/50 pt-2 bg-slate-950/20 px-2 py-1.5 rounded-md">
                        {margeBruteReelle - margeBrutePrevisionnelle >= 0 ? (
                          <span className="text-emerald-400 font-semibold block">
                            📈 Diagnostic : Performance supérieure ! L'écart de marge est positif de {(margeBruteReelle - margeBrutePrevisionnelle).toLocaleString()} FCFA grâce à une récolte optimale ou un cadrage budgétaire rigoureux.
                          </span>
                        ) : (
                          <span className="text-amber-400 font-semibold block">
                            ⚠️ Diagnostic : Manque à gagner détecté ! L'écart de marge est négatif de {Math.abs(margeBruteReelle - margeBrutePrevisionnelle).toLocaleString()} FCFA, imputable à des surcoûts direct d'exploitation ou aux aléas subis.
                          </span>
                        )}
                      </p>
                    </div>

                  </div>

                </div>
              );
            })()}
          </div>
        )}

        {/* VIEW 4: INTERVENTIONS */}
        {activeTab === 'interventions' && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 text-sm">Journal des Interventions Culturales</h3>
            <div className="overflow-x-auto border rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b text-slate-600 font-semibold uppercase">
                  <tr>
                    <th className="p-3">Date</th>
                    <th className="p-3">Culture</th>
                    <th className="p-3">Type Intervention</th>
                    <th className="p-3">Substance Intrant utilisée</th>
                    <th className="p-3">Quantité Intrant</th>
                    <th className="p-3">Main d'oeuvre (Coût)</th>
                    <th className="p-3">Responsable</th>
                    <th className="p-3">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-slate-700">
                  {interventions.map((i) => (
                    <tr key={i.id} className="hover:bg-slate-50 transition">
                      <td className="p-3 font-mono text-slate-600">{i.date}</td>
                      <td className="p-3 font-bold text-slate-900">{getCultureName(i.idCulture)}</td>
                      <td className="p-3">
                        <span className="font-semibold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded">
                          {i.type}
                        </span>
                      </td>
                      <td className="p-3 text-slate-600 font-medium">{i.substanceIntrant || 'Aucun'}</td>
                      <td className="p-3 text-slate-600 font-bold">
                        {i.quantiteIntrant ? `${i.quantiteIntrant} ${i.uniteIntrant || 'Kg'}` : '—'}
                      </td>
                      <td className="p-3 font-semibold text-indigo-600">
                        {i.mainDOeuvreCoût.toLocaleString()} FCFA
                      </td>
                      <td className="p-3 text-slate-500">{i.responsable}</td>
                      <td className="p-3">
                        <span className="font-medium text-[10px] bg-emerald-100 text-emerald-800 rounded-full px-2.5 py-0.5">
                          {i.statut}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW 5: RECOLTES */}
        {activeTab === 'recoltes' && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 text-sm">Historique des Récoltes & Multiplicateurs de Rendements</h3>
            <div className="overflow-x-auto border rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b text-slate-600 font-semibold uppercase">
                  <tr>
                    <th className="p-3">Date de Récolte</th>
                    <th className="p-3">Culture Source</th>
                    <th className="p-3">Quantitée Récoltée</th>
                    <th className="p-3">Qualité Grade</th>
                    <th className="p-3">Contrôle Sanitaire</th>
                    <th className="p-3">Valeur Estimée Unit. (FCFA/Kg)</th>
                    <th className="p-3">Valeur de Production Globale</th>
                    <th className="p-3">Rendement hectare calculé</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-slate-700">
                  {recoltes.map((r) => {
                    const cult = cultures.find(item => item.id === r.idCulture);
                    const surface = cult?.surfaceCultivee || 1.0;
                    const calculatedYield = r.quantite / surface;
                    const isSuspect = r.statutSanitaire === '⚠️ Résidus Suspects';

                    return (
                      <tr key={r.id} className="hover:bg-slate-50 transition">
                        <td className="p-3 font-mono">{r.date}</td>
                        <td className="p-3 font-bold text-slate-900">{getCultureName(r.idCulture)}</td>
                        <td className="p-3 font-extrabold text-emerald-700">{r.quantite.toLocaleString()} Kg</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            r.qualite === 'Premium' ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-100 text-slate-800'
                          }`}>
                            {r.qualite}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold inline-block ${
                            isSuspect ? 'bg-rose-100 text-rose-800 border border-rose-300' : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          }`}>
                            {r.statutSanitaire || 'Conforme'}
                          </span>
                          {r.noteSanitaire && (
                            <span className="block text-[10px] text-slate-500 mt-1 italic max-w-[150px] truncate" title={r.noteSanitaire}>
                              Note : {r.noteSanitaire}
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-slate-600 font-mono">{r.prixVenteUnitairePoids} FCFA</td>
                        <td className="p-3 font-bold text-indigo-600">
                          {(r.quantite * r.prixVenteUnitairePoids).toLocaleString()} FCFA
                        </td>
                        <td className="p-3 font-bold">
                          <span className="text-emerald-700">{(calculatedYield / 1000).toFixed(2)} Tonnes / ha</span>
                          <span className="text-[10px] text-slate-400 block font-normal">Cible: {cult?.rendementCible} kg</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* MODALS */}
      {showAddExploitation && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-100 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-emerald-600 text-white p-4 flex justify-between items-center">
              <div>
                <h3 className="font-extrabold text-sm flex items-center gap-2">
                  <Warehouse className="h-5 w-5" />
                  Nouvelle Exploitation Foncère & Agro-industrielle
                </h3>
                <p className="text-[11px] text-emerald-100 mt-0.5">Enregistrement d'un nouveau site de production ou d'une nouvelle ferme.</p>
              </div>
              <button 
                onClick={() => setShowAddExploitation(false)}
                className="text-white hover:text-emerald-100 font-bold text-sm bg-emerald-700/60 hover:bg-emerald-700 h-6 w-6 rounded-full flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateExploitation} className="p-5 space-y-4 text-xs">
              
              {/* SECTION A: MAIN LOGICAL PROFILE */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nom de l'Exploitation *</label>
                  <input 
                    type="text" 
                    required 
                    value={newExpNom} 
                    onChange={(e) => setNewExpNom(e.target.value)} 
                    placeholder="Ex: Ferme Maraîchère de Sangmélima" 
                    className="w-full border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-emerald-500 outline-hidden" 
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Type d'Activité *</label>
                  <select 
                    value={newExpType} 
                    onChange={(e) => setNewExpType(e.target.value as any)} 
                    className="w-full border border-slate-200 rounded-lg p-2 bg-white focus:ring-1 focus:ring-emerald-500 outline-hidden font-medium"
                  >
                    <option value="Mixte">Mixte (Cultures & Élevage)</option>
                    <option value="Végétale">Végétale (Maraîchage & Plantations)</option>
                    <option value="Élevage">Élevage (Bovin, Aviculture, Pisciculture)</option>
                    <option value="Agro-industrielle">Agro-industrielle (Transformation & Conditionnement)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Code National</label>
                  <input 
                    type="text" 
                    value={newExpCode} 
                    onChange={(e) => setNewExpCode(e.target.value)} 
                    placeholder="Ex: KA-SANG" 
                    className="w-full border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-emerald-500 outline-hidden font-mono text-xs uppercase" 
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Responsable terrain *</label>
                  <input 
                    type="text" 
                    required 
                    value={newExpResponsable} 
                    onChange={(e) => setNewExpResponsable(e.target.value)} 
                    placeholder="Ex: Jean-Pierre Ondoa" 
                    className="w-full border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-emerald-500 outline-hidden" 
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date d'implémentation</label>
                  <input 
                    type="text" 
                    disabled 
                    value={new Date().toISOString().split('T')[0]} 
                    className="w-full bg-slate-50 border border-slate-150 rounded-lg p-2 text-slate-400 font-mono" 
                  />
                </div>
              </div>

              {/* SECTION B: GEOLOCATION / LOCALISATION */}
              <div className="bg-slate-50/55 p-3 rounded-xl border border-slate-100 space-y-2.5">
                <span className="font-bold text-[10px] text-slate-500 uppercase tracking-wider block">Positionnement & SIG</span>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <div className="col-span-1">
                    <label className="block text-[10px] text-slate-600 mb-1">{customLabels?.villes || "Ville"}</label>
                    <input 
                      type="text" 
                      value={newExpVille} 
                      onChange={(e) => setNewExpVille(e.target.value)} 
                      placeholder="Sangmélima" 
                      className="w-full border border-slate-200 rounded-lg p-1.5 bg-white text-xs" 
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-[10px] text-slate-600 mb-1">{customLabels?.quartiersVillages || "Région"}</label>
                    <input 
                      type="text" 
                      value={newExpRegion} 
                      onChange={(e) => setNewExpRegion(e.target.value)} 
                      placeholder="Sud" 
                      className="w-full border border-slate-200 rounded-lg p-1.5 bg-white text-xs" 
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-[10px] text-slate-600 mb-1">Latitude (°N)</label>
                    <input 
                      type="number" 
                      step="0.0001" 
                      value={newExpLat} 
                      onChange={(e) => setNewExpLat(parseFloat(e.target.value) || 0)} 
                      className="w-full border border-slate-200 rounded-lg p-1.5 bg-white text-xs font-mono" 
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-[10px] text-slate-600 mb-1">Longitude (°E)</label>
                    <input 
                      type="number" 
                      step="0.0001" 
                      value={newExpLng} 
                      onChange={(e) => setNewExpLng(parseFloat(e.target.value) || 0)} 
                      className="w-full border border-slate-200 rounded-lg p-1.5 bg-white text-xs font-mono" 
                    />
                  </div>
                </div>
              </div>

              {/* SECTION C: MEASUREMENTS */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Superficie Totale (ha) *</label>
                  <input 
                    type="number" 
                    required 
                    min="1" 
                    value={newExpSurf} 
                    onChange={(e) => {
                      const v = parseInt(e.target.value) || 0;
                      setNewExpSurf(v);
                      setNewExpSurfCultivable(Math.floor(v * 0.85)); // dynamic helper suggestion
                    }} 
                    className="w-full border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-emerald-500 outline-hidden font-mono" 
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Superficie Cultivable utile (ha)</label>
                  <input 
                    type="number" 
                    min="1" 
                    value={newExpSurfCultivable} 
                    onChange={(e) => setNewExpSurfCultivable(parseInt(e.target.value) || 0)} 
                    className="w-full border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-emerald-500 outline-hidden font-mono" 
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Brève description de la ferme</label>
                <textarea 
                  value={newExpDesc} 
                  onChange={(e) => setNewExpDesc(e.target.value)} 
                  rows={2} 
                  placeholder="Écrivez brièvement les ambitions de production et d'élevage pour ce site..." 
                  className="w-full border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-emerald-500 outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button 
                  type="button" 
                  onClick={() => setShowAddExploitation(false)} 
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-lg transition"
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-5 py-2 rounded-lg shadow-md hover:shadow-emerald-900/10 transition"
                >
                  Créer l'Exploitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddParcelle && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full border shadow-lg overflow-hidden">
            <div className="bg-emerald-600 text-white p-4">
              <h3 className="font-semibold text-sm">Créer une nouvelle Parcelle</h3>
            </div>
            <form onSubmit={handleCreateParcelle} className="p-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Code Parcelle *</label>
                  <input type="text" required value={newParCode} onChange={(e) => setNewParCode(e.target.value)} placeholder="Ex: P_OB-N3" className="w-full border border-slate-200 rounded p-2" />
                </div>
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Nom de la Parcelle *</label>
                  <input type="text" required value={newParNom} onChange={(e) => setNewParNom(e.target.value)} placeholder="Ex: Zone Nord Argile" className="w-full border border-slate-200 rounded p-2" />
                </div>
              </div>
              <div>
                <label className="block font-medium text-slate-600 mb-1">Champ d'appartenance *</label>
                <select 
                  value={newParChampId} 
                  onChange={(e) => setNewParChampId(e.target.value)}
                  className="w-full border border-slate-200 rounded p-2 bg-white"
                >
                  <option value="">-- Choisir un champ parent --</option>
                  {champs.map(c => (
                    <option key={c.id} value={c.id}>{c.nom} ({c.code} - {c.ville})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Surface (Hectares) *</label>
                  <input type="number" step="0.1" required value={newParSurf} onChange={(e) => setNewParSurf(parseFloat(e.target.value) || 0)} className="w-full border border-slate-200 rounded p-2" />
                </div>
                <div>
                  <label className="block font-medium text-slate-600 mb-1">PH du Sol</label>
                  <input type="number" step="0.1" value={newParPh} onChange={(e) => setNewParPh(parseFloat(e.target.value) || 0)} className="w-full border border-slate-200 rounded p-2" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Latitude (°N)</label>
                  <input type="number" step="0.0001" value={newParLat} onChange={(e) => setNewParLat(parseFloat(e.target.value) || 0)} className="w-full border border-slate-200 rounded p-2" />
                </div>
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Longitude (°E)</label>
                  <input type="number" step="0.0001" value={newParLng} onChange={(e) => setNewParLng(parseFloat(e.target.value) || 0)} className="w-full border border-slate-200 rounded p-2" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Type de Sol</label>
                  <input type="text" value={newParSol} onChange={(e) => setNewParSol(e.target.value)} className="w-full border border-slate-200 rounded p-2" />
                </div>
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Source d'irrigation</label>
                  <input type="text" value={newParEau} onChange={(e) => setNewParEau(e.target.value)} className="w-full border border-slate-200 rounded p-2" />
                </div>
              </div>
              <div className="border-t pt-2 space-y-2">
                <span className="font-bold text-[10px] text-slate-400 uppercase tracking-widest block">Évaluation & diagnostics Agronomiques</span>
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="expert-chk" 
                    checked={newParExpertValide} 
                    onChange={(e) => setNewParExpertValide(e.target.checked)} 
                    className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                  />
                  <label htmlFor="expert-chk" className="font-semibold text-slate-700 select-none">Habilitée par l'Expert Agronome</label>
                </div>
                <div>
                  <label className="block font-medium text-slate-500 mb-1">Rapport préliminaire expert</label>
                  <textarea 
                    value={newParExpertDesc} 
                    onChange={(e) => setNewParExpertDesc(e.target.value)} 
                    placeholder="Saisissez un rapport ou une description sur les sols..."
                    className="w-full border border-slate-200 rounded p-2 text-xs h-12"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setShowAddParcelle(false)} className="bg-slate-100 p-2 rounded">Annuler</button>
                <button type="submit" className="bg-emerald-600 text-white p-2 rounded font-semibold">Créer la Parcelle</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddChamp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full border shadow-lg overflow-hidden">
            <div className="bg-emerald-600 text-white p-4 flex justify-between items-center">
              <h3 className="font-semibold text-sm">
                {selectedChampForEdit ? `Modifier le Champ : ${selectedChampForEdit.nom}` : 'Créer un nouveau Champ'}
              </h3>
              <button 
                onClick={() => {
                  setShowAddChamp(false);
                  setSelectedChampForEdit(null);
                }}
                className="text-white hover:text-slate-200 text-xs font-bold"
              >
                ✕
              </button>
            </div>
            <form onSubmit={selectedChampForEdit ? handleEditChampSubmit : handleCreateChamp} className="p-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Code Champ (facultatif)</label>
                  <input 
                    type="text" 
                    value={newChampCode} 
                    onChange={(e) => setNewChampCode(e.target.value)} 
                    placeholder="Ex: REF-CMP-001 (Auto si vide)" 
                    className="w-full border border-slate-200 rounded p-2" 
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Nom du Champ *</label>
                  <input 
                    type="text" 
                    required 
                    value={newChampNom} 
                    onChange={(e) => setNewChampNom(e.target.value)} 
                    placeholder="Ex: Champ Sud Maïs Obala" 
                    className="w-full border border-slate-200 rounded p-2" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Ville d'implantation *</label>
                  <input 
                    type="text" 
                    required 
                    value={newChampVille} 
                    onChange={(e) => setNewChampVille(e.target.value)} 
                    placeholder="Obala" 
                    className="w-full border border-slate-200 rounded p-2" 
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Localité spécifique *</label>
                  <input 
                    type="text" 
                    required 
                    value={newChampLocalite} 
                    onChange={(e) => setNewChampLocalite(e.target.value)} 
                    placeholder="Ex: Secteur Nord-Est" 
                    className="w-full border border-slate-200 rounded p-2" 
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-600 mb-1">Coordonnées GPS de référence</label>
                <input 
                  type="text" 
                  value={newChampCoordonneesGps} 
                  onChange={(e) => setNewChampCoordonneesGps(e.target.value)} 
                  placeholder="Ex: 4.1680, 11.5340" 
                  className="w-full border border-slate-200 rounded p-2 font-mono" 
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t mt-2">
                <button 
                  type="button" 
                  onClick={() => {
                    setShowAddChamp(false);
                    setSelectedChampForEdit(null);
                  }} 
                  className="bg-slate-100 p-2 rounded text-slate-600 font-bold"
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  className="bg-emerald-600 text-white p-2 rounded font-semibold"
                >
                  {selectedChampForEdit ? 'Enregistrer les modifications' : 'Créer le Champ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddCulture && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-sm w-full border shadow-lg overflow-hidden">
            <div className="bg-emerald-600 text-white p-4 flex justify-between items-center">
              <h3 className="font-bold text-xs uppercase tracking-wide">Démarrer un nouveau Cycle de Culture</h3>
              <Sprout className="h-4 w-4 text-emerald-100" />
            </div>
            <form onSubmit={handleCreateCulture} className="p-4 space-y-3.5 text-xs">
              
              {/* Dynamic Parcel Information Card */}
              <div className="bg-emerald-50/50 rounded-lg p-2.5 space-y-1.5 border border-emerald-100 font-medium">
                <span className="text-[10px] uppercase text-emerald-800 block font-bold">Vérification de Charge Foncière</span>
                <div className="flex justify-between text-slate-600">
                  <span>Surface Totale :</span>
                  <span className="font-extrabold text-slate-900">
                    {(parcelles.find(p => p.id === (newCultParcelle || parcelles[0]?.id))?.surface || 0).toFixed(2)} Ha
                  </span>
                </div>
                <div className="flex justify-between text-indigo-600">
                  <span>Surface Disponible Restante :</span>
                  <span className="font-extrabold bg-indigo-100 px-1.5 rounded">
                    {(() => {
                      const p = parcelles.find(pa => pa.id === (newCultParcelle || parcelles[0]?.id));
                      if (!p) return "0.00";
                      const occupied = cultures.filter(c => c.idParcelle === p.id && c.statut === 'Active').reduce((sum, c) => sum + c.surfaceCultivee, 0);
                      return Math.max(0, p.surface - occupied).toFixed(2);
                    })()} Ha
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Type de Culture *</label>
                  <select value={newCultNom} onChange={(e) => setNewCultNom(e.target.value)} className="w-full border rounded p-2 bg-white font-semibold text-slate-800">
                    {typesCulture.map(tc => (
                      <option key={tc} value={tc}>{tc}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Variété Agricole</label>
                  <input type="text" value={newCultVariete} onChange={(e) => setNewCultVariete(e.target.value)} className="w-full border rounded p-2 font-semibold text-slate-800" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Parcelle d'affectation</label>
                  <select value={newCultParcelle} onChange={(e) => setNewCultParcelle(e.target.value)} className="w-full border rounded p-2 bg-white font-semibold text-slate-800">
                    {parcelles.map(p => (
                      <option key={p.id} value={p.id}>{p.nom} ({p.code})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Campagne Agricole</label>
                  <select value={newCultCampagne} onChange={(e) => setNewCultCampagne(e.target.value)} className="w-full border rounded p-2 bg-white text-slate-800">
                    {campagnes.map(c => (
                      <option key={c.id} value={c.id}>{c.nom} ({c.annee})</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Surface cultivée (ha) *</label>
                  <input type="number" step="0.1" required value={newCultSurf} onChange={(e) => setNewCultSurf(parseFloat(e.target.value) || 0)} className="w-full border border-slate-300 rounded p-2 font-bold text-slate-800" />
                </div>
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Rendement Cible (kg/ha)</label>
                  <input type="number" value={newCultCible} onChange={(e) => setNewCultCible(parseInt(e.target.value) || 0)} className="w-full border border-slate-300 rounded p-2 text-slate-800" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t">
                <button type="button" onClick={() => setShowAddCulture(false)} className="bg-slate-100 p-2 rounded text-slate-600 font-bold hover:bg-slate-200">Annuler</button>
                <button type="submit" className="bg-emerald-600 text-white p-2 px-3 rounded font-extrabold shadow-xs hover:bg-emerald-700">Semer / Planter</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddIntervention && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-sm w-full border shadow-lg overflow-hidden">
            <div className="bg-emerald-600 text-white p-4 flex justify-between items-center">
              <h3 className="font-bold text-xs uppercase tracking-wide">Enregistrer une intervention de terrain</h3>
              <Activity className="h-4 w-4 text-emerald-100" />
            </div>
            <form onSubmit={handleCreateIntervention} className="p-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-600 mb-1">Culture concernée *</label>
                <select value={newInterCulture} onChange={(e) => setNewInterCulture(e.target.value)} className="w-full border rounded p-2 bg-white text-slate-800 font-medium">
                  {cultures.map(c => (
                    <option key={c.id} value={c.id}>{c.nom} ({c.variete})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Type d'opération *</label>
                  <select value={newInterType} onChange={(e) => setNewInterType(e.target.value as any)} className="w-full border rounded p-2 bg-white text-slate-800 font-semibold">
                    {typesOperation.map(to => (
                      <option key={to} value={to}>{to}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Responsable terrain (Décideur/Opérateur)*</label>
                  <select value={newInterResp} onChange={(e) => setNewInterResp(e.target.value)} className="w-full border rounded p-2 bg-white text-slate-850 font-medium">
                    {responsablesTerrain.map(rt => (
                      <option key={rt.name} value={rt.name}>{rt.name} ({rt.type})</option>
                    ))}
                    {responsablesTerrain.length === 0 && (
                      <option value="Jean-Pierre Ondoa">Jean-Pierre Ondoa (Employé)</option>
                    )}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block font-semibold text-slate-600 mb-1">Substance Intrant utilisée *</label>
                  <select value={newInterIntrant} onChange={(e) => setNewInterIntrant(e.target.value)} className="w-full border rounded p-2 bg-white font-medium text-slate-800">
                    <option value="">-- Pas d'Intrant appliqué --</option>
                    {substances.map(s => (
                      <option key={s.name} value={s.name}>{s.name} ({s.type})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Quantité (Dosage)</label>
                  <input type="number" value={newInterIntrantQ} onChange={(e) => setNewInterIntrantQ(parseInt(e.target.value) || 0)} className="w-full border border-slate-200 rounded p-2 font-bold text-slate-800" />
                </div>
              </div>
              {newInterType === 'Traitement phytosanitaire' && (
                <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-lg space-y-1">
                  <label className="block font-bold text-emerald-800">Délai d'Attente avant Récolte (DAR en jours) *</label>
                  <input 
                    type="number" 
                    min="0"
                    placeholder="Ex: 7"
                    value={newInterDarDays} 
                    onChange={(e) => setNewInterDarDays(parseInt(e.target.value) || 0)} 
                    className="w-full border border-emerald-300 rounded p-1.5 focus:outline-hidden bg-white font-mono font-bold text-emerald-800"
                  />
                  <span className="text-[9.5px] text-emerald-650 block leading-tight italic">
                    Temps d'attente requis pour la biodégradation des intrants avant toute récolte.
                  </span>
                </div>
              )}
              <div>
                <label className="block font-semibold text-slate-600 mb-1">Coût de la Main d'Oeuvre Directe (FCFA) *</label>
                <input type="number" required value={newInterCost} onChange={(e) => setNewInterCost(parseInt(e.target.value) || 0)} className="w-full border border-slate-200 rounded p-2 font-mono text-indigo-700 font-extrabold" />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t">
                <button type="button" onClick={() => setShowAddIntervention(false)} className="bg-slate-100 p-2 rounded text-slate-600 font-bold hover:bg-slate-200">Annuler</button>
                <button type="submit" className="bg-emerald-600 text-white p-2 px-3 rounded font-extrabold shadow-sm hover:bg-emerald-700">Enregistrer l'opération</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddRecolte && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-sm w-full border shadow-lg overflow-hidden">
            <div className="bg-emerald-600 text-white p-4 flex justify-between items-center">
              <h3 className="font-bold text-xs uppercase tracking-wide">Saisir une Récolte de culture</h3>
              <Sprout className="h-4 w-4 text-emerald-100" />
            </div>
            <form onSubmit={handleCreateRecolte} className="p-4 space-y-3.5 text-xs">
              
              {/* Plot Concerned Selector FIRST */}
              <div>
                <label className="block font-bold text-emerald-800 mb-1">1. Parcelle d'Origine de la Récolte Concernée *</label>
                <select 
                  value={newRecParcelle} 
                  onChange={(e) => {
                    const selectedPid = e.target.value;
                    setNewRecParcelle(selectedPid);
                    // Automatically pre-select first active crop on this newly selected plot
                    const firstActiveCrop = cultures.find(c => c.idParcelle === selectedPid && c.statut === 'Active');
                    setNewRecCulture(firstActiveCrop?.id || '');
                  }} 
                  className="w-full border border-slate-300 rounded p-2 bg-slate-50 text-slate-800 font-extrabold"
                >
                  <option value="">-- Sélectionnez une parcelle --</option>
                  {parcelles.map(p => (
                    <option key={p.id} value={p.id}>{p.nom} ({p.code})</option>
                  ))}
                </select>
              </div>

              {/* Crop of selected plot SECOND */}
              <div>
                <label className="block font-bold text-emerald-800 mb-1">2. Cycle de Culture Cultivé Associé *</label>
                <select 
                  value={newRecCulture} 
                  required
                  onChange={(e) => setNewRecCulture(e.target.value)} 
                  className="w-full border rounded p-2 bg-white text-slate-800 font-semibold"
                >
                  {newRecParcelle ? (
                    (() => {
                      const matchedCrops = cultures.filter(c => c.idParcelle === newRecParcelle);
                      if (matchedCrops.length === 0) {
                        return <option value="">⚠️ Aucune culture enregistrée sur cette parcelle</option>;
                      }
                      return matchedCrops.map(c => (
                        <option key={c.id} value={c.id}>{c.nom} ({c.variete || 'Cultivé'})</option>
                      ));
                    })()
                  ) : (
                    <option value="">Sélectionnez d'abord une parcelle ci-dessus</option>
                  )}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2 border-t pt-2">
                <div className="col-span-2">
                  <label className="block font-semibold text-slate-600 mb-1">Quantité Pesée *</label>
                  <input type="number" required value={newRecQuant} onChange={(e) => setNewRecQuant(parseInt(e.target.value) || 0)} className="w-full border border-slate-200 rounded p-2 font-extrabold text-slate-800" />
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Unité métrique</label>
                  <select value={newRecUnit} onChange={(e) => setNewRecUnit(e.target.value as any)} className="w-full border rounded p-2 bg-white font-extrabold text-slate-800">
                    <option value="Kg">Kg</option>
                    <option value="Tonnes">Tonnes</option>
                    <option value="Sacs">Sacs</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Qualité certifiée</label>
                  <select value={newRecQual} onChange={(e) => setNewRecQual(e.target.value as any)} className="w-full border rounded p-2 bg-white text-slate-850 font-bold">
                    <option value="Premium">Premium</option>
                    <option value="Standard">Standard</option>
                    <option value="Rejet">Rejet / Perte</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Valeur de rachat (FCFA/Kg)</label>
                  <input type="number" value={newRecPrice} onChange={(e) => setNewRecPrice(parseInt(e.target.value) || 0)} className="w-full border border-slate-200 rounded p-2 text-indigo-700 font-extrabold" />
                </div>
              </div>

              {newRecCulture && (() => {
                const activeDarIntervention = isCultureUnderDar(newRecCulture);
                if (!activeDarIntervention) return null;
                return (
                  <div className="bg-rose-50 border border-rose-200 p-2.5 rounded-lg space-y-1 text-rose-900 font-medium">
                    <span className="font-extrabold flex items-center gap-1 text-[11px] text-rose-700">
                      <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0 animate-pulse" />
                      ALERTE PHYTOSANITAIRE : Protocole DAR actif !
                    </span>
                    <p className="text-[10px] leading-tight text-slate-700">
                      Cette culture a reçu un traitement de <strong>{activeDarIntervention.substanceIntrant || 'Phytosanitaire'}</strong> le <strong>{activeDarIntervention.date}</strong> avec un DAR de <strong>{activeDarIntervention.darDays} jours</strong>.
                    </p>
                    <p className="text-[10px] font-bold text-rose-800">
                      ⚠️ Récolte déconseillée avant le : {activeDarIntervention.darExpiration}
                    </p>
                  </div>
                );
              })()}

              <div className="grid grid-cols-1 gap-2 border-t pt-2.5">
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Statut Sanitaire & Traçabilité</label>
                  <select 
                    value={newRecStatutSanitaire} 
                    onChange={(e) => setNewRecStatutSanitaire(e.target.value as any)} 
                    className="w-full border border-slate-300 rounded p-2 bg-white text-slate-800 font-bold"
                  >
                    <option value="Conforme">Conforme (Aucun résidu chimique suspecté)</option>
                    <option value="⚠️ Résidus Suspects">⚠️ Alerte résidus suspects (DAR non atteint)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Notes sanitaires / Traçabilité</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Forçage exceptionnel ou résultat d'analyse bio"
                    value={newRecNoteSanitaire}
                    onChange={(e) => setNewRecNoteSanitaire(e.target.value)}
                    className="w-full border border-slate-200 rounded p-2 text-slate-800"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button type="button" onClick={() => setShowAddRecolte(false)} className="bg-slate-100 p-2 rounded text-slate-600 font-bold hover:bg-slate-200">Annuler</button>
                <button type="submit" className="bg-emerald-600 text-white p-2 px-3 rounded font-extrabold shadow-sm hover:bg-emerald-700">Valider la pesée & récolter</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL POUR DECLARER UN ALEA / INCIDENT DE PRODUCTION */}
      {showAddIncidentModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-sm w-full border shadow-lg overflow-hidden">
            <div className="bg-rose-600 text-white p-4 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-xs uppercase tracking-wide">Déclarer un Aléa de Production</h3>
                <p className="text-[10px] text-rose-100 mt-0.5">Suivi des risques & sinistres agricoles</p>
              </div>
              <AlertTriangle className="h-5 w-5 text-rose-100 font-extrabold animate-bounce" />
            </div>
            
            <form onSubmit={handleCreateIncident} className="p-4 space-y-3.5 text-xs">
              
              {/* Culture concerned Selector */}
              <div>
                <label className="block font-bold text-rose-805 mb-1">Culture sinistrée *</label>
                <select 
                  value={newIncCultureId} 
                  required
                  onChange={(e) => setNewIncCultureId(e.target.value)} 
                  className="w-full border border-slate-300 rounded p-2 bg-slate-50 text-slate-800 font-bold"
                >
                  <option value="">-- Sélectionnez la culture touchée --</option>
                  {cultures.map(c => (
                    <option key={c.id} value={c.id}>{c.nom} ({c.variete || 'Cultivée'})</option>
                  ))}
                </select>
              </div>

              {/* Type d'accident */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Nature de l'aléa *</label>
                  <select 
                    value={newIncType} 
                    onChange={(e) => setNewIncType(e.target.value as any)} 
                    className="w-full border rounded p-2 bg-white text-slate-800 font-bold"
                  >
                    <option value="Maladies">Maladies</option>
                    <option value="Ravageurs">Ravageurs</option>
                    <option value="Sécheresse">Sécheresse</option>
                    <option value="Inondation">Inondation</option>
                    <option value="Incendie">Incendie</option>
                    <option value="Vol">Vol de cultures</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Taux Perte estimé (%)</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="100" 
                    required 
                    value={newIncTauxPerte} 
                    onChange={(e) => setNewIncTauxPerte(parseInt(e.target.value) || 0)} 
                    className="w-full border border-slate-200 rounded p-2 font-extrabold text-red-700" 
                  />
                </div>
              </div>

              {/* Surface Impactee */}
              <div>
                <label className="block font-semibold text-slate-600 mb-1">Surface affectée (Ha) *</label>
                <input 
                  type="number" 
                  step="0.01" 
                  required 
                  value={newIncSurfaceImpactee} 
                  onChange={(e) => setNewIncSurfaceImpactee(parseFloat(e.target.value) || 0)} 
                  className="w-full border border-slate-200 rounded p-2 font-bold text-slate-800" 
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-semibold text-slate-600 mb-1">Description agronomique & Cause *</label>
                <textarea 
                  rows={2}
                  required 
                  value={newIncDescription} 
                  onChange={(e) => setNewIncDescription(e.target.value)} 
                  className="w-full border border-slate-200 rounded p-2 text-slate-800 font-medium" 
                  placeholder="Expliquez la cause agronomique et l'impact direct..."
                />
              </div>

              <div className="bg-rose-50 text-rose-800 p-2.5 rounded-lg border border-rose-200 text-[10px] space-y-0.5 font-bold">
                💡 <span className="underline">Calcul Automatique Agronomique :</span>
                {(() => {
                  const activeId = newIncCultureId || (cultures[0]?.id || '');
                  const cult = cultures.find(c => c.id === activeId);
                  if (!cult) return <span className="block italic text-slate-400 mt-0.5">Veuillez d'abord choisir une culture.</span>;
                  const Q_lost = ((newIncTauxPerte || 15) / 100) * cult.rendementCible * (cult.surfaceCultivee || 1);
                  const computedLossVal = Q_lost * (cult.prixVentePrevisionnel || 350);
                  return (
                    <div className="mt-1 space-y-0.5 font-mono">
                      <div className="flex justify-between">
                        <span>Perte Matière est.:</span>
                        <span>{Math.round(Q_lost).toLocaleString()} Kg</span>
                      </div>
                      <div className="flex justify-between text-rose-700 font-black">
                        <span>Sinistre Foncier est.:</span>
                        <span>-{Math.round(computedLossVal).toLocaleString()} FCFA</span>
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button 
                  type="button" 
                  onClick={() => setShowAddIncidentModal(false)} 
                  className="bg-slate-100 p-2 rounded text-slate-600 font-bold hover:bg-slate-200"
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  className="bg-rose-600 text-white p-2 px-4 rounded font-extrabold shadow-sm hover:bg-rose-700"
                >
                  Valider le sinistre & Sauvegarder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
