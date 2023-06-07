import { INewOpenLyricsSong } from './builder.model';
import { OpenLyricsBuilder } from '.';

//NOTE:
// This test file will test the `OpenLyricsBuilder` method on the `index.ts` file
// It does not directly test anything in `builder.ts` even though the name of this file
// might seem to indicate otherwise

fdescribe('OpenLyricsBuilder', (): void => {
  it('should exist', () => {
    expect(OpenLyricsBuilder).toBeDefined();
  });

  it('should build a simple OpenLyrics XML file with the bare minimum properties', () => {
    const opts: INewOpenLyricsSong.IOptions = {
      properties: {
        titles: 'Test',
      },
    };

    expect(OpenLyricsBuilder(opts)).toEqual(``);
  });
});
