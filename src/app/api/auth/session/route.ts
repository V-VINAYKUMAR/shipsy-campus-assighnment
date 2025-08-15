import { NextResponse } from "next/server";
import { verifyToken, getCookieName } from "../../../../lib/jwt";

export async function GET(req: Request) {
  const cookieHeader = (req.headers as { get: (name: string) => string | null }).get("cookie") || "";
  const cookieName = getCookieName() + "=";
  const token = cookieHeader
    .split(";")
    .map((v) => v.trim())
    .find((v) => v.startsWith(cookieName))
    ?.slice(cookieName.length);
  if (!token) return new NextResponse("Unauthorized", { status: 401 });
  const payload = await verifyToken(token);
  if (!payload) return new NextResponse("Unauthorized", { status: 401 });
  return NextResponse.json({
    user: { id: payload.sub, username: payload.username },
  });
}
