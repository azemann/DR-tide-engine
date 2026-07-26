const svgNamespace = "http://www.w3.org/2000/svg";

const elements = {
  loading: document.querySelector("#loading-state"),
  error: document.querySelector("#error-state"),
  errorMessage: document.querySelector("#error-message"),
  empty: document.querySelector("#empty-state"),
  dashboard: document.querySelector("#dashboard"),
  badges: document.querySelector("#engine-badges"),
  station: document.querySelector("#station-select"),
  window: document.querySelector("#window-value"),
  localWindow: document.querySelector("#local-window-value"),
  generated: document.querySelector("#generated-value"),
  chart: document.querySelector("#tide-chart"),
  chartDescription: document.querySelector("#chart-description"),
  chartSummary: document.querySelector("#chart-summary"),
  eventsBadge: document.querySelector("#events-badge"),
  eventsEmpty: document.querySelector("#events-empty"),
  eventsList: document.querySelector("#events-list"),
  metrics: document.querySelector("#metrics-grid"),
  quality: document.querySelector("#quality-badge"),
  provenance: document.querySelector("#provenance-list"),
  progress: document.querySelector("#progress-list"),
  audits: document.querySelector("#audit-list"),
};

function textElement(tagName, className, text) {
  const element = document.createElement(tagName);
  element.className = className;
  element.textContent = text;
  return element;
}

function badge(text, status = "") {
  return textElement("span", `badge ${status}`.trim(), text);
}

function formatNumber(value) {
  return value === null ? "indisponible" : new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: 6,
  }).format(value);
}

function formatUtc(value) {
  return formatDatetime(value, "UTC");
}

function formatDatetime(value, timeZone) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone,
  }).format(new Date(value));
}

function formatTime(value, timeZone) {
  return new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone,
  }).format(new Date(value));
}

function formatTimezone(timeZone, value) {
  const formatter = new Intl.DateTimeFormat("fr-FR", {
    timeZone,
    timeZoneName: "shortOffset",
  });
  const offset = formatter
    .formatToParts(new Date(value))
    .find((part) => part.type === "timeZoneName")?.value;
  return offset === undefined ? timeZone : `${timeZone} · ${offset}`;
}

function svgElement(tagName, attributes = {}) {
  const element = document.createElementNS(svgNamespace, tagName);
  for (const [name, value] of Object.entries(attributes)) {
    element.setAttribute(name, String(value));
  }
  return element;
}

function eventTimeLabel(time, timeZone) {
  return time.kind === "sample"
    ? formatTime(time.datetimeUtc, timeZone)
    : `${formatTime(time.firstSampleUtc, timeZone)}–${formatTime(time.lastSampleUtc, timeZone)}`;
}

function eventStartUtc(time) {
  return time.kind === "sample" ? time.datetimeUtc : time.firstSampleUtc;
}

function eventEndUtc(time) {
  return time.kind === "sample" ? time.datetimeUtc : time.lastSampleUtc;
}

function eventTypeLabel(type) {
  return type === "high" ? "Pleine mer discrète" : "Basse mer discrète";
}

