import { XMLParser } from 'fast-xml-parser';
import { OpenLyrics as olReturn } from './model-return';
import { OpenLyricsXml as olXml } from './model-xml';

export class OpenLyrics {
  private readonly lyricLineParser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '',
    isArray: (_n, jPath: string): boolean => {
      // console.log(jPath)
      return ['beat.chord'].includes(jPath);
    },
  });

  public parse(fileContent: string): olReturn.ISong {
    //When certain XML nodes only have one item the parser will convert them into objects
    //Here we maintain a list of node paths to always keep as arrays
    //This keeps our code structure and type definitions more sane and normalized
    const alwaysArray = [
      'song.properties.titles.title',
      'song.properties.titles.title.text',
      'song.properties.authors.author',
      'song.properties.comments.comment',
      'song.properties.songbooks.songbook',
      'song.properties.themes.theme',
      'song.lyrics.verse',
      'song.lyrics.verse.lines',
      'song.lyrics.instrument',
      'song.lyrics.instrument.lines',
    ];

    const xmlParser = new XMLParser({
      //https://github.com/NaturalIntelligence/fast-xml-parser/blob/master/docs/v4/2.XMLparseOptions.md
      ignoreAttributes: false,
      ignoreDeclaration: true,
      attributeNamePrefix: '',
      parseTagValue: true,
      parseAttributeValue: true,
      //the XML parser doesn't deal with `<br>` tags very well, so we need to stop parsing
      //when we get to the verse lines and then deal with this separately
      stopNodes: ['song.lyrics.verse.lines', 'song.lyrics.instrument.lines'],
      isArray: (_name, jPath: string): boolean => alwaysArray.includes(jPath),
      tagValueProcessor: (_tagName, tagValue, jPath): string | boolean | null => {
        //console.log(`<${_tagName}> at path: "${jPath}"`, '\n' + tagValue);

        if (jPath === 'song.lyrics.verse.lines') {
          //Inside of a verse line...
          return (
            tagValue
              //replace all correctly and incorrectly formatted <br> </br> and </br> tags with new lines
              //Sometimes these will already have a newline after them, remove that so that newlines aren't doubled
              .replace(/<\/?br\/?>(\n)?/gi, '\n')
              //Remove all XML/HTML comments
              .replace(/<!--.+?-->/g, '')
          );
        }

        //return everything else as is
        return null;
      },
    });

    const parsedDoc: olXml.IDocRoot = xmlParser.parse(fileContent);

    const meta = this.getSongMeta(parsedDoc.song);
    const properties = this.getSongProperties(parsedDoc.song.properties);
    const format = this.getSongFormat(parsedDoc.song.format);
    const verses = this.getSongVerses(parsedDoc.song.lyrics.verse);
    const instruments = this.getSongInstruments(parsedDoc.song.lyrics.instrument);

    return {
      meta,
      properties,
      format,
      verses,
      instruments,
    };
  }

  private getSongMeta(olSong: olXml.ISong): olReturn.IMeta {
    // console.log('song', olSong);
    return {
      createdIn: olSong.createdIn ?? '',
      chordNotation: olSong.chordNotation ?? '',
      modifiedDate: olSong.modifiedDate != null ? new Date(olSong.modifiedDate) : null,
      modifiedIn: olSong.modifiedIn ?? '',
      version: olSong.version.toString(),
    };
  }

  private getSongProperties(props: olXml.IProperties): olReturn.IProperties {
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

  private getSongFormat(format?: olXml.IFormat): olReturn.IFormat {
    let application = '';
    let tags: olReturn.IFormatTag[] = [];
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

  private getSongVerses(verses?: olXml.IVerse[]): olReturn.IVerse[] {
    const versesArr: olReturn.IVerse[] = [];
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

  private getSongInstruments(
    instruments?: olXml.IInstrument[]
  ): olReturn.ILyricSectionInstrument[] {
    const instrumentsArr: olReturn.ILyricSectionInstrument[] = [];
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

  private getVerseLines(lines: olXml.IVerseOrInstrumentLineUnparsed[]): olReturn.IVerseLine[] {
    const linesArr: olReturn.IVerseLine[] = [];
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

  private getInstrumentLines(lines: olXml.IVerseOrInstrumentLineUnparsed[]): olReturn.IInstrumentLine[] {
    const linesArr: olReturn.IInstrumentLine[] = [];
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

  private getVerseContentObjects(textAndXmlArr: string[]): olReturn.IVerseLineContent[] {
    const contentArr: olReturn.IVerseLineContent[] = [];

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
        } else if (parsedTag.beat != null) {
          console.log(parsedTag.beat);
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

  private getInstrumentContentObjects(textAndXmlArr: string[]): olReturn.IInstrumentLineContent[] {
    const contentArr: olReturn.IInstrumentLineContent[] = [];
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

  private getChordObject(chordObj: olXml.ILineChord): olReturn.IVerseAndInstrumentLineContentChord {
    //A <chord name="A" /> node. This can have a lot of properties, so we just add whatever is there
    //Sometimes chords can have ending tags too: <chord root="E" structure="m3-5-7-9-a11-13" bass="C#">ipsum</chord>
    const chord: olReturn.IVerseAndInstrumentLineContentChord = { type: 'chord' };
    Object.keys(chordObj).forEach((k) => {
      //When we have an ending tag we want to add the inner text between the tags as a value property
      const keyName = k === '#text' ? 'value' : k;
      chord[keyName] = chordObj[k] ?? '';
    });
    return chord;
  }

  //==============================================================================
  //Specific property methods
  private getSongPropertyAuthors(authors?: olXml.IAuthors): olReturn.IAuthor[] {
    const authorsArr: olReturn.IAuthor[] = [];
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

  private getSongPropertyComments(comments?: olXml.IComments): string[] {
    let commentArr: string[] = [];
    if (comments) {
      // console.log('comments', comments.comment);
      commentArr = comments.comment.map((c) => this.getStringOrTextProp(c));
    }
    return commentArr;
  }

  private getSongPropertyThemes(themes?: olXml.IThemes): olReturn.ITheme[] {
    const titlesArr: olReturn.ITheme[] = [];
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

  private getSongPropertyTitles(titles?: olXml.ITitles): olReturn.ITitle[] {
    const titlesArr: olReturn.ITitle[] = [];
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

  private getSongPropertySongBooks(songBooks?: olXml.ISongBooks): olReturn.ISongBook[] {
    const titlesArr: olReturn.ISongBook[] = [];
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
