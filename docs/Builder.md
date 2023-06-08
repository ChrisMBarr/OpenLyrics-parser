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

| Property      | Type     | Required | Default Value               |
|:--------------|:---------|:---------|:----------------------------|



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
