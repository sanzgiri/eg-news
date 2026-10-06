import { NextResponse } from 'next/server';
import { loadNews } from '@/lib/feeds';
export const runtime='nodejs';
export async function GET(){try{return NextResponse.json(await loadNews(),{headers:{'Cache-Control':'no-store'}})}catch(error){return NextResponse.json({error:'News sources unavailable',detail:String(error)},{status:503})}}
