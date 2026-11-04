import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

// GET - Tek siparis veya kullanicinin tüm siparislerini getir
export async function GET(
  req: Request,
  context: any
) {
  try {
    // Robust param extraction for Next.js 15/16
    const params = await context.params;
    const id = params?.id;

    console.log("ORDER GET: Requested ID", id);

    if (!id) {
      return NextResponse.json({ message: "ID bulunamadı." }, { status: 400 });
    }

    // 1. Önce tekil siparis olarak dene (Tam ID)
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: { include: { product: true } } },
    });

    if (order) {
      return NextResponse.json(order);
    }

    // 2. Bulunamazsa bu ID'yi userId olarak kabul et ve bu kullanıcının siparişlerini dön
    const userOrders = await prisma.order.findMany({
      where: { userId: id },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' }
    });

    // Not: Kullanıcı bazlı arama yapıldığında boş liste gelmesi hata değil, 200 dönülmeli
    return NextResponse.json(userOrders);
  } catch (error: any) {
    console.error("Order GET error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// PATCH - Siparis durumu veya takip numarasını güncelle
export async function PATCH(
  req: Request,
  context: any
) {
  try {
    const params = await context.params;
    const id = params?.id;
    const session = await auth();

    console.log("ORDER PATCH: Requested ID", id);

    if (!id || id === 'undefined') {
      console.error("ORDER PATCH ERROR: ID is missing or undefined string");
      return NextResponse.json({ message: "Geçersiz sipariş ID." }, { status: 400 });
    }

    // Admin kontrolü
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ message: "Yetkisiz erişim." }, { status: 401 });
    }

    const body = await req.json();
    const { status, trackingNumber } = body;

    const updateData: any = {};
    if (status) updateData.status = status;
    if (trackingNumber !== undefined) updateData.trackingNumber = trackingNumber;

    const updated = await prisma.order.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ message: "Güncellendi.", order: updated });
  } catch (error: any) {
    console.error("Order PATCH error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}


