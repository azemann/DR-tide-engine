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
| Diagnostic | trous, doublons, ordre, pas, bornes et valeurs non finies | séries synthétiques avec `node:test` | chaque changement du diagnostic |
| Observatoire | instantané des deux stations et routes HTTP autorisées | `npm run observatory:data`, serveur loopback et recette | chaque changement d'interface |
| Manuel | sens de la hauteur et attribution | revue documentaire | avant release |
| Visuel | interface locale responsive et accessible | matrice de `docs/065_Validation_Visuelle.md` | chaque changement d'interface |

## Définition de terminé

- [ ] critères d’acceptation satisfaits ;
- [ ] invariants préservés ;
- [ ] erreurs importantes couvertes ;
- [ ] documentation cohérente ;
- [ ] états visuels et formats cibles vérifiés ;
- [ ] clavier, focus, contraste et mouvement réduit vérifiés ;
- [ ] aucune donnée sensible ou secret ajouté ;
- [ ] migration et retour arrière définis si nécessaires.

L'instantané de l'observatoire est généré et ignoré par Git : il ne constitue
pas une donnée persistante à migrer. Le retour arrière consiste à supprimer
l'outil local ; les contrats et la CLI du moteur restent inchangés.
