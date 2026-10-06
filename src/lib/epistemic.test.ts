import { describe, expect, it } from 'vitest';
import { epistemicGain } from './epistemic';
import type { Article } from './types';
const a=(id:string,domain:Article['domain']):Article=>({id,title:id,link:`https://e.test/${id}`,source:'x',sourceUrl:'https://e.test',publishedAt:null,domain,summary:'',tags:[],region:'global',quality:1,reasons:[]});
describe('epistemic diagnostics',()=>{
 it('returns bounded non-negative EG values without mutating feedback',()=>{const catalog=[a('a','technology'),a('b','science'),a('c','health')];const feedback:any[]=[];const before=JSON.stringify(feedback);const result=epistemicGain(catalog[0],catalog,feedback);expect(result.eg).toBeGreaterThanOrEqual(0);expect(result.eg).toBeLessThanOrEqual(2*Math.log(2)+1e-9);expect(result.eeg).toBeGreaterThanOrEqual(0);expect(result.eeg).toBeLessThanOrEqual(Math.log(2)+1e-9);expect(JSON.stringify(feedback)).toBe(before);});
});
