//The models for the objects returned by the OpenLyrics parser
export namespace OpenLyrics {
  export interface ISong {
    meta: IMeta;
    properties: IProperties;
    format: IFormat;
    verses: ILyricSectionVerse[];
    instruments: ILyricSectionInstrument[];
  }

  export interface IMeta {
    version: string;
    createdIn: string;
    modifiedIn: string;
    modifiedDate: Date | null;
  }

  export interface IProperties {
    authors: IAuthor[];
    titles: ITitle[];
    songBooks: ISongBook[];
    comments: string[];
    copyright: string;
    ccliNo: string;
    released: string;
    transposition: string;
    tempo: string;
    tempoType: string;
    themes: ITheme[];
    key: string;
    variant: string;
    publisher: string;
    version: string;
    keywords: string;
    verseOrder: string;
  }

  export interface IAuthor {
    value: string;
    type: string;
    lang: string;
  }

  export interface ITitle {
    value: string;
    lang: string;
    original: boolean | null;
  }

  export interface ITheme {
    value: string;
    lang: string;
  }

  export interface ISongBook {
    name: string;
    entry: string;
  }

  export interface IFormat {
    application: string;
    tags: IFormatTag[];
  }

  export interface IFormatTag {
    name: string;
    open: string;
    close: string;
  }

  export interface ILyricSectionLineContentStandard {
    type: 'text' | 'comment';
    value: string;
  }
  export interface ILyricSectionLineContentTag {
    type: 'tag';
    name: string;
    value: string;
  }
  export interface ILyricSectionLineContentChord {
    type: 'chord';
    [key: string]: string;
  }

  export interface ILyricSectionLineContentBeat {
    type: 'beat';
    chords: ILyricSectionLineContentChord[]
  }

  export type ILyricSectionLineContent =
    | ILyricSectionLineContentStandard
    | ILyricSectionLineContentTag
    | ILyricSectionLineContentChord;

  export interface ILyricSectionLine {
    content: ILyricSectionLineContent[];
    part: string;
  }

  export interface ILyricSectionVerse {
    name: string;
    lang: string;
    transliteration: string;
    lines: ILyricSectionLine[];
  }

  export interface ILyricSectionInstrument {
    name: string;
    lines: (ILyricSectionLineContentBeat | ILyricSectionLineContentChord)[];
  }
}
