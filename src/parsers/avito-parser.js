import Parser from './parser.js';
import request from 'request';
import cheerio from 'cheerio';

class AvitoParser extends Parser {
  parse(url) {
    if (typeof url === 'undefined' || url === '') {
      throw new Error('url param should be valid');
    }

    return new Promise((resolve, reject) => {
      request.get(url, function(err, response, body) {
        if (err) {
          reject(err);
        } else {
          resolve(body);
        }
      });
    });
  }
}

export default AvitoParser;
