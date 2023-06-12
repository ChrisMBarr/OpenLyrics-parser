//A representation of an OpenLyrics document as a JSON object parsed by fast-xml-parser
//OpenLyrics Format Docs: https://docs.openlyrics.org/en/latest/dataformat.html
//The below data model relies on the following options being set:
//  { ignoreAttributes: false, attributeNamePrefix: '', parseAttributeValue: true, ignoreDeclaration: true, }
//  All options here: https://github.com/NaturalIntelligence/fast-xml-parser/blob/master/docs/v4/2.XMLparseOptions.md

export interface IXmlDocRoot {
  '?xml-stylesheet': {
    href: string;
    type: string;
  };
  song: IXmlSong;
}

export interface IXmlSong {
  properties: IXmlProperties;
  lyrics: IXmlLyrics;
  format?: IXmlFormat;
  xmlns: string;
  'xml:lang'?: string;
  version: string;
  createdIn?: string;
  chordNotation?: string;
  modifiedIn?: string;
  modifiedDate?: string;
}

export interface IXmlProperties {
  authors?: IXmlAuthors;
  ccliNo?: string | number;
  comments?: IXmlComments;
  copyright?: string | number;
  key?: string;
  keywords?: string;
  publisher?: string;
  released?: string | number;
  releaseDate?: string | number;
  songbooks?: IXmlSongBooks;
  tempo?: IXmlTempo;
  themes?: IXmlThemes;
  timeSignature?: string;
  titles?: IXmlTitles;
  transposition?: string | number;
  variant?: string;
  verseOrder?: string;
  version?: string | number;
}

export interface IXmlTitles {
  title: (string | { '#text': string; lang?: string; translit?: string; original?: boolean })[];
}

export interface IXmlAuthors {
  author: (string | { '#text': string; lang?: string; type?: string })[];
}

export interface IXmlComments {
  comment: (string | { '#text': string })[];
}

export interface IXmlSongBooks {
  songbook: { name: string; entry?: string | number }[];
}

export interface IXmlThemes {
  theme: (string | { '#text': string; lang?: string })[];
}

export interface IXmlTempo {
  '#text': string | number;
  type: string;
}

export interface IXmlFormat {
  tags: {
    tag: { open: string; close?: string; name: string }[];
    application: string;
  };
}

export interface IXmlLyrics {
  instrument?: IXmlInstrument[];
  verse?: IXmlVerse[];
}

export type IXmlVerseOrInstrumentLineUnparsed =
  | string
  | { '#text': string; part?: string; repeat?: string | number; break?: string };

export interface IXmlVerse {
  break?: string;
  lines: IXmlVerseOrInstrumentLineUnparsed[];
  name: string;
  lang?: string;
  translit?: string;
}

export interface IXmlInstrument {
  lines: IXmlVerseOrInstrumentLineUnparsed[];
  name: string;
}

export interface IXmlLineChord {
  [key: string]: string | undefined;
  name?: string;
  root?: string;
  structure?: string;
  upbeat?: string;
  bass?: string;
}
