//The models for the objects returned by the OpenLyrics parser
export namespace OpenLyrics {
  export interface ISong {
    meta: IMeta;
    properties: IProperties;
    format: IFormat;
    verses: IVerse[];
    instruments: ILyricSectionInstrument[];
  }

  //============================================
  //Meta
  export interface IMeta {
    version: string;
    createdIn: string;
    modifiedIn: string;
    modifiedDate: Date | null;
  }

  //============================================
  //Properties
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

  //============================================
  //Format
  export interface IFormat {
    application: string;
    tags: IFormatTag[];
  }

  export interface IFormatTag {
    name: string;
    open: string;
    close: string;
  }

  //============================================
  //Verses & Instruments (Shared)
  export interface IVerseAndInstrumentLineContentChord {
    type: 'chord';
    [key: string]: string;
  }

  //============================================
  //Lyrics
  export interface IVerse {
    name: string;
    lang: string;
    transliteration: string;
    lines: IVerseLine[];
  }

  export interface IVerseLine {
    content: IVerseLineContent[];
    part: string;
  }

  export type IVerseLineContent =
    | IVerseLineContentStandard
    | IVerseLineContentTag
    | IVerseAndInstrumentLineContentChord;

  export interface IVerseLineContentStandard {
    type: 'text' | 'comment';
    value: string;
  }

  export interface IVerseLineContentTag {
    type: 'tag';
    name: string;
    value: string;
  }

  //============================================
  //Instruments
  export interface ILyricSectionInstrument {
    name: string;
    lines: IInstrumentLine[];
  }

  export interface IInstrumentLine {
    content: IInstrumentLineContent[];
    part: string;
  }

  export interface IInstrumentLineContentBeat {
    type: 'beat';
    chords: IVerseAndInstrumentLineContentChord[];
  }

  export type IInstrumentLineContent =
    | IInstrumentLineContentBeat
    | IVerseAndInstrumentLineContentChord;
}
