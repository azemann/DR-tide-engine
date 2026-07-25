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

- [x] aucun débordement horizontal de page prévu ; la courbe possède son propre
  conteneur de défilement ;
- [x] contenu essentiel disponible sans dépendre du survol ;
- [x] unique contrôle d'au moins 48 px ;
- [x] parcours clavier natif et focus global visible ;
- [ ] contraste mesuré avec un outil dédié ;
- [x] zoom utilisateur non verrouillé ;
- [x] mouvement réduit respecté par les tokens globaux ;
- [x] états vide, chargement, erreur, indisponible et dégradé implémentés ;
- [x] thème et tokens canoniques consommés ;
- [ ] absence de texte coupé confirmée par inspection aux cinq largeurs ;
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

Le serveur, ses routes autorisées et le JSON ont été vérifiés le 2026-07-25.
L'inspection visuelle multi-largeur et la mesure instrumentée des contrastes
restent à produire avant de cocher les deux preuves correspondantes.
