import AvitoParser from '../../src/parsers/avito-parser.js';
import {expect} from 'chai';
import sinon from 'sinon';
import request from 'request';
import fs from 'fs';

describe('AvitoParser', function() {
  let parser;
  const url = 'https://www.avito.ru/moskva/kvartiry/2-k_kvartira_42_m_69_et._662693419';
  const avitoFileContents = fs.readFileSync('test/data/avito/2k.html', { encoding: 'utf-8' });

  beforeEach(() => {
    parser = new AvitoParser();
    sinon.stub(request, 'get').yields(
      null, null, avitoFileContents
    );
  });

  afterEach(() => {
    parser = new AvitoParser();
    request.get.restore();
  });

  it('should throw exception on empty url', () => {
    expect(function() {
      parser.parse('');
    }).to.throw(Error);
  });

  it('should parse avito page', (done) => {
    parser.parse(url)
      .then((result) => {
        expect(result).to.not.be.undefined;
        expect(result.source).to.be.equal('avito');
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should return result with correct source value', (done) => {
    parser.parse(url)
      .then((result) => {
        expect(result.source).to.be.equal('avito');
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should return result with url set', (done) => {
    parser.parse(url)
      .then((result) => {
        expect(result.url).to.be.equal(url);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should return result with currency set', (done) => {
    parser.parse(url)
      .then((result) => {
        expect(result.currency).to.be.equal('rub');
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should extract description', (done) => {
    parser.parse(url)
      .then((result) => {
        expect(result.description).to.be.ok;
        expect(result.description.length).to.be.above(0);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should extract coordinates', (done) => {
    parser.parse(url)
      .then((result) => {
        expect(result.lat).to.be.ok;
        expect(result.lng).to.be.ok;
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should extract city and address', (done) => {
    parser.parse(url)
      .then((result) => {
        expect(result.city).to.be.ok;
        expect(result.address).to.be.ok;
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should extract pricing info', (done) => {
    parser.parse(url)
      .then((result) => {
        expect(result.rent).to.be.equal(67000);
        expect(result.rentType).to.be.equal('monthly');
        expect(result.commission).to.be.equal(33500);
        expect(result.deposit).to.be.equal(67000);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should extract property type', (done) => {
    parser.parse(url)
      .then((result) => {
        expect(result.type).to.be.ok;
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should extract number of rooms and property size', (done) => {
    parser.parse(url)
      .then((result) => {
        expect(result.roomCount, 'room count').to.be.above(0);
        expect(result.propertySize, 'property size').to.be.above(0);
        expect(result.propertySizeUnits, 'property size units').to.be.equal('sq.m');
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should extract comforts', (done) => {
    parser.parse(url)
      .then((result) => {
        expect(result.comforts.length).to.be.above(0);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should extract household appliances', (done) => {
    parser.parse(url)
      .then((result) => {
        expect(result.householdAppliances.length).to.be.above(0);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should extract permissions', (done) => {
    parser.parse(url)
      .then((result) => {
        expect(result.permissions.length).to.be.equal(2);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should extract apparment floor and number of floors in building', (done) => {
    parser.parse(url)
      .then((result) => {
        expect(result.floor, 'floor').to.be.above(0);
        expect(result.floorsInBuilding, 'floorsInBuilding').to.be.above(0);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});
