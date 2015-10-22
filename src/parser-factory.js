import AvitoParser from './parsers/avito-parser.js';
import CianParser from './parsers/cian-parser.js';

class ParserFactory {
  static create(type) {
    switch (type.toLowerCase()) {
      case 'avito':
        return new AvitoParser();
      case 'cian':
        return new CianParser();
      default:
        throw new TypeError('Parser type is not recognized');
    }
  }
}

export default ParserFactory;
