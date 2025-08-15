import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/db";
import { verifyToken, getCookieName } from "../../../../lib/jwt";

async function getUserId(req: Request) {
  const cookies = (req.headers as { get: (name: string) => string | null }).get("cookie") || "";
  const cookieName = getCookieName() + "=";
  const token =
    cookies
      .split(";")
      .map((v) => v.trim())
      .find((v) => v.startsWith(cookieName))
      ?.slice(cookieName.length) || "";
  const payload = await verifyToken(token);
  if (!payload?.sub) return null;
  return parseInt(String(payload.sub), 10);
}

export async function GET(_: Request, ctx: { params: { id: string } }) {
  const userId = await getUserId(_);
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });
  const id = parseInt(ctx.params.id, 10);
  const e = await prisma.expense.findFirst({ where: { id, userId } });
  if (!e) return new NextResponse("Not found", { status: 404 });
  const amount = Number(e.amount),
    taxRate = Number(e.taxRate);
  return NextResponse.json({
    ...e,
    amount,
    taxRate,
    grandTotal: amount + (amount * taxRate) / 100,
  });
}

export async function PUT(req: Request, ctx: { params: { id: string } }) {
  const userId = await getUserId(req);
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });
  const id = parseInt(ctx.params.id, 10);
  const body = await req.json();
  const { description, category, reimbursable, amount, taxRate } = body || {};
  const existing = await prisma.expense.findFirst({ where: { id, userId } });
  if (!existing) return new NextResponse("Not found", { status: 404 });
  const updated = await prisma.expense.update({
    where: { id },
    data: {
      description: description ?? existing.description,
      category: category ?? existing.category,
      reimbursable:
        typeof reimbursable === "boolean"
          ? reimbursable
          : existing.reimbursable,
      amount: isNaN(Number(amount)) ? existing.amount : amount,
      taxRate: isNaN(Number(taxRate)) ? existing.taxRate : taxRate,
    },
  });
  const amt = Number(updated.amount),
    tr = Number(updated.taxRate);
  return NextResponse.json({
    ...updated,
    amount: amt,
    taxRate: tr,
    grandTotal: amt + (amt * tr) / 100,
  });
}

export async function DELETE(req: Request, ctx: { params: { id: string } }) {
  const userId = await getUserId(req);
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });
  const id = parseInt(ctx.params.id, 10);
  const existing = await prisma.expense.findFirst({ where: { id, userId } });
  if (!existing) return new NextResponse("Not found", { status: 404 });
  await prisma.expense.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
