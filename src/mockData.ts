/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  SaaSClient,
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
  Champ,
  Utilisateur,
  CompteurUtilisation,
  UtilisationEquipement,
  PlanDeMaintenance,
  PanneEquipement,
  AssuranceEquipement,
  IndicateurKPI,
  RapportProgramme,
  AlerteBI
} from './types';

// INITIAL SAAS CLIENTS PREFABRICATED
export const INITIAL_SAAS_CLIENTS: SaaSClient[] = [
  {
    id: 'client-1',
    idLicence: 'LIC-2026-MEFOUP-101X',
    raisonSociale: 'KISSINE AGRO-INDUSTRIES SARL',
    sigle: 'KA',
    numContribuable: 'M05181274534A',
    regCommerce: 'RC/YAD/2018/B/452',
    secteur: 'Multi-cultures & Élevage laitier',
    responsableNom: 'Tchanga',
    responsablePrenom: 'Michel',
    responsableEmail: 'm.tchanga@kissineagro.cm',
    responsableTel: '+237 677 82 91 02',
    pays: 'Cameroun',
    region: 'Centre',
    ville: 'Yaoundé',
    statut: 'Actif',
    plan: 'Professional',
    dateCreation: '2026-01-10',
    dateExpiration: '2027-01-10',
    surfaceExploitee: 450,
    maxUtilisateurs: 25,
    superAdminLogin: 'admin@kissineagro.cm',
    superAdminPassword: 'superadmin123'
  },
  {
    id: 'client-2',
    idLicence: 'LIC-2026-COOP-WEST42',
    raisonSociale: 'COOPÉRATIVE DES PRODUCTEURS DE CACAO DE L’OUEST',
    sigle: 'COOP-MEFOUP-WEST',
    numContribuable: 'M12211489240T',
    regCommerce: 'RC/BAF/2021/C/09',
    secteur: 'Cacaoculture & Transformation',
    responsableNom: 'Fokou',
    responsablePrenom: 'Bertrand',
    responsableEmail: 'b.fokou@coopwest.org',
    responsableTel: '+237 699 15 48 23',
    pays: 'Cameroun',
    region: 'Ouest',
    ville: 'Bafoussam',
    statut: 'Actif',
    plan: 'Cooperative',
    dateCreation: '2026-02-15',
    dateExpiration: '2027-02-15',
    surfaceExploitee: 1200,
    maxUtilisateurs: 100,
    superAdminLogin: 'admin@coopwest.org',
    superAdminPassword: 'superadmin456'
  },
  {
    id: 'client-3',
    idLicence: 'LIC-2026-TEST-FREE-987',
    raisonSociale: 'FERME AVICOLE DE MBALMAYO',
    sigle: 'FAM',
    numContribuable: 'M08253102485C',
    regCommerce: 'RC/MBL/2025/A/102',
    secteur: 'Aviculture (Poulets & Œufs)',
    responsableNom: 'Atangana',
    responsablePrenom: 'Marie-Louise',
    responsableEmail: 'ml.atangana@ferme-mbalmayo.cm',
    responsableTel: '+237 655 43 12 90',
    pays: 'Cameroun',
    region: 'Centre',
    ville: 'Mbalmayo',
    statut: 'Essai Gratuit',
    plan: 'Starter',
    dateCreation: '2026-06-01',
    dateExpiration: '2026-07-01',
    surfaceExploitee: 15,
    maxUtilisateurs: 5,
    superAdminLogin: 'admin@ferme-mbalmayo.cm',
    superAdminPassword: 'superadmin789'
  }
];

export const INITIAL_SAAS_LOGS: SaaSLog[] = [
  { id: 'l-1', date: '2026-06-18 08:30:12', utilisateur: 'SaaS Admin', ip: '192.168.1.50', action: 'Connexion réussie', module: 'Auth', statut: 'Succès' },
  { id: 'l-2', date: '2026-06-18 09:12:45', utilisateur: 'Tchanga Michel', ip: '41.202.219.12', action: 'Sauvegarde automatique déclenchée', module: 'Database', statut: 'Succès' },
  { id: 'l-3', date: '2026-06-18 10:05:00', utilisateur: 'b.fokou@coopwest.org', ip: '102.244.15.67', action: 'Importation des stocks fournisseurs', module: 'Stocks', statut: 'Succès' },
  { id: 'l-4', date: '2026-06-18 11:22:18', utilisateur: 'System Worker', ip: 'localhost', action: 'Calcul récurrent des amortissements', module: 'Comptabilité', statut: 'Succès' }
];

// INITIAL CLIENT EXPLOITATIONS
export const INITIAL_EXPLOITATIONS: Exploitation[] = [
  {
    id: 'exp-1',
    code: 'KA-CENTRE',
    nom: 'Kissine Agro Site Central',
    description: 'Exploitation agro-pastorale de premier plan avec maraîchage bio et élevage bovin laitier.',
    typeExploitation: 'Mixte',
    responsable: 'Michel Tchanga',
    pays: 'Cameroun',
    region: 'Centre',
    ville: 'Obala',
    latitude: 4.1667,
    longitude: 11.5333,
    surfaceTotale: 450,
    surfaceCultivable: 380,
    dateCreation: '2019-03-12',
    statut: 'Actif'
  },
  {
    id: 'exp-2',
    code: 'KA-WEST-CACAO',
    nom: 'Ferme Cacaoyère Mbouda',
    description: 'Ferme maraîchère élargie et plantation de cacao d’ombrage premium à haut rendement.',
    typeExploitation: 'Végétale',
    responsable: 'Thérèse Bella',
    pays: 'Cameroun',
    region: 'Ouest',
    ville: 'Mbouda',
    latitude: 5.6275,
    longitude: 10.2512,
    surfaceTotale: 320,
    surfaceCultivable: 300,
    dateCreation: '2021-05-18',
    statut: 'Actif'
  },
  {
    id: 'exp-3',
    code: 'KA-SOUTH-AVIC',
    nom: 'Complexe Avicole & Piscicole Mbalmayo',
    description: 'Ferme moderne à haute densité pour poulets de chair, pondeuses et bassins de tilapia.',
    typeExploitation: 'Élevage',
    responsable: 'Dr. Amadou Diallo',
    pays: 'Cameroun',
    region: 'Centre',
    ville: 'Mbalmayo',
    latitude: 3.5188,
    longitude: 11.5025,
    surfaceTotale: 85,
    surfaceCultivable: 10,
    dateCreation: '2025-06-01',
    statut: 'Actif'
  }
];

