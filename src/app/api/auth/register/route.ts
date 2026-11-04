import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: "Lütfen tüm alanları doldurun." }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json({ message: "Bu e-posta adresi zaten kullanımda." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "user",
      },
    });

    return NextResponse.json({ 
      message: "Kullanıcı başarıyla oluşturuldu.", 
      user: { id: newUser.id, name: newUser.name, email: newUser.email } 
    }, { status: 201 });
  } catch (error: any) {
    console.error("Register error:", error);
    return NextResponse.json({ message: "Kayıt sırasında bir hata oluştu." }, { status: 500 });
  }
}
