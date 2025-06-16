import { BlockNoteSchema, defaultBlockSpecs, type Block, type PartialBlock, type BlockSchemaFromSpecs } from "@blocknote/core";
import { InsightCatalystBlockSpec } from "../../components/notes/blocks/InsightCatalystBlock";

// 1. Define the custom block schema object.
// This is used to type the editor.
export const customBlockSpecs = {
  ...defaultBlockSpecs,
  insightCatalyst: InsightCatalystBlockSpec,
};

// 2. Create the BlockNoteSchema instance using the custom block schema.
// This is used to configure the editor.
export const schema = BlockNoteSchema.create({
  blockSpecs: customBlockSpecs,
});

// 3. Export types based on the specs, not the schema instance.
// This is because the editor hooks are generic over the schema specs, not the instance.
export type CustomBlockSchema = BlockSchemaFromSpecs<typeof customBlockSpecs>;
export type CustomBlock = PartialBlock<CustomBlockSchema>;
export type FullCustomBlock = Block<CustomBlockSchema>;
