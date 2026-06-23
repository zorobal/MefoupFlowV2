# 📖 Manuel de l'Utilisateur : Guide d'Utilisation Pas-à-Pas

Bienvenue dans le manuel officiel de l'**ERP Agro-Pastoral Intégré (SYSCOHADA)**. Ce guide est conçu pour vous accompagner pas-à-pas dans l'appropriation de l'application, depuis votre première connexion jusqu'aux opérations financières avancées de consolidation.

---

## 🧭 1. Présentation Générale de l'Interface

L'écran principal de l'application est divisé en deux sections principales :
*   **La barre latérale de gauche (Menu de Navigation) :** Elle contient les raccourcis vers l'ensemble des modules opérationnels activés pour votre compte utilisateur.
*   **La zone centrale principale (Espace de Travail) :** C'est ici que s'affichent les formulaires, tableaux, graphiques et fenêtres de paramétrage de vos activités courantes.

---

## 🔐 2. Commencer par le Paramétrage des Rôles (Habilitations)

Pour comprendre comment l’application s’adapte aux différents corps de métiers de votre exploitation :

1.  Cliquez sur le bouton **Paramètres** tout en bas de la barre latérale gauche.
2.  Dans la section **"Simulateur de Rôle Actif"**, sélectionnez l'un des profils du personnel (ex. *Super Administrateur*, *Comptable*, *Chef de Culture*, *Vétérinaire*).
3.  Observez comment le menu latéral se reconfigure instantanément : le Comptable ne verra plus les onglets agronomiques ou vétérinaires, tandis que le Chef de Culture n'aura plus d'accès aux livrets de paie ni au journal comptable financier. Cela évite les confusions à l'écran.

---

## 🌾 3. Gérer les Parcelles et les Campagnes (Agriculture)

Pour suivre vos cultures :

1.  Sélectionnez l'onglet **Agriculture** dans le menu latéral.
2.  **Affichage de la carte et du glossaire :** Vous pouvez visualiser l'état de chaque champ (En préparation, En croissance, Récolté).
3.  **Ajouter une Parcelle :**
    *   Cliquez sur le bouton **"Ajouter Parcelle"** en haut à droite.
    *   Saisissez le nom (ex : *Parcelle Nord-04*), la surface en Hectares (ex : *12*), et déterminez le type de culture active (ex : *Soja*).
    *   Cliquez sur **Valider**.
4.  **Enregistrer une intervention :**
    *   Dans le sous-onglet de suivi agronomique, cliquez sur **"Nouvelle Intervention"** (Irrigation, Labour, Épandage d'engrais).
    *   Choisissez la parcelle concernée, la quantité d'engrais utilisée, et le responsable. Le système ajustera automatiquement vos réserves de stock d'engrais.

---

## 🐄 4. Gérer l'Élevage et le Bétail

Pour assurer le suivi zootechnique et la bonne santé de votre troupeau :

1.  Sélectionnez l'onglet **Élevage**.
2.  **Visualiser le cheptel :** Les indicateurs en haut d'écran vous donnent l'état global (nombre total de bêtes, animaux malades en traitement, naissances et décès).
3.  **Ajouter une nouvelle bête :**
    *   Cliquez sur **"Ajouter Animal / Naissance"**.
    *   Sélectionnez le groupe ou troupeau d'affectation (ex : *Génisses*, *Bovins Engraissement*).
    *   Attribuez un numéro de boucle ou identifiant unique, indiquez sa race, sa date de naissance et son poids initial.
4.  **Déclarer un traitement vétérinaire :**
    *   Dans le sous-onglet d'actions cliniques, sélectionnez le bétail présentant des symptômes.
    *   Enregistrez la prescription (médicament, vaccin, posologie). La quantité prescrite sera déduite directement du stock de la pharmacie vétérinaire dans le module *Stocks*.

---

## 📦 5. Enregistrer les Entrées et Sorties de Stock (Stocks & Magasins)

Pour assurer la fluidité de la chaîne d'approvisionnement :

1.  Sélectionnez l'onglet **Stocks & Magasins**.
2.  **Consulter les inventaires :** Saisissez un mot-clé dans la barre de recherche pour localiser instantanément un article (ex : *Engrais NPK*, *Semences de Maïs*, *Vaccins*).
3.  **Effectuer un mouvement d'Entrée (Achat Fournisseur / Livraison) :**
    *   Cliquez sur **"Nouveau Mouvement"**.
    *   Sélectionnez le type : **Entrée**.
    *   Renseignez l'article (ex : *Engrais NPK*), la quantité physique réceptionnée, le lot, la date d'expiration et le prix d'achat.
    *   Validez. Le graphique "Solde du Stock" de cet article s'actualise immédiatement.
4.  **Détecter une alerte de rupture :** Tout produit dont la quantité passe au-dessous de la limite d'alerte définie apparaît avec un avertissement orangé clignotant.

---

## ⚙️ 6. Gérer l'Entretien du Matériel (GMAO / Maintenance)

Pour préserver la durée de vie de vos tracteurs, moissonneuses et motopompes :

1.  Sélectionnez l'onglet **Parc & Maintenance** (icône Clé à molette).
2.  **Déclarer une panne :**
    *   Si l'un de vos équipements pose problème, cliquez sur **"Signaler Panne"**.
    *   Décrivez le dysfonctionnement, l'urgence de l'intervention et assignez un mécanicien de l'atelier de réparation.
3.  **Créer un Ordre de Travail (GMAO) :**
    *   Basculez sous l'onglet "Ordres de Maintenance" et sélectionnez la panne signalée.
    *   Spécifiez les pièces d'usure requises à prélever dans l'inventaire général.
    *   Une fois l'intervention notée comme **"Terminée"**, le système consomme automatiquement les pièces de rechange au sein du magasin général.

---

## 🧾 7. Facturer vos Clients et Tenir la Comptabilité SYSCOHADA

Pour sécuriser l'équilibre financier de vos opérations :

1.  Sélectionnez l'onglet **Commercial / Comptabilité**.
2.  **Créer une facture de vente :**
    *   Cliquez sur le sous-onglet de facturation client.
    *   Sélectionnez le client cible, ajoutez les marchandises vendues (ex : *Poches de Cacao*, *Sacs de Pommes de terre*) avec les quantités correspondantes.
    *   Double-cliquez pour valider la facture. Elle se met en état "En attente de paiement".
3.  **Grand Livre de Comptabilité Générale :**
    *   Les factures et dépenses de paie génèrent automatiquement des écritures classées selon les codes comptables du SYSCOHADA (Classe 6, Classe 7, etc.).
    *   Vous pouvez insérer manuellement des écritures exceptionnelles à l'aide du formulaire d'écriture en bas de page.

---

## 📊 8. Suivre les Indicateurs Décisionnels (Business Intelligence)

Pour piloter l'économie générale de l'exploitation à long terme :

1.  Sélectionnez l'onglet **BI & Rapports**.
2.  **Cartes de performance globale :** Visualisez instantanément la rentabilité de chaque secteur (Agriculture vs Élevage) et ajustez vos coûts de fonctionnement.
3.  **Planifier des Rapports périodiques :**
    *   Vous pouvez configurer la génération de rapports mensuels ou hebdomadaires pour les envoyer automatiquement aux directeurs divisionnaires.
4.  **Moteur d'Alertes BI :**
    *   Paramétrez des alarmes de dépassements de seuil critiques (ex : taux de perte de poussins supérieur à 3 % en élevage de volailles). Le système passera en alerte visuelle rouge en cas d'anomalie structurelle.
