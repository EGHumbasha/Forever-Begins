export function generateTraditionalVows({ partnerName }) {
  return `I, [your name], take you, ${partnerName || '[partner\'s name]'}, to be my lawfully wedded [husband/wife],
to have and to hold from this day forward,
for better, for worse,
for richer, for poorer,
in sickness and in health,
to love and to cherish,
until death do us part.`;
}

export function generatePersonalVowsFramework({ partnerName }) {
  return `${partnerName || '[Partner\'s name]'},

[Open with how you felt the moment you knew you wanted to marry them]

I promise to [specific promise — something true to your relationship, not generic]

I promise to [a second specific promise]

I promise to [a third specific promise — can be playful or serious]

Even when [acknowledge a real challenge you'll face together — distance, family, finances, whatever is true for you], I promise to [how you'll face it together]

I choose you today, and I will choose you again tomorrow, and every day after that.

I love you, and I can't wait to spend forever as your [husband/wife].`;
}

export function generateOpeningPrayer({ coupleNames }) {
  const { partner1, partner2 } = coupleNames;
  return `Heavenly Father,

We gather today to witness and celebrate the union of ${partner1 || '[Partner 1]'} and ${partner2 || '[Partner 2]'}.

We thank You for bringing them together and for the love You have placed in their hearts for one another.

We ask for Your blessing on this marriage — that You would grant them patience in trial,
joy in companionship, and a love that grows deeper with each passing year.

Bless their families, who have walked this journey with them, including the lobola process
that united our two families.

Watch over this couple as they begin their life together, and may their home be filled
with Your peace and presence.

In Jesus' name we pray,
Amen.`;
}

export function generateClosingPrayer({ coupleNames }) {
  const { partner1, partner2 } = coupleNames;
  return `Heavenly Father,

We thank You for this day and for the vows ${partner1 || '[Partner 1]'} and ${partner2 || '[Partner 2]'}
have just exchanged before You and these witnesses.

Seal this union with Your blessing. May their marriage be a testimony of Your faithfulness,
and may they continue to grow in love, patience, and grace toward one another.

Bless this celebration, the food we are about to share, and everyone who has travelled
to be here today.

Guide ${partner1 || '[Partner 1]'} and ${partner2 || '[Partner 2]'} in the years ahead,
and may their home always be a place of love and peace.

In Jesus' name we pray,
Amen.`;
}
