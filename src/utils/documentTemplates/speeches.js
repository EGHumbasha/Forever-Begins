/**
 * These are structured starting frameworks, not finished speeches —
 * a real speech needs the speaker's own memories and voice. Each
 * generator returns a scaffold with prompts/placeholders the person
 * fills in, plus genuinely usable transition language and a few framed
 * opening/closing lines so it's not a blank page.
 */

export function generateGroomSpeech({ brideName, groomName }) {
  return `Good evening everyone,

[Open with a thank-you to guests, both families, and whoever organised the day]

For those who don't know me, I'm ${groomName || '[your name]'}, and today I get to call ${brideName || '[partner\'s name]'} my wife.

[Tell a short story of how you met or a moment that made you realise she was the one — keep it specific and personal, 2-3 sentences]

[Say something true and specific about who she is — not just "beautiful" or "kind," but a real example of her character]

To our parents and families — [thank them specifically; mention what they did for you both, including the lobola process if relevant]

To our friends who are here — [a line of thanks]

${brideName || 'My wife'}, [turn to her directly]

I promise you [one or two specific promises, not generic ones]

Thank you all for being here to witness the start of our forever.

[Raise a toast]`;
}

export function generateBrideSpeech({ brideName, groomName }) {
  return `Good evening everyone,

Thank you all so much for being here today and for all the love you've shown ${groomName || '[partner\'s name]'} and me.

[Share a brief story — what drew you to him, or a moment you knew]

[A specific, true compliment about his character — something only you would know]

To my parents — [thank them for raising you, for the lobola process, for their support]

To his family — [thank them for welcoming you]

${groomName || 'My husband'}, [turn to him]

[One or two specific promises or things you're looking forward to]

I'm so grateful to start this next chapter with all of you as witnesses.

Thank you.`;
}

export function generateBestManSpeech({ groomName, brideName }) {
  return `Good evening everyone, I'm [your name], ${groomName || 'the groom'}'s best man.

[Brief intro of how you know the groom — how long, how you met]

[A funny but appropriate story about the groom — keep it warm, not embarrassing]

[A moment that shows his character or how he's changed since meeting ${brideName || 'the bride'}]

${brideName || 'Her'}, welcome to the family/friend group — [a genuine line about her]

To ${groomName || 'the groom'} — [a sincere line of well-wishing]

Please join me in raising a glass to ${groomName || '[groom]'} and ${brideName || '[bride]'}.

To the happy couple!`;
}

export function generateMaidOfHonourSpeech({ brideName, groomName }) {
  return `Good evening everyone, I'm [your name], ${brideName || 'the bride'}'s maid of honour.

[How long you've known her / how you met]

[A story that shows her heart, sense of humour, or what makes her a great friend]

[A moment you saw her with ${groomName || 'the groom'} that confirmed he was right for her]

${groomName || 'Welcome to the family'} — [a genuine line about him]

To ${brideName || 'the bride'} — [a sincere line of well-wishing for the marriage]

Please raise your glasses to ${brideName || '[bride]'} and ${groomName || '[groom]'}.

Cheers to forever!`;
}

export function generateVoteOfThanks({ coupleNames }) {
  const { partner1, partner2 } = coupleNames;
  return `On behalf of ${partner1 || '[Partner 1]'} and ${partner2 || '[Partner 2]'}, and both of our families,
we want to extend our deepest gratitude.

To our parents — for your guidance, sacrifice, and blessing throughout this journey,
including the lobola process that brought our families together.

To our wedding party — for standing with us today and for all the time and effort
you put into being part of this day.

To our vendors and everyone who worked behind the scenes — [name specific vendors if you'd like]
— thank you for making today possible.

To every guest here — your presence is the greatest gift we could ask for.
Thank you for travelling, for celebrating with us, and for being part of our story.

We are overwhelmed with gratitude and excited for the years ahead.

Thank you all, from the bottom of our hearts.`;
}
