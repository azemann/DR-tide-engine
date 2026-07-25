# DR Tide Observatory

Instrument local de développement pour visualiser un instantané JSON produit
par DR Tide Engine. Il ne contient aucun calcul de marée et n'est pas un client
public.

## Utilisation

```bash
npm run observatory -- --date 2026-07-25
```

La commande génère les séries d'Ouistreham et du Havre, calcule leurs
diagnostics structurels, puis sert la page sur
`http://127.0.0.1:4173`.

Pour séparer les deux opérations :

```bash
npm run observatory:data -- --date 2026-07-25
npm run observatory:serve
```

Le fichier `data/generated/observatory-data.json` est local et ignoré par Git.
La page affiche les ordonnées harmoniques brutes sans les qualifier de hauteurs
officielles. Elle ne détecte encore aucun événement de marée.
