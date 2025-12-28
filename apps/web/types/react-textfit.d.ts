declare module "react-textfit" {
  import { Component, CSSProperties, ReactNode } from "react";

  interface TextfitProps {
    children?: ReactNode;
    mode?: "single" | "multi";
    min?: number;
    max?: number;
    throttle?: number;
    onReady?: (fontSize: number) => void;
    style?: CSSProperties;
    className?: string;
  }

  export class Textfit extends Component<TextfitProps> {}
}
