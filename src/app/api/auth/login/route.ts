import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/db";
import bcrypt from "bcrypt";
import { signUser, getCookieName } from "../../../../lib/jwt";

export async function POST(req: Request) {
  const { username, password } = await req.json();
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) return new NextResponse("Invalid credentials", { status: 401 });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return new NextResponse("Invalid credentials", { status: 401 });
  const token = await signUser(user);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(getCookieName(), token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
