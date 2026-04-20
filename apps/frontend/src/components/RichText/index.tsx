import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import type { Document } from "@contentful/rich-text-types";
import type { ReactNode } from "react";

interface RichTextProps {
  content?: Document | null;
}

const RichText = ({ content }: RichTextProps): ReactNode => {
  if (!content || content.nodeType !== "document") return null;

  return <>{documentToReactComponents(content)}</>;
};

export default RichText;
