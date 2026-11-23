// -------------------------------------------------------------
// ANONYMOUS VISITOR IDENTIFIER (Client-Side Privacy-Preserving)
// -------------------------------------------------------------
const VISITOR_ID_KEY = 'ae_portfolio_visitor_id';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Returns the existing anonymous visitor UUID stored in localStorage,
 * or generates and persists a new UUID for first-time visitors.
 * Does not collect or transmit personal identifying information.
 */
export const getOrCreateVisitorId = (): string => {
  if (typeof window === 'undefined') {
    return '00000000-0000-0000-0000-000000000000';
  }

  try {
    const existing = localStorage.getItem(VISITOR_ID_KEY);
    if (existing && UUID_REGEX.test(existing)) {
      return existing;
    }

    let newId = '';
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      newId = crypto.randomUUID();
    } else {
      // Standard RFC4122 Version 4 UUID fallback generator
      newId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    }

    localStorage.setItem(VISITOR_ID_KEY, newId);
    return newId;
  } catch (err) {
    console.warn('Could not read or write visitor UUID to localStorage:', err);
    return '00000000-0000-0000-0000-000000000000';
  }
};
