/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// SAAS TYPES
export type SubscriptionPlan = 'Starter' | 'Professional' | 'Enterprise' | 'Cooperative';

export interface SaaSClient {
  id: string;
  idLicence: string;
  raisonSociale: string;
  sigle: string;
  numContribuable: string;
  regCommerce: string;
  secteur: string;
  responsableNom: string;
  responsablePrenom: string;
  responsableEmail: string;
  responsableTel: string;
  pays: string;
  region: string;
  ville: string;
  statut: 'Démonstration' | 'Essai Gratuit' | 'Actif' | 'Suspendu' | 'Résilié' | 'Archivé';
  plan: SubscriptionPlan;
  dateCreation: string;
  dateExpiration: string;
  surfaceExploitee: number; // Hectares
  maxUtilisateurs: number;
  superAdminLogin?: string;
  superAdminPassword?: string;
  mustChangePassword?: boolean;
}

export interface SaaSLog {
  id: string;
  date: string;
  utilisateur: string;
  ip: string;
  action: string;
  module: string;
  statut: 'Succès' | 'Échec' | 'Infos';
}

// AGRICULTURE TYPES
export interface Exploitation {
  id: string;
  code: string;
  nom: string;
  description: string;
  typeExploitation?: 'Végétale' | 'Élevage' | 'Mixte' | 'Agro-industrielle';
  responsable: string;
  pays: string;
  region: string;
  ville: string;
  latitude: number;
  longitude: number;
  surfaceTotale: number;
  surfaceCultivable: number;
  dateCreation: string;
  statut: 'Actif' | 'Archivé';
}

export interface SiteAgricole {
  id: string;
  idExploitation: string;
  nom: string;
  responsable: string;
  ville: string;
}

export interface Champ {
  id: string; // e.g. CMP-01
  code: string; // e.g. REF-CMP-001
  nom: string;
  ville: string;
  localite: string;
  coordonneesGps: string;
}

export interface Parcelle {
  id: string;
  idSite: string; // compatibility
  idChamp?: string; // linked field (un champ a plusieurs parcelles, une parcelle appartient à un seul champ)
  code: string;
  nom: string;
  surface: number; // Hectares (superficie)
  latitude: number;
  longitude: number;
  typeSol: string;
  ph: number;
  sourceEau: string;

  // Location / Lease Info (Information de base)
  locationStatus?: 'Propriété' | 'Location';
  periodeLocation?: string; // e.g., "12 mois"
  bornageStatus?: 'Borné' | 'Non borné';

  // Base Costs (Coûts de la parcelle)
  coutAcquisition?: number;
  coutBornage?: number;
  coutAnalyseSol?: number;
  coutExpertValidation?: number;

  // Analysis & Agronomic Diagnostics (Analyse et diagnostic agronomique)
  carences?: string;
  topographie?: string; // e.g., "Pente", "Plat"
  drainage?: string; // e.g., "Bon", "Moyen"
  expertDescription?: string;
  expertValide?: boolean;

  // Campaign Planning (Planification de la campagne)
  cultureSemeId?: string; // exact sown culture ID (une parcelle a une seule culture semée)
  calendrierCultural?: string; // e.g. "Mars - Juillet"
  budgetPrevisionnel?: number;
  unitsIntrantsPrevus?: number; // quantity
  coutIntrantsPrevus?: number; // price * quantity cost

  // Soil preparation (Préparation du sol)
  preparLabourCarburant?: number;
  preparLabourMainOeuvre?: number;
  preparLabourMateriel?: number;
  preparSousSolageHersage?: number;
  preparAmendementType?: string;
  preparAmendementQty?: number;
  preparAmendementPrix?: number;
  preparFertilisationFond?: number;

  // Sowing / Plantation (Semis / Plantations)
  semisDensite?: string; // e.g., "50k plants/ha"
  semisProfondeur?: number; // cm
  semisDateOptimale?: string;
  semisSemencesQty?: number;
  semisSemencesPrixUnitaire?: number;
  semisTraitementSemencesCout?: number;

