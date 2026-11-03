import { NextResponse } from "next/server";

// Coloca o segredo na requisição que o rewrite /backend repassa para a API.
// A API só confia no IP do cliente (X-Forwarded-For) quando o segredo confere.
export function middleware(request) {
  const segredo = process.env.PROXY_SEGREDO;

  if (!segredo) return NextResponse.next(); // local, sem segredo configurado

  const headers = new Headers(request.headers);
  headers.set("x-proxy-segredo", segredo);

  return NextResponse.next({ request: { headers } });
}

export const config = { matcher: "/backend/:path*" };
