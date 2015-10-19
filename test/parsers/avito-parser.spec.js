import AvitoParser from '../../src/parsers/avito-parser.js';
import {assert, expect, should} from 'chai';
import sinon from 'sinon';
import request from 'request';
import fs from 'fs';

describe('AvitoParser', function () {
  let parser;

  beforeEach(() => {
    parser = new AvitoParser();
    sinon.stub(request, 'get').yields(
      null, null, fs.readFileSync('test/data/avito/2k.html', { encoding: 'utf-8' })
    );
  });

  afterEach(() => {
    parser = new AvitoParser();
    request.get.restore();
  });

  it('should throw exception on empty url', () => {
    expect(function() {
      parser.parse('')
    }).to.throw(Error);
  });

  it('should parse avito page', (done) => {
    let url = 'https://www.avito.ru/moskva/kvartiry/2-k_kvartira_42_m_69_et._662693419';

    parser.parse(url)
      .then((result) => {
        expect(result).to.not.be.undefined;
        done()
      })
      .catch((err) => {
        done(err)
      });
  });

});
