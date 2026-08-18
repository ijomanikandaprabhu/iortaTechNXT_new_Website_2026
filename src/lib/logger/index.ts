type Level = "debug" | "info" | "warn" | "error";

/**
 * Minimal structured logger. Swap the sink here if a hosted logger is added;
 * call sites never change.
 */
function emit(level: Level, message: string, meta?: Record<string, unknown>) {
  const line = { level, message, time: new Date().toISOString(), ...meta };
  // eslint-disable-next-line no-console
  console[level === "debug" ? "log" : level](JSON.stringify(line));
}

export const logger = {
  debug: (m: string, meta?: Record<string, unknown>) => emit("debug", m, meta),
  info: (m: string, meta?: Record<string, unknown>) => emit("info", m, meta),
  warn: (m: string, meta?: Record<string, unknown>) => emit("warn", m, meta),
  error: (m: string, meta?: Record<string, unknown>) => emit("error", m, meta),
};
