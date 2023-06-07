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
<song xmlns="http://openlyrics.info/namespace/2009/song" xml:lang="en" version="0.9" createdIn="openlyrics-parser 1.1.0" modifiedIn="openlyrics-parser 1.1.0" modifiedDate="2023-06-07T14:27:50">
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
<song xmlns="http://openlyrics.info/namespace/2009/song" xml:lang="en" version="0.9" createdIn="openlyrics-parser 1.1.0" modifiedIn="openlyrics-parser 1.1.0" modifiedDate="2023-06-07T14:27:50">
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
<song xmlns="http://openlyrics.info/namespace/2009/song" xml:lang="en" version="0.9" createdIn="openlyrics-parser 1.1.0" modifiedIn="openlyrics-parser 1.1.0" modifiedDate="2023-06-07T14:27:50">
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
<song xmlns="http://openlyrics.info/namespace/2009/song" xml:lang="en" version="0.9" createdIn="openlyrics-parser 1.1.0" modifiedIn="openlyrics-parser 1.1.0" modifiedDate="2023-06-07T14:27:50">
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
            {name: "Rippon's Selection of Hymns"},
            {name: "Teszt könyv", entry: "166"}
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
<song xmlns="http://openlyrics.info/namespace/2009/song" xml:lang="en" version="0.9" createdIn="openlyrics-parser 1.1.0" modifiedIn="openlyrics-parser 1.1.0" modifiedDate="2023-06-07T14:27:50">
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
            {value: "Adoration"},
            {value: "Grace", lang:'en-US'},
            {value: "Graça", lang:'pt-BR'},
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
<song xmlns="http://openlyrics.info/namespace/2009/song" xml:lang="en" version="0.9" createdIn="openlyrics-parser 1.1.0" modifiedIn="openlyrics-parser 1.1.0" modifiedDate="2023-06-07T14:27:50">
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
<song xmlns="http://openlyrics.info/namespace/2009/song" xml:lang="en" version="0.9" createdIn="openlyrics-parser 1.1.0" modifiedIn="openlyrics-parser 1.1.0" modifiedDate="2023-06-07T14:27:50">
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

  describe('Lyrics', () => {
    it('should build lyrics using verse lines as a string', () => {
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
<song xmlns="http://openlyrics.info/namespace/2009/song" xml:lang="en" version="0.9" createdIn="openlyrics-parser 1.1.0" modifiedIn="openlyrics-parser 1.1.0" modifiedDate="2023-06-07T14:27:50">
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

    it('should build lyrics using verse lines as an object', () => {
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
<song xmlns="http://openlyrics.info/namespace/2009/song" xml:lang="en" version="0.9" createdIn="openlyrics-parser 1.1.0" modifiedIn="openlyrics-parser 1.1.0" modifiedDate="2023-06-07T14:27:50">
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
  });
});
