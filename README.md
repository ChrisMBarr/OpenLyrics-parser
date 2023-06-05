# OpenLyrics-parser
[OpenLyrics](https://openlyrics.org/) is an open XML file format for storing song and lyric information about songs. Many open

This project will parses and extract data from OpenLyrics XML files.

This project is used by my [LyricConverter](htt://github.com/FiniteLooper/LyricConverter) project which can convert your song lyric files between many common formats. If you need to convert some songs to another existing format I encourage you to check this project out first.

## Installation

```txt
npm install openlyrics-parser --save
```

## Usage
Simply import and create a new instance of `OpenLyrics`, then pass the contents of an OpenLyrics `.xml` file as a string to the `.parse()` method.

### For TypeScript projects
```typescript
import { readFile } from 'fs';
import { OpenLyrics } from 'openlyrics-parser';

const olParser = new OpenLyrics();

readFile('example.xml', (contents): void => {
  const song = olParser.parse(contents.toString());
  console.log(song);
});
```

### For JavaScript projects
```javascript
const { readFile } = require('fs');
const { OpenLyrics } = require('openlyrics-parser');

const olParser = new OpenLyrics();

readFile('example.xml', (contents) => {
  const song = olParser.parse(contents.toString());
  console.log(song);
});
```

## Example Output
Note that for any properties the parser is unable to find an empty string or empty array will be returned instead. This way all properties are always the types they are supposed to be, nothing is nullable or optional on the returned object.
```javascript

```

## Notes
