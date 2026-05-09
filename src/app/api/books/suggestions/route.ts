import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json([]);
  }

  try {
    const books = await prisma.book.findMany({
      where: {
        OR: [
          { title: { contains: query } },
          { author: { contains: query } },
        ],
      },
      take: 5,
      select: {
        id: true,
        title: true,
        author: true,
        imageUrl: true,
      },
    });

    return NextResponse.json(books);
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
