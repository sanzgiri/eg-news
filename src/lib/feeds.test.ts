import { describe, expect, it } from 'vitest';
import { classify, isFresh } from './feeds';
import type { Article } from './types';
const article=(publishedAt:string,domain:Article['domain']='politics',origin='AllSides / Open RSS'):Article=>({id:'x',title:'x',link:'https://x.test',source:'x',sourceUrl:'https://x.test',publishedAt,domain,summary:'',tags:[],region:'global',quality:1,reasons:[],origin});
describe('classification and freshness',()=>{
 it('keeps topic and geography as separate axes',()=>{
  expect(classify('Indian technology policy','New Delhi announces a software plan','Test')).toMatchObject({domain:'technology',region:'india'});
  expect(classify('Portland climate plan','Oregon environment update','Test')).toMatchObject({domain:'environment',region:'oregon'});
 });
 it('accepts current-news items under 24 hours and rejects stale ones',()=>{
  const now=Date.now();
  expect(isFresh(article(new Date(now-23*3600_000).toISOString()),new Date(now))).toBe(true);
  expect(isFresh(article(new Date(now-25*3600_000).toISOString()),new Date(now))).toBe(false);
  expect(isFresh(article(new Date(now-6*24*3600_000).toISOString(),'technology','CosmoRSS'),new Date(now))).toBe(true);
  expect(isFresh(article(new Date(now-8*24*3600_000).toISOString(),'technology','CosmoRSS'),new Date(now))).toBe(false);
 });
});
