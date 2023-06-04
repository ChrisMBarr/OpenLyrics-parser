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
        properties: {
          titles: [],
          authors: [],
          comments: [],
          copyright: '',
          ccliNo: null,
          released: null,
          transposition: null,
          tempo: null,
          tempoType: '',
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
        properties: {
          titles: [],
          authors: [],
          comments: [],
          copyright: 'public domain',
          ccliNo: 4639462,
          released: 1779,
          transposition: 2,
          tempo: 90,
          tempoType: 'bpm',
          key: 'C#',
          variant: 'Newsboys',
          publisher: 'Sparrow Records',
          version: 0.99,
          keywords: 'something to help with more accurate results',
          verseOrder: 'v1 v2  v3 c v4 c1 c2 b b1 b2',
          songBooks: [],
        },
        lyrics: [],
      });
    });
  });
});