export const INITIAL_SITES_AGRICOLES: SiteAgricole[] = [
  { id: 'site-1', idExploitation: 'exp-1', nom: 'Secteur Nord Maraîchage', responsable: 'Jean-Pierre Ondoa', ville: 'Obala' },
  { id: 'site-2', idExploitation: 'exp-1', nom: 'Section Est Bananeraie', responsable: 'Therese Bella', ville: 'Obala' },
  { id: 'site-3', idExploitation: 'exp-2', nom: 'Plantation Cacao Mbouda', responsable: 'Fokou Bertrand', ville: 'Mbouda' }
];

export const INITIAL_CHAMPS: Champ[] = [
  { id: 'champ-1', code: 'REF-CMP-001', nom: 'Champ Nord Obala', ville: 'Obala', localite: 'Secteur Maraîcher Nord', coordonneesGps: '4.1680, 11.5340' },
  { id: 'champ-2', code: 'REF-CMP-002', nom: 'Champ Est Obala', ville: 'Obala', localite: 'Bananeraie Centrale', coordonneesGps: '4.1650, 11.5300' },
  { id: 'champ-3', code: 'REF-CMP-003', nom: 'Champ Cacaoyère Ouest', ville: 'Mbouda', localite: 'Mbouda Ouest', coordonneesGps: '5.6291, 10.2530' }
];

export const INITIAL_UTILISATEURS: Utilisateur[] = [
  { id: 'usr-1', nom: 'Michel Tchanga', email: 'admin@mefoup.com', password: 'mefoup2026', roleId: 'role-superadmin', statut: 'Actif' },
  { id: 'usr-2', nom: 'Dr. Amadou Diallo', email: 'veto@mefoup.com', password: 'mefoup2026', roleId: 'role-veto', statut: 'Actif' },
  { id: 'usr-3', nom: 'Bertrand Fokou', email: 'comptable@mefoup.com', password: 'mefoup2026', roleId: 'role-comptable', statut: 'Actif' },
  { id: 'usr-4', nom: 'Jean-Pierre Ondoa', email: 'ouvrier@mefoup.com', password: 'mefoup2026', roleId: 'role-ouvrier', statut: 'Actif' }
];

export const INITIAL_PARCELLES: Parcelle[] = [
  { id: 'par-1', idSite: 'site-1', idChamp: 'champ-1', code: 'REF-PRC-001', nom: 'Parcelle Nord-01 - Argileuse', surface: 12.5, latitude: 4.1680, longitude: 11.5340, typeSol: 'Sablo-argileux ferrallitique', ph: 6.2, sourceEau: 'Forage motopompe', expertValide: true, expertDescription: 'Sol bien drainé, excellent pour le maraîchage après fertilisation azotée de fond.' },
  { id: 'par-2', idSite: 'site-1', idChamp: 'champ-1', code: 'REF-PRC-002', nom: 'Parcelle Nord-02 - Tomates', surface: 8.0, latitude: 4.1695, longitude: 11.5355, typeSol: 'Argilo-humifère', ph: 5.8, sourceEau: 'Rivière Sanaga dérivation', expertValide: true, expertDescription: 'Légère carence en potassium, apport d\'amendement potassique recommandé avant repiquage.' },
  { id: 'par-3', idSite: 'site-2', idChamp: 'champ-2', code: 'REF-PRC-003', nom: 'Plantation Banane Est', surface: 35.0, latitude: 4.1650, longitude: 11.5300, typeSol: 'Volcanique humifère', ph: 6.5, sourceEau: 'Retenue eau colline', expertValide: true, expertDescription: 'Sol volcanique très riche, fort potentiel de rendement.' },
  { id: 'par-4', idSite: 'site-3', idChamp: 'champ-3', code: 'REF-PRC-004', nom: 'Cacaoyère d’Ombrage Ouest', surface: 48.0, latitude: 5.6291, longitude: 10.2530, typeSol: 'Latéritique argilo-sableux', ph: 5.5, sourceEau: 'Précipitations naturelles', expertValide: false, expertDescription: 'Diagnostics en cours pour carences de fer et acidité.' }
];

export const INITIAL_CAMPAGNES: Campagne[] = [
  { id: 'camp-1', code: 'CAMP-2026-A', nom: 'Grande Saison de Pluies 2026', annee: '2026', dateDebut: '2026-03-01', dateFin: '2026-08-31', statut: 'En cours' },
  { id: 'camp-2', code: 'CAMP-2025-B', nom: 'Petite Saison Sèche 2025', annee: '2025', dateDebut: '2025-09-01', dateFin: '2026-02-28', statut: 'Terminée' }
];

