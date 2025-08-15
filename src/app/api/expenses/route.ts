import { NextResponse } from "next/server";
import { prisma } from "../../../lib/db";
import { verifyToken, getCookieName } from "../../../lib/jwt";

function parseToken(cookies: string | null) {
  const cookieName = getCookieName() + "=";
  const token =
    cookies
      ?.split(";")
      .map((v) => v.trim())
      .find((v) => v.startsWith(cookieName))
      ?.slice(cookieName.length) || "";
  return token;
}

function calcGrandTotal(amount: number, taxRate: number) {
  return amount + (amount * taxRate) / 100;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
  const pageSize = Math.min(
    10,
    Math.max(1, parseInt(url.searchParams.get("pageSize") || "5", 10))
  );
  const category = url.searchParams.get("category") || undefined;
  const reimbS = url.searchParams.get("reimbursable");
  const reimbursable =
    reimbS === null || reimbS === "" ? undefined : reimbS === "true";
  const search = url.searchParams.get("search") || "";
  const sort = url.searchParams.get("sort") || "createdAt:desc";
  const [sortField, sortOrder] = sort.split(":");
  const orderBy = ["createdAt", "amount"].includes(sortField)
    ? { [sortField]: sortOrder === "asc" ? "asc" : "desc" as const }
    : { createdAt: "desc" as const };

  // auth
  const cookies = (req.headers as { get: (name: string) => string | null }).get("cookie");
  const token = parseToken(cookies);
  const payload = await verifyToken(token);
  if (!payload?.sub) return new NextResponse("Unauthorized", { status: 401 });
  const userId = parseInt(String(payload.sub), 10);

  const where = {
    userId,
    ...(category ? { category: category as "TRAVEL" | "FOOD" | "OFFICE" | "OTHER" } : {}),
    ...(reimbursable !== undefined ? { reimbursable } : {}),
    ...(search
      ? { description: { contains: search, mode: "insensitive" as const } }
      : {}),
  };

  const [total, rows] = await Promise.all([
    prisma.expense.count({ where }),
    prisma.expense.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  const items = rows.map((r) => {
    const amount = Number(r.amount);
    const taxRate = Number(r.taxRate);
    const grandTotal = calcGrandTotal(amount, taxRate);
    return { ...r, amount, taxRate, grandTotal };
  });

  return NextResponse.json({ items, total });
}

export async function POST(req: Request) {
  const body = await req.json();
  const { description, category, reimbursable, amount, taxRate } = body || {};
  if (
    !description ||
    !category ||
    typeof reimbursable !== "boolean" ||
    isNaN(Number(amount)) ||
    isNaN(Number(taxRate))
  ) {
    return new NextResponse("Invalid payload", { status: 400 });
  }
  const cookies = (req.headers as { get: (name: string) => string | null }).get("cookie");
  const token = cookies
    ? cookies
        .split(";")
        .map((v) => v.trim())
        .find((v) => v.startsWith(getCookieName() + "="))
        ?.split("=")[1]
    : "";
  const payload = await verifyToken(token || "");
  if (!payload?.sub) return new NextResponse("Unauthorized", { status: 401 });
  const userId = parseInt(String(payload.sub), 10);

  const created = await prisma.expense.create({
    data: {
      description,
      category,
      reimbursable,
      amount,
      taxRate,
      userId,
    },
  });
  const amt = Number(created.amount);
  const tr = Number(created.taxRate);
  return NextResponse.json(
    {
      ...created,
      amount: amt,
      taxRate: tr,
      grandTotal: amt + (amt * tr) / 100,
    },
    { status: 201 }
  );
}
