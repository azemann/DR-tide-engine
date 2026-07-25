import {
  stationsById,
  type Station as NeapsStation,
} from "@neaps/tide-database";
import {
  StationLicenseRejectedError,
  StationNotHarmonicError,
} from "../../domain/errors.js";
import type { StationRepository } from "../../domain/ports.js";
import type {
  HarmonicConstituent,
  HarmonicStation,
  StationId,
} from "../../domain/stations.js";

function isFiniteConstituent(
  constituent: NeapsStation["harmonic_constituents"][number],
): boolean {
  return (
    constituent.name.length > 0 &&
    Number.isFinite(constituent.amplitude) &&
    Number.isFinite(constituent.phase)
  );
}

function adaptConstituent(
  constituent: NeapsStation["harmonic_constituents"][number],
): HarmonicConstituent {
  return {
    name: constituent.name,
    amplitude: constituent.amplitude,
    phase: constituent.phase,
  };
}

function adaptStation(station: NeapsStation, id: StationId): HarmonicStation {
  if (station.license.commercial_use !== true) {
    throw new StationLicenseRejectedError(id, station.license.type);
  }

  if (
    station.type !== "reference" ||
    station.harmonic_constituents.length === 0 ||
    !station.harmonic_constituents.every(isFiniteConstituent)
  ) {
    throw new StationNotHarmonicError(id);
  }

  return {
    id,
    metadata: {
      name: station.name,
      latitude: station.latitude,
      longitude: station.longitude,
      timezone: station.timezone,
      country: station.country,
      ...(station.region === undefined ? {} : { region: station.region }),
    },
    source: {
      name: station.source.name,
      stationId: String(station.source.id),
      url: station.source.url,
      publishedHarmonics: station.source.published_harmonics,
    },
    license: {
      type: station.license.type,
      commercialUse: station.license.commercial_use,
      url: station.license.url,
      ...(station.license.notes === undefined
        ? {}
        : { notes: station.license.notes }),
    },
    harmonicConstituents: station.harmonic_constituents.map(adaptConstituent),
  };
}

export class NeapsStationRepository implements StationRepository {
  public async findById(id: StationId): Promise<HarmonicStation | null> {
    const station = stationsById.get(id);
    return station === undefined ? null : adaptStation(station, id);
  }
}
