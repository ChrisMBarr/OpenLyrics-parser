import { INewOpenLyricsSong as INewSong } from './builder.model';

export class Builder {
  public overwriteMeta(obj: INewSong.IBuilderObject, userMeta?: INewSong.IMeta): void {
    //Docs: https://docs.openlyrics.org/en/latest/dataformat.html#metadata

    //Use these properties if nothing was passed in for them
    const defaultMeta: INewSong.IMeta = {
      createdIn: `${process.env.npm_package_name} ${process.env.npm_package_version}`,
      modifiedIn: `${process.env.npm_package_name} ${process.env.npm_package_version}`,
      lang: 'en',
    };
    const mergedMeta = { ...defaultMeta, ...userMeta };

    //Overwrite these properties
    obj.song['@xml:lang'] = mergedMeta.lang!; //eslint-disable-line @typescript-eslint/no-non-null-assertion
    obj.song['@createdIn'] = mergedMeta.createdIn!; //eslint-disable-line @typescript-eslint/no-non-null-assertion
    obj.song['@modifiedIn'] = mergedMeta.modifiedIn!; //eslint-disable-line @typescript-eslint/no-non-null-assertion
    //Get the current timestamp, but remove the milliseconds from it
    obj.song['@modifiedDate'] = new Date().toISOString().replace(/\.\d{3}Z$/, '');

    if (mergedMeta.chordNotation != null) {
      obj.song['@chordNotation'] = mergedMeta.chordNotation;
    }
  }

  public overwriteProperties(obj: INewSong.IBuilderObject, userProps: INewSong.IProperties): void {
    //Docs: https://docs.openlyrics.org/en/latest/dataformat.html#song-properties

    //A title is the only required property
    if (typeof userProps.titles === 'string') {
      //Just a simple string was passed in. Use it as the text of the only title
      obj.song.properties.titles.title = [{ '#text': userProps.titles }];
    } else {
      //An array of titles were passed in
      obj.song.properties.titles.title = userProps.titles.map((t): INewSong.ITitleXml => {
        return {
          '#text': t.value,
          '@lang': t.lang,
          '@original': t.original,
        };
      });
    }
  }

  // public overwriteFormats(obj: INewSong.IBuilderObject, userFormats: INewSong.IFormat[]): void {}
  public overwriteVerses(obj: INewSong.IBuilderObject, userVerses: INewSong.IVerse[]): void {
    //Docs: https://docs.openlyrics.org/en/latest/dataformat.html#song-lyrics

    const versesXml: INewSong.IVerseXml[] = [];
    for (const verse of userVerses) {
      versesXml.push({
        '@name': verse.name,
        '@break': verse.break,
        '@lang': verse.lang,
        '@transliteration': verse.transliteration,
        lines: this.getVerseLines(verse.lines),
      });
    }

    obj.song.lyrics.verse = versesXml;
  }
  // public overwriteInstruments(obj: INewSong.IBuilderObject, userInstruments: INewSong.IInstrument[]): void {}

  //============================================================
  //Verse helper methods
  private getVerseLines(lines: string[] | INewSong.IVerseLine[]): INewSong.IVerseLineXml[] {
    let verseLines: INewSong.IVerseLineXml[] = [];

    if (this.isStringArray(lines)) {
      //Users can provide just a simple array of strings which we will interpret to mean the lyric text
      //This way they don't have to provide complicated objects unless they want to
      verseLines = lines.map((l: string) => {
        return {
          '#text': this.convertToHtmlBreaks(l),
        };
      });
    } else {
      //Full objects provided
      verseLines = lines.map((l: INewSong.IVerseLine) => {
        const lineContentArr: string[] = l.content.map((c) => {
          // if(c.type==='text'){
          return this.convertToHtmlBreaks(c.value ?? '');
          // }
        });
        return {
          '#text': lineContentArr.join(''),
        };
      });
    }

    return verseLines;
  }

  //============================================================
  //General utility methods
  private isStringArray(x: any[]): x is string[] {
    return x.every((i) => typeof i === 'string');
  }

  private convertToHtmlBreaks(x: string): string {
    return x.replace(/\n/g, '<br/>');
  }
}
