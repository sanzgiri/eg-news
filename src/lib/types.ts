export type Region = 'portland' | 'oregon' | 'india' | 'global';
export type Domain = 'technology' | 'science' | 'health' | 'economy' | 'politics' | 'world' | 'culture' | 'environment' | 'security';
export interface Article { id:string; title:string; link:string; source:string; sourceUrl:string; publishedAt:string|null; domain:Domain; summary:string; tags:string[]; region:Region; quality:number; reasons:string[]; origin?:string; hn?:{score:number; comments:number; url:string}|null; }
export interface Feedback { articleId:string; subject:'yes'|'no'|'unsure'; fit?:'useful'|'not-useful'|'unsure'; learning?:'new'|'clarified'|'known'|'not-assessed'; timestamp:string; prediction:number; baselinePrediction:number; }
export interface SourceStatus { id:string; label:string; url:string; ok:boolean; itemCount:number; updatedAt:string|null; error?:string; }
export interface NewsPayload { items:Article[]; sources:SourceStatus[]; fetchedAt:string; warnings:string[]; coverage:Record<string,number>; }
