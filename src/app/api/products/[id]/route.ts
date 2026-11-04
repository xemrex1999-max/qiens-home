import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price: price && !isNaN(parseFloat(price)) ? parseFloat(price) : undefined,
        oldPrice: oldPrice !== undefined ? (oldPrice && !isNaN(parseFloat(oldPrice)) ? parseFloat(oldPrice) : null) : undefined,
        stock: stock && !isNaN(parseInt(stock)) ? parseInt(stock) : undefined,
        category,
        images,
        colors: colors !== undefined ? colors : undefined,
        slug,
        material,
        dimensions,
        warranty,
        isFeatured: isFeatured !== undefined ? isFeatured : undefined,
        tags: tags !== undefined ? tags : undefined,
        threeDModelUrl: threeDModelUrl !== undefined ? threeDModelUrl : undefined,
      },
    });

    return NextResponse.json(product);
  } catch (error: any) {
    console.error("Product PATCH error:", error);
    return NextResponse.json({ error: "Ürün güncellenirken bir hata oluştu." }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Ürün başarıyla silindi." });
  } catch (error: any) {
    console.error("Product DELETE error:", error);
    return NextResponse.json({ error: "Ürün silinirken bir hata oluştu." }, { status: 500 });
  }
}
