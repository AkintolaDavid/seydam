export interface HeadingStyle {
  id: string;
  name: string;
  fontSize: number;
  fontFamily: string;
  fontWeight: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  color: string;
  alignment: 'left' | 'center' | 'right' | 'justify';
  bold: boolean;
  italic: boolean;
  underline: boolean;
}

export interface DocumentMargins {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface EditorState {
  content: string;
  selection: Range | null;
  headingStyles: HeadingStyle[];
  margins: DocumentMargins;
  lineSpacing: number;
  paperSize: string;
  orientation: 'portrait' | 'landscape';
  currentFormat: {
    bold: boolean;
    italic: boolean;
    underline: boolean;
    fontSize: number;
    fontFamily: string;
    alignment: 'left' | 'center' | 'right' | 'justify';
  };
}

export interface ListStyle {
  type: 'bullet' | 'numbered';
  style: string;
  level: number;
}