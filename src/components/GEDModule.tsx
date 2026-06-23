/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { FichierDocument, DocumentVersion, DocumentWorkflow, DocumentSignature, DocumentLink, Employe, Parcelle, Animal, FactureClient } from '../types';
import {
  FolderOpen,
  FileText,
  Search,
  PlusCircle,
  Tag,
  Download,
  Share2,
  Lock,
  UploadCloud,
  ChevronRight,
  Database,
  Link,
  History,
  CheckCircle2,
  XCircle,
  Clock,
  Key,
  Paperclip,
  Check,
  Send,
  Trash2,
  FileSignature
} from 'lucide-react';

interface GEDModuleProps {
  documents: FichierDocument[];
  onAddDocument: (doc: FichierDocument) => void;
  // Fallbacks provided inside module for dynamic properties
}

export default function GEDModule({ documents, onAddDocument }: GEDModuleProps) {
  // Folder tree select
  const [selectedFolder, setSelectedFolder] = useState<string>('Tous');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Active tenant retrieval
  const getTenantId = () => {
    try {
      const saved = localStorage.getItem('activeTenant');
      if (saved) {
        return JSON.parse(saved).id || 'client-1';
      }
    } catch (e) {}
    return 'client-1';
  };
  const tenantId = getTenantId();

  const getEmployeeName = (empId: string) => {
    try {
      const saved = localStorage.getItem(`ka_employes_${tenantId}`);
      if (saved) {
        const list = JSON.parse(saved);
        const emp = list.find((e: any) => e.id === empId);
        if (emp) return `${emp.prenom} ${emp.nom}`;
      }
    } catch (e) {}
    if (empId === 'emp-1') return 'Dr. Amadou Diallo';
    if (empId === 'emp-2') return 'Therèse Alima';
    if (empId === 'emp-3') return 'Oumarou Sanda';
    return empId;
  };

  // Multi-tenant scoped states for GED extensions
  const [versions, setVersions] = useState<DocumentVersion[]>(() => {
    const key = `ka_ged_versions_${tenantId}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    // Prefabricated starting versions correspond to existing mock files
    return [
      { id: 'v-1', idDocument: 'doc-1', version: 1, dateCreation: '2019-04-15', nomFichier: 'Autorisation_Exploitation_Obala_Prefet_v1.pdf', tailleMo: 2.4, urlFictive: '#', auteur: 'M. Tchanga', commentaire: 'Version originale approuvée par la préfecture.' },
      { id: 'v-2', idDocument: 'doc-2', version: 1, dateCreation: '2026-03-05', nomFichier: 'Analyse_PhysicoChimique_Sol_Parcelle_N1_v1.pdf', tailleMo: 4.1, urlFictive: '#', auteur: 'Ondoa Jean-Pierre', commentaire: 'Analyse de référence sols Obala.' },
      { id: 'v-3', idDocument: 'doc-3', version: 1, dateCreation: '2023-01-15', nomFichier: 'Contrat_CDI_Dr_Amadou_Diallo_Signe.pdf', tailleMo: 1.8, urlFictive: '#', auteur: 'SaaS Admin', commentaire: 'Contrat paraphé de Dr. Diallo.' },
      { id: 'v-4', idDocument: 'doc-4', version: 1, dateCreation: '2026-05-18', nomFichier: 'Certificat_Vaccination_Bovin_Ministere_v1.pdf', tailleMo: 0.9, urlFictive: '#', auteur: 'Dr. Amadou Diallo', commentaire: 'Carnet de l’année courante.' }
    ];
  });

  const [workflows, setWorkflows] = useState<DocumentWorkflow[]>(() => {
    const key = `ka_ged_workflows_${tenantId}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: 'w-1', idDocument: 'doc-1', etapeActuelle: 'Approuvé', dateSoumission: '2019-04-15', approbateurCible: 'Super Admin', dateValidation: '2019-04-16', commentaireDecision: 'Autorisation conforme et valide.' },
      { id: 'w-2', idDocument: 'doc-2', etapeActuelle: 'Approuvé', dateSoumission: '2026-03-05', approbateurCible: 'Vétérinaire Senior', dateValidation: '2026-03-06', commentaireDecision: 'pH adéquat pour cultures racines.' },
      { id: 'w-3', idDocument: 'doc-3', etapeActuelle: 'Approuvé', dateSoumission: '2023-01-15', approbateurCible: 'Super Admin', dateValidation: '2023-01-15', commentaireDecision: 'CDI enregistré.' },
      { id: 'w-4', idDocument: 'doc-4', etapeActuelle: 'Brouillon', approbateurCible: 'Dr. Diallo' }
    ];
  });

  const [signatures, setSignatures] = useState<DocumentSignature[]>(() => {
    const key = `ka_ged_signatures_${tenantId}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: 's-1', idDocument: 'doc-1', signataire: 'Michel Tchanga', roleSignataire: 'Promoteur Principal', dateHeure: '2019-04-16 11:24', statutSignature: 'Signé', empreinteNumerique: 'a2f98bbcd7612c88f9e0134eaec11200fce9d2' }
    ];
  });

  const [links, setLinks] = useState<DocumentLink[]>(() => {
    const key = `ka_ged_links_${tenantId}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    // Prefabricated links connecting documents to system entities polymorphically!
    return [
      { id: 'l-1', idDocument: 'doc-2', typeEntite: 'Parcelle', idEntite: 'par-1', dateLiaison: '2026-03-05', note: 'Associe à la parcelle principale maraîchère.' },
      { id: 'l-2', idDocument: 'doc-3', typeEntite: 'Employe', idEntite: 'emp-1', dateLiaison: '2023-01-15', note: 'Dossier social du médecin vétérinaire.' },
      { id: 'l-3', idDocument: 'doc-4', typeEntite: 'Animal', idEntite: 'an-1', dateLiaison: '2026-05-18', note: 'Vaccination bovin.' }
    ];
  });

  // Pull auxiliary lists from local storage for polymorphic select linkages
  const [employeesList, setEmployeesList] = useState<Employe[]>([]);
  const [parcellesList, setParcellesList] = useState<Parcelle[]>([]);

  useEffect(() => {
    localStorage.setItem(`ka_ged_versions_${tenantId}`, JSON.stringify(versions));
  }, [versions, tenantId]);

  useEffect(() => {
    localStorage.setItem(`ka_ged_workflows_${tenantId}`, JSON.stringify(workflows));
  }, [workflows, tenantId]);

  useEffect(() => {
    localStorage.setItem(`ka_ged_signatures_${tenantId}`, JSON.stringify(signatures));
  }, [signatures, tenantId]);

  useEffect(() => {
    localStorage.setItem(`ka_ged_links_${tenantId}`, JSON.stringify(links));
  }, [links, tenantId]);

  // Load target lists to build polymorphic select dropdown lists
  useEffect(() => {
    try {
      const activeDbRaw = localStorage.getItem(`ka_databases`);
      if (activeDbRaw) {
        const full = JSON.parse(activeDbRaw);
        const activePart = full[tenantId];
        if (activePart) {
          if (activePart.employes) setEmployeesList(activePart.employes);
          if (activePart.parcelles) setParcellesList(activePart.parcelles);
        }
      }
    } catch (e) {
      console.warn('Failed to retrieve secondary lists from storage partitions', e);
    }
  }, [tenantId]);

  // Selected document context drawer
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const activeDocument = documents.find(d => d.id === selectedDocId);

  // Upload Simulator states
  const [isDragging, setIsDragging] = useState(false);
  const [newDocNom, setNewDocNom] = useState('');
  const [newDocCat, setNewDocCat] = useState<FichierDocument['categorie']>('Agricole');
  const [newDocTags, setNewDocTags] = useState('Sols, PH');

  // New Version states
  const [newVerFile, setNewVerFile] = useState('');
  const [newVerComment, setNewVerComment] = useState('');

  // Polymorphic link form states
  const [linkTargetType, setLinkTargetType] = useState<'Employe' | 'Parcelle' | 'Animal' | 'FactureClient'>('Employe');
  const [linkTargetId, setLinkTargetId] = useState('');
  const [linkNotes, setLinkNotes] = useState('');

  // Workflow states
  const [wfApprover, setWfApprover] = useState('Super Admin');
  const [wfDecisionComment, setWfDecisionComment] = useState('');

  useEffect(() => {
    // Set default target link option when target list registers
    if (linkTargetType === 'Employe' && employeesList.length > 0) {
      setLinkTargetId(employeesList[0].id);
    } else if (linkTargetType === 'Parcelle' && parcellesList.length > 0) {
      setLinkTargetId(parcellesList[0].id);
    }
  }, [linkTargetType, employeesList, parcellesList]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      simulateFileUpload(droppedFile.name);
    }
  };

  const handleManualUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocNom) return;
    simulateFileUpload(newDocNom);
  };

  const simulateFileUpload = (fileName: string) => {
    const formattedTags = newDocTags.split(',').map(t => t.trim()).filter(Boolean);
    const docId = 'doc-' + Math.floor(Math.random() * 10000);
    const cleanedFileName = fileName.endsWith('.pdf') ? fileName : fileName + '.pdf';
    
    // 1. Save global file entry
    const newDoc: FichierDocument = {
      id: docId,
      nom: cleanedFileName,
      categorie: newDocCat,
      tailleMo: +(1.2 + Math.random() * 3).toFixed(1),
      dateImport: new Date().toISOString().split('T')[0],
      indexationTags: formattedTags,
      urlFictive: '#',
      auteur: 'Super Admin',
      arborescence: `Entreprise/${newDocCat}`
    };
    onAddDocument(newDoc);

    // 2. Initialize version trace
    const newVer: DocumentVersion = {
      id: 'v-' + Math.floor(Math.random() * 10000),
      idDocument: docId,
      version: 1,
      dateCreation: newDoc.dateImport,
      nomFichier: cleanedFileName,
      tailleMo: newDoc.tailleMo,
      urlFictive: '#',
      auteur: newDoc.auteur,
      commentaire: 'Dépôt initial par dépose rapide.'
    };
    setVersions(prev => [...prev, newVer]);

    // 3. Initialize default workflow
    const newWf: DocumentWorkflow = {
      id: 'w-' + Math.floor(Math.random() * 10000),
      idDocument: docId,
      etapeActuelle: 'Brouillon',
      approbateurCible: 'Super Admin'
    };
    setWorkflows(prev => [...prev, newWf]);

    setNewDocNom('');
    setSelectedDocId(docId); // Focus on uploaded document
  };

  // Add a new revision (non-destructive version increment)
  const handleAddRevisionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDocId || !newVerFile) return;

    // Retrieve highest active version count for this doc id
    const docVers = versions.filter(v => v.idDocument === selectedDocId);
    const topVersionNo = docVers.reduce((acc, curr) => curr.version > acc ? curr.version : acc, 1);
    const nextVerNo = topVersionNo + 1;

    const newVer: DocumentVersion = {
      id: 'v-' + Math.floor(Math.random() * 10000),
      idDocument: selectedDocId,
      version: nextVerNo,
      dateCreation: new Date().toISOString().split('T')[0],
      nomFichier: newVerFile.endsWith('.pdf') ? newVerFile : newVerFile + '.pdf',
      tailleMo: +(1.2 + Math.random() * 2).toFixed(1),
      urlFictive: '#',
      auteur: 'Super Admin',
      commentaire: newVerComment || `Mise à jour incrémentale v${nextVerNo}.`
    };

    setVersions(prev => [...prev, newVer]);
    setNewVerFile('');
    setNewVerComment('');
  };

  // Attach polymorphic link
  const handleAttachLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDocId || !linkTargetId) return;

    const newLnk: DocumentLink = {
      id: 'lnk-' + Math.floor(Math.random() * 10000),
      idDocument: selectedDocId,
      typeEntite: linkTargetType,
      idEntite: linkTargetId,
      dateLiaison: new Date().toISOString().split('T')[0],
      note: linkNotes
    };

    setLinks(prev => [...prev, newLnk]);
    setLinkNotes('');
  };

  const handleRemoveLink = (lnkId: string) => {
    setLinks(prev => prev.filter(l => l.id !== lnkId));
  };

  // Workflow processing steps (submit, approve, reject, sign)
  const handleWorkflowSubmit = () => {
    if (!selectedDocId) return;
    setWorkflows(prev => prev.map(w => w.idDocument === selectedDocId ? {
      ...w,
      etapeActuelle: 'En attente de revue',
      dateSoumission: new Date().toISOString().split('T')[0],
      approbateurCible: wfApprover
    } : w));
  };

  const handleWorkflowDecide = (status: 'Approuvé' | 'Rejeté') => {
    if (!selectedDocId) return;
    setWorkflows(prev => prev.map(w => w.idDocument === selectedDocId ? {
      ...w,
      etapeActuelle: status,
      dateValidation: new Date().toISOString().split('T')[0],
      commentaireDecision: wfDecisionComment || `Approuvé sans réserve par le validateur.`
    } : w));
    setWfDecisionComment('');
  };

  // Digially Sign Document
  const handleSignDocument = () => {
    if (!selectedDocId) return;
    const keyFingerprint = 'sig-' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const newSig: DocumentSignature = {
      id: 's-' + Math.floor(Math.random() * 10000),
      idDocument: selectedDocId,
      signataire: 'Michel Tchanga',
      roleSignataire: 'Super Admin',
      dateHeure: new Date().toISOString().replace('T', ' ').substring(0, 16),
      statutSignature: 'Signé',
      empreinteNumerique: keyFingerprint
    };
    setSignatures(prev => [...prev, newSig]);
  };

  // Compile active tags in database for tag filtering options
  const allTags = Array.from(new Set(documents.flatMap(d => d.indexationTags)));

  // Folder directories hierarchy
  const folders = [
    { label: 'Tous les dossiers', path: 'Tous' },
    { label: 'Entreprise/Administration', path: 'Entreprise/Administration' },
    { label: 'Entreprise/Agriculture', path: 'Entreprise/Agriculture' },
    { label: 'Entreprise/Élevage', path: 'Entreprise/Élevage' },
    { label: 'Entreprise/RH', path: 'Entreprise/RH' },
    { label: 'Entreprise/Comptabilité', path: 'Entreprise/Financier' }
  ];

  // Filtering documents
  const filteredDocs = documents.filter(d => {
    const matchesSearch = d.nom.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          d.indexationTags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFolder = selectedFolder === 'Tous' || d.arborescence.startsWith(selectedFolder) || d.categorie === selectedFolder;
    const matchesTag = !selectedTag || d.indexationTags.includes(selectedTag);

    return matchesSearch && matchesFolder && matchesTag;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Module Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2 tracking-tight">
            <FolderOpen className="text-indigo-600 h-7 w-7" />
            Gestion Électronique des Documents (GED) & Traçabilité
          </h2>
          <p className="text-xs text-slate-500">
            Coffre-fort d'archivage des analyses de sols, carnets vétérinaires, et factures. Association polymorphique d’entités, workflows d'approbations et audit de versions intégrés.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Side: Directory navigation panel */}
        <div className="space-y-4">
          <div className="bg-slate-50 border rounded-2xl p-4 space-y-3.5 shadow-2xs">
            <h3 className="font-bold text-slate-700 text-xs uppercase tracking-wider flex items-center gap-1.5 border-b pb-2">
              <Database className="h-4 w-4 text-indigo-600" />
              Classement hiérarchique
            </h3>
            <ul className="text-xs space-y-1">
              {folders.map(f => (
                <li key={f.path}>
                  <button
                    onClick={() => { setSelectedFolder(f.path); setSelectedTag(null); }}
                    className={`w-full text-left p-2 rounded-xl transition flex items-center justify-between font-bold ${
                      selectedFolder === f.path ? 'bg-indigo-600 text-white shadow-xs' : 'hover:bg-slate-200 text-slate-600'
                    }`}
                  >
                    <span className="flex items-center gap-1.5 truncate">
                      <FolderOpen className="h-4 w-4 shrink-0" />
                      {f.label}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${selectedFolder === f.path ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-200 text-slate-500'}`}>
                      {f.path === 'Tous' ? documents.length : documents.filter(d => d.arborescence.startsWith(f.path) || d.categorie === f.path).length}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Tags cloud filtering */}
          <div className="bg-white border rounded-2xl p-4 space-y-2.5 shadow-2xs">
            <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider border-b pb-2">Indexation Mots-Clés (Tags)</h4>
            <div className="flex flex-wrap gap-1.5">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  className={`px-2 py-1 rounded text-[10px] font-bold transition ${
                    selectedTag === tag ? 'bg-indigo-100 text-indigo-800 border-indigo-300' : 'bg-slate-100 text-slate-500 hover:bg-slate-200 border'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
            {selectedTag && (
              <button
                onClick={() => setSelectedTag(null)}
                className="text-[10px] text-red-650 font-black mt-2 block hover:underline"
              >
                ✕ Supprimer filtre tag
              </button>
            )}
          </div>
        </div>

        {/* Right Side: Directory files table and detailed multi-panel view */}
        <div className="lg:col-span-3 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search and drop area */}
            <div className="md:col-span-3 relative">
              <Search className="absolute left-3.5 top-3.5 text-slate-400 h-4 w-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher par titre de document ou hashtags d'indexation..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-xs shadow-2xs placeholder:text-slate-400"
              />
            </div>
            <button
              onClick={() => {
                const target = document.getElementById('drag-drop-zone');
                if (target) target.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs py-3 rounded-xl transition shadow-xs cursor-pointer"
            >
              + Déposer Fichier
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            
            {/* Files List Panel */}
            <div className="bg-white rounded-2xl border shadow-2xs overflow-hidden">
              <div className="p-3.5 bg-slate-50 border-b flex justify-between items-center text-slate-800 font-bold text-xs">
                <span>Fichiers archivés ({filteredDocs.length} trouvés)</span>
                <span className="text-[10px] text-indigo-600">Sélectionnez pour ouvrir la console d'audit</span>
              </div>

              <div className="divide-y">
                {filteredDocs.map((doc) => {
                  const linksCount = links.filter(l => l.idDocument === doc.id).length;
                  const activeWf = workflows.find(w => w.idDocument === doc.id);
                  const signaturesCount = signatures.filter(s => s.idDocument === doc.id).length;
                  const isSelected = selectedDocId === doc.id;

                  return (
                    <div 
                      key={doc.id} 
                      onClick={() => setSelectedDocId(doc.id)}
                      className={`p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer transition ${
                        isSelected ? 'bg-indigo-50/70 border-l-4 border-indigo-600' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl mt-1">
                          <FileText className="h-6 w-6" />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-2">
                            {doc.nom}
                            {activeWf && (
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-black leading-none ${
                                activeWf.etapeActuelle === 'Approuvé' ? 'bg-emerald-100 text-emerald-800' :
                                activeWf.etapeActuelle === 'Rejeté' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                              }`}>
                                {activeWf.etapeActuelle}
                              </span>
                            )}
                          </h4>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            Taille: {doc.tailleMo} Mo • Importé le : {doc.dateImport} • Chemin : {doc.arborescence} • Auteur : {doc.auteur}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {doc.indexationTags.map(t => (
                              <span key={t} className="text-[9px] bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded-md border">
                                #{t}
                              </span>
                            ))}
                            <span className="text-[9px] bg-indigo-50 text-indigo-700 font-black px-1.5 py-0.5 rounded-md border border-indigo-100 flex items-center gap-1.5">
                              <Link className="h-3 w-3" />
                              {linksCount} liaisons polymorphes
                            </span>
                            {signaturesCount > 0 && (
                              <span className="text-[9px] bg-emerald-50 text-emerald-700 font-black px-1.5 py-0.5 rounded-md border border-emerald-100 flex items-center gap-1">
                                <FileSignature className="h-3 w-3" />
                                {signaturesCount} signature(s) certifiée(s)
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-1 border-t md:border-0 pt-3 md:pt-0 shrink-0 md:justify-end">
                        <button
                          onClick={(e) => { e.stopPropagation(); alert(`Téléchargement de : ${doc.nom}`); }}
                          className="border border-slate-200 text-slate-600 p-2 rounded-xl bg-white hover:bg-slate-100"
                          title="Télécharger"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); alert(`Lien de partage crypté généré :\nhttps://mefoup-flow.cm/share/ged/${doc.id}`); }}
                          className="border border-slate-200 text-slate-600 p-2 rounded-xl bg-white hover:bg-slate-100"
                          title="Partager"
                        >
                          <Share2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
                {filteredDocs.length === 0 && (
                  <div className="p-8 text-center text-slate-400 font-medium">
                    Aucun fichier correspondant aux critères de recherche dans ce dossier.
                  </div>
                )}
              </div>
            </div>

            {/* DETAILED DOUBLE-ENTRY AUDIT PANEL FOR SELECTED DOC */}
            {activeDocument && (
              <div className="bg-slate-50 rounded-2xl border shadow-sm p-5 space-y-6 animate-in fade-induration-200">
                <div className="flex justify-between items-center border-b border-dashed border-slate-300 pb-3">
                  <div>
                    <span className="text-[9px] uppercase font-black tracking-wider text-indigo-600">Trace de Traçabilité Certifiée</span>
                    <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                      <FileSignature className="h-4 w-4 text-indigo-600" />
                      Auditer : {activeDocument.nom}
                    </h3>
                  </div>
                  <button 
                    onClick={() => setSelectedDocId(null)} 
                    className="text-xs font-bold text-slate-400 hover:text-slate-650"
                  >
                    Masquer la console l'audit ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                  {/* Panel A: Revision control (Non-destructive version tracking) */}
                  <div className="space-y-4 bg-white p-4 rounded-xl border">
                    <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider flex items-center gap-1.5 border-b pb-1.5">
                      <History className="h-4 w-4 text-amber-600" />
                      Arbre de Révision
                    </h4>
                    <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
                      {versions.filter(v => v.idDocument === activeDocument.id).sort((a,b) => b.version - a.version).map(v => (
                        <div key={v.id} className="p-2.5 bg-slate-50 rounded-lg border relative">
                          <span className="absolute top-2 right-2 font-mono font-black text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded">
                            v{v.version}
                          </span>
                          <div className="font-bold text-slate-900 truncate pr-6">{v.nomFichier}</div>
                          <div className="text-[10px] text-slate-400 mt-1">Importation : {v.dateCreation} par {v.auteur}</div>
                          <p className="text-[10px] text-slate-500 italic mt-1 bg-white p-1 rounded border border-dashed">"{v.commentaire}"</p>
                        </div>
                      ))}
                    </div>

                    {/* New Revision Submission form */}
                    <form onSubmit={handleAddRevisionSubmit} className="pt-2 border-t space-y-2.5">
                      <div className="font-bold text-[10px] uppercase text-slate-400">Déposer une nouvelle révision</div>
                      <div>
                        <input
                          type="text"
                          required
                          value={newVerFile}
                          onChange={(e) => setNewVerFile(e.target.value)}
                          placeholder="Nom_Nouveau_Fichier.pdf"
                          className="w-full bg-slate-50 p-2 rounded-lg border placeholder:text-slate-400 text-[11px]"
                        />
                      </div>
                      <div>
                        <textarea
                          value={newVerComment}
                          onChange={(e) => setNewVerComment(e.target.value)}
                          placeholder="Motif de la modification..."
                          rows={2}
                          className="w-full bg-slate-50 p-2 rounded-lg border text-[11px] placeholder:text-slate-400"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-slate-900 text-white font-extrabold text-[10.5px] py-1.5 rounded-lg hover:bg-indigo-600 cursor-pointer"
                      >
                        + Incrémenter Version
                      </button>
                    </form>
                  </div>

                  {/* Panel B: Polymorphic Linkages panel */}
                  <div className="space-y-4 bg-white p-4 rounded-xl border">
                    <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider flex items-center gap-1.5 border-b pb-1.5">
                      <Link className="h-4 w-4 text-blue-600" />
                      Liaisons Polymorphes ({links.filter(l => l.idDocument === activeDocument.id).length})
                    </h4>
                    
                    <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                      {links.filter(l => l.idDocument === activeDocument.id).map(l => {
                        let attachedName = `Réf: ${l.idEntite}`;
                        if (l.typeEntite === 'Employe') {
                          attachedName = getEmployeeName(l.idEntite);
                        } else if (l.typeEntite === 'Parcelle') {
                          const parc = parcellesList.find(p => p.id === l.idEntite);
                          attachedName = parc ? `Parcelle: ${parc.designationCode}` : `Parcelle: ${l.idEntite}`;
                        }
                        
                        return (
                          <div key={l.id} className="p-2 bg-blue-50/45 rounded-lg border border-blue-100 flex justify-between items-start gap-2">
                            <div>
                              <span className="text-[9px] bg-blue-100 text-blue-800 font-extrabold px-1.5 rounded uppercase leading-none">
                                {l.typeEntite}
                              </span>
                              <div className="font-bold text-slate-900 mt-1">{attachedName}</div>
                              {l.note && <p className="text-[10px] text-slate-500 italic">"{l.note}"</p>}
                            </div>
                            <button
                              onClick={() => handleRemoveLink(l.id)}
                              className="text-red-500 hover:text-red-700 p-0.5"
                              title="Dissocier"
                            >
                              ✕
                            </button>
                          </div>
                        );
                      })}
                      {links.filter(l => l.idDocument === activeDocument.id).length === 0 && (
                        <div className="p-4 text-center text-slate-400 italic">Aucune entité liée polymorphiquement à ce fichier.</div>
                      )}
                    </div>

                    {/* Form to attach linkage */}
                    <form onSubmit={handleAttachLinkSubmit} className="pt-2 border-t space-y-2.5">
                      <div className="font-bold text-[10px] uppercase text-slate-400">Associer à un circuit ERP</div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <select
                            value={linkTargetType}
                            onChange={(e) => setLinkTargetType(e.target.value as any)}
                            className="w-full bg-slate-50 p-1.5 rounded-lg border text-[11px]"
                          >
                            <option value="Employe">Collaborateur</option>
                            <option value="Parcelle">Parcelle</option>
                            <option value="Animal">Animal Élevage</option>
                            <option value="FactureClient">Facture Client</option>
                          </select>
                        </div>
                        <div>
                          {linkTargetType === 'Employe' && (
                            <select
                              value={linkTargetId}
                              onChange={(e) => setLinkTargetId(e.target.value)}
                              className="w-full bg-slate-50 p-1.5 rounded-lg border text-[11px]"
                            >
                              {employeesList.map(e => <option key={e.id} value={e.id}>{e.prenom} {e.nom}</option>)}
                            </select>
                          )}
                          {linkTargetType === 'Parcelle' && (
                            <select
                              value={linkTargetId}
                              onChange={(e) => setLinkTargetId(e.target.value)}
                              className="w-full bg-slate-50 p-1.5 rounded-lg border text-[11px]"
                            >
                              {parcellesList.map(p => <option key={p.id} value={p.id}>{p.designationCode}</option>)}
                            </select>
                          )}
                          {(linkTargetType !== 'Employe' && linkTargetType !== 'Parcelle') && (
                            <input
                              type="text"
                              value={linkTargetId}
                              onChange={(e) => setLinkTargetId(e.target.value)}
                              placeholder="ID ou Code"
                              className="w-full bg-slate-50 p-1.5 rounded-lg border text-[11px]"
                            />
                          )}
                        </div>
                      </div>
                      <div>
                        <input
                          type="text"
                          value={linkNotes}
                          onChange={(e) => setLinkNotes(e.target.value)}
                          placeholder="Note de liaison (ex: Reçu d'analyse...)"
                          className="w-full bg-slate-50 p-2 rounded-lg border text-[11px]"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-slate-900 text-white font-extrabold text-[10.5px] py-1.5 rounded-lg hover:bg-blue-600 cursor-pointer"
                      >
                        + Lier l'entité polymorphe
                      </button>
                    </form>
                  </div>

                  {/* Panel C: Validation Workflows & Fingerprint Signatures */}
                  <div className="space-y-4 bg-white p-4 rounded-xl border">
                    <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider flex items-center gap-1.5 border-b pb-1.5">
                      <Key className="h-4 w-4 text-emerald-600" />
                      Workflows & Signatures
                    </h4>

                    {(() => {
                      const wf = workflows.find(w => w.idDocument === activeDocument.id) || { etapeActuelle: 'Brouillon', approbateurCible: 'Super Admin' };
                      const sigs = signatures.filter(s => s.idDocument === activeDocument.id);

                      return (
                        <div className="space-y-3.5">
                          <div className="p-3 bg-slate-50 rounded-xl border flex items-center justify-between">
                            <div>
                              <div className="text-[10px] text-slate-400 font-medium">Statut d'approbation :</div>
                              <span className="font-black text-slate-950 text-xs">{wf.etapeActuelle}</span>
                            </div>
                            <span className="text-[10px] text-slate-500">Cible: {wf.approbateurCible}</span>
                          </div>

                          {/* Approval step display logic */}
                          {wf.etapeActuelle === 'Brouillon' && (
                            <div className="p-2 bg-amber-50 rounded-lg text-[10.5px] border border-amber-200">
                              <p className="text-amber-800 leading-normal">Le document est en mode Brouillon. Veuillez séléctionner un validateur cible et le soumettre.</p>
                              <div className="mt-2.5 flex gap-2">
                                <select 
                                  value={wfApprover}
                                  onChange={(e) => setWfApprover(e.target.value)}
                                  className="bg-white border rounded text-[11px] p-1 font-semibold grow"
                                >
                                  <option value="Super Admin">Michel Tchanga (Super Admin)</option>
                                  <option value="Vétérinaire Senior">Dr Diallo (Vétérinaire)</option>
                                  <option value="Chef de culture">Jean-Pierre Ondoa</option>
                                </select>
                                <button
                                  type="button"
                                  onClick={handleWorkflowSubmit}
                                  className="bg-[#1e1e1e] hover:bg-indigo-650 text-white px-2 py-1 rounded text-[10px] font-bold"
                                >
                                  Soumettre
                                </button>
                              </div>
                            </div>
                          )}

                          {wf.etapeActuelle === 'En attente de revue' && (
                            <div className="p-2.5 bg-indigo-50 rounded-lg text-[10.5px] border border-indigo-200 space-y-2">
                              <p className="text-indigo-800 font-medium">Revue requise par : {wf.approbateurCible}.</p>
                              <div>
                                <input
                                  type="text"
                                  value={wfDecisionComment}
                                  onChange={(e) => setWfDecisionComment(e.target.value)}
                                  placeholder="Observation ou commentaires..."
                                  className="w-full text-[11px] p-1.5 border bg-white rounded"
                                />
                              </div>
                              <div className="flex gap-1.5 justify-end">
                                <button
                                  type="button"
                                  onClick={() => handleWorkflowDecide('Rejeté')}
                                  className="bg-rose-600 hover:bg-rose-700 text-white px-2.5 py-1 rounded text-[10px] font-black"
                                >
                                  Rejeter
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleWorkflowDecide('Approuvé')}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded text-[10px] font-black"
                                >
                                  Approuver
                                </button>
                              </div>
                            </div>
                          )}

                          {wf.etapeActuelle === 'Approuvé' && (
                            <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200 text-[10.5px]">
                              <p className="text-emerald-800 font-extrabold flex items-center gap-1">
                                <CheckCircle2 className="h-4 w-4" /> Validé avec succès.
                              </p>
                              {wf.commentaireDecision && (
                                <p className="text-slate-500 italic mt-1 bg-white p-1 rounded border border-dashed text-[10px]">"{wf.commentaireDecision}"</p>
                              )}
                              <div className="mt-3">
                                {sigs.length === 0 ? (
                                  <button
                                    type="button"
                                    onClick={handleSignDocument}
                                    className="w-full bg-slate-900 text-white p-1.5 rounded-lg text-[10.5px] font-black hover:bg-emerald-600"
                                  >
                                    ✍️ Signer & Clore numériquement
                                  </button>
                                ) : (
                                  <div className="space-y-1.5">
                                    <div className="text-[10px] text-slate-400 font-extrabold uppercase">Membres des signataires :</div>
                                    {sigs.map(s => (
                                      <div key={s.id} className="p-1 px-2 bg-emerald-100/50 border border-emerald-300 rounded text-[10px]">
                                        <div className="font-bold text-emerald-950">{s.signataire} ({s.roleSignataire})</div>
                                        <div className="text-[9px] text-slate-400 font-mono">Fingerprint : {s.empreinteNumerique}</div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {wf.etapeActuelle === 'Rejeté' && (
                            <div className="p-2.5 bg-red-50 rounded-lg border border-red-200 text-[10.5px]">
                              <p className="text-red-800 font-bold flex items-center gap-1">
                                <XCircle className="h-4 w-4" /> Renvoyé pour correction.
                              </p>
                              <p className="text-slate-500 italic mt-1 font-semibold">"{wf.commentaireDecision}"</p>
                              <button
                                type="button"
                                onClick={() => {
                                  setWorkflows(prev => prev.map(w => w.idDocument === selectedDocId ? { ...w, etapeActuelle: 'Brouillon' } : w));
                                }}
                                className="w-full mt-2 bg-slate-900 text-white rounded p-1 font-bold text-[10px]"
                              >
                                Retourner au mode Brouillon
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            )}

            {/* Drag and Drop Zone - Interactive Simulator */}
            <div
              id="drag-drop-zone"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-7 flex flex-col items-center justify-center text-center transition cursor-pointer ${
                isDragging ? 'border-indigo-600 bg-indigo-50 shadow-inner' : 'border-slate-350 hover:border-indigo-500'
              }`}
            >
              <UploadCloud className="text-indigo-400 h-10 w-10 mb-2 animate-bounce" />
              <h4 className="text-xs font-black text-slate-800">Glissez-déposez n'importe quel document ici</h4>
              <p className="text-[10px] text-slate-400 mt-1 max-w-sm">Simulateur GED intelligent : déposez des rapports vétérinaires, contrats, analyses agronomiques pour les associer instantanément à vos parcelles ou bêtes.</p>
              
              <form onSubmit={handleManualUploadSubmit} className="mt-5 flex flex-wrap gap-2.5 justify-center text-xs w-full max-w-lg bg-white p-3.5 border rounded-xl shadow-xs">
                <input
                  type="text"
                  required
                  value={newDocNom}
                  onChange={(e) => setNewDocNom(e.target.value)}
                  placeholder="Nom du fichier (ex: Carnet_Veto_Porcs.pdf)"
                  className="bg-slate-50 px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 grow text-xs font-mono"
                />
                <select value={newDocCat} onChange={(e) => setNewDocCat(e.target.value as any)} className="bg-slate-50 px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden font-bold">
                  <option value="Agricole">Agricole</option>
                  <option value="Élevage">Élevage / Étable</option>
                  <option value="RH">Ressources Humaines</option>
                  <option value="Administratif">Administratif</option>
                  <option value="Financier">Comptabilité</option>
                </select>
                <button
                  type="submit"
                  className="bg-indigo-600 text-white font-extrabold px-4 py-2 rounded-lg hover:bg-slate-900 transition shadow-xs"
                >
                  + Coffrer
                </button>
              </form>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
