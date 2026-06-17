import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const representativeStatusMap: Record<string, string> = {
  citizen: "us-citizen",
  lpr: "lpr",
  foreign: "h1b",
};

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug");
  if (!slug || !representativeStatusMap[slug]) {
    return NextResponse.json({ error: "Missing or invalid slug" }, { status: 400 });
  }

  const statusSlug = representativeStatusMap[slug];
  const data = await prisma.visaOrStatus.findUnique({
    where: { slug: statusSlug },
    include: {
      workAuthorization: true,
      documentRules: {
        where: { context: "initial", acceptable: true },
        include: { doc: true },
        orderBy: [{ listType: "asc" }, { docCode: "asc" }],
      },
    },
  });

  if (!data) {
    return NextResponse.json({ error: "Status not found" }, { status: 404 });
  }

  return NextResponse.json({
    name: data.name,
    category: data.category,
    workAuthorization: data.workAuthorization,
    documentRules: data.documentRules.map((rule) => ({
      docCode: rule.docCode,
      docName: rule.doc.name,
      listType: rule.listType,
      reason: rule.reason,
      acceptable: rule.acceptable,
    })),
  });
}
