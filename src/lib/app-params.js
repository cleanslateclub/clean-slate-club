const isNode = typeof window === 'undefined';
const windowObj = isNode ? { localStorage: new Map() } : window;
const storage = windowObj.localStorage;

const toSnakeCase = (str) => {
  return str.replace(/([A-Z])/g, '_$1').toLowerCase();
}

// FIX: Validate redirect URLs to prevent open redirect attacks
// Only allow relative paths (starting with /) or same-origin URLs
const isSafeRedirectUrl = (url) => {
  if (!url) return false;
  if (url.startsWith('/')) return true; // relative path — always safe
  try {
    const parsed = new URL(url);
    return parsed.origin === window.location.origin; // same domain only
  } catch {
    return false;
  }
};

const getAppParamValue = (paramName, { defaultValue = undefined, removeFromUrl = false } = {}) => {
  if (isNode) {
    return defaultValue;
  }
  const storageKey = `base44_${toSnakeCase(paramName)}`;
  const urlParams = new URLSearchParams(window.location.search);
  const searchParam = urlParams.get(paramName);
  if (removeFromUrl) {
    urlParams.delete(paramName);
    const newUrl = `${window.location.pathname}${urlParams.toString() ? `?${urlParams.toString()}` : ''}${window.location.hash}`;
    window.history.replaceState({}, document.title, newUrl);
  }
  if (searchParam) {
    storage.setItem(storageKey, searchParam);
    return searchParam;
  }
  if (defaultValue) {
    storage.setItem(storageKey, defaultValue);
    return defaultValue;
  }
  const storedValue = storage.getItem(storageKey);
  if (storedValue) {
    return storedValue;
  }
  return null;
}

const getAppParams = () => {
  if (getAppParamValue('clear_access_token') === 'true') {
    storage.removeItem('base44_access_token');
    storage.removeItem('token');
  }

  // FIX: Validate from_url before using it — prevents open redirect attacks
  const rawFromUrl = getAppParamValue('from_url', { defaultValue: window.location.href });
  const safeFromUrl = isSafeRedirectUrl(rawFromUrl) ? rawFromUrl : '/';

  return {
    appId: getAppParamValue('app_id', { defaultValue: import.meta.env.VITE_BASE44_APP_ID }),
    token: getAppParamValue('access_token', { removeFromUrl: true }),
    fromUrl: safeFromUrl, // FIX: only safe, validated URLs
    functionsVersion: getAppParamValue('functions_version', { defaultValue: import.meta.env.VITE_BASE44_FUNCTIONS_VERSION }),
    appBaseUrl: getAppParamValue('app_base_url', { defaultValue: import.meta.env.VITE_BASE44_APP_BASE_URL }),
  };
}

export const appParams = {
  ...getAppParams()
};
