import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { GenerateTideSeries } from "../src/application/generate-tide-series.js";
import { NeapsStationRepository } from "../src/adapters/neaps/station-repository.js";
import { NeapsTidePredictor } from "../src/adapters/neaps/tide-predictor.js";
import {
  StationLicenseRejectedError,
  StationNotFoundError,
} from "../src/domain/errors.js";
import { createStationId } from "../src/domain/stations.js";
import { runPredictCommand } from "../src/cli/predict.js";

const OUISTREHAM = createStationId(
  "ticon/ouistreham-311-fra-refmar",
);
const LE_HAVRE = createStationId("ticon/le_havre-4-fra-refmar");
const NON_COMMERCIAL = createStationId("ticon/a121tg-a12-nld-cmems");
const UNKNOWN = createStationId("ticon/unknown-station");
const START = new Date("2026-07-25T00:00:00.000Z");
const END = new Date("2026-07-26T00:00:00.000Z");

const repository = new NeapsStationRepository();
const predictor = new NeapsTidePredictor();
const generateTideSeries = new GenerateTideSeries(repository, predictor);

describe("NeapsStationRepository", () => {
  test("loads Ouistreham as a commercial harmonic station", async () => {
    const station = await repository.findById(OUISTREHAM);

    assert.ok(station);
    assert.equal(station.metadata.name, "Ouistreham");
    assert.equal(station.license.commercialUse, true);
    assert.equal(station.source.name, "TICON-4");
    assert.equal(station.harmonicConstituents.length, 50);
  });

  test("loads Le Havre as a commercial harmonic station", async () => {
    const station = await repository.findById(LE_HAVRE);

    assert.ok(station);
    assert.equal(station.metadata.name, "Le Havre");
    assert.equal(station.license.commercialUse, true);
    assert.equal(station.source.name, "TICON-4");
    assert.equal(station.harmonicConstituents.length, 50);
  });

  test("returns null for an unknown station", async () => {
    assert.equal(await repository.findById(UNKNOWN), null);
  });

  test("rejects a station whose license forbids commercial use", async () => {
    await assert.rejects(
      repository.findById(NON_COMMERCIAL),
      StationLicenseRejectedError,
    );
  });
});

describe("GenerateTideSeries", () => {
  test("rejects an unknown station explicitly", async () => {
    await assert.rejects(
      generateTideSeries.execute({
        stationId: UNKNOWN,
        startUtc: START,
        endUtc: END,
        stepMinutes: 5,
      }),
      StationNotFoundError,
    );
  });

  test("generates exactly 288 samples over 24 hours", async () => {
    const series = await generateTideSeries.execute({
      stationId: OUISTREHAM,
      startUtc: START,
      endUtc: END,
      stepMinutes: 5,
    });

    assert.equal(series.startUtc, "2026-07-25T00:00:00.000Z");
    assert.equal(series.endUtc, "2026-07-26T00:00:00.000Z");
    assert.equal(series.stepMinutes, 5);
    assert.equal(series.samples.length, 288);
  });

  test("orders every sample strictly and at five-minute intervals", async () => {
    const series = await generateTideSeries.execute({
      stationId: OUISTREHAM,
      startUtc: START,
      endUtc: END,
      stepMinutes: 5,
    });

    for (const [index, sample] of series.samples.entries()) {
      assert.equal(
        sample.datetimeUtc,
        new Date(START.getTime() + index * 5 * 60_000).toISOString(),
      );
      if (index > 0) {
        assert.ok(
          sample.datetimeUtc > series.samples[index - 1]!.datetimeUtc,
        );
      }
    }
  });

  test("does not contain non-numeric heights", async () => {
    const series = await generateTideSeries.execute({
      stationId: OUISTREHAM,
      startUtc: START,
      endUtc: END,
      stepMinutes: 5,
    });

    assert.equal(
      series.samples.every((sample) => Number.isFinite(sample.height)),
      true,
    );
  });

  test("serializes the same input to stable JSON", async () => {
    const arguments_ = [
      "--station",
      LE_HAVRE,
      "--date",
      "2026-07-25",
    ];
    const first = await runPredictCommand(arguments_);
    const second = await runPredictCommand(arguments_);

    assert.equal(first, second);
    assert.deepEqual(JSON.parse(first), JSON.parse(second));
  });
});
