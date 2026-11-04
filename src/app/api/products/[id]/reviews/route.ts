import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

// Ürünün yorumlarını getir
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const reviews = await prisma.review.findMany({
      where: { productId: id },
      include: {
        user: {
          select: {
            name: true,
            id: true,
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json(reviews);
  } catch (error: any) {
    console.error("Reviews GET error:", error);
    return NextResponse.json({ error: "Yorumlar getirilemedi." }, { status: 500 });
  }
}

// Yeni yorum ekle
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Yorum yapmak için giriş yapmalısınız." }, { status: 401 });
    }

    const { id } = await params;
    const { rating, comment } = await req.json();

    if (!rating || !comment) {
      return NextResponse.json({ error: "Puan ve yorum alanları zorunludur." }, { status: 400 });
    }

    const userId = (session.user as any).id;
    if (!userId) {
      console.error("YORUM HATASI: Oturumda kullanıcı ID'si bulunamadı.", session.user);
      return NextResponse.json({ error: "Kullanıcı bilgileriniz alınamadı. Lütfen tekrar giriş yapın." }, { status: 400 });
    }

    // Kullanıcının daha önce bu ürüne yorum yapıp yapmadığını kontrol et
    const existingReview = await prisma.review.findFirst({
      where: {
        productId: id,
        userId: userId,
      }
    });

    if (existingReview) {
      return NextResponse.json({ error: "Bu ürüne zaten yorum yaptınız." }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        rating: Math.round(Number(rating)),
        comment: comment.trim(),
        productId: id,
        userId: userId,
      },
      include: {
        user: {
          select: {
            name: true,
          }
        }
      }
    });

    return NextResponse.json(review);
  } catch (error: any) {
    console.error("DETAYLI YORUM HATASI:", {
      message: error.message,
      stack: error.stack,
      code: error.code
    });
    return NextResponse.json({ 
      error: "Yorum kaydedilirken bir hata oluştu.",
      details: error.message 
    }, { status: 500 });
  }
}
