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
      const parsedSong = olParser.parse(testFile);

      expect(parsedSong.meta).toEqual<ol.IMeta>({
        createdIn: 'OpenLP 1.9.0',
        modifiedDate: new Date('2012-04-10T12:00:00.000Z'),
        modifiedIn: 'MyApp 0.0.1',
        version: '0.8',
      });
      expect(parsedSong.format).toEqual<ol.IFormat>({ application: '', tags: [] });
      expect(parsedSong.properties).toEqual<ol.IProperties>({
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
      });
      expect(parsedSong.verses).toEqual<ol.IVerse[]>([
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
      ]);
      expect(parsedSong.instruments).toEqual<ol.ILyricSectionInstrument[]>([]);
    });

    it('should return a song for file: complex.xml"', () => {
      const testFile = readFileSync('./sample-files/examples/complex.xml').toString();
      const parsedSong = olParser.parse(testFile);

      expect(parsedSong.meta).toEqual<ol.IMeta>({
        createdIn: 'OpenLP 1.9.0',
        modifiedDate: new Date('2012-04-10T12:00:00.000Z'),
        modifiedIn: 'ChangingSong 0.0.1',
        version: '0.8',
      });
      expect(parsedSong.format).toEqual<ol.IFormat>({ application: '', tags: [] });
      expect(parsedSong.properties).toEqual<ol.IProperties>({
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
      });
      expect(parsedSong.verses).toEqual<ol.IVerse[]>([
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
              content: [{ type: 'text', value: 'A b c\nD e f' }],
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
                { name: 'B', type: 'chord' },
                { type: 'text', value: 'Erstaunliche Ahmut, wie' },
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
                { type: 'comment', value: 'any comment' },
                { type: 'text', value: '\nLine content.' },
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
                { type: 'comment', value: 'any text' },
                {
                  type: 'text',
                  value: '\nAmazing grace how sweet the sound that saved a wretch like me;\n',
                },
                { type: 'comment', value: 'any text' },
                { type: 'text', value: '\n' },
                { name: 'D', type: 'chord' },
                { type: 'text', value: 'Amazing grace how sweet ' },
                { name: 'D', type: 'chord' },
                { type: 'text', value: 'the sound that saved a wretch like me;' },
                { name: 'B7', type: 'chord' },
                { type: 'text', value: '\nAmazing grace' },
                { name: 'G7', type: 'chord' },
                { type: 'text', value: ' how sweet the sound that saved a wretch like me;' },
              ],
            },
            {
              part: 'women',
              content: [{ type: 'text', value: 'A b c\n\nD e f' }],
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
              content: [{ type: 'text', value: '\n' }],
            },
            {
              part: '',
              content: [{ type: 'text', value: '\n\n\n\n\n' }],
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
              content: [{ type: 'text', value: 'This is text of ending.' }],
            },
          ],
        },
      ]);
      expect(parsedSong.instruments).toEqual<ol.ILyricSectionInstrument[]>([]);
    });

    it('should return a song with format tags for file: format.xml"', () => {
      const testFile = readFileSync('./sample-files/examples/format.xml').toString();
      const parsedSong = olParser.parse(testFile);

      expect(parsedSong.meta).toEqual<ol.IMeta>({
        createdIn: 'OpenLP 1.9.0',
        modifiedDate: new Date('2012-04-10T12:00:00.000Z'),
        modifiedIn: 'OpenLP 1.9.7',
        version: '0.8',
      });
      expect(parsedSong.format).toEqual<ol.IFormat>({
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
      });
      expect(parsedSong.properties).toEqual<ol.IProperties>({
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
      });
      expect(parsedSong.verses).toEqual<ol.IVerse[]>([
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
      ]);
      expect(parsedSong.instruments).toEqual<ol.ILyricSectionInstrument[]>([]);
    });

    it('should return a song with format tags for file: format2.xml"', () => {
      const testFile = readFileSync('./sample-files/examples/format2.xml').toString();
      const parsedSong = olParser.parse(testFile);

      expect(parsedSong.meta).toEqual<ol.IMeta>({
        createdIn: 'OpenLP 1.9.7',
        modifiedDate: new Date('2012-04-10T12:00:00.000Z'),
        modifiedIn: 'OpenLP 1.9.7',
        version: '0.8',
      });
      expect(parsedSong.format).toEqual<ol.IFormat>({
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
      });
      expect(parsedSong.properties).toEqual<ol.IProperties>({
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
      });
      expect(parsedSong.verses).toEqual<ol.IVerse[]>([
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
                {
                  type: 'text',
                  value: ', z bludů</tag> vstaňme,\ndané dobro nám poznejme,\nk ',
                },
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
      ]);
      expect(parsedSong.instruments).toEqual<ol.ILyricSectionInstrument[]>([]);
    });

    it('should return a song with instrument tags in the lyrics for file: laboratory.xml"', () => {
      const testFile = readFileSync('./sample-files/examples/laboratory.xml').toString();
      const parsedSong = olParser.parse(testFile);

      expect(parsedSong.meta).toEqual<ol.IMeta>({
        createdIn: '',
        modifiedDate: null,
        modifiedIn: '',
        version: '0.9',
      });
      expect(parsedSong.format).toEqual<ol.IFormat>({
        application: '',
        tags: [],
      });
      expect(parsedSong.properties).toEqual<ol.IProperties>({
        authors: [{ lang: '', type: '', value: 'Gellért Gyuris' }],
        ccliNo: '',
        comments: [],
        copyright: '',
        key: '',
        keywords: '',
        publisher: '',
        released: '',
        songBooks: [{ entry: '1', name: 'Test book' }],
        tempo: '',
        tempoType: '',
        themes: [],
        titles: [{ lang: '', original: null, value: 'Laboratory rat' }],
        transposition: '',
        variant: '',
        verseOrder: 'i v1 v2',
        version: '',
      });
      expect(parsedSong.verses).toEqual<ol.IVerse[]>([
        {
          lang: '',
          lines: [
            {
              content: [
                { type: 'text', value: '\n        ' },
                {
                  type: 'comment',
                  value: 'normal 0.9-style chords mixed: <chord>text</chord> <chord/>text',
                },
                { type: 'text', value: '\n        ' },
                { value: 'Lorem', root: 'D', type: 'chord', upbeat: 'true' },
                { type: 'text', value: ' ' },
                {
                  value: 'ipsum',
                  bass: 'C#',
                  root: 'E',
                  structure: 'm3-5-7-9-a11-13',
                  type: 'chord',
                },
                { type: 'text', value: ' ' },
                {
                  value: 'dolor sit amet,',
                  bass: 'C#',
                  root: 'D',
                  structure: 'sus2',
                  type: 'chord',
                },
                { type: 'text', value: '\n        consectetur ' },
                {
                  value: 'adipiscing elit',
                  root: 'B',
                  structure: 'min7',
                  type: 'chord',
                  upbeat: 'true',
                },
                { type: 'text', value: '. ' },
                { value: 'Maecenas turpis', root: 'G', type: 'chord' },
                { type: 'text', value: ' ' },
                { value: 'tor', bass: 'F#', root: 'D', structure: '3-5', type: 'chord' },
                { value: 'tor,', bass: 'B', root: 'F', type: 'chord' },
                { type: 'text', value: '\n        ' },
                { value: 'tempor', bass: 'F#', root: 'D', type: 'chord', upbeat: 'true' },
                { type: 'text', value: ' ' },
                { value: 'eget lacinia', bass: 'C#', root: 'D', structure: 'sus2', type: 'chord' },
                { type: 'text', value: ' ' },
                { value: 'quis', root: 'G', structure: 'sus2', type: 'chord' },
                { type: 'text', value: '. ' },
                { root: 'C', type: 'chord' },
                { root: 'G', type: 'chord' },
                { root: 'D', type: 'chord' },
                { type: 'text', value: '\n      ' },
              ],
              part: '',
            },
          ],
          name: 'v1',
          transliteration: '',
        },
        {
          lang: '',
          lines: [
            {
              content: [
                { type: 'text', value: '\n        ' },
                { type: 'comment', value: 'only empty chords in 0.9: <chord/>text' },
                { type: 'text', value: '\n        ' },
                { bass: 'B', root: 'G', type: 'chord' },
                { type: 'text', value: 'Accumsan ' },
                { root: 'A', structure: 'sus2', type: 'chord' },
                { type: 'text', value: 'eget neque.\n        ' },
                { bass: 'C#', root: 'A', structure: 'sus2', type: 'chord' },
                { type: 'text', value: 'Vestibulum ' },
                { root: 'D', type: 'chord' },
                { type: 'text', value: 'facilisis lacus non feugiat pulvinar. ' },
                { root: 'A', structure: 'sus2', type: 'chord' },
                { type: 'text', value: '\n        ' },
                { root: 'D', type: 'chord' },
                { type: 'text', value: 'Cras nulla leo, ' },
                { root: 'G#', type: 'chord' },
                { type: 'text', value: 'placerat a ' },
                { root: 'B', type: 'chord' },
                { type: 'text', value: 'bibendum ac, ' },
                { root: 'F', type: 'chord' },
                {
                  type: 'text',
                  value:
                    'efficitur vel dolor.\n        Praesent rhoncus turpis at libero faucibus euismod.\n        Nulla congue fringilla nisi in auctor.\n        Pellentesque laoreet arcu eu justo aliquam,\n        nec suscipit eros imperdiet. Nunc vel iaculis elit.\n      ',
                },
              ],
              part: '',
            },
          ],
          name: 'v2',
          transliteration: '',
        },
      ]);
      expect(parsedSong.instruments).toEqual<ol.ILyricSectionInstrument[]>([
        {
          lines: [
            {
              content: [
                {
                  chords: [
                    { root: 'D', type: 'chord' },
                    { root: 'D', structure: 'sus4', type: 'chord' },
                  ],
                  type: 'beat',
                },
                {
                  chords: [
                    { root: 'D', type: 'chord' },
                    { root: 'D', structure: 'sus4', type: 'chord' },
                  ],
                  type: 'beat',
                },
                {
                  chords: [
                    { root: 'G', type: 'chord' },
                    { root: 'A', type: 'chord' },
                  ],
                  type: 'beat',
                },
                { root: 'D', type: 'chord' },
                { root: 'D', structure: 'sus4', type: 'chord' },
              ],
              part: '',
            },
          ],
          name: 'i',
        },
      ]);
    });

    it('should return a song for file: test0.9.xml"', () => {
      const testFile = readFileSync('./sample-files/examples/test0.9.xml').toString();
      const parsedSong = olParser.parse(testFile);

      expect(parsedSong.meta).toEqual<ol.IMeta>({
        createdIn: '',
        modifiedDate: null,
        modifiedIn: '',
        version: '0.9',
      });
      expect(parsedSong.format).toEqual<ol.IFormat>({
        application: '',
        tags: [],
      });
      expect(parsedSong.properties).toEqual<ol.IProperties>({
        authors: [
          { lang: '', type: '', value: 'Csiszér László' },
          { lang: '', type: 'words', value: 'Flach Ferenc' },
          { lang: '', type: 'music', value: 'Flach Ferenc' },
          { lang: '', type: 'translation', value: 'Majoros Ildikó' },
          { lang: '', type: 'arrangement', value: 'Gellért Gyuris' },
        ],
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
        titles: [{ lang: '', original: null, value: 'Testing 0.9' }],
        transposition: '',
        variant: '',
        verseOrder: 'i v1',
        version: '',
      });
      expect(parsedSong.verses).toEqual<ol.IVerse[]>([
        {
          lang: '',
          lines: [
            {
              content: [{ type: 'text', value: '\n        Testing 0.9.\n      ' }],
              part: '',
            },
          ],
          name: 'v1',
          transliteration: '',
        },
      ]);
      expect(parsedSong.instruments).toEqual<ol.ILyricSectionInstrument[]>([
        {
          lines: [
            {
              content: [
                {
                  chords: [
                    { root: 'C', structure: 'power', type: 'chord' },
                    { root: 'C', type: 'chord' },
                    { root: 'C', structure: 'min', type: 'chord' },
                    { root: 'C', structure: 'aug', type: 'chord' },
                    { root: 'C', structure: 'dim', type: 'chord' },
                    { root: 'C', structure: 'dom7', type: 'chord' },
                    { root: 'C', structure: 'maj7', type: 'chord' },
                    { root: 'C', structure: 'min7', type: 'chord' },
                    { root: 'C', structure: 'dim7', type: 'chord' },
                    { root: 'C', structure: 'halfdim7', type: 'chord' },
                    { root: 'C', structure: 'minmaj7', type: 'chord' },
                    { root: 'C', structure: 'augmaj7', type: 'chord' },
                    { root: 'C', structure: 'aug7', type: 'chord' },
                    { root: 'C', structure: 'maj6', type: 'chord' },
                    { root: 'C', structure: 'maj6b', type: 'chord' },
                    { root: 'C', structure: 'min6', type: 'chord' },
                    { root: 'C', structure: 'min6b', type: 'chord' },
                    { root: 'C', structure: 'dom9', type: 'chord' },
                    { root: 'C', structure: 'dom9b', type: 'chord' },
                    { root: 'C', structure: 'maj9', type: 'chord' },
                    { root: 'C', structure: 'min9', type: 'chord' },
                    { root: 'C', structure: 'minmaj9', type: 'chord' },
                    { root: 'C', structure: 'aug9', type: 'chord' },
                    { root: 'C', structure: 'halfdim9', type: 'chord' },
                    { root: 'C', structure: 'sus4', type: 'chord' },
                    { root: 'C', structure: 'sus2', type: 'chord' },
                    { root: 'C', structure: 'add9', type: 'chord' },
                  ],
                  type: 'beat',
                },
                {
                  chords: [
                    { root: 'C', structure: '5', type: 'chord' },
                    { root: 'C', structure: '3-5', type: 'chord' },
                    { root: 'C', structure: 'm3-5', type: 'chord' },
                    { root: 'C', structure: '3-a5', type: 'chord' },
                    { root: 'C', structure: 'm3-d5', type: 'chord' },
                    { root: 'C', structure: '3-5-m7', type: 'chord' },
                    { root: 'C', structure: '3-5-7', type: 'chord' },
                    { root: 'C', structure: 'm3-5-m7', type: 'chord' },
                    { root: 'C', structure: 'm3-d5-d7', type: 'chord' },
                    { root: 'C', structure: 'm3-d5-m7', type: 'chord' },
                    { root: 'C', structure: 'm3-5-7', type: 'chord' },
                    { root: 'C', structure: '3-a5-7', type: 'chord' },
                    { root: 'C', structure: '3-d5-m7', type: 'chord' },
                    { root: 'C', structure: '3-a5-m7', type: 'chord' },
                    { root: 'C', structure: 'm3-d5-7', type: 'chord' },
                    { root: 'C', structure: '3-d5-7', type: 'chord' },
                    { root: 'C', structure: '3-5-6', type: 'chord' },
                    { root: 'C', structure: '3-5-m6', type: 'chord' },
                    { root: 'C', structure: 'm3-5-6', type: 'chord' },
                    { root: 'C', structure: 'm3-5-m6', type: 'chord' },
                    { root: 'C', structure: '3-5-m7-9', type: 'chord' },
                    { root: 'C', structure: '3-5-m7-m9', type: 'chord' },
                    { root: 'C', structure: '3-5-7-9', type: 'chord' },
                    { root: 'C', structure: 'm3-5-m7-9', type: 'chord' },
                    { root: 'C', structure: 'm3-5-7-9', type: 'chord' },
                    { root: 'C', structure: '3-a5-7-9', type: 'chord' },
                    { root: 'C', structure: '3-a5-m7-9', type: 'chord' },
                    { root: 'C', structure: 'm3-d5-m7-9', type: 'chord' },
                    { root: 'C', structure: 'm3-d5-m7-m9', type: 'chord' },
                    { root: 'C', structure: 'm3-d5-d7-9', type: 'chord' },
                    { root: 'C', structure: 'm3-d5-d7-m9', type: 'chord' },
                    { root: 'C', structure: '3-5-m7-m10', type: 'chord' },
                    { root: 'C', structure: '3-5-m7-9-11', type: 'chord' },
                    { root: 'C', structure: '3-5-7-9-11', type: 'chord' },
                    { root: 'C', structure: 'm3-5-m7-9-11', type: 'chord' },
                    { root: 'C', structure: 'm3-5-7-9-11', type: 'chord' },
                    { root: 'C', structure: '3-5-m7-9-a11', type: 'chord' },
                    { root: 'C', structure: '3-5-7-9-a11', type: 'chord' },
                    { root: 'C', structure: 'm3-5-m7-9-a11', type: 'chord' },
                    { root: 'C', structure: 'm3-5-7-9-a11', type: 'chord' },
                    { root: 'C', structure: '3-a5-7-9-11', type: 'chord' },
                    { root: 'C', structure: '3-a5-m7-9-11', type: 'chord' },
                    { root: 'C', structure: 'm3-d5-m7-m9-11', type: 'chord' },
                    { root: 'C', structure: 'm3-d5-d7-m9-d11', type: 'chord' },
                    { root: 'C', structure: '3-5-m7-9-11-13', type: 'chord' },
                    { root: 'C', structure: '3-5-7-9-11-13', type: 'chord' },
                    { root: 'C', structure: 'm3-5-m7-9-11-13', type: 'chord' },
                    { root: 'C', structure: 'm3-5-7-9-11-13', type: 'chord' },
                    { root: 'C', structure: '3-5-m7-9-a11-13', type: 'chord' },
                    { root: 'C', structure: '3-5-7-9-a11-13', type: 'chord' },
                    { root: 'C', structure: 'm3-5-m7-9-a11-13', type: 'chord' },
                    { root: 'C', structure: 'm3-5-7-9-a11-13', type: 'chord' },
                    { root: 'C', structure: '3-a5-7-9-11-13', type: 'chord' },
                    { root: 'C', structure: '3-a5-m7-9-11-13', type: 'chord' },
                    { root: 'C', structure: 'm3-d5-m7-m9-11-13', type: 'chord' },
                    { root: 'C', structure: '4-5', type: 'chord' },
                    { root: 'C', structure: '2-5', type: 'chord' },
                    { root: 'C', structure: '3-5-m7-13', type: 'chord' },
                    { root: 'C', structure: '3-5-6-9', type: 'chord' },
                    { root: 'C', structure: '3-5-9', type: 'chord' },
                    { root: 'C', structure: 'm3-5-9', type: 'chord' },
                    { root: 'C', structure: '3-a5-9', type: 'chord' },
                    { root: 'C', structure: '4-5-6', type: 'chord' },
                    { root: 'C', structure: '2-5-6', type: 'chord' },
                    { root: 'C', structure: '4-5-m6', type: 'chord' },
                    { root: 'C', structure: '2-5-m6', type: 'chord' },
                    { root: 'C', structure: '4-5-m7', type: 'chord' },
                    { root: 'C', structure: '2-5-m7', type: 'chord' },
                    { root: 'C', structure: '4-5-7', type: 'chord' },
                    { root: 'C', structure: '2-5-7', type: 'chord' },
                    { root: 'C', structure: '4-a5-7', type: 'chord' },
                    { root: 'C', structure: '2-a5-7', type: 'chord' },
                    { root: 'C', structure: '4-d5-m7', type: 'chord' },
                    { root: 'C', structure: '2-d5-m7', type: 'chord' },
                    { root: 'C', structure: '4-d5-d7', type: 'chord' },
                    { root: 'C', structure: '2-d5-d7', type: 'chord' },
                    { root: 'C', structure: '4-d5-7', type: 'chord' },
                    { root: 'C', structure: '2-d5-7', type: 'chord' },
                    { root: 'C', structure: '4-5-m7-13', type: 'chord' },
                    { root: 'C', structure: '2-5-m7-13', type: 'chord' },
                    { root: 'C', structure: '4-5-m7-9', type: 'chord' },
                    { root: 'C', structure: '4-5-m7-m9', type: 'chord' },
                    { root: 'C', structure: '4-5-7-9', type: 'chord' },
                    { root: 'C', structure: '4-a5-7-9', type: 'chord' },
                    { root: 'C', structure: '4-a5-m7-9', type: 'chord' },
                  ],
                  type: 'beat',
                },
              ],
              part: '',
            },
          ],
          name: 'i',
        },
      ]);
    });

    it('should return a song for file: version0.9.xml"', () => {
      const testFile = readFileSync('./sample-files/examples/version0.9.xml').toString();
      const parsedSong = olParser.parse(testFile);

      expect(parsedSong.meta).toEqual<ol.IMeta>({
        createdIn: '',
        modifiedDate: null,
        modifiedIn: '',
        version: '0.9',
      });
      expect(parsedSong.format).toEqual<ol.IFormat>({
        application: '',
        tags: [],
      });
      expect(parsedSong.properties).toEqual<ol.IProperties>({
        authors: [{ lang: '', type: '', value: 'ismeretlen' }],
        ccliNo: '',
        comments: [],
        copyright: '',
        key: '',
        keywords: '',
        publisher: '',
        released: '',
        songBooks: [{ entry: '166', name: 'Teszt könyv' }],
        tempo: '',
        tempoType: '',
        themes: [],
        titles: [{ lang: 'hu', original: null, value: 'A kapudat nyisd meg' }],
        transposition: '',
        variant: '',
        verseOrder: 'i v1',
        version: '',
      });
      expect(parsedSong.verses).toEqual<ol.IVerse[]>([
        {
          lang: '',
          lines: [
            {
              content: [
                {
                  type: 'text',
                  value:
                    '\n        A kapudat nyisd meg, Jézusnak nyisd meg, jön, közeledik.\n        A kapudat nyisd meg, Jézusnak nyisd meg, jön, közeledik.\n      ',
                },
              ],
              part: '',
            },
            {
              content: [
                {
                  type: 'text',
                  value: '\n        Nyisd meg, íme, jön, közeledik.\n      ',
                },
              ],
              part: '',
            },
          ],
          name: 'v1',
          transliteration: '',
        },
      ]);
      expect(parsedSong.instruments).toEqual<ol.ILyricSectionInstrument[]>([
        {
          lines: [
            {
              content: [
                {
                  chords: [
                    { root: 'B', structure: 'm3-5', type: 'chord' },
                    { bass: 'C#', root: 'A', type: 'chord' },
                  ],
                  type: 'beat',
                },
                {
                  chords: [{ root: 'D', type: 'chord' }],
                  type: 'beat',
                },
                {
                  chords: [{ root: 'A', type: 'chord' }],
                  type: 'beat',
                },
                {
                  chords: [{ root: 'G', type: 'chord' }],
                  type: 'beat',
                },
              ],
              part: '',
            },
          ],
          name: 'i',
        },
      ]);
    });
  });

  describe('Songs', () => {
    it('should return a song for file: A Mighty Fortress is Our God.xml"', () => {
      const testFile = readFileSync(
        './sample-files/songs/A Mighty Fortress is Our God.xml'
      ).toString();
      const parsedSong = olParser.parse(testFile);

      expect(parsedSong.meta).toEqual<ol.IMeta>({
        createdIn: 'opensong2openlyrics.py 0.3',
        modifiedDate: new Date('2012-04-10T21:31:48.233581'),
        modifiedIn: 'convert-schema.py',
        version: '0.9',
      });
      expect(parsedSong.format).toEqual<ol.IFormat>({
        application: '',
        tags: [],
      });
      expect(parsedSong.properties).toEqual<ol.IProperties>({
        authors: [{ lang: '', type: '', value: 'Martin Luther' }],
        ccliNo: '',
        comments: [],
        copyright: 'Public Domain',
        key: '',
        keywords: '',
        publisher: '',
        released: '',
        songBooks: [],
        tempo: '',
        tempoType: '',
        themes: [
          { lang: '', value: 'Assurance' },
          { lang: '', value: 'Trust' },
        ],
        titles: [{ lang: '', original: null, value: 'A Mighty Fortress is Our God' }],
        transposition: '3',
        variant: '',
        verseOrder: 'v1 v2 v3 v4',
        version: '',
      });
      expect(parsedSong.verses).toEqual<ol.IVerse[]>([
        {
          lang: '',
          lines: [
            {
              content: [
                { type: 'text', value: '\n        ' },
                { root: 'Bb', type: 'chord' },
                { type: 'text', value: 'A mighty ' },
                { root: 'F', type: 'chord' },
                { type: 'text', value: 'fortress ' },
                { root: 'Eb', type: 'chord' },
                { type: 'text', value: 'is our ' },
                { root: 'Bb', type: 'chord' },
                { type: 'text', value: 'God, a ' },
                { root: 'G', structure: 'min', type: 'chord' },
                { type: 'text', value: 'Bulwark ' },
                { root: 'Bb', type: 'chord' },
                { type: 'text', value: 'never ' },
                { root: 'Eb', type: 'chord' },
                { type: 'text', value: 'fa' },
                { root: 'F', type: 'chord' },
                { type: 'text', value: 'i' },
                { root: 'Bb', type: 'chord' },
                { type: 'text', value: 'ling;\n        ' },
                { root: 'Bb', type: 'chord' },
                { type: 'text', value: 'Our Helper ' },
                { root: 'F', type: 'chord' },
                { type: 'text', value: 'He a' },
                { root: 'Eb', type: 'chord' },
                { type: 'text', value: 'mid the ' },
                { root: 'Bb', type: 'chord' },
                { type: 'text', value: 'flood of ' },
                { root: 'G', structure: 'min', type: 'chord' },
                { type: 'text', value: 'mortal ' },
                { root: 'Bb', type: 'chord' },
                { type: 'text', value: 'ills pre' },
                { root: 'Eb', type: 'chord' },
                { type: 'text', value: 'va' },
                { root: 'F', type: 'chord' },
                { type: 'text', value: 'i' },
                { root: 'Bb', type: 'chord' },
                { type: 'text', value: 'ling;\n        For ' },
                { root: 'G', structure: 'min', type: 'chord' },
                { type: 'text', value: 'still our ' },
                { root: 'C', structure: 'sus4', type: 'chord' },
                { type: 'text', value: 'an' },
                { root: 'C', type: 'chord' },
                { type: 'text', value: 'cient ' },
                { root: 'F', type: 'chord' },
                { type: 'text', value: 'Foe doth ' },
                { root: 'Bb', type: 'chord' },
                { type: 'text', value: 'seek to ' },
                { root: 'Eb', type: 'chord' },
                { type: 'text', value: 'work us ' },
                { root: 'G', structure: 'min', type: 'chord' },
                { type: 'text', value: 'woe;\n        His ' },
                { root: 'G', structure: 'min', type: 'chord' },
                { type: 'text', value: 'craft and ' },
                { root: 'C', structure: 'sus4', type: 'chord' },
                { type: 'text', value: "pow'r " },
                { root: 'C', type: 'chord' },
                { type: 'text', value: 'are ' },
                { root: 'F', type: 'chord' },
                { type: 'text', value: 'great, and ' },
                { root: 'G', structure: 'min', type: 'chord' },
                { type: 'text', value: 'armed with ' },
                { root: 'C', structure: 'min', type: 'chord' },
                { type: 'text', value: 'cruel ' },
                { root: 'D', type: 'chord' },
                { type: 'text', value: 'hate,\n        On ' },
                { root: 'G', structure: 'min', type: 'chord' },
                { type: 'text', value: 'earth is ' },
                { root: 'Bb', type: 'chord' },
                { type: 'text', value: 'not his ' },
                { root: 'Eb', type: 'chord' },
                { type: 'text', value: 'e' },
                { root: 'F', type: 'chord' },
                { root: 'Bb', type: 'chord' },
                { type: 'text', value: 'qual.\n      ' },
              ],
              part: '',
            },
          ],
          name: 'v1',
          transliteration: '',
        },
        {
          lang: '',
          lines: [
            {
              content: [
                { type: 'text', value: '\n        ' },
                { root: 'Bb', type: 'chord' },
                { type: 'text', value: 'Did we in ' },
                { root: 'F', type: 'chord' },
                { type: 'text', value: 'our own ' },
                { root: 'Eb', type: 'chord' },
                { type: 'text', value: 'strength con' },
                { root: 'Bb', type: 'chord' },
                { type: 'text', value: 'fide, our ' },
                { root: 'G', structure: 'min', type: 'chord' },
                { type: 'text', value: 'striving ' },
                { root: 'Bb', type: 'chord' },
                { type: 'text', value: 'would be ' },
                { root: 'Eb', type: 'chord' },
                { type: 'text', value: 'lo' },
                { root: 'F', type: 'chord' },
                { root: 'Bb', type: 'chord' },
                { type: 'text', value: 'sing;\n        ' },
                { root: 'Bb', type: 'chord' },
                { type: 'text', value: 'Were not the ' },
                { root: 'F', type: 'chord' },
                { type: 'text', value: 'right Man ' },
                { root: 'Eb', type: 'chord' },
                { type: 'text', value: 'on our ' },
                { root: 'Bb', type: 'chord' },
                { type: 'text', value: 'side, the ' },
                { root: 'G', structure: 'min', type: 'chord' },
                { type: 'text', value: 'Man of ' },
                { root: 'Bb', type: 'chord' },
                { type: 'text', value: "God's own " },
                { root: 'Eb', type: 'chord' },
                { type: 'text', value: 'cho' },
                { root: 'F', type: 'chord' },
                { type: 'text', value: 'o' },
                { root: 'Bb', type: 'chord' },
                { type: 'text', value: 'sing;\n        Dost' },
                { root: 'G', structure: 'min', type: 'chord' },
                { type: 'text', value: ' ask who ' },
                { root: 'C', structure: 'sus4', type: 'chord' },
                { type: 'text', value: 'that ' },
                { root: 'C', type: 'chord' },
                { type: 'text', value: 'may ' },
                { root: 'F', type: 'chord' },
                { type: 'text', value: 'be: Christ ' },
                { root: 'Bb', type: 'chord' },
                { type: 'text', value: 'Jesus ' },
                { root: 'Eb', type: 'chord' },
                { type: 'text', value: 'it is ' },
                { root: 'G', structure: 'min', type: 'chord' },
                { type: 'text', value: 'He;\n        Lord ' },
                { root: 'G', structure: 'min', type: 'chord' },
                { type: 'text', value: 'Sabba' },
                { root: 'C', structure: 'sus4', type: 'chord' },
                { type: 'text', value: 'oth ' },
                { root: 'C', type: 'chord' },
                { type: 'text', value: 'His ' },
                { root: 'F', type: 'chord' },
                { type: 'text', value: 'name, from ' },
                { root: 'G', structure: 'min', type: 'chord' },
                { type: 'text', value: 'age to ' },
                { root: 'C', structure: 'min', type: 'chord' },
                { type: 'text', value: 'age the ' },
                { root: 'D', type: 'chord' },
                { type: 'text', value: 'same,\n        And ' },
                { root: 'G', structure: 'min', type: 'chord' },
                { type: 'text', value: 'He must ' },
                { root: 'Bb', type: 'chord' },
                { type: 'text', value: 'win the ' },
                { root: 'Eb', type: 'chord' },
                { type: 'text', value: 'bat' },
                { root: 'F', type: 'chord' },
                { root: 'Bb', type: 'chord' },
                { type: 'text', value: 'tle.\n      ' },
              ],
              part: '',
            },
          ],
          name: 'v2',
          transliteration: '',
        },
        {
          lang: '',
          lines: [
            {
              content: [
                { type: 'text', value: '\n        ' },
                { root: 'Bb', type: 'chord' },
                { type: 'text', value: 'And though this ' },
                { root: 'F', type: 'chord' },
                { type: 'text', value: 'world with ' },
                { root: 'Eb', type: 'chord' },
                { type: 'text', value: 'devils ' },
                { root: 'Bb', type: 'chord' },
                { type: 'text', value: 'filled should ' },
                { root: 'G', structure: 'min', type: 'chord' },
                { type: 'text', value: 'threaten ' },
                { root: 'Bb', type: 'chord' },
                { type: 'text', value: 'to un' },
                { root: 'Eb', type: 'chord' },
                { type: 'text', value: 'do ' },
                { root: 'F', type: 'chord' },
                { type: 'text', value: ' ' },
                { root: 'Bb', type: 'chord' },
                { type: 'text', value: 'us;\n        ' },
                { root: 'Bb', type: 'chord' },
                { type: 'text', value: 'We will not ' },
                { root: 'F', type: 'chord' },
                { type: 'text', value: 'fear for ' },
                { root: 'Eb', type: 'chord' },
                { type: 'text', value: 'God hath ' },
                { root: 'Bb', type: 'chord' },
                { type: 'text', value: 'willed His ' },
                { root: 'G', structure: 'min', type: 'chord' },
                { type: 'text', value: 'truth to ' },
                { root: 'Bb', type: 'chord' },
                { type: 'text', value: 'triumph ' },
                { root: 'Eb', type: 'chord' },
                { type: 'text', value: 'thr' },
                { root: 'F', type: 'chord' },
                { type: 'text', value: 'ough ' },
                { root: 'Bb', type: 'chord' },
                { type: 'text', value: 'us:\n        The ' },
                { root: 'G', structure: 'min', type: 'chord' },
                { type: 'text', value: 'prince of ' },
                { root: 'C', structure: 'sus4', type: 'chord' },
                { type: 'text', value: 'dark' },
                { root: 'C', type: 'chord' },
                { type: 'text', value: 'ness ' },
                { root: 'F', type: 'chord' },
                { type: 'text', value: 'grim, we ' },
                { root: 'Bb', type: 'chord' },
                { type: 'text', value: 'tremble ' },
                { root: 'Eb', type: 'chord' },
                { type: 'text', value: 'not for ' },
                { root: 'G', structure: 'min', type: 'chord' },
                { type: 'text', value: 'him;\n        His ' },
                { root: 'G', structure: 'min', type: 'chord' },
                { type: 'text', value: 'rage we ' },
                { root: 'C', structure: 'sus4', type: 'chord' },
                { type: 'text', value: 'can ' },
                { root: 'C', type: 'chord' },
                { type: 'text', value: 'en' },
                { root: 'F', type: 'chord' },
                { type: 'text', value: 'dure for ' },
                { root: 'G', structure: 'min', type: 'chord' },
                { type: 'text', value: 'lo, his ' },
                { root: 'C', structure: 'min', type: 'chord' },
                { type: 'text', value: 'doom is ' },
                { root: 'D', type: 'chord' },
                { type: 'text', value: 'sure,\n        One ' },
                { root: 'G', structure: 'min', type: 'chord' },
                { type: 'text', value: 'little ' },
                { root: 'Bb', type: 'chord' },
                { type: 'text', value: 'word shall ' },
                { root: 'Eb', type: 'chord' },
                { type: 'text', value: 'fel' },
                { root: 'F', type: 'chord' },
                { type: 'text', value: 'l ' },
                { root: 'Bb', type: 'chord' },
                { type: 'text', value: 'him.\n      ' },
              ],
              part: '',
            },
          ],
          name: 'v3',
          transliteration: '',
        },
        {
          lang: '',
          lines: [
            {
              content: [
                { type: 'text', value: '\n        ' },
                { root: 'Bb', type: 'chord' },
                { type: 'text', value: 'That Word a' },
                { root: 'F', type: 'chord' },
                { type: 'text', value: 'bove all ' },
                { root: 'Eb', type: 'chord' },
                { type: 'text', value: 'earthly ' },
                { root: 'Bb', type: 'chord' },
                { type: 'text', value: "pow'r, no " },
                { root: 'G', structure: 'min', type: 'chord' },
                { type: 'text', value: 'thanks to ' },
                { root: 'Bb', type: 'chord' },
                { type: 'text', value: 'them a' },
                { root: 'Eb', type: 'chord' },
                { type: 'text', value: 'bid' },
                { root: 'F', type: 'chord' },
                { root: 'Bb', type: 'chord' },
                { type: 'text', value: 'eth;\n        ' },
                { root: 'Bb', type: 'chord' },
                { type: 'text', value: 'The Spirit ' },
                { root: 'F', type: 'chord' },
                { type: 'text', value: 'and the ' },
                { root: 'Eb', type: 'chord' },
                { type: 'text', value: 'gifts are ' },
                { root: 'Bb', type: 'chord' },
                { type: 'text', value: 'ours through ' },
                { root: 'G', structure: 'min', type: 'chord' },
                { type: 'text', value: 'Him who ' },
                { root: 'Bb', type: 'chord' },
                { type: 'text', value: 'with us ' },
                { root: 'Eb', type: 'chord' },
                { type: 'text', value: 'si' },
                { root: 'F', type: 'chord' },
                { root: 'Bb', type: 'chord' },
                { type: 'text', value: 'deth;\n        Let ' },
                { root: 'G', structure: 'min', type: 'chord' },
                { type: 'text', value: 'goods and ' },
                { root: 'C', structure: 'sus4', type: 'chord' },
                { type: 'text', value: 'kin' },
                { root: 'C', type: 'chord' },
                { type: 'text', value: 'dred ' },
                { root: 'F', type: 'chord' },
                { type: 'text', value: 'go, this ' },
                { root: 'Bb', type: 'chord' },
                { type: 'text', value: 'mortal ' },
                { root: 'Eb', type: 'chord' },
                { type: 'text', value: 'life al' },
                { root: 'G', structure: 'min', type: 'chord' },
                { type: 'text', value: 'so;\n        The ' },
                { root: 'G', structure: 'min', type: 'chord' },
                { type: 'text', value: 'body ' },
                { root: 'C', structure: 'sus4', type: 'chord' },
                { type: 'text', value: 'they ' },
                { root: 'C', type: 'chord' },
                { type: 'text', value: 'may ' },
                { root: 'F', type: 'chord' },
                { type: 'text', value: "kill; God's " },
                { root: 'G', structure: 'min', type: 'chord' },
                { type: 'text', value: 'truth a' },
                { root: 'C', structure: 'min', type: 'chord' },
                { type: 'text', value: 'bideth ' },
                { root: 'D', type: 'chord' },
                { type: 'text', value: 'still,\n        His ' },
                { root: 'G', structure: 'min', type: 'chord' },
                { type: 'text', value: 'kingdom ' },
                { root: 'Bb', type: 'chord' },
                { type: 'text', value: 'is for' },
                { root: 'Eb', type: 'chord' },
                { type: 'text', value: 'e' },
                { root: 'F', type: 'chord' },
                { root: 'Bb', type: 'chord' },
                { type: 'text', value: 'ver!\n      ' },
              ],
              part: '',
            },
          ],
          name: 'v4',
          transliteration: '',
        },
      ]);
      expect(parsedSong.instruments).toEqual<ol.ILyricSectionInstrument[]>([]);
    });

    it('should return a song for the HEBREW file: Hava Nagila.xml"', () => {
      const testFile = readFileSync('./sample-files/songs/Hava Nagila.xml').toString();
      const parsedSong = olParser.parse(testFile);

      expect(parsedSong.meta).toEqual<ol.IMeta>({
        createdIn: 'Trac 0.11.2',
        modifiedDate: new Date('2012-04-10T21:31:49.006882'),
        modifiedIn: 'convert-schema.py',
        version: '0.9',
      });
      expect(parsedSong.format).toEqual<ol.IFormat>({
        application: '',
        tags: [],
      });
      expect(parsedSong.properties).toEqual<ol.IProperties>({
        authors: [],
        ccliNo: '',
        comments: [],
        copyright: 'public domain',
        key: '',
        keywords: '',
        publisher: '',
        released: '',
        songBooks: [],
        tempo: '',
        tempoType: '',
        themes: [
          { lang: 'he', value: 'הבה נגילה' },
          { lang: 'he', value: 'Hava Nagila' },
          { lang: 'en', value: 'Rejoice' },
        ],
        titles: [
          { lang: 'he', original: null, value: 'הבה נגילה' },
          { lang: 'he', original: null, value: 'Hava Nagila' },
          { lang: 'he', original: null, value: 'Hava naguila' },
          { lang: 'en', original: null, value: 'Let Us Rejoice' },
          { lang: 'fr', original: null, value: 'Réjouissons-nous' },
        ],
        transposition: '',
        variant: 'Hebrew folk song',
        verseOrder: '',
        version: '',
      });

      //NOTE: The below Hebrew characters have an invisible control
      //  character to switch the text direction to RTL!!!
      //  Had to use string template quotes to work around this in testing
      expect(parsedSong.verses).toEqual<ol.IVerse[]>([
        {
          lang: 'he',
          lines: [
            {
              content: [
                {
                  type: 'text',
                  value: `
        הבה נגילה
        הבה נגילה
        הבה נגילה ונשמחה
      `,
                },
              ],
              part: '',
            },
          ],
          name: 'v1',
          transliteration: '',
        },
        {
          lang: 'he',
          lines: [
            {
              content: [
                {
                  type: 'text',
                  value:
                    "\n        Hava nagila\n        Hava nagila\n        Hava nagila vi nis'mecha\n      ",
                },
              ],
              part: '',
            },
          ],
          name: 'v1',
          transliteration: 'en',
        },
        {
          lang: 'en',
          lines: [
            {
              content: [
                {
                  type: 'text',
                  value:
                    "\n        Let's rejoice\n        Let's rejoice\n        Let's rejoice and be happy\n      ",
                },
              ],
              part: '',
            },
          ],
          name: 'v1',
          transliteration: '',
        },
        {
          lang: 'he',
          lines: [
            {
              content: [
                {
                  type: 'text',
                  value: `
        הבה נרננה
        הבה נרננה
        הבה נרננה ונשמחה
      `,
                },
              ],
              part: '',
            },
          ],
          name: 'c',
          transliteration: '',
        },
        {
          lang: 'he',
          lines: [
            {
              content: [
                {
                  type: 'text',
                  value:
                    "\n        Hava neranenah\n        Hava neranenah\n        Hava neranenah vi nis'mecha\n      ",
                },
              ],
              part: '',
            },
          ],
          name: 'c',
          transliteration: 'en',
        },
        {
          lang: 'en',
          lines: [
            {
              content: [
                {
                  type: 'text',
                  value:
                    "\n        Let's sing\n        Let's sing\n        Let's sing and be happy\n      ",
                },
              ],
              part: '',
            },
          ],
          name: 'c',
          transliteration: '',
        },
        {
          lang: 'he',
          lines: [
            {
              content: [
                {
                  type: 'text',
                  value: `
        !עורו, עורו אחים
        עורו אחים בלב שמח
        !עורו אחים, עורו אחים
        בלב שמח
      `,
                },
              ],
              part: '',
            },
          ],
          name: 'b',
          transliteration: '',
        },
        {
          lang: 'he',
          lines: [
            {
              content: [
                {
                  type: 'text',
                  value:
                    "\n        Uru, uru achim!\n        Uru achim b'lev sameach\n\n        Uru achim, uru achim!\n        B'lev sameach\n      ",
                },
              ],
              part: '',
            },
          ],
          name: 'b',
          transliteration: 'en',
        },
        {
          lang: 'en',
          lines: [
            {
              content: [
                {
                  type: 'text',
                  value:
                    '\n        Awake, awake, brothers!\n        Awake brothers with a happy heart\n        Awake, brothers, awake, brothers!\n        With a happy heart\n      ',
                },
              ],
              part: '',
            },
          ],
          name: 'b',
          transliteration: '',
        },
      ]);
      expect(parsedSong.instruments).toEqual<ol.ILyricSectionInstrument[]>([]);
    });
  });

  // it('should return a song for file: XXX.xml"', () => {
  //   const testFile = readFileSync('./sample-files/songs/XXX.xml').toString();
  //   const parsedSong = olParser.parse(testFile);

  //   expect(parsedSong.meta).toEqual<ol.IMeta>({
  //     createdIn: '',
  //     modifiedDate: new Date('2012-04-10T21:31:48.233581'),
  //     modifiedIn: 'convert-schema.py',
  //     version: '0.9',
  //   });
  //   expect(parsedSong.format).toEqual<ol.IFormat>({
  //     application: '',
  //     tags: [],
  //   });
  //   expect(parsedSong.properties).toEqual<ol.IProperties>({
  //     authors: [],
  //     ccliNo: '',
  //     comments: [],
  //     copyright: '',
  //     key: '',
  //     keywords: '',
  //     publisher: '',
  //     released: '',
  //     songBooks: [],
  //     tempo: '',
  //     tempoType: '',
  //     themes: [],
  //     titles: [],
  //     transposition: '',
  //     variant: '',
  //     verseOrder: '',
  //     version: '',
  //   });
  //   expect(parsedSong.verses).toEqual<ol.IVerse[]>([]);
  //   expect(parsedSong.instruments).toEqual<ol.ILyricSectionInstrument[]>([]);
  // });
});
