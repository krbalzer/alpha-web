const {chromium}=require('playwright');const fs=require('fs');
const BASE=process.argv[2];
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});
await p.goto(BASE+'/',{waitUntil:'load',timeout:60000});
const slugs=await p.evaluate(()=>[...new Set([...document.querySelectorAll('a[href^="/brands/"]')].map(a=>a.getAttribute('href').split('/')[2]))]);
const meta=[];
for(const s of slugs){
  await p.goto(BASE+'/brands/'+s,{waitUntil:'load',timeout:60000});
  // walk down to load lazy images
  const H=await p.evaluate(()=>document.documentElement.scrollHeight);
  for(let y=0;y<H;y+=700){await p.evaluate(v=>scrollTo(0,v),y);await p.waitForTimeout(120);}
  await p.evaluate(()=>scrollTo(0,0));await p.waitForTimeout(1200);
  const info=await p.evaluate(()=>{
    const name=document.querySelector('h1')?.textContent.trim();
    const ptr=document.querySelector('.hero .pill')?.textContent.trim();
    const secs=[];const add=(el,label)=>{if(!el)return;const bb=el.getBoundingClientRect();if(bb.height<30)return;secs.push({label,y:Math.round(bb.top+scrollY),h:Math.round(bb.height)})};
    const pg=document.querySelector('.pg-brand');
    for(const c of pg.children){const cls=c.className.toString();const h=(c.querySelector('h2,.eyebrow,blockquote')||{}).textContent||'';
      let label=cls.includes('b_top')?'Nav and crumb':cls.includes('hero')?'Hero':cls.includes('map')?'Map':cls.includes('lx')||/Visit/.test(h)?'Locations index':/practice/i.test(h)?'The practice':c.querySelector('.film')?'Brand film':c.querySelector('.stats')?'Stats':/founder/i.test(h)||c.querySelector('.founder')?'Founder':c.querySelector('blockquote')?'Quote':/why/i.test(h)||c.querySelector('.why')?'Why Alpha':(h.trim().slice(0,30)||cls||c.tagName);
      add(c,label)}
    add(document.querySelector('.closer'),'Closer');add(document.querySelector('footer'),'Footer');
    return {name,ptr,secs,H:document.documentElement.scrollHeight};
  });
  await p.screenshot({path:`shots/${s}.png`,fullPage:true});
  meta.push({slug:s,...info});console.log(s,info.H,info.secs.map(x=>x.label).join(' | '));
}
fs.writeFileSync('meta.json',JSON.stringify(meta,null,1));await b.close()})()
