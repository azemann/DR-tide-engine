import { InvalidStationIdError } from "./errors.js";

declare const stationIdBrand: unique symbol;

export type StationId = string & {
  readonly [stationIdBrand]: "StationId";
};

export interface StationMetadata {
  readonly name: string;
  readonly latitude: number;
  readonly longitude: number;
  readonly timezone: string;
  readonly country: string;
  readonly region?: string;
}

export interface StationSource {
  readonly name: string;
  readonly stationId: string;
  readonly url: string;
  readonly publishedHarmonics: boolean;
}

export interface StationLicense {
  readonly type: string;
  readonly commercialUse: boolean;
  readonly url: string;
  readonly notes?: string;
}

export interface HarmonicConstituent {
  readonly name: string;
  readonly amplitude: number;
  readonly phase: number;
}

export interface HarmonicStation {
  readonly id: StationId;
  readonly metadata: StationMetadata;
  readonly source: StationSource;
  readonly license: StationLicense;
  readonly harmonicConstituents: readonly HarmonicConstituent[];
}

const STATION_ID_PATTERN =
  /^[a-z0-9][a-z0-9._-]*\/[a-z0-9][a-z0-9._-]*$/;

export function createStationId(value: string): StationId {
  if (!STATION_ID_PATTERN.test(value)) {
    throw new InvalidStationIdError(value);
  }

  return value as StationId;
}
