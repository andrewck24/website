import { buildLlmsBody, type LlmsItem } from "./build-body";
import { client } from "@/lib/sanity/client";
import { getLlmsNotesQuery, getLlmsProjectsQuery } from "@/lib/sanity/queries";
import { NextResponse } from "next/server";

export const revalidate = 3600;

export async function GET() {
  try {
    const [notes, projects] = await Promise.all([
      client.fetch<LlmsItem[]>(getLlmsNotesQuery),
      client.fetch<LlmsItem[]>(getLlmsProjectsQuery),
    ]);

    return new NextResponse(buildLlmsBody(notes, projects), {
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  } catch {
    return new NextResponse(
      "# Andrew Tseng\n\nContent temporarily unavailable.",
      {
        headers: { "content-type": "text/plain; charset=utf-8" },
      }
    );
  }
}
