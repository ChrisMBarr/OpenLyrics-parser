//The models for the objects returned by the OpenLyrics parser

export interface IOpenLyricsSong {
  meta: IOpenLyricsSongMeta;
  properties: IOpenLyricsSongProperties;
  formatTags: IOpenLyricsSongFormatTag[];
  lyrics: IOpenLyricsSongLyricSection[];
}

export interface IOpenLyricsSongMeta {
  version: string;
  createdIn: string;
  modifiedIn: string;
  modifiedDate: Date;
}

export interface IOpenLyricsSongProperties {
  authors: IOpenLyricsSongAuthor[];
  titles: IOpenLyricsSongTitle[];
  songBooks: IOpenLyricsSongBook[];
  comments: string[];
  copyright: string;
  ccliNo: number | null;
  released: number | null;
  transposition: number | null;
  tempo: number | null;
  tempoType: string;
  themes: IOpenLyricsSongTheme[];
  key: string;
  variant: string;
  publisher: string;
  version: number | null;
  keywords: string;
  verseOrder: string;
}

export interface IOpenLyricsSongAuthor {
  value: string;
  type: string;
  lang: string;
}

export interface IOpenLyricsSongTitle {
  value: string;
  lang: string;
  original: boolean | null;
}

export interface IOpenLyricsSongTheme{
  value: string;
  lang: string;
}

export interface IOpenLyricsSongBook {
  value: string;
  entry: string;
}

export interface IOpenLyricsSongFormatTag {
  name: string;
  open: string;
  close: string;
}

export interface IOpenLyricsSongLyricSection {}
