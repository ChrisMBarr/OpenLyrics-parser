# OpenLyrics-parser
[OpenLyrics](https://openlyrics.org/) is an open XML file format for storing song and lyric information about songs. Many open

This project will parses and extract data from OpenLyrics XML files.

This project is used by my [LyricConverter](htt://github.com/FiniteLooper/LyricConverter) project which can convert your song lyric files between many common formats. If you need to convert some songs to another existing format I encourage you to check this project out first.

## Installation

```txt
npm install openlyrics-parser --save
```

## Usage - parsing a file
Simply import `OpenLyricsParser`, then pass the contents of an OpenLyrics `.xml` file as a string to it.

### For TypeScript projects
```typescript
import { readFile } from 'fs';
import { OpenLyricsParser } from 'openlyrics-parser';
import { IOpenLyricsSong } from 'openlyrics-parser/dist/main/model';

readFile('example.xml', (contents): void => {
  const song: IOpenLyricsSong.IRoot = OpenLyricsParser(contents.toString());
  console.log(song);
});
```

### For JavaScript projects
```javascript
const { readFile } = require('fs');
const { OpenLyricsParser } = require('openlyrics-parser');

readFile('example.xml', (contents) => {
  const song = OpenLyricsParser(contents.toString());
  console.log(song);
});
```

## Example Output
Note that for any properties the parser is unable to find an empty string or empty array will be returned instead. This way all properties are always the types they are supposed to be, nothing has optional properties except for the `<chord>` nodes within the verses or instrumentals.  See below for a more detailed view of how the return object is structured

Given this input XML file
```xml
<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet href="../stylesheets/openlyrics.css" type="text/css"?>
<song xmlns="http://openlyrics.info/namespace/2009/song"
      version="0.8"
      createdIn="OpenLP 1.9.0"
      modifiedIn="MyApp 0.0.1"
      modifiedDate="2012-04-10T22:00:00+10:00"><!-- date format: ISO 8601 -->
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
</song>
```
It will produce this JSON object
```javascript
{
  meta: {
    createdIn: 'OpenLP 1.9.0',
    lang: '',
    modifiedDate: new Date('2012-04-10T12:00:00.000Z'),
    modifiedIn: 'MyApp 0.0.1',
    version: '0.8',
  },
  format:{
    application: '',
    tags: []
  },
  properties:{
    authors: [],
    ccliNo: '',
    comments: [],
    copyright: '',
    key: '',
    keywords: '',
    publisher: '',
    released: '',
    songBooks: [],
    tempo: '',
    tempoType: '',
    themes: [],
    titles: [{ lang: '', original: null, value: 'Amazing Grace' }],
    transposition: '',
    variant: '',
    verseOrder: '',
    version: '',
  },
  verses:[
    {
      name: 'v1',
      transliteration: '',
      lang: '',
      lines: [
        {
          content: [
            { type: 'text', value: 'Amazing grace how sweet the sound\nthat saved a wretch like me;', },
          ],
          part: '',
        },
      ],
    },
  ],
  instruments:[]
}
```

# Documentation
There are 5 top level properties on the returned object that contain different groupings of data
* [`meta`](#meta-object)
* [`format`](#format-object)
* [`properties`](#properties-object)
* [`verses`](#verses-array)
* [`instruments`](#instruments-array)

For most simple songs you will only need to bother with the `properties` object and `verses` array.

## `meta` Object
This object contains information about the document itself. The property names match the names specified in [the OpenLyrics Metadata docs](https://docs.openlyrics.org/en/latest/dataformat.html#metadata).
It only has a few primitive properties. If no value is provided strings will default to an empty string `''` and dates will default to `null`

| Property      | Type             |
|:--------------|:-----------------|
|`createdIn`    | `string`         |
|`chordNotation`| `string`         |
|`lang`         | `string`         |
|`modifiedDate` | `Date` or `null` |
|`modifiedIn`   | `string`         |
|`version`      | `string`         |



## `format` Object
This object contains information about any custom format tags on the document. Read about them in [the OpenLyrics Formatting Extensions docs](https://docs.openlyrics.org/en/latest/dataformat.html#formatting-extensions)

| Property                     | Type                                   |
|:-----------------------------|:---------------------------------------|
|`application`                 | `string`                               |
|[`tags`](#format--tags-array) | [`IFormatTag[]`](#format--tags-array)  |



## `format` => `tags` array
| `IFormatTag` Property | Type     |
|:----------------------|:---------|
|`name`                 | `string` |
|`open`                 | `string` |
|`close`                | `string` |

As an example, if the following `<format>` XML is provided:
```xml
<format>
  <tags application="OpenLP">
    <tag name="red">
      <open>&lt;span style="color:red"&gt;</open>
      <close>&lt;/span&gt;</close>
    </tag>
    <tag name="bold">
      <open>&lt;strong&gt;</open>
      <close>&lt;/strong&gt;</close>
    </tag>
    <tag name="br">
      <open>&lt;br&gt;</open>
    </tag>
  </tags>
</format>
```

The following JSON object will be produced on the `format` property
```javascript
{
  application: 'OpenLP',
  tags: [
    {
      name: 'red',
      open: '<span style="color:red">',
      close: '</span>',
    },
    {
      name: 'bold',
      open: '<strong>',
      close: '</strong>',
    },
    {
      name: 'br',
      open: '<br>',
      close: '',
    },
  ],
}
```


## `properties` Object
This object contains information about the song. Read about them in [the OpenLyrics Song Properties docs](https://docs.openlyrics.org/en/latest/dataformat.html#song-properties)

| Property                                   | Type                                         |
|:-------------------------------------------|:---------------------------------------------|
|[`authors`](#properties--authors-array)     | [`IAuthor[]`](#properties--authors-array)    |
|[`titles`](#properties--titles-array)       | [`ITitle[]`](#properties--titles-array)      |
|[`songBooks`](#properties--songbooks-array) | [`ISongBook[]`](#properties--songbooks-array)|
|`comments`                                  | `string[]`                                   |
|`copyright`                                 | `string`                                     |
|`ccliNo`                                    | `string`                                     |
|`released`                                  | `string`                                     |
|`transposition`                             | `string`                                     |
|`tempo`                                     | `string`                                     |
|`tempoType`                                 | `string`                                     |
|[`themes`](#properties--themes-array)       | [`ITheme[]`](#properties--themes-array)      |
|`key`                                       | `string`                                     |
|`variant`                                   | `string`                                     |
|`publisher`                                 | `string`                                     |
|`version`                                   | `string`                                     |
|`keywords`                                  | `string`                                     |
|`verseOrder`                                | `string`                                     |



## `properties` => `authors` array
| `IAuthor` Property | Type     |
|:-------------------|:---------|
|`value`             | `string` |
|`type`              | `string` |
|`lang`              | `string` |

given this authors XML
```xml
<authors>
  <author>John Newton</author>
  <author type="words">Chris Rice</author>
  <author type="music">Richard Wagner</author>
  <author type="translation" lang="cs">František Foo</author>
</authors>
```

the following array is produced
```javascript
[
  { lang: '',   type: '',            value: 'John Newton' },
  { lang: '',   type: 'words',       value: 'Chris Rice' },
  { lang: '',   type: 'music',       value: 'Richard Wagner' },
  { lang: 'cs', type: 'translation', value: 'František Foo' },
]
```


## `properties` => `titles` array
| `ITitle` Property  | Type                |
|:-------------------|:--------------------|
|`value`             | `string`            |
|`lang`              | `string`            |
|`original`          | `boolean` or `null` |

given this titles XML
```xml
<titles>
  <title original="true" lang="en-US">Amazing Grace</title>
  <title lang="en">Amazing Grace</title>
  <title>Amazing</title>
  <title lang="de-DE">Erstaunliche Anmut</title>
</titles>
```

the following array is produced
```javascript
[
  { lang: 'en-US', original: true, value: 'Amazing Grace' },
  { lang: 'en',    original: null, value: 'Amazing Grace' },
  { lang: '',      original: null, value: 'Amazing' },
  { lang: 'de-DE', original: null, value: 'Erstaunliche Anmut' },
]
```


## `properties` => `songBooks` array

| `ISongBook` Property | Type     |
|:---------------------|:---------|
|`name`                | `string` |
|`entry`               | `string` |

given this songbooks XML
```xml
<songbooks>
  <songbook name="Songbook without Number"/>
  <songbook name="Songbook with Number" entry="48"/>
  <songbook name="Songbook with Letters in Entry Name" entry="153c"/>
</songbooks>
```

the following array is produced
```javascript
[
  { entry: '',     name: 'Songbook without Number' },
  { entry: '48',   name: 'Songbook with Number' },
  { entry: '153c', name: 'Songbook with Letters in Entry Name' },
]
```



## `properties` => `themes` array
| `ITheme` Property | Type     |
|:------------------|:---------|
|`value`            | `string` |
|`lang`             | `string` |

given this titles XML
```xml
<themes>
  <theme>Adoration</theme>
  <theme lang="en-US">Grace</theme>
  <theme lang="en-US">Praise</theme>
  <theme lang="en-US">Salvation</theme>
  <theme lang="pt-BR">Graça</theme>
  <theme lang="pt-BR">Adoração</theme>
  <theme lang="pt-BR">Salvação</theme>
</themes>
```

the following array is produced
```javascript
[
  { lang: '',      value: 'Adoration' },
  { lang: 'en-US', value: 'Grace' },
  { lang: 'en-US', value: 'Praise' },
  { lang: 'en-US', value: 'Salvation' },
  { lang: 'pt-BR', value: 'Graça' },
  { lang: 'pt-BR', value: 'Adoração' },
  { lang: 'pt-BR', value: 'Salvação' },
]
```


## `verses` Array
This is an array of objects to describe all of the `<verse>` nodes inside of the `<lyrics>` node.  Read about the supported properties on [the OpenLyrics Song Lyrics docs](https://docs.openlyrics.org/en/latest/dataformat.html#song-lyrics)

Each item in the `verses` array has the following properties
| `IVerse` Property              | Type                                   |
|:-------------------------------|:---------------------------------------|
|`name`                          | `string`                               |
|`lang`                          | `string`                               |
|`transliteration`               | `string`                               |
|`break`                         | `string`                               |
|[`lines`](#verses--lines-array) | [`IVerseLine[]`](#verses--lines-array) |

## `verses` => `lines` array

| `IVerseLine` Property                     | Type                                                   |
|:------------------------------------------|:-------------------------------------------------------|
|`break`                                    | `string`                                               |
|[`content`](#verses--lines--content-array) | [`IVerseLineContent[]`](#verses--lines--content-array) |
|`part`                                     | `string`                                               |

See below for an example of the XML to JSON transformation after you have read the next section about the `content` array property.



## `verses` => `lines` => `content` array
Each `IVerseLineContent` object in this `content` array can be one of 4 different types of objects, which are all very similar.
They all have the `type` property which is set to specific string values for each object type.
Note that any `<br>` nodes inside of these objects will be transformed into `\n` characters

| `IVerseLineContent` for **text**      | Type        |
|:--------------------------------------|:------------|
|`type`                                 | `'text'`    |
|`value`                                | `string`    |

| `IVerseLineContent` for a **comment** | Type        |
|:--------------------------------------|:------------|
|`type`                                 | `'comment'` |
|`value`                                | `string`    |

| `IVerseLineContent` for a **tag**     | Type        |
|:--------------------------------------|:------------|
|`type`                                 | `'tag'`     |
|`value`                                | `string`    |

| `IVerseLineContent` for a **chord**   | Type        |
|:--------------------------------------|:------------|
|`type`                                 | `'chord'`   |
|`bass?`                                | `string`    |
|`value?`                               | `string`    |
|`name?`                                | `string`    |
|`root?`                                | `string`    |
|`structure?`                           | `string`    |
|`upbeat?`                              | `string`    |

Note that the `?` denotes an optional property. It will not exist if that chord does not specify the property.
Chords may also return any other properties that are placed on them since they seem to be used in a diverse way.

So given all of these objects, consider the following XML:
```xml
<verse name="v1" lang="en">
  <lines>Amazing grace how sweet the sound that saved <tag name="red">a wretch like me</tag>;</lines>
  <lines part="women">A b c<br/>D e f</lines>
</verse>

<verse name="v1" lang="de">
  <lines><chord name="B"/>Erstaunliche Ahmut, wie</lines>
</verse>

<verse name="v2" lang="en-US">
  <lines part="men"><comment>any text</comment>Amazing grace how sweet the sound that saved a wretch like me;<chord name="D"/></lines>
  <lines part="women">Amazing grace how sweet <chord name="D"/>the sound that saved a wretch like me;<chord name="B7"/><br/>Amazing grace<chord name="G7"/> how sweet the sound that saved a wretch like me;</lines>
</verse>
```

Which will produce this object:
```javascript
[
  {
    name: "v1",
    transliteration: "",
    lang: "en",
    lines: [
      {
        part: "",
        content: [
          { type: "text", value: "Amazing grace how sweet the sound that saved ", },
          { type: "tag", name: "red", value: "a wretch like me" },
          { type: "text", value: ";" },
        ],
      },
      {
        part: "women",
        content: [{ type: "text", value: "A b c\nD e f" }],
      },
    ],
  },

  {
    name: "v1",
    transliteration: "",
    lang: "de",
    lines: [
      {
        part: "",
        content: [
          { type: "chord", name: "B" },
          { type: "text", value: "Erstaunliche Ahmut, wie", },
        ],
      },
    ],
  },

  {
    name: "v2",
    transliteration: "",
    lang: "en-US",
    lines: [
      {
        part: "men",
        content: [
          { type: "comment", value: "any text" },
          { type: "text", value:  "Amazing grace how sweet the sound that saved a wretch like me;", },
          { type: "chord", name: "D" },
        ],
      },
      {
        part: "women",
        content: [
          { type: "text", value: "Amazing grace how sweet " },
          { type: "chord" name: "D",  },
          { type: "text", value: "the sound that saved a wretch like me;" },
          { type: "chord" name: "B7",  },
          { type: "text", value: "\nAmazing grace" },
          { type: "chord" name: "G7",  },
          { type: "text", value: " how sweet the sound that saved a wretch like me;", },
        ],
      },
    ],
  },
]
```


## `instruments` Array
This is an array of objects to describe all of the `<instrument>` nodes inside of the `<lyrics>` node. It is very similar to the above `verses` but each `<lines>` node is only allowed to contain either `<chord>` or `<beat>` nodes. All `<beat>` nodes may only contain `<chord>` nodes. No text is allowed anywhere inside of `<instruments>`.  Read about the supported properties on [the OpenLyrics Instrumental Parts docs](https://docs.openlyrics.org/en/latest/dataformat.html#instrumental-parts)

Each item in the `instruments` array has the following properties
| `IInstrument` Property              | Type                                             |
|:------------------------------------|:-------------------------------------------------|
|`name`                               | `string`                                         |
|[`lines`](#instruments--lines-array) | [`IInstrumentLine[]`](#instruments--lines-array) |

## `instruments` => `lines` array

| `IInstrumentLine` Property | Type                       |
|:---------------------------|:---------------------------|
|`content`                   | `IInstrumentLineContent[]` |
|`part`                      | `string`                   |

## `instruments` => `lines` => `content` array
Each `IInstrumentLineContent` object in this `content` array can be one of 2 different types of objects: a **beat** and a **chord**.  A beat can only contain an array of chords. No text is allowed here.  Both objects have a `type` property so they can be differentiated.

| `IInstrumentLineContent` for **beat**      | Type      |
|:-------------------------------------------|:--------- |
|`type`                                      | `'beat'`  |
|`chords`                                    | `[]` of chord objects (below) |

| `IInstrumentLineContent` for a **chord**   | Type      |
|:-------------------------------------------|:--------- |
|`type`                                      | `'chord'` |
|`value?`                                    | `string`  |
|`name?`                                     | `string`  |
|`root?`                                     | `string`  |
|`structure?`                                | `string`  |
|`upbeat?`                                   | `string`  |

Note that the `?` denotes an optional property. It will not exist if that chord does not specify the property.
Chords may also return any other properties that are placed on them since they seem to be used in a diverse way.

Given the following instruments XML:
```xml
<instrument name="intro">
  <lines part="guitar">
    <beat><chord root="D"/><chord root="D" structure="sus4" /></beat>
    <beat><chord root="G"/><chord root="A"/></beat>
    <chord root="D"/>
    <chord root="D" structure="sus4" />
  </lines>
</instrument>
```

It will produce the following array:
```javascript
[
  {
    name: 'intro',
    lines: [
      {
        part: 'guitar',
        content: [
          {
            type: 'beat',
            chords: [
              { root: 'D', type: 'chord' },
              { root: 'D', structure: 'sus4', type: 'chord' },
            ],
          },
          {
            type: 'beat',
            chords: [
              { root: 'G', type: 'chord' },
              { root: 'A', type: 'chord' },
            ],
          },
          { type: 'chord', root: 'D'  },
          { type: 'chord', root: 'D', structure: 'sus4' },
        ]
      }
    ]
  }
]
```
