import { NextResponse } from 'next/server';
export function GET(){return NextResponse.json({ok:true,service:'epistemic-news',time:new Date().toISOString()})}
