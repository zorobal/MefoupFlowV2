/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  SlidersHorizontal,
  ShieldCheck,
  UserCheck,
  Plus,
  Trash2,
  Heading,
  Eye,
  EyeOff,
  Check,
  Lock,
  Compass,
  FileSpreadsheet,
  Download,
  AlertCircle,
  Laptop,
  Users,
  Edit,
  Key
} from 'lucide-react';

import { Utilisateur, Campagne, Employe, Fournisseur, Pays, VilleAdmin } from '../types';

interface Role {
  id: string;
  name: string;
  modules: string[]; // e.g., ["dashboard", "agriculture", "elevage", "stocks", "commercial", "compta", "rh", "ged", "settings"]
  canModify: boolean;
  canDelete: boolean;
  canImport: boolean;
  canExport: boolean;
}

interface CustomLabels {
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

interface SystemSettings {
  customLabels: CustomLabels;
  roles: Role[];
  activeRoleId: string;
}

interface SettingsModuleProps {
  settings: SystemSettings;
  onUpdateSettings: (newSettings: SystemSettings) => void;
  onLogAudit?: (action: string, description: string) => void;
  currentUser: Utilisateur | null;
  onUpdateCurrentUser: (user: Utilisateur) => void;
  utilisateurs: Utilisateur[];
  onAddUtilisateur: (u: Utilisateur) => void;
  onUpdateUtilisateur: (u: Utilisateur) => void;
  onDeleteUtilisateur: (id: string) => void;
  auditLogs?: any[];
  
  // Custom Admin Agricultural Constants (Requested Features)
  typesCulture: string[];
  onAddTypeCulture: (tc: string) => void;
  campagnes: Campagne[];
  onAddCampagne: (camp: Campagne) => void;
  typesOperation: string[];
  onAddTypeOperation: (to: string) => void;
  responsablesTerrain: { name: string; type: 'Employé' | 'Prestataire Externe'; info: string }[];
  onAddResponsableTerrain: (resp: { name: string; type: 'Employé' | 'Prestataire Externe'; info: string }) => void;
  substances: { name: string; type: string; description: string }[];
  onAddSubstance: (subs: { name: string; type: string; description: string }) => void;
  employes: Employe[];
  fournisseurs: Fournisseur[];
  paysList?: Pays[];
  villesList?: VilleAdmin[];
  onAddPays?: (p: Pays) => void;
  onAddVille?: (v: VilleAdmin) => void;
}

export default function SettingsModule({
  settings,
  onUpdateSettings,
  onLogAudit,
  currentUser,
  onUpdateCurrentUser,
  utilisateurs,
  onAddUtilisateur,
  onUpdateUtilisateur,
  onDeleteUtilisateur,
  auditLogs = [],
  typesCulture = [],
  onAddTypeCulture,
  campagnes = [],
  onAddCampagne,
  typesOperation = [],
  onAddTypeOperation,
  responsablesTerrain = [],
  onAddResponsableTerrain,
  substances = [],
  onAddSubstance,
  employes = [],
  fournisseurs = [],
  paysList = [],
  villesList = [],
  onAddPays,
  onAddVille
}: SettingsModuleProps) {
  const [activeSubTab, setActiveSubTab] = useState<'profiles' | 'users' | 'vocabulary' | 'simulator' | 'agri-params' | 'custom-fields' | 'custom-entities' | 'audit-logs'>('agri-params');

  const getTenantId = () => {
    try {
      const saved = localStorage.getItem('activeTenant');
      if (saved) return JSON.parse(saved).id || 'client-1';
    } catch(e) {}
    return 'client-1';
  };
  const tenantId = getTenantId();

  // Custom Metadata and Dyn Fields Storage
  const [customFields, setCustomFields] = useState<any[]>(() => {
    const key = `ka_custom_fields_${tenantId}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try { return JSON.parse(saved); } catch(e) {}
    }
    return [
      { id: 'f-1', typeEntiteCible: 'Employe', nomChamp: 'Taille Uniforme (S/M/L/XL)', codeChamp: 'taille_uniforme', typeDonnee: 'selection', optionsSelection: ['S', 'M', 'L', 'XL'], requis: false, defaultValue: 'L' },
      { id: 'f-2', typeEntiteCible: 'Parcelle', nomChamp: 'Coefficient Pente Sol (%)', codeChamp: 'pente_sol', typeDonnee: 'number', requis: true, defaultValue: '2' },
      { id: 'f-3', typeEntiteCible: 'Animal', nomChamp: 'Tempérament comportemental', codeChamp: 'temperament', typeDonnee: 'text', requis: false, defaultValue: 'Calme' }
    ];
  });

  const [customFieldValues, setCustomFieldValues] = useState<any[]>(() => {
    const key = `ka_custom_field_values_${tenantId}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try { return JSON.parse(saved); } catch(e) {}
    }
    return [];
  });

