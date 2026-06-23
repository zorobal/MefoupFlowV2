# 📘 Synthèse d'Architecture et Guide de Formation Système

Ce document sert de support pédagogique aux gestionnaires, ingénieurs et formateurs chargés du déploiement opérationnel et de la maintenance logicielle de l'**ERP Agro-Pastoral Intégré (SYSCOHADA)**. Il détaille l'acheminement des données, la topographie des modules et les mécanismes sous-jacents qui animent la plateforme.

---

## 🏛️ 1. Architecture Conceptuelle de l'Application

L'ERP est construit selon une architecture **SPA (Single Page Application)** unifiée avec un **gestionnaire d'état centralisé** logé au sommet du composant principal (`App.tsx`). Ce choix assure la réactivité immédiate de l'interface en éliminant les délais de rechargement des pages et préserve l'intégrité transactionnelle entre les modules.

### Schéma de circulation de l'information (ASCII Art) :

```text
                  +----------------------------------------------+
                  |              App.tsx (Singe Source)          |
                  |  - Rôle Actif  - parcelles  - troupeaux      |
                  |  - articles    - écritures  - équipements    |
                  +----------------------------------------------+
                                         |
         +-------------------------------+------------------------------+
         | (Prop Drilling de lecture & Callbacks de mise à jour d'état) |
         v                               v                              v
+------------------+           +------------------+           +------------------+
|   StocksModule   | <=========| EquipementModule |==========>|    ComptaModule  |
|  - Entrées/Sorties|  Sortie   | (GMAO / Entretien) P. Compta |- Grand Livre     |
|  - Stock Physique| d'article | - Consommation   |  automatique |- Bilan / Balance |
|  - Lots / Alertes|           | - Panne / Pièces |              |  SYSCOHADA       |
+------------------+           +------------------+           +------------------+
         |                                                              ^
         |  Calcul de la valeur globale du stock                        |
         v                                                              |
+------------------+                                                    |
|     BIModule     |----------------------------------------------------+
|  - Rapports / KPI|               Lecture budgets vs dépensés
|  - Graphiques BI  |
+------------------+
```

---

## 🗺️ 2. Cartographie de l’État Global (`App.tsx`)

