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
    version: number;
    createdIn: string;
    modifiedIn: string;
    modifiedDate: string;
  }

  export interface IProperties {
    copyright?: number;
    ccliNo?: number;
    released?: number;
    transposition?: number;
    key?: string;
    keywords?: string;
    variant?: string;
    publisher?: string;
    version?: number;
    verseOrder?: string;

    titles?: ITitles;
    authors?: IAuthors;
    comments?: IComments;
    songbooks?: ISongBooks;
    tempo?: ITempo;
    themes?: IThemes;
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
    '#text': number;
    type: string;
  }

  export interface IFormat {
    tags: {
      tag: { open: string; close?: string; name: string }[];
      application: string;
    };
  }

  export interface ILyrics {
    verse?: IVerse[];
  }

  export interface IVerse {
    lines: (string | { '#text': string; part?: string; repeat?: number })[];
    name: string;
    lang?: string;
    translit?: string;
  }
}
