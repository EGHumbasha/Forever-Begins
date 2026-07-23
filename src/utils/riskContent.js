/**
 * Suggested starting points for each risk category. These are genuinely
 * actionable defaults grounded in real Zimbabwean wedding logistics
 * (e.g. load-shedding for power outages) — a starting point to edit,
 * not a substitute for the couple's own specific plan.
 */
export const RISK_SUGGESTIONS = {
  rain: `Confirm with the venue whether there's an indoor backup space or a tent option.
Have ponchos or umbrellas on hand for the bridal party's outdoor photos.
Move the photography session earlier in the day in case afternoon rain is more likely.
Brief the MC on a quick announcement plan if guests need to relocate indoors.`,

  'supplier-cancellation': `Get the vendor's contract terms in writing — including their cancellation policy — before the day.
Identify one backup option per critical vendor category (caterer, photographer, DJ) and save their contact details in advance.
Keep the vendor's deposit receipt accessible in case of a dispute.
Ask your venue or a trusted vendor for a referral list of last-minute replacements in your area.`,

  'power-outage': `Confirm whether the venue has a generator, and if not, arrange a backup generator rental for the day.
Charge all phones, speakers, and equipment fully the night before.
Keep a few battery-powered lights or lanterns on hand as a fallback.
Ask the DJ/sound provider if their equipment has battery backup for short outages.`,

  'budget-overrun': `Keep an emergency fund (see the Budget page) specifically untouched until the final two weeks.
Review the Budget page weekly in the lead-up to catch overspending early, not after the fact.
Identify 2-3 "nice to have" line items that could be cut first if needed (e.g. favours, extra decor) without affecting the core day.
Agree in advance who has final sign-off on any new spending request.`,

  'vehicle-breakdown': `Keep a backup driver/vehicle on standby, separate from the main wedding car.
Save the contact of a reliable local mechanic or roadside assistance service.
Build a small buffer into the transport schedule (10-15 minutes) so a delay doesn't cascade into the ceremony time.
Confirm vehicles are serviced and fuelled the day before, not the morning of.`,

  delays: `Build buffer time into the schedule between major segments (ceremony to reception, meal to speeches).
Designate one person (coordinator or MC) with authority to adjust the schedule live on the day.
Communicate realistic arrival times to vendors, factoring in typical traffic for the route.
Have a backup plan for what happens if the officiant or a key participant is delayed.`,
};

export const RISK_STATUS_OPTIONS = [
  { value: 'not-prepared', label: 'Not Prepared' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'prepared', label: 'Prepared' },
];
