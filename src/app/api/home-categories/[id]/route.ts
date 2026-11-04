import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

// PATCH - Kategori güncelle (Sadece Admin)
export async function PATCH(
  req: Request,
  context: any
) {
  try {
    const params = await context.params;
    const id = params?.id;
    const session = await auth();

    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ message: "Yetkisiz erişim." }, { status: 401 });
    }

    if (!id) {
      return NextResponse.json({ message: "ID bulunamadı." }, { status: 400 });
    }

    const body = await req.json();
    const { name, slug, image, desc, order, isActive } = body;

    const category = await prisma.homeCategory.update({
      where: { id },
      data: {
        name,
        slug,
        image,
        desc,
        order: order !== undefined ? parseInt(order) : undefined,
        isActive,
      },
    });

    return NextResponse.json({ message: "Güncellendi.", category });
  } catch (error: any) {
    console.error("HomeCategories PATCH error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// DELETE - Kategori sil (Sadece Admin)
export async function DELETE(
  req: Request,
  context: any
) {
  try {
    const params = await context.params;
    const id = params?.id;
    const session = await auth();

    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ message: "Yetkisiz erişim." }, { status: 401 });
    }

    if (!id) {
      return NextResponse.json({ message: "ID bulunamadı." }, { status: 400 });
    }

    await prisma.homeCategory.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Kategori silindi." });
  } catch (error: any) {
    console.error("HomeCategories DELETE error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
