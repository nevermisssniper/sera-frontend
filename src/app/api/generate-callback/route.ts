import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { verifyGenerationSignature } from "@/lib/generation-auth";
import { z } from "zod";

const callbackSchema = z.object({
  userId: z.string().min(1),
  jobId: z.string().uuid(),
  generatedUuids: z.array(z.string().uuid()).min(1).max(100),
});

export async function POST(request: Request) {
  const body = await request.text();
  if (!verifyGenerationSignature(body, request.headers.get("x-generation-timestamp"), request.headers.get("x-generation-signature"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let payload;
  try { payload = callbackSchema.safeParse(JSON.parse(body)); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  if (!payload.success) return NextResponse.json({ error: "Invalid callback" }, { status: 400 });
  const { userId, jobId, generatedUuids } = payload.data;
  try {
    // Atomic compare-and-update prevents stale jobs and duplicate deliveries
    // from replacing images a second time (including after user deletions).
    const result = await prisma.user.updateMany({
      where: { id: userId, pendingGenerationId: jobId },
      data: { generatedImages: { set: Array.from(new Set(generatedUuids)) }, pendingGenerationId: null, completedGenerationId: jobId },
    });
    if (!result.count) {
      const completed = await prisma.user.findFirst({
        where: { id: userId, completedGenerationId: jobId }, select: { id: true },
      });
      if (!completed) return NextResponse.json({ error: "Unknown or stale job" }, { status: 409 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Generation callback failed", error);
    return NextResponse.json({ error: "Could not save generated images" }, { status: 500 });
  }
}
