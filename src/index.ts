import { XMLParser } from 'fast-xml-parser';
import { Parser } from './parser';
import { IOpenLyricsSong } from './parser.model';
import { OpenLyricsXml } from './xml.model';

export const OpenLyricsParser = (fileContent: string): IOpenLyricsSong.IRoot => {
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

  const parsedDoc: OpenLyricsXml.IDocRoot = xmlParser.parse(fileContent);
  const olParser = new Parser();

  const meta = olParser.getSongMeta(parsedDoc.song);
  const properties = olParser.getSongProperties(parsedDoc.song.properties);
  const format = olParser.getSongFormat(parsedDoc.song.format);
  const verses = olParser.getSongVerses(parsedDoc.song.lyrics.verse);
  const instruments = olParser.getSongInstruments(parsedDoc.song.lyrics.instrument);

  return {
    meta,
    properties,
    format,
    verses,
    instruments,
  };
};

