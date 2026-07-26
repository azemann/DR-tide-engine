# Expérience utilisateur

## Question centrale

À quelle question immédiate l’écran principal doit-il répondre ?

> La série brute produite par le moteur est-elle structurellement saine,
> traçable et cohérente avec l'état documenté du projet ?

## Promesse d’expérience

Donner au mainteneur une lecture immédiate de la courbe, des diagnostics et des
limites scientifiques, sans laisser l'interface recalculer ou requalifier une
donnée.

## Principes UX

- montrer d’abord ce dont l’utilisateur a besoin pour décider ;
- révéler la complexité technique progressivement ;
- donner un retour immédiat après chaque action ;
- rendre les erreurs compréhensibles et réparables ;
- conserver la maîtrise des données et des actions sensibles ;
- ne jamais dépendre uniquement d’une couleur pour transmettre un état ;
- préserver les fonctions essentielles sans souris et sur petit écran.

## Architecture de l’information

| Espace | Question utilisateur | Contenu principal | Action principale |
| --- | --- | --- | --- |
| En-tête | quelle version et quel jalon sont observés ? | version, commit, maturité et avertissement | aucune |
| Série | quelle station et quelle fenêtre sont affichées ? | sélecteur, fenêtres UTC et locale, courbe à double axe horaire | changer de station |
| Événements | quand apparaissent les extrema discrets et comment sont-ils qualifiés ? | marqueurs PM/BM, heures UTC et locale, hauteur brute, qualification et méthode | inspecter |
| Diagnostics | la structure de la série est-elle saine ? | décompte, ordre, pas, valeurs invalides, bornes brutes | inspecter |
| Traçabilité | d'où viennent les valeurs ? | source, licence, adaptateurs et qualification | inspecter |
| Projet | qu'est-ce qui est prouvé ou encore ouvert ? | roadmap et registre d'audit issus des sources de vérité | revenir aux documents |

## Parcours principal

1. Le mainteneur génère un instantané pour une date UTC.
2. L'écran montre immédiatement la qualification brute et l'interdiction de
   navigation.
3. Le mainteneur choisit Ouistreham ou Le Havre.
4. La courbe, les événements, les métriques et la provenance se mettent à jour
   ensemble.
5. En cas d'instantané absent, la page donne la commande de régénération ; en
   cas de série dégradée, chaque compteur reste visible.

L'heure locale est toujours dérivée du fuseau IANA fourni par la série. L'UTC
reste affiché en premier et aucun décalage saisonnier n'est saisi manuellement.

## États obligatoires

Pour chaque écran ou bloc alimenté par des données, définir :

- initial ;
- chargement ou attente ;
- vide ;
- succès ;
- erreur récupérable ;
- indisponible ;
- dégradé ;
- hors ligne, lorsque pertinent.

L'observatoire local couvre chargement, vide, succès, erreur/indisponible et
dégradé. Il n'a pas d'état de mutation ou d'action sensible. Après chargement,
il reste utilisable sans accès à Internet.

## Responsive

Le projet ne conçoit pas « une version mobile réduite », mais une hiérarchie adaptée à chaque espace disponible.

- **téléphone compact :** une colonne, action principale immédiatement accessible ;
- **téléphone pliable :** continuité lors du changement de posture et largeur ;
- **tablette :** panneaux complémentaires sans étirer inutilement le contenu ;
- **bureau :** deux panneaux complémentaires lorsque la largeur le permet ;
- **grands écrans :** largeur de lecture bornée et espaces latéraux exploités avec intention.

## Accessibilité

- taille tactile minimale : 48 × 48 px ;
- focus clavier visible ;
- ordre de navigation logique ;
- contraste suffisant ;
- libellé accessible pour chaque icône interactive ;
- zoom utilisateur conservé ;
- support de `prefers-reduced-motion` ;
- textes compréhensibles sans jargon interne.

### Cible

Pour une interface web, viser WCAG 2.2 niveau AA. Pour une plateforme native, appliquer les recommandations d’accessibilité équivalentes de la plateforme et documenter les exceptions.

## Contenu et tonalité

- commencer par la situation et l’action utiles, puis proposer le détail technique ;
- employer les mots du glossaire dans le produit, avec des libellés compréhensibles par l’utilisateur ;
- nommer précisément les conséquences d’une action destructive ;
- préférer « Réessayer », « Reconfigurer » ou « Restaurer » à une erreur sans issue ;
- ne pas utiliser une formulation rassurante lorsque l’état réel est inconnu.

## Actions sensibles

Une confirmation décrit l’objet, la conséquence, la réversibilité et l’étape suivante. Les actions irréversibles ne sont jamais placées ou stylées comme une action ordinaire.