  // Crop monitoring (Suivi cultural)
  suiviIrrigationVolume?: number;
  suiviIrrigationFrequence?: string;
  suiviIrrigationCoutEne?: number;
  suiviPhytoRef?: string;
  suiviPhytoDose?: string;
  suiviPhytoCout?: number;
  suiviFertilisationType?: string;
  suiviFertilisationDose?: string;
  suiviFertilisationCout?: number;
  suiviDesherbageMethode?: string;
  suiviDesherbageProduit?: string;
  suiviDesherbageCout?: number;

  // Maturity assessment (Évaluation de la maturité)
  evalDegreBrix?: number;
  evalHumiditeGrain?: number;
  evalTestsVisuels?: string;
  evalStadesPhenologiques?: string;
  evalAnalysesCout?: number;

  // Harvest (Récolte)
  recolteMoMainOeuvreJours?: number;
  recolteMoTauxJournalier?: number;
  recolteMatLocationMachineCout?: number;
  recolteConditionsMeteo?: string;
  recolteTracabiliteLot?: string;

  // Post-harvest (Post-récolte)
  postStockageLoyer?: number;
  postStockagePertesCout?: number;
  postSechageCout?: number;
  postConditionnementTransportCout?: number;

  // Sales / revenue
  salesCanal?: string;
  salesPrixUnitaire?: number;
  salesVolume?: number;
}

export interface Campagne {
  id: string;
  code: string;
  nom: string;
  annee: string;
  dateDebut: string;
  dateFin: string;
  statut: 'Planifiée' | 'En cours' | 'Terminée' | 'Archivée';
}

export interface Culture {
  id: string;
  idCampagne: string;
  idParcelle: string;
  responsable: string;
  nom: string; // Maïs, Cacao, Tomate, etc.
  variete: string;
  surfaceCultivee: number;
  dateSemis: string;
  dateRecoltePrevue: string;
  rendementCible: number; // kg/ha or tonnes/ha
  statut: 'Planifiée' | 'Active' | 'Récoltée' | 'Incidentée' | 'Clôturée';
  budgetPrevisionnel?: number;
  prixVentePrevisionnel?: number;
  pertesEstimees?: number;
  noteCloture?: string;
  isLouee?: boolean;
  coutLocation?: number;
}

export interface Intervention {
  id: string;
  idParcelle: string;
  idCulture: string;
  date: string;
  type: 'Préparation terrain' | 'Labour' | 'Semis' | 'Fertilisation' | 'Irrigation' | 'Traitement phytosanitaire' | 'Désherbage' | 'Récolte';
  substanceIntrant?: string;
  quantiteIntrant?: number;
  uniteIntrant?: string;
  mainDOeuvreCoût: number;
  responsable: string;
  machinesUtilisees?: string;
  statut: 'Planifiée' | 'En cours' | 'Validée';
  darDays?: number;
  darExpiration?: string;
}

export interface Recolte {
  id: string;
  idCulture: string;
  date: string;
  quantite: number; // kg
  qualite: 'Premium' | 'Standard' | 'Rejet';
  unite: 'Kg' | 'Tonnes' | 'Sacs' | 'Caisses';
  prixVenteUnitairePoids: number; // FCFA/kg
  statutSanitaire?: 'Conforme' | '⚠️ Résidus Suspects';
  noteSanitaire?: string;
}

export interface IncidentAgricole {
  id: string;
  idParcelle: string;
  idCulture?: string; // Linked crop cycle
  date: string;
  type: 'Sécheresse' | 'Inondation' | 'Incendie' | 'Vol' | 'Maladies' | 'Ravageurs';
  description: string;
  perteEstimeeFCFA: number;
  surfaceImpactee?: number; // ha
  tauxPerte?: number; // %
  quantitePerdue?: number; // kg or units
}

// ELEVAGE TYPES
export interface SiteElevage {
  id: string;
  idExploitation?: string;
  nom: string;
  code: string;
  responsable: string;
  coordonnesGPS: string;
}

export interface Batiment {
  id: string;
  idSiteElevage: string;
  nom: string;
  type: 'Étable' | 'Bergerie' | 'Porcherie' | 'Poulailler' | 'Bassin piscicole' | 'Enclos';
  capaciteMax: number;
  surface: number;
}

