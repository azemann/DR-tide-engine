# Validation visuelle

## Formats minimaux

| Cible | Largeur de référence | Vérifications principales |
| --- | ---: | --- |
| téléphone compact | 360 px | débordement, clavier, actions, lisibilité |
| téléphone courant | 390–430 px | hiérarchie, tactile, navigation |
| fold déplié / petite tablette | 600–800 px | recomposition et continuité |
| tablette | 768–1024 px | panneaux et densité |
| bureau | 1280–1440 px | largeur, raccourcis et multi-panneaux |

Les valeurs sont des références de test, pas des catégories d’appareils supposées rigides. Le contenu détermine les points de rupture.

## Matrice de contrôle

- [x] aucun débordement horizontal de page observé ; la courbe possède son propre
  conteneur de défilement ;
- [x] contenu essentiel disponible sans dépendre du survol ;
- [x] unique contrôle d'au moins 48 px ;
- [x] parcours clavier natif et focus global visible ;
- [x] contraste des rôles textuels et du focus mesuré ;
- [x] zoom utilisateur non verrouillé ;
- [x] mouvement réduit respecté par les tokens globaux ;
- [x] états vide, chargement, erreur, indisponible et dégradé implémentés ;
- [x] thème et tokens canoniques consommés ;
- [x] absence de texte coupé confirmée par inspection aux cinq largeurs ;
- [x] changement de taille sans perte de la station sélectionnée.

## Preuves attendues

Pour une modification visuelle importante, conserver des captures des formats touchés ou une recette reproductible. Une validation technique réussie ne remplace pas l’inspection du rendu.

## Recette reproductible de l'observatoire

1. `npm run observatory:data -- --date 2026-07-25` ;
2. `npm run observatory:serve` ;
3. ouvrir `http://127.0.0.1:4173` ;
4. vérifier 360, 390, 768, 1024 et 1280 px ;
5. parcourir le sélecteur au clavier et activer le mouvement réduit ;
6. supprimer temporairement l'instantané local pour observer l'indisponibilité.

## Preuve M3

Le 2026-07-26 :

- des captures pleine page chargées ont été inspectées à 360, 390, 768, 1024
  et 1280 px avec Firefox headless et WebDriver BiDi ;
- Ouistreham et Le Havre ont été vérifiées après interaction réelle avec le
  sélecteur ;
- les vues temporaires ne sont pas committées afin de ne pas versionner
  d'artefacts générés volumineux ;
- les contrastes WCAG des rôles textuels réellement utilisés vont de 6,09:1 à
  18,10:1 selon la paire ; le focus visible atteint au minimum 8,93:1 ;
- le contrat d'instantané v2, le serveur et les routes autorisées sont vérifiés
  séparément.
- après l'ajout du double affichage temporel, le mainteneur a confirmé dans
  l'observatoire réel la présence de l'UTC et de l'heure locale de Normandie ;
  la modification conserve les mêmes composants et points de rupture.
