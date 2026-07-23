import { formatDate } from '../dateUtils';

export function generateWeddingProgram({ coupleNames, weddingDate, venue }) {
  const { partner1, partner2 } = coupleNames;
  return [
    { time: '', item: 'Guest arrival & seating' },
    { time: '', item: 'Processional — entrance of the bridal party' },
    { time: '', item: `Entrance of ${partner2 || 'the bride'}` },
    { time: '', item: 'Welcome remarks by the officiant' },
    { time: '', item: 'Exchange of vows' },
    { time: '', item: 'Exchange of rings' },
    { time: '', item: 'Pronouncement of marriage' },
    { time: '', item: 'Signing of the register' },
    { time: '', item: 'Recessional — exit of the newlyweds' },
    { time: '', item: 'Photographs' },
    { time: '', item: 'Guests proceed to reception venue' },
    { time: '', item: 'Reception: grand entrance of the newlyweds' },
    { time: '', item: 'Welcome toast / opening remarks' },
    { time: '', item: 'Meal service' },
    { time: '', item: 'Speeches (best man, maid of honour, parents)' },
    { time: '', item: 'Cake cutting' },
    { time: '', item: 'First dance' },
    { time: '', item: 'Father-daughter / mother-son dance' },
    { time: '', item: 'Open dance floor' },
    { time: '', item: 'Bouquet & garter toss (optional)' },
    { time: '', item: 'Send-off' },
  ];
}

export function generateLobolaProgram() {
  return [
    { time: '', item: 'Groom\'s delegation arrives and waits at the gate' },
    { time: '', item: 'Gate fee negotiation & entry granted' },
    { time: '', item: 'Delegation seated; both families introduced via the munyai' },
    { time: '', item: 'Purpose of visit formally stated' },
    { time: '', item: 'Bride is called in to confirm consent' },
    { time: '', item: 'Letter of intent / opening token presented' },
    { time: '', item: 'Main lobola negotiation (rusambo, danga, etc.)' },
    { time: '', item: 'Gifts for specific relatives negotiated and settled' },
    { time: '', item: 'Amounts confirmed and recorded by both munyai' },
    { time: '', item: 'Blessing from the bride\'s family' },
    { time: '', item: 'Closing remarks / prayer' },
    { time: '', item: 'Meal shared between both families' },
  ];
}

export function generateMinuteByMinuteSchedule({ weddingDate }) {
  // A skeleton schedule the couple fills in with actual times —
  // intentionally not inventing specific hours since every wedding's
  // ceremony/reception timing differs.
  return [
    { time: '', activity: 'Hair & makeup begins', owner: 'Bridal party' },
    { time: '', activity: 'Groom & groomsmen prepare', owner: 'Groom\'s party' },
    { time: '', activity: 'Photographer arrives for getting-ready shots', owner: 'Photographer' },
    { time: '', activity: 'Bridal party departs for venue', owner: 'Bridal party' },
    { time: '', activity: 'Groom & groomsmen arrive at venue', owner: 'Groom\'s party' },
    { time: '', activity: 'Guests begin arriving', owner: 'Ushers' },
    { time: '', activity: 'Ceremony begins', owner: 'Officiant' },
    { time: '', activity: 'Ceremony ends; photographs', owner: 'Photographer' },
    { time: '', activity: 'Guests transition to reception', owner: 'All' },
    { time: '', activity: 'Reception entrance', owner: 'MC' },
    { time: '', activity: 'Meal service begins', owner: 'Caterer' },
    { time: '', activity: 'Speeches', owner: 'MC' },
    { time: '', activity: 'Cake cutting & first dance', owner: 'Couple' },
    { time: '', activity: 'Open dancing', owner: 'DJ' },
    { time: '', activity: 'Send-off', owner: 'All' },
  ];
}
