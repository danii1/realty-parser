# Realty parser
Collection of parsers to get data from various real estate sites:
* [cian.ru](http://www.cian.ru)
* [avito.ru](http://www.avito.ru)

## Installation
```
npm install --save realty-parser
```

## Usage
```javascript
var Parser = require('realty-parser');

var url = 'https://www.avito.ru/moskva/kvartiry/2-k_kvartira_40_m_69_et._662759461';

// get one of the supported parsers (avito, cian)
var parser = Parser.create('avito');

// parse url (returns promise)
parser.parse(url).then(function(result){
  console.log(result);
}).catch(function(error){
  console.log('error', error);
});
```

## License
Copyright (c) 2015, Daniil Pokrovsky

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
