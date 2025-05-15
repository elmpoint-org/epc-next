import { NextResponse } from 'next/server';

export function err(status: number, code: string, log?: unknown) {
  if (typeof log !== 'undefined') console.log(log);
  return NextResponse.json({ error: code }, { status });
}
