import { BlockNoteSchema, defaultBlockSpecs } from "@blocknote/core";
import type { PartialBlock } from "@blocknote/core";
import { InsightCatalystBlockSpec } from "../../components/notes/blocks/InsightCatalystBlock";

export const schema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    insightCatalyst: InsightCatalystBlockSpec,
  },
});

export type CustomBlock = PartialBlock<typeof schema.blockSchema>;
