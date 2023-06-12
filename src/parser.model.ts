//The models for the objects returned by the OpenLyricsParser method
export interface IParserRoot {
  [key: string]:
    | IParserFormat
    | IParserInstrument[]
    | IParserMeta
    | IParserProperties
    | IParserVerse[];
  format: IParserFormat;
  instruments: IParserInstrument[];
  meta: IParserMeta;
  properties: IParserProperties;
  verses: IParserVerse[];
}

//============================================
//Meta
export interface IParserMeta {
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
export interface IParserProperties {
  [key: string]:
    | number
    | string
    | string[]
    | IParserAuthor[]
    | IParserSongBook[]
    | IParserTheme[]
    | IParserTitle[];
  authors: IParserAuthor[];
  ccliNo: string;
  comments: string[];
  copyright: string;
  key: string;
  keywords: string;
  publisher: string;
  released: string;
  songBooks: IParserSongBook[];
  tempo: string | number;
  tempoType: string;
  themes: IParserTheme[];
  timeSignature: string;
  titles: IParserTitle[];
  transposition: string;
  variant: string;
  verseOrder: string;
  version: string;
}

export interface IParserAuthor {
  [key: string]: string;
  lang: string;
  type: string;
  value: string;
}

export interface IParserTitle {
  [key: string]: string | boolean | null;
  lang: string;
  original: boolean | null;
  transliteration: string;
  value: string;
}

export interface IParserTheme {
  [key: string]: string;
  lang: string;
  value: string;
}

export interface IParserSongBook {
  [key: string]: string;
  entry: string;
  name: string;
}

//============================================
//Format
export interface IParserFormat {
  [key: string]: string | IParserFormatTag[];
  application: string;
  tags: IParserFormatTag[];
}

export interface IParserFormatTag {
  [key: string]: string;
  close: string;
  name: string;
  open: string;
}

//============================================
//Verses & Instruments (Shared)
export interface IParserVerseAndInstrumentLineContentChord {
  [key: string]: string | undefined;
  bass?: string;
  root?: string;
  structure?: string;
  type: 'chord';
  upbeat?: string;
  value?: string;
}

//============================================
//Verses
export interface IParserVerse {
  [key: string]: string | IParserVerseLine[];
  break: string;
  lang: string;
  lines: IParserVerseLine[];
  name: string;
  transliteration: string;
}

export interface IParserVerseLine {
  [key: string]: string | number | IParserVerseLineContent[];
  break: string;
  content: IParserVerseLineContent[];
  part: string;
  repeat: string | number;
}

export type IParserVerseLineContent =
  | IParserVerseLineContentStandard
  | IParserVerseLineContentTag
  | IParserVerseAndInstrumentLineContentChord;

export interface IParserVerseLineContentStandard {
  [key: string]: string;
  type: 'text' | 'comment';
  value: string;
}

export interface IParserVerseLineContentTag {
  [key: string]: string;
  name: string;
  type: 'tag';
  value: string;
}

//============================================
//Instruments
export interface IParserInstrument {
  [key: string]: string | IParserInstrumentLine[];
  lines: IParserInstrumentLine[];
  name: string;
}

export interface IParserInstrumentLine {
  [key: string]: string | number | IParserInstrumentLineContent[];
  content: IParserInstrumentLineContent[];
  part: string;
  repeat: string | number;
}

export interface IParserInstrumentLineContentBeat {
  [key: string]: string | IParserVerseAndInstrumentLineContentChord[];
  chords: IParserVerseAndInstrumentLineContentChord[];
  type: 'beat';
}

export type IParserInstrumentLineContent =
  | IParserInstrumentLineContentBeat
  | IParserVerseAndInstrumentLineContentChord;
