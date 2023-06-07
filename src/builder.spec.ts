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

fdescribe('OpenLyricsBuilder', (): void => {
  it('should exist', () => {
    expect(OpenLyricsBuilder).toBeDefined();
  });

  it('should build a simple OpenLyrics XML file with only a title and a line of lyrics as a string', () => {
    const opts: INewOpenLyricsSong.IOptions = {
      properties: {
        titles: 'Amazing Grace',
      },
      verses: [
        { name: 'v1', lines: ['Amazing grace how sweet the sound\nthat saved a wretch like me;'] },
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

  it('should build a simple OpenLyrics XML file with only a title and a line of lyrics as an object', () => {
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
