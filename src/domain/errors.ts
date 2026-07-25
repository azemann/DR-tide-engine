export type TideEngineErrorCode =
  | "INVALID_STATION_ID"
  | "STATION_NOT_FOUND"
  | "STATION_NOT_HARMONIC"
  | "STATION_LICENSE_REJECTED"
  | "INVALID_PREDICTION_REQUEST"
  | "INVALID_PREDICTION_RESULT"
  | "CLI_USAGE_ERROR";

export class TideEngineError extends Error {
  public readonly code: TideEngineErrorCode;

  public constructor(code: TideEngineErrorCode, message: string) {
    super(message);
    this.name = new.target.name;
    this.code = code;
  }
}

export class InvalidStationIdError extends TideEngineError {
  public constructor(value: string) {
    super("INVALID_STATION_ID", `Invalid station identifier: ${value}`);
  }
}

export class StationNotFoundError extends TideEngineError {
  public constructor(id: string) {
    super("STATION_NOT_FOUND", `Unknown station: ${id}`);
  }
}

export class StationNotHarmonicError extends TideEngineError {
  public constructor(id: string) {
    super(
      "STATION_NOT_HARMONIC",
      `Station does not contain usable harmonic constituents: ${id}`,
    );
  }
}

export class StationLicenseRejectedError extends TideEngineError {
  public constructor(id: string, licenseType: string) {
    super(
      "STATION_LICENSE_REJECTED",
      `Station license does not allow commercial use: ${id} (${licenseType})`,
    );
  }
}

export class InvalidPredictionRequestError extends TideEngineError {
  public constructor(reason: string) {
    super("INVALID_PREDICTION_REQUEST", `Invalid prediction request: ${reason}`);
  }
}

export class InvalidPredictionResultError extends TideEngineError {
  public constructor(reason: string) {
    super("INVALID_PREDICTION_RESULT", `Invalid prediction result: ${reason}`);
  }
}

export class CliUsageError extends TideEngineError {
  public constructor(reason: string) {
    super("CLI_USAGE_ERROR", `Invalid command usage: ${reason}`);
  }
}
