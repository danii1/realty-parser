import CianParser from '../../src/parsers/cian-parser.js';
import {expect} from 'chai';
import sinon from 'sinon';
import request from 'request';
import fs from 'fs';

describe('CianParser', function() {
  let parser;
  const url = 'http://www.cian.ru/rent/flat/29827936/';
  const cianFileContents = fs.readFileSync('test/data/cian/2k.html', { encoding: 'utf-8' });

  beforeEach(() => {
    parser = new CianParser();
    sinon.stub(request, 'get').yields(
      null, null, cianFileContents
    );
  });

  afterEach(() => {
    request.get.restore();
  });

  it('should throw exception on empty url', () => {
    expect(function() {
      parser.parse('');
    }).to.throw(Error);
  });

  it('should parse cian page', (done) => {
    parser.parse(url)
      .then((result) => {
        expect(result).to.not.be.undefined;
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should return result with correct base values', (done) => {
    parser.parse(url)
      .then((result) => {
        expect(result.source).to.be.equal('cian');
        expect(result.url).to.be.equal(url);
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
        expect(result.rent).to.be.equal(50000);
        expect(result.rentType).to.be.equal('monthly');
        expect(result.commission).to.be.equal(25000);
        expect(result.deposit).to.be.equal(50000);
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

  it('should extract photos', (done) => {
    parser.parse(url)
      .then((result) => {
        expect(result.photos.length).to.be.equal(24);
        expect(result.photos[0]).match(/http.*?:\/\/.*\.(jpg|jpeg|png)/);
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

  it('should extract author', (done) => {
    parser.parse(url)
      .then((result) => {
        expect(result.author.type, 'author type').to.be.ok;
        expect(result.author.name, 'author name').to.be.ok;
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});
