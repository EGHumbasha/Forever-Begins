import{n as e}from"./dateUtils-DKejToBJ.js";function t({guestName:t,coupleNames:n,weddingDate:r,venue:i}){let a=`${n.partner1||`we`} & ${n.partner2||``}`.trim();return`Dear ${t||`Guest`},

With joy in our hearts, ${a} are getting married! 💍

We would be truly honoured to have you celebrate with us on ${e(r)}${i?` at ${i}`:``}.

Please let us know if you'll be able to join us by replying to this message.

With love,
${a}`}function n({guestName:t,coupleNames:n,weddingDate:r}){let i=`${n.partner1||``} & ${n.partner2||``}`.trim();return`Hi ${t||`there`}, just a gentle reminder from ${i} 💛 — our wedding is coming up on ${e(r)} and we'd love to know if you'll be able to make it. Please reply when you get a chance so we can finalise numbers. Thank you!`}function r({guestName:e,coupleNames:t}){let n=`${t.partner1||``} & ${t.partner2||``}`.trim();return`Dear ${e||`Guest`},

Thank you so much for being part of our special day. Your presence, love, and support meant the world to us.

With heartfelt gratitude,
${n}`}export{r as n,t as r,n as t};