export interface Troupeau {
  id: string;
  idBatiment: string;
  nom: string;
  espece: 'Bovin' | 'Porcin' | 'Ovin' | 'Caprin' | 'Volaille' | 'Pisciculture';
  race: string;
  responsable: string;
}

export interface Animal {
  id: string;
  idTroupeau: string;
  idBatiment: string;
  codeUnique: string;
  nom: string;
  sexe: 'Mâle' | 'Femelle';
  dateNaissance: string;
  statut: 'Actif' | 'Vendu' | 'Décédé' | 'Réformé';
  poidsActuel: number;
}

export interface ReproductionGestation {
  id: string;
  idAnimalFemelle: string;
  idAnimalMale?: string;
  dateFecondation: string;
  datePrevueMiseBas: string;
  statut: 'En cours' | 'Mise bas réussie' | 'Échec';
  dateMiseBas?: string;
  nombrePetits?: number;
  survivants?: number;
}

export interface CarnetSanitaire {
  id: string;
  idAnimal?: string;
  idTroupeau?: string; // optionnel s'il s'agit d'un traitement de groupe (volailles/poissons)
  date: string;
  type: 'Vaccination' | 'Traitement' | 'Consultation' | 'Déparasitage';
  diagnostic: string;
  produitSelectionne: string;
  veterinaire: string;
  coûtVeto: number;
}

export interface FeedLog {
  id: string;
  idTroupeau: string;
  date: string;
  aliment: string;
  quantiteKg: number;
  coûtFCFA: number;
}

export interface ProductionElevage {
  id: string;
  idTroupeau?: string;
  idAnimal?: string;
  date: string;
  type: 'Lait' | 'Œufs' | 'Viande' | 'Biomasse Poisson';
  quantite: number;
  unite: 'Litres' | 'Unités' | 'Kg';
}

// STORAGE & EQUIPMENT TYPES
export interface Magasin {
  id: string;
  code: string;
  nom: string;
  responsable: string;
  site: string;
  type: 'Intrants' | 'Produits Récoltés' | 'Produits Vétérinaires' | 'Aliments Animaux' | 'Carburants' | 'Entrepôt Général';
}

export interface Article {
  id: string;
  code: string;
  designation: string;
  categorie: 'Semences' | 'Engrais' | 'Produits Phytosanitaires' | 'Produits Vétérinaires' | 'Aliments Animaux' | 'Carburants' | 'Produits Récoltés' | 'Pièces Détachées';
  uniteMesure: string;
  stockMinimum: number;
  prixFournisseurMoyen: number;
}

export interface MouvementStock {
  id: string;
  idMagasin: string;
  idArticle: string;
  date: string;
  type: 'Entrée' | 'Sortie';
  quantite: number;
  motif: 'Achat' | 'Récolte' | 'Consommation Agricole' | 'Consommation Élevage' | 'Perte' | 'Vente' | 'Transfert';
  coutUnitaire: number;
  responsable: string;
}

export interface Equipement {
  id: string;
  code: string;
  designation: string;
  type: 'Tracteur' | 'Véhicule' | 'Machine agricole' | 'Pompe' | 'Générateur' | 'Outil';
  marque: string;
  modele: string;
  immatriculation?: string;
  dateAchat: string;
  valeurAcquisition: number;
  dureeDeVieMois: number;
  etat: 'En service' | 'En maintenance' | 'Hors service';
  heuresMoteurOrKm: number;
}

export interface MaintenanceOrder {
  id: string;
  idEquipement: string;
  type: 'Préventive' | 'Corrective';
  technicien: string;
  datePlanifiee: string;
  dateRealisation?: string;
  description: string;
  statut: 'En attente' | 'Réalisée';
  coûtFCFA: number;
}

export interface FuelLog {
  id: string;
  idEquipement: string;
  date: string;
  quantiteLitre: number;
  coûtFCFA: number;
  chauffeur: string;
}

// COMMERCIAL & PURCHASE TYPES
export interface Fournisseur {
  id: string;
  code: string;
  raisonSociale: string;
  categorie: string;
  tel: string;
  email: string;
  adresse: string;
  numContribuable: string;
  conditionsReglement: string;
}

