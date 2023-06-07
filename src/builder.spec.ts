import { INewOpenLyricsSong } from './builder.model';
import { OpenLyricsBuilder } from '.';

//NOTE:
// This test file will test the `OpenLyricsBuilder` method on the `index.ts` file
// It does not directly test anything in `builder.ts` even though the name of this file
// might seem to indicate otherwise

function normalizeModifiedDate(xmlStr: string): string {
  return xmlStr.replace(/modifiedDate=".+?"/, 'modifiedDate="2023-01-01T01:01:01"');
}

function normalizeExpected(opts: INewOpenLyricsSong.IOptions, xmlStr: string): string {
  const pkgNameAndVersion = `${process.env.npm_package_name} ${process.env.npm_package_version}`;
  if (opts.meta?.createdIn == null) {
    //No `createdIn` option provided, so let's replace this value with the current version number
    // of ths package so that future updates don't break tests
    xmlStr = xmlStr.replace(/createdIn=".+?"/, `createdIn="${pkgNameAndVersion}"`);
  }

  if (opts.meta?.modifiedIn == null) {
    //No `modifiedIn` option provided, so let's replace this value with the current version number
    // of ths package so that future updates don't break tests
    xmlStr = xmlStr.replace(/modifiedIn=".+?"/, `modifiedIn="${pkgNameAndVersion}"`);
  }

  return normalizeModifiedDate(xmlStr);
}

