import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Filtering
    const category = searchParams.get("category") || searchParams.get("cat");
    const minPrice = searchParams.get("minPrice") ? parseFloat(searchParams.get("minPrice")!) : undefined;
    const maxPrice = searchParams.get("maxPrice") ? parseFloat(searchParams.get("maxPrice")!) : undefined;
    
    // Sorting
    const sort = searchParams.get("sort") || "newest";
    
    // Pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;

    const where: any = {};
    if (category && category !== "all") {
      where.category = category;
    }
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {
        gte: minPrice,
        lte: maxPrice,
      };
    }

    let orderBy: any = { createdAt: "desc" };
    if (sort === "price-asc") orderBy = { price: "asc" };
    if (sort === "price-desc") orderBy = { price: "desc" };
    if (sort === "oldest") orderBy = { createdAt: "asc" };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          reviews: {
            select: { rating: true }
          }
        }
      }),
      prisma.product.count({ where }),
    ]);

    const productsWithRatings = products.map((p: any) => {
      const reviewCount = p.reviews?.length || 0;
      const averageRating = reviewCount > 0 
        ? p.reviews.reduce((acc: number, rev: any) => acc + rev.rating, 0) / reviewCount 
        : 0;
      
      // Remove reviews array from response to keep it clean
      const { reviews, ...rest } = p;
      return {
        ...rest,
        averageRating,
        reviewCount
      };
    });

    return NextResponse.json({
      products: productsWithRatings,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error: any) {
    console.error("Products GET error:", error);
    return NextResponse.json({ error: "Ürünler yüklenirken bir hata oluştu." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      name, 
      description, 
      price,
      oldPrice, 
      stock, 
      category, 
      images, 
      colors,
      slug,
      material,
      dimensions,
      warranty,
      isFeatured,
      tags,
      threeDModelUrl
    } = body;

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: price && !isNaN(parseFloat(price)) ? parseFloat(price) : 0,
        oldPrice: oldPrice && !isNaN(parseFloat(oldPrice)) ? parseFloat(oldPrice) : null,
        stock: stock && !isNaN(parseInt(stock)) ? parseInt(stock) : 0,
        category,
        images,
        colors: colors || [],
        slug,
        material,
        dimensions,
        warranty,
        isFeatured: isFeatured || false,
        tags: tags || [],
        threeDModelUrl: threeDModelUrl || null,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error("Products POST error:", error);
    return NextResponse.json({ error: "Ürün eklenirken bir hata oluştu." }, { status: 500 });
  }
}
