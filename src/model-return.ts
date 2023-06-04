//The models for the objects returned by the OpenLyrics parser

export interface IOpenLyricsSong {
  meta: IOpenLyricsSongMeta;
  properties: IOpenLyricsSongProperties;
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
  key: string;
  variant: string;
  publisher: string;
  version: number | null;
  keywords: string;
  verseOrder: string;
}

export interface IOpenLyricsSongAuthor {}

export interface IOpenLyricsSongTitle {}

export interface IOpenLyricsSongBook {}

export interface IOpenLyricsSongLyricSection {}
