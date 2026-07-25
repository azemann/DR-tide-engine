import type { TideSeries } from "../domain/prediction.js";

export function serializeTideSeries(series: TideSeries): string {
  return `${JSON.stringify(series, null, 2)}\n`;
}
