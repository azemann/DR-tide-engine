# Données et schémas

## Inventaire canonique

| Donnée/agrégat | Identité stable | Source de vérité | Création | Mutation | Suppression | Sensibilité |
| --- | --- | --- | --- | --- | --- | --- |
| Station harmonique | `StationId` | adaptateur depuis la version verrouillée de `@neaps/tide-database` | lecture à la demande | immuable durant l'exécution | remplacement de dépendance | publique avec licence |
| Série de marée | station + fenêtre + pas | sortie de `TidePredictor` | recalcul local | immuable | fin d'exécution | dérivée, non sensible |
| Diagnostic de série | identité de la série source | `analyzeTideSeries` | calcul pur | immuable | fin d'exécution | dérivée, non sensible |
| Résultat d'événements | station + fenêtre + méthode | `detectTideEvents` | calcul pur | immuable | fin d'exécution | dérivée, non sensible |
| Instantané d'observatoire | date de génération + schéma | script de génération, non canonique | fichier local recalculable | remplacé à chaque génération | suppression libre | développement, non sensible |

## Distinctions métier

Documenter ici les concepts techniquement proches mais non interchangeables, par exemple identité/emplacement, direct/enregistrement, source/donnée dérivée ou fichier/ressource.

| Concept A | Concept B | Différence opératoire | Risque de confusion |
| --- | --- | --- | --- |
| constante harmonique | hauteur brute | entrée stationnaire contre résultat temporel calculé | prendre une amplitude de constituant pour une hauteur |
| hauteur brute | observation | calcul contre mesure physique | revendiquer une exactitude non prouvée |
| diagnostic structurel | validation scientifique | cohérence interne contre comparaison externe | conclure que zéro anomalie signifie une marée juste |
| événement discret | événement de référence | extremum échantillonné contre horaire publié ou observé | présenter M2 comme validé scientifiquement |
| instantané | source de vérité | copie recalculable contre document ou dépendance canonique | laisser l'interface définir l'état du projet |

## Schémas et versions

| Schéma | Format | Version actuelle | Compatibilité lecture | Compatibilité écriture | Emplacement |
| --- | --- | --- | --- | --- | --- |
| `TideSeries` | JSON / types TypeScript | contrat 0.1.0 | stricte dans la tranche M1 | sérialisation déterministe | `src/domain/prediction.ts` |
| `TideSeriesDiagnostics` | objet TypeScript inclus dans l'instantané | contrat 0.1.0 | stricte | génération locale seulement | `src/domain/tide-series-diagnostics.ts` |
| `TideEventsResult` | objet TypeScript | méthode `discrete-local-extremum-v1` | stricte dans M2 | génération pure seulement | `src/domain/tide-events.ts` |
| instantané d'observatoire | JSON | `schemaVersion: 1` | version exacte | remplacement atomique non garanti, usage local | `data/generated/observatory-data.json` |

## Import, export et portabilité

- le JSON de `TideSeries` est ouvert et indépendant des types Neaps ;
- la validation est effectuée aux frontières et les erreurs sont stables ;
- les identifiants, sources et licences sont conservés ;
- le snapshot local est dérivé, recalculable, ignoré par Git et non publiable.

## Migrations

Il n'existe aucune donnée persistante à migrer. Un changement de
`schemaVersion` de l'instantané doit maintenir temporairement la lecture ou
modifier ensemble générateur et page ; le retour arrière consiste à régénérer
avec la version précédente.
