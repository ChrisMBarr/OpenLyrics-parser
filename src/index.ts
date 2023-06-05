import { XMLParser } from 'fast-xml-parser';
import { OpenLyrics as olReturn } from './model-return';
import { OpenLyricsXml as olXml } from './model-xml';

export class OpenLyrics {
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
      stopNodes: ['song.lyrics.verse.lines'],
      isArray: (_name, jPath: string): boolean => alwaysArray.includes(jPath),
      tagValueProcessor: (_tagName, tagValue, jPath): string | boolean | null => {
        //console.log(`<${_tagName}> at path: "${jPath}"`, '\n' + tagValue);

        if (jPath === 'song.lyrics.verse.lines') {
          //Inside of a verse line...
          return tagValue
          //replace all correctly and incorrectly formatted <br> </br> and </br> tags with new lines
          //Sometimes these will already have a newline after them, remove that so that newlines aren't doubled
          .replace(/<\/?br\/?>(\n)?/gi, '\n')
          //Remove all XML/HTML comments
          .replace(/<!--.+?-->/g, '');
        }

        //return everything else as is
        return null;
      },
    });

    const parsedDoc: olXml.IDocRoot = xmlParser.parse(fileContent);

    const meta = this.getSongMeta(parsedDoc.song);
    const properties = this.getSongProperties(parsedDoc.song.properties);
    const format = this.getSongFormat(parsedDoc.song.format);
    const lyrics = this.getSongLyrics(parsedDoc.song.lyrics);

    return {
      meta,
      properties,
      format,
      lyrics,
    };
  }

  private getSongMeta(olSong: olXml.ISong): olReturn.IMeta {
    // console.log('song', olSong);
    return {
      createdIn: olSong.createdIn,
      modifiedDate: new Date(olSong.modifiedDate),
      modifiedIn: olSong.modifiedIn,
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

  private getSongLyrics(lyrics: olXml.ILyrics): olReturn.ILyricSection[] {
    const lyricSections: olReturn.ILyricSection[] = [];
    if (lyrics.verse) {
      for (const v of lyrics.verse) {
        lyricSections.push({
          name: v.name,
          lang: v.lang ?? '',
          transliteration: v.translit ?? '',
          lines: this.getLyricSectionLines(v.lines),
        });
      }
    }
    return lyricSections;
  }

  private getLyricSectionLines(lines: olXml.IVerseLine[]): olReturn.ILyricSectionLine[] {
    //Each line will come back as

    const linesArr: olReturn.ILyricSectionLine[] = [];
    for (const line of lines) {
      console.log(line);
      linesArr.push({
        text: this.getStringOrTextProp(line),
        part: this.getOptionalPropOnPossibleObject(line, 'part', ''),
      });
    }

    return linesArr;
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
