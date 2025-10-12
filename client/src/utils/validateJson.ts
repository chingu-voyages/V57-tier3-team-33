
export function ensureJson(data: unknown): object | null {
  if (typeof data === "string") {
    try {
      return JSON.parse(data);
    } catch {
      return null; 
    }
  }

  if (typeof data === "object" && data !== null) {
    return data; 
  }

  return null; 
}
