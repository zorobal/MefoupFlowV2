# 🧮 Guide Technique : Algorithmes et Moteurs de Calcul par Module

Ce document recense l'ensemble des formules mathématiques, règles de gestion financière, et interactions comptables/techniques qui structurent le moteur de calcul de l'**ERP Agro-Pastoral Intégré (SYSCOHADA)**.

---

## 🌾 1. Module Agriculture (Rendements et Campagnes)

Le calcul clé de ce module concerne la performance agronomique des campagnes agricoles par spéculation végétale (ex. Maïs, Soja).

### A. Rendement Agricole Réel (R_ha)
S'exprime en tonnes par hectare (t/Ha) ou kilogrammes par hectare (kg/Ha).
$$\text{Rendement (t/Ha)} = \frac{\text{Quantité Totale Récoltée (tonnes)}}{\text{Surface Totale de la Parcelle Cultivée (Hectares)}}$$

*   **Interaction :** La *Quantité Totale Récoltée* est directement calculée à partir des mouvements de stock de type **Entrée** dans le module d'inventaire, filtrés sur le motif `"Récolte"` pour l'article correspondant à la spéculation végétale récoltée.

### B. Densité d'Utilisation des Intrants (D_intrants)
Mesure la quantité d'engrais, semences ou produits phytosanitaires appliqués par unité de surface arable.
$$\text{Densité (Kg/Ha)} = \frac{\text{Quantité d'Intrants Consommés (Kg)}}{\text{Surface de la Parcelle Ciblée (Ha)}}$$

*   **Interaction :** Chaque enregistrement d'épandage d'engrais engendre une écriture de sortie d'inventaire dans le module *Stocks*.

---

## 🐄 2. Module Élevage (Zootechnie et Mortalité)

Les performances pastorales reposent sur des indicateurs de mortalité et d'évolution pondérale.

### A. Taux de Mortalité Zootechnique (T_m)
Exprime le taux de perte de bétail pour une période donnée. Indispensable pour alerter en cas de crise sanitaire.
$$T_m (\%) = \left( \frac{\text{Nombre total d'animaux décédés ou réformés d'un troupeau}}{\text{Effectif initial cumulé du troupeau (Actifs + Décédés + Réformés)}} \right) \times 100$$

*   **Implémentation de l'algorithme (Code source / BI) :**
    *   Le système filtre la table globale `animaux` sur le champ `statut` égal à `'Décédé'` ou `'Réformé'`.
    *   S'applique sur une population comprenant l'ensemble des animaux historiquement enregistrés pour obtenir la proportion d'attrition réelle.

### B. Moyenne Pondérale Individuelle du Troupeau (P_moyen)
Donne le poids moyen du troupeau à des fins d'évaluation de la valeur biologique de l'élevage.
$$P_{\text{moyen}} (\text{Kg}) = \frac{\sum_{i=1}^{n} \text{Poids Individuel de l'animal Actif } i}{\text{Effectif Actif Total du troupeau}}$$

---

## 📦 3. Module Stocks & Valorisation de l'Inventaire

La gestion des stocks repose sur la traçabilité comptable et administrative.

### A. Solde Courant de l'Article (S_dispo)
La quantité physique disponible à l'instant-T s'obtient par sommation algébrique exhaustive de l'ensemble des mouvements historiques :
$$S_{\text{dispo}} = S_{\text{initial}} + \sum \text{Quantités d'Entrées} - \sum \text{Quantités de Sorties}$$

*   *Note de robustesse :* L'application s'assure par filtrage de sécurité que le solde disponible ne peut jamais être inférieur à 0 (interdiction théorique de sortir un stock non existant).

### B. Valorisation Globale de l'Inventaire (V_stock)
Le stock global est valorisé selon la méthode du prix d'achat fournisseur moyen pondéré, compatible avec les normes SYSCOHADA :
$$V_{\text{stock}} (\text{FCFA}) = \sum_{j=1}^{m} \left( \text{Solde Disponible de l'article } j \times \text{Prix Fournisseur Moyen de l'article } j \right)$$

*   Dans le calcul consolidé du tableau de bord de la **Business Intelligence**, le stock total valorisé représente la valeur de revente ou de consommation interne disponible.

---

## ⚙️ 4. Module Parc & GMAO (Consommations et Coûts)

Le calcul s'articule autour des coûts de détention et d'utilisation de la flotte d'équipements mécanisés.

### A. Coût Consolidé d'une Intervention de Maintenance (C_GMAO)
Le coût de revient réel d'une opération d'entretien (préventive ou curative) est la somme des charges directes et indirectes de main d'œuvre et d'intrants techniques :
$$C_{\text{GMAO}} = \left( \text{Temps de main-d'œuvre (Heures)} \times \text{Taux horaire du technicien} \right) + \sum \left( \text{Quantité de pièces de rechange} \times \text{Prix unitaire d'achat} \right)$$

*   **Interaction Cascade :** Les pièces de rechange prélevées lors d'un ordre de réparation mettent à jour l'inventaire dans le module *Stocks* (mouvement de Sortie) et imputent automatiquement un mouvement comptable de charges (débit de la classe 615 - Entretien et Réparations).

### B. Ratio de Consommation de Carburant (R_carburant)
$$R_{\text{carb}} (\text{L/Heure}) = \frac{\text{Volume Total de Carburant Consommé (Litres)}}{\text{Variation de l'horomètre/compteur d'heures (Heures)}}$$
$$R_{\text{carb}} (\text{L/100 Km}) = \left( \frac{\text{Volume Total de Carburant Consommé (Litres)}}{\text{Distance Parcourue durant la période (Km)}} \right) \times 100$$

---

## 🏦 5. Calculs Financiers et Budgétaires (SYSCOHADA)

La structure des états financiers répond au plan comptable révisé SYSCOHADA de l'Afrique de l'Ouest et de l'Afrique Centrale.

### A. Résultat Comptable Net de l'Exploitation (R_net)
$$R_{\text{net}} = \text{Total Produits (Classe 7)} - \text{Total Charges (Classe 6)}$$

*   *Exemples de Comptes de Classe 7 (Produits) imputés dans l'ERP :*
    *   `701` : Ventes de produits finis (Cultures vendues : Tomates, Maïs, etc.)
    *   `706` : Prestations de services agricoles facturées aux tiers coopératifs
*   *Exemples de Comptes de Classe 6 (Charges) imputés dans l'ERP :*
    *   `601` : Achats d'intrants et semences consommés
    *   `615` : Entretien de matériels et outillages (Maintenance tracteurs)
    *   `661` : Charges de personnel direct (Main-d'œuvre temporaire et salariés)

### B. Taux d'Exécution Budgétaire (E_budget)
Pour chaque département fonctionnel (Agriculture, Élevage, Logistique, RH) :
$$E_{\text{budget}} (\%) = \left( \frac{\text{Montant Réel Engagé (FCFA)}}{\text{Montant Initial Budgétisé par la Direction (FCFA)}} \right) \times 100$$

*   **Solde restant disponible :**
    $$\text{Reste à Engager} = \text{Montant Initial Budgétisé} - \text{Montant Réel Engagé}$$
    Un montant supérieur à l'initial déclenche automatiquement une mise en surbrillance d'alerte rouge sur le tableau budgétaire.

---

## 📊 6. Module Business Intelligence (Consolidation multidimensionnelle)

La brique BI consolide l'intégralité des modules pour offrir un cockpit décisionnel.

### Formule de Sensibilité de la Trésorerie Prévisionnelle (Cockpit BI)
$$\text{Trésorerie Projetée M+1} = \text{Trésorerie Disponible Actuelle} + \sum \text{Créances Clients Facturées} - \sum \text{Dépenses Fixes Prévues} - \sum \text{Maintenances Programmées M+1}$$

### Grilles de Déclenchement des Alertes BI
*   **Alerte Mortalité Animale de Type "Supérieur" :** Déclenchée si $T_m > 2.5\%$.
*   **Alerte Seuil Critique Trésorerie de Type "Inféreur" :** Déclenchée si $\text{Trésorerie de Solde Liquide} < 2~000~000~\text{FCFA}$.
*   **Alerte Rupture Inventaire :** Déclenchée si pour tout article $k$, $S_{\text{dispo}}(k) < \text{Seuil d'alerte minimum du magasin}(k)$.
