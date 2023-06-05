//The models for the objects returned by the OpenLyrics parser
export namespace OpenLyrics {
  export interface ISong {
    meta: IMeta;
    properties: IProperties;
    format: IFormat;
    lyrics: ILyricSection[];
  }

  export interface IMeta {
    version: string;
    createdIn: string;
    modifiedIn: string;
    modifiedDate: Date;
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

  export interface ILyricSectionLine {
    text: string;
    part: string;
  }

  export interface ILyricSection {
    name: string;
    lang: string;
    transliteration: string;
    lines: ILyricSectionLine[];
  }
}
