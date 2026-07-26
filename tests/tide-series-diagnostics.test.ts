import assert from "node:assert/strict";
import { describe, test } from "node:test";
import type { TideSeries } from "../src/domain/prediction.js";
import { createStationId } from "../src/domain/stations.js";
import { analyzeTideSeries } from "../src/domain/tide-series-diagnostics.js";

function syntheticSeries(
  samples: TideSeries["samples"],
): TideSeries {
  return {
    station: {
      id: createStationId("synthetic/diagnostics"),
      name: "Synthetic diagnostics",
      timezone: "UTC",
      source: {
        name: "DR Tide Engine tests",
        stationId: "diagnostics",
        url: "https://example.invalid/dr-tide-engine/tests",
        publishedHarmonics: false,
      },
      license: {
        type: "test-data",
        commercialUse: true,
        url: "https://example.invalid/dr-tide-engine/tests/license",
      },
    },
    startUtc: "2026-07-25T00:00:00.000Z",
    endUtc: "2026-07-25T00:15:00.000Z",
    stepMinutes: 5,
    samples,
  };
}

describe("analyzeTideSeries", () => {
  test("describes a complete regular synthetic series", () => {
    const diagnostics = analyzeTideSeries(
      syntheticSeries([
        { datetimeUtc: "2026-07-25T00:00:00.000Z", height: 1 },
        { datetimeUtc: "2026-07-25T00:05:00.000Z", height: 3 },
        { datetimeUtc: "2026-07-25T00:10:00.000Z", height: -1 },
      ]),
    );

    assert.deepEqual(diagnostics, {
      sampleCount: 3,
      expectedSampleCount: 3,
      missingSampleCount: 0,
      duplicateSampleCount: 0,
      invalidDatetimeSampleCount: 0,
      nonFiniteSampleCount: 0,
      outOfWindowSampleCount: 0,
      misalignedSampleCount: 0,
      chronological: true,
      regularStep: true,
      minimumRawHeight: -1,
      maximumRawHeight: 3,
      rawRange: 4,
    });
  });

  test("reports missing, duplicate, invalid and non-finite samples", () => {
    const diagnostics = analyzeTideSeries(
      syntheticSeries([
        { datetimeUtc: "2026-07-25T00:00:00.000Z", height: 1 },
        { datetimeUtc: "2026-07-25T00:00:00.000Z", height: Number.NaN },
        { datetimeUtc: "invalid", height: 2 },
        { datetimeUtc: "2026-07-25T00:16:00.000Z", height: 4 },
      ]),
    );

    assert.equal(diagnostics.missingSampleCount, 2);
    assert.equal(diagnostics.duplicateSampleCount, 1);
    assert.equal(diagnostics.invalidDatetimeSampleCount, 1);
    assert.equal(diagnostics.nonFiniteSampleCount, 1);
    assert.equal(diagnostics.outOfWindowSampleCount, 1);
    assert.equal(diagnostics.chronological, false);
    assert.equal(diagnostics.regularStep, false);
  });

  test("does not mutate its source series", () => {
    const series = syntheticSeries([
      { datetimeUtc: "2026-07-25T00:00:00.000Z", height: 1 },
      { datetimeUtc: "2026-07-25T00:05:00.000Z", height: 2 },
      { datetimeUtc: "2026-07-25T00:10:00.000Z", height: 3 },
    ]);
    const before = JSON.stringify(series);

    analyzeTideSeries(series);

    assert.equal(JSON.stringify(series), before);
  });
});
