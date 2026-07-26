import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { GenerateTideSeries } from "../src/application/generate-tide-series.js";
import { NeapsStationRepository } from "../src/adapters/neaps/station-repository.js";
import { NeapsTidePredictor } from "../src/adapters/neaps/tide-predictor.js";
import { InvalidEventSourceSeriesError } from "../src/domain/errors.js";
import type { TideSeries } from "../src/domain/prediction.js";
import { createStationId } from "../src/domain/stations.js";
import { detectTideEvents } from "../src/domain/tide-events.js";

const START_UTC = "2026-07-25T00:00:00.000Z";
const STEP_MINUTES = 5;

function syntheticSeries(heights: readonly number[]): TideSeries {
  const startMilliseconds = Date.parse(START_UTC);
  return {
    station: {
      id: createStationId("synthetic/extrema"),
      name: "Synthetic extrema",
      source: {
        name: "DR Tide Engine tests",
        stationId: "extrema",
        url: "https://example.invalid/dr-tide-engine/tests",
        publishedHarmonics: false,
      },
      license: {
        type: "test-data",
        commercialUse: true,
        url: "https://example.invalid/dr-tide-engine/tests/license",
      },
    },
    startUtc: START_UTC,
    endUtc: new Date(
      startMilliseconds + heights.length * STEP_MINUTES * 60_000,
    ).toISOString(),
    stepMinutes: STEP_MINUTES,
    samples: heights.map((height, index) => ({
      datetimeUtc: new Date(
        startMilliseconds + index * STEP_MINUTES * 60_000,
      ).toISOString(),
      height,
    })),
  };
}

function eventStartUtc(
  time: ReturnType<typeof detectTideEvents>["events"][number]["time"],
): string {
  return time.kind === "sample" ? time.datetimeUtc : time.firstSampleUtc;
}

describe("detectTideEvents with synthetic series", () => {
  test("detects strict high and low events", () => {
    const result = detectTideEvents(syntheticSeries([0, 2, 0, -2, 0]));

    assert.deepEqual(
      result.events.map((event) => ({
        type: event.type,
        time: event.time,
        rawHeight: event.rawHeight,
        qualification: event.qualification,
      })),
      [
        {
          type: "high",
          time: {
            kind: "sample",
            datetimeUtc: "2026-07-25T00:05:00.000Z",
          },
          rawHeight: 2,
          qualification: "strict",
        },
        {
          type: "low",
          time: {
            kind: "sample",
            datetimeUtc: "2026-07-25T00:15:00.000Z",
          },
          rawHeight: -2,
          qualification: "strict",
        },
      ],
    );
  });

  test("represents high and low plateaus as sampled intervals", () => {
    const result = detectTideEvents(
      syntheticSeries([0, 2, 2, 0, -2, -2, 0]),
    );

    assert.deepEqual(
      result.events.map((event) => ({
        type: event.type,
        time: event.time,
        qualification: event.qualification,
      })),
      [
        {
          type: "high",
          time: {
            kind: "plateau",
            firstSampleUtc: "2026-07-25T00:05:00.000Z",
            lastSampleUtc: "2026-07-25T00:10:00.000Z",
          },
          qualification: "plateau",
        },
        {
          type: "low",
          time: {
            kind: "plateau",
            firstSampleUtc: "2026-07-25T00:20:00.000Z",
            lastSampleUtc: "2026-07-25T00:25:00.000Z",
          },
          qualification: "plateau",
        },
      ],
    );
  });

  test("returns no event for a monotone series", () => {
    assert.deepEqual(
      detectTideEvents(syntheticSeries([-2, -1, 0, 1, 2])).events,
      [],
    );
  });

  test("detects extrema one sample away from either boundary", () => {
    const result = detectTideEvents(syntheticSeries([3, 1, 2, 4, 2]));

    assert.deepEqual(
      result.events.map((event) => event.type),
      ["low", "high"],
    );
    assert.deepEqual(result.events[0]?.time, {
      kind: "sample",
      datetimeUtc: "2026-07-25T00:05:00.000Z",
    });
    assert.deepEqual(result.events[1]?.time, {
      kind: "sample",
      datetimeUtc: "2026-07-25T00:15:00.000Z",
    });
  });

  test("does not qualify a plateau touching a boundary", () => {
    assert.deepEqual(
      detectTideEvents(syntheticSeries([2, 2, 0, -2, -2])).events,
      [],
    );
  });

  test("rejects an incomplete or duplicated source series", () => {
    const valid = syntheticSeries([0, 1, 0]);
    const invalid: TideSeries = {
      ...valid,
      samples: [valid.samples[0]!, valid.samples[0]!, valid.samples[2]!],
    };

    assert.throws(
      () => detectTideEvents(invalid),
      InvalidEventSourceSeriesError,
    );
  });

  test("normalizes invalid window metadata to the event-source error", () => {
    const valid = syntheticSeries([0, 1, 0]);
    const invalid: TideSeries = {
      ...valid,
      endUtc: valid.startUtc,
    };

    assert.throws(
      () => detectTideEvents(invalid),
      InvalidEventSourceSeriesError,
    );
  });

  test("preserves provenance and does not mutate the source series", () => {
    const series = syntheticSeries([0, 2, 0]);
    const before = JSON.stringify(series);
    const result = detectTideEvents(series);
    const repeated = detectTideEvents(series);
    const event = result.events[0]!;

    assert.equal(JSON.stringify(series), before);
    assert.deepEqual(repeated, result);
    assert.equal(event.stationId, series.station.id);
    assert.equal(event.source, series.station.source);
    assert.equal(event.license, series.station.license);
    assert.equal(event.detectionMethod, "discrete-local-extremum-v1");
    assert.equal(result.station, series.station);
  });
});

describe("detectTideEvents with real harmonic series", () => {
  const generate = new GenerateTideSeries(
    new NeapsStationRepository(),
    new NeapsTidePredictor(),
  );

  for (const stationId of [
    "ticon/ouistreham-311-fra-refmar",
    "ticon/le_havre-4-fra-refmar",
  ]) {
    test(`derives ordered alternating events for ${stationId}`, async () => {
      const series = await generate.execute({
        stationId: createStationId(stationId),
        startUtc: new Date(START_UTC),
        endUtc: new Date("2026-07-26T00:00:00.000Z"),
        stepMinutes: STEP_MINUTES,
      });
      const before = JSON.stringify(series);
      const result = detectTideEvents(series);

      assert.ok(result.events.length >= 3);
      assert.ok(result.events.length <= 5);
      assert.equal(
        result.events.some((event) => event.type === "high"),
        true,
      );
      assert.equal(
        result.events.some((event) => event.type === "low"),
        true,
      );
      for (let index = 1; index < result.events.length; index += 1) {
        assert.notEqual(
          result.events[index - 1]!.type,
          result.events[index]!.type,
        );
        assert.ok(
          eventStartUtc(result.events[index - 1]!.time) <
            eventStartUtc(result.events[index]!.time),
        );
      }
      assert.equal(JSON.stringify(series), before);
    });
  }
});
