import { NextResponse } from 'next/server';
export function GET(){return NextResponse.json({ok:true,service:'wider',time:new Date().toISOString()})}
