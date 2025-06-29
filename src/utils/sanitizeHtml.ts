import sanitizeHtml from 'sanitize-html';

const allowedTags = [
  'b', 'i', 'u', 'em', 'strong', 'a', 'br', 'p', 'ul', 'ol', 'li', 'img'
];

const allowedAttributes = {
  a: ['href'],
  img: ['src', 'alt', 'width', 'height'],
};

export function sanitize(html: string): string {
  return sanitizeHtml(html, {
    allowedTags,
    allowedAttributes,
    allowedSchemes: ['http', 'https', 'mailto'],
    allowedSchemesByTag: {},
    allowedSchemesAppliedToAttributes: ['href', 'src'],
    allowProtocolRelative: false,
    enforceHtmlBoundary: true,
  });
}