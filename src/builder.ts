import * as builderModel from './builder.model';
import * as xmlModel from './builder.xml.model';
import { version } from './version';

export class Builder {
  public overwriteMeta(obj: xmlModel.IBuilderXml, userMeta?: builderModel.IBuilderMeta): void {
    //Docs: https://docs.openlyrics.org/en/latest/dataformat.html#metadata

    //Use these properties if nothing was passed in for them
    const defaultMeta: builderModel.IBuilderMeta = {
      createdIn: `openlyrics-parser ${version}`,
      modifiedIn: `openlyrics-parser ${version}`,
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

  public overwriteProperties(
    obj: xmlModel.IBuilderXml,
    userProps: builderModel.IBuilderProperties
  ): void {
    //Docs: https://docs.openlyrics.org/en/latest/dataformat.html#song-properties

    //A title is the only required property
    this.overwriteSpecialPropTitles(obj, userProps.titles);
    this.overwriteSpecialPropAuthors(obj, userProps.authors);
    this.overwriteSpecialPropComments(obj, userProps.comments);
    this.overwriteSpecialPropSongBooks(obj, userProps.songBooks);
    this.overwriteSpecialPropThemes(obj, userProps.themes);
    this.overwriteSpecialPropTempo(obj, userProps.tempo);

    //Add all the remaining string/number properties we can just copy over
    const skipProps = ['authors', 'titles', 'tempo'];
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

  public overwriteFormats(
    obj: xmlModel.IBuilderXml,
    userFormat?: builderModel.IBuilderFormat[]
  ): void {
    //Docs: https://docs.openlyrics.org/en/latest/dataformat.html##formatting-extensions

    if (userFormat) {
      //This is OK to disable here because we know it exists.
      //The static obj is created right before this method is called
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      obj.song.format!.tags = userFormat.map((f) => {
        return {
          '@application': f.application,
          tag: f.tags.map((t): xmlModel.IFormatTagXml => {
            return {
              '@name': t.name,
              open: this.encodeHtmlCarats(t.open),
              close: this.encodeHtmlCarats(t.close),
            };
          }),
        };
      });
    } else {
      //We need to be able to remove the format XML node so that we can place above the lyrics in the output.
      //So if a format option is provided it will be filled in, if not it will be removed,
      obj.song.format = undefined;
    }
  }

  public overwriteVerses(
    obj: xmlModel.IBuilderXml,
    userVerses: builderModel.IBuilderVerse[]
  ): void {
    //Docs: https://docs.openlyrics.org/en/latest/dataformat.html#song-lyrics

    const versesXml: xmlModel.IVerseXml[] = [];
    for (const verse of userVerses) {
      versesXml.push({
        '@name': verse.name,
        '@break': verse.optionalBreak === true ? 'optional' : undefined,
        '@lang': verse.lang,
        '@transliteration': verse.transliteration,
        lines: this.getVerseLines(verse.lines),
      });
    }

    obj.song.lyrics.verse = versesXml;
  }

  public overwriteInstruments(
    obj: xmlModel.IBuilderXml,
    userInstruments?: builderModel.IBuilderInstrument[]
  ): void {
    //Docs: https://docs.openlyrics.org/en/latest/dataformat.html#instrumental-parts

    if (userInstruments) {
      const instrumentsXml: xmlModel.IInstrumentXml[] = [];
      for (const inst of userInstruments) {
        instrumentsXml.push({
          '@name': inst.name,
          lines: this.getInstrumentLines(inst.lines),
        });
      }

      obj.song.lyrics.instrument = instrumentsXml;
    }
  }

  //============================================================
  //Property helper methods
  private overwriteSpecialPropTitles(
    obj: xmlModel.IBuilderXml,
    userTitles: string | builderModel.IBuilderTitle[]
  ): void {
    if (typeof userTitles === 'string') {
      //Just a simple string was passed in. Use it as the text of the only title
      obj.song.properties.titles.title = [{ '#text': userTitles }];
    } else {
      //An array of title objects were passed in
      obj.song.properties.titles.title = userTitles.map((t): xmlModel.ITitleXml => {
        return {
          '#text': t.value,
          '@lang': t.lang,
          '@translit': t.transliteration,
          '@original': t.original === true ? 'true' : undefined,
        };
      });
    }
  }

  private overwriteSpecialPropAuthors(
    obj: xmlModel.IBuilderXml,
    userAuthors?: string | builderModel.IBuilderAuthor[]
  ): void {
    if (typeof userAuthors === 'string') {
      //Just a simple string was passed in. Use it as the text of the only author
      obj.song.properties.authors = { author: [{ '#text': userAuthors }] };
    } else if (Array.isArray(userAuthors)) {
      //An array of author objects were passed in
      obj.song.properties.authors = {
        author: userAuthors.map((t): xmlModel.IAuthorXml => {
          return {
            '#text': t.value,
            '@lang': t.lang,
            '@type': t.type,
          };
        }),
      };
    }
  }

  private overwriteSpecialPropComments(obj: xmlModel.IBuilderXml, userComments?: string[]): void {
    if (userComments) {
      obj.song.properties.comments = {
        comment: userComments,
      };
    }
  }

  private overwriteSpecialPropSongBooks(
    obj: xmlModel.IBuilderXml,
    userSongBooks?: builderModel.IBuilderSongBook[]
  ): void {
    if (userSongBooks) {
      obj.song.properties.songbooks = {
        songbook: userSongBooks.map((t): xmlModel.ISongBookXml => {
          return {
            '@name': t.name,
            '@entry': t.entry,
          };
        }),
      };
    }
  }

  private overwriteSpecialPropThemes(
    obj: xmlModel.IBuilderXml,
    userThemes?: builderModel.IBuilderTheme[]
  ): void {
    if (userThemes) {
      //TODO: Allow for string array values!

      obj.song.properties.themes = {
        theme: userThemes.map((t): xmlModel.IThemeXml => {
          return {
            '#text': t.value,
            '@lang': t.lang,
          };
        }),
      };
    }
  }

  private overwriteSpecialPropTempo(obj: xmlModel.IBuilderXml, userTempo?: string | number): void {
    if (userTempo != null) {
      const tempoType = typeof userTempo === 'number' ? 'bpm' : 'text';

      obj.song.properties.tempo = {
        '#text': userTempo,
        '@type': tempoType,
      };
    }
  }

  //============================================================
  //Verse/Instrument helper methods
  private getVerseLines(
    lines: string[] | builderModel.IBuilderVerseLine[]
  ): xmlModel.IVerseLineXml[] {
    let verseLines: xmlModel.IVerseLineXml[] = [];

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
      verseLines = lines.map((l: builderModel.IBuilderVerseLine) => {
        //we are manually creating tags now
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
          '@break': l.optionalBreak === true ? 'optional' : undefined,
          '@repeat': l.repeat,
        };
      });
    }

    return verseLines;
  }

  private getInstrumentLines(
    lines: builderModel.IBuilderInstrumentLine[]
  ): xmlModel.IInstrumentLineXml[] {
    const linesXml: xmlModel.IInstrumentLineXml[] = lines.map(
      (l: builderModel.IBuilderInstrumentLine) => {
        //we are manually creating tags now
        const lineContentArr: string[] = l.content.map((content) => {
          if (content.type === 'chord') {
            return this.getChord(content);
          }

          //Not a chord, so it should be a `<beat>` which should contain `<chord>`s
          return this.getBeat(content);
        });
        return {
          '#text': lineContentArr.join(''),
          '@part': l.part,
          '@repeat': l.repeat,
        };
      }
    );

    return linesXml;
  }

  private getChord(
    chordObj: builderModel.IBuilderVerseChord | builderModel.IBuilderInstrumentChord
  ): string {
    //Docs: https://docs.openlyrics.org/en/latest/dataformat.html#chords
    let attrs = '';
    if (chordObj.root != null) attrs += ` root="${chordObj.root}"`;
    if (chordObj.structure != null) attrs += ` structure="${chordObj.structure}"`;
    if (chordObj.upbeat === true) attrs += ` upbeat="true"`;
    if (chordObj.bass != null) attrs += ` bass="${chordObj.bass}"`;
    if (this.isVerseChord(chordObj)) {
      return `<chord${attrs}>${chordObj.value}</chord>`;
    }
    return `<chord${attrs}/>`;
  }

  private getBeat(beatObj: builderModel.IBuilderInstrumentLineContentBeat): string {
    //A `<beat>` can only contain `<cord>`s
    //Docs: https://docs.openlyrics.org/en/latest/dataformat.html#instrumental-parts
    const chordsArr = beatObj.chords.map((c) => this.getChord(c));

    //manual indentation and line breaks since we are creating node manually here
    return `        <beat>${chordsArr.join('')}</beat>\n`;
  }

  //============================================================
  //General utility methods
  private isStringArray(x: any[]): x is string[] {
    return x.every((i) => typeof i === 'string');
  }

  private convertToHtmlBreaks(x: string): string {
    return x.replace(/[\n\r]/g, '<br/>');
  }

  private encodeHtmlCarats(x: string): string {
    return x.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  private isVerseChord(
    x: builderModel.IBuilderVerseChord | builderModel.IBuilderInstrumentChord
  ): x is builderModel.IBuilderVerseChord {
    return 'value' in x;
  }
}
