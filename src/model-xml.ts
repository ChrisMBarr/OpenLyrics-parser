//A representation of an OpenLyrics document as a JSON object parsed by fast-xml-parser
//OpenLyrics Format Docs: https://docs.openlyrics.org/en/latest/dataformat.html
//The below data model relies on the following options being set:
//  { ignoreAttributes: false, attributeNamePrefix: '', parseAttributeValue: true, ignoreDeclaration: true, }
//  All options here: https://github.com/NaturalIntelligence/fast-xml-parser/blob/master/docs/v4/2.XMLparseOptions.md

export interface IOpenLyricsXmlDocRoot {
  '?xml-stylesheet': {
    href: string;
    type: string;
  };
  song: IOpenLyricsXmlDocSong;
}
export interface IOpenLyricsXmlDocSong {
  properties: IOpenLyricsXmlDocProperties;
  lyrics: IOpenLyricsXmlDocLyrics;
  xmlns: string;
  version: string;
  createdIn: string;
  modifiedIn: string;
  modifiedDate: string;
}
export interface IOpenLyricsXmlDocProperties {
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

  titles?: IOpenLyricsXmlDocTitles;
  authors?: IOpenLyricsXmlDocAuthors;
  comments?: IOpenLyricsXmlDocComments;
  songbooks?: IOpenLyricsXmlDocSongBooks;
  tempo?: IOpenLyricsXmlDocTempo;
  themes?: IOpenLyricsXmlDocThemes;
}

export interface IOpenLyricsXmlDocTitles {
  title: (string | { '#text': string; lang?: string })[];
}
export interface IOpenLyricsXmlDocAuthors {
  author: (string | { '#text': string; lang?: string; type?: string })[];
}
export interface IOpenLyricsXmlDocComments {
  comment: (string | { '#text': string })[];
}
export interface IOpenLyricsXmlDocSongBooks {
  songbook: { name: string; entry?: string | number }[];
}
export interface IOpenLyricsXmlDocThemes {
  theme: (string | { '#text': string; lang?: string })[];
}
export interface IOpenLyricsXmlDocTempo {
  '#text': number;
  type: string;
}
export interface IOpenLyricsXmlDocLyrics {
  verse?: IOpenLyricsXmlDocVerse[];
}
export interface IOpenLyricsXmlDocVerse {
  lines: (string | { '#text': string; part?: string; repeat?: number })[];
  name: string;
  lang?: string;
  translit?: string;
}
