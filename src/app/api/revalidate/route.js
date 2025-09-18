import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { secret, slug, tag } = await request.json();

    if (secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
    }

    if (slug) {
      revalidatePath(`/${slug}`);
      return NextResponse.json({ message: `Revalidated slug: ${slug}` });
    }

    if (tag) {
      revalidateTag(tag); 
      return NextResponse.json({ message: `Revalidated tag: ${tag}` });
    }

    return NextResponse.json(
      { message: "No slug or tag provided" },
      { status: 400 }
    );
  } catch (err) {
    console.error("Revalidation error:", err);
    return NextResponse.json(
      { message: "Revalidation failed", error: err.message },
      { status: 500 }
    );
  }
}
