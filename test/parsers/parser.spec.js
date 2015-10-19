import Parser from '../../src/parsers/parser.js';
import {assert, expect, should} from 'chai';

describe('Parser', function () {
  let parser;

  beforeEach(()=>{
    parser = new Parser();
  });

  it('should throw exception', () => {
    expect(function(){
      parser.parse('')
    }).to.throw(Error, 'Not implemented');
  });
});
