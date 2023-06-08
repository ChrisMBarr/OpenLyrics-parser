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

  export interface IOptions {
    format?: IFormat[];
    instruments?: IInstrument[];
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
    [key: string]: any;
    /**
     * @description The single author of this song as a simple string, or an array of IAuthor objects
     * @see {@link https://docs.openlyrics.org/en/latest/dataformat.html#authors}
     * @example
     * [
        { value: 'John Newton' },
        { value: 'Chris Rice', type: 'words' },
        { value: 'Richard Wagner', type: 'music' },
        { value: 'František Foo', type: 'translation', lang: 'cs' },
      ]
     */
    authors?: string | IAuthor[];
    /**
     * @description CCLI stands for Christian Copyright Licensing International. CCLI is an organization that offers copyright licensing of songs and other resource materials to churches and Christian organizations for use in Christian worship. For registered churches, CCLI offers songs and other resources for download. A CCLI ID is assigned to every song. This provides integration with CCLI.
     * @see {@link https://docs.openlyrics.org/en/latest/dataformat.html#ccli-number}
     */
    ccliNo?: string | number;
    /**
     * @description Used to store any additional, unspecified user data in a free-form text field
     * @see {@link https://docs.openlyrics.org/en/latest/dataformat.html#comments}
     */
    comments?: string[];
    /**
     * @description The copyright information of the song. In some countries it is a legal requirement to display copyright information during the presentation of songs. It has no specific format, though it is recommended that the value contains at least the year and copyright holder of the song.
     * @see {@link https://docs.openlyrics.org/en/latest/dataformat.html#copyright}
     */
    copyright?: string | number;
    /**
     * @description The key determines the musical scale of a song. See the documentation link for examples
     * @see {@link https://docs.openlyrics.org/en/latest/dataformat.html#key}
     */
    key?: string;
    /**
     * @description
     * @see {@link https://docs.openlyrics.org/en/latest/dataformat.html#keywords}
     */
    keywords?: string;
    /**
     * @description The name of the publisher of the song
     * @see {@link https://docs.openlyrics.org/en/latest/dataformat.html#publisher}
     */
    publisher?: string;
    /**
     * @description Tracks the date when a song was released or published. it can just be a year, or a year and a month, or even a specific time. See the documentation link for examples.
     * @see {@link https://docs.openlyrics.org/en/latest/dataformat.html#release-date}
     */
    released?: string | number;
    /**
     * @description An array of ISongBook objects. Most songs come from some sort of collection of songs, be it a book or a folder of some sort. It may be useful to track where the song comes from.
     * @see {@link https://docs.openlyrics.org/en/latest/dataformat.html#song-books}
     * @example
     * [
     *  {name: "Rippon's Selection of Hymns"},
     *  {name: "Teszt könyv", entry: "166"}
     * ]
     */
    songBooks?: ISongBook[];
    /**
     * @description The tempo of a song defines the speed at which a song is to be played. It could be expressed in beats per minute (BPM) or as any text value.
     * @see {@link https://docs.openlyrics.org/en/latest/dataformat.html#tempo}
     */
    tempo?: string | number;
    /**
     * @description The way in which the tempo is represented. Usually as "BPM" or "Text". This property is only used if the tempo property has a value.
     * @see {@link https://docs.openlyrics.org/en/latest/dataformat.html#tempo}
     */
    tempoType?: string;
    /**
     * @description Themes are used to categorize songs. Having songs categorized can be useful when choosing songs for a ceremony or for a particular sermon topic.
     * @see {@link https://docs.openlyrics.org/en/latest/dataformat.html#themes}
     */
    themes?: ITheme[];
    /**
     * @description A single title as a string or a list of ITitle objects for this song. At least one title is required.
     * @see {@link https://docs.openlyrics.org/en/latest/dataformat.html#titles}
     * @example
     * [
     *  { value: 'Amazing Grace', lang: 'en' },
     *  { value: 'Erstaunliche Anmut', lang: 'de' }
     * ]
     */
    titles: ITitle[] | string;
    /**
     * @description Used when it is necessary to move the key or the pitch of chords up or down. The value must be an integer between -11 and 11
     * @see {@link https://docs.openlyrics.org/en/latest/dataformat.html#transposition}
     */
    transposition?: string | number;
    /**
     * @description Used to differentiate between songs which are identical, but may be performed or sung differently.
     * @see {@link https://docs.openlyrics.org/en/latest/dataformat.html#variant}
     */
    variant?: string;
    /**
     * @description Defines the order in which the verses and instrumental parts are typically sung or performed. It is a space-separated string of verse and instrumental names (which are defined on the verses and instruments). Verse names can appear multiple times, and should be lowercase.
     * @see {@link https://docs.openlyrics.org/en/latest/dataformat.html#verse-order}
     */
    verseOrder?: string;
    /**
     * @description No song is ever created once, never to be edited again. Songs are updated over time, sometimes to add additional verses, sometimes to fix spelling or grammatical errors. This tag can contain any arbitrary text which could help the user to distinguish between various versions of a song, like a version number, a date, or a description
     * @see {@link https://docs.openlyrics.org/en/latest/dataformat.html#custom-version}
     */
    version?: string | number;
  }

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
    entry?: string | number;
    name: string;
  }

  export interface ISongBookXml {
    '@entry'?: string | number;
    '@name': string;
  }

  //============================================
  //Format
  export interface IFormat {
    application: string;
    tags: IFormatTag[];
  }

  export interface IFormatXml {
    '@application': string;
    tag: IFormatTagXml[];
  }

  export interface IFormatTag {
    close: string;
    name: string;
    open: string;
  }
  export interface IFormatTagXml {
    close: string;
    '@name': string;
    open: string;
  }

  //============================================
  //Verses & Instruments (Shared)
  export interface IVerseAndInstrumentLineContentChord {
    bass?: string;
    name?: string;
    root?: string;
    structure?: string;
    type: 'chord';
    upbeat?: string;
    value?: string;
  }

  //============================================
  //Verses
  export interface IVerse {
    break?: 'optional';
    lang?: string;
    lines: string[] | IVerseLine[];
    name: string;
    transliteration?: string;
  }

  export interface IVerseXml {
    '@break'?: 'optional';
    '@lang'?: string;
    lines: IVerseLineXml[];
    '@name': string;
    '@transliteration'?: string;
  }

  export interface IVerseLine {
    content: IVerseLineContent[];
    part?: string;
    break?: 'optional';
  }

  export interface IVerseLineXml {
    '#text': string;
    '@part'?: string;
    '@break'?: string;
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

  //============================================
  //Instruments
  export interface IInstrument {
    lines: IInstrumentLine[];
    name: string;
  }

  export interface IInstrumentXml {
    lines: IInstrumentLineXml[];
    '@name': string;
  }

  export interface IInstrumentLine {
    content: IInstrumentLineContent[];
    part: string;
  }

  export interface IInstrumentLineXml {
    '#text': string;
    '@part': string;
  }

  export interface IInstrumentLineContentBeat {
    chords: IVerseAndInstrumentLineContentChord[];
    type: 'beat';
  }

  export type IInstrumentLineContent =
    | IInstrumentLineContentBeat
    | IVerseAndInstrumentLineContentChord;
}
