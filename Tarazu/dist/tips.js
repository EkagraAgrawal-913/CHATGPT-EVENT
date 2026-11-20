const TipCheck=(()=>{
 const rules=[
 ['promise',/\b(?:guaranteed?|assured|pakka)\s+(?:daily\s+)?(?:returns?|profits?|munafa)\b/gi],
 ['fixed',/\bfixed[ -](?:daily |monthly )?(?:profit|income|return)s?\b/gi],
 ['urgency',/\b(?:act now|last chance|today only|abhi karo|hurry|limited slots?)\b/gi],
 ['payment',/\b(?:pay (?:now|first|upfront)|send (?:money|payment)|join (?:our |my |the )?(?:private|vip|paid) (?:group|channel))\b/gi],
 ['offsite',/\b(?:move to|switch to|message (?:us|me) on|join (?:us )?on)\s+(?:telegram|whatsapp|signal)\b/gi],
 ['operator',/\b(?:sure[ -]shot|operator (?:call|tip)|no[ -]loss call)\b/gi],
 ['return',/\b(?:double (?:your )?money (?:in|within) (?:a |one |\d+ )?(?:day|week|month)s?|\d+(?:\.\d+)?\s*%\s*(?:daily|weekly|per day|per week|in a day))\b/gi]
 ];
 function scan(text){return rules.flatMap(([type,re])=>[...text.matchAll(re)].filter(m=>type!=='return'||!m[0].includes('%')||parseFloat(m[0])>=5).filter(m=>!/(?:\bno|\bnot|avoid|warn against)\s+$/i.test(text.slice(0,m.index))).map(m=>({type,phrase:m[0],index:m.index})))}
 return {scan};
})();
if(typeof module!=='undefined')module.exports=TipCheck;
