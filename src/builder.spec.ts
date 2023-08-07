import * as builderModel from './builder.model';
import { OpenLyricsBuilder } from '.';

//NOTE:
// This test file will test the `OpenLyricsBuilder` method on the `index.ts` file
// It does not directly test anything in `builder.ts` even though the name of this file
// might seem to indicate otherwise

function normalizeModifiedDate(xmlStr: string): string {
  return xmlStr.replace(/modifiedDate=".+?"/, 'modifiedDate="2023-01-01T01:01:01"');
}

function normalizeExpected(opts: builderModel.IBuilderOptions, xmlStr: string): string {
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
      const opts: builderModel.IBuilderOptions = {
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
      const opts: builderModel.IBuilderOptions = {
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
      const opts: builderModel.IBuilderOptions = {
        properties: {
          titles: [
            { lang: 'en-US', original: true, value: 'Amazing Grace' },
            { lang: 'en', value: 'Amazing Grace' },
            { value: 'Amazing' },
            { lang: 'de-DE', transliteration: 'en', value: 'Erstaunliche Anmut' },
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
      <title lang="en-US" original="true">Amazing Grace</title>
      <title lang="en">Amazing Grace</title>
      <title>Amazing</title>
      <title lang="de-DE" translit="en">Erstaunliche Anmut</title>
    </titles>
  </properties>
  <lyrics></lyrics>
</song>`
      );

      expect(normalizedOutput).toEqual(expectedXml);
    });

    it('should build an author list using a single string', () => {
      const opts: builderModel.IBuilderOptions = {
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
      const opts: builderModel.IBuilderOptions = {
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
      <author>John Newton</author>
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
      const opts: builderModel.IBuilderOptions = {
        properties: {
          songBooks: [
            { name: "Rippon's Selection of Hymns" },
            { name: 'Teszt könyv', entry: '166' },
            { name: 'Test with number', entry: 42 },
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
      <songbook name="Test with number" entry="42"/>
    </songbooks>
  </properties>
  <lyrics></lyrics>
</song>`
      );

      expect(normalizedOutput).toEqual(expectedXml);
    });

    it('should build a themes list', () => {
      const opts: builderModel.IBuilderOptions = {
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
      <theme>Adoration</theme>
      <theme lang="en-US">Grace</theme>
      <theme lang="pt-BR">Graça</theme>
    </themes>
  </properties>
  <lyrics></lyrics>
</song>`
      );

      expect(normalizedOutput).toEqual(expectedXml);
    });

    it('should build all the primitive properties (with tempo as a number value)', () => {
      const opts: builderModel.IBuilderOptions = {
        properties: {
          ccliNo: '1234',
          comments: ['one', 'two'],
          copyright: 2001,
          key: 'C',
          keywords: 'foo bar',
          publisher: 'a company',
          released: '2002',
          tempo: 90,
          timeSignature: '3/4',
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
    <timeSignature>3/4</timeSignature>
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

    it('should build the tempo using a string value', () => {
      const opts: builderModel.IBuilderOptions = {
        properties: {
          tempo: 'slow',
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
    <tempo type="text">slow</tempo>
  </properties>
  <lyrics></lyrics>
</song>`
      );

      expect(normalizedOutput).toEqual(expectedXml);
    });
  });

  describe('Format', () => {
    it('should create the Format tags', () => {
      const opts: builderModel.IBuilderOptions = {
        properties: {
          titles: 'Amazing Grace',
        },
        format: [
          {
            application: 'CoolLyricsPro XD',
            tags: [{ name: 'red', open: '<span style="color:red">', close: '</span>' }],
          },
          {
            application: 'A Different App',
            tags: [{ name: 'red', open: '{{red|', close: '}}' }],
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
  <format>
    <tags application="CoolLyricsPro XD">
      <tag name="red">
        <open>&lt;span style="color:red"&gt;</open>
        <close>&lt;/span&gt;</close>
      </tag>
    </tags>
    <tags application="A Different App">
      <tag name="red">
        <open>{{red|</open>
        <close>}}</close>
      </tag>
    </tags>
  </format>
  <lyrics></lyrics>
</song>`
      );

      expect(normalizedOutput).toEqual(expectedXml);
    });
  });

  describe('Lyrics', () => {
    it('should build lyrics using verse lines as an array of strings', () => {
      const opts: builderModel.IBuilderOptions = {
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
      const opts: builderModel.IBuilderOptions = {
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
      const opts: builderModel.IBuilderOptions = {
        properties: {
          titles: 'Amazing Grace',
        },
        verses: [
          {
            name: 'v1',
            lines: [
              {
                repeat: 3,
                content: [
                  { type: 'text', value: 'Amazing grace how sweet the sound\n' },
                  {
                    type: 'chord',
                    root: 'F',
                    structure: 'm3-5',
                    bass: 'G#',
                    upbeat: true,
                  },
                  { type: 'text', value: 'that saved a wretch like me;\r' },
                ],
              },
              {
                part: 'men',
                content: [
                  { type: 'chord', root: 'B7' },
                  { type: 'text', value: 'Amazing grace' },
                  { type: 'chord', root: 'G7' },
                  { type: 'text', value: ' how sweet the sound that saved a wretch like me;' },
                ],
              },
              {
                part: 'women',
                content: [
                  { type: 'chord', root: 'B7' },
                  { type: 'text', value: 'Amazing grace ' },
                  { type: 'chord', root: 'G7', value: 'how sweet the sound' }, //this chord has a value, it has text inside it!
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
      <lines repeat="3">
Amazing grace how sweet the sound<br/><chord root="F" structure="m3-5" upbeat="true" bass="G#"/>that saved a wretch like me;<br/>      </lines>
      <lines part="men">
<chord root="B7"/>Amazing grace<chord root="G7"/> how sweet the sound that saved a wretch like me;      </lines>
      <lines part="women">
<chord root="B7"/>Amazing grace <chord root="G7">how sweet the sound</chord> that saved a wretch like me;      </lines>
    </verse>
  </lyrics>
</song>`
      );

      expect(normalizedOutput).toEqual(expectedXml);
    });

    it('should build lyrics using verse lines as an array of mixed text and tag objects', () => {
      const opts: builderModel.IBuilderOptions = {
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
      const opts: builderModel.IBuilderOptions = {
        properties: {
          titles: 'Amazing Grace',
        },
        verses: [
          {
            name: 'v1',
            lines: [
              {
                optionalBreak: true,
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
      <lines break="optional">
Amazing grace how sweet the sound that <comment>here is a comment</comment> saved a <comment>another comment</comment> wretch like me;      </lines>
    </verse>
  </lyrics>
</song>`
      );

      expect(normalizedOutput).toEqual(expectedXml);
    });

    it('should build lyrics with multiple verses (with properties)', () => {
      const opts: builderModel.IBuilderOptions = {
        properties: {
          titles: 'Amazing Grace',
        },
        verses: [
          {
            name: 'v1',
            lang: 'en',
            lines: ['Amazing grace how sweet the sound\rthat saved a wretch like me;'],
          },
          {
            name: 'v1',
            lang: 'de',
            transliteration: 'de',
            optionalBreak: true,
            lines: ['Erstaunliche Ahmut, wie'],
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
    <verse name="v1" lang="en">
      <lines>Amazing grace how sweet the sound<br/>that saved a wretch like me;</lines>
    </verse>
    <verse name="v1" break="optional" lang="de" transliteration="de">
      <lines>Erstaunliche Ahmut, wie</lines>
    </verse>
  </lyrics>
</song>`
      );

      expect(normalizedOutput).toEqual(expectedXml);
    });
  });

  describe('Instruments', () => {
    it('should build instruments using only an array of chord objects', () => {
      const opts: builderModel.IBuilderOptions = {
        properties: {
          titles: 'Amazing Grace',
        },
        verses: [],
        instruments: [
          {
            name: 'intro',
            lines: [
              {
                repeat: 2,
                part: 'guitar',
                content: [
                  { type: 'chord', root: 'G' },
                  { type: 'chord', root: 'G#' },
                ],
              },
            ],
          },
          {
            name: 'intro',
            lines: [
              {
                repeat: 2,
                part: 'piano',
                content: [
                  { type: 'chord', root: 'D' },
                  { type: 'chord', root: 'D#' },
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
    <instrument name="intro">
      <lines part="guitar" repeat="2">
<chord root="G"/><chord root="G#"/>      </lines>
    </instrument>
    <instrument name="intro">
      <lines part="piano" repeat="2">
<chord root="D"/><chord root="D#"/>      </lines>
    </instrument>
  </lyrics>
</song>`
      );

      expect(normalizedOutput).toEqual(expectedXml);
    });

    it('should build instruments using only an array of beat objects', () => {
      const opts: builderModel.IBuilderOptions = {
        properties: {
          titles: 'Amazing Grace',
        },
        verses: [],
        instruments: [
          {
            name: 'intro',
            lines: [
              {
                part: 'guitar',
                content: [
                  {
                    type: 'beat',
                    chords: [
                      { type: 'chord', root: 'G' },
                      { type: 'chord', root: 'G#' },
                    ],
                  },
                  {
                    type: 'beat',
                    chords: [
                      { type: 'chord', root: 'D' },
                      { type: 'chord', root: 'D#' },
                    ],
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
    <instrument name="intro">
      <lines part="guitar">
        <beat><chord root="G"/><chord root="G#"/></beat>
        <beat><chord root="D"/><chord root="D#"/></beat>
      </lines>
    </instrument>
  </lyrics>
</song>`
      );

      expect(normalizedOutput).toEqual(expectedXml);
    });

    it('should build instruments using a mixed array of beat and chord objects', () => {
      const opts: builderModel.IBuilderOptions = {
        properties: {
          titles: 'Amazing Grace',
        },
        verses: [],
        instruments: [
          {
            name: 'intro',
            lines: [
              {
                part: 'guitar',
                content: [
                  {
                    type: 'beat',
                    chords: [
                      { type: 'chord', root: 'G' },
                      { type: 'chord', root: 'G#' },
                    ],
                  },
                  { type: 'chord', root: 'D' },
                  { type: 'chord', root: 'D#' },
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
    <instrument name="intro">
      <lines part="guitar">
        <beat><chord root="G"/><chord root="G#"/></beat>
<chord root="D"/><chord root="D#"/>      </lines>
    </instrument>
  </lyrics>
</song>`
      );

      expect(normalizedOutput).toEqual(expectedXml);
    });
  });
});