export interface DemandeAchat {
  id: string;
  code: string;
  date: string;
  demandeur: string;
  priorite: 'Faible' | 'Normale' | 'Haute' | 'Urgente';
  designationArticle: string;
  quantite: number;
  unite: string;
  justification: string;
  statut: 'Brouillon' | 'En validation' | 'Validée' | 'Rejetée' | 'Commandée';
}

export interface BonDeCommande {
  id: string;
  idFournisseur: string;
  code: string;
  date: string;
  designationArticle: string;
  quantite: number;
  coutUnitaire: number;
  total: number;
  statut: 'Brouillon' | 'Validé' | 'Réceptionné Partial' | 'Réceptionné Complet';
}

export interface ClientAcheteur {
  id: string;
  code: string;
  raisonSociale: string;
  categorie: 'Grossiste' | 'Détaillant' | 'Industriel' | 'Exportateur' | 'Particulier';
  tel: string;
  email: string;
  adresse: string;
  plafondCredit: number;
  soldeCreditActuel: number;
}

export interface DevisClient {
  id: string;
  idClient: string;
  code: string;
  date: string;
  dateValidite: string;
  produit: string;
  quantite: number;
  prixUnitaire: number;
  total: number;
  statut: 'Brouillon' | 'Envoyé' | 'Accepté' | 'Refusé';
}

export interface CommandeClient {
  id: string;
  idClient: string;
  code: string;
  date: string;
  produit: string;
  quantite: number;
  prixUnitaire: number;
  total: number;
  statut: 'Validée' | 'En préparation' | 'Livrée' | 'Annulée';
  commercialId: string;
}

export interface FactureClient {
  id: string;
  idClient: string;
  type: 'Standard' | 'Acompte' | 'Avoir';
  code: string;
  date: string;
  dateEcheance: string;
  produit: string;
  quantite: number;
  total: number;
  statut: 'Non payée' | 'Partiellement payée' | 'Payée';
}

export interface EncaissementClient {
  id: string;
  idFacture: string;
  date: string;
  montant: number;
  modePaiement: 'Espèces' | 'Chèque' | 'Virement' | 'Mobile Money';
  reference: string;
}

// FINANCE & SYSCOHADA TYPES
export interface PieceComptable {
  id: string;
  date: string;
  codeJournal: 'ACH' | 'VEN' | 'BQ' | 'CAI' | 'OD';
  refePiece: string;
  libelle: string;
  debitCompte: string; // Ex: 6011
  creditCompte: string; // Ex: 4011
  montant: number;
  valide: boolean;
  centreCoutAnalytique?: string; // Ex: "Parcelle B02", "Poulailler A"
}

export interface Budget {
  id: string;
  departement: 'Agriculture' | 'Élevage' | 'Maintenance' | 'Administration' | 'Commercial' | 'RH';
  annee: string;
  montantInitial: number;
  montantEngage: number;
}

// HR & PAYROLL TYPES
export interface Employe {
  id: string;
  matricule: string;
  nom: string;
  prenom: string;
  sexe: 'Mâle' | 'Femelle';
  dateNaissance: string;
  tel: string;
  email: string;
  poste: string;
  department: 'Administration' | 'Technique' | 'Agriculture' | 'Élevage' | 'Commercial';
  contratType: 'CDI' | 'CDD' | 'Saisonnier' | 'Journalier';
  dateEmbauche: string;
  salaireBase: number; // FCFA
  statut: 'Actif' | 'Suspendu' | 'Désactivé' | 'En attente';
}

export interface PresencePointage {
  id: string;
  idEmploye: string;
  date: string;
  heureEntree: string;
  heureSortie: string;
  dureeHeures: number;
  statut: 'Présent' | 'Retard' | 'Absence Justifiée' | 'Absence Injustifiée';
}

export interface BulletinPaie {
  id: string;
  idEmploye: string;
  periode: string; // Ex: "05-2026"
  salaireBase: number;
  heuresSupMontant: number;
  primes: number;
  avancesRetenues: number;
  cotisationCNPS: number; // 4.2% or customizable
  impotIGR: number;
  netAPayer: number;
  statut: 'Brouillon' | 'Validé' | 'Payé';
}