describe('OpenLyricsBuilder', (): void => {
  it('should exist', () => {
    expect(OpenLyricsBuilder).toBeDefined();
  });

  describe('Meta', () => {
    it('should set the meta properties on the <song> element', () => {
      const opts: INewOpenLyricsSong.IOptions = {
        meta: {
          chordNotation: 'hungarian',
          lang: 'hu',
          createdIn: 'my fake app 2.0',
          modifiedIn: 'my computer',
        },
        properties: {
          titles: 'Amazing Grace',
        },
        verses: [],
      };
      const normalizedOutput = normalizeModifiedDate(OpenLyricsBuilder(opts));

      const expectedXml = normalizeExpected(
        opts,
        `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet href="../stylesheets/openlyrics.css" type="text/css"?>
<song xmlns="http://openlyrics.info/namespace/2009/song" xml:lang="hu" version="0.9" createdIn="my fake app 2.0" modifiedIn="my computer" modifiedDate="2023-01-01T01:01:01" chordNotation="hungarian">
  <properties>
    <titles>
      <title>Amazing Grace</title>
    </titles>
  </properties>
  <lyrics></lyrics>
</song>`
      );

      expect(normalizedOutput).toEqual(expectedXml);
    });
  });

  describe('Properties', () => {
    it('should build a title list using a single string', () => {
      const opts: INewOpenLyricsSong.IOptions = {
        properties: {
          titles: 'Amazing Grace',
        },
        verses: [],
      };
      const normalizedOutput = normalizeModifiedDate(OpenLyricsBuilder(opts));

      const expectedXml = normalizeExpected(
        opts,
        `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet href="../stylesheets/openlyrics.css" type="text/css"?>
<song xmlns="http://openlyrics.info/namespace/2009/song" xml:lang="en" version="0.9" createdIn="openlyrics-parser 1.1.0" modifiedIn="openlyrics-parser 1.1.0" modifiedDate="2023-01-01T01:01:01">
  <properties>
    <titles>
      <title>Amazing Grace</title>
    </titles>
  </properties>
  <lyrics></lyrics>
</song>`
      );

      expect(normalizedOutput).toEqual(expectedXml);
    });

    it('should build a title list using an array of objects', () => {
      const opts: INewOpenLyricsSong.IOptions = {
        properties: {
          titles: [
            { value: 'Amazing Grace', lang: 'en' },
            { value: 'Erstaunliche Anmut', lang: 'de' },
          ],
        },
        verses: [],
      };
      const normalizedOutput = normalizeModifiedDate(OpenLyricsBuilder(opts));

      const expectedXml = normalizeExpected(
        opts,
        `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet href="../stylesheets/openlyrics.css" type="text/css"?>
<song xmlns="http://openlyrics.info/namespace/2009/song" xml:lang="en" version="0.9" createdIn="openlyrics-parser 1.1.0" modifiedIn="openlyrics-parser 1.1.0" modifiedDate="2023-01-01T01:01:01">
  <properties>
    <titles>
      <title lang="en">Amazing Grace</title>
      <title lang="de">Erstaunliche Anmut</title>
    </titles>
  </properties>
  <lyrics></lyrics>
</song>`
      );

      expect(normalizedOutput).toEqual(expectedXml);
    });

    it('should build an author list using a single string', () => {
      const opts: INewOpenLyricsSong.IOptions = {
        properties: {
          authors: 'John Newton',
          titles: 'Required',
        },
        verses: [],
      };
      const normalizedOutput = normalizeModifiedDate(OpenLyricsBuilder(opts));

      const expectedXml = normalizeExpected(
        opts,
        `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet href="../stylesheets/openlyrics.css" type="text/css"?>
<song xmlns="http://openlyrics.info/namespace/2009/song" xml:lang="en" version="0.9" createdIn="openlyrics-parser 1.1.0" modifiedIn="openlyrics-parser 1.1.0" modifiedDate="2023-01-01T01:01:01">
  <properties>
    <titles>
      <title>Required</title>
    </titles>
    <authors>
      <author>John Newton</author>
    </authors>
  </properties>
  <lyrics></lyrics>
</song>`
      );

      expect(normalizedOutput).toEqual(expectedXml);
    });

    it('should build an author list using an array of objects', () => {
      const opts: INewOpenLyricsSong.IOptions = {
        properties: {
          authors: [
            { value: 'John Newton' },
            { value: 'Chris Rice', type: 'words' },
            { value: 'Richard Wagner', type: 'music' },
            { value: 'František Foo', type: 'translation', lang: 'cs' },
          ],
          titles: 'Required',
        },
        verses: [],
      };
      const normalizedOutput = normalizeModifiedDate(OpenLyricsBuilder(opts));

      const expectedXml = normalizeExpected(
        opts,
        `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet href="../stylesheets/openlyrics.css" type="text/css"?>
<song xmlns="http://openlyrics.info/namespace/2009/song" xml:lang="en" version="0.9" createdIn="openlyrics-parser 1.1.0" modifiedIn="openlyrics-parser 1.1.0" modifiedDate="2023-01-01T01:01:01">
  <properties>
    <titles>
      <title>Required</title>
    </titles>
    <authors>
      <author>
John Newton      </author>
      <author type="words">Chris Rice</author>
      <author type="music">Richard Wagner</author>
      <author lang="cs" type="translation">František Foo</author>
    </authors>
  </properties>
  <lyrics></lyrics>
</song>`
      );

      expect(normalizedOutput).toEqual(expectedXml);
    });

    it('should build a song book list', () => {
      const opts: INewOpenLyricsSong.IOptions = {
        properties: {
          songBooks: [
            { name: "Rippon's Selection of Hymns" },
            { name: 'Teszt könyv', entry: '166' },
          ],
          titles: 'Required',
        },
        verses: [],
      };
      const normalizedOutput = normalizeModifiedDate(OpenLyricsBuilder(opts));

      const expectedXml = normalizeExpected(
        opts,
        `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet href="../stylesheets/openlyrics.css" type="text/css"?>
<song xmlns="http://openlyrics.info/namespace/2009/song" xml:lang="en" version="0.9" createdIn="openlyrics-parser 1.1.0" modifiedIn="openlyrics-parser 1.1.0" modifiedDate="2023-01-01T01:01:01">
  <properties>
    <titles>
      <title>Required</title>
    </titles>
    <songbooks>
      <songbook name="Rippon's Selection of Hymns"/>
      <songbook name="Teszt könyv" entry="166"/>
    </songbooks>
  </properties>
  <lyrics></lyrics>
</song>`
      );

      expect(normalizedOutput).toEqual(expectedXml);
    });

    it('should build a themes list', () => {
      const opts: INewOpenLyricsSong.IOptions = {
        properties: {
          themes: [
            { value: 'Adoration' },
            { value: 'Grace', lang: 'en-US' },
            { value: 'Graça', lang: 'pt-BR' },
          ],
          titles: 'Required',
        },
        verses: [],
      };
      const normalizedOutput = normalizeModifiedDate(OpenLyricsBuilder(opts));

      const expectedXml = normalizeExpected(
        opts,
        `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet href="../stylesheets/openlyrics.css" type="text/css"?>
<song xmlns="http://openlyrics.info/namespace/2009/song" xml:lang="en" version="0.9" createdIn="openlyrics-parser 1.1.0" modifiedIn="openlyrics-parser 1.1.0" modifiedDate="2023-01-01T01:01:01">
  <properties>
    <titles>
      <title>Required</title>
    </titles>
    <themes>
      <theme>
Adoration      </theme>
      <theme lang="en-US">Grace</theme>
      <theme lang="pt-BR">Graça</theme>
    </themes>
  </properties>
  <lyrics></lyrics>
</song>`
      );

      expect(normalizedOutput).toEqual(expectedXml);
    });

    it('should build all the primitive properties', () => {
      const opts: INewOpenLyricsSong.IOptions = {
        properties: {
          ccliNo: '1234',
          comments: ['one', 'two'],
          copyright: 2001,
          key: 'C',
          keywords: 'foo bar',
          publisher: 'a company',
          released: '2002',
          tempo: 90,
          tempoType: 'bpm',
          titles: 'Amazing Grace',
          transposition: 6,
          variant: 'slow',
          verseOrder: 'v1 v2 v3',
          version: '2',
        },
        verses: [],
      };
      const normalizedOutput = normalizeModifiedDate(OpenLyricsBuilder(opts));

      const expectedXml = normalizeExpected(
        opts,
        `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet href="../stylesheets/openlyrics.css" type="text/css"?>
<song xmlns="http://openlyrics.info/namespace/2009/song" xml:lang="en" version="0.9" createdIn="openlyrics-parser 1.1.0" modifiedIn="openlyrics-parser 1.1.0" modifiedDate="2023-01-01T01:01:01">
  <properties>
    <titles>
      <title>Amazing Grace</title>
    </titles>
    <comments>
      <comment>one</comment>
      <comment>two</comment>
    </comments>
    <tempo type="bpm">90</tempo>
    <ccliNo>1234</ccliNo>
    <copyright>2001</copyright>
    <key>C</key>
    <keywords>foo bar</keywords>
    <publisher>a company</publisher>
    <released>2002</released>
    <transposition>6</transposition>
    <variant>slow</variant>
    <verseOrder>v1 v2 v3</verseOrder>
    <version>2</version>
  </properties>
  <lyrics></lyrics>
</song>`
      );

      expect(normalizedOutput).toEqual(expectedXml);
    });
  });

  describe('Format', () => {
    it('should create the Format tags', () => {
      const opts: INewOpenLyricsSong.IOptions = {
        properties: {
          titles: 'Amazing Grace',
        },
        format: [
          {
            application: 'CoolLyricsPro XD',
            tags: [{ name: 'red', open: '&lt;span style="color:red"&gt;', close: '&lt;/span&gt;' }],
          },
          {
            application: 'A Different App',
            tags: [{ name: 'red', open: '{{:red:', close: '}}' }],
          },
        ],
        verses: [],
      };

      const normalizedOutput = normalizeModifiedDate(OpenLyricsBuilder(opts));

      const expectedXml = normalizeExpected(
        opts,
        `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet href="../stylesheets/openlyrics.css" type="text/css"?>
<song xmlns="http://openlyrics.info/namespace/2009/song" xml:lang="en" version="0.9" createdIn="openlyrics-parser 1.1.0" modifiedIn="openlyrics-parser 1.1.0" modifiedDate="2023-01-01T01:01:01">
  <properties>
    <titles>
      <title>Amazing Grace</title>
    </titles>
  </properties>
  <lyrics></lyrics>
  <format>
    <tags application="CoolLyricsPro XD">
      <tag name="red">
        <open>&lt;span style="color:red"&gt;</open>
        <close>&lt;/span&gt;</close>
      </tag>
    </tags>
    <tags application="A Different App">
      <tag name="red">
        <open>{{:red:</open>
        <close>}}</close>
      </tag>
    </tags>
  </format>
</song>`
      );

      expect(normalizedOutput).toEqual(expectedXml);
    });
  });

  describe('Lyrics', () => {
    it('should build lyrics using verse lines as an array of strings', () => {
      const opts: INewOpenLyricsSong.IOptions = {
        properties: {
          titles: 'Amazing Grace',
        },
        verses: [
          {
            name: 'v1',
            lines: ['Amazing grace how sweet the sound\nthat saved a wretch like me;'],
          },
        ],
      };
      const normalizedOutput = normalizeModifiedDate(OpenLyricsBuilder(opts));

      const expectedXml = normalizeExpected(
        opts,
        `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet href="../stylesheets/openlyrics.css" type="text/css"?>
<song xmlns="http://openlyrics.info/namespace/2009/song" xml:lang="en" version="0.9" createdIn="openlyrics-parser 1.1.0" modifiedIn="openlyrics-parser 1.1.0" modifiedDate="2023-01-01T01:01:01">
  <properties>
    <titles>
      <title>Amazing Grace</title>
    </titles>
  </properties>
  <lyrics>
    <verse name="v1">
      <lines>Amazing grace how sweet the sound<br/>that saved a wretch like me;</lines>
    </verse>
  </lyrics>
</song>`
      );

      expect(normalizedOutput).toEqual(expectedXml);
    });

    it('should build lyrics using verse lines as an array of text objects', () => {
      const opts: INewOpenLyricsSong.IOptions = {
        properties: {
          titles: 'Amazing Grace',
        },
        verses: [
          {
            name: 'v1',
            lines: [
              {
                content: [
                  {
                    type: 'text',
                    value: 'Amazing grace how sweet the sound\nthat saved a wretch like me;',
                  },
                ],
              },
            ],
          },
        ],
      };
      const normalizedOutput = normalizeModifiedDate(OpenLyricsBuilder(opts));

      const expectedXml = normalizeExpected(
        opts,
        `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet href="../stylesheets/openlyrics.css" type="text/css"?>
<song xmlns="http://openlyrics.info/namespace/2009/song" xml:lang="en" version="0.9" createdIn="openlyrics-parser 1.1.0" modifiedIn="openlyrics-parser 1.1.0" modifiedDate="2023-01-01T01:01:01">
  <properties>
    <titles>
      <title>Amazing Grace</title>
    </titles>
  </properties>
  <lyrics>
    <verse name="v1">
      <lines>
Amazing grace how sweet the sound<br/>that saved a wretch like me;      </lines>
    </verse>
  </lyrics>
</song>`
      );

      expect(normalizedOutput).toEqual(expectedXml);
    });

    it('should build lyrics using verse lines (with parts) as an array of mixed text and chord objects', () => {
      const opts: INewOpenLyricsSong.IOptions = {
        properties: {
          titles: 'Amazing Grace',
        },
        verses: [
          {
            name: 'v1',
            lines: [
              {
                content: [
                  { type: 'text', value: 'Amazing grace how sweet the sound\n' },
                  { type: 'chord', name: 'D' },
                  { type: 'text', value: 'that saved a wretch like me;\n' },
                ],
              },
              {
                part: 'men',
                content: [
                  { type: 'chord', name: 'B7' },
                  { type: 'text', value: 'Amazing grace' },
                  { type: 'chord', name: 'G7' },
                  { type: 'text', value: ' how sweet the sound that saved a wretch like me;' },
                ],
              },
              {
                part: 'women',
                content: [
                  { type: 'chord', name: 'B7' },
                  { type: 'text', value: 'Amazing grace ' },
                  { type: 'chord', name: 'G7', value: 'how sweet the sound' }, //this chord has a value, it has text inside it!
                  { type: 'text', value: ' that saved a wretch like me;' },
                ],
              },
            ],
          },
        ],
      };
      const normalizedOutput = normalizeModifiedDate(OpenLyricsBuilder(opts));

      const expectedXml = normalizeExpected(
        opts,
        `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet href="../stylesheets/openlyrics.css" type="text/css"?>
<song xmlns="http://openlyrics.info/namespace/2009/song" xml:lang="en" version="0.9" createdIn="openlyrics-parser 1.1.0" modifiedIn="openlyrics-parser 1.1.0" modifiedDate="2023-01-01T01:01:01">
  <properties>
    <titles>
      <title>Amazing Grace</title>
    </titles>
  </properties>
  <lyrics>
    <verse name="v1">
      <lines>
Amazing grace how sweet the sound<br/><chord name="D"/>that saved a wretch like me;<br/>      </lines>
      <lines part="men">
<chord name="B7"/>Amazing grace<chord name="G7"/> how sweet the sound that saved a wretch like me;      </lines>
      <lines part="women">
<chord name="B7"/>Amazing grace <chord name="G7">how sweet the sound</chord> that saved a wretch like me;      </lines>
    </verse>
  </lyrics>
</song>`
      );

      expect(normalizedOutput).toEqual(expectedXml);
    });

    it('should build lyrics using verse lines as an array of mixed text and tag objects', () => {
      const opts: INewOpenLyricsSong.IOptions = {
        properties: {
          titles: 'Amazing Grace',
        },
        verses: [
          {
            name: 'v1',
            lines: [
              {
                content: [
                  { type: 'text', value: 'Amazing grace how sweet the sound that ' },
                  { type: 'tag', value: 'saved', name: 'red' },
                  { type: 'text', value: ' a ' },
                  { type: 'tag', value: 'wretch', name: 'red' },
                  { type: 'text', value: ' like me;' },
                ],
              },
            ],
          },
        ],
      };
      const normalizedOutput = normalizeModifiedDate(OpenLyricsBuilder(opts));

      const expectedXml = normalizeExpected(
        opts,
        `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet href="../stylesheets/openlyrics.css" type="text/css"?>
<song xmlns="http://openlyrics.info/namespace/2009/song" xml:lang="en" version="0.9" createdIn="openlyrics-parser 1.1.0" modifiedIn="openlyrics-parser 1.1.0" modifiedDate="2023-01-01T01:01:01">
  <properties>
    <titles>
      <title>Amazing Grace</title>
    </titles>
  </properties>
  <lyrics>
    <verse name="v1">
      <lines>
Amazing grace how sweet the sound that <tag name="red">saved</tag> a <tag name="red">wretch</tag> like me;      </lines>
    </verse>
  </lyrics>
</song>`
      );

      expect(normalizedOutput).toEqual(expectedXml);
    });

    it('should build lyrics using verse lines as an array of mixed text and comment objects', () => {
      const opts: INewOpenLyricsSong.IOptions = {
        properties: {
          titles: 'Amazing Grace',
        },
        verses: [
          {
            name: 'v1',
            lines: [
              {
                content: [
                  { type: 'text', value: 'Amazing grace how sweet the sound that ' },
                  { type: 'comment', value: 'here is a comment' },
                  { type: 'text', value: ' saved a ' },
                  { type: 'comment', value: 'another comment' },
                  { type: 'text', value: ' wretch like me;' },
                ],
              },
            ],
          },
        ],
      };
      const normalizedOutput = normalizeModifiedDate(OpenLyricsBuilder(opts));

      const expectedXml = normalizeExpected(
        opts,
        `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet href="../stylesheets/openlyrics.css" type="text/css"?>
<song xmlns="http://openlyrics.info/namespace/2009/song" xml:lang="en" version="0.9" createdIn="openlyrics-parser 1.1.0" modifiedIn="openlyrics-parser 1.1.0" modifiedDate="2023-01-01T01:01:01">
  <properties>
    <titles>
      <title>Amazing Grace</title>
    </titles>
  </properties>
  <lyrics>
    <verse name="v1">
      <lines>
Amazing grace how sweet the sound that <comment>here is a comment</comment> saved a <comment>another comment</comment> wretch like me;      </lines>
    </verse>
  </lyrics>
</song>`
      );

      expect(normalizedOutput).toEqual(expectedXml);
    });
  });
});
