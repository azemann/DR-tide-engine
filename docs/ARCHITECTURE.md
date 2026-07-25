# Architecture de DR Tide Engine

## État de cette architecture

Ce document distingue la première tranche réellement implémentée de
l'architecture cible. Une présence dans la cible ne constitue pas une capacité.

## Principe invariant

Le moteur ne connaît ni Alexa, ni HTTP, ni interface graphique, ni appareil
particulier. Les formats tiers sont traduits à leur frontière et aucune logique
de marée ne vit dans la CLI.

```text
source de données
        ↓
adaptateur de station
        ↓
station harmonique du domaine
        ↓
adaptateur du calculateur
        ↓
série temporelle brute
        ↓
diagnostic structurel pur
```

## Première tranche

| Composant | Responsabilité | Dépendances autorisées |
| --- | --- | --- |
| `domain` | types, invariants, ports et erreurs stables | aucune dépendance externe |
| `application` | orchestrer le chargement d'une station et sa prédiction | `domain` |
| `adapters/neaps/station-repository` | traduire et filtrer les stations Neaps | `domain`, `@neaps/tide-database` |
| `adapters/neaps/tide-predictor` | traduire la requête et le résultat du calculateur | `domain`, `@neaps/tide-predictor` |
| `cli/predict` | valider les arguments, assembler le cas d'usage et sérialiser | `application`, `domain` et adaptateurs |
| `domain/tide-series-diagnostics` | mesurer la qualité interne sans mutation ni validation scientifique | `domain` |
| `scripts/generate-observatory-data` | produire un instantané local depuis les contrats existants | sortie compilée, documents canoniques et Git |
| `tools/observatory` | visualiser l'instantané sans calcul métier | JSON généré et tokens de design |

Le port de données est :

```ts
interface StationRepository {
  findById(id: StationId): Promise<HarmonicStation | null>;
}
```

Le port de calcul est :

```ts
interface TidePredictor {
  predict(request: PredictionRequest): Promise<TideSeries>;
}
```

`PredictionRequest` reçoit une `HarmonicStation` déjà normalisée, et non un
identifiant. La résolution et la politique de licence restent ainsi hors du
calculateur, qui ne dépend d'aucun dépôt.

Le cas d'usage `GenerateTideSeries` porte l'orchestration réutilisable. Cet
ajout évite de placer dans la CLI le traitement d'une station inconnue et
permettra aux futurs clients d'appeler le même parcours.

## Frontière d'observation

`analyzeTideSeries` est une fonction pure du domaine. Elle compte les anomalies
et les bornes numériques observables sans corriger la série, qualifier son datum
ou juger son exactitude.

L'observatoire local est un client de développement remplaçable :

```text
TideSeries + TideSeriesDiagnostics + sources de vérité du projet
                            ↓
                   instantané JSON ignoré
                            ↓
                  page HTML de visualisation
```

Le navigateur ne dépend pas de Neaps et ne reçoit aucun port du moteur. Il ne
peut produire ni hauteur ni événement. ADR-0007 formalise cette frontière.

## Contrat temporel

Une journée civile demandée par la CLI devient la fenêtre UTC semi-ouverte
`[00:00:00.000Z, 00:00:00.000Z le lendemain[`. Avec un pas de cinq minutes,
elle contient exactement 288 instants. `endUtc` est la borne exclusive.

## Sources de vérité

| Information | Source canonique |
| --- | --- |
| identité, constantes, source et licence de station | `StationRepository` adapté depuis la version npm verrouillée |
| invariants des requêtes et séries | types et constructeurs du domaine |
| calcul harmonique | adaptateur `TidePredictor` et version verrouillée du calculateur |
| sérialisation CLI | sérialiseur explicite de la commande `predict` |
| diagnostic structurel | `domain/tide-series-diagnostics` |
| avancement affiché | `docs/050_Roadmap.md` et `docs/095_Registre_Audit.md` lus à la génération |
| présentation locale | instantané généré, jamais une nouvelle source de vérité |
| commandes vérifiées | `project.yaml` |
| état réellement atteint | `PROJECT_STATE.md` |

## Architecture cible non implémentée

- détection de pleine mer, basse mer et étale ;
- validation par rapport à des références externes ;
- corrections locales Côte Fleurie ;
- exports annuels, API et clients.

## Ordre de réalisation

1. charger et filtrer Ouistreham et Le Havre ;
2. produire et tester une série brute sur 24 heures ;
3. valider la série et ses contrats ;
4. détecter automatiquement les extrema ;
5. comparer aux références ;
6. concevoir ensuite les corrections et clients.

## Risques architecturaux

- dérive de format ou de licence dans la base externe ;
- confusion entre hauteur harmonique brute et hauteur officielle ;
- couplage involontaire du domaine à une version de Neaps ;
- ajout prématuré de concepts d'événements ou de communes dans le calcul brut.
- confusion entre diagnostic structurel et validation scientifique ;
- dérive de l'observatoire vers une seconde implémentation métier.
