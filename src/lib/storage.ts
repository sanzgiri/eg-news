import type { Article, Feedback } from './types';
const key=(name:string)=>`epistemic-news:${name}`;
export function readJson<T>(name:string,fallback:T):T{if(typeof window==='undefined')return fallback;try{return JSON.parse(localStorage.getItem(key(name))||'') as T}catch{return fallback}}
export function writeJson<T>(name:string,value:T){if(typeof window!=='undefined')localStorage.setItem(key(name),JSON.stringify(value))}
export const loadFeedback=()=>readJson<Feedback[]>('feedback',[]);
export const saveFeedback=(v:Feedback[])=>writeJson('feedback',v);
export const loadSaved=()=>readJson<Article[]>('saved',[]);
export const saveSaved=(v:Article[])=>writeJson('saved',v);
export const loadNotes=()=>readJson<Record<string,string>>('notes',{});
export const saveNotes=(v:Record<string,string>)=>writeJson('notes',v);
