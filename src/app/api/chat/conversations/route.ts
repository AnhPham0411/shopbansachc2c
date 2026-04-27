import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const role = (session.user as any).role;

    const whereClause = role === "ADMIN" 
      ? {} 
      : {
          OR: [
            { buyerId: userId },
            { sellerId: userId },
          ],
        };

    const conversations = await prisma.conversation.findMany({
      where: whereClause,
      include: {
        buyer: { select: { id: true, name: true } },
        seller: { select: { id: true, name: true } },
        book: { select: { id: true, title: true, imageUrl: true } },
        _count: {
          select: {
            messages: {
              where: {
                senderId: { not: userId },
                isRead: false,
              },
            },
          },
        },
      },
      orderBy: {
        lastMsgAt: "desc",
      },
    });

    return NextResponse.json(conversations);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sellerId, bookId } = await req.json();

    if (!sellerId) {
      return NextResponse.json({ error: "Thiếu sellerId" }, { status: 400 });
    }

    if (sellerId === session.user.id) {
      return NextResponse.json({ error: "Bạn không thể chat với chính mình" }, { status: 400 });
    }

    // Find or Create conversation
    // Using findFirst instead of upsert to avoid issues with nullable fields in unique constraints
    let conversation = await prisma.conversation.findFirst({
      where: {
        buyerId: session.user.id,
        sellerId: sellerId,
        bookId: bookId || null,
      },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          buyerId: session.user.id!,
          sellerId: sellerId,
          bookId: bookId || null,
        },
      });
    }

    return NextResponse.json(conversation);
  } catch (error: any) {
    console.error("Chat conversation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
