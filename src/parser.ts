import { XMLParser } from 'fast-xml-parser';

import * as parserModel from './parser.model';
import * as xmlModel from './parser.xml.model';

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
  public getSongMeta(olSong: xmlModel.IXmlSong): parserModel.IParserMeta {
    // console.log('song', olSong);
    return {
      createdIn: olSong.createdIn ?? '',
      chordNotation: olSong.chordNotation ?? '',
      lang: olSong['xml:lang'] ?? '',
      modifiedDate: olSong.modifiedDate != null ? new Date(olSong.modifiedDate) : null,
      modifiedIn: olSong.modifiedIn ?? '',
      version: olSong.version.toString(),
    };
  }

  public getSongProperties(props: xmlModel.IXmlProperties): parserModel.IParserProperties {
    // console.log('props', props);

    //Property was renamed in OpenLyrics 0.9. Move it over if it exists
    //https://docs.openlyrics.org/en/latest/changes.html#release-0-9-unreleased
    if (props.releaseDate != null) {
      props.released = props.releaseDate;
    }

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
      timeSignature: props.timeSignature ?? '',
      titles: this.getSongPropertyTitles(props.titles),
      transposition: props.transposition?.toString() ?? '',
      variant: props.variant ?? '',
      verseOrder: props.verseOrder ?? '',
      version: props.version?.toString() ?? '',
    };
  }

  public getSongFormat(format?: xmlModel.IXmlFormat): parserModel.IParserFormat {
    let application = '';
    let tags: parserModel.IParserFormatTag[] = [];
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

  public getSongVerses(verses?: xmlModel.IXmlVerse[]): parserModel.IParserVerse[] {
    const versesArr: parserModel.IParserVerse[] = [];
    if (verses) {
      for (const v of verses) {
        versesArr.push({
          break: v.break ?? '',
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
    instruments?: xmlModel.IXmlInstrument[]
  ): parserModel.IParserInstrument[] {
    const instrumentsArr: parserModel.IParserInstrument[] = [];
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
    lines: xmlModel.IXmlVerseOrInstrumentLineUnparsed[]
  ): parserModel.IParserVerseLine[] {
    const linesArr: parserModel.IParserVerseLine[] = [];
    for (const line of lines) {
      // console.log('verse', typeof line, line);
      const rawLineTextAndXml = this.getStringOrTextProp(line);
      const textAndXmlArr = this.parseLineTextForXml(rawLineTextAndXml);
      linesArr.push({
        break: this.getOptionalPropOnPossibleObject(line, 'break', ''),
        content: this.getVerseContentObjects(textAndXmlArr),
        part: this.getOptionalPropOnPossibleObject(line, 'part', ''),
        repeat: this.getOptionalPropOnPossibleObject(line, 'repeat', ''),
      });
    }
    return linesArr;
  }

  private getInstrumentLines(
    lines: xmlModel.IXmlVerseOrInstrumentLineUnparsed[]
  ): parserModel.IParserInstrumentLine[] {
    const linesArr: parserModel.IParserInstrumentLine[] = [];
    for (const line of lines) {
      // console.log('instrument', typeof line, line);
      const rawLineTextAndXml = this.getStringOrTextProp(line);
      const textAndXmlArr = this.parseLineTextForXml(rawLineTextAndXml);
      linesArr.push({
        content: this.getInstrumentContentObjects(textAndXmlArr),
        part: this.getOptionalPropOnPossibleObject(line, 'part', ''),
        repeat: this.getOptionalPropOnPossibleObject(line, 'repeat', ''),
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

  private getVerseContentObjects(textAndXmlArr: string[]): parserModel.IParserVerseLineContent[] {
    const contentArr: parserModel.IParserVerseLineContent[] = [];

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
  ): parserModel.IParserInstrumentLineContent[] {
    const contentArr: parserModel.IParserInstrumentLineContent[] = [];
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
          chords: parsedTag.beat.chord.map((c: xmlModel.IXmlLineChord) => this.getChordObject(c)),
        });
      }
    }

    return contentArr;
  }

  private getChordObject(
    chordObj: xmlModel.IXmlLineChord
  ): parserModel.IParserVerseAndInstrumentLineContentChord {
    //A <chord name="A" /> node. This can have a lot of properties, so we just add whatever is there
    //Sometimes chords can have ending tags too: <chord root="E" structure="m3-5-7-9-a11-13" bass="C#">ipsum</chord>
    const chord: parserModel.IParserVerseAndInstrumentLineContentChord = { type: 'chord' };
    Object.keys(chordObj).forEach((k) => {
      //When we have an ending tag we want to add the inner text between the tags as a value property
      let keyName = k === '#text' ? 'value' : k;

      if (keyName === 'name') {
        //Rename property from version 0.8 to version 0.9
        keyName = 'root';
      }

      chord[keyName] = chordObj[k];
    });
    return chord;
  }

  //==============================================================================
  //Specific property parsing methods
  private getSongPropertyAuthors(authors?: xmlModel.IXmlAuthors): parserModel.IParserAuthor[] {
    const authorsArr: parserModel.IParserAuthor[] = [];
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

  private getSongPropertyComments(comments?: xmlModel.IXmlComments): string[] {
    let commentArr: string[] = [];
    if (comments) {
      // console.log('comments', comments.comment);
      commentArr = comments.comment.map((c) => this.getStringOrTextProp(c));
    }
    return commentArr;
  }

  private getSongPropertyThemes(themes?: xmlModel.IXmlThemes): parserModel.IParserTheme[] {
    const titlesArr: parserModel.IParserTheme[] = [];
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

  private getSongPropertyTitles(titles?: xmlModel.IXmlTitles): parserModel.IParserTitle[] {
    const titlesArr: parserModel.IParserTitle[] = [];
    if (titles) {
      // console.log('titles', titles.title);
      for (const t of titles.title) {
        titlesArr.push({
          lang: this.getOptionalPropOnPossibleObject(t, 'lang', ''),
          original: this.getOptionalPropOnPossibleObject(t, 'original', null),
          transliteration: this.getOptionalPropOnPossibleObject(t, 'translit', ''),
          value: this.getStringOrTextProp(t),
        });
      }
    }
    return titlesArr;
  }

  private getSongPropertySongBooks(
    songBooks?: xmlModel.IXmlSongBooks
  ): parserModel.IParserSongBook[] {
    const titlesArr: parserModel.IParserSongBook[] = [];
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
