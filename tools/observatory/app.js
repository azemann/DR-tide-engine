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
  generated: document.querySelector("#generated-value"),
  chart: document.querySelector("#tide-chart"),
  chartDescription: document.querySelector("#chart-description"),
  chartSummary: document.querySelector("#chart-summary"),
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
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(new Date(value));
}

function svgElement(tagName, attributes = {}) {
  const element = document.createElementNS(svgNamespace, tagName);
  for (const [name, value] of Object.entries(attributes)) {
    element.setAttribute(name, String(value));
  }
  return element;
}

function renderChart(series, diagnostics) {
  const width = 1000;
  const height = 360;
  const margin = { top: 24, right: 24, bottom: 44, left: 70 };
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
    const label = svgElement("text", {
      class: "chart-axis-label",
      x: gridX,
      y: height - 14,
      "text-anchor": hour === 0 ? "start" : hour === 24 ? "end" : "middle",
    });
    label.textContent = `${String(hour).padStart(2, "0")}:00`;
    elements.chart.append(label);
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

  for (const extreme of [
    { value: diagnostics.minimumRawHeight, label: "minimum brut" },
    { value: diagnostics.maximumRawHeight, label: "maximum brut" },
  ]) {
    const sample = values.find((candidate) => candidate.height === extreme.value);
    if (sample === undefined) continue;
    const point = svgElement("circle", {
      class: "chart-point",
      cx: x(sample.datetimeUtc),
      cy: y(sample.height),
      r: 5,
    });
    const title = svgElement("title");
    title.textContent = `${extreme.label}: ${formatNumber(sample.height)}, ${formatUtc(sample.datetimeUtc)} UTC`;
    point.append(title);
    elements.chart.append(point);
  }

  elements.chartDescription.textContent =
    `Courbe de ${values.length} échantillons de ${formatNumber(diagnostics.minimumRawHeight)} à ${formatNumber(diagnostics.maximumRawHeight)}.`;
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
  const { series, diagnostics } = prediction;
  elements.window.textContent =
    `${formatUtc(series.startUtc)} → ${formatUtc(series.endUtc)} (fin exclue)`;
  elements.chartSummary.textContent =
    `${series.stepMinutes} minutes · ${series.samples.length} points · UTC`;
  renderChart(series, diagnostics);
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
