import { near } from "@neaps/tide-database";
import { mkdir, readFile, writeFile } from "node:fs/promises";

const places = JSON.parse(
  await readFile(new URL("../data/places.json", import.meta.url), "utf8")
);

function stationSummary(station, distanceKm) {
  return {
    id: station.id,
    name: station.name,
    country: station.country ?? null,
    region: station.region ?? null,
    latitude: station.latitude,
    longitude: station.longitude,
    distanceKm: Number(distanceKm.toFixed(2)),
    type: station.type ?? null,
    source: station.source ?? null,
    license: station.license ?? null,
    datum: station.datum ?? null,
    constituentCount: Array.isArray(station.harmonic_constituents)
      ? station.harmonic_constituents.length
      : 0,
    validationStatus: "candidate"
  };
}

const report = {
  generatedAt: new Date().toISOString(),
  perimeter: "Côte Fleurie V1",
  publicationRule:
    "Aucune station n'est publiable avant validation de sa licence, de son datum et de sa précision.",
  places: []
};

for (const place of places) {
  const candidates = near({
    latitude: place.latitude,
    longitude: place.longitude,
    maxDistance: 100,
    maxResults: 15
  }).map(([station, distanceKm]) => stationSummary(station, distanceKm));

  report.places.push({ ...place, candidates });

  console.log(`\n=== ${place.name} ===`);
  for (const candidate of candidates.slice(0, 8)) {
    console.log(
      `${candidate.distanceKm.toFixed(2).padStart(7)} km | ${candidate.name} | ` +
      `licence=${candidate.license?.type ?? "INCONNUE"} | ` +
      `commercial=${candidate.license?.commercial_use ?? "INCONNU"} | ` +
      `datum=${candidate.datum ?? "INCONNU"} | ` +
      `constituants=${candidate.constituentCount}`
    );
  }
}

const outputDir = new URL("../data/generated/", import.meta.url);
await mkdir(outputDir, { recursive: true });
await writeFile(
  new URL("inventory-results.json", outputDir),
  JSON.stringify(report, null, 2) + "\n",
  "utf8"
);

console.log("\nRapport écrit dans data/generated/inventory-results.json");
