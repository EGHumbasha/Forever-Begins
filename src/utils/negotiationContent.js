/**
 * Generates a negotiation-day agenda and talking points grounded in the
 * conventional structure of a Zimbabwean roora/lobola ceremony. This is
 * a guide for the families' own munyai/negotiators to adapt — every
 * family's specific requests and amounts will differ, and the script
 * leaves those as fields to fill in rather than inventing numbers.
 */
export function generateNegotiationAgenda({ groomName, brideName, lobolaDate }) {
  return [
    {
      stage: '1. Arrival & Knocking (Kugopa)',
      points: [
        'Groom\'s family delegation, led by the munyai, arrives and knocks at the gate/door.',
        'A small fee (musha/gate fee) is often requested before entry is granted — confirm in advance whether this is expected.',
        'Delegation is invited in and seated separately from the bride\'s family.',
      ],
    },
    {
      stage: '2. Introductions (Kuzivisa)',
      points: [
        'Each family\'s spokesperson (sabhuku/munyai) introduces their delegation by name and relation.',
        'The groom\'s munyai states the purpose of the visit clearly and respectfully.',
        'Bride\'s family confirms they recognise the relationship and the bride in question.',
      ],
    },
    {
      stage: '3. Verification (Kusuma)',
      points: [
        'Bride\'s family may ask to verify the bride is willing and is who the groom\'s family believes she is.',
        'The bride is called in to confirm consent in front of both families.',
      ],
    },
    {
      stage: '4. Presentation of Letter / Declaration',
      points: [
        'The munyai formally presents the letter of intent and any opening token (often called "rusambo rwekutanga").',
        'Amounts and items are not usually all settled at once — expect rounds of discussion.',
      ],
    },
    {
      stage: '5. Negotiation of Damages / Apologies (if applicable)',
      points: [
        'If there are matters needing acknowledgement (e.g. a child born before lobola), these are addressed here with appropriate apology payments.',
      ],
    },
    {
      stage: '6. Main Lobola Negotiation (Rusambo)',
      points: [
        'The bride\'s family states their requests: cash (rusambo), cattle or cattle equivalent, groceries, and gifts for specific relatives.',
        'The groom\'s family responds, and amounts are negotiated — this is expected to involve back-and-forth, sometimes with humour, sometimes firm.',
        'Agree and write down every amount as it is settled, witnessed by both munyai.',
      ],
    },
    {
      stage: '7. Gifts for Family Members',
      points: [
        'Specific items/cash for the bride\'s mother (appreciation for raising her), aunts (vatete), and other relatives are requested and settled individually.',
      ],
    },
    {
      stage: '8. Blessing & Closing',
      points: [
        'Once all amounts are agreed and (fully or partially) paid, the bride\'s family gives their blessing.',
        'A closing prayer or word is offered.',
        'Refreshments / a meal is typically shared between both families.',
      ],
    },
  ];
}

export function generateTalkingPoints() {
  return [
    'Always address the other family\'s munyai, not individuals directly — this keeps the negotiation respectful and structured.',
    'Agree beforehand within your own family on your maximum budget and your "walk back to consult" signal, so no one is put on the spot.',
    'It is normal and expected to ask for a short recess to consult privately — use it freely.',
    'Write down every amount agreed, and have it confirmed by both munyai before moving to the next item.',
    'Keep tone warm even when negotiating firmly — roora is a negotiation between families that are about to be joined, not adversaries.',
  ];
}
