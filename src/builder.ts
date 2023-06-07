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
    obj.song['@modifiedDate'] = new Date().toISOString();

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
}
