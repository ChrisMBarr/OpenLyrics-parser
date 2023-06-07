//The models for the objects returned by the OpenLyricsParser method
export namespace IOpenLyricsSong {
  export interface IRoot {
    [key: string]: IFormat | IInstrument[] | IMeta | IProperties | IVerse[];
    format: IFormat;
    instruments: IInstrument[];
    meta: IMeta;
    properties: IProperties;
    verses: IVerse[];
  }

  //============================================
  //Meta
  export interface IMeta {
    [key: string]: string | Date | null;
    chordNotation: string;
    createdIn: string;
    lang: string;
    modifiedDate: Date | null;
    modifiedIn: string;
    version: string;
  }

  //============================================
  //Properties
  export interface IProperties {
    [key: string]: string | string[] | IAuthor[] | ISongBook[] | ITheme[] | ITitle[];
    authors: IAuthor[];
    ccliNo: string;
    comments: string[];
    copyright: string;
    key: string;
    keywords: string;
    publisher: string;
    released: string;
    songBooks: ISongBook[];
    tempo: string;
    tempoType: string;
    themes: ITheme[];
    titles: ITitle[];
    transposition: string;
    variant: string;
    verseOrder: string;
    version: string;
  }

  export interface IAuthor {
    [key: string]: string;
    lang: string;
    type: string;
    value: string;
  }

  export interface ITitle {
    [key: string]: string | boolean | null;
    lang: string;
    original: boolean | null;
    value: string;
  }

  export interface ITheme {
    [key: string]: string;
    lang: string;
    value: string;
  }

  export interface ISongBook {
    [key: string]: string;
    entry: string;
    name: string;
  }

  //============================================
  //Format
  export interface IFormat {
    [key: string]: string | IFormatTag[];
    application: string;
    tags: IFormatTag[];
  }

  export interface IFormatTag {
    [key: string]: string;
    close: string;
    name: string;
    open: string;
  }

  //============================================
  //Verses & Instruments (Shared)
  export interface IVerseAndInstrumentLineContentChord {
    [key: string]: string | undefined;
    name?: string;
    root?: string;
    structure?: string;
    type: 'chord';
    upbeat?: string;
    value?: string;
  }

  //============================================
  //Lyrics
  export interface IVerse {
    [key: string]: string | IVerseLine[];
    break: string;
    lang: string;
    lines: IVerseLine[];
    name: string;
    transliteration: string;
  }

  export interface IVerseLine {
    [key: string]: string | IVerseLineContent[];
    break: string;
    content: IVerseLineContent[];
    part: string;
  }

  export type IVerseLineContent =
    | IVerseLineContentStandard
    | IVerseLineContentTag
    | IVerseAndInstrumentLineContentChord;

  export interface IVerseLineContentStandard {
    [key: string]: string;
    type: 'text' | 'comment';
    value: string;
  }

  export interface IVerseLineContentTag {
    [key: string]: string;
    name: string;
    type: 'tag';
    value: string;
  }

  //============================================
  //Instruments
  export interface IInstrument {
    [key: string]: string | IInstrumentLine[];
    lines: IInstrumentLine[];
    name: string;
  }

  export interface IInstrumentLine {
    [key: string]: string | IInstrumentLineContent[];
    content: IInstrumentLineContent[];
    part: string;
  }

  export interface IInstrumentLineContentBeat {
    [key: string]: string | IVerseAndInstrumentLineContentChord[];
    chords: IVerseAndInstrumentLineContentChord[];
    type: 'beat';
  }

  export type IInstrumentLineContent =
    | IInstrumentLineContentBeat
    | IVerseAndInstrumentLineContentChord;
}
