# Registre des risques

Un risque est un événement possible. Un écart déjà confirmé appartient à `095_Registre_Audit.md` ; une inconnue conceptuelle appartient à `099_Questions_Ouvertes.md`.

| ID | Risque | Probabilité | Impact | Détection | Prévention | Réponse/contingence | Responsable | Statut |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R-001 | Une mise à jour de la base modifie les stations ou leurs licences. | moyenne | haut | tests d'intégration et revue du lockfile | versions exactes et métadonnées conservées | bloquer la mise à jour ou exclure la station | mainteneur | ouvert |
| R-002 | Une hauteur brute est interprétée comme hauteur officielle. | moyenne | critique | revue des contrats et sorties | nommage, documentation et absence de revendication de datum validé | désactiver la publication de hauteur concernée | mainteneur | ouvert |
| R-003 | La bibliothèque de calcul change son algorithme ou son contrat. | moyenne | haut | typecheck et tests déterministes après mise à jour | adaptateur dédié et version exacte | conserver l'ancienne version ou adapter derrière le port | mainteneur | ouvert |
| R-004 | Une station BY-NC entre dans le chemin publiable. | faible | haut | test de refus et contrôle systématique de `commercial_use` | refus par défaut avant calcul | retirer la sortie et corriger la sélection | mainteneur | ouvert |
| R-005 | Un extremum discret à cinq minutes est présenté comme horaire officiel ou étale physique. | moyenne | haut | revue des contrats et futurs clients | qualification discrète, méthode versionnée, aucune interpolation dans M2 | retirer la revendication et comparer aux références en M4 | mainteneur | ouvert |

## Évaluation

- probabilité : faible, moyenne, forte ;
- impact : faible, moyen, haut, critique ;
- exposition : appréciation combinée, jamais utilisée comme précision fictive ;
- acceptation : toujours attribuée à un responsable avec date de réexamen.

## Catégories à examiner

- valeur produit et adoption ;
- métier et erreurs de modèle ;
- technique et dépendances ;
- données, sécurité et confidentialité ;
- exploitation et continuité ;
- accessibilité et UX ;
- juridique, licence et commercialisation ;
- compétences, temps et financement.
