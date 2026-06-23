# ERP Agro-Pastoral Intégré (SYSCOHADA)

Bienvenue sur la plateforme **ERP Agro-Pastoral Intégré**, une solution logicielle d'entreprise moderne et modulaire, spécialement conçue pour relever les défis de gestion des exploitations agricoles et de l'élevage de grande envergure (notamment en Afrique Centrale, conforme aux normes **SYSCOHADA**).

Ce système réunit en un point d'accès central unique la planification culturale, la gestion du bétail, la logistique de stockage, la maintenance de flotte d'équipements rattachée (**GMAO**), la comptabilité générale et analytique, le pilotage RH, ainsi qu'une brique avancée de **Business Intelligence (BI)** pour la prévisibilité d'activité.

---

## 🚀 Fonctionnalités Majeures du Système

L'ERP s'articule autour de 9 modules interactifs, chacun piloté de manière sécurisée par un modèle de rôles et d'habilitations personnalisables :

1.  **Tableau de Bord Holistique (Dashboard) :** Consolidation multi-sites, indicateurs clés (mortalité, marges, stocks bas), graphique financier dynamique temps-réel (revenus vs dépenses).
2.  **Gestion Agricole (Agriculture) :** Planification des campagnes, cartographie des parcelles (surface, culture active, rendement prévisionnel), suivi agronomique et intrants associés.
3.  **Gestion d'Élevage (Élevage) :** Carnet de santé numérique, affectations en troupeaux, suivi des statuts (Actif, En Traitement, Vendu, Décédé, Réformé), monitoring du poids.
4.  **Stocks & Magasins (Stocks) :** Gestion d'articles (intrants, semences, pièces GMAO), traçabilité par fiches de mouvement (Entrées/Sorties), valorisation des stocks en temps réel.
5.  **Parc Matériel & GMAO (Parc & Maintenance) :** Fiches d'équipements technico-financières, carnets de maintenance préventive/curative, suivi de la consommation de carburant et régularisation automatique du stock d'articles de rechange.
6.  **Comptabilité SYSCOHADA (Commercial & Compta) :** Facturation clients, gestion comptable par classe (SYSCOHADA), fiches de pièces justificatives téléversables, grand livre analytique par centre de coût.
7.  **Ressources Humaines (RH & Paie) :** Registre du personnel, fiches de paie mensuelles configurables, contrats de travail, et imputation de main-d'œuvre directe sur les modules métier.
8.  **Gestion Électronique des Documents (GED) :** Centralisation documentaire, catégorisation par types de pièces (agricole, bilans financiers, santé vétérinaire), versioning et recherche rapide.
9.  **Business Intelligence & Reports (BI) :** Modélisation de KPIs croisés, planification périodique de rapports décisionnels, alertes par courriel sur seuil de risque, requêtes consolidées personnalisées.

---

## 🛠️ Stack Technique

*   **Framework Client :** React 19 (TypeScript)
*   **Moteur d'Animation :** Motion (`motion/react`)
*   **Moteur de Tracé :** Recharts (Visualisation graphique haute performance)
*   **Sizing de Grille & Design :** Tailwind CSS Premium (Utility-first)
*   **Librairie d'icônes :** Lucide-React
*   **Serveur de Développement & Bundler :** Vite v6 sans HMR encombrant (`DISABLE_HMR=true` pour préservation du state applicatif lors des modifications de code)

---

## 📂 Organisation du Code et Évolution du Système

Le système est découplé de manière à isoler l'état global et les logiques de rendu. Voici les fichiers clés du projet :

```text
.
├── src/
│   ├── App.tsx                        # Point d'entrée de l'application, gestion de l'état global, du rôle simulé et routage des tabs
│   ├── types.ts                       # Typage TypeScript strict pour l'ensemble des modules (Contrats de données, Enums et Interfaces)
│   ├── mockData.ts                    # Générateur de base de données de pré-configuration (SaaS clients de test, Employés, Budgets, etc.)
│   ├── components/
│   │   ├── DashboardModule.tsx        # Composant du tableau de bord central analytique
│   │   ├── AgricultureModule.tsx      # Gestion des campagnes agricoles et parcelles
│   │   ├── ElevageModule.tsx          # Gestion vétérinaire, troupeaux, et fiches animaux
│   │   ├── StocksModule.tsx           # Flux des stocks, magasins et traçabilité des lots
│   │   ├── EquipementModule.tsx       # GMAO, maintenance préventive/curative, plans d'entretien
│   │   ├── CommercialModule.tsx       # Ventes, devis et facturation clients
│   │   ├── ComptaModule.tsx           # Grand livre, plan comptable conforme SYSCOHADA, bilans 
│   │   ├── RHModule.tsx               # Salariés, fiches de paie et organigramme
│   │   ├── GEDModule.tsx              # Gestion GED, métadonnées documentaires
│   │   ├── BIModule.tsx               # KPI avancés, rapports planifiés et moteurs d'alertes
│   │   └── SettingsModule.tsx         # Gestion des rôles, habilitations, et dictionnaire terminologique (glossaire)
```

### ⚙️ Comment étendre et faire évoluer l'application :

1.  **Ajout d'un Nouveau Type / Attribut :** Tous les contrats de données sont centralisés dans `src/types.ts`. Toujours modifier ce fichier en premier avant d'implémenter un nouveau flux.
2.  **Mise à jour des Données Initiales :** Modifier `src/mockData.ts` pour enrichir les listes pré-configurées (p. ex., ajouter des équipements de test, des articles ou des écritures comptables).
3.  **Interface et Routage :** La barre latérale (`<aside>`) de `src/App.tsx` filtre automatiquement les boutons disponibles en fonction des droits du rôle actif (`simulatedRole.modules.includes('mon-module')`). Les onglets correspondants sont ensuite raccordés de manière conditionnelle dans la zone `<main>` de `src/App.tsx`.

---

## ⚙️ Commandes Utiles

Pour travailler avec le projet, ouvrez votre terminal dans le répertoire racine et lancez l'une des commandes suivantes :

*   **Lancer le serveur de développement :**
    ```bash
    npm run dev
    ```
    *(Le serveur démarrera sur `http://localhost:3000`)*

*   **Vérifier la conformité TypeScript et d'autres erreurs potentielles (Linter) :**
    ```bash
    npm run lint
    ```

*   **Compiler l'application pour la mise en production :**
    ```bash
    npm run build
    ```

---

## 💼 Directives pour la Coexistence des Équipes

*   **Pas de mock superficiel :** Toute interaction entre le stock d'équipements (GMAO) et les sorties d'inventaire doit réellement mettre à jour les constantes d'état dans le module parent. (Référez-vous au fichier `CALCULS.md` pour comprendre les cascades).
*   **Zéro feuille de style secondaire :** Toutes les classes d'habillage esthétique doivent impérativement s'écrire à l'aide de Tailwind CSS dans les fichiers JSX/TSX.
*   **Typage strict :** L'usage de `any` est prohibé. La validation TypeScript (`npm run lint`) fait office de garde-fou avant toute validation de branche de production.
