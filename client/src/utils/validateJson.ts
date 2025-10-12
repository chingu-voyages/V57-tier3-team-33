export function ensureJson(value: unknown): unknown | null {
  try {
    // Attempt to serialize; will throw if value contains circular refs or non-serializable types
    JSON.stringify(value);
    return value;
  } catch {
    return null;
  }
}