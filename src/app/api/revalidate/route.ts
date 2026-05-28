import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

const LOCALES = ["zh-TW", "en", "ja"] as const;

const TYPE_TO_PATH: Record<string, string> = {
  note: "notes",
  project: "projects",
};

export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "Missing SANITY_WEBHOOK_SECRET" },
      { status: 500 }
    );
  }

  const body = await req.text();
  const signature = req.headers.get(SIGNATURE_HEADER_NAME) ?? "";

  const valid = await isValidSignature(body, signature, secret);
  if (!valid) {
    return new NextResponse(null, { status: 401 });
  }

  const payload = JSON.parse(body) as {
    _type: string;
    slug?: { current: string };
  };
  const { _type, slug } = payload;

  if (_type === "about") {
    for (const locale of LOCALES) {
      revalidatePath(`/${locale}/about`);
    }
  } else {
    const pathSegment = TYPE_TO_PATH[_type];
    if (pathSegment) {
      for (const locale of LOCALES) {
        // Revalidate the list page so featured/all content stays fresh.
        revalidatePath(`/${locale}/${pathSegment}`);
        if (slug?.current) {
          revalidatePath(`/${locale}/${pathSegment}/${slug.current}`);
        }
      }
    }
  }

  return NextResponse.json({ revalidated: true });
}
