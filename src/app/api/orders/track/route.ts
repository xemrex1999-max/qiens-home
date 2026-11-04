import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Order } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id || id.length < 4) {
      return NextResponse.json({ message: "Geçerli bir sipariş kodu giriniz." }, { status: 400 });
    }

    let order = null;

    // 1. Durum: Tam ID (24 karakter hex)
    if (id.length === 24 && /^[0-9a-fA-F]+$/.test(id)) {
      order = await prisma.order.findUnique({
        where: { id: id },
        include: { items: { include: { product: true } } }
      });
    } 
    
    // 2. Durum: Kısa Kod (Örn: son 8 hane)
    if (!order) {
      // Prismada ObjectId üzerinde 'endsWith' çalışmadığı için manuel eşleştirme yapıyoruz.
      // Performans için son 100 siparişi kontrol ediyoruz.
      const recentOrders = await prisma.order.findMany({
        take: 200,
        orderBy: { createdAt: 'desc' },
        include: { items: { include: { product: true } } }
      });

      order = recentOrders.find((o: Order) => 
        o.id.toLowerCase().endsWith(id.toLowerCase()) || 
        o.id.toUpperCase().endsWith(id.toUpperCase())
      );
    }

    if (!order) {
      return NextResponse.json({ message: "Sipariş bulunamadı. Lütfen kodu kontrol edin." }, { status: 404 });
    }

    return NextResponse.json({ order });

  } catch (error: any) {
    console.error("Order track error:", error);
    return NextResponse.json({ message: "Sipariş sorgulama sırasında hata oluştu." }, { status: 500 });
  }
}
