import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await prisma.book.updateMany({
      data: {
        stockQuantity: 10
      }
    });
    return NextResponse.json({ success: true, updatedCount: result.count });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