Afin de garantir que les données restent synchrones (par exemple, que l'utilisation d'une pompe à eau en irrigation agricole ait ses pièces d'usure déduites des stocks physiques et ses coûts imputés dans le grand livre comptable), **les variables d'état suivantes sont hébergées au niveau racine** :

*   **Ressources Foncières :** `exploitations`, `parcelles`, `cultures`, `interventionsAgricoles`.
*   **Ressources Pastorales :** `troupeaux`, `animaux`, `evenementsSanitaires`, `traitementsVeterinaires`.
*   **Inventaire & Magasins :** `magasins`, `articles`, `mouvementsStock` (mouvements réels de stock d'entrées et sorties).
*   **Flotte Automobile & GMAO :** `equipements`, `maintenances`, `fuelLogs`, `plansMaintenance`, `pannesEquipement`, `assurancesEquipement`.
*   **Système Financier & RH :** `clients`, `ventes`, `piecesComptables` (Grand livre SYSCOHADA), `budgets`, `employes`, `fichesPaie`.
*   **Contrôle d'accès & Structure :** `systemSettings` (Rôles, Glossaire de traduction pour termes spécifiques).

Ces données sont injectées dans les différents modules enfants sous forme de de structures indexées (prop-drilling de lecture) accompagnées de fonctions d'écriture (e.g. `setEquipements`, `handleAddMouvementStock`).

---

## 🔑 3. Habilitations et Simulation des Rôles pour la Formation

L’ERP intègre un puissant simulateur de profils d'habilitation rattaché au composant `<SettingsModule />`. Lors des sessions de formation, cet outil est crucial pour faire comprendre aux utilisateurs finaux la séparation des responsabilités au sein d'une exploitation agricole.

### Les Quatre Rôles Prédéfinis et leur Périmètre Opérationnel :

1.  **Super Administrateur (`role-superadmin`) :**
    *   **Accès :** `dashboard`, `agriculture`, `elevage`, `stocks`, `commercial`, `compta`, `rh`, `ged`, `settings`, `parc-materiel`, `bi-reporting`.
    *   **Usage de formation :** Permet d'illustrer la vue de pilotage globale et de paramétrer initialement l'ERP.
2.  **Gestionnaire d'Élevage & Vétérinaire (`role-elevage`) :**
    *   **Accès limité à :** `dashboard`, `elevage`, `stocks`, `ged`.
    *   **Usage de formation :** Montre comment l'enregistrement des naissances et des vaccins de troupeaux n'influence que la sphère pastorale sans polluer l'accès comptable.
3.  **Comptable Financier (`role-comptable`) :**
    *   **Accès limité à :** `dashboard`, `commercial`, `compta`, `rh`, `ged`.
    *   **Usage de formation :** Formation axée sur la saisie des pièces comptables conformes au plan SYSCOHADA et sur l'émission des bulletins de paie.
4.  **Chef de Culture Agricole (`role-agricole`) :**
    *   **Accès limité à :** `dashboard`, `agriculture`, `stocks`.
    *   **Usage de formation :** Formation centrée sur le suivi des assolements, de l'irrigation, de l'état sanitaire des cultures de rente et de la consommation d'intrants.

---

## ⚙️ 4. Flux de Données Transversaux (Scénarios Clés)

Pour former efficacement un groupe d'utilisateurs, il est conseillé de dérouler les trois scénarios d'interactivité croisée suivants étape par étape :

### Scénario A : Panne de Tracteur et Prélèvement de Pièce de Rechange
1.  **Implication :** GMAO⚙️ + Stocks📦.
2.  **Flux applicatif :**
    *   Le conducteur déclare une **Panne** sur le Tracteur `John Deere 6120M` dans le module *Parc & Maintenance*.
    *   L'atelier mécanique crée un ordre de **Maintenance curative**.
    *   Dans l'ordre de maintenance, le mécanicien sélectionne un composant nécessaire (p. ex., un "Filtre à Huile - Référence : `art-4`").
    *   À la validation de l'intervention, le système appelle l'action globale **`onAddMouvement`** pour créer automatiquement un mouvement de type **Sortie** avec le motif `"Consommation Agricole"`.
    *   Le stock théorique de l'article filtre est immédiatement ajusté et décompté au sein du module *Stocks & Magasins*, sans aucune ressaisie manuelle nécessaire.

### Scénario B : Enregistrement d'une Facture Client de Vente de Maïs
1.  **Implication :** Stocks📦 + Commercial (Facturation)🧾 + Comptabilité SYSCOHADA🏦.
2.  **Flux applicatif :**
    *   La vente de 15 tonnes de Maïs est enregistrée dans le module *Commercial*.
    *   Cette vente génère un mouvement de **Sortie** dans les stocks de Maïs (`art-1`) pour régulariser l'inventaire physique.
    *   Parallèlement, une **écriture comptable automatique** s'inscrit au Grand Livre : au débit du compte *Clients* (Classe 4) et au crédit du compte *Ventes de marchandises* (Classe 7 - SYSCOHADA).

### Scénario C : Émission des Paies et Imputation Budgétaire
1.  **Implication :** RH👥 + Comptabilité🏦 + BI & Rapports📊.
2.  **Flux applicatif :**
    *   Le module *Ressources Humaines* valide le tableau des salaires pour le mois M.
    *   Une **Pièce comptable** de paie de type (Débit Charge de personnel - Classe 66 / Crédit Personnel Rémunérations Dues - Classe 42) est générée dans le journal de paie.
    *   Le module *Business Intelligence* intercepte le montant total engagé pour le comparer en temps réel au budget cumulé de la rubrique "Ressources Humaines" de l'exercice.

---

## 👨‍🏫 5. Méthodologie d’Enseignement recommandée

Pour former un chef d'exploitation ou un gestionnaire n'ayant pas de compétences approfondies en informatique :

1.  **Phase d'Observation :** Commencer en mode **Super Administrateur** sur le *Tableau de Bord* pour analyser l'état global fictif de la ferme (chiffres d'affaires, effectifs animaux, stocks totaux).
2.  **Phase Spécialisée :** Basculer du rôle Super Admin au rôle adéquat (p. ex., *Chef d'exploitation* ou *Comptable*). Montrer comment l'espace de travail est dépouillé des options inutiles pour limiter l'erreur humaine.
3.  **Phase Transactionnelle :** Faire exécuter manuellement une interaction trans-module (p. ex., "Acheter un lot d'intrants", vérifier qu'il s'ajoute en stock, puis vérifier la pièce de dépense apparue en comptabilité).
4.  **Phase Décisionnelle :** Consulter l'impact de ces modifications sur le module de *Business Intelligence* sous forme d'indicateurs de performance (Mortalité cumulée, Consommation de carburant, Écarts budgétaires).
