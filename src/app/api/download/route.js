import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");
  const filename = searchParams.get("filename") || "map-image.jpg";

  if (!url) {
    return new NextResponse("Missing URL", { status: 400 });
  }

  const imageRes = await fetch(url);
  const buffer = await imageRes.arrayBuffer();

  return new NextResponse(Buffer.from(buffer), {
    headers: {
      "Content-Type": imageRes.headers.get("Content-Type") || "application/octet-stream",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