// GED TYPES
export interface FichierDocument {
  id: string;
  nom: string;
  categorie: 'Administratif' | 'RH' | 'Agricole' | 'Élevage' | 'Financier' | 'Technique';
  tailleMo: number;
  dateImport: string;
  indexationTags: string[];
  urlFictive: string;
  auteur: string;
  arborescence: string; // "Entreprise/RH", etc
}

// NOTIFICATIONS & AUDITS
export interface AlerteRegle {
  id: string;
  nom: string;
  condition: string; // "Stock < StockMinimum", etc
  canal: 'System' | 'Email' | 'SMS';
  priorite: 'Faible' | 'Normale' | 'Élevée' | 'Critique';
  active: boolean;
}

export interface NotificationAlerte {
  id: string;
  titre: string;
  description: string;
  priorite: 'Faible' | 'Normale' | 'Élevée' | 'Critique' | 'Bloquante';
  canalSource: string;
  date: string;
  statut: 'Non lue' | 'Lue' | 'Traitée';
}

export interface AuditLog {
  id: string;
  dateHeure: string;
  operateur: string;
  role: string;
  action: string;
  description: string;
}

export interface PrevisionMeteo {
  date: string;
  temperatureCelcius: number;
  conditionsCiel: string;
  risquesPluiePourcent: number;
  humiditeRecense: number;
  directionVent: string;
}

// SYSTEM SETTINGS TYPES FOR CLIENT ENDS
export interface Role {
  id: string;
  name: string;
  modules: string[];
  canModify: boolean;
  canDelete: boolean;
  canImport: boolean;
  canExport: boolean;
}

export interface CustomLabels {
  prodVegetale: string;
  prodAnimale: string;
  cultures: string;
  animaux: string;
  parcelles: string;
  postes?: string;
  produitsServices?: string;
  villes?: string;
  quartiersVillages?: string;
}

export interface SystemSettings {
  customLabels: CustomLabels;
  roles: Role[];
  activeRoleId: string;
}

// USER MANAGEMENT TYPES
export interface Utilisateur {
  id: string;
  nom: string;
  email: string;
  password: string;
  roleId: string; // e.g. 'role-superadmin', 'role-veto', 'role-comptable', 'role-ouvrier'
  statut: 'Actif' | 'Inactif';
  mustChangePassword?: boolean;
}

export interface TenantDatabase {
  exploitations: Exploitation[];
  sitesAgricoles: SiteAgricole[];
  champs?: Champ[]; // un champ a plusieurs parcelles, une parcelle appartient à un seul champ, une ville a plusieurs champs
  parcelles: Parcelle[];
  utilisateurs?: Utilisateur[]; // user management
  campagnes: Campagne[];
  cultures: Culture[];
  interventions: Intervention[];
  recoltes: Recolte[];
  incidents: IncidentAgricole[];
  sitesElevage: SiteElevage[];
  batiments: Batiment[];
  troupeaux: Troupeau[];
  animaux: Animal[];
  reproGestations: ReproductionGestation[];
  carnetsSanitaires: CarnetSanitaire[];
  feedLogs: FeedLog[];
  prodElevages: ProductionElevage[];
  magasins: Magasin[];
  articles: Article[];
  mouvementsStock: MouvementStock[];
  equipements: Equipement[];
  maintenances: MaintenanceOrder[];
  fuelLogs: FuelLog[];
  fournisseurs: Fournisseur[];
  demandesAchat: DemandeAchat[];
  bonsCommande: BonDeCommande[];
  clientsAcheteurs: ClientAcheteur[];
  devis: DevisClient[];
  commandesClients: CommandeClient[];
  factures: FactureClient[];
  encaissements: EncaissementClient[];
  piecesComptables: PieceComptable[];
  budgets: Budget[];
  employes: Employe[];
  presences: PresencePointage[];
  bulletins: BulletinPaie[];
  documents: FichierDocument[];
  regles: AlerteRegle[];
  notifications: NotificationAlerte[];
  auditLogs: AuditLog[];
  systemSettings: SystemSettings;
  // --- FLEET & MAINTENANCE ---
  compteursUtilisation?: CompteurUtilisation[];
  utilisationsEquipement?: UtilisationEquipement[];
  plansMaintenance?: PlanDeMaintenance[];
  pannesEquipement?: PanneEquipement[];
  assurancesEquipement?: AssuranceEquipement[];
  // --- BI & REPORTING ---
  indicateursKPI?: IndicateurKPI[];
  tableauxDeBord?: TableauDeBord[];
  rapportsProgrammes?: RapportProgramme[];
  alertesBI?: AlerteBI[];
  requetesPerso?: RequetePersonnalisee[];
}

