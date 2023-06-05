import { readFileSync } from 'fs';
import { OpenLyrics as ol } from './model-return';
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
        format: { application: '', tags: [] },
        properties: {
          authors: [],
          ccliNo: null,
          comments: [],
          copyright: '',
          key: '',
          keywords: '',
          publisher: '',
          released: null,
          songBooks: [],
          tempo: null,
          tempoType: '',
          themes: [],
          titles: [{ lang: '', original: null, value: 'Amazing Grace' }],
          transposition: null,
          variant: '',
          verseOrder: '',
          version: null,
        },
        lyrics: [],
      } as ol.ISong);
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
        format: { application: '', tags: [] },
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
          ccliNo: 4639462,
          copyright: 'public domain',
          comments: ['This is one of the most popular songs in our congregation.'],
          key: 'C#',
          keywords: 'something to help with more accurate results',
          publisher: 'Sparrow Records',
          released: 1779,
          songBooks: [
            { entry: '', name: 'Songbook without Number' },
            { entry: '48', name: 'Songbook with Number' },
            { entry: '153c', name: 'Songbook with Letters in Entry Name' },
          ],
          tempo: 90,
          tempoType: 'bpm',
          themes: [
            { lang: '', value: 'Adoration' },
            { lang: 'en-US', value: 'Grace' },
            { lang: 'en-US', value: 'Praise' },
            { lang: 'en-US', value: 'Salvation' },
            { lang: 'pt-BR', value: 'Graça' },
            { lang: 'pt-BR', value: 'Adoração' },
            { lang: 'pt-BR', value: 'Salvação' },
          ],
          transposition: 2,
          variant: 'Newsboys',
          verseOrder: 'v1 v2  v3 c v4 c1 c2 b b1 b2',
          version: 0.99,
        },
        lyrics: [],
      } as ol.ISong);
    });

    it('should return a song with format tags for file: format.xml"', () => {
      const testFile = readFileSync('./sample-files/examples/format.xml').toString();

      expect(olParser.parse(testFile)).toEqual({
        meta: {
          createdIn: 'OpenLP 1.9.0',
          modifiedDate: new Date('2012-04-10T12:00:00.000Z'),
          modifiedIn: 'OpenLP 1.9.7',
          version: 0.8,
        },
        format: {
          application: 'OpenLP',
          tags: [
            {
              name: 'red',
              open: '<span style="color:red">',
              close: '</span>',
            },
            {
              name: 'bold',
              open: '<strong>',
              close: '</strong>',
            },
          ],
        },
        properties: {
          authors: [],
          ccliNo: null,
          comments: [],
          copyright: '',
          key: '',
          keywords: '',
          publisher: '',
          released: null,
          songBooks: [],
          tempo: null,
          tempoType: '',
          themes: [],
          titles: [{ lang: '', original: null, value: 'Amazing Grace' }],
          transposition: null,
          variant: '',
          verseOrder: '',
          version: null,
        },
        lyrics: [],
      } as ol.ISong);
    });

    it('should return a song with format tags for file: format2.xml"', () => {
      const testFile = readFileSync('./sample-files/examples/format2.xml').toString();

      expect(olParser.parse(testFile)).toEqual({
        meta: {
          createdIn: 'OpenLP 1.9.7',
          modifiedDate: new Date('2012-04-10T12:00:00.000Z'),
          modifiedIn: 'OpenLP 1.9.7',
          version: 0.8,
        },
        format: {
          application: 'OpenLP',
          tags: [
            {
              name: 'r',
              open: '<span style="-webkit-text-fill-color:red">',
              close: '</span>',
            },
            {
              name: 'bl',
              open: '<span style="-webkit-text-fill-color:blue">',
              close: '</span>',
            },
            {
              name: 'y',
              open: '<span style="-webkit-text-fill-color:yellow">',
              close: '</span>',
            },
            {
              name: 'o',
              open: '<span style="-webkit-text-fill-color:#FFA500">',
              close: '</span>',
            },
            {
              name: 'st',
              open: '<strong>',
              close: '</strong>',
            },
            {
              name: 'it',
              open: '<em>',
              close: '</em>',
            },
            {
              name: 'g',
              open: '<span style="-webkit-text-fill-color:green">',
              close: '</span>',
            },
            {
              name: 'aq',
              open: '<span style="-webkit-text-fill-color:#10F7E2">',
              close: '</span>',
            },
            {
              name: 'br',
              open: '<br>',
              close: '',
            },
          ],
        },
        properties: {
          authors: [{ lang: '', type: '', value: 'M. Jan Hus' }],
          ccliNo: null,
          comments: [],
          copyright: '',
          key: '',
          keywords: '',
          publisher: '',
          released: null,
          songBooks: [{ entry: '', name: 'Jistebnický kancionál' }],
          tempo: null,
          tempoType: '',
          themes: [],
          titles: [{ lang: '', original: null, value: 'Jezu Kriste, štědrý kněže' }],
          transposition: null,
          variant: '',
          verseOrder: '',
          version: null,
        },
        lyrics: [],
      } as ol.ISong);
    });
  });
});