function renderChart(series, diagnostics, tideEvents) {
  const width = 1000;
  const height = 380;
  const margin = { top: 24, right: 24, bottom: 64, left: 70 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  const values = series.samples.filter(
    (sample) =>
      Number.isFinite(Date.parse(sample.datetimeUtc)) &&
      Number.isFinite(sample.height),
  );
  elements.chart.replaceChildren(elements.chartDescription);

  if (
    values.length === 0 ||
    diagnostics.minimumRawHeight === null ||
    diagnostics.maximumRawHeight === null
  ) {
    elements.chartDescription.textContent =
      "La série ne contient aucune valeur traçable.";
    return;
  }

  const start = Date.parse(series.startUtc);
  const end = Date.parse(series.endUtc);
  const dataRange =
    diagnostics.maximumRawHeight - diagnostics.minimumRawHeight || 1;
  const padding = dataRange * 0.08;
  const minimum = diagnostics.minimumRawHeight - padding;
  const maximum = diagnostics.maximumRawHeight + padding;
  const x = (datetime) =>
    margin.left + ((Date.parse(datetime) - start) / (end - start)) * plotWidth;
  const y = (value) =>
    margin.top + ((maximum - value) / (maximum - minimum)) * plotHeight;

  for (let index = 0; index <= 4; index += 1) {
    const gridY = margin.top + (plotHeight * index) / 4;
    const value = maximum - ((maximum - minimum) * index) / 4;
    elements.chart.append(
      svgElement("line", {
        class: "chart-grid",
        x1: margin.left,
        x2: width - margin.right,
        y1: gridY,
        y2: gridY,
      }),
    );
    const label = svgElement("text", {
      class: "chart-axis-label",
      x: margin.left - 12,
      y: gridY + 4,
      "text-anchor": "end",
    });
    label.textContent = formatNumber(value);
    elements.chart.append(label);
  }

  for (let hour = 0; hour <= 24; hour += 6) {
    const gridX = margin.left + (plotWidth * hour) / 24;
    const utcLabel = svgElement("text", {
      class: "chart-axis-label",
      x: gridX,
      y: height - 34,
      "text-anchor": hour === 0 ? "start" : hour === 24 ? "end" : "middle",
    });
    utcLabel.textContent = `${String(hour).padStart(2, "0")}:00`;
    const instant = new Date(start + hour * 60 * 60_000).toISOString();
    const localLabel = svgElement("text", {
      class: "chart-axis-label chart-axis-label-local",
      x: gridX,
      y: height - 14,
      "text-anchor": hour === 0 ? "start" : hour === 24 ? "end" : "middle",
    });
    localLabel.textContent = formatTime(instant, series.station.timezone);
    elements.chart.append(utcLabel, localLabel);
  }

  for (const [labelText, labelY, className] of [
    ["UTC", height - 34, "chart-axis-label"],
    ["locale", height - 14, "chart-axis-label chart-axis-label-local"],
  ]) {
    const rowLabel = svgElement("text", {
      class: className,
      x: margin.left - 12,
      y: labelY,
      "text-anchor": "end",
    });
    rowLabel.textContent = labelText;
    elements.chart.append(rowLabel);
  }

  const points = values.map((sample) => `${x(sample.datetimeUtc)},${y(sample.height)}`);
  const baseline = margin.top + plotHeight;
  elements.chart.append(
    svgElement("polygon", {
      class: "chart-area",
      points: `${margin.left},${baseline} ${points.join(" ")} ${x(values.at(-1).datetimeUtc)},${baseline}`,
    }),
    svgElement("polyline", {
      class: "chart-line",
      points: points.join(" "),
    }),
  );

  for (const event of tideEvents.events) {
    const firstX = x(eventStartUtc(event.time));
    const lastX = x(eventEndUtc(event.time));
    const eventY = y(event.rawHeight);
    const group = svgElement("g", {
      class: `chart-event chart-event-${event.type}`,
    });
    const title = svgElement("title");
    title.textContent =
      `${eventTypeLabel(event.type)}, ${eventTimeLabel(event.time, "UTC")} UTC / ${eventTimeLabel(event.time, series.station.timezone)} heure locale, valeur brute ${formatNumber(event.rawHeight)}`;
    group.append(title);

    if (event.time.kind === "plateau") {
      group.append(
        svgElement("line", {
          class: "chart-event-plateau",
          x1: firstX,
          x2: lastX,
          y1: eventY,
          y2: eventY,
        }),
      );
    }

    const marker = svgElement("circle", {
      class: "chart-event-point",
      cx: event.time.kind === "sample" ? firstX : (firstX + lastX) / 2,
      cy: eventY,
      r: 12,
    });
    const markerLabel = svgElement("text", {
      class: "chart-event-label",
      x: event.time.kind === "sample" ? firstX : (firstX + lastX) / 2,
      y: eventY + 4,
      "text-anchor": "middle",
    });
    markerLabel.textContent = event.type === "high" ? "PM" : "BM";
    group.append(marker, markerLabel);
    elements.chart.append(group);
  }

  elements.chartDescription.textContent =
    `Courbe de ${values.length} échantillons de ${formatNumber(diagnostics.minimumRawHeight)} à ${formatNumber(diagnostics.maximumRawHeight)}, avec ${tideEvents.events.length} événements discrets.`;
}

function renderEvents(tideEvents, timeZone) {
  const highCount = tideEvents.events.filter(
    (event) => event.type === "high",
  ).length;
  const lowCount = tideEvents.events.length - highCount;
  elements.eventsBadge.textContent =
    `${highCount} PM · ${lowCount} BM`;
  elements.eventsBadge.className =
    `badge ${tideEvents.events.length > 0 ? "badge-success" : "badge-warning"}`;
  elements.eventsEmpty.hidden = tideEvents.events.length > 0;
  elements.eventsList.replaceChildren(
    ...tideEvents.events.map((event) => {
      const item = document.createElement("li");
      item.className = `event-card event-${event.type}`;
      const heading = document.createElement("div");
      heading.className = "event-heading";
      heading.append(
        textElement(
          "span",
          "event-type",
          event.type === "high" ? "PM" : "BM",
        ),
        textElement("strong", "", eventTypeLabel(event.type)),
      );
      const details = document.createElement("dl");
      details.className = "event-details";
      for (const [term, definition] of [
        ["Heure UTC", `${eventTimeLabel(event.time, "UTC")} UTC`],
        [
          "Heure locale",
          `${eventTimeLabel(event.time, timeZone)} (${formatTimezone(timeZone, eventStartUtc(event.time))})`,
        ],
        ["Valeur brute", formatNumber(event.rawHeight)],
        [
          "Qualification",
          event.qualification === "strict"
            ? "extremum strict échantillonné"
            : "plateau échantillonné",
        ],
        ["Méthode", event.detectionMethod],
      ]) {
        const row = document.createElement("div");
        row.append(
          textElement("dt", "", term),
          textElement("dd", "", definition),
        );
        details.append(row);
      }
      item.append(heading, details);
      return item;
    }),
  );
}

function renderMetrics(diagnostics) {
  const invalid =
    diagnostics.nonFiniteSampleCount +
    diagnostics.invalidDatetimeSampleCount +
    diagnostics.outOfWindowSampleCount +
    diagnostics.misalignedSampleCount;
  const metrics = [
    ["Échantillons", `${diagnostics.sampleCount} / ${diagnostics.expectedSampleCount}`],
    ["Minimum brut", formatNumber(diagnostics.minimumRawHeight)],
    ["Maximum brut", formatNumber(diagnostics.maximumRawHeight)],
    ["Amplitude brute", formatNumber(diagnostics.rawRange)],
    ["Manquants", String(diagnostics.missingSampleCount)],
    ["Doublons", String(diagnostics.duplicateSampleCount)],
    ["Valeurs invalides", String(invalid)],
    ["Pas régulier", diagnostics.regularStep ? "oui" : "non"],
  ];
  elements.metrics.replaceChildren(
    ...metrics.map(([label, value]) => {
      const card = document.createElement("div");
      card.className = "metric";
      card.append(
        textElement("span", "metric-label", label),
        textElement("strong", "metric-value", value),
      );
      return card;
    }),
  );
  const valid =
    invalid === 0 &&
    diagnostics.missingSampleCount === 0 &&
    diagnostics.duplicateSampleCount === 0 &&
    diagnostics.chronological &&
    diagnostics.regularStep;
  elements.quality.className = `badge ${valid ? "badge-success" : "badge-warning"}`;
  elements.quality.textContent = valid ? "structure conforme" : "série dégradée";
}

function renderDetails(data, prediction) {
  const details = [
    ["Station", prediction.series.station.id],
    ["Fuseau local", prediction.series.station.timezone],
    ["Source", prediction.series.station.source.name],
    ["Licence", prediction.series.station.license.type],
    ["Usage commercial", prediction.series.station.license.commercialUse ? "autorisé" : "interdit"],
    ["Adaptateur", `${data.calculation.dataAdapter} ${data.calculation.dataAdapterVersion ?? "version inconnue"}`],
    ["Calculateur", `${data.calculation.predictor} ${data.calculation.predictorVersion ?? "version inconnue"}`],
    ["Qualification", data.calculation.resultQualification],
    ["Référence verticale", data.calculation.verticalReference],
  ];
  elements.provenance.replaceChildren(
    ...details.map(([term, definition]) => {
      const row = document.createElement("div");
      row.append(
        textElement("dt", "", term),
        textElement("dd", "", definition),
      );
      return row;
    }),
  );
}

function renderProgress(data) {
  elements.progress.replaceChildren(
    ...data.progress.map((item) => {
      const row = document.createElement("div");
      row.className = `progress-item progress-${item.status}`;
      row.append(
        textElement("span", "progress-mark", item.status === "complete" ? "✓" : "–"),
        textElement("span", "", item.label),
      );
      return row;
    }),
  );
}

function renderAudits(data) {
  if (data.openAudits.length === 0) {
    elements.audits.replaceChildren(
      textElement("p", "muted", "Aucun point ouvert dans le registre."),
    );
    return;
  }
  elements.audits.replaceChildren(
    ...data.openAudits.map((audit) => {
      const row = document.createElement("div");
      row.className = "audit-item";
      row.append(
        textElement("span", "audit-id", audit.id),
        textElement("span", "", audit.summary),
        badge(audit.severity, "badge-warning"),
      );
      return row;
    }),
  );
}

function renderPrediction(data, index) {
  const prediction = data.predictions[index];
  const { series, diagnostics, tideEvents } = prediction;
  elements.window.textContent =
    `${formatUtc(series.startUtc)} → ${formatUtc(series.endUtc)} (fin exclue)`;
  elements.localWindow.textContent =
    `${formatDatetime(series.startUtc, series.station.timezone)} → ${formatDatetime(series.endUtc, series.station.timezone)} (fin exclue, ${formatTimezone(series.station.timezone, series.startUtc)})`;
  elements.chartSummary.textContent =
    `${series.stepMinutes} minutes · ${series.samples.length} points · UTC + heure locale`;
  renderChart(series, diagnostics, tideEvents);
  renderEvents(tideEvents, series.station.timezone);
  renderMetrics(diagnostics);
  renderDetails(data, prediction);
}

function render(data) {
  elements.loading.hidden = true;
  if (!Array.isArray(data.predictions) || data.predictions.length === 0) {
    elements.empty.hidden = false;
    return;
  }

  elements.badges.replaceChildren(
    badge(data.engine.maturity),
    badge(data.engine.milestone),
    badge(`v${data.engine.version}`),
    badge(
      data.engine.git.dirty === true ? "arbre modifié" : data.engine.git.commit ?? "Git indisponible",
      data.engine.git.dirty === true ? "badge-warning" : "badge-success",
    ),
  );
  elements.generated.textContent = `${formatUtc(data.generatedAtUtc)} UTC`;
  elements.station.replaceChildren(
    ...data.predictions.map((prediction, index) => {
      const option = document.createElement("option");
      option.value = String(index);
      option.textContent = prediction.series.station.name;
      return option;
    }),
  );
  elements.station.addEventListener("change", () => {
    renderPrediction(data, Number.parseInt(elements.station.value, 10));
  });
  renderProgress(data);
  renderAudits(data);
  renderPrediction(data, 0);
  elements.dashboard.hidden = false;
}

async function main() {
  try {
    const response = await fetch("/data/observatory-data.json", {
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error(`réponse HTTP ${response.status}`);
    }
    render(await response.json());
  } catch (error) {
    elements.loading.hidden = true;
    elements.errorMessage.textContent =
      error instanceof Error ? error.message : "erreur inconnue";
    elements.error.hidden = false;
  }
}

await main();