// GEOGRAPHIC RELATION TYPES (Un Pays a plusieurs villes, une ville appartient à un et un seul pays)
export interface Pays {
  id: string;
  nom: string;
  codeISO: string; // Ex: CMR, CIV, FRA
  indicatifTelephonique: string; // Ex: +237, +225, +33
}

export interface VilleAdmin {
  id: string;
  nom: string;
  paysId: string; // Appartient à un et un seul pays
  codeRegion?: string; // Ex: Littoral, Île-de-France
}

// UNIFIED STOCK SYSTEM (PRODUCTIONS VÉGÉTALE & ANIMALE)
export interface ProduitAgricole {
  id: string;
  nom: string;
  categorie: 'Végétal Brut' | 'Animal Continu' | 'Transformé';
  uniteReference: 'Kg' | 'Litres' | 'Tonnes' | 'Caisses' | 'Sacs' | 'Douzaines' | 'Unités';
  dureeConservationMax: number; // en jours
  prixReferenceMarche: number; // FCFA
}

export interface LieuDeStockage {
  id: string;
  nom: string;
  type: 'Silo' | 'Chambre Froide' | 'Tank à Lait' | 'Entrepôt' | 'Hangar';
  capaciteMax: number; // unité générique
  conditions: string; // Ex: Température contrôlée 4°C, Humidité ventilée
}

export interface LotDeStock {
  id: string;
  idProduit: string;
  idLieuStockage: string;
  dateEntree: string;
  quantiteInitiale: number;
  quantiteDisponible: number;
  origineType: 'Récolte' | 'ProductionContinue' | 'Achat';
  origineId?: string; // ID de la récolte (Recolte) ou production continue (ProductionElevage) ou null
  qualiteEntree: 'Premium' | 'Standard' | 'Rejet' | string;
  statut: 'Disponible' | 'Réservé' | 'Épuisé' | 'Périmé' | 'Bloqué';
  dateLimiteDegradation: string; // calculé : dateEntree + dureeConservationMax
  coutProductionUnitaire: number; // valeur à l'entrée par unité (coût de production réel)
}

export interface MouvementDeStockGen {
  id: string;
  idLotStock: string;
  date: string;
  typeMouvement: 'entrée' | 'sortie_vente' | 'sortie_perte' | 'transfert_lieu' | 'transformation' | 'ajustement_inventaire';
  quantite: number; // + pour entrée, - pour sortie
  quantiteApresMouvement: number;
  referenceLiee?: string; // Id de la Vente, de l'Aléa, de la Transformation, ou de l'Audit d'inventaire
  operateur: string;
}

export interface TransformationProduit {
  id: string;
  date: string;
  lotsConsommes: { idLotStock: string; quantiteConsommee: number }[];
  idLotProduitCree: string;
  coutTransformation: number;
  tauxRendement: number; // quantiteProduite / quantité_consommée_totale
  operateur: string;
}

export interface InventairePhysique {
  id: string;
  date: string;
  idLieuStockage: string;
  verifications: {
    idLotStock: string;
    quantiteTheorique: number;
    quantiteConstatee: number;
    ecart: number;
  }[];
  operateur: string;
}

export interface StockAleas {
  id: string;
  idLotStock: string;
  date: string;
  type: 'Péremption' | 'Dégradation' | 'Vol' | 'Nuisibles' | 'Froid Rompu' | 'Casse';
  quantitePerdue: number;
  valeurPerdue: number; // quantitePerdue * coutProductionUnitaire
  observation: string;
}

export interface StockVente {
  id: string;
  idLotStock: string;
  quantiteVendue: number;
  prixVenteUnitaire: number;
  montantTotal: number;
  canalVente: string;
  acheteur: string;
  date: string;
}

// ==========================================
// ADVANCED SUB-MODULE TYPES (ADMINISTRATION & SÉCURITÉ)
// ==========================================