  const [customEntities, setCustomEntities] = useState<any[]>(() => {
    const key = `ka_custom_entities_${tenantId}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try { return JSON.parse(saved); } catch(e) {}
    }
    return [
      { id: 'ce-1', nomUnique: "Rapport d'aléa météo", codeDefinition: "rapport_meteo_custom", description: "Enregistrement des dégâts liés aux précipitations extraordinaires." }
    ];
  });

  const [customEntityAttrs, setCustomEntityAttrs] = useState<any[]>(() => {
    const key = `ka_custom_entity_attrs_${tenantId}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try { return JSON.parse(saved); } catch(e) {}
    }
    return [
      { id: 'ca-1', idDefinitionEntite: 'ce-1', nomAttribut: 'Intensité Pluie (mm)', codeAttribut: 'pluie_mm', typeAttribut: 'number', requis: true },
      { id: 'ca-2', idDefinitionEntite: 'ce-1', nomAttribut: 'Dégâts de Biomasse (%)', codeAttribut: 'degats_pourcent', typeAttribut: 'number', requis: false },
      { id: 'ca-3', idDefinitionEntite: 'ce-1', nomAttribut: 'Observations Générales', codeAttribut: 'obs_text', typeAttribut: 'text', requis: false }
    ];
  });

  const [customEntityInstances, setCustomEntityInstances] = useState<any[]>(() => {
    const key = `ka_custom_entity_instances_${tenantId}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try { return JSON.parse(saved); } catch(e) {}
    }
    return [
      {
        id: 'cei-1',
        idDefinitionEntite: 'ce-1',
        datePlanification: '2026-06-18',
        valeursAttributes: {
          'pluie_mm': '124',
          'degats_pourcent': '12',
          'obs_text': 'Pluies acides enregistrées au niveau de la cuvette Est de la plantation de bananes.'
        },
        auteur: 'Jean-Pierre Ondoa'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem(`ka_custom_fields_${tenantId}`, JSON.stringify(customFields));
  }, [customFields, tenantId]);

  useEffect(() => {
    localStorage.setItem(`ka_custom_field_values_${tenantId}`, JSON.stringify(customFieldValues));
  }, [customFieldValues, tenantId]);

  useEffect(() => {
    localStorage.setItem(`ka_custom_entities_${tenantId}`, JSON.stringify(customEntities));
  }, [customEntities, tenantId]);

  useEffect(() => {
    localStorage.setItem(`ka_custom_entity_attrs_${tenantId}`, JSON.stringify(customEntityAttrs));
  }, [customEntityAttrs, tenantId]);

  useEffect(() => {
    localStorage.setItem(`ka_custom_entity_instances_${tenantId}`, JSON.stringify(customEntityInstances));
  }, [customEntityInstances, tenantId]);

  // UI state for adding custom definitions
  const [newCfTarget, setNewCfTarget] = useState<'Employe' | 'Parcelle' | 'Animal' | 'Article' | 'Fournisseur'>('Employe');
  const [newCfNom, setNewCfNom] = useState('');
  const [newCfCode, setNewCfCode] = useState('');
  const [newCfType, setNewCfType] = useState<'text' | 'number' | 'date' | 'boolean' | 'selection'>('text');
  const [newCfOptions, setNewCfOptions] = useState('');
  const [newCfReq, setNewCfReq] = useState(false);
  const [newCfDefault, setNewCfDefault] = useState('');

  // UI state for custom values simulation playground
  const [testCfEntityId, setTestCfEntityId] = useState('');
  const [testCfDefId, setTestCfDefId] = useState('');
  const [testCfValue, setTestCfValue] = useState('');

  // UI state for creating custom entities definitions
  const [newCeNom, setNewCeNom] = useState('');
  const [newCeCode, setNewCeCode] = useState('');
  const [newCeDesc, setNewCeDesc] = useState('');

  // UI state for creating custom entity attributes
  const [newCaCeId, setNewCaCeId] = useState('');
  const [newCaNom, setNewCaNom] = useState('');
  const [newCaCode, setNewCaCode] = useState('');
  const [newCaType, setNewCaType] = useState<'text' | 'number' | 'date' | 'boolean'>('text');
  const [newCaReq, setNewCaReq] = useState(false);

  // UI state for creating custom entity record instances
  const [newCeiCeId, setNewCeiCeId] = useState('');
  const [newCeiVals, setNewCeiVals] = useState<{[code: string]: string}>({});

  // Ensure default definitions triggers in settings UI
  useEffect(() => {
    if (customEntities.length > 0) {
      if (!newCaCeId) setNewCaCeId(customEntities[0].id);
      if (!newCeiCeId) setNewCeiCeId(customEntities[0].id);
    }
  }, [customEntities]);
  
  // States for password modification
  const [pwdNew, setPwdNew] = useState('');
  const [pwdConfirm, setPwdConfirm] = useState('');
  const [pwdSuccess, setPwdSuccess] = useState<string | null>(null);
  const [pwdError, setPwdError] = useState<string | null>(null);

  // States for user administration
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<Utilisateur | null>(null);
  const [userFormName, setUserFormName] = useState('');
  const [userFormEmail, setUserFormEmail] = useState('');
  const [userFormPassword, setUserFormPassword] = useState('');
  const [userFormRoleId, setUserFormRoleId] = useState('role-superadmin');
  const [userFormStatut, setUserFormStatut] = useState<'Actif' | 'Inactif'>('Actif');
  const [userFormError, setUserFormError] = useState<string | null>(null);

  // Local role form state
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleCanModify, setNewRoleCanModify] = useState(true);
  const [newRoleCanDelete, setNewRoleCanDelete] = useState(false);
  const [newRoleCanImport, setNewRoleCanImport] = useState(false);
  const [newRoleCanExport, setNewRoleCanExport] = useState(true);
  const [newRoleModules, setNewRoleModules] = useState<string[]>(['dashboard', 'agriculture']);

  // Local vocabulary labels formulation
  const [vocabLabels, setVocabLabels] = useState<CustomLabels>(() => ({
    prodVegetale: settings.customLabels?.prodVegetale || 'Production Végétale',
    prodAnimale: settings.customLabels?.prodAnimale || 'Production Animale',
    cultures: settings.customLabels?.cultures || 'Cultures',
    animaux: settings.customLabels?.animaux || 'Animaux',
    parcelles: settings.customLabels?.parcelles || 'Parcelles',
    postes: settings.customLabels?.postes || 'Postes & Fonctions',
    produitsServices: settings.customLabels?.produitsServices || 'Produits & Services',
    villes: settings.customLabels?.villes || 'Villes de déploiement',
    quartiersVillages: settings.customLabels?.quartiersVillages || 'Quartiers / Villages / Secteurs'
  }));

  React.useEffect(() => {
    setVocabLabels({
      prodVegetale: settings.customLabels?.prodVegetale || 'Production Végétale',
      prodAnimale: settings.customLabels?.prodAnimale || 'Production Animale',
      cultures: settings.customLabels?.cultures || 'Cultures',
      animaux: settings.customLabels?.animaux || 'Animaux',
      parcelles: settings.customLabels?.parcelles || 'Parcelles',
      postes: settings.customLabels?.postes || 'Postes & Fonctions',
      produitsServices: settings.customLabels?.produitsServices || 'Produits & Services',
      villes: settings.customLabels?.villes || 'Villes de déploiement',
      quartiersVillages: settings.customLabels?.quartiersVillages || 'Quartiers / Villages / Secteurs'
    });
  }, [settings.customLabels]);

  // --- AGRICULTURAL ADMIN STATE ---
  // 1. Type de culture
  const [tcName, setTcName] = useState('');
  const [tcCycle, setTcCycle] = useState('90');
  const [tcSol, setTcSol] = useState('Sablonneux / Humifère');
  const [tcTemp, setTcTemp] = useState('22-28°C');

  // 2. Campagne Agricole
  const [caCode, setCaCode] = useState('');
  const [caNom, setCaNom] = useState('');
  const [caAnnee, setCaAnnee] = useState('2026');
  const [caDebut, setCaDebut] = useState('2026-06-01');
  const [caFin, setCaFin] = useState('2026-11-30');
  const [caStatut, setCaStatut] = useState<'Planifiée' | 'En cours' | 'Terminée' | 'Archivée'>('Planifiée');

  // 3. Type d'opération
  const [toName, setToName] = useState('');
  const [toOutils, setToOutils] = useState('Houes, Coupe-coupe, Gants');
  const [toCategory, setToCategory] = useState('Travail manuel d\'entretien');

  // 4. Responsable terrain (Employé ou Prestataire)
  const [rtSource, setRtSource] = useState<'employe' | 'prestataire'>('employe');
  const [selectedEmpId, setSelectedEmpId] = useState('');
  const [selectedFournId, setSelectedFournId] = useState('');

  // 5. Substance Intrant
  const [subName, setSubName] = useState('');
  const [subType, setSubType] = useState('Fertilisant');
  const [subDesc, setSubDesc] = useState('');

  // 6. Pays & Villes (Requested Business Rule: Un pays a plusieurs villes et une ville appartient à un seul pays)
  const [newPaysNom, setNewPaysNom] = useState('');
  const [newPaysISO, setNewPaysISO] = useState('');
  const [newPaysIndicatif, setNewPaysIndicatif] = useState('');

  const [newVilleNom, setNewVilleNom] = useState('');
  const [newVillePaysId, setNewVillePaysId] = useState('');
  const [newVilleRegion, setNewVilleRegion] = useState('');

  useEffect(() => {
    if (paysList.length > 0 && !newVillePaysId) {
      setNewVillePaysId(paysList[0].id);
    }
  }, [paysList]);

  // --- AGRICULTURAL ADMIN SUBMISSIONS ---
  const handleCreatePays = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPaysNom.trim() || !newPaysISO.trim()) {
      alert("Le nom et le code ISO sont obligatoires pour créer un pays.");
      return;
    }
    const p: Pays = {
      id: `pays-${Date.now()}`,
      nom: newPaysNom.trim(),
      codeISO: newPaysISO.trim().toUpperCase(),
      indicatifTelephonique: newPaysIndicatif.trim() || '+237'
    };
    if (onAddPays) {
      onAddPays(p);
      setNewPaysNom('');
      setNewPaysISO('');
      setNewPaysIndicatif('');
      alert(`✓ Le pays "${p.nom}" a été ajouté.`);
    }
  };

  const handleCreateVille = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVilleNom.trim() || !newVillePaysId) {
      alert("Le nom de la ville et le pays de rattachement sont obligatoires.");
      return;
    }
    const v: VilleAdmin = {
      id: `ville-${Date.now()}`,
      nom: newVilleNom.trim(),
      paysId: newVillePaysId,
      codeRegion: newVilleRegion.trim() || 'Région Principale'
    };
    if (onAddVille) {
      onAddVille(v);
      setNewVilleNom('');
      setNewVilleRegion('');
      alert(`✓ La ville "${v.nom}" a été créée et rattachée à son pays d'origine unique.`);
    }
  };
  const handleCreateTypeCulture = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tcName.trim()) return;
    const item = `${tcName.trim()} - ${tcCycle} jrs (Sol: ${tcSol.trim()}, Temp: ${tcTemp})`;
    onAddTypeCulture(item);
    setTcName('');
    if (onLogAudit) {
      onLogAudit('ADMIN_AGRI', `Création d'un nouveau Type de Culture : ${item}`);
    }
    alert(`✓ Le type de culture "${tcName.trim()}" a été ajouté avec succès.`);
  };

  const handleCreateCampagne = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caCode.trim() || !caNom.trim() || !caAnnee.trim()) {
      alert("Veuillez remplir tous les champs obligatoires pour la campagne.");
      return;
    }
    const camp: Campagne = {
      id: `camp-${Date.now()}`,
      code: caCode.trim().toUpperCase(),
      nom: caNom.trim(),
      annee: caAnnee.trim(),
      dateDebut: caDebut,
      dateFin: caFin,
      statut: caStatut
    };
    onAddCampagne(camp);
    setCaCode('');
    setCaNom('');
    if (onLogAudit) {
      onLogAudit('ADMIN_AGRI', `Création d'une nouvelle Campagne : ${camp.nom} (${camp.code})`);
    }
    alert(`✓ La Campagne Agricole "${caNom.trim()}" a été ouverte avec succès.`);
  };

  const handleCreateTypeOperation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!toName.trim()) return;
    const item = `${toName.trim()} (${toCategory} • Outils: ${toOutils.trim()})`;
    onAddTypeOperation(item);
    setToName('');
    if (onLogAudit) {
      onLogAudit('ADMIN_AGRI', `Création d'un nouveau Type d'Opération : ${item}`);
    }
    alert(`✓ Le type d'opération "${toName.trim()}" a été inséré.`);
  };

  const handleCreateResponsableTerrain = (e: React.FormEvent) => {
    e.preventDefault();
    let name = '';
    let type: 'Employé' | 'Prestataire Externe' = 'Employé';
    let info = '';

    if (rtSource === 'employe') {
      const emp = employes.find(emp => emp.id === selectedEmpId);
      if (!emp) {
        alert("Veuillez sélectionner un employé existant créé au préalable.");
        return;
      }
      name = `${emp.nom} ${emp.prenom}`;
      type = 'Employé';
      info = `${emp.poste} (${emp.department})`;
    } else {
      const fourn = fournisseurs.find(f => f.id === selectedFournId);
      if (!fourn) {
        alert("Veuillez sélectionner un prestataire externe existant créé au préalable.");
        return;
      }
      name = fourn.raisonSociale;
      type = 'Prestataire Externe';
      info = `${fourn.categorie || 'Services Terrain'} - contribution: ${fourn.numContribuable || 'ND'}`;
    }

    onAddResponsableTerrain({ name, type, info });
    if (onLogAudit) {
      onLogAudit('ADMIN_AGRI', `Création d'un Responsable Terrain : ${name} (${type})`);
    }
    alert(`✓ Le responsable de terrain "${name}" a été ajouté.`);
  };

  const handleCreateSubstance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subName.trim()) return;
    onAddSubstance({
      name: subName.trim(),
      type: subType,
      description: subDesc.trim() || 'Aucune notice explicative'
    });
    setSubName('');
    setSubDesc('');
    if (onLogAudit) {
      onLogAudit('ADMIN_AGRI', `Création d'une Substance Intrant : ${subName.trim()}`);
    }
    alert(`✓ L'intrant / substance "${subName.trim()}" a été configuré.`);
  };

  // Password change submission
  const handlePasswordChangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPwdError(null);
    setPwdSuccess(null);

    if (!currentUser) {
      setPwdError("Erreur: Aucun utilisateur n'est actuellement identifié.");
      return;
    }
    if (!pwdNew) {
      setPwdError("Veuillez saisir votre nouveau mot de passe.");
      return;
    }
    if (pwdNew.length < 4) {
      setPwdError("Le mot de passe doit comporter au moins 4 caractères.");
      return;
    }
    if (pwdNew !== pwdConfirm) {
      setPwdError("Les mots de passe ne correspondent pas.");
      return;
    }

    // Prepare updated user object
    const updatedUser: Utilisateur = {
      ...currentUser,
      password: pwdNew
    };

    // Update currentUser state globally in parent
    onUpdateCurrentUser(updatedUser);

    // Update the record inside tenant's utilisateurs list
    onUpdateUtilisateur(updatedUser);

    setPwdNew('');
    setPwdConfirm('');
    setPwdSuccess("Votre mot de passe a été mis à jour avec succès !");

    if (onLogAudit) {
      onLogAudit('USER_PWD_CHANGE', `Changement de mot de passe réussi pour l'utilisateur: ${currentUser.nom}`);
    }
  };

  // User CRUD submissions
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    setUserFormError(null);

    if (!userFormName.trim() || !userFormEmail.trim() || !userFormPassword.trim()) {
      setUserFormError("Tous les champs sont requis.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(userFormEmail.trim())) {
      setUserFormError("Format de courriel invalide.");
      return;
    }

    const registeredUser: Utilisateur = {
      id: `usr-${Date.now()}`,
      nom: userFormName.trim(),
      email: userFormEmail.trim().toLowerCase(),
      password: userFormPassword,
      roleId: userFormRoleId,
      statut: userFormStatut
    };

    onAddUtilisateur(registeredUser);
    setIsAddingUser(false);
    setUserFormName('');
    setUserFormEmail('');
    setUserFormPassword('');
    setUserFormRoleId('role-superadmin');
    setUserFormStatut('Actif');

    if (onLogAudit) {
      onLogAudit('USER_CREATE', `Création d'un nouvel utilisateur: ${registeredUser.nom} (Rôle: ${registeredUser.roleId})`);
    }
  };

  const handleEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    setUserFormError(null);

    if (!selectedUserForEdit) return;

    if (!userFormName.trim() || !userFormEmail.trim()) {
      setUserFormError("Le nom et l'adresse courriel sont requis.");
      return;
    }

    const updatedUser: Utilisateur = {
      ...selectedUserForEdit,
      nom: userFormName.trim(),
      email: userFormEmail.trim().toLowerCase(),
      roleId: userFormRoleId,
      statut: userFormStatut
    };

    // if a password has been filled, update it
    if (userFormPassword.trim()) {
      updatedUser.password = userFormPassword.trim();
    }

    onUpdateUtilisateur(updatedUser);
    setSelectedUserForEdit(null);
    setUserFormName('');
    setUserFormEmail('');
    setUserFormPassword('');
    setUserFormRoleId('role-superadmin');
    setUserFormStatut('Actif');

    if (onLogAudit) {
      onLogAudit('USER_UPDATE', `Mise à jour des informations de l'utilisateur: ${updatedUser.nom}`);
    }
  };

  const startEditUser = (u: Utilisateur) => {
    setSelectedUserForEdit(u);
    setUserFormName(u.nom);
    setUserFormEmail(u.email);
    setUserFormPassword(''); // don't prefill password
    setUserFormRoleId(u.roleId);
    setUserFormStatut(u.statut || 'Actif');
    setIsAddingUser(false);
  };

  const availableModules = [
    { key: 'dashboard', label: 'Dashboard & Cockpit exécutif' },
    { key: 'agriculture', label: vocabLabels.prodVegetale || 'Production Végétale' },
    { key: 'elevage', label: vocabLabels.prodAnimale || 'Production Animale' },
    { key: 'stocks', label: 'Stocks & Équipements mécaniques' },
    { key: 'commercial', label: 'Facturations & Portefeuille Commercial' },
    { key: 'compta', label: 'Compatibilité SYSCOHADA' },
    { key: 'rh', label: 'Ressources Humaines & Paie' },
    { key: 'ged', label: 'Gestion Électronique des Documents (GED)' },
    { key: 'settings', label: 'Paramètres Système (Habilitations & Glossaire)' },
    { key: 'parc-materiel', label: 'Parc Matériel & Maintenance' },
    { key: 'bi-reporting', label: 'Business Intelligence & Rapports' }
  ];

  // Save customized glossary terms
  const handleSaveVocabulary = () => {
    const updated = {
      ...settings,
      customLabels: { ...vocabLabels }
    };
    onUpdateSettings(updated);
    if (onLogAudit) {
      onLogAudit('SET_GLOSSARY', `Mise à jour du glossaire métier personnalisé par le client`);
    }
    alert('✓ Glossaire métier enregistré avec succès ! Labels mis à jour dans l’ensemble du système.');
  };

  // Add new Profile Role
  const handleAddNewRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;

    const newRole: Role = {
      id: 'role-' + Math.floor(Math.random() * 10000),
      name: newRoleName.trim(),
      modules: [...newRoleModules],
      canModify: newRoleCanModify,
      canDelete: newRoleCanDelete,
      canImport: newRoleCanImport,
      canExport: newRoleCanExport
    };

    const updated = {
      ...settings,
      roles: [...settings.roles, newRole]
    };

    onUpdateSettings(updated);
    if (onLogAudit) {
      onLogAudit('SET_ROLE_ADD', `Création d'un nouveau profil d'utilisateur : ${newRole.name}`);
    }

    // Reset Form
    setNewRoleName('');
    setNewRoleCanModify(true);
    setNewRoleCanDelete(false);
    setNewRoleCanImport(false);
    setNewRoleCanExport(true);
    setNewRoleModules(['dashboard', 'agriculture']);
  };

  // Delete Custom Role (Prevent deleting superadmin)
  const handleDeleteRole = (idToDelete: string) => {
    if (idToDelete === 'role-superadmin') {
      alert("❌ Impossible de supprimer le rôle Super Administrateur de secours.");
      return;
    }

    const filtered = settings.roles.filter(r => r.id !== idToDelete);
    const updated = {
      ...settings,
      roles: filtered,
      activeRoleId: settings.activeRoleId === idToDelete ? 'role-superadmin' : settings.activeRoleId
    };

    onUpdateSettings(updated);
    if (onLogAudit) {
      onLogAudit('SET_ROLE_DEL', `Révocation/Suppression d'un profil d'utilisateur ID: ${idToDelete}`);
    }
  };

  // Switch Simulated Role
  const handleSwitchSimulatedRole = (roleId: string) => {
    const roleObj = settings.roles.find(r => r.id === roleId);
    if (!roleObj) return;

    const updated = {
      ...settings,
      activeRoleId: roleId
    };

    onUpdateSettings(updated);
    if (onLogAudit) {
      onLogAudit('SIM_USER', `Simulateur : Transition vers le profil actif de : ${roleObj.name}`);
    }
  };

  // Toggle Module visibility inside a specific role
  const handleToggleModuleInRole = (roleId: string, moduleKey: string) => {
    if (roleId === 'role-superadmin') return; // protect superadmin

    const updatedRoles = settings.roles.map(r => {
      if (r.id === roleId) {
        const hasModule = r.modules.includes(moduleKey);
        const newModules = hasModule
          ? r.modules.filter(m => m !== moduleKey)
          : [...r.modules, moduleKey];
        return { ...r, modules: newModules };
      }
      return r;
    });

    onUpdateSettings({
      ...settings,
      roles: updatedRoles
    });
  };

  // Toggle boolean permission in role
  const handleTogglePermInRole = (roleId: string, permissionField: 'canModify' | 'canDelete' | 'canImport' | 'canExport') => {
    if (roleId === 'role-superadmin') return; // protect superadmin

    const updatedRoles = settings.roles.map(r => {
      if (r.id === roleId) {
        return { ...r, [permissionField]: !r[permissionField] };
      }
      return r;
    });

    onUpdateSettings({
      ...settings,
      roles: updatedRoles
    });
  };

  // Reset all to defaults
  const handleResetSettings = () => {
    if (window.confirm("Êtes-vous sûr de vouloir réinitialiser la configuration des profils et du glossaire aux réglages d'usine ?")) {
      const defaultSettings: SystemSettings = {
        customLabels: {
          prodVegetale: 'Production Végétale',
          prodAnimale: 'Production Animale',
          cultures: 'Cultures',
          animaux: 'Animaux',
          parcelles: 'Parcelles'
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
      setVocabLabels(defaultSettings.customLabels);
      onUpdateSettings(defaultSettings);
      if (onLogAudit) {
        onLogAudit('SET_RESET', `Réinitialisation complète de l'environnement de sécurité et de terminologie`);
      }
    }
  };

  const simulatedRole = settings.roles.find(r => r.id === settings.activeRoleId) || settings.roles[0];

  return (
    <div id="settings-module" className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* MODULE HEADER */}
      <div className="flex justify-between items-start border-b pb-4 flex-wrap gap-2">
        <div>
          <span className="text-[10px] bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded font-black uppercase tracking-wider">
            Configuration Interne & Contrôle d'Accès
          </span>
          <h2 className="text-xl font-black text-slate-800">
            ⚙️ PARAMÈTRES SYSTÈME CLIENT
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Gérez de manière agile vos habilitations par métier, vos droits sur les documents et votre vocabulaire agricole local.
          </p>
        </div>

        <button
          onClick={handleResetSettings}
          className="bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition"
        >
          Réinitialiser aux réglages d'usine
        </button>
      </div>

      {/* DETAILED ACTIVE SIMULATED SIMULATOR ROLE STATUS ADVISORY BANNER */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 p-4 rounded-xl shadow-md border border-slate-800 text-white flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-lg shrink-0">
            <Laptop className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-wide">
              SIMULATEUR DE SÉCURITÉ INTÉGRÉ
            </div>
            <div className="text-sm font-black text-emerald-400 flex items-center gap-2">
              <span>Profil simulé : {simulatedRole.name}</span>
              <span className="text-[9px] bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold px-1.5 py-0.2 rounded uppercase">
                {simulatedRole.id === 'role-superadmin' ? 'Total Accès' : 'Accès Limité'}
              </span>
            </div>
            <p className="text-[10.5px] text-zinc-400 leading-relaxed max-w-xl">
              Toute l'interface de l'ERP va réagir dynamiquement : les menus non visibles dans son rôle disparaitront du volet de gauche, et ses droits de modification, suppression, exportation ou importation seront immédiatement appliqués.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-300 font-semibold">Changer de Profil :</span>
          <select
            value={settings.activeRoleId}
            onChange={(e) => handleSwitchSimulatedRole(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white text-xs font-extrabold p-2 rounded-lg focus:outline-hidden"
          >
            {settings.roles.map(r => (
              <option key={r.id} value={r.id}>
                🎭 {r.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* INTERNAL SETTINGS TABS */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveSubTab('users')}
          className={`px-4 py-2 text-xs font-extrabold pb-3 transition border-b-2 -mb-[2px] ${
            activeSubTab === 'users'
              ? 'border-indigo-600 text-indigo-700 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-905'
          }`}
        >
          👥 Utilisateurs & Mot de passe
        </button>

        <button
          onClick={() => setActiveSubTab('profiles')}
          className={`px-4 py-2 text-xs font-extrabold pb-3 transition border-b-2 -mb-[2px] ${
            activeSubTab === 'profiles'
              ? 'border-indigo-600 text-indigo-700 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-905'
          }`}
        >
          🔑 Profils & Droits Applicatifs
        </button>

        <button
          onClick={() => setActiveSubTab('vocabulary')}
          className={`px-4 py-2 text-xs font-extrabold pb-3 transition border-b-2 -mb-[2px] ${
            activeSubTab === 'vocabulary'
              ? 'border-indigo-600 text-indigo-700 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-905'
          }`}
        >
          🏷️ Glossaire & Vocabulaire Métier
        </button>

        <button
          onClick={() => setActiveSubTab('simulator')}
          className={`px-4 py-2 text-xs font-extrabold pb-3 transition border-b-2 -mb-[2px] ${
            activeSubTab === 'simulator'
              ? 'border-indigo-600 text-indigo-700 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-905'
          }`}
        >
          👁️ Aperçu de Matrice de Droits
        </button>

        <button
          onClick={() => setActiveSubTab('agri-params')}
          className={`px-4 py-2 text-xs font-extrabold pb-3 transition border-b-2 -mb-[2px] ${
            activeSubTab === 'agri-params'
              ? 'border-indigo-600 text-indigo-700 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-905'
          }`}
        >
          🌾 Paramètres Agricoles & Substances
        </button>

        <button
          onClick={() => setActiveSubTab('custom-fields')}
          className={`px-4 py-2 text-xs font-extrabold pb-3 transition border-b-2 -mb-[2px] ${
            activeSubTab === 'custom-fields'
              ? 'border-indigo-600 text-indigo-700 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-905'
          }`}
        >
          🔬 Champs Personnalisés
        </button>

        <button
          onClick={() => setActiveSubTab('custom-entities')}
          className={`px-4 py-2 text-xs font-extrabold pb-3 transition border-b-2 -mb-[2px] ${
            activeSubTab === 'custom-entities'
              ? 'border-indigo-600 text-indigo-700 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-905'
          }`}
        >
          🏗️ Entités & Tables Dynamiques
        </button>

        <button
          onClick={() => setActiveSubTab('audit-logs')}
          className={`px-4 py-2 text-xs font-extrabold pb-3 transition border-b-2 -mb-[2px] ${
            activeSubTab === 'audit-logs'
              ? 'border-indigo-600 text-indigo-700 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-905'
          }`}
        >
          📋 Journaux d'Audit Sécurité
        </button>
      </div>

      {/* RENDERING SUB-SECTIONS */}

      {/* RENDERING SUB-SECTIONS */}

      {/* SUB-TAB: USERS DEPLOYMENT & KEY SECURITY */}
      {activeSubTab === 'users' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT AREA: USERS LIST OR EDIT/ADD FORMS */}
          <div className="lg:col-span-2 space-y-6 animate-fade-in">
            
            {/* INLINE FORM: ADD USER */}
            {isAddingUser && (
              <div className="bg-white rounded-2xl border p-5 shadow-xs space-y-4">
                <div className="flex justify-between items-center border-b pb-3">
                  <div>
                    <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <Plus className="h-4 w-4 text-emerald-600" />
                      Créer un nouvel utilisateur
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Renseignez les habilitations d'accès pour ce collaborateur.
                    </p>
                  </div>
                  <button 
                    onClick={() => setIsAddingUser(false)}
                    className="text-xs text-slate-400 hover:text-slate-600 font-bold"
                  >
                    Effacer / Annuler
                  </button>
                </div>

                {userFormError && (
                  <div className="p-3 bg-red-50 text-red-600 rounded-lg text-xs font-medium flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {userFormError}
                  </div>
                )}

                <form onSubmit={handleCreateUser} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                        Nom complet de l'agent *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Jean-Pierre Ondoa"
                        autoComplete="new-password"
                        value={userFormName}
                        onChange={(e) => setUserFormName(e.target.value)}
                        className="w-full text-xs p-2.5 border rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-600 bg-slate-50"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                        Adresse Courriel (Login) *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="Ex: j.ondoa@mefoup.com"
                        autoComplete="new-password"
                        value={userFormEmail}
                        onChange={(e) => setUserFormEmail(e.target.value)}
                        className="w-full text-xs p-2.5 border rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-600 bg-slate-50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                        Mot de passe d'initialisation *
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        autoComplete="new-password"
                        value={userFormPassword}
                        onChange={(e) => setUserFormPassword(e.target.value)}
                        className="w-full text-xs p-2.5 border rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-600 bg-slate-50"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                        Habilitations / Rôle attribué *
                      </label>
                      <select
                        value={userFormRoleId}
                        onChange={(e) => setUserFormRoleId(e.target.value)}
                        className="w-full text-xs p-2.5 border rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-600 bg-slate-50"
                      >
                        {settings.roles.map(role => (
                          <option key={role.id} value={role.id}>{role.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                        Statut initial de l'accès *
                      </label>
                      <select
                        value={userFormStatut}
                        onChange={(e) => setUserFormStatut(e.target.value as any)}
                        className="w-full text-xs p-2.5 border rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-600 bg-slate-50"
                      >
                        <option value="Actif">Actif (Accès instantané)</option>
                        <option value="Inactif">Suspendu / Inactif</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t">
                    <button
                      type="button"
                      onClick={() => setIsAddingUser(false)}
                      className="px-4 py-2 border rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-50"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5"
                    >
                      <Check className="h-4 w-4" /> Enregistrer le Collaborateur
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* INLINE FORM: EDIT USER */}
            {selectedUserForEdit && (
              <div className="bg-white rounded-2xl border p-5 shadow-xs space-y-4">
                <div className="flex justify-between items-center border-b pb-3">
                  <div>
                    <h3 className="font-extrabold text-indigo-700 text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <Edit className="h-4 w-4" />
                      Modifier l'utilisateur : {selectedUserForEdit.nom}
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Modifiez les droits ou rafraîchissez les informations de connexion.
                    </p>
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedUserForEdit(null);
                      setUserFormPassword('');
                    }}
                    className="text-xs text-slate-400 hover:text-slate-600 font-bold"
                  >
                    Fermer / Annuler
                  </button>
                </div>

                {userFormError && (
                  <div className="p-3 bg-red-50 text-red-600 rounded-lg text-xs font-medium flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {userFormError}
                  </div>
                )}

                <form onSubmit={handleEditUser} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                        Nom complet de l'agent *
                      </label>
                      <input
                        type="text"
                        required
                        autoComplete="new-password"
                        value={userFormName}
                        onChange={(e) => setUserFormName(e.target.value)}
                        className="w-full text-xs p-2.5 border rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-600 bg-slate-50"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                        Adresse Courriel (Login) *
                      </label>
                      <input
                        type="email"
                        required
                        autoComplete="new-password"
                        value={userFormEmail}
                        onChange={(e) => setUserFormEmail(e.target.value)}
                        className="w-full text-xs p-2.5 border rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-600 bg-slate-50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                        Nouveau mot de passe (Facultatif)
                      </label>
                      <input
                        type="password"
                        placeholder="Laisser vide pour ne pas modifier"
                        autoComplete="new-password"
                        value={userFormPassword}
                        onChange={(e) => setUserFormPassword(e.target.value)}
                        className="w-full text-xs p-2.5 border rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-600 bg-slate-50"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                        Rôle / Profil Habilité *
                      </label>
                      <select
                        value={userFormRoleId}
                        onChange={(e) => setUserFormRoleId(e.target.value)}
                        className="w-full text-xs p-2.5 border rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-600 bg-slate-50"
                      >
                        {settings.roles.map(role => (
                          <option key={role.id} value={role.id}>{role.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                        Statut du compte *
                      </label>
                      <select
                        value={userFormStatut}
                        onChange={(e) => setUserFormStatut(e.target.value as any)}
                        className="w-full text-xs p-2.5 border rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-600 bg-slate-50"
                      >
                        <option value="Actif">Actif</option>
                        <option value="Inactif">Suspendu / Inactif</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedUserForEdit(null);
                        setUserFormPassword('');
                      }}
                      className="px-4 py-2 border rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-50"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5"
                    >
                      <Check className="h-4 w-4" /> Enregistrer les Modifications
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* THE USERS LIST */}
            <div className="bg-white rounded-2xl border shadow-2xs overflow-hidden">
              <div className="p-5 border-b flex flex-wrap justify-between items-center gap-4 bg-slate-50/50">
                <div>
                  <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5 animate-pulse">
                    <Users className="h-4 w-4 text-indigo-600" />
                    Utilisateurs autorisés sur cette structure
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Ci-dessous figurent les agents habilités à accéder à votre instance ERP Mefoup-Flow.
                  </p>
                </div>
                
                {/* Only SuperAdmins or Administrators create users! */}
                {(currentUser?.roleId === 'role-superadmin' || currentUser?.roleId === 'role-admin' || !currentUser) && (
                  <button
                    onClick={() => {
                      setIsAddingUser(true);
                      setSelectedUserForEdit(null);
                      setUserFormName('');
                      setUserFormEmail('');
                      setUserFormPassword('');
                      setUserFormRoleId('role-superadmin');
                      setUserFormStatut('Actif');
                    }}
                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-black flex items-center gap-1.5 shadow-2xs transition"
                  >
                    <Plus className="h-4 w-4" /> Nouvel Utilisateur
                  </button>
                )}
              </div>

              {utilisateurs.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  Aucun utilisateur supplémentaire configuré pour le moment.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/80 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b">
                        <th className="p-3.5 px-5">Collaborateur</th>
                        <th className="p-3.5">Email unique (Login)</th>
                        <th className="p-3.5">Profil habilité</th>
                        <th className="p-3.5">Statut de connexion</th>
                        <th className="p-3.5 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y text-xs">
                      {utilisateurs.map((user) => {
                        const matchedRole = settings.roles.find(r => r.id === user.roleId)?.name || user.roleId;
                        return (
                          <tr key={user.id} className="hover:bg-slate-50/30 transition">
                            <td className="p-3.5 px-5 font-bold text-slate-800">{user.nom}</td>
                            <td className="p-3.5 font-mono text-[11px] text-slate-500">{user.email}</td>
                            <td className="p-3.5">
                              <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 font-extrabold rounded text-[10px] border border-indigo-100 uppercase tracking-wider">
                                {matchedRole}
                              </span>
                            </td>
                            <td className="p-3.5">
                              {user.statut === 'Actif' ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-sm">
                                  ● Actif
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-sm">
                                  ○ Suspendu
                                </span>
                              )}
                            </td>
                            <td className="p-3.5">
                              <div className="flex gap-2 justify-center">
                                <button
                                  onClick={() => startEditUser(user)}
                                  className="p-1 px-2.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition text-[10px] font-bold flex items-center gap-1"
                                >
                                  <Edit className="h-3.5 w-3.5" /> Modifier
                                </button>
                                
                                {currentUser?.id !== user.id && (
                                  <button
                                    onClick={() => {
                                      if (confirm(`Êtes-vous certain de vouloir supprimer définitivement l'utilisateur "${user.nom}" ?`)) {
                                        onDeleteUtilisateur(user.id);
                                      }
                                    }}
                                    className="p-1 px-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition text-[10px] font-bold flex items-center gap-1"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" /> Supprimer
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT AREA: MY PROFILE PASSWORD MODIFICATION */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border p-5 shadow-2xs space-y-4">
              <div>
                <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Key className="h-4 w-4 text-indigo-600" />
                  Mise à Jour de mon Code secret
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Configurez un nouveau mot de passe d'accès pour votre propre compte session.
                </p>
              </div>

              {currentUser ? (
                <div className="p-4 bg-slate-50 rounded-xl space-y-1.5 border">
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Compte authentifié</div>
                  <div className="text-xs font-black text-slate-850">{currentUser.nom}</div>
                  <div className="text-[11px] font-mono text-slate-500">{currentUser.email}</div>
                  <div className="pt-2">
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-sm border border-emerald-100">
                      Droits: {settings.roles.find(r => r.id === settings.activeRoleId)?.name || "Super Admin"}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-slate-50 rounded-xl text-center text-xs text-slate-400">
                  Aucune session identifiée.
                </div>
              )}

              {pwdError && (
                <div className="p-3 bg-red-100 text-red-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 leading-snug">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {pwdError}
                </div>
              )}

              {pwdSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold leading-snug flex items-center gap-1.5">
                  <Check className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
                  {pwdSuccess}
                </div>
              )}

              <form onSubmit={handlePasswordChangeSubmit} className="space-y-3 pt-2">
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1">
                    Nouveau mot de passe *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Saisissez le nouveau secret"
                    value={pwdNew}
                    onChange={(e) => setPwdNew(e.target.value)}
                    className="w-full text-xs p-2.5 border rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-600 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1">
                    Confirmer le mot de passe *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Confirmez pour validation"
                    value={pwdConfirm}
                    onChange={(e) => setPwdConfirm(e.target.value)}
                    className="w-full text-xs p-2.5 border rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-600 bg-slate-50"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-lg text-xs transition shadow-2xs flex justify-center items-center gap-2"
                  >
                    <Lock className="h-4 w-4" /> Enregistrer mon mot de passe
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>
      )}

      {/* SUB-TAB 1: PROFILES & DIRECT HABILITATIONS */}
      {activeSubTab === 'profiles' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* PROFILE CREATOR FORM */}
          <div className="bg-white rounded-2xl border p-5 shadow-2xs space-y-4">
            <div>
              <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Plus className="h-4 w-4 text-indigo-600" />
                Susciter un Nouveau Profil
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Créez une fonction sur-mesure pour votre exploitation agricole et définissez ses modules.
              </p>
            </div>

            <form onSubmit={handleAddNewRole} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Désignation Métier / Profil *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex : Gestionnaire Maraîchage Nord, Cacaoculteur..."
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  className="w-full border rounded-lg p-2 text-xs focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <span className="block text-xs font-bold text-slate-600 mb-1.5">
                  Droits d'Action Système
                </span>
                <div className="space-y-2 bg-slate-50 p-2.5 rounded-lg border">
                  <label className="flex items-center gap-2 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newRoleCanModify}
                      onChange={(e) => setNewRoleCanModify(e.target.checked)}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <div>
                      <span className="font-semibold block text-slate-700">Droit d'Ajout & Modification</span>
                      <span className="text-[9px] text-slate-400 block -mt-0.5">Modifier les registres, saisir des données</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newRoleCanDelete}
                      onChange={(e) => setNewRoleCanDelete(e.target.checked)}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <div>
                      <span className="font-semibold block text-slate-700">Droit de Suppression</span>
                      <span className="text-[9px] text-slate-400 block -mt-0.5">Retirer des fiches, animaux ou écritures</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newRoleCanImport}
                      onChange={(e) => setNewRoleCanImport(e.target.checked)}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <div>
                      <span className="font-semibold block text-slate-700">Droit d'Importation</span>
                      <span className="text-[9px] text-slate-400 block -mt-0.5">Restaurer des sauvegardes ou intégrer des feuilles d'écritures</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newRoleCanExport}
                      onChange={(e) => setNewRoleCanExport(e.target.checked)}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <div>
                      <span className="font-semibold block text-slate-700">Droit d'Exportation</span>
                      <span className="text-[9px] text-slate-400 block -mt-0.5">Générer et télécharger les balances, documents GED et rapports PDF</span>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <span className="block text-xs font-bold text-slate-600 mb-1.5">
                  Modules Autorisés (Visibilité Nav)
                </span>
                <div className="bg-slate-50 border p-2.5 rounded-lg space-y-1.5 max-h-44 overflow-y-auto">
                  {availableModules.map(m => {
                    const hasMod = newRoleModules.includes(m.key);
                    return (
                      <label key={m.key} className="flex items-center gap-2 text-[11px] font-semibold text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={hasMod}
                          onChange={() => {
                            if (hasMod) {
                              setNewRoleModules(prev => prev.filter(x => x !== m.key));
                            } else {
                              setNewRoleModules(prev => [...prev, m.key]);
                            }
                          }}
                          className="rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <span>{m.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs py-2.5 rounded-lg transition"
              >
                Créer et Enregistrer ce Profil
              </button>
            </form>
          </div>

          {/* ACTIVE PROFILES LIST MATRIX WITH DIRECT TOGGLES */}
          <div className="lg:col-span-2 bg-white rounded-2xl border p-5 shadow-2xs space-y-4">
            <div>
              <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                Matrice Interactive des Profils & Habilitations
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Pour chaque profil, cochez ou décochez en temps réel les modules autorisés et leurs privilèges associés.
              </p>
            </div>

            <div className="space-y-4 divide-y">
              {settings.roles.map((r) => {
                const isSuper = r.id === 'role-superadmin';
                return (
                  <div key={r.id} className="pt-4 first:pt-0 space-y-3">
                    <div className="flex justify-between items-center bg-slate-50/50 p-2.5 rounded-lg">
                      <div>
                        <span className="font-black text-slate-800 text-xs block">{r.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">ID: {r.id} • {r.modules.length} modules ouverts</span>
                      </div>
                      
                      {!isSuper && (
                        <button
                          onClick={() => handleDeleteRole(r.id)}
                          className="text-rose-600 hover:text-rose-900 p-1 bg-red-50 hover:bg-red-100 rounded-sm transition"
                          title="Supprimer ce profil"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    {/* PERMISSION CHECKBOXES */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 text-[10.5px]">
                      <button
                        disabled={isSuper}
                        onClick={() => handleTogglePermInRole(r.id, 'canModify')}
                        className={`p-1.5 rounded-lg border font-bold transition text-left flex items-center gap-1.5 ${
                          r.canModify
                            ? 'bg-emerald-50 border-emerald-250 text-emerald-800'
                            : 'bg-slate-50 border-slate-200 text-slate-400 line-through'
                        }`}
                      >
                        <Check className="h-3 w-3 shrink-0" />
                        Modification : {r.canModify ? 'OUI' : 'NON'}
                      </button>

                      <button
                        disabled={isSuper}
                        onClick={() => handleTogglePermInRole(r.id, 'canDelete')}
                        className={`p-1.5 rounded-lg border font-bold transition text-left flex items-center gap-1.5 ${
                          r.canDelete
                            ? 'bg-emerald-50 border-emerald-250 text-emerald-800'
                            : 'bg-slate-50 border-slate-200 text-slate-400 line-through'
                        }`}
                      >
                        <Check className="h-3 w-3 shrink-0" />
                        Suppression : {r.canDelete ? 'OUI' : 'NON'}
                      </button>

                      <button
                        disabled={isSuper}
                        onClick={() => handleTogglePermInRole(r.id, 'canImport')}
                        className={`p-1.5 rounded-lg border font-bold transition text-left flex items-center gap-1.5 ${
                          r.canImport
                            ? 'bg-emerald-50 border-emerald-250 text-emerald-800'
                            : 'bg-slate-50 border-slate-200 text-slate-400 line-through'
                        }`}
                      >
                        <Check className="h-3 w-3 shrink-0" />
                        Importation : {r.canImport ? 'OUI' : 'NON'}
                      </button>

                      <button
                        disabled={isSuper}
                        onClick={() => handleTogglePermInRole(r.id, 'canExport')}
                        className={`p-1.5 rounded-lg border font-bold transition text-left flex items-center gap-1.5 ${
                          r.canExport
                            ? 'bg-emerald-50 border-emerald-250 text-emerald-800'
                            : 'bg-slate-50 border-slate-200 text-slate-400 line-through'
                        }`}
                      >
                        <Check className="h-3 w-3 shrink-0" />
                        Exportation : {r.canExport ? 'OUI' : 'NON'}
                      </button>
                    </div>

                    {/* MODULE VISIBILITIES */}
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 block font-bold uppercase">Visibilité des Modules :</span>
                      <div className="flex flex-wrap gap-1">
                        {availableModules.map(m => {
                          const isAuthorized = r.modules.includes(m.key);
                          return (
                            <button
                              key={m.key}
                              disabled={isSuper}
                              onClick={() => handleToggleModuleInRole(r.id, m.key)}
                              className={`text-[9.5px] px-2 py-1 rounded-md border transition font-bold ${
                                isAuthorized
                                  ? 'bg-indigo-50 border-indigo-200 text-indigo-850 font-bold'
                                  : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-slate-200'
                              }`}
                            >
                              {m.label.split('(')[0].split('&')[0].trim()}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: GLOSSARY & CUSTOM TERMINOLOGY */}
      {activeSubTab === 'vocabulary' && (
        <div className="bg-white rounded-2xl border p-5 shadow-2xs space-y-6">
          <div className="border-b pb-3">
            <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Heading className="h-4 w-4 text-indigo-600" />
              Glossaire & Terminologie Métier de la Structure
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Renommez les rubriques de l'ERP pour les adapter à votre élevage (ex: vaches, porcs, poulets, lapins) ou à votre agriculture (ex: parcelles, planches, sills, pépinière).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-black text-slate-700 text-xs uppercase block">Rubriques Menu Latéral & Titres</h4>
              
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Renommer "Production Végétale"
                </label>
                <input
                  type="text"
                  value={vocabLabels.prodVegetale}
                  onChange={(e) => setVocabLabels({ ...vocabLabels, prodVegetale: e.target.value })}
                  placeholder="Ex : Maraîchage local, Cacaoculture, Grandes Cultures, Arboriculture"
                  className="w-full border rounded-lg p-2 text-xs focus:ring-1 focus:ring-indigo-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Renommer "Production Animale"
                </label>
                <input
                  type="text"
                  value={vocabLabels.prodAnimale}
                  onChange={(e) => setVocabLabels({ ...vocabLabels, prodAnimale: e.target.value })}
                  placeholder="Ex : Élevage Porcin, Cheptel Avicole, Bovins Laitiers"
                  className="w-full border rounded-lg p-2 text-xs focus:ring-1 focus:ring-indigo-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Renommer "Postes / Fonctions" (Ressources Humaines)
                </label>
                <input
                  type="text"
                  value={vocabLabels.postes || ''}
                  onChange={(e) => setVocabLabels({ ...vocabLabels, postes: e.target.value })}
                  placeholder="Ex : Métiers, Fonctions, Postes de travail"
                  className="w-full border rounded-lg p-2 text-xs focus:ring-1 focus:ring-indigo-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Renommer "Produits & Services" (Stocks/Ventillation/Ventes)
                </label>
                <input
                  type="text"
                  value={vocabLabels.produitsServices || ''}
                  onChange={(e) => setVocabLabels({ ...vocabLabels, produitsServices: e.target.value })}
                  placeholder="Ex : Articles, Marchandises, Fournitures"
                  className="w-full border rounded-lg p-2 text-xs focus:ring-1 focus:ring-indigo-500 font-bold"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-black text-slate-700 text-xs uppercase block">Entités & Items Internes</h4>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Renommer "Cultures"
                </label>
                <input
                  type="text"
                  value={vocabLabels.cultures}
                  onChange={(e) => setVocabLabels({ ...vocabLabels, cultures: e.target.value })}
                  placeholder="Ex : Pépinières, Sillons, Planches, Spécimens"
                  className="w-full border rounded-lg p-2 text-xs focus:ring-1 focus:ring-indigo-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Renommer "Animaux"
                </label>
                <input
                  type="text"
                  value={vocabLabels.animaux}
                  onChange={(e) => setVocabLabels({ ...vocabLabels, animaux: e.target.value })}
                  placeholder="Ex : Sujets, Bêtes, Têtes, Vaches, Porcs"
                  className="w-full border rounded-lg p-2 text-xs focus:ring-1 focus:ring-indigo-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Renommer "Parcelles"
                </label>
                <input
                  type="text"
                  value={vocabLabels.parcelles}
                  onChange={(e) => setVocabLabels({ ...vocabLabels, parcelles: e.target.value })}
                  placeholder="Ex : Secteurs, Blocs, Cadastres, Serres, Terrains"
                  className="w-full border rounded-lg p-2 text-xs focus:ring-1 focus:ring-indigo-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Renommer "Villes"
                </label>
                <input
                  type="text"
                  value={vocabLabels.villes || ''}
                  onChange={(e) => setVocabLabels({ ...vocabLabels, villes: e.target.value })}
                  placeholder="Ex : Communes, Wilayas, Départements, Cités"
                  className="w-full border rounded-lg p-2 text-xs focus:ring-1 focus:ring-indigo-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Renommer "Quartiers / Villages / Secteurs"
                </label>
                <input
                  type="text"
                  value={vocabLabels.quartiersVillages || ''}
                  onChange={(e) => setVocabLabels({ ...vocabLabels, quartiersVillages: e.target.value })}
                  placeholder="Ex : Districts, Douars, Hameaux, Zones"
                  className="w-full border rounded-lg p-2 text-xs focus:ring-1 focus:ring-indigo-500 font-bold"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t flex justify-end gap-3">
            <button
              onClick={() => setVocabLabels({ ...settings.customLabels })}
              className="px-4 py-2 border text-slate-650 rounded-lg text-xs hover:bg-slate-50 transition font-bold"
            >
              Annuler les modifications
            </button>
            <button
              onClick={handleSaveVocabulary}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-extrabold transition shadow-sm"
            >
              Enregistrer & Appliquer le Glossaire
            </button>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: PRIVILEGE SIMULATION CHART */}
      {activeSubTab === 'simulator' && (
        <div className="bg-white rounded-2xl border p-5 shadow-2xs space-y-4">
          <div>
            <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="h-4 w-4 text-amber-600" />
              Matrice Théorique & Synthèse des Limites du Rôle Simulé
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Voici le tableau croisé récapitulant les autorisations exactes pour le profil sélectionné : <strong>{simulatedRole.name}</strong>.
            </p>
          </div>

          <div className="border rounded-xl spill-container divide-y">
            <div className="grid grid-cols-4 bg-slate-50 p-3 text-xs font-bold text-slate-600 uppercase tracking-wide text-[10px]">
              <div className="col-span-2">Module Applicatif</div>
              <div className="text-center">Visibilité</div>
              <div className="text-center">Privilèges Opérationnels</div>
            </div>

            {availableModules.map(m => {
              const isAllowed = simulatedRole.modules.includes(m.key);
              return (
                <div key={m.key} className="grid grid-cols-4 p-3 text-xs items-center">
                  <div className="col-span-2">
                    <span className="font-bold text-slate-800 block">{m.label}</span>
                    <span className="text-[10px] text-slate-400 font-mono">Module Réf: {m.key}</span>
                  </div>
                  
                  <div className="flex justify-center">
                    {isAllowed ? (
                      <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-2.5 py-0.5 rounded-full font-bold text-[10px] flex items-center gap-1">
                        <Eye className="h-3 w-3" /> Visible
                      </span>
                    ) : (
                      <span className="bg-rose-50 border border-rose-250 text-rose-700 px-2.5 py-0.5 rounded-full font-bold text-[10px] flex items-center gap-1">
                        <EyeOff className="h-3 w-3" /> Masqué
                      </span>
                    )}
                  </div>

                  <div className="text-center text-[11px] font-semibold text-slate-500">
                    {isAllowed ? (
                      <div className="space-y-0.5">
                        <span className={`block font-bold ${simulatedRole.canModify ? 'text-emerald-700' : 'text-amber-600 font-normal'}`}>
                          • Modification : {simulatedRole.canModify ? 'Autorisé' : 'Lecture Seule'}
                        </span>
                        <span className={`block font-bold ${simulatedRole.canDelete ? 'text-red-700' : 'text-slate-400 font-normal'}`}>
                          • Suppression : {simulatedRole.canDelete ? 'Autorisé' : 'Interdit'}
                        </span>
                        <span className="block text-[10px] text-slate-400 font-normal">
                          • Import/Export : {simulatedRole.canImport ? 'Imp' : ''}{simulatedRole.canImport && simulatedRole.canExport ? '/' : ''}{simulatedRole.canExport ? 'Exp' : ''}{!simulatedRole.canImport && !simulatedRole.canExport ? 'Aucun' : ''}
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-350 italic">Aucun droit d'accès</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeSubTab === 'agri-params' && (
        <div className="space-y-8 animate-fade-in pb-10">
          
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-start gap-3">
            <span className="text-xl">🌾</span>
            <div>
              <h4 className="font-extrabold text-emerald-905 text-sm">Portail d'Administration des Données de Terrain (SYSCOHADA Révisé)</h4>
              <p className="text-xs text-emerald-700 leading-relaxed mt-0.5">
                Configurez ici les constantes de production et les substances réglementées pour les parcelles de l'exploitation. Toute modification de ces listes d'arrière-plan mettra automatiquement à jour les volets de sélection dans l'ensemble du progiciel.
              </p>
            </div>
          </div>

          {/* SECTION 1: TYPES DE CULTURE & SES INFORMATIONS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white p-5 rounded-2xl border shadow-3xs">
            <div className="lg:col-span-4 space-y-3">
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold uppercase px-2 py-0.5 rounded tracking-wider">
                Option 1 • Production Végétale
              </span>
              <h3 className="font-extrabold text-slate-800 text-sm">
                Ajouter un Type de Culture & ses Informations
              </h3>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Configurez le cycle de culture estimé, la température optimale ainsi que les tolérances géologiques des sols.
              </p>

              <form onSubmit={handleCreateTypeCulture} className="space-y-3 pt-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nom commun de la culture *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Banane Plantain Ndoki, Ananas Cayenne"
                    value={tcName}
                    onChange={(e) => setTcName(e.target.value)}
                    className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-slate-50 font-semibold text-slate-800 focus:bg-white focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Cycle estimé (jours)</label>
                    <input
                      type="number"
                      placeholder="Ex: 90"
                      value={tcCycle}
                      onChange={(e) => setTcCycle(e.target.value)}
                      className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-slate-50 font-semibold text-slate-800 focus:bg-white focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Température idéale</label>
                    <input
                      type="text"
                      placeholder="Ex: 24-29°C"
                      value={tcTemp}
                      onChange={(e) => setTcTemp(e.target.value)}
                      className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-slate-50 font-semibold text-slate-800 focus:bg-white focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Type de Sol recommandé</label>
                  <input
                    type="text"
                    placeholder="Ex: Humifère drainé lourd"
                    value={tcSol}
                    onChange={(e) => setTcSol(e.target.value)}
                    className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-slate-50 font-semibold text-slate-800 focus:bg-white focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-3xs"
                >
                  <Plus className="h-4 w-4" /> Enregistrer la Culture
                </button>
              </form>
            </div>

            <div className="lg:col-span-8 flex flex-col justify-start">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                Types de cultures enregistrées ({typesCulture.length})
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
                {typesCulture.map((tc, idx) => (
                  <div key={idx} className="p-3 bg-slate-55 border rounded-xl flex items-center justify-between text-xs hover:bg-slate-100 transition">
                    <div>
                      <span className="font-extrabold text-slate-800 block mb-0.5">🌱 {tc.split(' - ')[0]}</span>
                      {tc.includes(' - ') ? (
                        <span className="text-[10px] text-slate-500 block leading-tight">{tc.split(' - ')[1] || ''}</span>
                      ) : (
                        <span className="text-[10px] text-slate-400 italic block">Sans information complémentaire enregistrée</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION 2: CAMPAGNE AGRICOLE & SES INFORMATIONS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white p-5 rounded-2xl border shadow-3xs">
            <div className="lg:col-span-4 space-y-3">
              <span className="text-[10px] bg-indigo-100 text-indigo-800 font-extrabold uppercase px-2 py-0.5 rounded tracking-wider">
                Option 2 • Exercice Agricole
              </span>
              <h3 className="font-extrabold text-slate-800 text-sm">
                Ouvrir une nouvelle Campagne Agricole
              </h3>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Les campagnes segmentent vos activités de culture, d'intrants et de récolte pour le bilan annuel.
              </p>

              <form onSubmit={handleCreateCampagne} className="space-y-3 pt-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Code Campagne *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: CA-2026-03"
                      value={caCode}
                      onChange={(e) => setCaCode(e.target.value)}
                      className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-slate-50 font-semibold text-slate-850 focus:bg-white focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Année *</label>
                    <input
                      type="text"
                      required
                      placeholder="2026"
                      value={caAnnee}
                      onChange={(e) => setCaAnnee(e.target.value)}
                      className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-slate-50 font-semibold text-slate-850 focus:bg-white focus:outline-hidden"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Slogan ou Nom Précis *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Campagne Cotonnière Principale 2026"
                    value={caNom}
                    onChange={(e) => setCaNom(e.target.value)}
                    className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-slate-50 font-semibold text-slate-850 focus:bg-white focus:outline-hidden"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Début officiel</label>
                    <input
                      type="date"
                      value={caDebut}
                      onChange={(e) => setCaDebut(e.target.value)}
                      className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-slate-50 font-semibold text-slate-850 focus:bg-white focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Fin officielle</label>
                    <input
                      type="date"
                      value={caFin}
                      onChange={(e) => setCaFin(e.target.value)}
                      className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-slate-50 font-semibold text-slate-850 focus:bg-white focus:outline-hidden"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Statut Initial</label>
                  <select
                    value={caStatut}
                    onChange={(e) => setCaStatut(e.target.value as any)}
                    className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-slate-50 font-semibold text-slate-800 focus:bg-white focus:outline-hidden"
                  >
                    <option value="Planifiée">Planifiée (Écritures prêtes)</option>
                    <option value="En cours">En cours (Activité principale)</option>
                    <option value="Terminée">Terminée</option>
                    <option value="Archivée">Archivée (Audit SYSCOHADA)</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-3xs"
                >
                  <Plus className="h-4 w-4" /> Activer la Campagne
                </button>
              </form>
            </div>

            <div className="lg:col-span-8 flex flex-col justify-start">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                Campagnes d'activités déclarées ({campagnes.length})
              </label>
              <div className="overflow-x-auto border rounded-xl divide-y">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-55 font-semibold text-slate-500">
                    <tr>
                      <th className="p-3">Ref Code</th>
                      <th className="p-3">Désignation</th>
                      <th className="p-3 text-center">Début / Fin</th>
                      <th className="p-3 text-right">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-slate-700">
                    {campagnes.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50/50 transition">
                        <td className="p-3 font-mono font-bold text-indigo-700">{c.code}</td>
                        <td className="p-3 font-semibold text-slate-805">
                          {c.nom} <span className="text-[10px] text-slate-400 font-mono">({c.annee})</span>
                        </td>
                        <td className="p-3 text-center font-mono text-[11px] text-slate-500">
                          {c.dateDebut} &rarr; {c.dateFin}
                        </td>
                        <td className="p-3 text-right">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                            c.statut === 'En cours' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            c.statut === 'Planifiée' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                            'bg-slate-100 text-slate-600 border'
                          }`}>
                            {c.statut}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* SECTION 3: TYPES D'OPERATION & SES INFORMATIONS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white p-5 rounded-2xl border shadow-3xs">
            <div className="lg:col-span-4 space-y-3">
              <span className="text-[10px] bg-rose-100 text-rose-800 font-extrabold uppercase px-2 py-0.5 rounded tracking-wider">
                Option 3 • Actions Culturales
              </span>
              <h3 className="font-extrabold text-slate-800 text-sm">
                Type d'Opération culturale & ses Informations
              </h3>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Configurez les catégories d'opérations et outillages de protection habituellement déployés par les ouvriers.
              </p>

              <form onSubmit={handleCreateTypeOperation} className="space-y-3 pt-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Intitulé de l'Opération *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Sarclage mécanique, Pulvérisation thermique"
                    value={toName}
                    onChange={(e) => setToName(e.target.value)}
                    className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-slate-50 font-semibold text-slate-850 focus:bg-white focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Catégorie de Main d'œuvre / Niveau</label>
                  <select
                    value={toCategory}
                    onChange={(e) => setToCategory(e.target.value)}
                    className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-slate-50 font-semibold text-slate-800 focus:bg-white focus:outline-hidden"
                  >
                    <option value="Travail manuel d'entretien">Travail manuel d'entretien (Basique)</option>
                    <option value="Machinerie lourde tractorisée">Machinerie lourde tractorisée (Moyen / Avancé)</option>
                    <option value="Traitement de précision vétérinaire">Traitement chimique / Phytosanitaire</option>
                    <option value="Supervision administrative et audit">Supervision / Prélèvement test</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Équipements & Outil requis</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Houes, Tracteur MASSEY, Gants nitrile"
                    value={toOutils}
                    onChange={(e) => setToOutils(e.target.value)}
                    className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-slate-50 font-semibold text-slate-850 focus:bg-white focus:outline-hidden"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-3xs"
                >
                  <Plus className="h-4 w-4" /> Ajouter cette Opération
                </button>
              </form>
            </div>

            <div className="lg:col-span-8 flex flex-col justify-start">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                Types de travaux d'interventions disponibles ({typesOperation.length})
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
                {typesOperation.map((to, idx) => (
                  <div key={idx} className="p-3 bg-slate-55 border rounded-xl flex items-center justify-between text-xs hover:bg-slate-100 transition">
                    <div>
                      <span className="font-extrabold text-slate-800 block mb-0.5">⚙️ {to.split(' (')[0]}</span>
                      {to.includes(' (') ? (
                        <span className="text-[10px] text-slate-500 block leading-tight">
                          {to.substring(to.indexOf('('))}
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 italic block">Sans information technique complémentaire</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION 4: RESPONSABLE TERRAIN (LISTE DEROUANTE D'EMPLOYE OU PRESTATAIRE) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white p-5 rounded-2xl border shadow-3xs">
            <div className="lg:col-span-5 space-y-3">
              <span className="text-[10px] bg-amber-100 text-amber-800 font-extrabold uppercase px-2 py-0.5 rounded tracking-wider">
                Option 4 • Habilitation Terrain
              </span>
              <h3 className="font-extrabold text-slate-800 text-sm">
                Responsable de Terrain & Encadrement
              </h3>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Sélectionnez un employé ou prestataire externe déjà créé pour lui décerner un mandat de Responsable terrain.
              </p>

              <div className="bg-amber-50/50 p-2.5 rounded-lg border border-amber-200/50 space-y-1 text-[10.5px] text-amber-850">
                <span className="font-bold block text-amber-900">💡 Information Source :</span>
                Sélectionnez un profil parmi les employés (Module RH) ou prestataires enregistrés (Module Commercial).
              </div>

              <form onSubmit={handleCreateResponsableTerrain} className="space-y-3 pt-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Provenance du Responsable</label>
                  <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-lg">
                    <button
                      type="button"
                      onClick={() => {
                        setRtSource('employe');
                        if (employes.length > 0) setSelectedEmpId(employes[0].id);
                      }}
                      className={`py-1 text-center font-bold text-xs rounded transition ${
                        rtSource === 'employe' ? 'bg-white text-slate-900 shadow-3xs' : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      👤 Employé Interne
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setRtSource('prestataire');
                        if (fournisseurs.length > 0) setSelectedFournId(fournisseurs[0].id);
                      }}
                      className={`py-1 text-center font-bold text-xs rounded transition ${
                        rtSource === 'prestataire' ? 'bg-white text-slate-900 shadow-3xs' : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      🚜 Prestataire Externe
                    </button>
                  </div>
                </div>

                {rtSource === 'employe' ? (
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                      Sélectionner l'Employé *
                    </label>
                    {employes.length === 0 ? (
                      <p className="text-red-500 text-[11px] italic">Aucun employé créé dans le module RH.</p>
                    ) : (
                      <select
                        value={selectedEmpId}
                        onChange={(e) => setSelectedEmpId(e.target.value)}
                        className="w-full text-xs p-2.5 border border-slate-200 rounded-lg bg-slate-50 font-semibold text-slate-805"
                      >
                        <option value="">-- Choisir un agent --</option>
                        {employes.map(emp => (
                          <option key={emp.id} value={emp.id}>
                            👤 {emp.nom} {emp.prenom} (Poste: {emp.poste})
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                ) : (
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                      Sélectionner le Prestataire *
                    </label>
                    {fournisseurs.length === 0 ? (
                      <p className="text-red-500 text-[11px] italic">Aucun prestataire dans la base commerciale.</p>
                    ) : (
                      <select
                        value={selectedFournId}
                        onChange={(e) => setSelectedFournId(e.target.value)}
                        className="w-full text-xs p-2.5 border border-slate-200 rounded-lg bg-slate-50 font-semibold text-slate-805"
                      >
                        <option value="">-- Choisir un fournisseur --</option>
                        {fournisseurs.map(f => (
                          <option key={f.id} value={f.id}>
                            🚜 {f.raisonSociale} ({f.categorie || 'Sous-traitance'})
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={(rtSource === 'employe' && !selectedEmpId) || (rtSource === 'prestataire' && !selectedFournId)}
                  className="w-full py-2 bg-amber-600 hover:bg-amber-750 disabled:opacity-40 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-3xs"
                >
                  <Check className="h-4 w-4" /> Confirmer l'Intronisation
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 flex flex-col justify-start">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                Responsables terrain affectés ({responsablesTerrain.length})
              </label>
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {responsablesTerrain.map((rt, idx) => (
                  <div key={idx} className="p-3 bg-slate-55 border rounded-xl flex items-start justify-between text-xs hover:bg-slate-105 transition whitespace-normal">
                    <div className="flex gap-3">
                      <span className="text-lg pt-0.5">{rt.type === 'Employé' ? '👤' : '🚜'}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900">{rt.name}</span>
                          <span className={`px-1.5 py-0.2 rounded font-black text-[9px] uppercase ${
                            rt.type === 'Employé' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {rt.type}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 block mt-0.5 font-mono">{rt.info}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION 5: SUBSTANCE INTRANT ET SES INFORMATIONS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white p-5 rounded-2xl border shadow-3xs">
            <div className="lg:col-span-4 space-y-3">
              <span className="text-[10px] bg-teal-100 text-teal-800 font-extrabold uppercase px-2 py-0.5 rounded tracking-wider">
                Option 5 • Nomenclature Intrants
              </span>
              <h3 className="font-extrabold text-slate-800 text-sm">
                Ajouter une Substance Intrant & ses Informations
              </h3>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Déclarez les produits chimiques, fertilisants ou micro-organismes destinés à amender ou soigner les cultures.
              </p>

              <form onSubmit={handleCreateSubstance} className="space-y-3 pt-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nom commercial ou Chimique *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Urée Perlée 46N, Décis Forte 25"
                    value={subName}
                    onChange={(e) => setSubName(e.target.value)}
                    className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-slate-50 font-semibold text-slate-850 focus:bg-white focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nature de la Substance</label>
                  <select
                    value={subType}
                    onChange={(e) => setSubType(e.target.value)}
                    className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-slate-50 font-semibold text-slate-850 focus:bg-white focus:outline-hidden"
                  >
                    <option value="Fertilisant">Fertilisant (NPK Co, Phosphates)</option>
                    <option value="Fongicide">Fongicide (Traitement des champignons)</option>
                    <option value="Herbicide">Herbicide / Désherbant (Pré/Post-levée)</option>
                    <option value="Insecticide">Insecticide (Anti-parasites acariens)</option>
                    <option value="Amendement Organique">Amendement Organique (Compost, Fientes de volaille)</option>
                    <option value="Autre">Autre Substance bio-stimulante</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Précautions d'utilisation / Dosages</label>
                  <textarea
                    rows={2}
                    placeholder="Ex: Porter des gants de protection. Dose de 20ml par réservoir de 16L."
                    value={subDesc}
                    onChange={(e) => setSubDesc(e.target.value)}
                    className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-slate-50 font-semibold text-slate-850 focus:bg-white focus:outline-hidden"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-3xs"
                >
                  <Plus className="h-4 w-4" /> Enregistrer la Substance
                </button>
              </form>
            </div>

            <div className="lg:col-span-8 flex flex-col justify-start">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                Catalogue interne des substances & intrants de référence ({substances.length})
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
                {substances.map((s, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-55 border rounded-xl hover:bg-slate-100 transition flex flex-col justify-between text-xs whitespace-normal">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="font-black text-slate-900">🔬 {s.name}</span>
                        <span className="bg-teal-50 text-teal-700 font-extrabold px-2 py-0.2 rounded text-[9px] uppercase border border-teal-100 whitespace-nowrap">
                          {s.type}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-snug">{s.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION 6: MAILLAGE GÉOGRAPHIQUE SYSTÈME */}
          <div className="bg-white p-5 rounded-2xl border shadow-3xs space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4 gap-2">
              <div>
                <span className="text-[10px] bg-slate-100 text-slate-800 font-extrabold uppercase px-2 py-0.5 rounded tracking-wider">
                  Option 6 • Administration Territoriale
                </span>
                <h3 className="font-extrabold text-slate-800 text-sm mt-1">
                  Maillage Géographique National & Urbain
                </h3>
                <p className="text-slate-400 text-[11px]">
                  Un Pays possède plusieurs villes et districts. Une ville appartient à un et un seul pays d'origine de par ses coordonnées administratives.
                </p>
              </div>
              <div className="bg-indigo-50 border border-indigo-100 p-2 rounded-lg text-[10.5px] text-indigo-850 font-medium">
                ⚖️ <strong>Règle d'Intégrité :</strong> Cascade One-to-Many (1:N) activée de manière stricte.
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* CREATION FORM FOR COUNTRY */}
              <div className="space-y-4 bg-slate-50/50 p-4 rounded-xl border border-dotted">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🌍</span>
                  <h4 className="font-bold text-slate-705 text-xs uppercase tracking-wider">Déclarer un Pays</h4>
                </div>

                <form onSubmit={handleCreatePays} className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nom du Pays (Nom usuel) *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Cameroun, Côte d'Ivoire, Sénégal"
                      value={newPaysNom}
                      onChange={(e) => setNewPaysNom(e.target.value)}
                      className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-white font-semibold text-slate-850 focus:ring-1 focus:ring-indigo-650 focus:outline-hidden"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Code ISO (3 lettres) *</label>
                      <input
                        type="text"
                        required
                        maxLength={3}
                        placeholder="Ex: CMR, CIV, SEN"
                        value={newPaysISO}
                        onChange={(e) => setNewPaysISO(e.target.value)}
                        className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-white font-semibold text-slate-850 focus:ring-1 focus:ring-indigo-650 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Indicatif Télephonique</label>
                      <input
                        type="text"
                        placeholder="Ex: +237, +225, +221"
                        value={newPaysIndicatif}
                        onChange={(e) => setNewPaysIndicatif(e.target.value)}
                        className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-white font-semibold text-slate-850 focus:ring-1 focus:ring-indigo-650 focus:outline-hidden"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 shadow-3xs"
                  >
                    <Plus className="h-3.5 w-3.5" /> Enregistrer le Pays
                  </button>
                </form>
              </div>

              {/* CREATION FORM FOR CITY */}
              <div className="space-y-4 bg-slate-50/50 p-4 rounded-xl border border-dotted">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🏙️</span>
                  <h4 className="font-bold text-slate-705 text-xs uppercase tracking-wider">Rattacher une Ville à un Pays</h4>
                </div>

                <form onSubmit={handleCreateVille} className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Pays d'appartenance unique *</label>
                    {paysList.length === 0 ? (
                      <p className="text-red-500 text-[11px] italic">Veuillez d'abord déclarer un pays dans le formulaire de gauche.</p>
                    ) : (
                      <select
                        required
                        value={newVillePaysId}
                        onChange={(e) => setNewVillePaysId(e.target.value)}
                        className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-white font-semibold text-slate-850 focus:ring-1 focus:ring-indigo-650 focus:outline-hidden"
                      >
                        <option value="">-- Choisir le pays unique --</option>
                        {paysList.map((p) => (
                          <option key={p.id} value={p.id}>
                            🌍 {p.nom} (Code: {p.codeISO})
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nom de la Ville *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Yaoundé, Bouaké, Dakar"
                        value={newVilleNom}
                        onChange={(e) => setNewVilleNom(e.target.value)}
                        className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-white font-semibold text-slate-850 focus:ring-1 focus:ring-indigo-650 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Région / District d'attachement</label>
                      <input
                        type="text"
                        placeholder="Ex: Centre, Vallée du Bandama"
                        value={newVilleRegion}
                        onChange={(e) => setNewVilleRegion(e.target.value)}
                        className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-white font-semibold text-slate-850 focus:ring-1 focus:ring-indigo-650 focus:outline-hidden"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={paysList.length === 0}
                    className="w-full py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 shadow-3xs"
                  >
                    <Plus className="h-3.5 w-3.5" /> Rattacher cette Ville au Pays
                  </button>
                </form>
              </div>
            </div>

            {/* VISUALIZATION OF RELATIONSHIP: PAYS -> PLUSIEURS VILLES */}
            <div className="border-t pt-5 space-y-3">
              <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                Cartographie des Déploiements (Pays & Liste de leurs villes affiliées)
              </label>

              {paysList.length === 0 ? (
                <div className="p-4 bg-slate-50 border rounded-xl text-center text-xs text-slate-400 italic font-medium">
                  Aucun pays enregistré.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {paysList.map((p) => {
                    const countryCities = villesList.filter((v) => v.paysId === p.id);
                    return (
                      <div key={p.id} className="p-4 bg-slate-55 border rounded-xl space-y-3 hover:bg-slate-100 transition">
                        <div className="flex justify-between items-center border-b pb-2">
                          <span className="font-extrabold text-xs text-slate-805 flex items-center gap-1.5">
                            <span>🌍</span> {p.nom}
                            <span className="text-[10px] text-indigo-600 font-mono">({p.codeISO})</span>
                          </span>
                          <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded font-black text-slate-600 font-mono">
                            {p.indicatifTelephonique}
                          </span>
                        </div>

                        <div className="space-y-1.5">
                          <span className="block text-[9.5px] font-black text-slate-400 uppercase tracking-wider">
                            Villes Liées ({countryCities.length}) :
                          </span>
                          {countryCities.length === 0 ? (
                            <span className="text-[10px] text-slate-405 italic block pl-1">
                              Aucune ville rattachée à ce pays d'origine.
                            </span>
                          ) : (
                            <div className="flex flex-wrap gap-1.5 pl-0.5">
                              {countryCities.map((c) => (
                                <span
                                  key={c.id}
                                  className="text-[10px] font-extrabold bg-white border border-slate-200 rounded px-2 py-0.5 text-slate-600 shadow-3xs flex items-center gap-1.5"
                                  title={`Région: ${c.codeRegion || 'Non spécifiée'}`}
                                >
                                  <span>🏙️</span> {c.nom}
                                  {c.codeRegion && (
                                    <span className="text-[8px] bg-slate-105 text-slate-400 px-1 rounded font-normal">
                                      {c.codeRegion}
                                    </span>
                                  )}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      {/* NEW SUB-TAB 1: CUSTOM FIELDS EAV SYSTEM */}
      {activeSubTab === 'custom-fields' && (
        <div className="space-y-6 animate-fade-in text-xs">
          <div className="bg-slate-50 p-4.5 rounded-2xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                🔬 Métadonnées & Champs Personnalisés Virtuels (EAV Engine)
              </h3>
              <p className="text-[11px] text-slate-500">Injectez des attributs métiers sur n'importe quel module standard (Parcelles, Animaux, Collaborateurs) sans altérer physiquement le schéma relationnel SQL.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Creator Form panel */}
            <div className="bg-white rounded-2xl border p-5 space-y-4">
              <h4 className="font-bold text-slate-800 border-b pb-1.5 text-xs uppercase tracking-wider">Configurez un nouvel attribut</h4>
              <form onSubmit={(e) => {
                e.preventDefault();
                if (!newCfNom || !newCfCode) return;
                const newF: any = {
                  id: 'cf-' + Math.floor(Math.random() * 10000),
                  typeEntiteCible: newCfTarget,
                  nomChamp: newCfNom,
                  codeChamp: newCfCode.toLowerCase().replace(/[^a-z0-0_]/g, '_'),
                  typeDonnee: newCfType,
                  optionsSelection: newCfOptions ? newCfOptions.split(',').map(o => o.trim()) : undefined,
                  requis: newCfReq,
                  defaultValue: newCfDefault
                };
                setCustomFields(prev => [...prev, newF]);
                setNewCfNom('');
                setNewCfCode('');
                setNewCfDefault('');
                setNewCfOptions('');
                if (onLogAudit) onLogAudit('Config EAV', `Ajout du champ personnalisé ${newCfNom} pour l'entité ${newCfTarget}`);
              }} className="space-y-3">
                <div>
                  <label className="block text-slate-650 font-bold mb-1">Module Cible *</label>
                  <select value={newCfTarget} onChange={(e) => setNewCfTarget(e.target.value as any)} className="w-full border p-2 rounded-lg bg-white">
                    <option value="Employe">Collaborateurs (RH)</option>
                    <option value="Parcelle">Parcelles (Production Végétale)</option>
                    <option value="Animal">Animaux (Élevage)</option>
                    <option value="Article">Articles (Stocks)</option>
                    <option value="Fournisseur">Fournisseurs (Gestion Commerciale)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-655 font-bold mb-1">Libellé humain (Nom affiché) *</label>
                  <input type="text" required value={newCfNom} onChange={(e) => setNewCfNom(e.target.value)} placeholder="Ex: Risque Allergène" className="w-full border p-2 rounded-lg" />
                </div>
                <div>
                  <label className="block text-slate-655 font-bold mb-1">Code Technique Unique (Alpha-numérique_snake) *</label>
                  <input type="text" required value={newCfCode} onChange={(e) => setNewCfCode(e.target.value)} placeholder="Ex: risque_allergene" className="w-full border p-2 rounded-lg text-slate-600 font-mono" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-655 font-bold mb-1 font-semibold">Type de donnée</label>
                    <select value={newCfType} onChange={(e) => setNewCfType(e.target.value as any)} className="w-full border p-2 rounded-lg bg-white">
                      <option value="text">Texte libre</option>
                      <option value="number">Nombre décimal</option>
                      <option value="date">Sélection de Date</option>
                      <option value="boolean">Booléen (Oui/Non)</option>
                      <option value="selection">Choix multiples (Liste)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-655 font-bold mb-1 font-semibold">Valeur par défaut</label>
                    <input type="text" value={newCfDefault} onChange={(e) => setNewCfDefault(e.target.value)} placeholder="Ex: Aucune" className="w-full border p-2 rounded-lg" />
                  </div>
                </div>
                {newCfType === 'selection' && (
                  <div>
                    <label className="block text-slate-655 font-bold mb-1">Options de sélection (séparées par une virgule) *</label>
                    <input type="text" required value={newCfOptions} onChange={(e) => setNewCfOptions(e.target.value)} placeholder="Option A, Option B, Option C" className="w-full border p-2 rounded-lg" />
                  </div>
                )}
                <div className="flex items-center gap-2 py-1">
                  <input type="checkbox" id="req_f" checked={newCfReq} onChange={(e) => setNewCfReq(e.target.checked)} className="rounded" />
                  <label htmlFor="req_f" className="font-bold text-slate-650">Saisie obligatoire requise</label>
                </div>
                <button type="submit" className="w-full bg-indigo-600 text-white font-extrabold py-2.5 rounded-lg hover:bg-slate-900 cursor-pointer text-xs transition shadow-xs">
                  + Déployer l'Attribut Virtuel
                </button>
              </form>
            </div>

            {/* List panel and playground test values simulator */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Existing custom field definitions */}
              <div className="bg-white rounded-2xl border p-5">
                <h4 className="font-bold text-slate-800 border-b pb-1.5 text-xs uppercase tracking-wider mb-3 flex justify-between items-center">
                  <span>Catalogue d'Attributs Personnalisés ACTIFS</span>
                  <span className="text-[10px] font-mono bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{customFields.length} configurés</span>
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b text-slate-500 font-bold uppercase">
                      <tr>
                        <th className="p-3.5">Cible ERP</th>
                        <th className="p-3.5">Libellé / Affichage</th>
                        <th className="p-3.5">Code Système</th>
                        <th className="p-3.5">Type Stockage</th>
                        <th className="p-3.5">Défaut</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y text-slate-700">
                      {customFields.map(f => (
                        <tr key={f.id} className="hover:bg-slate-50">
                          <td className="p-3.5"><span className="bg-indigo-50 border border-indigo-150 text-indigo-850 text-[9.5px] px-2 py-0.5 rounded-md font-bold uppercase">{f.typeEntiteCible}</span></td>
                          <td className="p-3.5 font-extrabold text-slate-900">{f.nomChamp} {f.requis && <span className="text-red-500" title="Requis">*</span>}</td>
                          <td className="p-3.5 font-mono text-slate-450 font-semibold">{f.codeChamp}</td>
                          <td className="p-3.5 font-mono text-slate-600 font-bold text-[10.5px]">{f.typeDonnee}</td>
                          <td className="p-3.5 text-slate-500">{f.defaultValue || <span className="italic text-slate-350">vide</span>}</td>
                          <td className="p-3.5 text-right">
                            <button onClick={() => {
                              setCustomFields(prev => prev.filter(x => x.id !== f.id));
                              if (onLogAudit) onLogAudit('Config EAV Delete', `Suppression du champ personnalisé ${f.nomChamp}`);
                            }} className="text-red-500 hover:text-red-700 font-bold border-0 bg-transparent text-xs cursor-pointer">✕ Retirer</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Dynamic Values Playground test panel (Demonstrates real EAV data association) */}
              <div className="bg-[#fafafa] border rounded-2xl p-5 space-y-4">
                <div>
                  <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1">
                    🎯 Aire de Simulation d'Association de Valeurs Dynamiques
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Saisissez des mesures ou valeurs fictives sur vos pièces physiques pour tester la persistance EAV.</p>
                </div>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (!testCfDefId || !testCfEntityId || !testCfValue) return;
                  const newVal = {
                    id: 'cfv-' + Math.floor(Math.random() * 10000),
                    idDefinitionChamp: testCfDefId,
                    idEntiteInstance: testCfEntityId,
                    valeurTextuelle: testCfValue
                  };
                  setCustomFieldValues(prev => [...prev, newVal]);
                  setTestCfValue('');
                }} className="grid grid-cols-1 md:grid-cols-4 gap-2.5 items-end">
                  <div>
                    <label className="block text-slate-655 font-bold mb-1">Attribut Virtuel *</label>
                    <select value={testCfDefId} onChange={(e) => setTestCfDefId(e.target.value)} className="w-full border p-1 py-1.8 bg-white text-[11px] rounded-lg">
                      <option value="">Sélectionner...</option>
                      {customFields.map(cf => (
                        <option key={cf.id} value={cf.id}>[{cf.typeEntiteCible}] - {cf.nomChamp}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-655 font-bold mb-1">Réf / Id de la Fiche *</label>
                    <input type="text" required value={testCfEntityId} onChange={(e) => setTestCfEntityId(e.target.value)} placeholder="Ex: emp-1, par-2..." className="w-full border p-1 py-1.8 text-[11px] rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-slate-655 font-bold mb-1">Valeur à enregistrer *</label>
                    <input type="text" required value={testCfValue} onChange={(e) => setTestCfValue(e.target.value)} placeholder="Valeur" className="w-full border p-1 py-1.8 text-[11px] rounded-lg" />
                  </div>
                  <button type="submit" className="w-full bg-[#1c1c1c] text-white font-black py-2 rounded-lg text-xs hover:bg-slate-700 border-0 cursor-pointer">
                    + Sauvegarder
                  </button>
                </form>

                {/* Values table logs */}
                {customFieldValues.length > 0 && (
                  <div className="bg-white border rounded-xl overflow-hidden text-xs">
                    <div className="p-2.5 bg-slate-50 font-bold border-b text-[10px] text-slate-500 uppercase tracking-wider">Valeurs EAV injectées dans le catalogue</div>
                    <div className="divide-y max-h-40 overflow-y-auto">
                      {customFieldValues.map(cfv => {
                        const def = customFields.find(cf => cf.id === cfv.idDefinitionChamp);
                        return (
                          <div key={cfv.id} className="p-3.5 flex justify-between items-center hover:bg-slate-50">
                            <div>
                              <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-1.5 py-0.2 rounded border uppercase font-mono mr-2">{def?.typeEntiteCible || 'Inconnu'}</span>
                              <span className="font-extrabold text-slate-900 pr-1">{def?.nomChamp || cfv.idDefinitionChamp}</span>
                              <span className="text-slate-400 font-mono text-[10px]">(Fiche : {cfv.idEntiteInstance})</span>
                            </div>
                            <div className="font-black text-indigo-700 bg-indigo-50 border border-indigo-150 px-2.5 py-0.5 rounded text-[11px]">
                              {cfv.valeurTextuelle}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>
      )}

      {/* NEW SUB-TAB 2: CUSTOM ENTITIES & TABLES DEFINITION ENGINE */}
      {activeSubTab === 'custom-entities' && (
        <div className="space-y-6 animate-fade-in text-xs">
          
          <div className="bg-slate-50 p-4.5 rounded-2xl border">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
              🏗️ Concepteur d'Entités & Maquetage de Tables Personnalisées (Custom Classes)
            </h3>
            <p className="text-[11px] text-slate-500 mt-1">Concevez des structures de données entièrement nouvelles pour vos besoins spécifiques d'exploitation (contrôles climatiques, audits, suivi de CO2, rapports d'aleas).</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Form Creators for dynamic blueprints */}
            <div className="space-y-6">
              
              {/* Step 1 : Defining dynamic class blueprint schema */}
              <div className="bg-white rounded-2xl border p-5 space-y-4">
                <h4 className="font-bold text-slate-800 text-xs border-b pb-1.5 uppercase tracking-wider">Étape 1 : Créer une Table Personnalisée</h4>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (!newCeNom || !newCeCode) return;
                  const newCE = {
                    id: 'ce-' + Math.floor(Math.random() * 10000),
                    nomUnique: newCeNom,
                    codeDefinition: newCeCode.toLowerCase().replace(/[^a-z0-0_]/g, '_'),
                    description: newCeDesc
                  };
                  setCustomEntities(prev => [...prev, newCE]);
                  setNewCeNom('');
                  setNewCeCode('');
                  setNewCeDesc('');
                  if (onLogAudit) onLogAudit('Dynamic Engine', `Création de l'entité dynamique ${newCeNom}`);
                }} className="space-y-3">
                  <div>
                    <label className="block text-slate-655 font-bold mb-1">Nom de la table (ex : Audit Biomasse) *</label>
                    <input type="text" required value={newCeNom} onChange={(e) => setNewCeNom(e.target.value)} placeholder="Rapport de Météorologie" className="w-full border p-2 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-slate-655 font-bold mb-1">Code Technique Système (Alpha-numérique_snake) *</label>
                    <input type="text" required value={newCeCode} onChange={(e) => setNewCeCode(e.target.value)} placeholder="rapport_meteo_custom" className="w-full border p-2 rounded-lg font-mono text-slate-600" />
                  </div>
                  <div>
                    <label className="block text-slate-655 font-bold mb-1">Description d’usage</label>
                    <textarea value={newCeDesc} onChange={(e) => setNewCeDesc(e.target.value)} rows={2} placeholder="Sert au relevé des forces des rafales de vents..." className="w-full border p-2 rounded-lg" />
                  </div>
                  <button type="submit" className="w-full bg-indigo-600 text-white font-extrabold py-2.5 rounded-lg text-xs hover:bg-slate-900 shadow-xs cursor-pointer border-0">
                    + Construire le Blueprint de Table
                  </button>
                </form>
              </div>

              {/* Step 2 : Add fields / attributes to this table definition */}
              {customEntities.length > 0 && (
                <div className="bg-white rounded-2xl border p-5 space-y-4">
                  <h4 className="font-bold text-slate-800 text-xs border-b pb-1.5 uppercase tracking-wider">Étape 2 : Ajouter des Attributs / Colonnes</h4>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    if (!newCaCeId || !newCaNom || !newCaCode) return;
                    const newAttr = {
                      id: 'ca-' + Math.floor(Math.random() * 10000),
                      idDefinitionEntite: newCaCeId,
                      nomAttribut: newCaNom,
                      codeAttribut: newCaCode.toLowerCase().replace(/[^a-z0-0_]/g, '_'),
                      typeAttribut: newCaType,
                      requis: newCaReq
                    };
                    setCustomEntityAttrs(prev => [...prev, newAttr]);
                    setNewCaNom('');
                    setNewCaCode('');
                    if (onLogAudit) onLogAudit('Dynamic Attr Engine', `Ajout de la colonne ${newCaNom} pour l'entité ${newCaCeId}`);
                  }} className="space-y-3">
                    <div>
                      <label className="block text-slate-655 font-bold mb-1">Table Cible *</label>
                      <select value={newCaCeId} onChange={(e) => setNewCaCeId(e.target.value)} className="w-full border p-2 rounded-lg bg-white">
                        {customEntities.map(ce => <option key={ce.id} value={ce.id}>{ce.nomUnique}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-655 font-bold mb-1">Nom de la Colonne / Attribut *</label>
                      <input type="text" required value={newCaNom} onChange={(e) => setNewCaNom(e.target.value)} placeholder="Densité Humidité Sols" className="w-full border p-2 rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-slate-655 font-bold mb-1">Code Système Unique *</label>
                      <input type="text" required value={newCaCode} onChange={(e) => setNewCaCode(e.target.value)} placeholder="humid_sol_solids" className="w-full border p-2 rounded-lg font-mono text-slate-605" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-slate-655 font-semibold font-bold mb-1">Type de donnée</label>
                        <select value={newCaType} onChange={(e) => setNewCaType(e.target.value as any)} className="w-full border p-2 bg-white rounded-lg">
                          <option value="text">Texte libre</option>
                          <option value="number">Décimal / Entier</option>
                          <option value="date">Calendrier / Date</option>
                          <option value="boolean">Booléen (Oui/Non)</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-1.5 pt-4">
                        <input type="checkbox" id="re_ca" checked={newCaReq} onChange={(e) => setNewCaReq(e.target.checked)} className="rounded" />
                        <label htmlFor="re_ca" className="font-bold text-slate-500">Requis</label>
                      </div>
                    </div>
                    <button type="submit" className="w-full bg-[#1b1b1b] text-white font-extrabold py-2 rounded-lg hover:bg-slate-700 border-0 cursor-pointer">
                      + Déposer la Colonne / Attribut
                    </button>
                  </form>
                </div>
              )}

            </div>

            {/* Displaying structural designs & instance registrations */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Blueprints and structural tables tree visualization */}
              <div className="bg-white rounded-2xl border p-5">
                <h4 className="font-bold text-slate-800 border-b pb-1.5 text-xs text-slate-500 uppercase tracking-widest mb-3">Structures de Tables Conceptuelles Actives</h4>
                {customEntities.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 italic">Aucune entité personnalisée configurée. Concevez-en une à gauche.</div>
                ) : (
                  <div className="space-y-4">
                    {customEntities.map(ce => {
                      const ceAttrs = customEntityAttrs.filter(ca => ca.idDefinitionEntite === ce.id);
                      return (
                        <div key={ce.id} className="p-4 bg-slate-50 rounded-xl border space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                                🏗️ {ce.nomUnique}
                                <span className="font-mono text-[9px] text-indigo-700 bg-indigo-50 border border-indigo-150 px-1.5 py-0.2 rounded uppercase">
                                  {ce.codeDefinition}
                                </span>
                              </h5>
                              <p className="text-[10px] text-slate-400 font-medium italic mt-0.5">"{ce.description || 'Pas de description description.'}"</p>
                            </div>
                            <button onClick={() => {
                              setCustomEntities(prev => prev.filter(x => x.id !== ce.id));
                              setCustomEntityAttrs(prev => prev.filter(x => x.idDefinitionEntite !== ce.id));
                            }} className="text-red-500 hover:text-red-700 font-extrabold text-[10.5px] border-0 bg-transparent cursor-pointer">Retirer la table</button>
                          </div>

                          <div className="flex flex-wrap gap-1.5 pt-1.5 border-t border-dashed">
                            <span className="text-[9.5px] font-bold text-slate-400 pt-0.5 uppercase">Colonnes : </span>
                            {ceAttrs.map(attr => (
                              <span key={attr.id} className="text-[10px] bg-white border border-slate-205 rounded px-2 py-0.5 font-bold text-slate-700 flex items-center gap-1">
                                {attr.nomAttribut}
                                <span className="text-[8px] bg-slate-100 text-slate-400 px-1 rounded font-mono font-normal">({attr.typeAttribut})</span>
                              </span>
                            ))}
                            {ceAttrs.length === 0 && (
                              <span className="text-[10px] text-amber-600 font-bold italic pt-0.5">Aucun attribut configuré. Ajoutez-en via l'Étape 2!</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Dynamic Instance creation and table display (The final dynamic records evidence) */}
              {customEntities.length > 0 && (
                <div className="bg-white rounded-2xl border p-5 space-y-4">
                  <h4 className="font-bold text-indigo-800 text-xs uppercase tracking-wider">✍️ Injecter une Ligne de Données dans une Table Virtuelle</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 bg-slate-50 p-4 rounded-xl text-xs">
                    <div>
                      <label className="block text-slate-655 font-bold mb-1">Sélectionner la Table *</label>
                      <select value={newCeiCeId} onChange={(e) => {
                        setNewCeiCeId(e.target.value);
                        setNewCeiVals({});
                      }} className="w-full bg-white border p-2 rounded-lg">
                        {customEntities.map(ce => <option key={ce.id} value={ce.id}>{ce.nomUnique}</option>)}
                      </select>
                    </div>

                    <div className="space-y-2.5">
                      <label className="block text-slate-600 font-bold">Valeur des attributs :</label>
                      {customEntityAttrs.filter(ca => ca.idDefinitionEntite === newCeiCeId).map(ca => (
                        <div key={ca.id} className="flex items-center gap-2 text-xs">
                          <span className="w-28 truncate font-medium text-slate-705">{ca.nomAttribut} {ca.requis && '*'}</span>
                          <input
                            type={ca.typeAttribut === 'number' ? 'number' : ca.typeAttribut === 'date' ? 'date' : 'text'}
                            required={ca.requis}
                            value={newCeiVals[ca.codeAttribut] || ''}
                            onChange={(e) => setNewCeiVals(prev => ({ ...prev, [ca.codeAttribut]: e.target.value }))}
                            placeholder="Saisissez la valeur..."
                            className="bg-white border rounded p-1 grow text-xs"
                          />
                        </div>
                      ))}

                      <div className="pt-2 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            if (!newCeiCeId) return;
                            const newIns = {
                              id: 'cei-' + Math.floor(Math.random() * 10000),
                              idDefinitionEntite: newCeiCeId,
                              datePlanification: new Date().toISOString().split('T')[0],
                              valeursAttributes: newCeiVals,
                              auteur: 'Super Admin'
                            };
                            setCustomEntityInstances(prev => [...prev, newIns]);
                            setNewCeiVals({});
                            if (onLogAudit) onLogAudit('Dynamic Engine Insert', `Nouvelle ligne de rapport injectée dans ${newCeiCeId}`);
                          }}
                          className="bg-indigo-600 text-white font-extrabold px-3 py-1.5 rounded text-[11px] hover:bg-slate-900 cursor-pointer border-0"
                        >
                          Enregistrer la ligne
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Registered Records Instances Table view */}
                  <div className="space-y-2 text-xs">
                    <span className="font-bold text-slate-500 uppercase text-[10px] tracking-wider block">Lignes de Données Enregistrées</span>
                    <div className="space-y-2">
                      {customEntityInstances.map(ins => {
                        const ce = customEntities.find(x => x.id === ins.idDefinitionEntite);
                        const attrs = customEntityAttrs.filter(a => a.idDefinitionEntite === ins.idDefinitionEntite);
                        if (!ce) return null;
                        return (
                          <div key={ins.id} className="bg-slate-50/70 hover:bg-slate-50 border p-3 rounded-lg relative">
                            <span className="absolute top-2.5 right-2 text-[9px] bg-slate-205 border px-1.5 py-0.2 rounded-full font-mono text-slate-500">
                              Ligne : {ins.id}
                            </span>
                            <div className="font-extrabold text-slate-900 text-[11px]">{ce.nomUnique}</div>
                            <div className="text-[9.5px] text-slate-400 font-medium">Saisie le {ins.datePlanification} par {ins.auteur}</div>
                            
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 mt-2 bg-white/70 p-2 rounded-md border border-dashed text-[10.5px]">
                              {attrs.map(a => (
                                <div key={a.id} className="text-[10px]">
                                  <span className="font-bold text-slate-405 uppercase text-[9px]">{a.nomAttribut} : </span>
                                  <span className="font-bold text-indigo-700">{ins.valeursAttributes[a.codeAttribut] || <span className="text-slate-300 italic">indéfini</span>}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                      {customEntityInstances.length === 0 && (
                        <div className="p-4 text-center text-slate-450 italic">Aucune donnée n'a été injectée dans les tables virtuelles.</div>
                      )}
                    </div>
                  </div>

                </div>
              )}

            </div>

          </div>

        </div>
      )}

      {/* NEW SUB-TAB 3: AUDIT TRAIL LOGS */}
      {activeSubTab === 'audit-logs' && (
        <div className="space-y-4 animate-fade-in text-xs">
          <div className="bg-slate-50 p-4.5 rounded-2xl border">
            <h3 className="font-extrabold text-slate-950 text-sm flex items-center gap-1.5">
              📋 Piste de Vérification & Registres d'Audit de Sécurité
            </h3>
            <p className="text-[11px] text-slate-500 mt-1">Trace horodatée de toutes les transactions sensibles de l'exploitation (connexions, modifications, calculs de paie, validation de GED).</p>
          </div>

          <div className="bg-white border rounded-2xl p-5 shadow-2xs">
            <div className="flex justify-between items-center pb-3 border-b mb-4">
              <span className="font-bold text-slate-700">Audit Trail Journal</span>
              <span className="bg-slate-100 text-slate-505 font-mono px-3 py-1 rounded-full text-[10px]">Tenant ID actif : {tenantId}</span>
            </div>

            <div className="overflow-x-auto border rounded-xl bg-[#fafafa]">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b text-slate-500 font-bold uppercase">
                  <tr>
                    <th className="p-3">Horodatage</th>
                    <th className="p-3">Utilisateur</th>
                    <th className="p-3">Secteur / Domaine</th>
                    <th className="p-3">Incident / Action Opérée</th>
                    <th className="p-3 text-right">Statut ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-slate-700">
                  {/* Pull dynamically populated audit logs */}
                  {(auditLogs && auditLogs.length > 0) ? auditLogs.map((log: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50 transition">
                      <td className="p-3 font-mono font-bold text-slate-450">{log.date || '2026-06-18 10:14'}</td>
                      <td className="p-3 font-extrabold text-slate-900">{log.user || 'Michel Tchanga (Super Admin)'}</td>
                      <td className="p-3">
                        <span className="bg-indigo-50 border border-indigo-150 text-indigo-805 text-[9px] font-bold uppercase px-2 py-0.5 rounded">
                          {log.module || 'ADMINISTRATION'}
                        </span>
                      </td>
                      <td className="p-3 text-slate-800 font-medium">{log.action || log.description}</td>
                      <td className="p-3 text-right">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                          COMPLÉTÉ
                        </span>
                      </td>
                    </tr>
                  )) : (
                    // Default fallback simulations
                    <>
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 font-mono text-slate-400">2026-06-18 10:48</td>
                        <td className="p-3 font-extrabold text-slate-900">Michel Tchanga</td>
                        <td className="p-3"><span className="bg-indigo-50 border border-indigo-150 text-indigo-850 text-[9px] font-bold uppercase px-2 py-0.5 rounded">PAIE MOTEUR</span></td>
                        <td className="p-3 text-slate-800 font-semibold font-medium">Calcul de bulletin de paie de juin 2026 complété (Employé: Diallo Amadou)</td>
                        <td className="p-3 text-right"><span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800">ENREGISTRÉ</span></td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 font-mono text-slate-400">2026-06-18 09:12</td>
                        <td className="p-3 font-extrabold text-slate-900">Jean-Pierre Ondoa</td>
                        <td className="p-3"><span className="bg-indigo-50 border border-indigo-150 text-indigo-850 text-[9px] font-bold uppercase px-2 py-0.5 rounded">GED_SECURE</span></td>
                        <td className="p-3 text-slate-800 font-semibold font-medium">Nouvelle révision v2 déposée sur Analyse_PhysicoChimique_Sol_Parcelle_N1.pdf</td>
                        <td className="p-3 text-right"><span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800">ENREGISTRÉ</span></td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 font-mono text-slate-400">2026-06-18 08:35</td>
                        <td className="p-3 font-extrabold text-slate-900">Michel Tchanga</td>
                        <td className="p-3"><span className="bg-indigo-50 border border-indigo-150 text-indigo-850 text-[9px] font-bold uppercase px-2 py-0.5 rounded">COMPTABILITÉ</span></td>
                        <td className="p-3 text-slate-800 font-semibold font-medium">Génération écriture automatique de salaire - Journal des charges personnel (SYSCOHADA OD)</td>
                        <td className="p-3 text-right"><span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800">ENREGISTRÉ</span></td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
