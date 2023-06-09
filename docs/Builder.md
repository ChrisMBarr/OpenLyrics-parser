# Documentation & Examples: Building/Creating Files

## Usage
Simply import `OpenLyricsBuilder`, then pass the song data to it, and it will return a `string` of XML data which you can then do what you need to with it.

### For TypeScript projects
```typescript
import { OpenLyricsBuilder } from 'openlyrics-parser';
import { INewOpenLyricsSong } from 'openlyrics-parser/dist/main/model';

const opts: INewOpenLyricsSong.IOptions = {
  properties: { titles: 'Amazing Grace' },
  verses: [
    {
      name: 'v1',
      lines: ['Amazing grace how sweet the sound', 'that saved a wretch like me'],
    },
  ],
};
const xmlDoc: string = OpenLyricsBuilder(opts);
console.log(xmlDoc);
```

### For JavaScript projects
```javascript
const { OpenLyricsBuilder } = require('openlyrics-parser');

const opts = {
  properties: { titles: 'Amazing Grace' },
  verses: [
    {
      name: 'v1',
      lines: ['Amazing grace how sweet the sound', 'that saved a wretch like me'],
    },
  ],
};
const xmlDoc = OpenLyricsBuilder(opts);
console.log(xmlDoc);
```



## Documentation

A single object is passed to `OpenLyricsBuilder` which has 5 possible properties on it, but only two of which are required.
- [Documentation \& Examples: Building/Creating Files](#documentation--examples-buildingcreating-files)
  - [Usage](#usage)
    - [For TypeScript projects](#for-typescript-projects)
    - [For JavaScript projects](#for-javascript-projects)
  - [Documentation](#documentation)
    - [`meta` Object](#meta-object)
    - [`properties` Object - ⚠️REQUIRED](#properties-object---️required)
    - [`format` Object](#format-object)
    - [`verses` Array - ⚠️REQUIRED](#verses-array---️required)
    - [`instruments` Array](#instruments-array)



### `meta` Object
This object is optional and it is the information about the document itself. The property names match the names specified in [the OpenLyrics Metadata docs](https://docs.openlyrics.org/en/latest/dataformat.html#metadata).

| Property      | Type     | Required | Default Value               |
|:--------------|:---------|:---------|:----------------------------|
|`createdIn`    | `string` | No       | `'openlyrics-parser 1.1.0'` |
|`chordNotation`| `string` | No       | `undefined`                 |
|`lang`         | `string` | No       | `'en'`                      |
|`modifiedIn`   | `string` | No       | `'openlyrics-parser 1.1.0'` |



### `properties` Object - ⚠️REQUIRED
This required object contains information about the song. Read about the properties in [the OpenLyrics Song Properties docs](https://docs.openlyrics.org/en/latest/dataformat.html#song-properties)

| Property                    | Type                 | Required | Description                 |
|:----------------------------|:---------------------|:---------|:----------------------------|
| `titles`                    | `string | ITitle[]`  | ⚠️Yes    | For a simple single title just provide a string. For multiples, an array of objects. See [`ITitle[]` docs]() below.  |
| `authors`                   | `string | IAuthor[]` | No       | For a simple single author just provide a string. For multiples, an array of objects. See [`IAuthor[]` docs]() below. |
| `ccliNo`                    | `string | number`    | No       | The CCLI license number for this song |
| `comments`                  | `string[]`           | No       | Any additional, unspecified user data about this song |
| `copyright`                 | `string | number`    | No       | The copyright information of the song. In some countries it is a legal requirement to display copyright information during the presentation of songs. The <copyright> tag has no specific format, though it is recommended that the value contains at least the year and copyright holder of the song  |
| `key`                       | `string`             | No       | The key the song is in, eg: `'C#'` |
| `keywords`                  | `string`             | No       | A space separated list of words used for more precise results when searching for a song in a song database |
| `publisher`                 | `string`             | No       | The publisher of the song |
| `released` or `releaseDate` | `string | number`    | No       | The year or date when a song was released or published |
| `songBooks`                 | `ISongBook[]`        | No       | Most songs come from some sort of collection of songs (a book or a folder of some sort). It may be useful to track where the song comes from. See [`ISongBook[]` docs]() below.|
| `tempo`                     | `string | number`    | No       | The tempo of the song, which can be expressed as a number, eg: `90` (as BPM), or as text, eg: `'slow'` or `'moderate'` |
| `themes`                    | `ITheme[]`           | No       | Used to categorize the song. See [`ITheme[]` docs]() below.|
| `timeSignature`             | `string`             | No       | Used to define the time signature of the song, eg: `'3/4'` |
| `transposition`             | `string | number`    | No       | Used when it is necessary to move the key or the pitch of chords up or down. The value must be an integer between -11 and 11 |
| `variant`                   | `string`             | No       | A description which is used to differentiate songs which are identical, but may be performed or sung differently |
| `verseOrder`                | `string`             | No       | A space-separated string of verse and instrument `name`s defines the order in which the verses and instrumental parts are typically sung or performed. eg: `'v1 v2 c c v1'` |
| `version`                   | `string | number`    | No       | Any text or "version number" of the song since song can be updated over time, sometimes to add additional verses, sometimes to fix spelling or grammatical errors |


### `format` Object
This optional object contains information about any custom format tags on the document. Read about them in [the OpenLyrics Formatting Extensions docs](https://docs.openlyrics.org/en/latest/dataformat.html#formatting-extensions). You should only need to use this if your song will use custom `<tag>` nodes which your song presentation software can interpret.

| Property      | Type     | Required | Default Value               |
|:--------------|:---------|:---------|:----------------------------|



### `verses` Array - ⚠️REQUIRED
This required array of objects is used to describe all of the words of the song and other data related to them.  Read about the supported properties on [the OpenLyrics Song Lyrics docs](https://docs.openlyrics.org/en/latest/dataformat.html#song-lyrics)

| Property      | Type     | Required | Default Value               |
|:--------------|:---------|:---------|:----------------------------|



### `instruments` Array
This optional array of objects is used to describe all of the instrumental music in the song. It is very similar to the above `verses` but it cannot contain any words, only `chord`s or `beat`s. All `beat`s may only contain `chord`s. No text is allowed anywhere inside of `instruments`.  Read about the supported properties on [the OpenLyrics Instrumental Parts docs](https://docs.openlyrics.org/en/latest/dataformat.html#instrumental-parts)

| Property      | Type     | Required | Default Value               |
|:--------------|:---------|:---------|:----------------------------|
