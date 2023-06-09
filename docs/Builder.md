# Documentation & Examples: Building/Creating OpenLyrics XML Files

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
- [`meta` Object](#meta-object)
- [`properties` Object - ⚠️REQUIRED](#properties-object---⚠️required)
- [`format` Object](#format-object)
- [`verses` Array - ⚠️REQUIRED](#verses-array---⚠️required)
- [`instruments` Array](#instruments-array)




### `meta` Object
This object is optional and it contains information about the document itself. The property names match the names specified in [the OpenLyrics Metadata docs](https://docs.openlyrics.org/en/latest/dataformat.html#metadata).

| Property      | Type     | Required | Default Value               |
|:--------------|:---------|:---------|:----------------------------|
|`createdIn`    | `string` | No       | `'openlyrics-parser 1.1.0'` |
|`chordNotation`| `string` | No       | `undefined`                 |
|`lang`         | `string` | No       | `'en'`                      |
|`modifiedIn`   | `string` | No       | `'openlyrics-parser 1.1.0'` |



### `properties` Object - ⚠️REQUIRED
This required object contains information about the song. Read about the properties in [the OpenLyrics Song Properties docs](https://docs.openlyrics.org/en/latest/dataformat.html#song-properties)

| Property                    | Type                    | Required | Description                 |
|:----------------------------|:------------------------|:---------|:----------------------------|
| `titles`                    | `string` or `ITitle[]`  | ⚠️Yes    | For a simple single title just provide a string. For multiples, an array of objects: See [the `ITitle[]` docs](#properties--titles-ititle) below.  |
| `authors`                   | `string` or `IAuthor[]` | No       | For a simple single author just provide a string. For multiples, an array of objects: See [the `IAuthor[]` docs](#properties--authors-iauthor) below. |
| `ccliNo`                    | `string` or `number`    | No       | The CCLI license number for this song |
| `comments`                  | `string[]`              | No       | Any additional, unspecified user data about this song |
| `copyright`                 | `string` or `number`    | No       | The copyright information of the song. In some countries it is a legal requirement to display copyright information during the presentation of songs. The <copyright> tag has no specific format, though it is recommended that the value contains at least the year and copyright holder of the song  |
| `key`                       | `string`                | No       | The key the song is in, eg: `'C#'` |
| `keywords`                  | `string`                | No       | A space separated list of words used for more precise results when searching for a song in a song database |
| `publisher`                 | `string`                | No       | The publisher of the song |
| `released` or `releaseDate` | `string` or `number`    | No       | The year or date when a song was released or published. OpenLyrics 0.8 uses the `releaseDate` property, while 0.9 uses `released`. Using either one will result in the `released` property being set for version 0.9 compatibility |
| `songBooks`                 | `ISongBook[]`           | No       | Most songs come from some sort of collection of songs (a book or a folder of some sort). It may be useful to track where the song comes from. See [the `ISongBook[]` docs](#properties--songbooks-isongbook) below.|
| `tempo`                     | `string` or `number`    | No       | The tempo of the song, which can be expressed as a number, eg: `90` (as BPM), or as text, eg: `'slow'` or `'moderate'` |
| `themes`                    | `ITheme[]`              | No       | Used to categorize the song. See [the `ITheme[]` docs](#properties--themes-itheme) below.|
| `timeSignature`             | `string`                | No       | Used to define the time signature of the song, eg: `'3/4'` |
| `transposition`             | `string` or `number`    | No       | Used when it is necessary to move the key or the pitch of chords up or down. The value must be an integer between `-11` and `11` |
| `variant`                   | `string`                | No       | A description which is used to differentiate songs which are identical, but may be performed or sung differently |
| `verseOrder`                | `string`                | No       | A space-separated string of verse and instrument `name`s defines the order in which the verses and instrumental parts are typically sung or performed. eg: `'v1 v2 c c v1'` |
| `version`                   | `string` or `number`    | No       | Any text or "version number" of the song since song can be updated over time, sometimes to add additional verses, sometimes to fix spelling or grammatical errors |



#### `properties` => `titles: ITitle[]`
If a song has more than one title you must provide the titles in the form of these object. Each title object can have these properties. See [the OpenLyrics Titles documentation](https://docs.openlyrics.org/en/latest/dataformat.html#titles) for more information
| Property        | Type     | Required | Description               |
|:----------------|:---------|:---------|:--------------------------|
|`value`          | `string` | ⚠️Yes    | The title of the song     |
|`lang`           | `string` | No       | The language of the title, eg: `'en'` or `'de'`. This should match languages specified elsewhere if different from the document language. |
|`transliteration`| `string` | No       | If a title has been transliterated from another language, store that language code here
|`original`       | `boolean`| No       | This marks a particular title as being the original title. You only need to set this to `true` on one title, you can omit setting a value on all other titles |

**Examples**
```js
[
  { value: "Amazing Grace",      lang:'en-US', original: true },
  { value: 'Erstaunliche Anmut', lang: 'de-DE' }
]
```
```js
[
  { value: "הבה נגילה",       lang: 'he', },
  { value: 'Hava Nagila',      lang: 'he', transliteration: 'en'  },
  { value: 'Hava naguila',     lang: 'he', transliteration: 'fr'  },
  { value: 'Let Us Rejoice',   lang: 'en'  },
  { value: 'Réjouissons-nous', lang: 'fr'  },
]
```



#### `properties` => `authors: IAuthor[]`
If a song has more than one author you must provide the authors in the form of these object. Each author object can have these properties. See [the OpenLyrics Authors documentation](https://docs.openlyrics.org/en/latest/dataformat.html#authors) for more information
| Property  | Type     | Required | Description               |
|:----------|:---------|:---------|:--------------------------|
|`value`    | `string` | ⚠️Yes    | The author name |
|`type`     | `string` | No       | The type of author, eg: `'words'`, `'music'`, `'translation'`, or `'arrangement'`|
|`lang`     | `string` | No       | The language the song has been translated to by this author. This is only needed if the author `type` is `'translation'`. This should match languages specified elsewhere if different from the document language. |

**Example**
```js
[
  { value: 'John Newton' },
  { value: 'Chris Rice',     type: 'words' },
  { value: 'Richard Wagner', type: 'music' },
  { value: 'František Foo',  type: 'translation', lang: 'cs' },
]
```



#### `properties` => `songBooks: ISongBook[]`
Most songs come from some sort of collection of songs (a book or a folder of some sort). It may be useful to track where the song comes from. Each song book object can have these properties. Read more about them in [the OpenLyrics SongBooks docs](https://docs.openlyrics.org/en/latest/dataformat.html#song-books)
| Property  | Type                 | Required | Description               |
|:----------|:---------------------|:---------|:--------------------------|
|`name`     | `string`             | ⚠️Yes    | The name of the song book |
|`entry`    | `string` or `number` | No       | The index of the song within the song book. This could be a page number for example |

**Example**
```js
[
  { name: "Rippon's Selection of Hymns" },
  { name: 'My Cool Hymn Book', entry: 42 },
  { name: 'Another Book', entry: '19b' },
]
```



#### `properties` => `themes: ITheme[]`
Themes are used to categorize songs. Having songs categorized can be useful when choosing songs for a ceremony or for a particular sermon topic. Each theme just has a simple string value and an optional language specified. Read about them in [the OpenLyrics Themes docs](https://docs.openlyrics.org/en/latest/dataformat.html#themes)

| Property  | Type     | Required | Description                  |
|:----------|:---------|:---------|:-----------------------------|
|`value`    | `string` | ⚠️Yes    | A single theme for this song |
|`lang`     | `string`  | No      | The language of this theme. This should match languages specified elsewhere if different from the document language.   |

**Example**
```js
[
  { value: 'Adoration' },
  { value: 'Adoração',  lang: 'pt-BR' },
  { value: 'Grace',     lang: 'en-US' },
  { value: 'Graça',     lang: 'pt-BR' },
  { value: 'Salvation', lang: 'en-US' },
  { value: 'Salvação',  lang: 'pt-BR' },
]
```


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
