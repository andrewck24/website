import { client } from "@/lib/sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";

const builder = createImageUrlBuilder(client);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function urlFor(source: any) {
  return builder.image(source);
}