export const INITIAL_CULTURES: Culture[] = [
  { id: 'cult-1', idCampagne: 'camp-1', idParcelle: 'par-1', responsable: 'Jean-Pierre Ondoa', nom: 'Maïs Grain', variete: 'Pioneer 30G19 Hybride', surfaceCultivee: 12.5, dateSemis: '2026-03-15', dateRecoltePrevue: '2026-07-25', rendementCible: 4500, statut: 'Active' },
  { id: 'cult-2', idCampagne: 'camp-1', idParcelle: 'par-2', responsable: 'Thérèse Bella', nom: 'Tomate de Table', variete: 'Rio Grande résistante flétrissement', surfaceCultivee: 8.0, dateSemis: '2026-04-02', dateRecoltePrevue: '2026-07-10', rendementCible: 12000, statut: 'Active' },
  { id: 'cult-3', idCampagne: 'camp-2', idParcelle: 'par-3', responsable: 'Thérèse Bella', nom: 'Banane Plantain', variete: 'Essong Faux-Tronc rouge', surfaceCultivee: 35.0, dateSemis: '2025-09-05', dateRecoltePrevue: '2026-02-20', rendementCible: 8500, statut: 'Récoltée' }
];

export const INITIAL_INTERVENTIONS: Intervention[] = [
  { id: 'int-1', idParcelle: 'par-1', idCulture: 'cult-1', date: '2026-03-12', type: 'Labour', mainDOeuvreCoût: 120000, responsable: 'Jean-Pierre Ondoa', machinesUtilisees: 'Tracteur Foton-904', statut: 'Validée' },
  { id: 'int-2', idParcelle: 'par-1', idCulture: 'cult-1', date: '2026-03-15', type: 'Semis', substanceIntrant: 'Semences Maïs Pioneer', quantiteIntrant: 300, uniteIntrant: 'Kg', mainDOeuvreCoût: 50000, responsable: 'Jean-Pierre Ondoa', statut: 'Validée' },
  { id: 'int-3', idParcelle: 'par-1', idCulture: 'cult-1', date: '2026-04-20', type: 'Fertilisation', substanceIntrant: 'N-P-K 20-10-10', quantiteIntrant: 1500, uniteIntrant: 'Kg', mainDOeuvreCoût: 65000, responsable: 'Jean-Pierre Ondoa', statut: 'Validée' },
  { id: 'int-4', idParcelle: 'par-2', idCulture: 'cult-2', date: '2026-05-10', type: 'Traitement phytosanitaire', substanceIntrant: 'Fongicide Manèbe 80', quantiteIntrant: 16, uniteIntrant: 'Kg', mainDOeuvreCoût: 40000, responsable: 'Thérèse Bella', statut: 'Validée' },
  { id: 'int-5', idParcelle: 'par-2', idCulture: 'cult-2', date: '2026-06-18', type: 'Irrigation', mainDOeuvreCoût: 8000, responsable: 'Jean-Pierre Ondoa', machinesUtilisees: 'Motopompe Honda 3"', statut: 'En cours' }
];

export const INITIAL_RECOLTES: Recolte[] = [
  { id: 'rec-1', idCulture: 'cult-3', date: '2026-02-18', quantite: 295000, qualite: 'Premium', unite: 'Kg', prixVenteUnitairePoids: 350 } // 295,000 kg sold at 350 FCFA/kg = 103,250,000 FCFA
];

export const INITIAL_INCIDENTS_AGRICOLES: IncidentAgricole[] = [
  { id: 'inc-agi-1', idParcelle: 'par-2', date: '2026-05-24', type: 'Ravageurs', description: 'Attaque modérée d’Altises et mouches des fruits sur le secteur Ouest des tomates.', perteEstimeeFCFA: 350000 }
];

// INITIAL LIVE STOCK / BREEDING DATA
export const INITIAL_SITES_ELEVAGE: SiteElevage[] = [
  { id: 'site-ev-1', idExploitation: 'exp-1', nom: 'Complexe Pastoral Obala', code: 'KA-OB-PAST', responsable: 'Dr. Amadou Diallo (Vétérinaire)', coordonnesGPS: '4.1670 N, 11.5320 E' },
  { id: 'site-ev-2', idExploitation: 'exp-3', nom: 'Hangar Avicole & Bassins Mbalmayo', code: 'KA-MB-AVIC', responsable: 'Mama Florence', coordonnesGPS: '3.5188 N, 11.5025 E' }
];

export const INITIAL_BATIMENTS: Batiment[] = [
  { id: 'bat-1', idSiteElevage: 'site-ev-1', nom: 'Étable Laitière Premium', type: 'Étable', capaciteMax: 80, surface: 600 },
  { id: 'bat-2', idSiteElevage: 'site-ev-2', nom: 'Poulailler Chauffé A', type: 'Poulailler', capaciteMax: 5000, surface: 400 },
  { id: 'bat-3', idSiteElevage: 'site-ev-2', nom: 'Bassin Tilapia Principal', type: 'Bassin piscicole', capaciteMax: 8000, surface: 250 }
];

export const INITIAL_TROUPEAUX: Troupeau[] = [
  { id: 'troup-1', idBatiment: 'bat-1', nom: 'Bovins Laitiers - Montbéliardes/Goudali', espece: 'Bovin', race: 'Goudali croisé Montbéliard', responsable: 'Alhadji Ousmanou' },
  { id: 'troup-2', idBatiment: 'bat-2', nom: 'Poulets de Chair Cobb500', espece: 'Volaille', race: 'Cobb 500', responsable: 'Mama Florence' },
  { id: 'troup-3', idBatiment: 'bat-3', nom: 'Tilapias Niloticus Lot-26A', espece: 'Pisciculture', race: 'Tilapia du Nil', responsable: 'Dieudonné Bella' }
];

export const INITIAL_ANIMAUX: Animal[] = [
  { id: 'ani-1', idTroupeau: 'troup-1', idBatiment: 'bat-1', codeUnique: 'COW-00921', nom: 'Belle d’Obala', sexe: 'Femelle', dateNaissance: '2022-04-10', statut: 'Actif', poidsActuel: 520 },
  { id: 'ani-2', idTroupeau: 'troup-1', idBatiment: 'bat-1', codeUnique: 'COW-00934', nom: 'Samba Goudali', sexe: 'Femelle', dateNaissance: '2021-11-23', statut: 'Actif', poidsActuel: 480 },
  { id: 'ani-3', idTroupeau: 'troup-1', idBatiment: 'bat-1', codeUnique: 'BULL-0021', nom: 'Lion du Ndé', sexe: 'Mâle', dateNaissance: '2020-01-15', statut: 'Actif', poidsActuel: 780 }
];

