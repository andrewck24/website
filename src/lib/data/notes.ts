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
  return notes.map((note: Record<string, unknown>) => ({
    ...note,
    featured: true as const,
    locale,
    url: `/${locale}/notes/${note.slug}`,
  }));
}

export async function getNote(
  locale: Locale,
  slug: string
): Promise<NotePageData | null> {
  const note = await client.fetch(getNoteQuery, { locale, slug });
  if (!note) return null;
  return {
    ...note,
    locale,
    url: `/${locale}/notes/${note.slug}`,
  };
}

export async function getAllNotes(locale: Locale): Promise<NoteCardData[]> {
  const notes = await client.fetch(getAllNotesQuery, { locale });
  return notes.map((note: Record<string, unknown>) => ({
    ...note,
    locale,
    url: `/${locale}/notes/${note.slug}`,
  }));
}

export async function generateNoteStaticParams(): Promise<
  { locale: Locale; slug: string }[]
> {
  return client.fetch(generateNoteStaticParamsQuery);
}
