import { XMLParser } from 'fast-xml-parser';
import { IOpenLyricsSong } from './parser.model';
import { OpenLyricsXml } from './xml.model';

export class Parser {
  private readonly lyricLineParser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '',
    isArray: (_n, jPath: string): boolean => {
      // console.log(jPath)
      return ['beat.chord'].includes(jPath);
    },
  });

  //==============================================================================
  //Semi-public methods to be used in the index file where the "real" public API is called from
  public getSongMeta(olSong: OpenLyricsXml.ISong): IOpenLyricsSong.IMeta {
    // console.log('song', olSong);
    return {
      createdIn: olSong.createdIn ?? '',
      chordNotation: olSong.chordNotation ?? '',
      modifiedDate: olSong.modifiedDate != null ? new Date(olSong.modifiedDate) : null,
      modifiedIn: olSong.modifiedIn ?? '',
      version: olSong.version.toString(),
    };
  }

  public getSongProperties(props: OpenLyricsXml.IProperties): IOpenLyricsSong.IProperties {
    // console.log('props', props);
    return {
      authors: this.getSongPropertyAuthors(props.authors),
      ccliNo: props.ccliNo?.toString() ?? '',
      comments: this.getSongPropertyComments(props.comments),
      copyright: props.copyright?.toString() ?? '',
      key: props.key ?? '',
      keywords: props.keywords ?? '',
      publisher: props.publisher ?? '',
      released: props.released?.toString() ?? '',
      songBooks: this.getSongPropertySongBooks(props.songbooks),
      tempo: props.tempo?.['#text'].toString() ?? '',
      tempoType: props.tempo?.type ?? '',
      themes: this.getSongPropertyThemes(props.themes),
      titles: this.getSongPropertyTitles(props.titles),
      transposition: props.transposition?.toString() ?? '',
      variant: props.variant ?? '',
      verseOrder: props.verseOrder ?? '',
      version: props.version?.toString() ?? '',
    };
  }

  public getSongFormat(format?: OpenLyricsXml.IFormat): IOpenLyricsSong.IFormat {
    let application = '';
    let tags: IOpenLyricsSong.IFormatTag[] = [];
    if (format) {
      // console.log('format', format.tags);
      application = format.tags.application;
      tags = format.tags.tag.map((t) => {
        return {
          name: t.name,
          open: t.open,
          close: t.close ?? '',
        };
      });
    }
    return { application, tags };
  }

  public getSongVerses(verses?: OpenLyricsXml.IVerse[]): IOpenLyricsSong.IVerse[] {
    const versesArr: IOpenLyricsSong.IVerse[] = [];
    if (verses) {
      for (const v of verses) {
        versesArr.push({
          name: v.name,
          lang: v.lang ?? '',
          transliteration: v.translit ?? '',
          lines: this.getVerseLines(v.lines),
        });
      }
    }
    return versesArr;
  }

  public getSongInstruments(
    instruments?: OpenLyricsXml.IInstrument[]
  ): IOpenLyricsSong.IInstrument[] {
    const instrumentsArr: IOpenLyricsSong.IInstrument[] = [];
    if (instruments) {
      for (const i of instruments) {
        instrumentsArr.push({
          name: i.name,
          lines: this.getInstrumentLines(i.lines),
        });
      }
    }
    return instrumentsArr;
  }

  //==============================================================================
  //Verse/Instrument/Line/Chord parsing methods
  private getVerseLines(
    lines: OpenLyricsXml.IVerseOrInstrumentLineUnparsed[]
  ): IOpenLyricsSong.IVerseLine[] {
    const linesArr: IOpenLyricsSong.IVerseLine[] = [];
    for (const line of lines) {
      // console.log('verse', typeof line, line);
      const rawLineTextAndXml = this.getStringOrTextProp(line);
      const textAndXmlArr = this.parseLineTextForXml(rawLineTextAndXml);
      linesArr.push({
        content: this.getVerseContentObjects(textAndXmlArr),
        part: this.getOptionalPropOnPossibleObject(line, 'part', ''),
      });
    }
    return linesArr;
  }

  private getInstrumentLines(
    lines: OpenLyricsXml.IVerseOrInstrumentLineUnparsed[]
  ): IOpenLyricsSong.IInstrumentLine[] {
    const linesArr: IOpenLyricsSong.IInstrumentLine[] = [];
    for (const line of lines) {
      // console.log('instrument', typeof line, line);
      const rawLineTextAndXml = this.getStringOrTextProp(line);
      const textAndXmlArr = this.parseLineTextForXml(rawLineTextAndXml);
      linesArr.push({
        content: this.getInstrumentContentObjects(textAndXmlArr),
        part: this.getOptionalPropOnPossibleObject(line, 'part', ''),
      });
    }
    return linesArr;
  }

  private parseLineTextForXml(str: string): string[] {
    //Each line will come back as a string that might have XML nodes in it (comments, chords, ???)
    //To make line breaks not screw the text up we had to stop the XML parsing at this point in the
    //document, so now we must manually parse what is left

    return (
      str
        //Find all the XML nodes, and split the string into an array that separates these parts
        .split(/(<[^/]+?>[\s\S]+?<\/.+?>)|(<[^/]+?\/>)/g)
        //Now remove all empty elements form the array since that pattern has 2 groups and
        //only one could match for each split
        .filter((x) => x !== '' && typeof x !== 'undefined')
    );
  }

  private getVerseContentObjects(textAndXmlArr: string[]): IOpenLyricsSong.IVerseLineContent[] {
    const contentArr: IOpenLyricsSong.IVerseLineContent[] = [];

    //Here we get an array of strings. Some might be plain text, others will be only XML nodes
    //We add an object for each item to describe it's type and all the properties it has
    for (const part of textAndXmlArr) {
      if (part.startsWith('<')) {
        //an XML tag, parse it!
        const parsedTag = this.lyricLineParser.parse(part);

        if (parsedTag.comment != null) {
          //A <comment>text here</comment> node
          contentArr.push({
            type: 'comment',
            value: parsedTag.comment,
          });
        } else if (parsedTag.tag != null) {
          //A <tag name="foo">text here</tag> or <tag name="foo"/> node
          contentArr.push({
            type: 'tag',
            name: parsedTag.tag.name,
            value: parsedTag.tag['#text'] ?? '',
          });
        } else if (parsedTag.chord != null) {
          contentArr.push(this.getChordObject(parsedTag.chord));
        }
      } else {
        //plain text, just add it
        contentArr.push({
          type: 'text',
          value: part,
        });
      }
    }

    return contentArr;
  }

  private getInstrumentContentObjects(
    textAndXmlArr: string[]
  ): IOpenLyricsSong.IInstrumentLineContent[] {
    const contentArr: IOpenLyricsSong.IInstrumentLineContent[] = [];
    //Here we get an array of strings. These should all be XML nodes only since that's all that is allowed for instrument content
    //We add an object for each item to describe it's type and all the properties it has
    for (const part of textAndXmlArr) {
      //an XML tag, parse it!
      const parsedTag = this.lyricLineParser.parse(part);
      // console.log(parsedTag)

      if (parsedTag.chord != null) {
        contentArr.push(this.getChordObject(parsedTag.chord));
      } else if (parsedTag.beat != null) {
        contentArr.push({
          type: 'beat',
          chords: parsedTag.beat.chord.map((c: any) => this.getChordObject(c)),
        });
      }
    }

    return contentArr;
  }

  private getChordObject(
    chordObj: OpenLyricsXml.ILineChord
  ): IOpenLyricsSong.IVerseAndInstrumentLineContentChord {
    //A <chord name="A" /> node. This can have a lot of properties, so we just add whatever is there
    //Sometimes chords can have ending tags too: <chord root="E" structure="m3-5-7-9-a11-13" bass="C#">ipsum</chord>
    const chord: IOpenLyricsSong.IVerseAndInstrumentLineContentChord = { type: 'chord' };
    Object.keys(chordObj).forEach((k) => {
      //When we have an ending tag we want to add the inner text between the tags as a value property
      const keyName = k === '#text' ? 'value' : k;
      chord[keyName] = chordObj[k];
    });
    return chord;
  }

  //==============================================================================
  //Specific property parsing methods
  private getSongPropertyAuthors(authors?: OpenLyricsXml.IAuthors): IOpenLyricsSong.IAuthor[] {
    const authorsArr: IOpenLyricsSong.IAuthor[] = [];
    if (authors) {
      // console.log('authors', authors.author);
      for (const a of authors.author) {
        authorsArr.push({
          lang: this.getOptionalPropOnPossibleObject(a, 'lang', ''),
          type: this.getOptionalPropOnPossibleObject(a, 'type', ''),
          value: this.getStringOrTextProp(a),
        });
      }
    }
    return authorsArr;
  }

  private getSongPropertyComments(comments?: OpenLyricsXml.IComments): string[] {
    let commentArr: string[] = [];
    if (comments) {
      // console.log('comments', comments.comment);
      commentArr = comments.comment.map((c) => this.getStringOrTextProp(c));
    }
    return commentArr;
  }

  private getSongPropertyThemes(themes?: OpenLyricsXml.IThemes): IOpenLyricsSong.ITheme[] {
    const titlesArr: IOpenLyricsSong.ITheme[] = [];
    if (themes) {
      // console.log('themes', themes.theme);
      for (const t of themes.theme) {
        titlesArr.push({
          lang: this.getOptionalPropOnPossibleObject(t, 'lang', ''),
          value: this.getStringOrTextProp(t),
        });
      }
    }
    return titlesArr;
  }

  private getSongPropertyTitles(titles?: OpenLyricsXml.ITitles): IOpenLyricsSong.ITitle[] {
    const titlesArr: IOpenLyricsSong.ITitle[] = [];
    if (titles) {
      // console.log('titles', titles.title);
      for (const t of titles.title) {
        titlesArr.push({
          lang: this.getOptionalPropOnPossibleObject(t, 'lang', ''),
          original: this.getOptionalPropOnPossibleObject(t, 'original', null),
          value: this.getStringOrTextProp(t),
        });
      }
    }
    return titlesArr;
  }

  private getSongPropertySongBooks(
    songBooks?: OpenLyricsXml.ISongBooks
  ): IOpenLyricsSong.ISongBook[] {
    const titlesArr: IOpenLyricsSong.ISongBook[] = [];
    if (songBooks) {
      // console.log('songBooks', songBooks.songbook);
      for (const t of songBooks.songbook) {
        titlesArr.push({
          entry: t.entry?.toString() ?? '',
          name: t.name,
        });
      }
    }
    return titlesArr;
  }

  //==============================================================================
  //Utility methods
  private getStringOrTextProp(str: string | { '#text': string }): string {
    return typeof str === 'string' ? str : str['#text'];
  }

  private getOptionalPropOnPossibleObject<T, R>(
    obj: string | T,
    propName: keyof T,
    defaultVal: R
  ): R {
    if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') {
      return defaultVal;
    } else {
      return (obj[propName] as R | undefined) ?? defaultVal;
    }
  }
}
