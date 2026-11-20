// Localise the existing views after rendering, preserving stock symbols and control values.
const vocabulary = {
 'Market snapshot':'Bazaar ki jhalak','Sample close':'Kalpanik closing','today':'aaj',
 'PORTFOLIO VALUE':'HOLDINGS KI VALUE','View portfolio':'Khata dekhein','since purchase':'kharid ke baad','Sample performance':'Kalpanik performance',
 'period start':'shuruaat','latest':'abhi','Market movers':'Tezi aur mandi','Gainers':'Badhne waale','Losers':'Girne waale','Explore markets':'Bazaar dekhein',
 'Your watchlist':'Aapki watchlist','Manage watchlist':'Watchlist sambhaalein','Save a stock from Markets to follow it here.':'Bazaar se stock save karke yahaan dekhein.',
 'MARKETS':'BAZAAR','Markets':'Bazaar','Explore stocks':'Stocks dekhein','Find a company to follow in the sample market.':'Kalpanik bazaar mein ek company chunein.',
 'All sectors':'Sabhi sectors','All stocks':'Sabhi stocks','Saved':'Save hai','Save':'Save karein','Search name or symbol':'Naam ya symbol khojein','Search stocks':'Stocks khojein',
 'No matching stocks':'Koi stock nahi mila','Try another name or widen your filters.':'Doosra naam ya filter aazmaayein.','Clear filters':'Filter hataayein',
 'SAVED STOCKS':'SAVE KIYE STOCKS','Follow price changes for companies you want to revisit.':'Apni pasand ki companies ke daam par nazar rakhein.',
 ' saved':' save hain','Find stocks':'Stocks khojein','Start with one company':'Ek company se shuru karein','Open Markets and choose Save next to a stock you recognise.':'Bazaar kholein aur pehchaane stock ke paas Save dabaayein.',
 'Company snapshot':'Company ki jhalak','Practice an order':'Order ki practice karein','The sample value of all shares in the company combined.':'Company ke sabhi shares ki kul kalpanik keemat.',
 'Price-to-earnings compares one share’s price with annual earnings per share.':'P/E ek share ke daam ko uski saalana kamaai se tulna karta hai.',
 'Designs compact electric vehicles for urban commuters.':'Shehri safar ke liye chhoti electric gaadiyan banaati hai.',
 'Builds business software for retailers and manufacturers.':'Dukaandaaron aur factories ke liye software banaati hai.',
 'Offers savings accounts and loans to households and small businesses.':'Parivaaron aur chhote vyapaaron ko bachat khaate aur loan deti hai.',
 'Develops solar projects and distributes electricity.':'Solar projects banaati hai aur bijli baantti hai.',
 'Produces packaged staples for neighbourhood grocery stores.':'Kiraana dukaanon ke liye packaged anaaj banaati hai.',
 'Builds digital tools for small online businesses.':'Chhote online vyapaaron ke liye digital tools banaati hai.',
 'PRACTICE ACCOUNT':'PRACTICE KHATA','Practice Portfolio':'Practice khata','Available cash':'Bacha hua cash','Holdings cost':'Kharid ki kul laagat',
 'Allocation':'Bantwaara','Share of your holdings by value':'Keemat ke hisaab se holdings ka hissa','Holdings':'Aapke shares','What is P&L?':'P&L kya hai?',
 'Profit and loss is the difference between the current value of your shares and what you paid for them.':'Aaj ki keemat aur kharid ki laagat ka antar hi munaafa ya nuksaan hai.',
 'Your first practice purchase will appear here.':'Pehli practice kharid yahaan dikhegi.','shares · average':'shares · ausat',
 'Practice order complete':'Practice order poora hua','Practice order':'Practice order','Try a simulated trade using your practice balance.':'Practice cash se kalpanik sauda aazmaayein.',
 'Buy':'Kharidein','Sell':'Bechein','Shares held':'Maujooda shares','Quantity':'Kitne shares','Review order':'Order jaanchein','Pause and think':'Rukein aur sochein',
 'What prompted this decision?':'Ye faisla kyun liya?','Choose a reason':'Wajah chunein','Following my plan':'Apne plan ke anusaar','Reacting to a price move':'Daam badalne par',
 'Testing the simulator':'Simulator aazmaane ke liye','Edit order':'Order badlein','Review simulated buy':'Kalpanik kharid jaanchein','Review simulated sell':'Kalpanik bikri jaanchein',
 'Confirm simulated buy':'Kalpanik kharid confirm karein','Confirm simulated sell':'Kalpanik bikri confirm karein','Bought ':'Kharide ','Sold ':'Beche ',' shares of ':' shares · ',
 'Available cash is ':'Bacha hua cash ','See portfolio':'Khata dekhein','Enter a positive whole number of shares.':'Shares ki ginti ek ya zyaada poori sankhya mein bharein.',
 'Insufficient practice cash. Reduce your quantity.':'Practice cash kam hai. Shares ki ginti ghataayein.','You can only sell shares you hold.':'Sirf apne paas waale shares bech sakte hain.',
 'Stock unavailable':'Stock nahi mila','Page unavailable':'Page nahi mila','Browse sample stocks':'Kalpanik stocks dekhein','Return to dashboard':'Ghar lautein'
};
const phrases=Object.keys(vocabulary).sort((a,b)=>b.length-a.length);
function translateLegacy(root){
 if(state.language!=='hi')return;
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
 let node;
 while((node=walker.nextNode())){
   const input=node.nodeValue;
   // Match against the original text once, so translated substrings cannot be translated twice.
   const key=phrases.find(k=>input.trim()===k)||phrases.find(k=>input.includes(k));
   if(key)node.nodeValue=input.replace(key,vocabulary[key]);
 }
 const search=root.querySelector('#search');
 if(search){search.placeholder=vocabulary['Search name or symbol'];search.setAttribute('aria-label',vocabulary['Search stocks'])}
}
