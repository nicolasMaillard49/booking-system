# Homepage Redesign - Planity-Inspired Design

**Date:** 2026-03-16
**Approach:** C - Nouvelle page separee (v2), ancien code intact

## Decisions

- **Pas de categories** : les services restent une liste plate (sortOrder)
- **3 onglets** : Prendre RDV / Avis (placeholder) / A-propos
- **Header compact** : nom, adresse, telephone, description — pas de galerie photo
- **Sous-titre dynamique** : adapte selon autoConfirm (true = "Confirmation immediate", false = "Confirmation sous 24h")
- **Style sobre** : fond blanc/noir, typo nette, accents minimaux — SAUF les cards de prestation en Liquid Glass Apple
- **Dark mode conserve** : le design s'adapte light et dark
- **Google Maps** : iframe embed (pas de cle API)
- **Horaires publics** : nouvel endpoint backend exposant les availability rules

## Layout

```
+---------------------------------------------+
|  Header compact (nom, adresse, tel)          |
|  + ThemeToggle + sous-titre dynamique        |
+-------------+-------------+-----------------+
| Prendre RDV |    Avis     |   A-propos      |  <- Onglets
+-------------+-------------+-----------------+
|                                               |
|  Contenu de l'onglet actif                    |
|                                               |
+-----------------------------------------------+
```

- Max-width 1176px centre
- Fond blanc / dark: fond noir
- Pas d'orbes, pas de hero geant

## Header compact

- Nom du salon en h1 bold (~text-2xl)
- Adresse et telephone en gris secondaire
- Description si presente
- Badge sous-titre dynamique base sur autoConfirm

## Onglets

- 3 onglets horizontaux, texte noir, actif = bordure bottom noire 2px
- Dark: texte blanc, bordure blanche
- Reactif (pas de route separee), mobile = largeur egale

## Onglet "Prendre RDV" - Cards prestation

- Liste verticale pleine largeur (1 colonne)
- Separateur fin entre chaque card
- Card Liquid Glass Apple : fond semi-transparent, backdrop-filter blur, bordure subtile
- Hover : translateY(-2px), ombre intensifiee, shimmer subtil
- Contenu : nom bold, description gris, duree badge, prix badge (si visible), chevron >
- Click -> navigation vers /{serviceId}
- Dark : fond noir semi-transparent, bordure blanche subtile

## Onglet "Avis"

- Placeholder : icone + texte "Les avis seront bientot disponibles"

## Onglet "A-propos"

- Google Maps iframe embed (adresse encodee)
- Infos : adresse, telephone, email
- Horaires d'ouverture (lundi-dimanche, "Ferme" si aucun creneau)
- Description longue

## Nouveaux fichiers

### Frontend
- `pages/booking/v2.vue` — page principale
- `components/v2/BusinessHeader.vue` — header compact
- `components/v2/TabBar.vue` — onglets
- `components/v2/ServiceList.vue` — liste services
- `components/v2/ServiceCardV2.vue` — card Liquid Glass Apple
- `components/v2/ReviewsTab.vue` — placeholder avis
- `components/v2/AboutTab.vue` — carte, infos, horaires
- `composables/useAvailabilityHours.ts` — appel endpoint horaires

### Backend
- Route publique `GET /booking/availability/hours` dans le module availability

### Fichiers NON modifies
- `pages/booking/index.vue` — intact
- `components/ServiceCard.vue` — intact
- `assets/styles/global.css` — intact (reutilise .liquid-glass / .glass-card)