export const INITIAL_REPRO_GESTATIONS: ReproductionGestation[] = [
  { id: 'rep-1', idAnimalFemelle: 'ani-1', idAnimalMale: 'ani-3', dateFecondation: '2025-08-10', datePrevueMiseBas: '2026-05-15', statut: 'Mise bas réussie', dateMiseBas: '2026-05-14', nombrePetits: 1, survivants: 1 }
];

export const INITIAL_CARNETS_SANITAIRES: CarnetSanitaire[] = [
  { id: 'san-1', idAnimal: 'ani-1', date: '2026-05-20', type: 'Consultation', diagnostic: 'Léger gonflement de la mamelle gauche (Mastite)', produitSelectionne: 'Antibiotique Intra-mammaire Mamylène', veterinaire: 'Dr. Amadou Diallo', coûtVeto: 18000 },
  { id: 'san-2', idTroupeau: 'troup-2', date: '2026-03-08', type: 'Vaccination', diagnostic: 'Vaccination collective Jour 8 contre le virus Gumboro', produitSelectionne: 'Gumboral Lyophilisat', veterinaire: 'Dr. Amadou Diallo', coûtVeto: 35000 }
];

export const INITIAL_FEED_LOGS: FeedLog[] = [
  { id: 'feed-1', idTroupeau: 'troup-1', date: '2026-06-15', aliment: 'Drèches de Brasserie + Concentré Laitier SPC', quantiteKg: 240, coûtFCFA: 65000 },
  { id: 'feed-2', idTroupeau: 'troup-2', date: '2026-06-17', aliment: 'Aliment Démarrage Volailles (Provende Belco)', quantiteKg: 500, coûtFCFA: 145000 }
];

export const INITIAL_PROD_ELEVAGES: ProductionElevage[] = [
  { id: 'pe-1', idAnimal: 'ani-1', date: '2026-06-18', type: 'Lait', quantite: 22, unite: 'Litres' },
  { id: 'pe-2', idAnimal: 'ani-2', date: '2026-06-18', type: 'Lait', quantite: 18, unite: 'Litres' },
  { id: 'pe-3', idTroupeau: 'troup-2', date: '2026-06-18', type: 'Viande', quantite: 1450, unite: 'Kg' }
];

// STOCKS & EXPLOITATION EQUIPMENT
export const INITIAL_MAGASINS: Magasin[] = [
  { id: 'mag-1', code: 'MAG-OB-CENTRAL', nom: 'Magasin Central d’Intrants Obala', responsable: 'Paul Atangana', site: 'Obala', type: 'Intrants' },
  { id: 'mag-2', code: 'MAG-OB-BIOVET', nom: 'Armoire Médicaux & Véto Obala', responsable: 'Dr. Amadou Diallo', site: 'Obala', type: 'Produits Vétérinaires' },
  { id: 'mag-3', code: 'DEP-OB-CARBU', nom: 'Citernes & Carburant Obala', responsable: 'Paul Atangana', site: 'Obala', type: 'Carburants' }
];

export const INITIAL_ARTICLES: Article[] = [
  { id: 'art-1', code: 'INT-NPK20', designation: 'Engrais NPK 20-10-10 SAC 50KG', categorie: 'Engrais', uniteMesure: 'Sac', stockMinimum: 50, prixFournisseurMoyen: 18500 },
  { id: 'art-2', code: 'INT-MAISPW', designation: 'Semence Maïs Hybride Pioneer G19', categorie: 'Semences', uniteMesure: 'Sac 10Kg', stockMinimum: 10, prixFournisseurMoyen: 25000 },
  { id: 'art-3', code: 'VET-MAMY', designation: 'Traitement Intra-mammaire Mamylène Gel', categorie: 'Produits Vétérinaires', uniteMesure: 'Applicateur', stockMinimum: 5, prixFournisseurMoyen: 4500 },
  { id: 'art-4', code: 'CARB-GO', designation: 'Gasoil Total Excellium', categorie: 'Carburants', uniteMesure: 'Litre', stockMinimum: 500, prixFournisseurMoyen: 840 },
  { id: 'art-5', code: 'RECOLT-MAIS', designation: 'Maïs Sec Égrappé Qualité Standard', categorie: 'Produits Récoltés', uniteMesure: 'Sac 100Kg', stockMinimum: 0, prixFournisseurMoyen: 15000 }
];

export const INITIAL_MOUVEMENTS_STOCK: MouvementStock[] = [
  { id: 'mvt-1', idMagasin: 'mag-1', idArticle: 'art-1', date: '2026-03-05', type: 'Entrée', quantite: 100, motif: 'Achat', coutUnitaire: 18500, responsable: 'Paul Atangana' },
  { id: 'mvt-2', idMagasin: 'mag-1', idArticle: 'art-1', date: '2026-04-20', type: 'Sortie', quantite: 30, motif: 'Consommation Agricole', coutUnitaire: 18500, responsable: 'Jean-Pierre Ondoa' },
  { id: 'mvt-3', idMagasin: 'mag-3', idArticle: 'art-4', date: '2026-06-10', type: 'Entrée', quantite: 3000, motif: 'Achat', coutUnitaire: 840, responsable: 'Paul Atangana' }
];

