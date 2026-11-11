export const site = {
  name: "Naima Studio di Bellezza",
  founder: "Naima Natoli",
  email: "naima.natoli90@gmail.com",
  phoneDisplay: "+39 346 370 7680",
  phoneE164: "+393463707680",
  whatsappNumber: "393463707680",
  street: "Via Camillo Benso Conte di Cavour 4",
  /**
   * The exact municipality, postal code and coordinates are not confirmed.
   * Do not present the activity area as a complete postal address.
   */
  activityArea: "Territorio di Messina, Sicilia",
  country: "Italia",
  countryCode: "IT",
  founded: "2016",
  copyrightYear: 2026,
  movedToSicily: "2024",
  experienceYears: 15,
  timezone: "Europe/Rome",
  instagram: {
    studio: "https://www.instagram.com/naimanatoli_studiodibellezza/",
    studioHandle: "@naimanatoli_studiodibellezza",
    makeup: "https://www.instagram.com/naimanatoli_makeupartist/",
    makeupHandle: "@naimanatoli_makeupartist",
  },
  /**
   * Public brand site, verified before linking.
   * No logo is shipped: usage rights were not provided.
   */
  partner: {
    name: "La Truccheria Cherie",
    url: "https://www.latruccheriacherie.com/",
  },
  mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Via Camillo Benso Conte di Cavour 4")}`,
} as const;
