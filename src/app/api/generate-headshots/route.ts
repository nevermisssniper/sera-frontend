import { NextResponse } from "next/server";
import { generateHeadshots } from "@/actions/actions";

export async function POST() {
  try {
    const result = await generateHeadshots();
    // generateHeadshots is the server action in your actions.ts
    return NextResponse.json({ message: result.message }, { status: 200 });
  } catch (err: any) {
    console.error("Error calling generateHeadshots:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
