export interface IBuilderXml {
  '?xml': {
    '@version': string;
    '@encoding': string;
  };
  '?xml-stylesheet': {
    '@href': string;
    '@type': string;
  };
  song: {
    '@xmlns': string;
    '@xml:lang': string;
    '@version': string;
    '@createdIn': string;
    '@chordNotation'?: string;
    '@modifiedIn': string;
    '@modifiedDate': string;
    properties: IPropertiesXml;
    //We need to define the format as optional so we can remove it.
    //We need to be able to remove it so that we can place above the lyrics in the output.
    //So if a format option is provided it will be filled in, if not it will be removed,
    //This prevents an empty format XML node from being output
    format?: {
      tags?: IFormatXml[];
    };
    lyrics: {
      instrument?: IInstrumentXml[];
      verse: IVerseXml[];
    };
  };
}

//============================================
//Properties
export interface IPropertiesXml {
  [key: string]: any;
  authors?: {
    author: IAuthorXml[];
  };
  ccliNo?: string;
  comments?: {
    comment: string[];
  };
  copyright?: string | number;
  key?: string;
  keywords?: string;
  publisher?: string;
  released?: string;
  songbooks?: {
    songbook: ISongBookXml[];
  };
  tempo?: {
    '#text': string | number;
    '@type'?: string;
  };
  tempoType?: string;
  themes?: {
    theme: IThemeXml[];
  };
  titles: {
    title: ITitleXml[];
  };
  transposition?: string | number;
  variant?: string;
  verseOrder?: string;
  version?: string;
}
export interface IAuthorXml {
  '@lang'?: string;
  '@type'?: string;
  '#text': string;
}
export interface ITitleXml {
  '@lang'?: string;
  '@original'?: string;
  '@translit'?: string;
  '#text': string;
}

export interface IThemeXml {
  '@lang'?: string;
  '#text': string;
}
export interface ISongBookXml {
  '@entry'?: string | number;
  '@name': string;
}

//============================================
//Format
export interface IFormatXml {
  '@application': string;
  tag: IFormatTagXml[];
}
export interface IFormatTagXml {
  close: string;
  '@name': string;
  open: string;
}

//============================================
//Verses
export interface IVerseXml {
  '@break'?: 'optional';
  '@lang'?: string;
  lines: IVerseLineXml[];
  '@name': string;
  '@transliteration'?: string;
}
export interface IVerseLineXml {
  '#text': string;
  '@part'?: string;
  '@break'?: string;
  '@repeat'?: number;
}

//============================================
//Instruments
export interface IInstrumentXml {
  lines: IInstrumentLineXml[];
  '@name': string;
}

export interface IInstrumentLineXml {
  '#text': string;
  '@part'?: string;
  '@repeat'?: number;
}
