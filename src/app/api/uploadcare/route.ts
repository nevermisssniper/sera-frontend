// app/api/uploadcare/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createSignedHeaders, md5hash } from "@/lib/uploadcare";
import prisma from "@/lib/db";

// Simplify a function to get the "RFC2822" style date in GMT
function getRfcDate() {
  return new Date().toUTCString(); // e.g., "Fri, 30 Sep 2016 11:10:54 GMT"
}

/**
 * GET /api/uploadcare
 * Returns a list of files from Uploadcare using Signed Requests.
 * (You might filter by `stored=true` or other query params if you wish.)
 */
export async function GET(request: NextRequest) {
  try {
    // Example: We'll fetch up to 100 stored files in descending order
    const queryString = "?stored=true&limit=100&ordering=-datetime_uploaded";
    const uri = `/files/${queryString}`; // path for signing
    const verb = "GET";
    const contentMd5 = md5hash(""); // GET has an empty body
    const contentType = "application/json"; // or ""
    const dateString = getRfcDate();

    const headers = createSignedHeaders(
      verb,
      contentMd5,
      contentType,
      dateString,
      uri
    );

    // Now fetch from Uploadcare
    const res = await fetch(`https://api.uploadcare.com${uri}`, {
      method: verb,
      headers,
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: `Uploadcare error: ${text}` },
        { status: 500 }
      );
    }

    const data = await res.json();
    // data.results => array of file objects

    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch from Uploadcare" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/uploadcare?uuid=<FILE_UUID>
 * Removes a file from Uploadcare (fully deleted, not just 'un-stored').
 */
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const uuid = searchParams.get("uuid");

  if (!uuid) {
    return NextResponse.json({ error: "Missing file UUID" }, { status: 400 });
  }

  try {
    // See https://uploadcare.com/docs/api_reference/rest/accessing_files/#file-delete
    // "DELETE /files/{uuid}/" permanently deletes a file
    const uri = `/files/${uuid}/`;
    const verb = "DELETE";
    const contentMd5 = md5hash(""); // no body
    const contentType = "application/json"; // or ""
    const dateString = getRfcDate();

    const headers = createSignedHeaders(
      verb,
      contentMd5,
      contentType,
      dateString,
      uri
    );

    const res = await fetch(`https://api.uploadcare.com${uri}`, {
      method: "DELETE",
      headers,
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: `Uploadcare delete error: ${text}` },
        { status: 500 }
      );
    }

    const fileInfo = await res.json(); // Uploadcare returns the deleted file's info
    return NextResponse.json(fileInfo);
  } catch (err: any) {
    console.error("DELETE error:", err);
    return NextResponse.json(
      { error: "Could not delete file." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/uploadcare
 * Example endpoint where your Python script can POST a JSON array of new image URLs (or UUIDs).
 * We'll store them in your DB for a specific user.
 *
 * Body: { userId: string, images: string[] }
 */
export async function POST(request: NextRequest) {
  try {
    const { userId, images } = await request.json();

    if (!userId || !Array.isArray(images)) {
      return NextResponse.json(
        { error: "Invalid body; must provide userId and images array" },
        { status: 400 }
      );
    }

    // Example: store the generated images in the "generatedImages" field or
    // in the existing 'images' array, etc. Adjust as needed.
    // If you only have `images: string[]` on your model, you might do:
    await prisma.user.update({
      where: { id: userId },
      data: {
        generatedImages: {
          push: images, // append new images to the existing array
        },
      },
    });

    return NextResponse.json({ success: true, count: images.length });
  } catch (err: any) {
    console.error("POST /uploadcare error:", err.message);
    return NextResponse.json(
      { error: "Failed to store images in DB" },
      { status: 500 }
    );
  }
}
