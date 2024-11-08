//The models for the objects to be passed to the OpenLyricsCreator method
//Most everything here is similar to the parser.model except nothing has
// index properties and many properties are optional

export interface IBuilderOptions {
  format?: IBuilderFormat[];
  instruments?: IBuilderInstrument[];
  meta?: IBuilderMeta;
  properties: IBuilderProperties;
  verses: IBuilderVerse[];
}

//============================================
//Meta
export interface IBuilderMeta {
  chordNotation?: string;
  createdIn?: string;
  modifiedIn?: string;
  lang?: string;
}

//============================================
//Properties
export interface IBuilderProperties {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  authors?: string | IBuilderAuthor[];
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
  songBooks?: IBuilderSongBook[];
  /**
   * @description The tempo of a song defines the speed at which a song is to be played. It could be expressed as a number in beats per minute (BPM) or as any text value like "slow" or "moderate".
   * @see {@link https://docs.openlyrics.org/en/latest/dataformat.html#tempo}
   */
  tempo?: string | number;
  /**
   * @description Themes are used to categorize songs. Having songs categorized can be useful when choosing songs for a ceremony or for a particular sermon topic.
   * @see {@link https://docs.openlyrics.org/en/latest/dataformat.html#themes}
   */
  themes?: IBuilderTheme[];
  /**
   * @description Defines the time signature of the song
   * @see {@link https://docs.openlyrics.org/en/latest/dataformat.html#time-signature}
   */
  timeSignature?: string;
  /**
   * @description A single title as a string or a list of ITitle objects for this song. At least one title is required.
   * @see {@link https://docs.openlyrics.org/en/latest/dataformat.html#titles}
   * @example
   * [
   *  { value: 'Amazing Grace', lang: 'en' },
   *  { value: 'Erstaunliche Anmut', lang: 'de' }
   * ]
   */
  titles: IBuilderTitle[] | string;
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

export interface IBuilderAuthor {
  lang?: string;
  type?: string;
  value: string;
}

export interface IBuilderTitle {
  lang?: string;
  original?: boolean;
  transliteration?: string;
  value: string;
}

export interface IBuilderTheme {
  lang?: string;
  value: string;
}

export interface IBuilderSongBook {
  entry?: string | number;
  name: string;
}

//============================================
//Format
export interface IBuilderFormat {
  application: string;
  tags: IBuilderFormatTag[];
}

export interface IBuilderFormatTag {
  close: string;
  name: string;
  open: string;
}

//============================================
//Chord base interface, Verses & Instruments extend this interface which we do not export
interface IBuilderChordBase {
  bass?: string;
  root?: string;
  structure?: string;
  type: 'chord';
  upbeat?: boolean;
}

//============================================
//Verses
export interface IBuilderVerse {
  optionalBreak?: boolean;
  lang?: string;
  lines: string[] | IBuilderVerseLine[];
  name: string;
  transliteration?: string;
}

export interface IBuilderVerseLine {
  content: IBuilderVerseLineContent[];
  part?: string;
  optionalBreak?: boolean;
  repeat?: number;
}

export interface IBuilderVerseChord extends IBuilderChordBase {
  value?: string;
}

export type IBuilderVerseLineContent =
  | IBuilderVerseLineContentStandard
  | IBuilderVerseLineContentTag
  | IBuilderVerseChord;

export interface IBuilderVerseLineContentStandard {
  type: 'text' | 'comment';
  value: string;
}

export interface IBuilderVerseLineContentTag {
  name: string;
  type: 'tag';
  value: string;
}

//============================================
//Instruments
export interface IBuilderInstrument {
  lines: IBuilderInstrumentLine[];
  name: string;
}

export interface IBuilderInstrumentLine {
  content: IBuilderInstrumentLineContent[];
  part?: string;
  repeat?: number;
}

//Same as the base chord object but renamed here
export type IBuilderInstrumentChord = IBuilderChordBase;

export interface IBuilderInstrumentLineContentBeat {
  chords: IBuilderInstrumentChord[];
  type: 'beat';
}

export type IBuilderInstrumentLineContent =
  | IBuilderInstrumentLineContentBeat
  | IBuilderInstrumentChord;
