import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const snapshot = JSON.parse(
  await readFile(
    new URL("../data/generated/observatory-data.json", import.meta.url),
    "utf8",
  ),
);

assert.equal(snapshot.schemaVersion, 2);
assert.equal(snapshot.predictions.length, 2);

for (const prediction of snapshot.predictions) {
  const { series, diagnostics, tideEvents } = prediction;
  assert.equal(series.station.timezone, "Europe/Paris");
  assert.doesNotThrow(() => {
    new Intl.DateTimeFormat("fr-FR", {
      timeZone: series.station.timezone,
    }).format(new Date(series.startUtc));
  });
  assert.equal(tideEvents.station.id, series.station.id);
  assert.equal(tideEvents.sourceSeriesStartUtc, series.startUtc);
  assert.equal(tideEvents.sourceSeriesEndUtc, series.endUtc);
  assert.equal(tideEvents.sourceStepMinutes, series.stepMinutes);
  assert.equal(diagnostics.nonFiniteSampleCount, 0);
  assert.ok(tideEvents.events.length > 0);

  let previousStartUtc = null;
  const types = new Set();
  for (const event of tideEvents.events) {
    const eventStartUtc =
      event.time.kind === "sample"
        ? event.time.datetimeUtc
        : event.time.firstSampleUtc;
    const eventEndUtc =
      event.time.kind === "sample"
        ? event.time.datetimeUtc
        : event.time.lastSampleUtc;

    assert.ok(eventStartUtc >= series.startUtc);
    assert.ok(eventEndUtc < series.endUtc);
    assert.ok(eventStartUtc <= eventEndUtc);
    if (previousStartUtc !== null) {
      assert.ok(previousStartUtc < eventStartUtc);
    }
    assert.equal(event.stationId, series.station.id);
    assert.deepEqual(event.source, series.station.source);
    assert.deepEqual(event.license, series.station.license);
    assert.equal(event.detectionMethod, "discrete-local-extremum-v1");
    assert.ok(event.type === "high" || event.type === "low");
    types.add(event.type);
    previousStartUtc = eventStartUtc;
  }

  assert.deepEqual([...types].sort(), ["high", "low"]);
}

process.stdout.write(
  `Contrat observatoire v2 vérifié: ${snapshot.predictions.length} stations.\n`,
);
