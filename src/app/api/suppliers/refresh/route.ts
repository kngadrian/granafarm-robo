export async function POST() {
  const kvConfigured =
    !!process.env.KV_REST_API_URL && !!process.env.KV_REST_API_TOKEN;

  if (kvConfigured) {
    try {
      const { kv } = await import("@vercel/kv");
      await kv.del("granafarm:suppliers:caen0113");
    } catch (e: unknown) {
      console.warn("KV delete failed:", e);
    }
  }

  return Response.json({
    ok: true,
    message: "Cache cleared. Next visit will regenerate suppliers.",
  });
}
