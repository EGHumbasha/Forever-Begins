import { formatDate } from '../dateUtils';

export function generateMcScript({ coupleNames, weddingDate, venue }) {
  const { partner1, partner2 } = coupleNames;
  const p1 = partner1 || '[Partner 1]';
  const p2 = partner2 || '[Partner 2]';

  return [
    {
      segment: 'Welcome',
      script: `Good [afternoon/evening], everyone, and welcome! My name is [your name], and I have the honour of being your Master of Ceremonies today as we celebrate the marriage of ${p1} and ${p2}. Please make sure you're seated comfortably — we have a wonderful celebration ahead of us.`,
    },
    {
      segment: 'Opening Prayer',
      script: `Before we begin, let's bow our heads as [name of person praying] leads us in a word of prayer.`,
    },
    {
      segment: 'Grand Entrance',
      script: `And now, the moment we've all been waiting for! Please stand and join me in welcoming, for the very first time as a married couple — Mr and Mrs ${p1.split(' ')[0] || p1} [Surname]!`,
    },
    {
      segment: 'Welcome Toast',
      script: `Please take a moment to ensure everyone has a glass. [Name], would you like to lead us in the welcome toast?`,
    },
    {
      segment: 'Meal Service',
      script: `While we enjoy this wonderful meal prepared for us today, please relax, mingle, and enjoy the company around you. We'll resume our programme shortly.`,
    },
    {
      segment: 'Speeches Introduction',
      script: `As we move into the speeches, I'd like to invite [first speaker, e.g. the father of the bride] to share a few words.`,
    },
    {
      segment: 'Best Man / Maid of Honour',
      script: `Next, let's welcome [name], who has a few words to share as best man/maid of honour.`,
    },
    {
      segment: 'Vote of Thanks',
      script: `And now, on behalf of both families, [name] will deliver a vote of thanks.`,
    },
    {
      segment: 'Cake Cutting',
      script: `It's time for one of the sweetest traditions of the day — would ${p1} and ${p2} please make your way to the cake table?`,
    },
    {
      segment: 'First Dance',
      script: `Ladies and gentlemen, please clear the dance floor and join me in watching ${p1} and ${p2} share their first dance as husband and wife.`,
    },
    {
      segment: 'Parent Dances',
      script: `Now I'd like to invite [father of the bride / mother of the groom etc.] to join the dance floor for a special dance.`,
    },
    {
      segment: 'Open Dance Floor',
      script: `Now it's your turn! Everyone, please join the newlyweds on the dance floor and let's celebrate!`,
    },
    {
      segment: 'Send-off',
      script: `As our celebration draws to a close, please gather around as ${p1} and ${p2} prepare for their send-off. Thank you all so much for being part of this beautiful day. Travel safely, and goodnight!`,
    },
  ];
}

export function generateLobolaMcScript() {
  return [
    {
      segment: 'Arrival',
      script: `[Munyai for the bride's family] welcomes the visiting delegation and confirms they may approach the gate.`,
    },
    {
      segment: 'Gate Negotiation',
      script: `The visiting munyai requests entry on behalf of the groom's family. A token gate fee may be discussed before entry is granted.`,
    },
    {
      segment: 'Seating & Introductions',
      script: `Both delegations are seated. Each munyai introduces their respective family members by name and relation.`,
    },
    {
      segment: 'Statement of Purpose',
      script: `The groom's munyai formally states the purpose of the visit and presents the letter of intent.`,
    },
    {
      segment: 'Confirmation of the Bride',
      script: `The bride is called in to confirm, in front of both families, that she recognises and accepts the proposal.`,
    },
    {
      segment: 'Main Negotiation',
      script: `The bride's family states their requirements. Negotiation proceeds between both munyai until amounts are agreed.`,
    },
    {
      segment: 'Recording Agreements',
      script: `Each settled item is recorded and confirmed aloud by both munyai before moving to the next.`,
    },
    {
      segment: 'Blessing',
      script: `Once negotiations conclude, a senior member of the bride's family offers a blessing over the union.`,
    },
    {
      segment: 'Closing',
      script: `A closing word or prayer is offered, followed by a shared meal between both families.`,
    },
  ];
}
