import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

// GET - Aktif ana sayfa kategorilerini getir
export async function GET() {
  try {
    const categories = await prisma.homeCategory.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
    return NextResponse.json(categories);
  } catch (error: any) {
    console.error("HomeCategories GET error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// POST - Yeni kategori kartı ekle (Sadece Admin)
export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ message: "Yetkisiz erişim." }, { status: 401 });
    }

    const body = await req.json();
    const { name, slug, image, desc, order } = body;

    if (!name || !slug || !image) {
      return NextResponse.json({ message: "Eksik alanlar var." }, { status: 400 });
    }

    const category = await prisma.homeCategory.create({
      data: {
        name,
        slug,
        image,
        desc: desc || "Koleksiyonu Keşfet",
        order: order !== undefined ? parseInt(order) : 0,
      },
    });

    return NextResponse.json({ message: "Kategori eklendi.", category }, { status: 201 });
  } catch (error: any) {
    console.error("HomeCategories POST error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
