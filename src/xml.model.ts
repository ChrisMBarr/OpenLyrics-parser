//A representation of an OpenLyrics document as a JSON object parsed by fast-xml-parser
//OpenLyrics Format Docs: https://docs.openlyrics.org/en/latest/dataformat.html
//The below data model relies on the following options being set:
//  { ignoreAttributes: false, attributeNamePrefix: '', parseAttributeValue: true, ignoreDeclaration: true, }
//  All options here: https://github.com/NaturalIntelligence/fast-xml-parser/blob/master/docs/v4/2.XMLparseOptions.md

export namespace OpenLyricsXml {
  export interface IDocRoot {
    '?xml-stylesheet': {
      href: string;
      type: string;
    };
    song: ISong;
  }

  export interface ISong {
    properties: IProperties;
    lyrics: ILyrics;
    format?: IFormat;
    xmlns: string;
    'xml:lang'?: string;
    version: string;
    createdIn?: string;
    chordNotation?: string;
    modifiedIn?: string;
    modifiedDate?: string;
  }

  export interface IProperties {
    copyright?: string | number;
    ccliNo?: string | number;
    released?: string | number;
    transposition?: string | number;
    key?: string;
    keywords?: string;
    variant?: string;
    publisher?: string;
    version?: string | number;
    verseOrder?: string;

    titles?: ITitles;
    authors?: IAuthors;
    comments?: IComments;
    releaseDate?: string | number;
    songbooks?: ISongBooks;
    tempo?: ITempo;
    themes?: IThemes;
    timeSignature?: string;
  }

  export interface ITitles {
    title: (string | { '#text': string; lang?: string; original?: boolean })[];
  }

  export interface IAuthors {
    author: (string | { '#text': string; lang?: string; type?: string })[];
  }

  export interface IComments {
    comment: (string | { '#text': string })[];
  }

  export interface ISongBooks {
    songbook: { name: string; entry?: string | number }[];
  }

  export interface IThemes {
    theme: (string | { '#text': string; lang?: string })[];
  }

  export interface ITempo {
    '#text': string | number;
    type: string;
  }

  export interface IFormat {
    tags: {
      tag: { open: string; close?: string; name: string }[];
      application: string;
    };
  }

  export interface ILyrics {
    instrument?: IInstrument[];
    verse?: IVerse[];
  }

  export type IVerseOrInstrumentLineUnparsed =
    | string
    | { '#text': string; part?: string; repeat?: string; break?: string };

  export interface IVerse {
    break?: string;
    lines: IVerseOrInstrumentLineUnparsed[];
    name: string;
    lang?: string;
    translit?: string;
  }

  export interface IInstrumentLine {
    part?: string;
    repeat?: string;
  }

  export interface IInstrument {
    lines: IVerseOrInstrumentLineUnparsed[];
    name: string;
  }

  export interface ILineChord {
    [key: string]: string | undefined;
    name?: string;
    root?: string;
    structure?: string;
    upbeat?: string;
  }
}
