import { client } from "@/lib/sanity/client";
import {
  getAllNotesQuery,
  generateNoteStaticParamsQuery,
  getFeaturedNotesQuery,
  getNoteQuery,
} from "@/lib/sanity/queries";
import type {
  FeaturedNoteCardData,
  Locale,
  NoteCardData,
  NotePageData,
} from "@/types/note";

export async function getFeaturedNotes(
  locale: Locale
): Promise<FeaturedNoteCardData[]> {
  const notes = await client.fetch(getFeaturedNotesQuery, { locale });
  return (notes as Record<string, unknown>[])
    .filter((note) => Boolean(note.slug))
    .map((note) => ({
      ...(note as unknown as FeaturedNoteCardData),
      featured: true as const,
      locale,
      url: `/${locale}/notes/${note.slug as string}`,
    }));
}

export async function getNote(
  locale: Locale,
  slug: string
): Promise<NotePageData | null> {
  const note = await client.fetch(getNoteQuery, { locale, slug });
  if (!note || !note.slug) return null;
  return {
    ...(note as unknown as NotePageData),
    locale,
    url: `/${locale}/notes/${note.slug as string}`,
  };
}

export async function getAllNotes(locale: Locale): Promise<NoteCardData[]> {
  const notes = await client.fetch(getAllNotesQuery, { locale });
  return (notes as Record<string, unknown>[])
    .filter((note) => Boolean(note.slug))
    .map((note) => ({
      ...(note as unknown as NoteCardData),
      locale,
      url: `/${locale}/notes/${note.slug as string}`,
    }));
}

export async function generateNoteStaticParams(): Promise<
  { locale: Locale; slug: string }[]
> {
  return client.fetch(generateNoteStaticParamsQuery);
}
