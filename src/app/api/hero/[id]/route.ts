import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

// PATCH - Banner güncelle (Sadece Admin)
export async function PATCH(
  req: Request,
  context: any
) {
  try {
    const params = await context.params;
    const id = params?.id;
    const session = await auth();

    // Admin kontrolü
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ message: "Yetkisiz erişim." }, { status: 401 });
    }

    if (!id) {
      return NextResponse.json({ message: "ID bulunamadı." }, { status: 400 });
    }

    const body = await req.json();
    const { badge, title, sub, image, link, linkText, order, isActive } = body;

    const banner = await prisma.banner.update({
      where: { id },
      data: {
        badge,
        title,
        sub,
        image,
        link,
        linkText,
        order: order !== undefined ? parseInt(order) : undefined,
        isActive,
      },
    });

    return NextResponse.json({ message: "Güncellendi.", banner });
  } catch (error: any) {
    console.error("Hero PATCH error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// DELETE - Banner sil (Sadece Admin)
export async function DELETE(
  req: Request,
  context: any
) {
  try {
    const params = await context.params;
    const id = params?.id;
    const session = await auth();

    // Admin kontrolü
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ message: "Yetkisiz erişim." }, { status: 401 });
    }

    if (!id) {
      return NextResponse.json({ message: "ID bulunamadı." }, { status: 400 });
    }

    await prisma.banner.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Banner silindi." });
  } catch (error: any) {
    console.error("Hero DELETE error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
