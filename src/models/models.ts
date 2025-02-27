enum WindDirection {
  N = 'N',
  NNE = 'N-NE',
  NE = 'N-E',
  ENE = 'E-NE',
  E = 'E',
  ESE = 'E-SE',
  SE = 'S-E',
  SSE = 'S-SE',
  S = 'S',
  SSW = 'S-SW',
  SW = 'S-W',
  WSW = 'W-SW',
  W = 'W',
  WNW = 'W-NW',
  NW = 'N-W',
  NNW = 'N-NW',
}

interface IMeasurement {
  dateTime: Date
}

export interface IAirMeasurement extends IMeasurement {
  temperature: number
  humidity: number
  pressure: number
}

export interface IGroundTemperature extends IMeasurement {
  temperature: number
}

export interface IWindMeasurement extends IMeasurement {
  speed: number
  direction: WindDirection
}

export interface IRainfall extends IMeasurement {
  amount: number
}

const dateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/

export function reviver(_: unknown, value: unknown): unknown {
  if (typeof value === 'string' && dateFormat.test(value)) {
    return new Date(value)
  }

  return value
}
