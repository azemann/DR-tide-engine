# Choix techniques

Les technologies sont choisies après la vision, le périmètre et le modèle métier.

## Contraintes de choix

- plateformes cibles : tout système disposant de Node.js 20 ou ultérieur ;
- fonctionnement hors ligne : calcul local après installation des dépendances ;
- volumétrie : 288 échantillons par station et journée dans la première tranche ;
- compétences disponibles : TypeScript, Node.js et tests natifs ;
- durée de vie visée : moteur maintenable et consommable par plusieurs clients.

## Chaîne technologique retenue

Ne pas confondre les catégories. Décrire la chaîne réelle, par composant si le dépôt est multi-stack :

```text
source → compilateur/interpréteur → runtime → dépendances → build → framework éventuel → artefact → plateforme d'exécution
```

Le détail calculable appartient à `project.yaml`. Le présent document explique les raisons, alternatives et risques des choix.

| Domaine | Choix | Raisons | Alternatives | Risques |
| --- | --- | --- | --- | --- |
| Langage(s) | TypeScript, JavaScript pour l'inventaire historique | contrats forts et écosystème de la source | JavaScript seul, Rust | types externes imparfaits |
| Compilateur/interpréteur | compilateur TypeScript `tsc` | contrôle strict et sortie JavaScript standard | exécution directe TS | étape de build locale |
| Runtime | Node.js 20 ou ultérieur | runtime déjà déclaré et clients multiplateformes | Deno, Bun | différences entre versions |
| Gestion des dépendances | npm avec `package-lock.json` | outil livré avec Node et installation reproductible | pnpm | taille des données installées |
| Build et tâches | npm scripts et `tsc` | chaîne minimale sans framework | bundler | build complet avant CLI |
| Frameworks/bibliothèques structurantes | aucun framework ; deux adaptateurs Neaps | réutiliser données et calcul réel sans importer leur modèle dans le domaine | paquet agrégateur `neaps`, calcul interne immédiat | dérive amont |
| Interface | CLI JSON et observatoire HTML local sans framework | prouver et comprendre la tranche sans devenir un client métier | API, application web | validation visuelle désormais nécessaire |
| Données | `@neaps/tide-database` version exacte | stations TICON et métadonnées de licence | copie locale des données | évolution des licences |
| Tests | `node:test` et `node:assert/strict` | aucune dépendance de test additionnelle | Vitest | moins d'outillage de mocks |
| Interface/design system | HTML, CSS, SVG et tokens existants | vue locale remplaçable sans dépendance | framework de graphiques | code de rendu à maintenir |

## Dépendances

- `@neaps/tide-database` distribue les stations ; le coût de remplacement est
  contenu dans `StationRepository`.
- `@neaps/tide-predictor` effectue le calcul réel ; le coût de remplacement est
  contenu dans `TidePredictor`.
- TypeScript et les types Node sont des dépendances de développement.
- Toute mise à jour est explicite, relit les licences, régénère le lockfile et
  exécute l'ensemble des preuves.

## Portabilité et sortie

Les contrats du domaine et le JSON ne reprennent pas les types externes. Un
nouvel adaptateur peut remplacer chaque paquet indépendamment. La base amont
n'est pas recopiée dans le dépôt.

## Versions supportées

Node.js 20 ou ultérieur. Les versions exactes des paquets et outils sont
verrouillées dans `package-lock.json`. La présente tranche est vérifiée avec le
runtime installé Node.js 24 ; la revalidation de la borne minimale Node 20 est
explicitement différée à la demande du mainteneur.

## Commandes et artefacts réels

Les commandes calculables vivent dans `project.yaml`. Le build de développement
émet `dist/` et l'observatoire émet un instantané sous `data/generated/`, tous
deux ignorés par Git. Le serveur écoute uniquement sur `127.0.0.1`. Aucun
package, release, publication ou déploiement n'est actif.
