// Default data — pre-loaded with your real planning data.
// Names and dates are left blank so the onboarding modal collects them.

export const defaultData = {
  meta: {
    coupleNames: { partner1: '', partner2: '' },
    lobolaDate: '2026-09-12',
    weddingDate: '2026-09-18',
    currency: 'USD',
    createdAt: '2026-06-19T14:01:10.988Z',
    onboarded: false,
    lastImportedAt: null,
  },

  tasks: [
    { id: '91989a5f-9a5b-4aa5-b9d8-a08c887b79bb', status: 'todo', priority: 'high', recurrence: 'none', createdAt: '2026-06-21T05:52:29.590Z', title: 'Venue', description: 'Put up a list, visit each one and decide', category: 'wedding', dueDate: '2026-06-30' },
    { id: '65b86021-f699-4f92-8616-30b2189d3304', status: 'todo', priority: 'high', recurrence: 'none', createdAt: '2026-06-21T05:53:51.758Z', title: 'Confirm caterer menu', description: '', category: 'wedding', dueDate: '2026-07-12' },
    { id: 'b7507c75-f26b-4fbd-8328-8f5e368bb5fa', status: 'todo', priority: 'high', recurrence: 'none', createdAt: '2026-06-21T05:54:25.051Z', title: 'Confirm decoration', description: '', category: 'wedding', dueDate: '2026-07-12' },
    { id: '2f9c5664-5370-47d4-a61e-af4a5b33a458', status: 'todo', priority: 'medium', recurrence: 'none', createdAt: '2026-06-21T05:55:06.102Z', title: 'Confirm with dj', description: '', category: 'wedding', dueDate: '2026-07-18' },
    { id: '73e9bf11-1773-4d29-b7d4-4d05f3fc86e8', status: 'todo', priority: 'medium', recurrence: 'none', createdAt: '2026-06-21T05:55:25.529Z', title: 'Artist invite', description: '', category: 'wedding', dueDate: '2026-07-18' },
    { id: 'de7b8662-6792-46e7-aefc-9e24568d2861', status: 'todo', priority: 'medium', recurrence: 'none', createdAt: '2026-06-21T05:56:42.669Z', title: 'Confirm MC', description: '', category: 'wedding', dueDate: '2026-07-31' },
    { id: '5aa1df9e-267c-48af-941b-fdfef706e27c', status: 'todo', priority: 'medium', recurrence: 'none', createdAt: '2026-06-21T05:58:23.471Z', title: 'Confirm with priest', description: '', category: 'wedding', dueDate: '2026-06-28' },
    { id: '08281b70-413a-4c4d-82a6-7d4fd1ea65df', status: 'todo', priority: 'high', recurrence: 'none', createdAt: '2026-06-21T05:59:25.123Z', title: 'Decorations', description: '', category: 'lobola', dueDate: '2026-06-30' },
    { id: 'a8842ed1-11a7-47e6-a87e-8583e62d61d3', status: 'todo', priority: 'medium', recurrence: 'none', createdAt: '2026-06-21T05:59:48.614Z', title: 'Confirm theme', description: '', category: 'wedding', dueDate: '2026-06-30' },
    { id: '83c7a839-28e6-4fc9-83e1-de862dbff160', status: 'todo', priority: 'medium', recurrence: 'none', createdAt: '2026-06-21T06:00:47.665Z', title: 'Confirm with photographer', description: '', category: 'wedding', dueDate: '2026-07-04' },
    { id: 'af3e4c0c-22d7-4f09-8584-35c89bf4b5bd', status: 'todo', priority: 'medium', recurrence: 'none', createdAt: '2026-06-21T06:03:11.454Z', title: 'Confirm with Photographer (lobola)', description: '', category: 'lobola', dueDate: '2026-07-04' },
    { id: 'c793c362-48dd-4960-bf74-12916ec76e4b', status: 'todo', priority: 'medium', recurrence: 'none', createdAt: '2026-06-21T06:16:31.309Z', title: 'Cake bake', description: '', category: 'wedding', dueDate: '2026-07-11' },
    { id: 'eb52f3d7-0dc1-4674-9d3c-d7e55de9b5b3', status: 'todo', priority: 'medium', recurrence: 'none', createdAt: '2026-06-21T06:19:57.344Z', title: 'Invitation cards', description: '', category: 'wedding', dueDate: '2026-07-17' },
    { id: '6cab8b5f-e905-4225-9da0-2aea833db614', status: 'todo', priority: 'medium', recurrence: 'none', createdAt: '2026-06-21T06:20:22.383Z', title: 'Wedding website', description: '', category: 'wedding', dueDate: '2026-07-17' },
    { id: '1bd898e0-e3f6-4ee1-b676-866aac4af0d3', status: 'todo', priority: 'medium', recurrence: 'none', createdAt: '2026-06-21T06:20:59.498Z', title: 'Put up a list of guests', description: '', category: 'wedding', dueDate: '2026-06-30' },
    { id: '9f1e1ea2-f3c1-44cc-a425-441fca2b3249', status: 'todo', priority: 'medium', recurrence: 'none', createdAt: '2026-06-21T06:28:09.326Z', title: 'Invitation of very high profiles across the world', description: '', category: 'wedding', dueDate: '2026-07-31' },
  ],

  budget: {
    totalPlanned: 0,
    categories: [
      { id: '709c595d-3475-4743-96a5-87e47cb24c93', name: 'Lobola — Roora payment', type: 'lobola', planned: 5000, spent: 0 },
      { id: 'b093c24d-068d-4934-9ed5-41cbd87f303f', name: 'Lobola — Groceries (mombe yechimanda etc.)', type: 'lobola', planned: 600, spent: 0 },
      { id: '49ca009f-0b86-4580-8212-2da322a6189f', name: 'Catering', type: 'wedding', planned: 300, spent: 0 },
      { id: 'e8386fe8-670a-4b43-a925-c189e8053b79', name: 'Attire', type: 'wedding', planned: 500, spent: 0 },
      { id: '9a68b459-3c55-4228-a945-c9608bf57b3e', name: 'Photography & Videography', type: 'wedding', planned: 200, spent: 0 },
      { id: 'a5af89b6-0fcb-4c65-9d60-3b5beedd343b', name: 'Decor & Flowers', type: 'wedding', planned: 150, spent: 0 },
      { id: 'e60193db-7067-45bc-9dac-db0a9c952ef9', name: 'Transport', type: 'wedding', planned: 160, spent: 0 },
      { id: '9a9e688f-33cb-4466-8c3d-4b17dc391846', name: 'Emergency Fund', type: 'other', planned: 100, spent: 0 },
      { id: '2f2aaed3-0892-473d-b58c-74715bc87fd8', name: 'Wedding venue', type: 'other', planned: 1500, spent: 0 },
      { id: '68d5d7aa-f985-4352-81c0-1aeb70c05c2c', name: 'Wedding catering', type: 'other', planned: 1300, spent: 0 },
      { id: '95b9cff4-355d-492f-92db-d5b02e2f75c1', name: 'Wedding decorations', type: 'other', planned: 1500, spent: 0 },
      { id: '74ddf33c-11ef-405f-8512-347bb3a7f88b', name: 'Wedding photographer', type: 'other', planned: 500, spent: 0 },
      { id: '41bd44a4-c05e-4f96-ad6d-8789f24d0d78', name: 'Wedding extras', type: 'other', planned: 500, spent: 0 },
      { id: 'ce75cec0-592f-416f-b74c-ff4c84b3754a', name: 'Preshoot for lobola and wedding', type: 'other', planned: 100, spent: 0 },
    ],
    payments: [],
    emergencyFundTarget: 500,
  },

  lobola: {
    brideFamily: [],
    groomFamily: [],
    requirements: {
      cash: [
        { id: 'f363c0b0-8dc6-4b34-be16-d950fe0dfc5f', item: 'Rusambo (bride price)', amount: 5000, status: 'pending', notes: '' },
      ],
      cattle: [
        { id: '023200f4-a659-45fe-9477-e4b2f313f983', item: "Mombe yehumai (mother's cow)", quantity: 1, status: 'pending', notes: '' },
      ],
      groceries: [],
      clothing: [],
      giftsForRelatives: [],
      transport: [],
    },
    negotiationMeetings: [],
  },

  guests: [],
  vendors: [],
  vendorCategories: [
    'Venue', 'Caterer', 'Decorator', 'Photographer', 'Videographer',
    'DJ / Entertainment', 'MC', 'Transport', 'Makeup Artist', 'Baker',
    'Stationery / Invitations', 'Other',
  ],
  documents: [],

  shoppingLists: {
    categories: [
      { id: 'food', name: 'Food', items: [] },
      { id: 'drinks', name: 'Drinks', items: [] },
      { id: 'decorations', name: 'Decorations', items: [] },
      { id: 'gifts', name: 'Gifts', items: [] },
      { id: 'traditional', name: 'Traditional Items', items: [] },
    ],
  },

  weddingDayOps: {
    schedule: [],
    transport: [],
    emergencyContacts: [],
    responsibilities: [],
  },

  risks: [
    { id: 'rain', title: 'Rain / Bad Weather', defaultPlan: 'Confirm with the venue whether there\'s an indoor backup space or a tent option.\nHave ponchos or umbrellas on hand for the bridal party\'s outdoor photos.\nMove the photography session earlier in the day in case afternoon rain is more likely.\nBrief the MC on a quick announcement plan if guests need to relocate indoors.', status: 'in-progress', notes: '' },
    { id: 'supplier-cancellation', title: 'Supplier / Vendor Cancellation', defaultPlan: 'Get the vendor\'s contract terms in writing — including their cancellation policy — before the day.\nIdentify one backup option per critical vendor category (caterer, photographer, DJ) and save their contact details in advance.\nKeep the vendor\'s deposit receipt accessible in case of a dispute.\nAsk your venue or a trusted vendor for a referral list of last-minute replacements in your area.', status: 'not-prepared', notes: '' },
    { id: 'power-outage', title: 'Power Outage', defaultPlan: 'Confirm whether the venue has a generator, and if not, arrange a backup generator rental for the day.\nCharge all phones, speakers, and equipment fully the night before.\nKeep a few battery-powered lights or lanterns on hand as a fallback.\nAsk the DJ/sound provider if their equipment has battery backup for short outages.', status: 'not-prepared', notes: '' },
    { id: 'budget-overrun', title: 'Budget Overrun', defaultPlan: 'Keep an emergency fund (see the Budget page) specifically untouched until the final two weeks.\nReview the Budget page weekly in the lead-up to catch overspending early, not after the fact.\nIdentify 2-3 "nice to have" line items that could be cut first if needed (e.g. favours, extra decor) without affecting the core day.\nAgree in advance who has final sign-off on any new spending request.', status: 'not-prepared', notes: '' },
    { id: 'vehicle-breakdown', title: 'Vehicle Breakdown', defaultPlan: 'Keep a backup driver/vehicle on standby, separate from the main wedding car.\nSave the contact of a reliable local mechanic or roadside assistance service.\nBuild a small buffer into the transport schedule (10-15 minutes) so a delay doesn\'t cascade into the ceremony time.\nConfirm vehicles are serviced and fuelled the day before, not the morning of.', status: 'not-prepared', notes: '' },
    { id: 'delays', title: 'Delays (ceremony, vendors, guests)', defaultPlan: 'Build buffer time into the schedule between major segments (ceremony to reception, meal to speeches).\nDesignate one person (coordinator or MC) with authority to adjust the schedule live on the day.\nCommunicate realistic arrival times to vendors, factoring in typical traffic for the route.\nHave a backup plan for what happens if the officiant or a key participant is delayed.', status: 'not-prepared', notes: '' },
  ],

  honeymoon: {
    destination: 'Cape Town, South Africa',
    startDate: '2026-09-20',
    endDate: '2026-06-25',
    budget: 2000,
    notes: '',
    packingList: [],
    travelPlans: [],
  },

  settings: { theme: 'light' },
};

export const STORAGE_KEY = 'forever-begins-data-v1';
