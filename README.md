# OpenLyrics-parser
[OpenLyrics](https://openlyrics.org/) is an open XML file format for storing song and lyric information about songs. Many open

This project will parses and extract data from OpenLyrics XML files.

This project is used by my [LyricConverter](htt://github.com/FiniteLooper/LyricConverter) project which can convert your song lyric files between many common formats. If you need to convert some songs to another existing format I encourage you to check this project out first.

## Installation

```txt
npm install openlyrics-parser --save
```

## Parsing OpenLyrics XML Files
Simply import `OpenLyricsParser`, then pass the contents of an OpenLyrics `.xml` file as a string to it.

### [docs/Parser.md](Documentation & Examples: Reading/Parsing Files)

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


## Building OpenLyrics XML Files
Simply import `OpenLyricsBuilder`, then pass the song data to it, and it will return a `string` of XML data which you can then do what you need to with it.

### [docs/Builder.md](Documentation & Examples: Building/Creating Files)

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
