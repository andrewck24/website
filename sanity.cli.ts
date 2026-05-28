import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_PROJECT_ID ?? "aw50l4wo",
    dataset: process.env.SANITY_DATASET ?? "production",
  },
});
