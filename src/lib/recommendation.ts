import type { Article, Domain, Feedback } from './types';
export function normalizeUrl(url:string):string { try { const u=new URL(url); u.hash=''; for(const k of [...u.searchParams.keys()]) if(['utm_source','utm_medium','utm_campaign','ref'].includes(k)) u.searchParams.delete(k); return u.toString().replace(/\/$/,'').toLowerCase(); } catch { return url.toLowerCase(); } }
export function dedupeArticles(items:Article[]):Article[] { const seen=new Set<string>(); return items.filter(item=>{const key=normalizeUrl(item.link)||`${item.source}:${item.title.toLowerCase()}`; if(seen.has(key)) return false; seen.add(key); return true;}); }
export function selectEdition(input:Article[], limit=12):Article[] {
 const items=dedupeArticles(input).filter(x=>x.quality>0).sort((a,b)=>b.quality-(a.quality));
 const out:Article[]=[]; const counts=new Map<Domain,number>();
 const add=(a:Article)=>{if(out.includes(a))return; const n=counts.get(a.domain)||0; if(n>=3)return; out.push(a);counts.set(a.domain,n+1);};
 for(const a of items) if(['oregon','india'].includes(a.region)) add(a);
 for(const a of items) if(new Set(out.map(x=>x.domain)).size<6) add(a);
 for(const a of items) add(a);
 return out.slice(0,limit);
}
export function topicProbability(domain:Domain, feedback:Feedback[]):number { const relevant=feedback.filter(f=>f.subject!=='unsure'); const yes=relevant.filter(f=>f.subject==='yes').length; const no=relevant.filter(f=>f.subject==='no').length; return (1+yes)/(2+yes+no); }
export function articleInterestPrediction(article:Article, feedback:Feedback[]):number { const p=topicProbability(article.domain,feedback); return Math.min(.95,Math.max(.05,p)); }