// 1. HR & CONTRI-BASED PAYROLL ENGINE EXTENSIONS
export interface ContratEmploye {
  id: string;
  idEmploye: string;
  typeCONTRAT: 'CDI' | 'CDD' | 'Saisonnier' | 'Journalier';
  dateDebut: string;
  dateFin?: string;
  salaireBaseBrut: number;
  indemniteLogement: number;
  indemniteTransport: number;
  allocationsFamiliales: number;
  statut: 'Actif' | 'Terminé' | 'Suspendu';
  dateSignature: string;
}

export interface ElementVariablePaie {
  id: string;
  idEmploye: string;
  periode: string; // "MM-YYYY"
  heuresSup130: number; // heures sup majorées à 30% (ex: CEMAC Cameroon standard)
  heuresSup140: number; // heures sup majorées à 40% (ex: CEMAC Cameroon standard)
  primesRendement: number;
  indemniteDeplacements: number;
  avancesRemboursements: number;
  joursAbsenceNonJustifiee: number;
}

export interface ReglementPaie {
  id: string;
  idBulletin: string;
  dateReglement: string;
  modePaiement: 'Virement' | 'Chèque' | 'Espèces' | 'Mobile Money';
  referenceTransaction: string;
  montantNet: number;
  statutPaiement: 'En attente' | 'Payé';
}

// 2. GED POLYMORPHISM & SIGNATURES WORKFLOWS
export interface DocumentVersion {
  id: string;
  idDocument: string;
  version: number;
  dateCreation: string;
  nomFichier: string;
  tailleMo: number;
  urlFictive: string;
  auteur: string;
  commentaire: string;
}

export interface DocumentWorkflow {
  id: string;
  idDocument: string;
  etapeActuelle: 'Brouillon' | 'En attente de revue' | 'Approuvé' | 'Rejeté';
  dateSoumission?: string;
  approbateurCible: string; // Ex : "Directeur" ou "Directrice"
  dateValidation?: string;
  commentaireDecision?: string;
}

export interface DocumentSignature {
  id: string;
  idDocument: string;
  signataire: string;
  roleSignataire: string;
  dateHeure: string;
  statutSignature: 'Signé' | 'Refusé';
  empreinteNumerique: string; // SHA256 simulation
}

export interface DocumentLink {
  id: string;
  idDocument: string;
  typeEntite: 'Employe' | 'Parcelle' | 'Animal' | 'FactureClient' | 'LotDeStock' | 'CustomEntity' | string;
  idEntite: string;
  dateLiaison: string;
  note?: string;
}

// 3. SYSTEM DYNAMIC PARAMETER CUSTOM CHIPS
export interface CustomFieldDefinition {
  id: string;
  typeEntiteCible: 'Employe' | 'Parcelle' | 'Animal' | 'Article' | 'Fournisseur' | string;
  nomChamp: string;
  codeChamp: string; // Snake case, ex: "vitesse_croissance"
  typeDonnee: 'text' | 'number' | 'date' | 'boolean' | 'selection';
  optionsSelection?: string[]; // Si selection, liste des options
  requis: boolean;
  defaultValue?: string;
}

export interface CustomFieldValue {
  id: string;
  idDefinitionChamp: string;
  idEntiteInstance: string; // ID de l'instance d'employé, parcelle, etc.
  valeurTextuelle: string;
}

export interface CustomEntityDefinition {
  id: string;
  nomUnique: string; // Ex : "Rapport d'aleas meteo"
  codeDefinition: string; // "rapport_meteo_custom"
  iconeChevron?: string;
  description: string;
}

export interface CustomEntityAttribute {
  id: string;
  idDefinitionEntite: string;
  nomAttribut: string;
  codeAttribut: string;
  typeAttribut: 'text' | 'number' | 'date' | 'boolean';
  requis: boolean;
}

export interface CustomEntityInstance {
  id: string;
  idDefinitionEntite: string;
  datePlanification: string;
  valeursAttributes: { [codeAttribut: string]: string }; // Map attributCode -> value
  auteur: string;
}

// --- FLEET & MAINTENANCE COMPLEMENTARY MODULES ---
export interface CompteurUtilisation {
  id: string;
  idEquipement: string;
  date: string;
  typeCompteur: 'Heures moteur' | 'Kilométrage' | 'Hectares travaillés' | string;
  valeurRelevee: number;
  relevePar: string;
}

