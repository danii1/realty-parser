import ParserFactory from '../src/parser-factory';
import AvitoParser from '../src/parsers/avito-parser';
import CianParser from '../src/parsers/cian-parser';
import {expect} from 'chai';

describe('ParserFactory', function() {
  it('should instantiate proper parser', () => {
    const avitoParser = ParserFactory.create('avito');
    expect(avitoParser).to.be.ok;
    expect(avitoParser instanceof AvitoParser).to.be.true;

    const cianParser = ParserFactory.create('cian');
    expect(cianParser).to.be.ok;
    expect(cianParser instanceof CianParser).to.be.true;
  });

  it('should be case insensitive', () => {
    const avitoParser = ParserFactory.create('AVITO');
    expect(avitoParser).to.be.ok;
    expect(avitoParser instanceof AvitoParser).to.be.true;
  });
});
