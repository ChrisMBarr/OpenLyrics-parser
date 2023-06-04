import { readFileSync } from 'fs';
import { OpenLyrics } from '.';

describe('OpenLyrics', (): void => {
  let olParser: OpenLyrics;

  beforeEach(() => {
    olParser = new OpenLyrics();
  });

  it('should exist', () => {
    expect(olParser).toBeDefined();
  });

  describe('Example Files', () => {
    it('should return a song for file: simple.xml"', () => {
      const testFile = readFileSync('./sample-files/examples/simple.xml').toString();

      expect(olParser.parse(testFile)).toEqual({
        meta: {
          createdIn: 'OpenLP 1.9.0',
          modifiedDate: new Date('2012-04-10T12:00:00.000Z'),
          modifiedIn: 'MyApp 0.0.1',
          version: 0.8,
        },
        formatTags: [],
        properties: {
          titles: [{ lang: '', original: null, value: 'Amazing Grace' }],
          authors: [],
          comments: [],
          copyright: '',
          ccliNo: null,
          released: null,
          transposition: null,
          tempo: null,
          tempoType: '',
          themes: [],
          key: '',
          variant: '',
          publisher: '',
          version: null,
          keywords: '',
          verseOrder: '',
          songBooks: [],
        },
        lyrics: [],
      });
    });

    it('should return a song for file: complex.xml"', () => {
      const testFile = readFileSync('./sample-files/examples/complex.xml').toString();

      expect(olParser.parse(testFile)).toEqual({
        meta: {
          createdIn: 'OpenLP 1.9.0',
          modifiedDate: new Date('2012-04-10T12:00:00.000Z'),
          modifiedIn: 'ChangingSong 0.0.1',
          version: 0.8,
        },
        formatTags: [],
        properties: {
          titles: [
            { lang: 'en-US', original: true, value: 'Amazing Grace' },
            { lang: 'en', original: null, value: 'Amazing Grace' },
            { lang: '', original: null, value: 'Amazing' },
            { lang: 'de-DE', original: null, value: 'Erstaunliche Anmut' },
          ],
          authors: [
            {
              lang: '',
              type: '',
              value: 'John Newton',
            },
            {
              lang: '',
              type: 'words',
              value: 'Chris Rice',
            },
            {
              lang: '',
              type: 'music',
              value: 'Richard Wagner',
            },
            {
              lang: 'cs',
              type: 'translation',
              value: 'František Foo',
            },
          ],
          comments: ['This is one of the most popular songs in our congregation.'],
          copyright: 'public domain',
          ccliNo: 4639462,
          released: 1779,
          transposition: 2,
          tempo: 90,
          themes: [
            { lang: '', value: 'Adoration' },
            { lang: 'en-US', value: 'Grace' },
            { lang: 'en-US', value: 'Praise' },
            { lang: 'en-US', value: 'Salvation' },
            { lang: 'pt-BR', value: 'Graça' },
            { lang: 'pt-BR', value: 'Adoração' },
            { lang: 'pt-BR', value: 'Salvação' },
          ],
          tempoType: 'bpm',
          key: 'C#',
          variant: 'Newsboys',
          publisher: 'Sparrow Records',
          version: 0.99,
          keywords: 'something to help with more accurate results',
          verseOrder: 'v1 v2  v3 c v4 c1 c2 b b1 b2',
          songBooks: [
            { entry: '', value: 'Songbook without Number' },
            { entry: '48', value: 'Songbook with Number' },
            { entry: '153c', value: 'Songbook with Letters in Entry Name' },
          ],
        },
        lyrics: [],
      });
    });
  });
});
