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
- [`format` Array](#format-array)
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
|`transliteration`| `string` | No       | If a title has been transliterated from another language, store that language code here. Only set this when also setting `lang`
|`original`       | `boolean`| No       | This marks a particular title as being the original title. You only need to set this to `true` on one title, you can omit setting a value on all other titles |

**Examples**
```js
[
  { value: "Amazing Grace",      lang:'en-US', original: true },
  { value: 'Erstaunliche Anmut', lang: 'de-DE' }
]
```
<!-- cSpell:disable -->
```js
[
  { value: "הבה נגילה",       lang: 'he', },
  { value: 'Hava Nagila',      lang: 'he', transliteration: 'en'  },
  { value: 'Hava naguila',     lang: 'he', transliteration: 'fr'  },
  { value: 'Let Us Rejoice',   lang: 'en'  },
  { value: 'Réjouissons-nous', lang: 'fr'  },
]
```
<!-- cSpell:enable -->



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
<!-- cSpell:disable -->
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
<!-- cSpell:enable -->


### `format` Array
This optional object contains information about any custom format tags on the document. Read about them in [the OpenLyrics Formatting Extensions docs](https://docs.openlyrics.org/en/latest/dataformat.html#formatting-extensions). You should only need to use this if your song will use custom `<tag>` nodes which your song presentation software can interpret.

| Property      | Type           | Required | Default Value               |
|:--------------|:---------------|:---------|:----------------------------|
|`application`  | `string`       | ⚠️Yes    | The name of the target application or processor identifier that will use the specified format tags |
|`tags`         | `IFormatTag[]` | ⚠️Yes    | An array of tag objects, described below |



#### `format` => `tags: IFormatTag[]`
| Property | Type     | Required | Default Value               |
|:---------|:---------|:---------|:----------------------------|
|`name`    | `string` | ⚠️Yes    | The name of this tag  |
|`open`    | `string` | ⚠️Yes    | The opening portion of this tag. This will be prepended to whatever text is wrapped in a `<tag>` within the lyrics. |
|`close`   | `string` | ⚠️Yes    | The closing portion of this tag. This will be appended to whatever text is wrapped in a `<tag>` within the lyrics. |

ℹ️ Note: If the `open` or `close` contains any XML/HTML carat characters they will be automatically replaced with the corresponding HTML entity so it can be stored properly within the song XML document. For example: `<` is replaced with `&lt;` and `>` is replaced with `&gt;`  .

**Example**
```js
[
  {
    application: 'CoolLyricsPro XD',
    tags: [
      { name: 'red',  open: '<span style="color:red">', close: '</span>' },
      { name: 'bold', open: '<strong>',                 close: '</strong>' }
    ],
  },
  {
    application: 'A Different App',
    tags: [
      { name: 'red',  open: '{{red|',  close: '}}' },
      { name: 'bold', open: '{{bold|', close: '}}' }
    ],
  },
]
```



### `verses` Array - ⚠️REQUIRED
This required array of objects is used to describe all of the words of the song and other data related to them.  Read about the supported properties on [the OpenLyrics Song Lyrics docs](https://docs.openlyrics.org/en/latest/dataformat.html#song-lyrics)

| Property         | Type                         | Required | Default Value               |
|:-----------------|:-----------------------------|:---------|:----------------------------|
|`name`            | `string`                     | ⚠️Yes    | The name of this verse. Can be anything string like: `'v1'`, `'v2'`, `'c'`, etc.  |
|`lines`           | `string[]` or `IVerseLine[]` | ⚠️Yes    | Each verse can contain multiple "lines" of text. Pass a string in the array for each line. Any `\n`or `\r` line break character will be transformed into a `<br/>` tag. Alternatively for anything more complex an `IVerseLine[]` may be passed instead of a plain `string[]` See [the `IVerseLine[]` Docs](#verses--lines-iverseline) below.  |
|`optionalBreak`   | `boolean`                    | No       | If `true` an application can decide to break the verse in two slides if it doesn’t fit on one screen  |
|`lang`            | `string`                     | No       | The language this verse is written in. This should match languages specified elsewhere if different from the document language. |
|`transliteration` | `string`                     | No       | If a verse has been transliterated from another language, store that language code here. Only set this when also setting `lang`  |



#### `verses` => `lines: IVerseLine[]`
| Property         | Type                         | Required | Default Value               |
|:-----------------|:-----------------------------|:---------|:----------------------------|
| `content`        | `IVerseLineContent[]`        | ⚠️Yes    | An array of items that can appear on this line of this verse. See [the `IVerseLineContent[]` docs](#verses--lines--content-iverselinecontent) below. |
| `part`           | `string`                     | No       | This line of this verse can have a part, for example `'men'` or `'women'` are common parts to use. Read more about this on [the OpenLyrics Verse Parts Docs](https://docs.openlyrics.org/en/latest/dataformat.html#verse-parts-groups-of-lines) |
| `optionalBreak`  | `boolean`                    | No       | If `true` an application can decide to break this line in two slides if it doesn’t fit on one screen |
| `repeat`         | `number`                     | No       | The number of times this particular line should be repeated. Read more about this on [the OpenLyrics Line Repeat Docs](https://docs.openlyrics.org/en/latest/dataformat.html#line-repeat)  |


#### `verses` => `lines` => `content: IVerseLineContent[]`
The content of a line on a verse can be one of four types: `'text'`, `'comment'`, `'tag'`, or `'chord'` . Each of these object types have slightly different properties.
See the examples below to understand how to best use the objects together to get the desired XML output.

**Verse Line Content Object Type: `text`**
A text object is used to define song lyric text
| Property | Type       | Required | Default Value               |
|:---------|:-----------|:---------|:----------------------------|
|`type`    | `'text'`   | ⚠️Yes    | Setting `type:'text'` defines this as song lyric content. |
|`value`   | `string`   | ⚠️Yes    | The lyric text content. Any `\n`or `\r` line break character will be transformed into a `<br/>` tag. |

**Verse Line Content Object Type: `comment`**
A comment object is used to adding non-visible information about a particular part of a song. For example, a comment could contain the style in which to play or sing any particular set of lyrics.
Read more about this in [the OpenLyrics Lyric Comments Docs](https://docs.openlyrics.org/en/latest/dataformat.html#comments-in-lyrics)
| Property | Type       | Required | Default Value               |
|:---------|:-----------|:---------|:----------------------------|
|`type`    | `'comment'`| ⚠️Yes    | Setting `type:'comment'` defines this as a comment |
|`value`   | `string`   | ⚠️Yes    | The text of the comment |

**Verse Line Content Object Type: `tag`**
A tag object is used to adding non-visible information about a particular part of a song. For example, a comment could contain the style in which to play or sing any particular set of lyrics.
Read more about this in [the OpenLyrics Lyric Comments Docs](https://docs.openlyrics.org/en/latest/dataformat.html#comments-in-lyrics)
| Property | Type       | Required | Default Value               |
|:---------|:-----------|:---------|:----------------------------|
|`type`    | `'tag'`    | ⚠️Yes    | Setting `type:'tag'` defines this as a tag |
|`name`    | `string`   | ⚠️Yes    | The name of the tag defined in [the `format` => `tags` property](#format--tags-iformattag) on the song |
|`value`   | `string`   | ⚠️Yes    | The text that appears between the opening and closing tag |

**Verse Line Content Object Type: `chord`**
A chord object is used do define a chord that should be played at a particular part of a song. A chord can exist before a certain word in the lyrics, or it can contain a particular set of lyrics within it.
Read more about this in [the OpenLyrics Chords Docs](https://docs.openlyrics.org/en/latest/dataformat.html#chords)
| Property   | Type       | Required | Default Value               |
|:-----------|:-----------|:---------|:----------------------------|
|`type`      | `'chord'`  | ⚠️Yes    | Setting `type:'chord'` defines this as a chord |
|`bass`      | `string`   | No       | Describes the foreign bass of the chord if any. The values should marked with English notation |
|`root`      | `string`   | No       | Describes the root note of the chord. The values should marked with English notation |
|`structure` | `string`   | No       | Describes the kind of the chord. This element is optional, if not present, the default value is the major |
|`upbeat`    | `boolean`  | No       | Used to mark when a chord starts with a music pause |
|`value`     | `string`   | No       | The text inside of the chord. If omitted the chord will have no content and be a self-closing XML node. |

**Mixed objects example**
To best understand how these objects can be used together, let's first look at the XML output we want to achieve for a line. I've added some line breaks, which are not normally there, to make this more readable (normally everything with a `<lines>` tag is on the same line). Note where `\n` are turned into `<br/>` tags as well.
```xml
<verse name="v1">
  <lines part="men">
    <chord root="D" bass="F#"/>Amazing grace<br/>
    <chord root="C" structure="min" bass="Eb"/> 
    how sweet the sound that saved <chord root="B7" upbeat="true">a wretch like me</chord>
  </lines>
  <lines part="women">
    <comment>sing this quietly</comment>
    <chord root="D" bass="F#"/>Amazing grace<br/>
    <chord root="C"/> 
    how sweet the sound that saved <chord root="B7"/>a <tag name="red">wretch</tag> like me
  </lines>
</verse>
```
To achieve that output, here what would need to be passed to the `lines` property of a verse
```js
verses: {
  name: 'v1',
  lines: [
    {
      part: "men",
      content: [
        {type: "chord", root: "D", bass: "F#"},
        {type: "text", value: "Amazing grace\n"},
        {type: "chord", root: "C", structure: "min", bass: "Eb"},
        {type: "text", value: "how sweet the sound that saved "},
        {type: "chord", root: "B7", upbeat: true, value: "a wretch like me"}
      ]
    }
    {
      part: "women",
      content: [
        {type: "comment", value: "sing this quietly"},
        {type: "chord", root: "D", bass: "F#"},
        {type: "text", value: "Amazing grace\n"},
        {type: "chord", root: "C",},
        {type: "text", value: "how sweet the sound that saved "},
        {type: "chord", root: "B7" },
        {type: "text", value: "a "},
        {type: "tag", name:"red", value: "wretch"}
        {type: "text", value: " like me"}
      ]
    }
  ]
}
```



### `instruments` Array
This optional array of objects is used to describe all of the instrumental music in the song. It is very similar to the above `verses` but it cannot contain any words, only `chord`s or `beat`s. All `beat`s may only contain `chord`s. No text is allowed anywhere inside of `instruments`.  Read about the supported properties on [the OpenLyrics Instrumental Parts docs](https://docs.openlyrics.org/en/latest/dataformat.html#instrumental-parts)

| Property  | Type                | Required | Default Value               |
|:----------|:--------------------|:---------|:----------------------------|
|`name`     | `string`            | ⚠️Yes    | The name of this instrumental section. Should be similar to a verse name like `'i'` (intro), `'s'` (solo), etc. See [the docs](https://docs.openlyrics.org/en/latest/dataformat.html#instrumental-parts) for examples.  |
|`lines`    | `IInstrumentLine[]` | ⚠️Yes    | An array of instrument lines. See below for details. |



#### `instruments` => `lines: IInstrumentLine[]`
| Property  | Type                       | Required | Default Value               |
|:----------|:---------------------------|:---------|:----------------------------|
|`content`  | `IInstrumentLineContent[]` | ⚠️Yes    | An array of objects to create `<chord>`s and `<beat>`s in this line |
|`part`     | `string`                   | No       | The name of this instrumental part, eg: `'piano'`, `'guitar'`, etc. |
|`repeat`   | `number`                   | No       | The number of times this line should be repeated |



#### `instruments` => `lines` => `content: IInstrumentLineContent[]`
The `content` array for each line of an instrumental part can only contain one of two types of objects. `type: 'chord'`, or `type: 'beat'`. Nothing else is possible to add here.  An object with `type: 'chord'` works exactly like it does above for verses.  An object with `type: 'beat'` simply contains an array of `type: 'chord'` objects, it is only there as a container for chords.



**Instrument Line Content Object Type: `chord`**
A chord object is used do define a chord that should be played at a particular part of a song. A chord can exist before a certain word in the lyrics, or it can contain a particular set of lyrics within it. It is identical to the chords used for a verse except that it has no `value` property.
Read more about this in [the OpenLyrics Chords Docs](https://docs.openlyrics.org/en/latest/dataformat.html#chords)

| Property   | Type       | Required | Default Value               |
|:-----------|:-----------|:---------|:----------------------------|
|`type`      | `'chord'`  | ⚠️Yes    | Setting `type:'chord'` defines this as a chord |
|`bass`      | `string`   | No       | Describes the foreign bass of the chord if any. The values should marked with English notation |
|`root`      | `string`   | No       | Describes the root note of the chord. The values should marked with English notation |
|`structure` | `string`   | No       | Describes the kind of the chord. This element is optional, if not present, the default value is the major |
|`upbeat`    | `boolean`  | No       | Used to mark when a chord starts with a music pause |



**Instrument Line Content Object Type: `beat`**
A beat represents a beat in the music. A beat tag can contains only chords. But it is not mandatory to separate beats.
Read more about this in [the OpenLyrics Instrumental Parts Docs](https://docs.openlyrics.org/en/latest/dataformat.html#instrumental-parts)

| Property   | Type               | Required | Default Value               |
|:-----------|:-------------------|:---------|:----------------------------|
|`type`      | `'beat'`           | ⚠️Yes    | Setting `type:'beat'` defines this as a beat |
|`chords`    | `{type:'chord'}[]` | ⚠️Yes    | An array of `type:'chord'` objects, which are defined above |

**Instrument Example**
The following XML example shows an instrumentation section, with a single line. That line contains some chords, and some beats which contain more chords each.
```xml
<instrument name="i">
  <lines part="piano" repeat="2">
    <chord root="D"/>
    <chord root="D" structure="sus4" />
    <beat><chord root="C"/><chord root="A" bass="C#" /></beat>
    <beat><chord root="G"/><chord root="B"/></beat>
  </lines>
</instrument>
```

To generate that output here are the needed objects:
```js
instruments: [
  {
    name: 'i',
    lines: [
      {
        part: 'piano',
        repeat: 2,
        content: [
          { type: 'chord', root: 'D'},
          { type: 'chord', root: 'D', structure: 'sus4' },
          {
            type: 'beat',
            chords: [
              { type: 'chord', root: 'C'},
              { type: 'chord', root:'A', bass: 'C#' }
            ]
          },
          {
            type: 'beat',
            chords: [
              { type: 'chord', root: 'G' },
              { type: 'chord', root: 'B' }
            ]
          },
        ]
      }
    ]
  }
]
```
