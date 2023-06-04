import { XMLParser } from 'fast-xml-parser';
import {
  IOpenLyricsSong,
  IOpenLyricsSongAuthor,
  IOpenLyricsSongBook,
  IOpenLyricsSongFormatTag,
  IOpenLyricsSongLyricSection,
  IOpenLyricsSongMeta,
  IOpenLyricsSongProperties,
  IOpenLyricsSongTheme,
  IOpenLyricsSongTitle,
} from './model-return';
import {
  IOpenLyricsXmlDocAuthors,
  IOpenLyricsXmlDocComments,
  IOpenLyricsXmlDocFormat,
  IOpenLyricsXmlDocLyrics,
  IOpenLyricsXmlDocProperties as IOpenLyricsXmlDocProperties,
  IOpenLyricsXmlDocRoot,
  IOpenLyricsXmlDocSong,
  IOpenLyricsXmlDocSongBooks,
  IOpenLyricsXmlDocThemes,
  IOpenLyricsXmlDocTitles,
} from './model-xml';

export class OpenLyrics {
  parse(fileContent: string): IOpenLyricsSong {
    //When certain XML nodes only have one item the parser will convert them into objects
    //Here we maintain a list of node paths to always keep as arrays
    //This keeps our code structure and typedefs more sane and normalized
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
      parseAttributeValue: true,
      // stopNodes: ['song.lyrics.verse.lines'],
      isArray: (_name, jPath: string): boolean => alwaysArray.includes(jPath),
      // tagValueProcessor: (_tagName, tagValue, jPath): string | null => {
      //   return jPath === 'song.lyrics.verse.lines' ? tagValue : null;
      // },
    });

    const parsedDoc: IOpenLyricsXmlDocRoot = xmlParser.parse(fileContent);

    const meta = this.getSongMeta(parsedDoc.song);
    const properties = this.getSongProperties(parsedDoc.song.properties);
    const formatTags = this.getSongFormatTags(parsedDoc.song.format);
    const lyrics = this.getSongLyrics(parsedDoc.song.lyrics);

    return { meta, properties, formatTags, lyrics };
  }

  private getSongMeta(olSong: IOpenLyricsXmlDocSong): IOpenLyricsSongMeta {
    // console.log('song', olSong);
    return {
      createdIn: olSong.createdIn,
      modifiedDate: new Date(olSong.modifiedDate),
      modifiedIn: olSong.modifiedIn,
      version: olSong.version,
    };
  }

  private getSongProperties(props: IOpenLyricsXmlDocProperties): IOpenLyricsSongProperties {
    // console.log('props', props);

    return {
      authors: this.getSongAuthors(props.authors),
      ccliNo: props.ccliNo ?? null,
      comments: this.getSongComments(props.comments),
      copyright: props.copyright?.toString() ?? '',
      key: props.key ?? '',
      keywords: props.keywords ?? '',
      publisher: props.publisher ?? '',
      released: props.released ?? null,
      songBooks: this.getSongBooks(props.songbooks),
      tempo: props.tempo?.['#text'] ?? null,
      tempoType: props.tempo?.type ?? '',
      titles: this.getSongTitles(props.titles),
      themes: this.getSongThemes(props.themes),
      transposition: props.transposition ?? null,
      variant: props.variant ?? '',
      verseOrder: props.verseOrder ?? '',
      version: props.version ?? null,
    };
  }

  private getSongComments(comments?: IOpenLyricsXmlDocComments): string[] {
    let commentArr: string[] = [];
    if (comments) {
      // console.log('comments', comments.comment);
      commentArr = comments.comment.map((c) => this.getStringOrTextProp(c));
    }

    return commentArr;
  }

  private getSongAuthors(authors?: IOpenLyricsXmlDocAuthors): IOpenLyricsSongAuthor[] {
    const authorsArr: IOpenLyricsSongAuthor[] = [];

    if (authors) {
      // console.log('authors', authors.author);

      for (const a of authors.author) {
        authorsArr.push({
          value: this.getStringOrTextProp(a),
          lang: this.getOptionalPropOnPossibleObject(a, 'lang', ''),
          type: this.getOptionalPropOnPossibleObject(a, 'type', ''),
        });
      }
    }

    return authorsArr;
  }

  private getSongTitles(titles?: IOpenLyricsXmlDocTitles): IOpenLyricsSongTitle[] {
    const titlesArr: IOpenLyricsSongTitle[] = [];

    if (titles) {
      // console.log('titles', titles.title);

      for (const t of titles.title) {
        titlesArr.push({
          value: this.getStringOrTextProp(t),
          lang: this.getOptionalPropOnPossibleObject(t, 'lang', ''),
          original: this.getOptionalPropOnPossibleObject(t, 'original', null),
        });
      }
    }

    return titlesArr;
  }

  private getSongThemes(themes?: IOpenLyricsXmlDocThemes): IOpenLyricsSongTheme[] {
    const titlesArr: IOpenLyricsSongTheme[] = [];

    if (themes) {
      // console.log('themes', themes.theme);

      for (const t of themes.theme) {
        titlesArr.push({
          value: this.getStringOrTextProp(t),
          lang: this.getOptionalPropOnPossibleObject(t, 'lang', ''),
        });
      }
    }

    return titlesArr;
  }

  private getSongBooks(songBooks?: IOpenLyricsXmlDocSongBooks): IOpenLyricsSongBook[] {
    const titlesArr: IOpenLyricsSongBook[] = [];

    if (songBooks) {
      // console.log('songBooks', songBooks.songbook);

      for (const t of songBooks.songbook) {
        titlesArr.push({
          value: t.name,
          entry: t.entry?.toString() ?? '',
        });
      }
    }

    return titlesArr;
  }

  private getSongFormatTags(format?: IOpenLyricsXmlDocFormat): IOpenLyricsSongFormatTag[] {
    if (format) {
      // console.log('format', format);
    }

    return [];
  }

  // eslint-disable-next-line no-unused-vars
  private getSongLyrics(_lyrics: IOpenLyricsXmlDocLyrics): IOpenLyricsSongLyricSection[] {
    // console.log('lyrics', lyrics);
    return [];
  }

  private getStringOrTextProp(str: string | { '#text': string }): string {
    if (typeof str === 'string') {
      return str;
    }
    return str['#text'];
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
