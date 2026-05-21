const INSTAGRAM_HOSTS = ['instagram.com', 'www.instagram.com', 'm.instagram.com', 'instagr.am'];

const normalizeInstagramHandle = (value) => {
  const raw = String(value ?? '').trim();

  if (!raw) {
    return '';
  }

  if (/^https?:\/\//i.test(raw)) {
    return raw;
  }

  return raw
    .replace(/^@+/, '')
    .replace(/^instagram\.com\//i, '')
    .replace(/^www\.instagram\.com\//i, '')
    .replace(/^m\.instagram\.com\//i, '')
    .replace(/^instagr\.am\//i, '')
    .replace(/^\/+/, '')
    .replace(/\/+$/, '');
};

export const isInstagramLink = (value) => {
  const normalizedValue = String(value ?? '').trim();

  if (!normalizedValue) {
    return false;
  }

  if (/^https?:\/\//i.test(normalizedValue)) {
    try {
      const parsedUrl = new URL(normalizedValue);
      return INSTAGRAM_HOSTS.includes(parsedUrl.hostname.toLowerCase());
    } catch {
      return false;
    }
  }

  return INSTAGRAM_HOSTS.some((host) => normalizedValue.toLowerCase().includes(host));
};

export const buildInstagramProfileUrl = (value) => {
  const normalizedValue = normalizeInstagramHandle(value);

  if (!normalizedValue) {
    return '';
  }

  if (/^https?:\/\//i.test(normalizedValue)) {
    return normalizedValue;
  }

  const username = normalizedValue.replace(/^@+/, '');

  if (!username) {
    return '';
  }

  return `https://www.instagram.com/${encodeURIComponent(username)}/`;
};
