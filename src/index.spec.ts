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
          version: '0.8',
        },
        format: { application: '', tags: [] },
        properties: {
          authors: [],
          ccliNo: '',
          comments: [],
          copyright: '',
          key: '',
          keywords: '',
          publisher: '',
          released: '',
          songBooks: [],
          tempo: '',
          tempoType: '',
          themes: [],
          titles: [{ lang: '', original: null, value: 'Amazing Grace' }],
          transposition: '',
          variant: '',
          verseOrder: '',
          version: '',
        },
        lyrics: [
          {
            name: 'v1',
            transliteration: '',
            lang: '',
            lines: [
              {
                content: [
                  {
                    type: 'text',
                    value: 'Amazing grace how sweet the sound\nthat saved a wretch like me;',
                  },
                ],
                part: '',
              },
            ],
          },
        ],
      } as ol.ISong);
    });

    it('should return a song for file: complex.xml"', () => {
      const testFile = readFileSync('./sample-files/examples/complex.xml').toString();

      expect(olParser.parse(testFile)).toEqual({
        meta: {
          createdIn: 'OpenLP 1.9.0',
          modifiedDate: new Date('2012-04-10T12:00:00.000Z'),
          modifiedIn: 'ChangingSong 0.0.1',
          version: '0.8',
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
          ccliNo: '4639462',
          copyright: 'public domain',
          comments: ['This is one of the most popular songs in our congregation.'],
          key: 'C#',
          keywords: 'something to help with more accurate results',
          publisher: 'Sparrow Records',
          released: '1779',
          songBooks: [
            { entry: '', name: 'Songbook without Number' },
            { entry: '48', name: 'Songbook with Number' },
            { entry: '153c', name: 'Songbook with Letters in Entry Name' },
          ],
          tempo: '90',
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
          transposition: '2',
          variant: 'Newsboys',
          verseOrder: 'v1 v2  v3 c v4 c1 c2 b b1 b2',
          version: '0.99',
        },
        lyrics: [
          {
            name: 'v1',
            transliteration: '',
            lang: 'en',
            lines: [
              {
                part: '',
                content: [
                  {
                    type: 'text',
                    value: 'Amazing grace how sweet the sound that saved a wretch like me;',
                  },
                ],
              },
              {
                part: 'women',
                content: [
                  {
                    type: 'text',
                    value: 'A b c\nD e f',
                  },
                ],
              },
            ],
          },
          {
            name: 'v1',
            transliteration: '',
            lang: 'de',
            lines: [
              {
                part: '',
                content: [
                  {
                    name: 'B',
                    type: 'chord',
                  },
                  {
                    type: 'text',
                    value: 'Erstaunliche Ahmut, wie',
                  },
                ],
              },
            ],
          },
          {
            name: 'c',
            transliteration: '',
            lang: '',
            lines: [
              {
                part: '',
                content: [
                  {
                    type: 'comment',
                    value: 'any comment',
                  },
                  {
                    type: 'text',
                    value: '\nLine content.',
                  },
                ],
              },
            ],
          },
          {
            name: 'v2',
            transliteration: '',
            lang: 'en-US',
            lines: [
              {
                part: 'men',
                content: [
                  {
                    type: 'comment',
                    value: 'any text',
                  },
                  {
                    type: 'text',
                    value: '\nAmazing grace how sweet the sound that saved a wretch like me;\n',
                  },
                  {
                    type: 'comment',
                    value: 'any text',
                  },
                  {
                    type: 'text',
                    value: '\n',
                  },
                  {
                    name: 'D',
                    type: 'chord',
                  },
                  {
                    type: 'text',
                    value: 'Amazing grace how sweet ',
                  },
                  {
                    name: 'D',
                    type: 'chord',
                  },
                  {
                    type: 'text',
                    value: 'the sound that saved a wretch like me;',
                  },
                  {
                    name: 'B7',
                    type: 'chord',
                  },
                  {
                    type: 'text',
                    value: '\nAmazing grace',
                  },
                  {
                    name: 'G7',
                    type: 'chord',
                  },
                  {
                    type: 'text',
                    value: ' how sweet the sound that saved a wretch like me;',
                  },
                ],
              },
              {
                part: 'women',
                content: [
                  {
                    type: 'text',
                    value: 'A b c\n\nD e f',
                  },
                ],
              },
            ],
          },
          {
            name: 'emptyline',
            transliteration: '',
            lang: 'de',
            lines: [
              {
                part: '',
                content: [
                  {
                    type: 'text',
                    value: '\n',
                  },
                ],
              },
              {
                part: '',
                content: [
                  {
                    type: 'text',
                    value: '\n\n\n\n\n',
                  },
                ],
              },
            ],
          },
          {
            name: 'e',
            transliteration: '',
            lang: 'de',
            lines: [
              {
                part: '',
                content: [
                  {
                    type: 'text',
                    value: 'This is text of ending.',
                  },
                ],
              },
            ],
          },
        ],
      } as ol.ISong);
    });

    it('should return a song with format tags for file: format.xml"', () => {
      const testFile = readFileSync('./sample-files/examples/format.xml').toString();

      expect(olParser.parse(testFile)).toEqual({
        meta: {
          createdIn: 'OpenLP 1.9.0',
          modifiedDate: new Date('2012-04-10T12:00:00.000Z'),
          modifiedIn: 'OpenLP 1.9.7',
          version: '0.8',
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
          ccliNo: '',
          comments: [],
          copyright: '',
          key: '',
          keywords: '',
          publisher: '',
          released: '',
          songBooks: [],
          tempo: '',
          tempoType: '',
          themes: [],
          titles: [{ lang: '', original: null, value: 'Amazing Grace' }],
          transposition: '',
          variant: '',
          verseOrder: '',
          version: '',
        },
        lyrics: [
          {
            name: 'v1',
            transliteration: '',
            lang: '',
            lines: [
              {
                content: [
                  { type: 'text', value: 'Amazing ' },
                  { type: 'tag', name: 'red', value: 'grace!' },
                  { type: 'text', value: ' How sweet the sound\nThat saved a wretch ' },
                  { type: 'tag', name: 'strong', value: 'like' },
                  { type: 'text', value: 'me.' },
                ],
                part: '',
              },
              {
                content: [
                  {
                    type: 'text',
                    value: 'I once was lost, but now am found,\nWas blind but now I see.',
                  },
                ],
                part: '',
              },
            ],
          },
        ],
      } as ol.ISong);
    });

    fit('should return a song with format tags for file: format2.xml"', () => {
      const testFile = readFileSync('./sample-files/examples/format2.xml').toString();

      expect(olParser.parse(testFile)).toEqual({
        meta: {
          createdIn: 'OpenLP 1.9.7',
          modifiedDate: new Date('2012-04-10T12:00:00.000Z'),
          modifiedIn: 'OpenLP 1.9.7',
          version: '0.8',
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
          ccliNo: '',
          comments: [],
          copyright: '',
          key: '',
          keywords: '',
          publisher: '',
          released: '',
          songBooks: [{ entry: '', name: 'Jistebnický kancionál' }],
          tempo: '',
          tempoType: '',
          themes: [],
          titles: [{ lang: '', original: null, value: 'Jezu Kriste, štědrý kněže' }],
          transposition: '',
          variant: '',
          verseOrder: '',
          version: '',
        },
        lyrics: [
          {
            name: 'v1',
            transliteration: '',
            lang: '',
            lines: [
              {
                content: [
                  { type: 'tag', name: 'r', value: 'Jezu Kriste' },
                  { type: 'text', value: ', štědrý kněže,\ns ' },
                  { type: 'tag', name: 'bl', value: 'Otcem, Duchem' },
                  { type: 'text', value: ' jeden ' },
                  { type: 'tag', name: 'y', value: 'Bože' },
                  { type: 'text', value: ',\nštědrost Tvá je naše zboží,\nz ' },
                  { type: 'tag', name: 'o', value: '' },
                  { type: 'tag', name: 'it', value: 'milosti' },
                  { type: 'text', value: '.' },
                ],
                part: '',
              },
            ],
          },
          {
            name: 'v2',
            transliteration: '',
            lang: '',
            lines: [
              {
                content: [
                  { type: 'tag', name: 'bl', value: 'Ty' },
                  {
                    type: 'text',
                    value:
                      ' jsi v světě, bydlil s námi,\nTvé tělo trpělo rány\nza nás za hříšné křesťany,\nz ',
                  },
                  { type: 'tag', name: 'bl', value: 'Tvé' },
                  { type: 'text', value: ' milosti.' },
                ],
                part: '',
              },
            ],
          },
          {
            name: 'v3',
            transliteration: '',
            lang: '',
            lines: [
              {
                content: [
                  { type: 'text', value: 'Ó, ' },
                  { type: 'tag', name: 'g', value: 'Tvá dobroto' },
                  {
                    type: 'text',
                    value: ' důstojná\na k nám milosti přehojná!\nDáváš nám bohatství mnohá\n',
                  },
                  { type: 'tag', name: 'st', value: '' },
                ],
                part: '',
              },
            ],
          },
          {
            name: 'v4',
            transliteration: '',
            lang: '',
            lines: [
              {
                content: [
                  { type: 'text', value: 'Ráčils nás sám zastoupiti,\n' },
                  { type: 'tag', name: 'it', value: 'život za nás položiti,' },
                  { type: 'text', value: '\ntak smrt věčnou zahladiti,\nz Tvé milosti.' },
                ],
                part: '',
              },
            ],
          },
          {
            name: 'v5',
            transliteration: '',
            lang: '',
            lines: [
              {
                content: [
                  { type: 'tag', name: 'st', value: 'Ó,' },
                  { type: 'text', value: ', z bludů</tag> vstaňme,\ndané dobro nám poznejme,\nk ' },
                  { type: 'tag', name: 'aq', value: 'Synu Božímu' },
                  { type: 'text', value: ' chvátejme,\nk té milosti!' },
                ],
                part: '',
              },
            ],
          },
          {
            name: 'v6',
            transliteration: '',
            lang: '',
            lines: [
              {
                content: [
                  { type: 'text', value: 'Chvála' },
                  { type: 'tag', name: 'br', value: '' },
                  { type: 'text', value: 'budiž' },
                  { type: 'tag', name: 'br', value: '' },
                  { type: 'text', value: 'Bohu' },
                  { type: 'tag', name: 'br', value: '' },

                  { type: 'text', value: 'Otci,\n' },
                  {
                    name: 'st',
                    type: 'tag',
                    value:
                      'Synu jeho téže moci,\nDuchu jeho rovné moci,\nz též milosti!',
                  },
                ],
                part: '',
              },
            ],
          },
        ],
      } as ol.ISong);
    });
  });
});
