// app/api/my-images/route.ts

import { NextRequest, NextResponse } from "next/server";
import { checkAuth } from "@/lib/server-utils";
import prisma from "@/lib/db";
import { createSignedHeaders, md5hash } from "@/lib/uploadcare";

function getRfcDate() {
  return new Date().toUTCString();
}

export async function GET(request: NextRequest) {
  // 1) Check if user is authenticated
  const session = await checkAuth();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  // 2) Fetch that user’s DB record
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      generatedImages: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // 3) Return them to the client
  return NextResponse.json({
    generatedImages: user.generatedImages,
  });
}

//DELETING A GENERATED IMAGE:
export async function DELETE(request: NextRequest) {
  try {
    const session = await checkAuth();
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const uuid = searchParams.get("uuid");
    if (!uuid) {
      return NextResponse.json(
        { error: "Missing image uuid" },
        { status: 400 }
      );
    }

    // 1) Check if user actually has this uuid in instanceImages or generatedImages
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        generatedImages: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Does the user have that UUID in instanceImages or generatedImages?
    const inGenerated = user.generatedImages.includes(uuid);

    if (!inGenerated) {
      return NextResponse.json(
        { error: "Image does not belong to user." },
        { status: 403 }
      );
    }

    // 2) Call Uploadcare to delete the file
    const uri = `/files/${uuid}/storage/`;
    const verb = "DELETE";
    const contentMd5 = md5hash("");
    const contentType = "application/json";
    const dateString = getRfcDate();

    const headers = createSignedHeaders(
      verb,
      contentMd5,
      contentType,
      dateString,
      uri
    );

    const ucRes = await fetch(`https://api.uploadcare.com${uri}`, {
      method: "DELETE",
      headers,
    });

    if (!ucRes.ok) {
      // Log the text from Uploadcare so you can see the exact cause
      const errText = await ucRes.text();
      console.error("Uploadcare DELETE error response:", errText);
      return NextResponse.json(
        { error: `UC delete failed: ${errText}` },
        { status: 500 }
      );
    }

    // If it got here, UC says it deleted the file successfully.
    // Then remove from your DB as you already do.

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
