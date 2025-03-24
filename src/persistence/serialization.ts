/**
 * Helper functions for serializing and deserializing objects
 */

/**
 * Transform an object for serialization
 * Handles Date objects and other special types
 */
export function serializeObject<T>(obj: T): any {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (obj instanceof Date) {
    return {
      __type: 'Date',
      value: obj.toISOString()
    };
  }

  if (Array.isArray(obj)) {
    return obj.map(item => serializeObject(item));
  }

  if (typeof obj === 'object') {
    const result: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = serializeObject(value);
    }
    return result;
  }

  return obj;
}

/**
 * Transform a serialized object back to its original form
 */
export function deserializeObject<T>(obj: any): T {
  if (obj === null || obj === undefined) {
    return obj as T;
  }

  if (typeof obj === 'object' && obj.__type === 'Date' && obj.value) {
    return new Date(obj.value) as unknown as T;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => deserializeObject(item)) as unknown as T;
  }

  if (typeof obj === 'object') {
    const result: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = deserializeObject(value);
    }
    return result as T;
  }

  return obj as T;
}
