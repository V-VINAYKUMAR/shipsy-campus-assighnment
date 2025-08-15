import { NextResponse } from "next/server";
import { getCookieName } from "../../../../lib/jwt";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(getCookieName(), "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}
