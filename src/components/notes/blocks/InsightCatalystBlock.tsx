import React, { useState, useRef, useEffect } from "react";
import { RiSparkling2Fill } from "react-icons/ri";
import styles from "./InsightCatalyst.module.css";
import { createReactBlockSpec } from "@blocknote/react";
import type { CatalystType } from '../../../types/insightCatalyst.types';
import type { BlockNoteEditor } from "@blocknote/core";
import type { FC } from "react";

// The props for the InsightCatalyst block are inferred from the propSchema.
// No separate interface is needed.

const InsightCatalystBlock: FC<{
  block: { props: { text: string } };
  editor: BlockNoteEditor<unknown>;
}> = ({ block, editor }) => {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const updateText = (newText: string) => {
    editor.updateBlock(block, {
      props: { ...block.props, text: newText },
    });
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    setIsEditing(false);
    updateText(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      updateText(event.currentTarget.value);
      setIsEditing(false);
    }
  };

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  return (
    <div className={styles.insightCatalyst} onDoubleClick={handleDoubleClick}>
      <RiSparkling2Fill className={styles.icon} />
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          defaultValue={block.props.text}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={styles.input}
        />
      ) : (
        <p className={styles.text}>{block.props.text}</p>
      )}
    </div>
  );
};

// The "insightCatalyst" block specification.
export const InsightCatalystBlockSpec = createReactBlockSpec(
  // BlockConfig
  {
    type: "insightCatalyst",
    propSchema: {
      // Define how BlockNote should handle these props internally
      id: {
        default: "", // Default if not provided (though we always should)
      },
      catalystType: {
        default: "question" as CatalystType, // Default catalyst type
      },
      text: {
        default: "Enter catalyst text...", // Default text
      },
    },
    content: "none", // This block does not have inline content
  },
  // ReactCustomBlockImplementation
  {
    // The render function. Props are now correctly typed based on the propSchema.
    render: (props) => <InsightCatalystBlock {...props} />,
  }
); 