import { codeInput } from "@sanity/code-input";
import { documentInternationalization } from "@sanity/document-internationalization";
import { defineConfig } from "sanity";
import { StructureBuilder, structureTool } from "sanity/structure";
import { schemaTypes } from "./schemas";

const LOCALES = ["zh-TW", "en", "ja"] as const;

function buildStructure(S: StructureBuilder) {
  return S.list()
    .title("Content")
    .items([
      S.documentTypeListItem("note").title("Notes"),
      S.documentTypeListItem("project").title("Projects"),
      S.documentTypeListItem("tag").title("Tags"),
      S.divider(),
      S.listItem()
        .title("About")
        .child(
          S.list()
            .title("About — by locale")
            .items(
              LOCALES.map((lang) =>
                S.listItem()
                  .title(`About (${lang})`)
                  .id(`about-${lang}`)
                  .child(
                    S.document()
                      .schemaType("about")
                      .documentId(`about-${lang}`)
                      .title(`About (${lang})`)
                  )
              )
            )
        ),
    ]);
}

export default defineConfig({
  projectId: process.env.SANITY_PROJECT_ID ?? "aw50l4wo",
  dataset: process.env.SANITY_DATASET ?? "production",
  basePath: "/studio",
  title: "andrewck24",
  plugins: [
    structureTool({ structure: buildStructure }),
    codeInput(),
    documentInternationalization({
      supportedLanguages: [
        { id: "zh-TW", title: "中文" },
        { id: "en", title: "English" },
        { id: "ja", title: "日本語" },
      ],
      schemaTypes: ["note", "project"],
    }),
  ],
  schema: {
    types: schemaTypes,
  },
});
