# Métriques et garde-fous

## Résultat principal

| Métrique | Définition | Source | Fenêtre | Segments | Cible | Limites |
| --- | --- | --- | --- | --- | --- | --- |
| conformité structurelle d'une série | aucune date invalide, valeur non finie, lacune, duplication, désordre, irrégularité, hors-fenêtre ou désalignement | `TideSeriesDiagnostics` | une requête | station et date UTC | vraie pour chaque sortie publiable | ne mesure ni l'exactitude ni le datum |

## Pilotes

| Pilote | Relation attendue | Mesure | Action possible |
| --- | --- | --- | --- |
| effectif | correspond à durée / pas | observé contre attendu | refuser ou diagnostiquer le résultat |
| chronologie | tous les instants sont strictement croissants | booléen et doublons | corriger l'adaptateur, jamais trier silencieusement |
| régularité | chaque écart correspond au pas | booléen, lacunes et désalignements | corriger le producteur |
| finitude | chaque hauteur est numérique et finie | compteur | refuser le chemin publiable |
| bornes brutes | minimum, maximum et amplitude de la série | valeurs finies | observer la forme sans qualifier le niveau vertical |

## Garde-fous

| Garde-fou | Dégradation interdite | Seuil | Réponse |
| --- | --- | --- | --- |
| qualité temporelle | trou, doublon, désordre, hors-fenêtre ou désalignement | zéro | état dégradé et blocage avant publication |
| qualité numérique | hauteur non finie | zéro | erreur ou état dégradé explicite |
| provenance | source ou licence absente du résultat | zéro | ne pas publier |
| qualification | hauteur présentée comme officielle ou navigable | zéro | corriger le client et conserver AUD-004 ouvert |

## Règles

- ne pas optimiser une métrique isolée au détriment du système ;
- versionner les définitions ;
- distinguer mesure produit, métrique technique et indicateur commercial ;
- documenter biais, données manquantes et changements d’instrumentation.
- ne jamais transformer un diagnostic structurel réussi en preuve scientifique.
