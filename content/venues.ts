export interface Venue {
  id: string;
  name: string;
  city: string;
  /** Which celebrations happen here, shown as the card's label. */
  events: string;
  /** The couple's shared Google Maps link — opens the place page. */
  mapUrl: string;
  /** Opens Google Maps navigation straight to the venue. */
  directionsUrl: string;
  /** Keyless embeddable map centred on the venue. */
  embedUrl: string;
}

function venue(
  v: Omit<Venue, "directionsUrl" | "embedUrl"> & { lat: number; lng: number },
): Venue {
  const { lat, lng, ...rest } = v;
  return {
    ...rest,
    directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
    embedUrl: `https://www.google.com/maps?q=${lat},${lng}&z=16&output=embed`,
  };
}

/** The wedding venues, in the order the celebrations happen. */
export const venues: Venue[] = [
  venue({
    id: "yamuna-inn",
    name: "Hotel Yamuna Inn",
    city: "Prayagraj, Uttar Pradesh",
    events: "Mehndi & Haldi",
    mapUrl: "https://maps.app.goo.gl/nsVBiJyafhW62gJYA",
    lat: 25.4107485,
    lng: 81.8426154,
  }),
  venue({
    id: "era-garden",
    name: "ERA Marriage Garden",
    city: "Prayagraj, Uttar Pradesh",
    events: "Wedding",
    mapUrl: "https://maps.app.goo.gl/b8Q5kzfSQvi2NNgF6",
    lat: 25.4086831,
    lng: 81.8400062,
  }),
];
