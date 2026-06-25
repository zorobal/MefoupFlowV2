-- ============================================================================
-- ERP MEFOUP-FLOW - SCHÉMA DE BASE DE DONNÉES POSTGRESQL COMPLET (SUPABASE)
-- ============================================================================
-- Ce script génère l'ensemble des tables, des clés primaires, des clés étrangères
-- et des politiques de sécurité (RLS) pour supporter l'intégralité des modules
-- de l'ERP : SaaS Admin, Agriculture, Élevage, Stocks, Commercial, SYSCOHADA,
-- Ressources Humaines, GED, Équipements et Paramètres Personnalisés.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- NETTOYAGE PRÉALABLE (OPTIONNEL - À n'exécuter que pour réinitialiser la base)
-- ----------------------------------------------------------------------------
-- DROP TABLE IF EXISTS custom_field_values CASCADE;
-- DROP TABLE IF EXISTS custom_field_definitions CASCADE;
-- DROP TABLE IF EXISTS custom_entities CASCADE;
-- DROP TABLE IF EXISTS consommations_carburant CASCADE;
-- DROP TABLE IF EXISTS ordres_travail CASCADE;
-- DROP TABLE IF EXISTS plans_maintenance CASCADE;
-- DROP TABLE IF EXISTS equipements CASCADE;
-- DROP TABLE IF EXISTS signatures_numeriques CASCADE;
-- DROP TABLE IF EXISTS document_workflows CASCADE;
-- DROP TABLE IF EXISTS document_versions CASCADE;
-- DROP TABLE IF EXISTS documents_ged CASCADE;
-- DROP TABLE IF EXISTS fiches_paie CASCADE;
-- DROP TABLE IF EXISTS contrats_travail CASCADE;
-- DROP TABLE IF EXISTS employes CASCADE;
-- DROP TABLE IF EXISTS utilisateurs CASCADE;
-- DROP TABLE IF EXISTS lignes_ecriture CASCADE;
-- DROP TABLE IF EXISTS ecritures_comptables CASCADE;
-- DROP TABLE IF EXISTS journaux_comptables CASCADE;
-- DROP TABLE IF EXISTS exercices_fiscaux CASCADE;
-- DROP TABLE IF EXISTS plan_comptable_syscohada CASCADE;
-- DROP TABLE IF EXISTS reglements CASCADE;
-- DROP TABLE IF EXISTS commandes_ventes CASCADE;
-- DROP TABLE IF EXISTS commandes_achats CASCADE;
-- DROP TABLE IF EXISTS clients_erp CASCADE;
-- DROP TABLE IF EXISTS fournisseurs CASCADE;
-- DROP TABLE IF EXISTS pertes_stock CASCADE;
-- DROP TABLE IF EXISTS transformations CASCADE;
-- DROP TABLE IF EXISTS stock_mouvements CASCADE;
-- DROP TABLE IF EXISTS stock_lots CASCADE;
-- DROP TABLE IF EXISTS produits_intrants CASCADE;
-- DROP TABLE IF EXISTS entrepots CASCADE;
-- DROP TABLE IF EXISTS productions_elevage CASCADE;
-- DROP TABLE IF EXISTS pesees_elevage CASCADE;
-- DROP TABLE IF EXISTS vaccinations_elevage CASCADE;
-- DROP TABLE IF EXISTS aliments_elevage CASCADE;
-- DROP TABLE IF EXISTS traitements_elevage CASCADE;
-- DROP TABLE IF EXISTS cycles_production_elevage CASCADE;
-- DROP TABLE IF EXISTS troupeaux CASCADE;
-- DROP TABLE IF EXISTS batiments CASCADE;
-- DROP TABLE IF EXISTS sites_elevage CASCADE;
-- DROP TABLE IF EXISTS incidents_agricoles CASCADE;
-- DROP TABLE IF EXISTS recoltes CASCADE;
-- DROP TABLE IF EXISTS interventions CASCADE;
-- DROP TABLE IF EXISTS cultures CASCADE;
-- DROP TABLE IF EXISTS campagnes CASCADE;
-- DROP TABLE IF EXISTS parcelles CASCADE;
-- DROP TABLE IF EXISTS champs CASCADE;
-- DROP TABLE IF EXISTS sites_agricoles CASCADE;
-- DROP TABLE IF EXISTS exploitations CASCADE;
-- DROP TABLE IF EXISTS villes CASCADE;
-- DROP TABLE IF EXISTS pays CASCADE;
-- DROP TABLE IF EXISTS saas_invoices CASCADE;
-- DROP TABLE IF EXISTS saas_tickets CASCADE;
-- DROP TABLE IF EXISTS saas_audit_logs CASCADE;
-- DROP TABLE IF EXISTS saas_tenants CASCADE;

-- ============================================================================
-- SECTION 1 : ADMINISTRATION SAAS & MULTI-TENANCY
-- ============================================================================

-- 1.1 Tenants (Clients SaaS)
CREATE TABLE saas_tenants (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    subdomain TEXT UNIQUE,
    plan_id TEXT DEFAULT 'Starter', -- 'Starter', 'Professional', 'Enterprise', 'Cooperative'
    status TEXT DEFAULT 'Démonstration', -- 'Démonstration', 'Essai Gratuit', 'Actif', 'Suspendu', 'Résilié'
    expires_at TEXT,
    logo_url TEXT,
    primary_color TEXT DEFAULT '#4f46e5',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.2 Logs d'Audit Généraux du SaaS
CREATE TABLE saas_audit_logs (
    id SERIAL PRIMARY KEY,
    tenant_id TEXT REFERENCES saas_tenants(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    details TEXT,
    ip_address TEXT,
    user_email TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.3 Tickets de Support Technique
CREATE TABLE saas_tickets (
    id TEXT PRIMARY KEY,
    client_id TEXT REFERENCES saas_tenants(id) ON DELETE CASCADE,
    client_name TEXT NOT NULL,
    category TEXT, -- 'Technique', 'Facturation', 'Bug', 'Amélioration'
    title TEXT NOT NULL,
    description TEXT,
    priority TEXT DEFAULT 'Moyenne', -- 'Basse', 'Moyenne', 'Haute', 'Critique'
    status TEXT DEFAULT 'Nouveau', -- 'Nouveau', 'En cours', 'Résolu', 'Fermé'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.4 Factures d'Abonnement SaaS
CREATE TABLE saas_invoices (
    id TEXT PRIMARY KEY,
    client_id TEXT REFERENCES saas_tenants(id) ON DELETE SET NULL,
    client_name TEXT NOT NULL,
    plan TEXT NOT NULL,
    amount NUMERIC(15, 2) NOT NULL,
    payment_method TEXT,
    status TEXT DEFAULT 'Payée', -- 'Payée', 'En attente', 'Annulée'
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================================
-- SECTION 2 : STRUCTURE GÉOGRAPHIQUE & ARCHITECTURE AGRO-PASTORALE
-- ============================================================================

-- 2.1 Table des Pays
CREATE TABLE pays (
    id TEXT PRIMARY KEY, -- Ex: 'CMR', 'CIV', 'SEN'
    nom TEXT NOT NULL,
    code_iso TEXT UNIQUE,
    indicatif_telephonique TEXT
);

-- 2.2 Table des Villes
CREATE TABLE villes (
    id TEXT PRIMARY KEY,
    pays_id TEXT REFERENCES pays(id) ON DELETE CASCADE,
    nom TEXT NOT NULL,
    code_region TEXT
);

-- 2.3 Exploitations Agricoles
CREATE TABLE exploitations (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL REFERENCES saas_tenants(id) ON DELETE CASCADE,
    code TEXT UNIQUE NOT NULL,
    nom TEXT NOT NULL,
    description TEXT,
    type_exploitation TEXT DEFAULT 'Mixte', -- 'Végétale', 'Élevage', 'Mixte'
    responsable TEXT,
    pays_id TEXT REFERENCES pays(id),
    ville_id TEXT REFERENCES villes(id),
    latitude NUMERIC(10, 8),
    longitude NUMERIC(11, 8),
    surface_totale NUMERIC(10, 2), -- en Hectares
    surface_cultivable NUMERIC(10, 2),
    statut TEXT DEFAULT 'Actif',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.4 Sites Agricoles (Rattachés à une Exploitation)
CREATE TABLE sites_agricoles (
    id TEXT PRIMARY KEY,
    exploitation_id TEXT REFERENCES exploitations(id) ON DELETE CASCADE,
    nom TEXT NOT NULL,
    responsable TEXT,
    ville_id TEXT REFERENCES villes(id)
);

-- 2.5 Champs (Regroupements agronomiques)
CREATE TABLE champs (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    nom TEXT NOT NULL,
    ville_id TEXT REFERENCES villes(id),
    localite TEXT,
    coordonnees_gps TEXT
);

-- 2.6 Parcelles Agricoles (Champs subdivisés de production)
CREATE TABLE parcelles (
    id TEXT PRIMARY KEY,
    site_id TEXT REFERENCES sites_agricoles(id) ON DELETE SET NULL,
    champ_id TEXT REFERENCES champs(id) ON DELETE SET NULL,
    code TEXT UNIQUE NOT NULL,
    nom TEXT NOT NULL,
    surface NUMERIC(10, 2) NOT NULL, -- en Hectares
    latitude NUMERIC(10, 8),
    longitude NUMERIC(11, 8),
    type_sol TEXT,
    ph NUMERIC(3, 1),
    source_eau TEXT,
    location_status TEXT DEFAULT 'Propriété', -- 'Propriété', 'Location'
    periode_location TEXT,
    bornage_status TEXT DEFAULT 'Borné',
    cout_acquisition NUMERIC(15, 2),
    cout_bornage NUMERIC(15, 2),
    cout_analyse_sol NUMERIC(15, 2),
    topographie TEXT,
    drainage TEXT,
    expert_valide BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================================
-- SECTION 3 : PRODUCTION VÉGÉTALE (AGRICULTURE CULTURALE)
-- ============================================================================

-- 3.1 Campagnes Agricoles
CREATE TABLE campagnes (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL REFERENCES saas_tenants(id) ON DELETE CASCADE,
    code TEXT UNIQUE NOT NULL,
    nom TEXT NOT NULL,
    annee TEXT NOT NULL,
    date_debut TEXT,
    date_fin TEXT,
    statut TEXT DEFAULT 'En cours' -- 'Planifiée', 'En cours', 'Terminée'
);

-- 3.2 Cultures (Cycles de culture par parcelle et campagne)
CREATE TABLE cultures (
    id TEXT PRIMARY KEY,
    campagne_id TEXT REFERENCES campagnes(id) ON DELETE CASCADE,
    parcelle_id TEXT REFERENCES parcelles(id) ON DELETE CASCADE,
    nom TEXT NOT NULL, -- Ex: 'Cacao', 'Maïs', 'Tomate'
    variete TEXT,
    surface_cultivee NUMERIC(10, 2) NOT NULL,
    date_semis TEXT,
    date_recolte_prevue TEXT,
    rendement_cible NUMERIC(10, 2), -- en kg/ha
    statut TEXT DEFAULT 'Active', -- 'Planifiée', 'Active', 'Récoltée', 'Clôturée'
    budget_previsionnel NUMERIC(15, 2),
    prix_vente_previsionnel NUMERIC(15, 2),
    responsable TEXT
);

-- 3.3 Interventions (Travaux de champ)
CREATE TABLE interventions (
    id TEXT PRIMARY KEY,
    parcelle_id TEXT REFERENCES parcelles(id) ON DELETE CASCADE,
    culture_id TEXT REFERENCES cultures(id) ON DELETE CASCADE,
    date TEXT NOT NULL,
    type_intervention TEXT NOT NULL, -- 'Labour', 'Semis', 'Fertilisation', 'Irrigation', 'Traitement phytosanitaire', 'Récolte'
    substance_intrant TEXT, -- Nom de l'intrant ou engrais appliqué
    quantite_intrant NUMERIC(10, 2),
    unite_intrant TEXT,
    cout_main_doeuvre NUMERIC(15, 2) DEFAULT 0,
    responsable TEXT,
    machines_utilisees TEXT,
    statut TEXT DEFAULT 'Validée' -- 'Planifiée', 'En cours', 'Validée'
);

-- 3.4 Récoltes (Production végétale)
CREATE TABLE recoltes (
    id TEXT PRIMARY KEY,
    culture_id TEXT REFERENCES cultures(id) ON DELETE CASCADE,
    date TEXT NOT NULL,
    quantite NUMERIC(12, 2) NOT NULL,
    unite TEXT DEFAULT 'Kg', -- 'Kg', 'Tonnes', 'Sacs', 'Caisses'
    qualite TEXT DEFAULT 'Standard', -- 'Premium', 'Standard', 'Rejet'
    prix_vente_unitaire_poids NUMERIC(15, 2), -- Prix de vente estimé par Kg
    statut_sanitaire TEXT DEFAULT 'Conforme',
    note_sanitaire TEXT
);

-- 3.5 Incidents Agricoles (Aléas météo, ravageurs, maladies)
CREATE TABLE incidents_agricoles (
    id TEXT PRIMARY KEY,
    parcelle_id TEXT REFERENCES parcelles(id) ON DELETE CASCADE,
    culture_id TEXT REFERENCES cultures(id) ON DELETE CASCADE,
    date TEXT NOT NULL,
    type_incident TEXT NOT NULL, -- 'Sécheresse', 'Inondation', 'Vol', 'Maladies', 'Ravageurs'
    description TEXT,
    perte_estimee_fcfa NUMERIC(15, 2) DEFAULT 0,
    surface_impactee NUMERIC(10, 2)
);


-- ============================================================================
-- SECTION 4 : PRODUCTION ANIMALE (ÉLEVAGE)
-- ============================================================================

-- 4.1 Sites d'Élevage
CREATE TABLE sites_elevage (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL REFERENCES saas_tenants(id) ON DELETE CASCADE,
    nom TEXT NOT NULL,
    localisation TEXT,
    responsable TEXT
);

-- 4.2 Bâtiments ou Étangs (Infrastructures d'élevage)
CREATE TABLE batiments (
    id TEXT PRIMARY KEY,
    site_elevage_id TEXT REFERENCES sites_elevage(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    nom TEXT NOT NULL,
    type_batiment TEXT, -- 'Poulailler', 'Porcherie', 'Étable', 'Bassin Piscicole'
    capacite_animaux INTEGER,
    surface_m2 NUMERIC(10, 2)
);

-- 4.3 Troupeaux, Bandes ou Lots d'Animaux
CREATE TABLE troupeaux (
    id TEXT PRIMARY KEY,
    batiment_id TEXT REFERENCES batiments(id) ON DELETE SET NULL,
    code TEXT UNIQUE NOT NULL,
    espece TEXT NOT NULL, -- 'Volailles', 'Porcs', 'Poissons', 'Bovins'
    race TEXT,
    quantite_initiale INTEGER NOT NULL,
    quantite_actuelle INTEGER NOT NULL,
    date_entree TEXT NOT NULL,
    statut TEXT DEFAULT 'Actif', -- 'Actif', 'Vendu', 'Archivé'
    poids_moyen_initial NUMERIC(10, 3) -- en kg
);

-- 4.4 Cycles de Production Élevage
CREATE TABLE cycles_production_elevage (
    id TEXT PRIMARY KEY,
    troupeau_id TEXT REFERENCES troupeaux(id) ON DELETE CASCADE,
    nom_cycle TEXT NOT NULL,
    date_debut TEXT NOT NULL,
    date_fin_prevue TEXT,
    statut TEXT DEFAULT 'En cours'
);

-- 4.5 Traitements Vétérinaires & Diagnostics
CREATE TABLE traitements_elevage (
    id TEXT PRIMARY KEY,
    troupeau_id TEXT REFERENCES troupeaux(id) ON DELETE CASCADE,
    date TEXT NOT NULL,
    diagnostic TEXT NOT NULL,
    traitement_applique TEXT NOT NULL, -- Médicament ou action
    cout_traitement NUMERIC(15, 2) DEFAULT 0,
    veterinaire TEXT
);

-- 4.6 Consommation d'Aliments & Nutrition
CREATE TABLE aliments_elevage (
    id TEXT PRIMARY KEY,
    troupeau_id TEXT REFERENCES troupeaux(id) ON DELETE CASCADE,
    date TEXT NOT NULL,
    type_aliment TEXT NOT NULL, -- Ex: 'Aliment Croissance', 'Démarrage'
    quantite_consommee NUMERIC(10, 2) NOT NULL, -- en kg
    unite TEXT DEFAULT 'Kg',
    cout_aliment NUMERIC(15, 2) DEFAULT 0
);

-- 4.7 Suivi des Vaccinations
CREATE TABLE vaccinations_elevage (
    id TEXT PRIMARY KEY,
    troupeau_id TEXT REFERENCES troupeaux(id) ON DELETE CASCADE,
    date_vaccin TEXT NOT NULL,
    maladie_cible TEXT NOT NULL,
    nom_vaccin TEXT NOT NULL,
    cout_vaccin NUMERIC(15, 2) DEFAULT 0,
    prochaine_echeance TEXT
);

-- 4.8 Suivi de la Croissance (Pesées périodiques)
CREATE TABLE pesees_elevage (
    id TEXT PRIMARY KEY,
    troupeau_id TEXT REFERENCES troupeaux(id) ON DELETE CASCADE,
    date_pesee TEXT NOT NULL,
    poids_moyen NUMERIC(10, 3) NOT NULL, -- en kg
    effectif_pese INTEGER
);

-- 4.9 Productions d'Élevage (Œufs, Lait, Poissons pêchés, Viande)
CREATE TABLE productions_elevage (
    id TEXT PRIMARY KEY,
    troupeau_id TEXT REFERENCES troupeaux(id) ON DELETE CASCADE,
    date TEXT NOT NULL,
    type_produit TEXT NOT NULL, -- 'Œufs', 'Lait', 'Poissons', 'Viande'
    quantite NUMERIC(10, 2) NOT NULL,
    unite TEXT NOT NULL, -- 'Unités', 'Litres', 'Kg'
    qualite TEXT DEFAULT 'Standard'
);


-- ============================================================================
-- SECTION 5 : SYSTÈME DE STOCKS & INVENTAIRE UNIQUE
-- ============================================================================

-- 5.1 Entrepôts, Silos & Chambres Froides
CREATE TABLE entrepots (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL REFERENCES saas_tenants(id) ON DELETE CASCADE,
    nom TEXT NOT NULL,
    localisation TEXT,
    capacite_max_unite NUMERIC(12, 2),
    conditions_stockage TEXT DEFAULT 'Standard' -- 'Standard', 'Surgelé', 'Humidité ventilée'
);

-- 5.2 Catalogue des Produits, Intrants & Semences
CREATE TABLE produits_intrants (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL REFERENCES saas_tenants(id) ON DELETE CASCADE,
    code TEXT UNIQUE NOT NULL,
    designation TEXT NOT NULL,
    categorie TEXT NOT NULL, -- 'Intrant', 'Engrais', 'Semence', 'Aliment Élevage', 'Produit Récolté', 'Produit Élevage'
    unite_mesure TEXT NOT NULL, -- 'Kg', 'Litre', 'Unité', 'Sac'
    seuil_alerte_minimum NUMERIC(10, 2) DEFAULT 10,
    duree_conservation_max INTEGER, -- en jours
    prix_reference_marche NUMERIC(15, 2)
);

-- 5.3 Lots de Production en Stock (Traçabilité agroalimentaire)
CREATE TABLE stock_lots (
    id TEXT PRIMARY KEY,
    produit_id TEXT REFERENCES produits_intrants(id) ON DELETE CASCADE,
    code_lot TEXT UNIQUE NOT NULL,
    quantite_initiale NUMERIC(12, 2) NOT NULL,
    quantite_actuelle NUMERIC(12, 2) NOT NULL,
    date_entree TEXT NOT NULL,
    date_peremption TEXT,
    cout_unitaire_production NUMERIC(15, 2) NOT NULL,
    origine_reference TEXT -- ID de la récolte ou production animale associée
);

-- 5.4 Mouvements de Stock (Flux physiques)
CREATE TABLE stock_mouvements (
    id TEXT PRIMARY KEY,
    entrepot_id TEXT REFERENCES entrepots(id) ON DELETE CASCADE,
    lot_id TEXT REFERENCES stock_lots(id) ON DELETE CASCADE,
    date TEXT NOT NULL,
    quantite NUMERIC(12, 2) NOT NULL, -- + pour entrée, - pour sortie
    type_mouvement TEXT NOT NULL, -- 'Entrée Récolte', 'Achat Intrant', 'Consommation', 'Vente', 'Perte', 'Ajustement Inventaire'
    reference_liee TEXT, -- Id de la vente, de l'achat ou de l'intervention de destination
    operateur TEXT
);

-- 5.5 Transformations de Produits
CREATE TABLE transformations (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL REFERENCES saas_tenants(id) ON DELETE CASCADE,
    date TEXT NOT NULL,
    produit_entrant_id TEXT REFERENCES produits_intrants(id),
    qty_entrant NUMERIC(10, 2) NOT NULL,
    produit_sortant_id TEXT REFERENCES produits_intrants(id),
    qty_sortant NUMERIC(10, 2) NOT NULL,
    taux_rendement NUMERIC(5, 2), -- en %
    cout_transformation NUMERIC(15, 2) DEFAULT 0
);

-- 5.6 Déclarations de Pertes & Gâchis de Stock
CREATE TABLE pertes_stock (
    id TEXT PRIMARY KEY,
    lot_id TEXT REFERENCES stock_lots(id) ON DELETE CASCADE,
    date TEXT NOT NULL,
    quantite_perdue NUMERIC(10, 2) NOT NULL,
    motif_perte TEXT NOT NULL, -- 'Péremption', 'Rongeurs', 'Inondation', 'Vol'
    valeur_perdue NUMERIC(15, 2) NOT NULL,
    responsable TEXT
);


-- ============================================================================
-- SECTION 6 : MODULE COMMERCIAL (ACHATS, VENTES & CLIENTS ERP)
-- ============================================================================

-- 6.1 Clients de l'ERP (Acheteurs de récolte, distributeurs)
CREATE TABLE clients_erp (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL REFERENCES saas_tenants(id) ON DELETE CASCADE,
    raison_sociale TEXT NOT NULL,
    contact_nom TEXT,
    email TEXT,
    telephone TEXT,
    adresse TEXT,
    solde_compte NUMERIC(15, 2) DEFAULT 0
);

-- 6.2 Fournisseurs (Engrais, intrants, services vétérinaires)
CREATE TABLE fournisseurs (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL REFERENCES saas_tenants(id) ON DELETE CASCADE,
    nom_fournisseur TEXT NOT NULL,
    contact_nom TEXT,
    email TEXT,
    telephone TEXT,
    adresse TEXT,
    solde_compte NUMERIC(15, 2) DEFAULT 0
);

-- 6.3 Commandes d'Achats (Dépenses d'intrants/matériels)
CREATE TABLE commandes_achats (
    id TEXT PRIMARY KEY,
    fournisseur_id TEXT REFERENCES fournisseurs(id) ON DELETE SET NULL,
    date_commande TEXT NOT NULL,
    statut TEXT DEFAULT 'Livré', -- 'En attente', 'Livré', 'Annulé'
    montant_total NUMERIC(15, 2) NOT NULL,
    modalite_paiement TEXT
);

-- 6.4 Factures & Commandes de Ventes (Recettes agroalimentaires)
CREATE TABLE commandes_ventes (
    id TEXT PRIMARY KEY,
    client_erp_id TEXT REFERENCES clients_erp(id) ON DELETE SET NULL,
    date_vente TEXT NOT NULL,
    statut TEXT DEFAULT 'Payé', -- 'Payé', 'Crédit', 'Annulé'
    montant_total NUMERIC(15, 2) NOT NULL,
    canal_distribution TEXT -- 'Grossiste', 'Direct', 'Supermarché'
);

-- 6.5 Règlements (Flux financiers liés aux factures)
CREATE TABLE reglements (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL REFERENCES saas_tenants(id) ON DELETE CASCADE,
    facture_type TEXT NOT NULL, -- 'Achat', 'Vente'
    facture_id TEXT NOT NULL, -- ID de commande achat ou vente
    date TEXT NOT NULL,
    montant NUMERIC(15, 2) NOT NULL,
    mode_reglement TEXT NOT NULL -- 'Espèces', 'Mobile Money', 'Virement', 'Chèque'
);


-- ============================================================================
-- SECTION 7 : COMPTABILITÉ SYSCOHADA (FINANCE)
-- ============================================================================

-- 7.1 Plan Comptable SYSCOHADA (Norme de la zone OHADA)
CREATE TABLE plan_comptable_syscohada (
    compte TEXT PRIMARY KEY, -- Ex: '1011', '4011', '6011', '7011'
    intitule TEXT NOT NULL,
    classe INTEGER NOT NULL -- De 1 à 9
);

-- 7.2 Exercices Fiscaux
CREATE TABLE exercices_fiscaux (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL REFERENCES saas_tenants(id) ON DELETE CASCADE,
    annee INTEGER UNIQUE NOT NULL,
    date_ouverture TEXT NOT NULL,
    date_cloture TEXT NOT NULL,
    statut TEXT DEFAULT 'Ouvert' -- 'Ouvert', 'Clôturé'
);

-- 7.3 Journaux Comptables
CREATE TABLE journaux_comptables (
    code TEXT PRIMARY KEY, -- Ex: 'ACH', 'VT', 'BQ', 'CAI', 'OD'
    nom TEXT NOT NULL,
    type_journal TEXT NOT NULL
);

-- 7.4 Écritures Comptables
CREATE TABLE ecritures_comptables (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL REFERENCES saas_tenants(id) ON DELETE CASCADE,
    exercice_id TEXT REFERENCES exercices_fiscaux(id),
    journal_code TEXT REFERENCES journaux_comptables(code),
    date_ecriture TEXT NOT NULL,
    reference_piece TEXT NOT NULL, -- N° de Facture ou reçu
    libelle TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7.5 Lignes d'Écritures (Double entrée obligatoire)
CREATE TABLE lignes_ecriture (
    id SERIAL PRIMARY KEY,
    ecriture_id TEXT REFERENCES ecritures_comptables(id) ON DELETE CASCADE,
    compte TEXT REFERENCES plan_comptable_syscohada(compte),
    debit NUMERIC(15, 2) DEFAULT 0,
    credit NUMERIC(15, 2) DEFAULT 0,
    libelle_ligne TEXT,
    centre_cout_analytique TEXT -- Affectation analytique (Ex: 'Parcelle B01', 'Poulailler A')
);


-- ============================================================================
-- SECTION 8 : RESSOURCES HUMAINES & PAIE
-- ============================================================================

-- 8.1 Comptes d'Utilisateurs de l'ERP
CREATE TABLE utilisateurs (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL REFERENCES saas_tenants(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    nom TEXT NOT NULL,
    prenom TEXT,
    role_id TEXT NOT NULL, -- 'role-superadmin', 'role-veto', 'role-comptable', 'role-ouvrier'
    statut TEXT DEFAULT 'Actif'
);

-- 8.2 Employés (Fiches du personnel)
CREATE TABLE employes (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL REFERENCES saas_tenants(id) ON DELETE CASCADE,
    matricule TEXT UNIQUE NOT NULL,
    nom TEXT NOT NULL,
    prenom TEXT,
    email TEXT,
    telephone TEXT,
    date_embauche TEXT NOT NULL,
    service TEXT, -- 'Administration', 'Production Végétale', 'Production Animale', 'Stocks'
    num_cnps TEXT, -- Numéro de Sécurité Sociale
    statut TEXT DEFAULT 'Actif'
);

-- 8.3 Contrats de Travail
CREATE TABLE contrats_travail (
    id TEXT PRIMARY KEY,
    employe_id TEXT REFERENCES employes(id) ON DELETE CASCADE,
    type_contrat TEXT NOT NULL, -- 'CDI', 'CDD', 'Saisonnier', 'Journalier'
    salaire_base NUMERIC(15, 2) NOT NULL, -- en FCFA
    date_debut TEXT NOT NULL,
    date_fin TEXT,
    indemnites_transport NUMERIC(15, 2) DEFAULT 0,
    indemnites_logement NUMERIC(15, 2) DEFAULT 0,
    cotisable_cnps BOOLEAN DEFAULT TRUE
);

-- 8.4 Fiches de Paie Mensuelles (Calculatrices CEMAC/UEMOA)
CREATE TABLE fiches_paie (
    id TEXT PRIMARY KEY,
    employe_id TEXT REFERENCES employes(id) ON DELETE CASCADE,
    periode TEXT NOT NULL, -- format 'MM-YYYY'
    salaire_base_reel NUMERIC(15, 2) NOT NULL,
    primes NUMERIC(15, 2) DEFAULT 0,
    heures_supplementaires NUMERIC(15, 2) DEFAULT 0,
    retenue_cnps_salarial NUMERIC(15, 2) DEFAULT 0, -- Cotisation employée
    retenue_irpp NUMERIC(15, 2) DEFAULT 0, -- Impôt sur le revenu
    salaire_net_a_payer NUMERIC(15, 2) NOT NULL,
    date_paiement TEXT,
    statut_paiement TEXT DEFAULT 'Payé' -- 'Payé', 'Brouillon', 'Virement validé'
);


-- ============================================================================
-- SECTION 9 : GESTION ÉLECTRONIQUE DES DOCUMENTS (GED)
-- ============================================================================

-- 9.1 Documents de la GED
CREATE TABLE documents_ged (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL REFERENCES saas_tenants(id) ON DELETE CASCADE,
    nom_fichier TEXT NOT NULL,
    chemin_arborescence TEXT NOT NULL, -- 'Entreprise/Comptabilité', etc.
    type_mime TEXT,
    taille_octets INTEGER,
    auteur TEXT,
    date_creation TEXT NOT NULL,
    statut_approbation TEXT DEFAULT 'Approuvé' -- 'Brouillon', 'En attente', 'Approuvé'
);

-- 9.2 Versions de Documents
CREATE TABLE document_versions (
    id TEXT PRIMARY KEY,
    document_id TEXT REFERENCES documents_ged(id) ON DELETE CASCADE,
    version_numero INTEGER NOT NULL,
    chemin_stockage TEXT NOT NULL,
    auteur_modification TEXT,
    date_version TEXT NOT NULL
);

-- 9.3 Workflows d'Approbation Documentaire
CREATE TABLE document_workflows (
    id TEXT PRIMARY KEY,
    document_id TEXT REFERENCES documents_ged(id) ON DELETE CASCADE,
    etape_nom TEXT NOT NULL,
    approbateur_cible TEXT NOT NULL,
    statut_etape TEXT DEFAULT 'En attente', -- 'Approuvé', 'En attente', 'Rejeté'
    date_action TEXT
);

-- 9.4 Signatures Numériques / Trace d'Intégrité
CREATE TABLE signatures_numeriques (
    id TEXT PRIMARY KEY,
    document_id TEXT REFERENCES documents_ged(id) ON DELETE CASCADE,
    signataire TEXT NOT NULL,
    date_signature TEXT NOT NULL,
    empreinte_numerique TEXT NOT NULL -- Hash SHA-256 simulé
);


-- ============================================================================
-- SECTION 10 : ÉQUIPEMENTS, FLOTTE & LOGISTIQUE
-- ============================================================================

-- 10.1 Parc d'Équipements, Véhicules & Tracteurs
CREATE TABLE equipements (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL REFERENCES saas_tenants(id) ON DELETE CASCADE,
    code TEXT UNIQUE NOT NULL,
    designation TEXT NOT NULL,
    categorie TEXT NOT NULL, -- 'Tracteur', 'Moissonneuse', 'Motopompe', 'Véhicule de livraison'
    etat TEXT DEFAULT 'Opérationnel', -- 'Opérationnel', 'En maintenance', 'En panne', 'Réformé'
    compteur_utilisation INTEGER DEFAULT 0, -- en Heures ou Kilomètres
    date_acquisition TEXT
);

-- 10.2 Plans de Maintenance Préventive
CREATE TABLE plans_maintenance (
    id TEXT PRIMARY KEY,
    equipement_id TEXT REFERENCES equipements(id) ON DELETE CASCADE,
    nom_plan TEXT NOT NULL,
    frequence_utilisation INTEGER, -- Ex: toutes les 250 heures
    derniere_maintenance TEXT,
    prochaine_echeance TEXT NOT NULL
);

-- 10.3 Ordres de Travail de Maintenance (Curative & Préventive)
CREATE TABLE ordres_travail (
    id TEXT PRIMARY KEY,
    equipement_id TEXT REFERENCES equipements(id) ON DELETE CASCADE,
    titre TEXT NOT NULL,
    description TEXT,
    type_maintenance TEXT DEFAULT 'Correctif', -- 'Préventif', 'Correctif'
    statut TEXT DEFAULT 'Fermé', -- 'Ouvert', 'En cours', 'Fermé'
    cout_pieces NUMERIC(15, 2) DEFAULT 0,
    cout_main_doeuvre NUMERIC(15, 2) DEFAULT 0,
    date_maintenance TEXT NOT NULL,
    technicien TEXT
);

-- 10.4 Consommation de Carburant & Énergie
CREATE TABLE consommations_carburant (
    id TEXT PRIMARY KEY,
    equipement_id TEXT REFERENCES equipements(id) ON DELETE CASCADE,
    date TEXT NOT NULL,
    quantite_litres NUMERIC(10, 2) NOT NULL,
    cout_total_carburant NUMERIC(15, 2) DEFAULT 0,
    compteur_utilisation_enregistrement INTEGER
);


-- ============================================================================
-- SECTION 11 : MÉTA-MODÈLE & CHAMPS DYNAMIQUES PERSONNALISÉS
-- ============================================================================

-- 11.1 Entités Métadonnées Personnalisées (Ex: 'Vignobles', 'Ruches')
CREATE TABLE custom_entities (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL REFERENCES saas_tenants(id) ON DELETE CASCADE,
    nom_unique TEXT NOT NULL, -- Ex: 'Rapport météo personnalisé'
    code_definition TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11.2 Définitions de Champs Personnalisés
CREATE TABLE custom_field_definitions (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL REFERENCES saas_tenants(id) ON DELETE CASCADE,
    entite_cible TEXT NOT NULL, -- 'employes', 'parcelles', 'equipements', etc.
    code_champ TEXT NOT NULL, -- Ex: 'vitesse_croissance_moyenne'
    type_donnee TEXT NOT NULL, -- 'texte', 'nombre', 'date', 'selection'
    libelle TEXT NOT NULL
);

-- 11.3 Valeurs des Champs Personnalisés par Instance
CREATE TABLE custom_field_values (
    id TEXT PRIMARY KEY,
    definition_id TEXT REFERENCES custom_field_definitions(id) ON DELETE CASCADE,
    id_instance TEXT NOT NULL, -- ID de l'enregistrement ciblé (Ex: l'id de la parcelle, etc.)
    valeur TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================================
-- INDEX DE PERFORMANCE POUR REQUÊTES RAPIDES (MULTI-TENANT OPTIMISÉ)
-- ============================================================================
CREATE INDEX idx_saas_audit_logs_tenant ON saas_audit_logs(tenant_id);
CREATE INDEX idx_exploitations_tenant ON exploitations(tenant_id);
CREATE INDEX idx_parcelles_site ON parcelles(site_id);
CREATE INDEX idx_parcelles_champ ON parcelles(champ_id);
CREATE INDEX idx_cultures_campagne ON cultures(campagne_id);
CREATE INDEX idx_cultures_parcelle ON cultures(parcelle_id);
CREATE INDEX idx_interventions_parcelle ON interventions(parcelle_id);
CREATE INDEX idx_recoltes_culture ON recoltes(culture_id);
CREATE INDEX idx_troupeaux_batiment ON troupeaux(batiment_id);
CREATE INDEX idx_stock_lots_produit ON stock_lots(produit_id);
CREATE INDEX idx_stock_mouvements_lot ON stock_mouvements(lot_id);
CREATE INDEX idx_ecritures_tenant ON ecritures_comptables(tenant_id);
CREATE INDEX idx_lignes_ecriture_compte ON lignes_ecriture(compte);
CREATE INDEX idx_lignes_ecriture_ecriture ON lignes_ecriture(ecriture_id);
CREATE INDEX idx_employes_tenant ON employes(tenant_id);
CREATE INDEX idx_fiches_paie_employe ON fiches_paie(employe_id);
CREATE INDEX idx_documents_ged_tenant ON documents_ged(tenant_id);
CREATE INDEX idx_equipements_tenant ON equipements(tenant_id);
CREATE INDEX idx_custom_field_values_instance ON custom_field_values(id_instance);

-- Fin du script SQL