export const INITIAL_EQUIPEMENTS: Equipement[] = [
  { id: 'eq-1', code: 'EQ-TRAC-01', designation: 'Tracteur Foton Arbos 904', type: 'Tracteur', marque: 'FOTON', modele: 'Arbos 90ch 4RM', immatriculation: 'LT-109-AG', dateAchat: '2022-05-18', valeurAcquisition: 16500000, dureeDeVieMois: 120, etat: 'En service', heuresMoteurOrKm: 1420 },
  { id: 'eq-2', code: 'EQ-MOTO-01', designation: 'Motopompe Diesel Honda 3 Pouces', type: 'Pompe', marque: 'HONDA', modele: 'WT30X', dateAchat: '2023-01-20', valeurAcquisition: 850000, dureeDeVieMois: 60, etat: 'En service', heuresMoteurOrKm: 410 },
  { id: 'eq-3', code: 'EQ-VEH-PROD', designation: 'Pick-up Toyota Hilux Simple Cabine', type: 'Véhicule', marque: 'TOYOTA', modele: 'Hilux 2.5 D4D', immatriculation: 'CE-992-LS', dateAchat: '2020-09-12', valeurAcquisition: 22000000, dureeDeVieMois: 96, etat: 'En service', heuresMoteurOrKm: 135400 }
];

export const INITIAL_MAINTENANCES: MaintenanceOrder[] = [
  { id: 'maint-1', idEquipement: 'eq-1', type: 'Préventive', technicien: 'Atangana Charles (Mécano Pro)', datePlanifiee: '2026-06-19', description: 'Vidange huile moteur, remplacement filtres gazole et air, régulation pressions flexibles.', statut: 'En attente', coûtFCFA: 125000 }
];

export const INITIAL_FUEL_LOGS: FuelLog[] = [
  { id: 'fuel-1', idEquipement: 'eq-1', date: '2026-06-12', quantiteLitre: 80, coûtFCFA: 67200, chauffeur: 'Sébastien Etoa' },
  { id: 'fuel-2', idEquipement: 'eq-3', date: '2026-06-17', quantiteLitre: 65, coûtFCFA: 54600, chauffeur: 'Alhadji Ousmanou' }
];

// COMMERCIAL & PURCHASES
export const INITIAL_FOURNISSEURS: Fournisseur[] = [
  { id: 'fourn-1', code: 'F-SOPROICAM', raisonSociale: 'SOPROICAM (Société de Production d’Intrants)', categorie: 'Intrants agricoles', tel: '+237 333 42 18 10', email: 'sales@soproicam.com', adresse: 'Zone Industrielle Bassa, Douala', numContribuable: 'M08020001048P', conditionsReglement: 'Acompte 50%, solde par chèque à 30 jours' },
  { id: 'fourn-2', code: 'F-SPC-VETO', raisonSociale: 'SOCAPHARMA CAMEROUN (Produits vétérinaires)', categorie: 'Produits vétérinaires', tel: '+237 222 23 15 89', email: 'contact@socapharma.cm', adresse: 'Avenue de Gaulle, Yaoundé', numContribuable: 'M01010000540G', conditionsReglement: 'Chèque à réception' }
];

export const INITIAL_DEMANDES_ACHAT: DemandeAchat[] = [
  { id: 'da-1', code: 'DA-2026-054', date: '2026-06-10', demandeur: 'Jean-Pierre Ondoa', priorite: 'Haute', designationArticle: 'Herbiside Glycol 480', quantite: 200, unite: 'Litre', justification: 'Désherbage nécessaire de la parcelle Nord-02 pour préparer les haricots de contre-saison.', statut: 'Validée' }
];

export const INITIAL_BONS_COMMANDE: BonDeCommande[] = [
  { id: 'bc-1', idFournisseur: 'fourn-1', code: 'BC-2026-009', date: '2026-06-12', designationArticle: 'Engrais NPK 20-10-10', quantite: 150, coutUnitaire: 18500, total: 2775000, statut: 'Validé' }
];

export const INITIAL_CLIENTS_ACHETEURS: ClientAcheteur[] = [
  { id: 'cli-1', code: 'C-MOKOLO-G', raisonSociale: 'ENTREPRISE ALHADJI NOUHOU (Grossiste Marché Mokolo)', categorie: 'Grossiste', tel: '+237 675 11 22 33', email: 'nouhou.grossiste@yahoo.com', adresse: 'Marché Mokolo, Yaoundé', plafondCredit: 5000000, soldeCreditActuel: 1450000 },
  { id: 'cli-2', code: 'C-SOCIAGRI', raisonSociale: 'SOCIAGRI CAMEROUN (Transformation agro)', categorie: 'Industriel', tel: '+237 242 80 91 12', email: 'contact@sociagri.cm', adresse: 'Z-I Magzi, Douala', plafondCredit: 15000000, soldeCreditActuel: 0 }
];

export const INITIAL_DEVIS: DevisClient[] = [
  { id: 'dev-1', idClient: 'cli-2', code: 'DEV-2026-015', date: '2026-06-14', dateValidite: '2026-06-28', produit: 'Grains de Maïs sec en gros', quantite: 200, prixUnitaire: 15000, total: 3000000, statut: 'Accepté' }
];

export const INITIAL_COMMANDES_CLIENTS: CommandeClient[] = [
  { id: 'cc-1', idClient: 'cli-2', code: 'CMD-2026-042', date: '2026-06-15', produit: 'Grains de Maïs sec en gros', quantite: 200, prixUnitaire: 15000, total: 3000000, statut: 'En préparation', commercialId: 'emp-5' }
];

export const INITIAL_FACTURES_CLIENTS: FactureClient[] = [
  { id: 'fac-1', idClient: 'cli-1', type: 'Standard', code: 'FAC-2026-092', date: '2026-05-18', dateEcheance: '2026-06-18', produit: 'Bananes Plantains d’Obala Premium', quantite: 4140, total: 1450000, statut: 'Non payée' }
];

