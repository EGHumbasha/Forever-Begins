import { formatDate } from './dateUtils';

export function generateWhatsAppInvite({ guestName, coupleNames, weddingDate, venue }) {
  const names = `${coupleNames.partner1 || 'we'} & ${coupleNames.partner2 || ''}`.trim();
  return `Dear ${guestName || 'Guest'},

With joy in our hearts, ${names} are getting married! 💍

We would be truly honoured to have you celebrate with us on ${formatDate(weddingDate)}${venue ? ` at ${venue}` : ''}.

Please let us know if you'll be able to join us by replying to this message.

With love,
${names}`;
}

export function generateRsvpReminder({ guestName, coupleNames, weddingDate }) {
  const names = `${coupleNames.partner1 || ''} & ${coupleNames.partner2 || ''}`.trim();
  return `Hi ${guestName || 'there'}, just a gentle reminder from ${names} 💛 — our wedding is coming up on ${formatDate(weddingDate)} and we'd love to know if you'll be able to make it. Please reply when you get a chance so we can finalise numbers. Thank you!`;
}

export function generateThankYouMessage({ guestName, coupleNames }) {
  const names = `${coupleNames.partner1 || ''} & ${coupleNames.partner2 || ''}`.trim();
  return `Dear ${guestName || 'Guest'},

Thank you so much for being part of our special day. Your presence, love, and support meant the world to us.

With heartfelt gratitude,
${names}`;
}
