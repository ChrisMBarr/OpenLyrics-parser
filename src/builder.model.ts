//The models for the objects to be passed to the OpenLyricsCreator method
//Most everything here is similar to the parser.model except nothing has
// index properties and many properties are optional

export namespace INewOpenLyricsSong {
  export interface IBuilderObject {
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
      lyrics: {
        instrument: [];
        verse: IVerseXml[];
      };
    };
  }

  export interface IOptions {
    // format?: IFormat;
    // instruments?: IInstrument[];
    meta?: IMeta;
    properties: IProperties;
    verses: IVerse[];
  }

  //============================================
  //Meta
  export interface IMeta {
    chordNotation?: string;
    createdIn?: string;
    modifiedIn?: string;
    lang?: string;
  }

  //============================================
  //Properties
  export interface IProperties {
    authors?: IAuthor[];
    ccliNo?: string;
    comments?: string[];
    copyright?: string | number;
    key?: string;
    keywords?: string;
    publisher?: string;
    released?: string;
    songBooks?: ISongBook[];
    tempo?: string | number;
    tempoType?: string;
    themes?: ITheme[];
    titles: ITitle[] | string; //A title is the only required property. Allow a simple string to be passed in as a quick alternative
    transposition?: string | number;
    variant?: string;
    verseOrder?: string;
    version?: string;
  }

  export interface IPropertiesXml {
    authors?: {
      author: IAuthorXml[];
    };
    ccliNo?: string;
    comments?: string[];
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

  export interface IAuthor {
    lang?: string;
    type?: string;
    value: string;
  }

  export interface IAuthorXml {
    '@lang'?: string;
    '@type'?: string;
    '#text': string;
  }

  export interface ITitle {
    lang?: string;
    original?: boolean;
    value: string;
  }

  export interface ITitleXml {
    '@lang'?: string;
    '@original'?: boolean;
    '#text': string;
  }

  export interface ITheme {
    lang?: string;
    value: string;
  }

  export interface IThemeXml {
    '@lang'?: string;
    '#text': string;
  }

  export interface ISongBook {
    entry?: string;
    name: string;
  }

  export interface ISongBookXml {
    '@entry'?: string;
    '@name': string;
  }

  //============================================
  //Verses & Instruments (Shared)
  export interface IVerseAndInstrumentLineContentChord {
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
    break?: '' | 'optional';
    lang?: string;
    lines: string[] | IVerseLine[];
    name: string;
    transliteration?: string;
  }

  export interface IVerseXml {
    '@break'?: '' | 'optional';
    '@lang'?: string;
    lines: IVerseLineXml[];
    '@name': string;
    '@transliteration'?: string;
  }

  export interface IVerseLine {
    content: IVerseLineContent[];
    part?: string;
  }

  export interface IVerseLineXml {
    '#text': string;
    '@part'?: string;
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
    name: string;
    type: 'tag';
    value: string;
  }
}
