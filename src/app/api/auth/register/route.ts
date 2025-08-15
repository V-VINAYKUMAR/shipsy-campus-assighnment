import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/db";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  const body = await req.json();
  const { username, password } = body || {};
  if (!username || !password || username.length < 3 || password.length < 6) {
    return new NextResponse("Invalid username or password", { status: 400 });
  }
  const exist = await prisma.user.findUnique({ where: { username } });
  if (exist)
    return new NextResponse("Username already exists", { status: 409 });
  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.create({ data: { username, passwordHash } });
  return NextResponse.json({ ok: true });
}
