import { formatDate } from '../dateUtils';

export function generateWeddingInvitation({ coupleNames, weddingDate, venue, time }) {
  const { partner1, partner2 } = coupleNames;
  return `Together with their families,

${partner1 || '[Partner 1]'}
&
${partner2 || '[Partner 2]'}

request the pleasure of your company
as they celebrate their marriage

${formatDate(weddingDate)}${time ? ` at ${time}` : ''}
${venue || '[Venue to be confirmed]'}

Reception to follow

Kindly RSVP`;
}

export function generateSaveTheDate({ coupleNames, weddingDate }) {
  const { partner1, partner2 } = coupleNames;
  return `Save the Date

${partner1 || '[Partner 1]'} & ${partner2 || '[Partner 2]'}
are getting married!

${formatDate(weddingDate)}

Formal invitation with full details to follow.
We can't wait to celebrate with you.`;
}

export function generateLobolaInvitation({ groomFamilyName, brideFamilyName, lobolaDate, venue }) {
  return `To the ${brideFamilyName || '[Bride\'s Family]'} family,

The ${groomFamilyName || '[Groom\'s Family]'} family humbly requests the opportunity to visit
your home for the traditional lobola (roora) negotiations.

Proposed date: ${formatDate(lobolaDate)}
Venue: ${venue || '[To be confirmed]'}

We look forward to your family's blessing and to formally beginning
the union between our children.

With respect and gratitude,
The ${groomFamilyName || '[Groom\'s Family]'} family`;
}