export const INITIAL_ENCAISSEMENTS: EncaissementClient[] = [
  { id: 'enc-1', idFacture: 'fac-1', date: '2026-06-18', montant: 500000, modePaiement: 'Mobile Money', reference: 'TX-MTN-882910aA' }
];

// FINANCIALS & SYSCOHADA ACCOUNTS
export const INITIAL_PIECES_COMPTABLES: PieceComptable[] = [
  { id: 'pc-1', date: '2026-05-18', codeJournal: 'VEN', refePiece: 'FAC-2026-092', libelle: 'Vente de Bananes Plantains à Grossiste', debitCompte: '4111 (Clients nationaux)', creditCompte: '7011 (Vente de Produits Agricoles)', montant: 1450000, valide: true, centreCoutAnalytique: 'Plantation Banane Est (par-3)' },
  { id: 'pc-2', date: '2026-06-12', codeJournal: 'ACH', refePiece: 'BC-2026-009', libelle: 'Aquisition engrais SOPROICAM', debitCompte: '6011 (Achats de Matières Premières & Intrants)', creditCompte: '4011 (Fournisseurs d’Exploitation)', montant: 2775000, valide: true, centreCoutAnalytique: 'Général Obala' },
  { id: 'pc-3', date: '2026-06-18', codeJournal: 'BQ', refePiece: 'ENC-2026-03', libelle: 'Partiel encaissement Alhadji MTN MoMo', debitCompte: '5211 (Banques Locales)', creditCompte: '4111 (Clients nationaux)', montant: 500000, valide: true, centreCoutAnalytique: 'Trésorerie Obala' },
  { id: 'pc-4', date: '2026-06-15', codeJournal: 'CAI', refePiece: 'EVT-042', libelle: 'Encaissement Vente Buffet Buffet de la Réception Obala', debitCompte: '5711 (Caisse Centrale)', creditCompte: '7031 (Vente Buffet & Restauration)', montant: 650000, valide: true, centreCoutAnalytique: 'Événementiel' },
  { id: 'pc-5', date: '2026-06-16', codeJournal: 'BQ', refePiece: 'EVT-043', libelle: 'Facturation Services Traiteurs Événementiel Cacao-Fest', debitCompte: '5211 (Banques Locales)', creditCompte: '7032 (Services Traiteurs d’Événements)', montant: 1350000, valide: true, centreCoutAnalytique: 'Événementiel' },
  { id: 'pc-6', date: '2026-06-17', codeJournal: 'CAI', refePiece: 'DEP-908', libelle: 'Dépense Directe : Achat carburant motopompes Obala', debitCompte: '6017 (Dépenses Directes d’Exploitation)', creditCompte: '5711 (Caisse Centrale)', montant: 220000, valide: true, centreCoutAnalytique: 'Général Obala' },
  { id: 'pc-7', date: '2026-06-18', codeJournal: 'CAI', refePiece: 'DEP-909', libelle: 'Dépense Directe : Achat outillage maraîcher Obala', debitCompte: '6017 (Dépenses Directes d’Exploitation)', creditCompte: '5711 (Caisse Centrale)', montant: 130000, valide: true, centreCoutAnalytique: 'Maraîchage' }
];

export const INITIAL_BUDGETS: Budget[] = [
  { id: 'bud-1', departement: 'Agriculture', annee: '2026', montantInitial: 15000000, montantEngage: 4500000 },
  { id: 'bud-2', departement: 'Élevage', annee: '2026', montantInitial: 8000000, montantEngage: 2800000 },
  { id: 'bud-3', departement: 'Maintenance', annee: '2026', montantInitial: 2500000, montantEngage: 820000 }
];

// HUMAN RESOURCES & PAYROLL
export const INITIAL_EMPLOYES: Employe[] = [
  { id: 'emp-1', matricule: 'KA-2023-01', nom: 'Diallo', prenom: 'Amadou', sexe: 'Mâle', dateNaissance: '1984-07-20', tel: '+237 677 22 33 44', email: 'a.diallo@kissineagro.cm', poste: 'Vétérinaire Senior', department: 'Élevage', contratType: 'CDI', dateEmbauche: '2023-01-15', salaireBase: 450000, statut: 'Actif' },
  { id: 'emp-2', matricule: 'KA-2020-14', nom: 'Ondoa', prenom: 'Jean-Pierre', sexe: 'Mâle', dateNaissance: '1989-11-04', tel: '+237 699 44 55 66', email: 'jp.ondoa@kissineagro.cm', poste: 'Chef de Champ & Production Végétale', department: 'Agriculture', contratType: 'CDI', dateEmbauche: '2020-04-01', salaireBase: 250000, statut: 'Actif' },
  { id: 'emp-3', matricule: 'KA-2021-09', nom: 'Florence', prenom: 'Mama', sexe: 'Femelle', dateNaissance: '1992-02-14', tel: '+237 655 12 34 56', email: 'f.mama@kissineagro.cm', poste: 'Responsable Technique Aviculture', department: 'Élevage', contratType: 'CDI', dateEmbauche: '2021-08-10', salaireBase: 180000, statut: 'Actif' },
  { id: 'emp-4', matricule: 'KA-2025-08', nom: 'Etoa', prenom: 'Sébastien', sexe: 'Mâle', dateNaissance: '1995-12-29', tel: '+237 660 77 88 99', email: 's.etoa@gmail.com', poste: 'Conducteur de Tracteur & Engins', department: 'Technique', contratType: 'CDD', dateEmbauche: '2025-03-01', salaireBase: 120000, statut: 'Actif' },
  { id: 'emp-5', matricule: 'KA-2024-03', nom: 'Ngo Nlen', prenom: 'Clarisse', sexe: 'Femelle', dateNaissance: '1991-05-18', tel: '+237 671 22 91 03', email: 'c.ngonlen@kissineagro.cm', poste: 'Commerciale Terrains', department: 'Commercial', contratType: 'CDI', dateEmbauche: '2024-02-15', salaireBase: 200000, statut: 'Actif' }
];

