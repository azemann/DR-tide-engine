# ADR-0006 — Isoler les données et le calcul Neaps derrière les ports du domaine

- **Statut :** accepté
- **Date :** 2026-07-25
- **Décideurs :** mainteneur de DR Tide Engine
- **Remplace :** aucune ADR

## Contexte

La première tranche doit charger des stations TICON distribuées par
`@neaps/tide-database` et produire une vraie somme harmonique. Le paquet de
données ne fournit pas de calculateur en dépendance d'exécution. Le paquet
agrégateur `neaps` réunit recherche et prédiction, mais exposerait une frontière
plus large que nécessaire et laisserait ses types circuler dans le moteur.

La politique de licence et la sémantique de la série appartiennent à DR Tide
Engine. Elles ne doivent dépendre ni d'une forme JSON amont ni d'une CLI tierce.

## Options examinées

### Option A — Dépendre du paquet agrégateur `neaps`

Cette option fournit des stations enrichies de méthodes de prédiction. Elle
réduit le code d'intégration, mais couple sélection, données et calcul et rend la
politique de licence plus difficile à isoler.

### Option B — Adapter séparément la base et le calculateur

`@neaps/tide-database` implémente `StationRepository` et
`@neaps/tide-predictor` implémente `TidePredictor`. Le domaine possède ses types,
ses erreurs et ses invariants. Les versions sont exactes et verrouillées.

### Option C — Réimplémenter immédiatement le calcul harmonique

Cette option donnerait un contrôle total, mais introduirait un algorithme non
validé alors que la mission exige le moteur réel disponible dans l'écosystème
source.

## Décision

Retenir l'option B. Une `PredictionRequest` contient une `HarmonicStation`
normalisée. La CLI résout d'abord l'identifiant auprès du dépôt, puis appelle le
prédicteur. Une licence dont `commercialUse` n'est pas vraie est refusée avant
le calcul.

La première série utilise une fenêtre UTC semi-ouverte et expose l'ordonnée
brute du calculateur sans offset de datum. Elle n'est pas qualifiée pour la
navigation ou comme hauteur officielle.

## Conséquences

### Positives

- le domaine ne dépend d'aucun format ou type Neaps ;
- données et calculateur peuvent évoluer ou être remplacés séparément ;
- la licence est contrôlée à une frontière unique ;
- les futurs détecteurs d'extrema consommeront `TideSeries`, pas Neaps.

### Négatives ou coûts

- deux adaptateurs et deux dépendances doivent être maintenus ;
- le mapping externe doit être vérifié à chaque mise à jour ;
- la hauteur reste brute jusqu'au jalon de validation verticale.

## Validation ou réexamen

Réexaminer si le calculateur ne couvre plus les constituants nécessaires, si le
format de station change de manière incompatible ou avant de publier des
hauteurs associées à un datum.
