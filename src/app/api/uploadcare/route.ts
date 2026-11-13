// Keep the legacy URL for authenticated, owner-scoped reads and deletes.
// Workers must use the signed /api/generate-callback endpoint for writes.
export { GET, DELETE } from "../my-images/route";

export async function POST() {
  return Response.json({ error: "Use the signed generation callback" }, { status: 410 });
}
