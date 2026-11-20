const Tarazu = (() => {
  // Value in paise per unit. One fictional week per observation.
  const prices = [10000, 9650, 9200, 8400, 8700, 7450, 6500, 7100, 7800, 8550, 9300, 9900, 10400];
  const gates = [3, 6, 9];
  function freshReplay() { return { week: 0, units: 1000, cash: 0, decisions: [], speed: 1 }; }
  function waiting(r) { return gates.includes(r.week) && !r.decisions.some(d => d.week === r.week); }
  function decide(r, action) {
    if (!waiting(r) || !['sell','hold'].includes(action)) return;
    const sold = action === 'sell' ? Math.floor(r.units / 2) : 0;
    r.cash += sold * prices[r.week];
    r.units -= sold;
    r.decisions.push({ week: r.week, action, sold });
  }
  function value(r, week = r.week) { return r.cash + r.units * prices[week]; }
  // Exposure retained after the last checkpoint; a descriptive exercise metric.
  function score(r) { return r.week === 12 ? Math.round(r.units / 10) : null; }
  function reversals(orders) {
    const last = new Map();
    let count = 0;
    for (const order of orders) {
      if (last.has(order.id) && last.get(order.id) !== order.side) count++;
      last.set(order.id, order.side);
    }
    return count;
  }
  // Month-end contribution; interest rounded to nearest paise every month.
  function future(payment, months, monthlyBp) {
    let balance=0;
    for(let month=0; month<months; month++){
      balance += Math.round(balance*monthlyBp/10000) + payment;
    }
    return balance;
  }
  function sip(target, months) {
    if(!Number.isSafeInteger(target)||target<100||target>1000000000||
       !Number.isInteger(months)||months<1||months>120)throw new RangeError('Invalid goal');
    let low=0,high=target;
    while(low<high){
      const mid=Math.floor((low+high)/2);
      if(future(mid,months,50)>=target)high=mid;
      else low=mid+1;
    }
    return { payment:low, worst:future(low,months,-25), likely:future(low,months,50), best:future(low,months,80) };
  }
  return { sip, future, score, reversals, prices, gates, freshReplay, waiting, decide, value };
})();
if (typeof module !== 'undefined') module.exports = Tarazu;
