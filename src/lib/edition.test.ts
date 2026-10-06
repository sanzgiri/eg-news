import { describe, expect, it } from 'vitest';
import { categoryLimit } from './recommendation';
import type { Article } from './types';
import { selectEdition } from './recommendation';
const a=(id:string,domain:Article['domain']):Article=>({id,title:id,link:`https://e.test/${id}`,source:'x',sourceUrl:'https://e.test',publishedAt:new Date().toISOString(),domain,summary:'',tags:[],region:'global',quality:1,reasons:[]});
describe('finite category editions',()=>{
 it('tapers category limits as explicit learning accumulates',()=>{expect(categoryLimit(0)).toBe(10);expect(categoryLimit(20)).toBe(7);expect(categoryLimit(40)).toBe(5);expect(categoryLimit(60)).toBe(3);});
 it('returns up to the limit per category without a global load-more pool',()=>{const input=Array.from({length:15},(_,i)=>a(String(i),i<10?'technology':'science'));expect(selectEdition(input,3)).toHaveLength(6);expect(selectEdition(input,3).filter(x=>x.domain==='technology')).toHaveLength(3);});
});
