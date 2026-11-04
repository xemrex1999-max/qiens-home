import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

// GET - Tüm aktif bannerları getir (Sıralı)
export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
    return NextResponse.json(banners);
  } catch (error: any) {
    console.error("Hero GET error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// POST - Yeni banner ekle (Sadece Admin)
export async function POST(req: Request) {
  try {
    const session = await auth();

    // Admin kontrolü
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ message: "Yetkisiz erişim." }, { status: 401 });
    }

    const body = await req.json();
    const { badge, title, sub, image, link, linkText, order } = body;

    if (!badge || !title || !image) {
      return NextResponse.json({ message: "Eksik alanlar var." }, { status: 400 });
    }

    const banner = await prisma.banner.create({
      data: {
        badge,
        title,
        sub,
        image,
        link: link || "/products",
        linkText: linkText || "Koleksiyonu Keşfet",
        order: order !== undefined ? parseInt(order) : 0,
      },
    });

    return NextResponse.json({ message: "Banner oluşturuldu.", banner }, { status: 201 });
  } catch (error: any) {
    console.error("Hero POST error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
