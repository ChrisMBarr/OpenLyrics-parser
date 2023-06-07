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
    this.overwriteSpecialPropTitles(obj, userProps.titles);
    this.overwriteSpecialPropAuthors(obj, userProps.authors);
    this.overwriteSpecialPropComments(obj, userProps.comments);
    this.overwriteSpecialPropSongBooks(obj, userProps.songBooks);
    this.overwriteSpecialPropThemes(obj, userProps.themes);
    this.overwriteSpecialPropTempo(obj, userProps.tempo, userProps.tempoType);

    //Add all the remaining string/number properties we can just copy over
    const skipProps = ['authors', 'titles', 'tempo', 'tempoType'];
    Object.keys(userProps).forEach((key) => {
      //skip over keys that we handled above which can possibly have string values
      if (!skipProps.includes(key)) {
        const val = userProps[key];
        if (typeof val === 'string' || typeof val === 'number') {
          obj.song.properties[key] = val.toString();
        }
      }
    });
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
  //Property helper methods
  private overwriteSpecialPropTitles(
    obj: INewSong.IBuilderObject,
    userTitles: string | INewSong.ITitle[]
  ): void {
    if (typeof userTitles === 'string') {
      //Just a simple string was passed in. Use it as the text of the only title
      obj.song.properties.titles.title = [{ '#text': userTitles }];
    } else {
      //An array of title objects were passed in
      obj.song.properties.titles.title = userTitles.map((t): INewSong.ITitleXml => {
        return {
          '#text': t.value,
          '@lang': t.lang,
          '@original': t.original,
        };
      });
    }
  }

  private overwriteSpecialPropAuthors(
    obj: INewSong.IBuilderObject,
    userAuthors?: string | INewSong.IAuthor[]
  ): void {
    if (typeof userAuthors === 'string') {
      //Just a simple string was passed in. Use it as the text of the only author
      obj.song.properties.authors = { author: [{ '#text': userAuthors }] };
    } else if (Array.isArray(userAuthors)) {
      //An array of author objects were passed in
      obj.song.properties.authors = {
        author: userAuthors.map((t): INewSong.IAuthorXml => {
          return {
            '#text': t.value,
            '@lang': t.lang,
            '@type': t.type,
          };
        }),
      };
    }
  }

  private overwriteSpecialPropComments(
    obj: INewSong.IBuilderObject,
    userComments?: string[]
  ): void {
    if (userComments) {
      obj.song.properties.comments = {
        comment: userComments,
      };
    }
  }

  private overwriteSpecialPropSongBooks(
    obj: INewSong.IBuilderObject,
    userSongBooks?: INewSong.ISongBook[]
  ): void {
    if (userSongBooks) {
      obj.song.properties.songbooks = {
        songbook: userSongBooks.map((t): INewSong.ISongBookXml => {
          return {
            '@name': t.name,
            '@entry': t.entry,
          };
        }),
      };
    }
  }

  private overwriteSpecialPropThemes(
    obj: INewSong.IBuilderObject,
    userThemes?: INewSong.ITheme[]
  ): void {
    if (userThemes) {
      obj.song.properties.themes = {
        theme: userThemes.map((t): INewSong.IThemeXml => {
          return {
            '#text': t.value,
            '@lang': t.lang,
          };
        }),
      };
    }
  }

  private overwriteSpecialPropTempo(
    obj: INewSong.IBuilderObject,
    userTempo?: string | number,
    userTempoType?: string
  ): void {
    if (userTempo != null) {
      //An array of author objects were passed in
      obj.song.properties.tempo = {
        '#text': userTempo,
        '@type': userTempoType,
      };
    }
  }

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
        //We've stopped parsing anything created inside of `<lines>` elements, so we need to manually create tags now
        const lineContentArr: string[] = l.content.map((content) => {
          if (content.type === 'chord') {
            return this.getChord(content);
          } else if (content.type === 'tag') {
            return `<tag name="${content.name}">${content.value}</tag>`;
          } else if (content.type === 'comment') {
            return `<comment>${content.value}</comment>`;
          }

          //type should be 'text' if none of the above
          return this.convertToHtmlBreaks(content.value);
        });
        return {
          '#text': lineContentArr.join(''),
          '@part': l.part,
          '@break': l.break,
        };
      });
    }

    return verseLines;
  }

  private getChord(chordObj: INewSong.IVerseAndInstrumentLineContentChord): string {
    let attrs = '';
    if (chordObj.name != null) attrs += ` name="${chordObj.name}"`;
    if (chordObj.root != null) attrs += ` root="${chordObj.root}"`;
    if (chordObj.structure != null) attrs += ` structure="${chordObj.structure}"`;
    if (chordObj.upbeat != null) attrs += ` upbeat="${chordObj.upbeat}"`;
    if (chordObj.value != null) {
      return `<chord${attrs}>${chordObj.value}</chord>`;
    }
    return `<chord${attrs}/>`;
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