export interface UtilisationEquipement {
  id: string;
  idEquipement: string;
  dateDebut: string;
  dateFin: string;
  operateur: string; // operator name / ID
  interventionLiee?: string; // ID of Intervention
  compteurDebut: number;
  compteurFin: number;
  carburantConsommeLitres: number;
  carburantCoutFCFA: number;
}

export interface PlanDeMaintenance {
  id: string;
  idEquipement?: string;
  categorieEquipement?: string; // apply per category or per specific equipment
  typeOperation: string; // e.g. vidange, changement de filtre, graissage, contrôle technique
  declencheur: 'périodique' | 'calendaire' | 'mixte';
  seuilPeriodiqueHeures?: number;
  seuilCalendaireMois?: number;
  seuilAlerteAnticipeeHeures?: number;
}

export interface PieceUtilisee {
  referencePiece: string;
  quantite: number;
  coutUnitaire: number;
}

export interface OrdreDeMaintenance {
  id: string;
  idEquipement: string;
  type: 'Préventive' | 'Planifiée' | 'Curative' | 'Réglementaire';
  origine: string; // 'PlanDeMaintenance', 'manuel', 'contrôle réglementaire'
  dateSignalement: string;
  datePlanifiee: string;
  dateRealisee?: string;
  statut: 'Signalé' | 'Planifié' | 'En cours' | 'Terminé' | 'Annulé';
  description: string;
  piecesUtilisees: PieceUtilisee[];
  coutMainDeuvre: number;
  coutTotal: number;
  prestataireExterne?: string; // id associated with Fournisseur
  dureeImmobilisationHeures?: number;
}

export interface PanneEquipement {
  id: string;
  idEquipement: string;
  date: string;
  composantConcerne: string;
  gravite: 'Mineure' | 'Majeure' | 'Critique';
  causeIdentifiee?: string;
  idOrdreMaintenance?: string;
}

export interface AssuranceEquipement {
  id: string;
  idEquipement: string;
  policeId: string;
  dateDebut: string;
  dateFin: string;
  primeAnnuelleFCFA: number;
}

// --- BI & REPORTING REQUISITES ---
export interface IndicateurKPI {
  id: string;
  code: string;
  nom: string;
  moduleSource: string; // e.g. 'végétal', 'élevage', 'stock', 'finance', 'matériel', 'RH'
  formuleCalcul: string;
  unite: string;
  frequence: string;
  niveauAgreg: string;
}

export interface WidgetDashboard {
  id: string;
  idTableauDeBord: string;
  typeVisualisation: 'courbe' | 'barre' | 'carte' | 'table' | 'jauge' | 'kpi';
  idIndicateurKPI?: string;
  requetePersoId?: string;
  groupDims: string; // e.g. 'par parcelle', 'par de mois', 'par culture'
  position: { x: number; y: number; w: number; h: number };
}

export interface TableauDeBord {
  id: string;
  nom: string;
  proprietaire: string;
  widgets: WidgetDashboard[];
  sharedWith: string[]; // list of user role IDs or user emails
  filtersDef: { periode?: string; campagne?: string; parcelle?: string };
}

export interface RapportProgramme {
  id: string;
  nom: string;
  modele: string; // detail of which KPIs & layouts
  destinataires: string[];
  periodicite: 'Quotidien' | 'Hebdomadaire' | 'Mensuel' | 'Fin de Campagne';
  formatExport: 'PDF' | 'Excel' | 'CSV';
  derniereGen?: string;
  prochaineGen?: string;
}

export interface AlerteBI {
  id: string;
  idIndicateurKPI: string;
  condition: 'Supérieur' | 'Inférieur' | 'Variation Anormale';
  valeurSeuil: number;
  destinataires: string[];
  statutActuel: 'Normal' | 'En Alerte' | 'Acquittée';
  commentaireAcquitement?: string;
}

export interface RequetePersonnalisee {
  id: string;
  nom: string;
  createur: string;
  defModules: string[]; // e.g. ['végétal', 'finance']
  filtres: string;
  resultatCache?: any;
  dateCache?: string; // date computed
}




