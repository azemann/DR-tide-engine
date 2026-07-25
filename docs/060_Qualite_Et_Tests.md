# Qualité et tests

## Risques prioritaires

- accepter une station incompatible avec l'usage commercial ;
- produire une série incomplète, non ordonnée ou contenant une valeur non finie ;
- masquer une évolution de la base ou du calculateur par une plage de versions ;
- présenter une hauteur brute comme une donnée officielle.

## Stratégie

| Niveau | Ce qui est validé | Outil ou protocole | Fréquence |
| --- | --- | --- | --- |
| Statique | types et contrats | `npm run typecheck` | chaque changement |
| Unitaire | identifiants, requêtes, sérialisation et erreurs | `node:test` | chaque changement |
| Intégration | stations et calculateur Neaps verrouillés | `npm test` | chaque changement de données ou dépendance |
| Parcours | commande Ouistreham sur une date fixe | `npm run predict` et validation JSON | chaque jalon |
| Manuel | sens de la hauteur et attribution | revue documentaire | avant release |
| Visuel | non applicable | aucune interface | tant qu'aucune UI n'existe |

## Définition de terminé

- [ ] critères d’acceptation satisfaits ;
- [ ] invariants préservés ;
- [ ] erreurs importantes couvertes ;
- [ ] documentation cohérente ;
- [ ] états visuels et formats cibles vérifiés ;
- [ ] clavier, focus, contraste et mouvement réduit vérifiés ;
- [ ] aucune donnée sensible ou secret ajouté ;
- [ ] migration et retour arrière définis si nécessaires.

Pour la première tranche, aucune migration, donnée persistante ou modification
visuelle n'existe. Le retour arrière consiste à restaurer les versions exactes
du lockfile et l'adaptateur précédent.
