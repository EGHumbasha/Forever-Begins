import {
  generateWeddingInvitation,
  generateSaveTheDate,
  generateLobolaInvitation,
} from './documentTemplates/invitations';
import {
  generateWeddingProgram,
  generateLobolaProgram,
  generateMinuteByMinuteSchedule,
} from './documentTemplates/programs';
import {
  generateGroomSpeech,
  generateBrideSpeech,
  generateBestManSpeech,
  generateMaidOfHonourSpeech,
  generateVoteOfThanks,
} from './documentTemplates/speeches';
import {
  generateTraditionalVows,
  generatePersonalVowsFramework,
  generateOpeningPrayer,
  generateClosingPrayer,
} from './documentTemplates/vowsAndPrayers';
import { generateMcScript, generateLobolaMcScript } from './documentTemplates/mcScripts';
import {
  generateWhatsAppInvite,
  generateRsvpReminder,
  generateThankYouMessage,
} from './messageTemplates';

/**
 * Each entry defines: a unique type key, display label, the section it
 * belongs to (for grouping in the UI), the content "shape" (plain text
 * vs. an ordered list of steps/segments), and a generate() function that
 * takes the app's live data and returns fresh starter content.
 */
export const DOCUMENT_TYPES = [
  // ---- Invitations ----
  {
    key: 'wedding-invitation',
    label: 'Wedding Invitation',
    section: 'Invitations',
    shape: 'text',
    generate: (data) =>
      generateWeddingInvitation({
        coupleNames: data.meta.coupleNames,
        weddingDate: data.meta.weddingDate,
        venue: '',
        time: '',
      }),
  },
  {
    key: 'save-the-date',
    label: 'Save the Date',
    section: 'Invitations',
    shape: 'text',
    generate: (data) =>
      generateSaveTheDate({ coupleNames: data.meta.coupleNames, weddingDate: data.meta.weddingDate }),
  },
  {
    key: 'lobola-invitation',
    label: "Lobola Invitation Letter",
    section: 'Invitations',
    shape: 'text',
    generate: (data) =>
      generateLobolaInvitation({
        groomFamilyName: '',
        brideFamilyName: '',
        lobolaDate: data.meta.lobolaDate,
        venue: '',
      }),
  },

  // ---- Programs ----
  {
    key: 'wedding-program',
    label: 'Wedding Day Program',
    section: 'Programs',
    shape: 'list',
    listFields: ['time', 'item'],
    generate: (data) =>
      generateWeddingProgram({ coupleNames: data.meta.coupleNames, weddingDate: data.meta.weddingDate, venue: '' }),
  },
  {
    key: 'lobola-program',
    label: 'Lobola Day Program',
    section: 'Programs',
    shape: 'list',
    listFields: ['time', 'item'],
    generate: () => generateLobolaProgram(),
  },
  {
    key: 'minute-schedule',
    label: 'Minute-by-Minute Schedule',
    section: 'Programs',
    shape: 'list',
    listFields: ['time', 'activity', 'owner'],
    generate: (data) => generateMinuteByMinuteSchedule({ weddingDate: data.meta.weddingDate }),
  },

  // ---- MC Scripts ----
  {
    key: 'mc-script-wedding',
    label: 'Wedding MC Script',
    section: 'MC Scripts',
    shape: 'list',
    listFields: ['segment', 'script'],
    generate: (data) =>
      generateMcScript({ coupleNames: data.meta.coupleNames, weddingDate: data.meta.weddingDate, venue: '' }),
  },
  {
    key: 'mc-script-lobola',
    label: 'Lobola MC Script',
    section: 'MC Scripts',
    shape: 'list',
    listFields: ['segment', 'script'],
    generate: () => generateLobolaMcScript(),
  },

  // ---- Speeches ----
  {
    key: 'groom-speech',
    label: 'Groom Speech',
    section: 'Speeches',
    shape: 'text',
    generate: (data) =>
      generateGroomSpeech({ groomName: data.meta.coupleNames.partner1, brideName: data.meta.coupleNames.partner2 }),
  },
  {
    key: 'bride-speech',
    label: 'Bride Speech',
    section: 'Speeches',
    shape: 'text',
    generate: (data) =>
      generateBrideSpeech({ brideName: data.meta.coupleNames.partner2, groomName: data.meta.coupleNames.partner1 }),
  },
  {
    key: 'best-man-speech',
    label: 'Best Man Speech',
    section: 'Speeches',
    shape: 'text',
    generate: (data) =>
      generateBestManSpeech({ groomName: data.meta.coupleNames.partner1, brideName: data.meta.coupleNames.partner2 }),
  },
  {
    key: 'maid-of-honour-speech',
    label: 'Maid of Honour Speech',
    section: 'Speeches',
    shape: 'text',
    generate: (data) =>
      generateMaidOfHonourSpeech({ brideName: data.meta.coupleNames.partner2, groomName: data.meta.coupleNames.partner1 }),
  },
  {
    key: 'vote-of-thanks',
    label: 'Vote of Thanks',
    section: 'Speeches',
    shape: 'text',
    generate: (data) => generateVoteOfThanks({ coupleNames: data.meta.coupleNames }),
  },

  // ---- Vows & Prayers ----
  {
    key: 'traditional-vows',
    label: 'Traditional Vows',
    section: 'Vows & Prayers',
    shape: 'text',
    generate: (data) => generateTraditionalVows({ partnerName: data.meta.coupleNames.partner2 }),
  },
  {
    key: 'personal-vows',
    label: 'Personal Vows Framework',
    section: 'Vows & Prayers',
    shape: 'text',
    generate: (data) => generatePersonalVowsFramework({ partnerName: data.meta.coupleNames.partner2 }),
  },
  {
    key: 'opening-prayer',
    label: 'Opening Prayer',
    section: 'Vows & Prayers',
    shape: 'text',
    generate: (data) => generateOpeningPrayer({ coupleNames: data.meta.coupleNames }),
  },
  {
    key: 'closing-prayer',
    label: 'Closing Prayer',
    section: 'Vows & Prayers',
    shape: 'text',
    generate: (data) => generateClosingPrayer({ coupleNames: data.meta.coupleNames }),
  },

  // ---- Messages ----
  {
    key: 'whatsapp-invite',
    label: 'WhatsApp Invitation',
    section: 'Messages',
    shape: 'text',
    generate: (data) =>
      generateWhatsAppInvite({ guestName: '[Guest Name]', coupleNames: data.meta.coupleNames, weddingDate: data.meta.weddingDate, venue: '' }),
  },
  {
    key: 'rsvp-reminder',
    label: 'RSVP Reminder',
    section: 'Messages',
    shape: 'text',
    generate: (data) =>
      generateRsvpReminder({ guestName: '[Guest Name]', coupleNames: data.meta.coupleNames, weddingDate: data.meta.weddingDate }),
  },
  {
    key: 'thank-you-message',
    label: 'Thank-You Message',
    section: 'Messages',
    shape: 'text',
    generate: (data) => generateThankYouMessage({ guestName: '[Guest Name]', coupleNames: data.meta.coupleNames }),
  },
];

export const DOCUMENT_SECTIONS = [
  'Invitations',
  'Programs',
  'MC Scripts',
  'Speeches',
  'Vows & Prayers',
  'Messages',
];

export function getDocumentType(key) {
  return DOCUMENT_TYPES.find((d) => d.key === key);
}
