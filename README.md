# Naima Studio di Bellezza

Site vitrine de l'institut de Naima Natoli, dans le territoire de Messine. Réalisé par KIBŌ. Langue par défaut : italien. Français et anglais sur les mêmes pages.

Le site n'est pas en production. L'indexation Google est désactivée tant que `NEXT_PUBLIC_SITE_INDEXABLE` n'est pas `true`.

## Lancer en local

```bash
npm install
npm run dev
```

Le site répond sur `http://localhost:3000`. `/` redirige vers `/it`.

```bash
npm test
npm run lint
npm run typecheck
npm run build
```

## Variables

Copier `.env.example`. Ne jamais committer de secret.

| Variable | Rôle |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | URL canonique, Open Graph, sitemap. À poser avant la mise en ligne. |
| `NEXT_PUBLIC_SITE_INDEXABLE` | `false` par défaut. `true` seulement après validation de l'adresse, des pages légales et du domaine. |
| `NEXT_PUBLIC_CAL_USERNAME` | Identifiant Cal.com de Naima. Vide tant que le compte n'existe pas. |
| `NEXT_PUBLIC_CAL_EVENT_*` | Slug de chaque prestation (`NAILS`, `LASHES`, `MAKEUP`, `LASER`, `HEAD_SPA`). |
| `CONTACT_WEBHOOK_URL` | Endpoint qui reçoit le formulaire. Sans cette variable, le formulaire dit clairement qu'il n'envoie rien. |
| `CONTACT_WEBHOOK_TOKEN` | Jeton serveur, jamais préfixé `NEXT_PUBLIC_`. |

## Ce qui fonctionne

- Pages en italien, français et anglais, avec URL localisées.
- WhatsApp, téléphone, e-mail, Instagram, recherche Google Maps sur la voie communiquée.
- Formulaire : validation, anti-spam, réponse honnête si aucun transport n'est configuré.
- Portfolio et avis vides, sans photo générique ni témoignage inventé.
- Prix et durées absents, avec une phrase qui le dit.
- Réservation : message « bientôt disponible » et WhatsApp. Aucun faux créneau.
- `robots.txt` bloque l'indexation. Brouillons de privacy et cookies marqués comme tels.

## Ce qui attend Naima

- Commune, CAP, coordonnées, horaires.
- Partita IVA et forme juridique, pour valider les pages légales.
- Logo, photos de l'institut, réalisations, avant/après avec accord, certifications si elle veut les montrer.
- Avis réels, s'ils sont sourcés.
- Durées et tarifs, s'ils doivent être publiés.
- Compte Cal.com à son nom, Google Calendar, essai d'un rendez-vous complet.
- Domaine final.
- Un transport d'e-mail déjà payé par KIBŌ, si le formulaire doit envoyer.

Les fichiers d'images se branchent dans `src/config/media.ts` et `src/config/portfolio.ts`. Tant que la valeur est `null` ou la liste est vide, la page ne montre pas d'image.

## Cal.com et Google Calendar

Le compte doit appartenir à Naima. Ne pas en créer un à sa place.

1. Créer le compte sur [cal.com](https://cal.com) avec `naima.natoli90@gmail.com`.
2. Fuseau `Europe/Rome`. Y poser les horaires, les pauses et les congés.
3. Connecter Google Calendar. Vérifier qu'un événement créé dans Cal.com apparaît dans l'agenda, et qu'un événement de l'agenda bloque un créneau.
4. Créer un type d'événement par prestation, avec la durée réelle. Pas de paiement.
5. Copier le nom d'utilisateur et les slugs dans les variables `NEXT_PUBLIC_CAL_*`.
6. Déployer une preview. Ouvrir `/it/prenotazioni`, choisir une prestation, accepter le module Cal.com, réserver un créneau test, recevoir la confirmation, puis l'annuler.
7. Tant que cette réservation test n'a pas réussi, le site ne doit pas présenter le calendrier comme ouvert. Sans les variables, le bouton reste sur WhatsApp.

Le module Cal.com n'est chargé qu'après une case de consentement. Setmore gratuit est l'alternative si Cal.com ne convient pas. Ne pas brancher les deux.

## Formulaire

`CONTACT_WEBHOOK_URL` reçoit un JSON `{ name, email, message, locale, site }`. Si `CONTACT_WEBHOOK_TOKEN` est défini, il part en `Authorization: Bearer`. Aucune clé n'est exposée au navigateur.

Sans URL, l'envoi répond `unconfigured` et la page le dit. WhatsApp et l'e-mail restent les canaux réels.

## Vercel

La CLI n'est pas installée dans cet environnement. Pour une preview, sans promouvoir la production et sans poser le domaine final :

```bash
npm i -g vercel
vercel login
vercel link
vercel env pull
vercel deploy
```

Garder `NEXT_PUBLIC_SITE_INDEXABLE=false` sur la preview. Poser `NEXT_PUBLIC_SITE_URL` sur l'URL de preview si les liens canoniques doivent y pointer. La mise en production et le domaine se font après validation de Mike.

## Google Business Profile

Naima n'a pas de fiche. Étapes, à faire par elle :

1. [business.google.com](https://business.google.com) avec le compte qui doit rester propriétaire.
2. Créer la fiche au nom Naima Studio di Bellezza, catégorie centre esthétique, adresse complète une fois le CAP et la commune confirmés.
3. Valider par le moyen proposé par Google (carte, téléphone ou e-mail).
4. Ajouter le téléphone, le site, les horaires et des photos autorisées.
5. Relier ensuite Google Search Console sur le domaine final. Le sitemap sera `https://domaine/sitemap.xml`.

Aucun classement Google n'est garanti.

## Données structurées

Le schéma BeautySalon n'inclut que le nom, la fondatrice, le téléphone, l'e-mail, la voie et la zone d'activité. Pas d'horaires, pas de note, pas de coordonnées tant qu'elles ne sont pas confirmées.
