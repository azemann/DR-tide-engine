# Qualité et tests

## Risques prioritaires

- {{QUALITY_RISK_1}}
- {{QUALITY_RISK_2}}

## Stratégie

| Niveau | Ce qui est validé | Outil ou protocole | Fréquence |
| --- | --- | --- | --- |
| Statique | types, style, erreurs évidentes | {{STATIC_CHECK}} | chaque changement |
| Unitaire | règles isolées | {{UNIT_TEST}} | chaque changement |
| Intégration | frontières et données | {{INTEGRATION_TEST}} | {{INTEGRATION_FREQUENCY}} |
| Parcours | cas d’usage critiques | {{E2E_TEST}} | {{E2E_FREQUENCY}} |
| Manuel | UX et cas difficiles à automatiser | {{MANUAL_PROTOCOL}} | {{MANUAL_FREQUENCY}} |
| Visuel | responsive, thèmes, composants et états | captures ou recette | chaque changement visuel important |

## Définition de terminé

- [ ] critères d’acceptation satisfaits ;
- [ ] invariants préservés ;
- [ ] erreurs importantes couvertes ;
- [ ] documentation cohérente ;
- [ ] états visuels et formats cibles vérifiés ;
- [ ] clavier, focus, contraste et mouvement réduit vérifiés ;
- [ ] aucune donnée sensible ou secret ajouté ;
- [ ] migration et retour arrière définis si nécessaires.
