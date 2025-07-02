// app/api/generate-callback/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/db";

/**
 * Receives a POST from Python once images are generated.
 * Body shape: { userId: string, generatedUuids: string[] }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, generatedUuids } = body;

    if (!userId || !generatedUuids || !Array.isArray(generatedUuids)) {
      return NextResponse.json(
        { error: "Missing userId or generatedUuids" },
        { status: 400 }
      );
    }

    // Update the user’s generatedImages in Prisma
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        generatedImages: {
          // If you want to append the new images:
          // push: generatedUuids,
          // Or if you want to replace the entire array:
          set: generatedUuids,
        },
      },
    });

    return NextResponse.json({ success: true, updatedUser: user });
  } catch (err: any) {
    console.error("Error in generate-callback route:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