export const INITIAL_PRESENCES: PresencePointage[] = [
  { id: 'p-1', idEmploye: 'emp-1', date: '2026-06-18', heureEntree: '07:45', heureSortie: '16:30', dureeHeures: 8.75, statut: 'Présent' },
  { id: 'p-2', idEmploye: 'emp-2', date: '2026-06-18', heureEntree: '06:50', heureSortie: '17:00', dureeHeures: 10.16, statut: 'Présent' },
  { id: 'p-3', idEmploye: 'emp-3', date: '2026-06-18', heureEntree: '07:15', heureSortie: '16:00', dureeHeures: 8.75, statut: 'Présent' },
  { id: 'p-4', idEmploye: 'emp-4', date: '2026-06-18', heureEntree: '07:00', heureSortie: '16:05', dureeHeures: 9.08, statut: 'Présent' }
];

export const INITIAL_BULLETINS: BulletinPaie[] = [
  { id: 'bp-1', idEmploye: 'emp-1', periode: '05-2026', salaireBase: 450000, heuresSupMontant: 45000, primes: 25000, avancesRetenues: 0, cotisationCNPS: 18900, impotIGR: 35000, netAPayer: 466100, statut: 'Payé' },
  { id: 'bp-2', idEmploye: 'emp-2', periode: '05-2026', salaireBase: 250000, heuresSupMontant: 18000, primes: 10000, avancesRetenues: 0, cotisationCNPS: 10500, impotIGR: 15400, netAPayer: 252100, statut: 'Payé' },
  { id: 'bp-3', idEmploye: 'emp-3', periode: '05-2026', salaireBase: 180000, heuresSupMontant: 8000, primes: 10000, avancesRetenues: 20000, cotisationCNPS: 7560, impotIGR: 8200, netAPayer: 162240, statut: 'Payé' }
];

// GED (DOCUMENT MANAGEMENT FILES)
export const INITIAL_DOCUMENTS: FichierDocument[] = [
  { id: 'doc-1', nom: 'Autorisation_Exploitation_Obala_Prefet.pdf', categorie: 'Administratif', tailleMo: 2.4, dateImport: '2019-04-15', indexationTags: ['Foncier', 'Obala', 'Arrêté'], urlFictive: '#', auteur: 'M. Tchanga', arborescence: 'Entreprise/Administration' },
  { id: 'doc-2', nom: 'Analyse_PhysicoChimique_Sol_Parcelle_N1.pdf', categorie: 'Agricole', tailleMo: 4.1, dateImport: '2026-03-05', indexationTags: ['Sols', 'PH', 'N-P-K', 'Parcelle-1'], urlFictive: '#', auteur: 'Ondoa Jean-Pierre', arborescence: 'Entreprise/Agriculture/Parcelles' },
  { id: 'doc-3', nom: 'Contrat_CDI_Dr_Amadou_Diallo.pdf', categorie: 'RH', tailleMo: 1.8, dateImport: '2023-01-15', indexationTags: ['Contrat', 'CDI', 'Diallo', 'Veterinaire'], urlFictive: '#', auteur: 'SaaS Admin', arborescence: 'Entreprise/RH/Contrats' },
  { id: 'doc-4', nom: 'Certificat_Vaccination_Bovin_Ministere.pdf', categorie: 'Élevage', tailleMo: 0.9, dateImport: '2026-05-18', indexationTags: ['FievreAphteuse', 'Minsante', 'Bovins'], urlFictive: '#', auteur: 'Dr. Amadou Diallo', arborescence: 'Entreprise/Élevage/Bovins' }
];

// NOTIFICATIONS & RULES
export const INITIAL_ALERTE_REGLES: AlerteRegle[] = [
  { id: 'r-1', nom: 'Alerte Rupture Intrants', condition: 'Stock Thétorique <= Stock Minimum', canal: 'System', priorite: 'Élevée', active: true },
  { id: 'r-2', nom: 'Expiration Pesticides/Vaccins', condition: 'Date de péremption imminente (< 30 jours)', canal: 'Email', priorite: 'Critique', active: true },
  { id: 'r-3', nom: 'Crédit Risque Client', condition: 'Dépassement du plafond de crédit accordé', canal: 'SMS', priorite: 'Élevée', active: true },
  { id: 'r-4', nom: 'Retard de Maintenance Véhicule/Tracteur', condition: 'Date de révision système dépassée', canal: 'System', priorite: 'Normale', active: true }
];

export const INITIAL_NOTIFICATIONS: NotificationAlerte[] = [
  { id: 'not-1', titre: 'Alerte Stock critique N-P-K', description: 'Le stock théorique de l’Engrais NPK 20-10-10 (4 Sacs restants) est inférieur au stock minimum configuré de 50 sacs.', priorite: 'Élevée', canalSource: 'System', date: '2026-06-18 05:00', statut: 'Non lue' },
  { id: 'not-2', titre: 'Mastite détectée - Bovin COW-00921', description: 'Dr. Diallo Amadou a diagnostiqué un Mastite de la mamelle gauche sur l’animal Belle d’Obala. Intervention requise.', priorite: 'Élevée', canalSource: 'System', date: '2026-06-18 09:30', statut: 'Non lue' },
  { id: 'not-3', titre: 'Facture en retard de paiement FAC-2026-092', description: 'La facture client FAC-2026-092 d’un montant restant de 950 000 FCFA pour Alhadji Nouhou a expiré à date du 18 juin 2026.', priorite: 'Critique', canalSource: 'SMS', date: '2026-06-18 08:00', statut: 'Non lue' }
];

