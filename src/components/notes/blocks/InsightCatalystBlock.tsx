import React from "react";
import { RiSparkling2Fill } from "react-icons/ri";
import styles from "./InsightCatalyst.module.css";
import { createReactBlockSpec } from "@blocknote/react";
import type { CatalystType } from '../../../types/insightCatalyst.types';

// Define the props that the InsightCatalyst block will accept and store.
// These align with what we expect to pass 
// and what the block's propSchema will define.
interface InsightCatalystBlockProps {
  id: string; // This is the catalyst's own unique ID from the backend
  catalystType: CatalystType;
  text: string;
}

// The "insightCatalyst" block specification.
export const InsightCatalystBlockSpec = createReactBlockSpec<
  "insightCatalyst",          // Type of the block
  InsightCatalystBlockProps,  // The props our block accepts and stores
  "none"                      // InlineContentSchema: "none" as it doesn't have inline editable content
>(
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
    // The render function. Props are now correctly typed based on InsightCatalystBlockProps.
    render: (props: { block: { props: InsightCatalystBlockProps }, editor: any }) => {
      const [isEditing, setIsEditing] = React.useState(false);
      const inputRef = React.useRef<HTMLInputElement>(null);

      const handleDoubleClick = () => {
        setIsEditing(true);
      };

      const updateText = (newText: string) => {
        props.editor.updateBlock(props.block, {
          props: { ...props.block.props, text: newText },
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

      React.useEffect(() => {
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
              defaultValue={props.block.props.text}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className={styles.input}
            />
          ) : (
            <p className={styles.text}>{props.block.props.text}</p>
          )}
        </div>
      );
    },
  }
); 