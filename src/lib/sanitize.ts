import DOMPurify from 'dompurify';

const createDOMPurify = () => {
  if (typeof window !== 'undefined') {
    return DOMPurify(window);
  }
  return DOMPurify;
};

const purify = createDOMPurify();

export const sanitizeHtml = (dirty: string): string => {
  return purify.sanitize(dirty, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['class'],
    KEEP_CONTENT: true,
  });
};

export const sanitizeText = (text: string): string => {
  return purify.sanitize(text, { ALLOWED_TAGS: [], KEEP_CONTENT: true });
};

export const sanitizeUrl = (url: string): string => {
  const sanitized = sanitizeText(url);
  try {
    const urlObj = new URL(sanitized);
    if (urlObj.protocol === 'http:' || urlObj.protocol === 'https:') {
      return urlObj.toString();
    }
  } catch {
    // Invalid URL
  }
  return '';
};

export const sanitizeEmail = (email: string): string => {
  const sanitized = sanitizeText(email);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(sanitized) ? sanitized : '';
};

export const sanitizeInput = (input: string, maxLength: number = 1000): string => {
  const sanitized = sanitizeText(input);
  return sanitized.slice(0, maxLength);
};