export const INITIAL_COMPTEURS_UTILISATION: CompteurUtilisation[] = [
  { id: 'cnt-1', idEquipement: 'eq-1', date: '2026-06-12', typeCompteur: 'Heures moteur', valeurRelevee: 1420, relevePar: 'Sébastien Etoa' },
  { id: 'cnt-2', idEquipement: 'eq-2', date: '2026-06-15', typeCompteur: 'Heures moteur', valeurRelevee: 410, relevePar: 'Jean-Pierre Ondoa' }
];

export const INITIAL_UTILISATIONS_EQUIPEMENT: UtilisationEquipement[] = [
  { id: 'ut-1', idEquipement: 'eq-1', dateDebut: '2026-06-10', dateFin: '2026-06-10', operateur: 'Sébastien Etoa', interventionLiee: 'int-1', compteurDebut: 1412, compteurFin: 1420, carburantConsommeLitres: 45, carburantCoutFCFA: 37800 }
];

export const INITIAL_PLANS_MAINTENANCE: PlanDeMaintenance[] = [
  { id: 'plm-1', idEquipement: 'eq-1', typeOperation: 'Vidange huile moteur & Filtres', declencheur: 'mixte', seuilPeriodiqueHeures: 250, seuilCalendaireMois: 6, seuilAlerteAnticipeeHeures: 20 }
];

export const INITIAL_PANNES_EQUIPEMENT: PanneEquipement[] = [
  { id: 'pan-1', idEquipement: 'eq-1', date: '2026-04-18', composantConcerne: 'Joint de Culasse', gravite: 'Critique', causeIdentifiee: 'Surchauffe moteur suite à obstruction radiateur', idOrdreMaintenance: 'maint-1' }
];

export const INITIAL_ASSURANCES_EQUIPEMENT: AssuranceEquipement[] = [
  { id: 'ass-1', idEquipement: 'eq-1', policeId: 'POL-AGRI-FOTON-904', dateDebut: '2026-01-01', dateFin: '2026-12-31', primeAnnuelleFCFA: 350000 }
];

export const INITIAL_INDICATEURS_KPI: IndicateurKPI[] = [
  { id: 'kpi-1', code: 'KPI_REVENUE', nom: 'Chiffre d’Affaires Export Consolidé', moduleSource: 'Comptabilité & Finance', formuleCalcul: 'Somme des pièces de classe 7 (Crédit)', unite: 'FCFA', frequence: 'Quotidienne', niveauAgreg: 'Global Tenant' },
  { id: 'kpi-2', code: 'KPI_TREASURY', nom: 'Trésorerie Disponible Instantanée', moduleSource: 'Comptabilité & Finance', formuleCalcul: 'Somme comptes banque (52) & caisse (57)', unite: 'FCFA', frequence: 'Temps Réel', niveauAgreg: 'Global Tenant' },
  { id: 'kpi-3', code: 'KPI_HECTARES', nom: 'Hectares Actifs en Culture', moduleSource: 'Cultures & Végétal', formuleCalcul: 'Somme surface de toutes les parcelles actives', unite: 'Hectares', frequence: 'Quotidienne', niveauAgreg: 'Global Tenant' },
  { id: 'kpi-4', code: 'KPI_YIELD', nom: 'Rendement Moyen par Hectare', moduleSource: 'Cultures & Végétal', formuleCalcul: 'Poids récoltes divisé par surface cumulée', unite: 'kg/HA', frequence: 'Campagne', niveauAgreg: 'Par culture' },
  { id: 'kpi-5', code: 'KPI_MORTALITY', nom: 'Taux de Mortalité Troupeau', moduleSource: 'Santé Élevage', formuleCalcul: '(Bêtes décédées / Tête de troupeau) * 100', unite: '%', frequence: 'Mensuelle', niveauAgreg: 'Global Troupeau' },
  { id: 'kpi-6', code: 'KPI_AVAIL_MAT', nom: 'Taux de Disponibilité Opérationnelle', moduleSource: 'GMAO & Maintenance', formuleCalcul: '((Heures de potentiel - Heures d’immobilisation) / Heures de potentiel) * 100', unite: '%', frequence: 'Hebdomadaire', niveauAgreg: 'Global Parc' },
  { id: 'kpi-7', code: 'KPI_STOCK_VAL', nom: 'Valorisation Évaluée du Stock', moduleSource: 'Stocks & Entrepôts', formuleCalcul: 'Somme (Stock physique * Coût d’achat unitaire pondéré)', unite: 'FCFA', frequence: 'Temps Réel', niveauAgreg: 'Global Magasin' }
];

export const INITIAL_RAPPORTS_PROGRAMMES: RapportProgramme[] = [
  { id: 'rep-1', nom: 'Rapport Trimestriel de Rendements et Marge Brute', modele: 'Suivi des cultures & Rendements', destinataires: ['dir.exploitations@kissineagro.cm', 'communique.obala@gmail.com'], periodicite: 'Mensuel', formatExport: 'PDF', derniereGen: '2026-05-31 18:00 (Succès)', prochaineGen: '2026-06-30' },
  { id: 'rep-2', nom: 'Fiche Synthétique GMAO de Disponibilité Engins', modele: 'GMAO & Disponibilité Parc', destinataires: ['tech.ateliers@kissineagro.cm'], periodicite: 'Hebdomadaire', formatExport: 'Excel', derniereGen: '2026-06-15 07:00 (Succès)', prochaineGen: '2026-06-22' }
];

export const INITIAL_ALERTES_BI: AlerteBI[] = [
  { id: 'al-1', idIndicateurKPI: 'kpi-5', condition: 'Supérieur', valeurSeuil: 2.5, destinataires: ['coord.elevage@kissineagro.cm'], statutActuel: 'En Alerte' },
  { id: 'al-2', idIndicateurKPI: 'kpi-2', condition: 'Inférieur', valeurSeuil: 2000000, destinataires: ['comptable@kissineagro.cm'], statutActuel: 'Normal' }
];

