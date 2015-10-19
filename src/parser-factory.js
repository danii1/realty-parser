import AvitoParser from './parsers/avito-parser.js';

class ParserFactory {
  static create(type) {
    switch (type) {
      case 'avito':
        break;
      case 'cian':
        break;
      default:
        throw new TypeError('Parser type is not recognized');
    }
  }
}

export default ParserFactory;
