# Système de design

## Source canonique

Les valeurs visuelles de référence sont déclarées dans `design/tokens.css`. Les implémentations propres à une plateforme doivent traduire ces rôles sans en changer silencieusement le sens.

## Hiérarchie des tokens

1. **primitifs** : couleurs, dimensions et durées brutes ;
2. **sémantiques** : fond, surface, texte, accent, danger ;
3. **composants** : bouton principal, panneau, champ, badge ;
4. **exceptions de projet** : rares, documentées et locales.

## Composants fondamentaux

La première interface n'utilise que les composants nécessaires :

- `AppShell` : largeur bornée, en-tête, contenu et pied ;
- `Panel` : regroupement d'une responsabilité observable ;
- `StationSelect` : unique contrôle, cible de 48 px et libellé visible ;
- `Badge` : état court toujours complété par un texte ou un détail ;
- `MetricCard` : libellé et valeur comparables ;
- `SeriesChart` : SVG accessible, axe UTC et description textuelle ;
- `EventMarker` : cercle libellé PM/BM ou segment de plateau, avec titre SVG ;
- `EventCard` : type, temps UTC, valeur brute, qualification et méthode ;
- `LoadingState`, `EmptyState`, `ErrorState` : états structurels ;
- `AuditList` et `ProgressList` : preuves issues des documents canoniques.

Il n'existe ni navigation, ni dialogue, ni toast, ni action destructive dans
cette tranche.

## États de composant

Chaque composant interactif pertinent définit : repos, survol, focus, actif, sélectionné, désactivé, chargement, succès et erreur.

## Grille et espacement

- grille fondée sur 4 px ;
- rythme courant : 8, 12, 16, 24, 32 et 48 px ;
- largeur de lecture bornée ;
- espace plus grand entre groupes qu’entre éléments d’un même groupe ;
- aucune valeur ponctuelle sans justification lorsqu’un token convient.

## Adaptation par plateforme

- **web/PWA :** pointeur, clavier, tactile, redimensionnement et installation ;
- **Android :** zones sûres, clavier logiciel, bouton retour et changement de posture ;
- **Linux/bureau :** densité maîtrisée, menus contextuels et raccourcis ;
- **Windows/macOS :** conventions natives préservées par les adaptateurs d’interface.

## Documentation d’un composant

Chaque composant partagé précise : intention, anatomie, variantes, états, comportement responsive, clavier, accessibilité et exemples à éviter.

## Implémentation actuelle

`tools/observatory/styles.css` consomme les tokens canoniques sans les redéfinir.
Le point de rupture principal recompose les panneaux en une colonne. La courbe
peut défiler horizontalement sur petit écran afin de préserver ses axes sans
créer de débordement de page.

Le groupe d'événements utilise deux colonnes au-dessus de 768 px et une colonne
en dessous. Les marqueurs restent associés à une liste textuelle : le graphique
n'est jamais l'unique accès aux horaires.
