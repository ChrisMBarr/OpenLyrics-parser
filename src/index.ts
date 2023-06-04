import { XMLParser } from 'fast-xml-parser';
import {
  IOpenLyricsSong,
  IOpenLyricsSongLyricSection,
  IOpenLyricsSongMeta,
  IOpenLyricsSongProperties,
} from './model-return';
import {
  IOpenLyricsXmlDocLyrics,
  IOpenLyricsXmlDocProperties as IOpenLyricsXmlDocProperties,
  IOpenLyricsXmlDocRoot,
  IOpenLyricsXmlDocSong,
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
    const lyrics = this.getSongLyrics(parsedDoc.song.lyrics);

    return { meta, properties, lyrics };
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

  // eslint-disable-next-line complexity
  private getSongProperties(props: IOpenLyricsXmlDocProperties): IOpenLyricsSongProperties {
    console.log('props', props);

    return {
      authors: [],
      ccliNo: props.ccliNo ?? null,
      comments: [],
      copyright: props.copyright?.toString() ?? '',
      key: props.key ?? '',
      keywords: props.keywords ?? '',
      publisher: props.publisher ?? '',
      released: props.released ?? null,
      songBooks: [],
      tempo: props.tempo?.['#text'] ?? null,
      tempoType: props.tempo?.type ?? '',
      titles: [],
      transposition: props.transposition ?? null,
      variant: props.variant ?? '',
      verseOrder: props.verseOrder ?? '',
      version: props.version ?? null,
    };
  }

  // eslint-disable-next-line no-unused-vars
  private getSongLyrics(_lyrics: IOpenLyricsXmlDocLyrics): IOpenLyricsSongLyricSection[] {
    // console.log('lyrics', lyrics);
    return [];
  }
}
