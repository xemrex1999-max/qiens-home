import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { sendOrderEmail } from "@/lib/mail";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const body = await req.json();
    const { 
      items, 
      shippingAddress, 
      address, 
      totalAmount, 
      totalPrice, 
      paymentId 
    } = body;

    const finalAddress = shippingAddress || address;
    const finalAmount = totalAmount || totalPrice;

    console.log("ORDER CREATE: Session and Body details", { 
      hasSession: !!session,
      user: session?.user,
      orderId: paymentId,
      finalAmount,
      finalAddress: !!finalAddress
    });

    if (!items || items.length === 0 || !finalAddress || !finalAmount) {
      return NextResponse.json({ message: "Geçersiz sipariş verisi." }, { status: 400 });
    }

    // Determine valid userId (Check by ID or Email as fallback)
    let finalUserId: string | null = null;
    const sessionUserId = session?.user?.id;
    const sessionUserEmail = session?.user?.email;

    if (sessionUserId || sessionUserEmail) {
      const dbUser = await prisma.user.findFirst({
        where: {
          OR: [
            sessionUserId ? { id: sessionUserId } : undefined,
            sessionUserEmail ? { email: sessionUserEmail } : undefined
          ].filter(Boolean) as any
        },
        select: { id: true }
      });
      if (dbUser) {
        finalUserId = dbUser.id;
        console.log("ORDER CREATE: Linked to userId", finalUserId);
      }
    } else {
      console.log("ORDER CREATE: No session found, creating guest order.");
    }


    // 0. Çift Sipariş Kontrolü (Idempotency) - Scenario 3
    if (paymentId) {
      const existingOrder = await prisma.order.findFirst({
        where: { paymentId: paymentId }
      });
      if (existingOrder) {
        return NextResponse.json({ 
          message: "Bu sipariş zaten işlendi.", 
          orderId: existingOrder.id 
        }, { status: 200 }); // Zaten var, hata vermeden var olanı dönüyoruz
      }
    }

    // Start a transaction
    const finalOrder = await prisma.$transaction(async (tx: any) => {
      // 1. Create the Order
      const newOrder = await tx.order.create({
        data: {
          userId: finalUserId,
          totalPrice: parseFloat(finalAmount as string),
          status: "pending", // Başlangıçta bekliyor (Scenario 1)
          address: finalAddress as any,
          paymentId: paymentId || null,
          items: {
            create: items.map((item: any) => ({
              productId: item.id,
              quantity: item.quantity || item.qty || 1,
              price: parseFloat(item.price),
              selectedColor: item.selectedColor || null,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      // 2. Stokları Düşür (Scenario 12)
      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.id }
        });

        if (!product || product.stock < (item.quantity || item.qty || 1)) {
          throw new Error(`${product?.name || 'Ürün'} için yeterli stok bulunamadı.`);
        }

        await tx.product.update({
          where: { id: item.id },
          data: {
            stock: {
              decrement: item.quantity || item.qty || 1
            }
          }
        });
      }

      return newOrder;
    });

    // 3. E-posta Gönder (Arka planda)
    // Hata gelse bile sipariş süreci etkilenmesin diye catch ekliyoruz
    // NOT: RESEND_API_KEY eksikse mail.ts içinde console.warn basılacak
    Promise.resolve().then(async () => {
      try {
        await sendOrderEmail(finalOrder);
        await sendOrderEmail(finalOrder, true);
      } catch (e) {
        console.error("Critical Email Error (Background):", e);
      }
    });

    return NextResponse.json({ 
      message: "Sipariş oluşturuldu. Ödeme bekleniyor.", 
      orderId: finalOrder.id,
    }, { status: 201 });

  } catch (error: any) {
    console.error("Order Create error:", error);
    return NextResponse.json({ message: error.message || "Sipariş oluşturulurken bir hata oluştu." }, { status: 500 });
  }
}
