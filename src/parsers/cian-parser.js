import Parser from './parser';
import Property from '../property';
import request from 'request';
import cheerio from 'cheerio';

class CianParser extends Parser {
  _extractPropertyTypeFromHeader(header) {
    const room = 'комната';
    const appartment = '-комн.';
    const studio = 'студия';
    const house = 'дом';
    if (header.indexOf(room) > -1) {
      return 'room';
    } else if (header.indexOf(appartment)) {
      return 'appartment';
    } else if (header.indexof(studio)) {
      return 'studio';
    } else if (header.indexOf(house)) {
      return 'house';
    }
    return null;
  }

  _extractRoomCountFromHeader(header) {
    const roomCountMatches = header.match(/\d+(?=\-комн)/);
    if (roomCountMatches && roomCountMatches.length > -1) {
      return parseInt(roomCountMatches[0], 10);
    }
    return null;
  }


  _extractCoordinates(mapOptionsString) {
    const coordinatesRegex = /\[(.*)\]/;
    const matches = coordinatesRegex.exec(mapOptionsString);
    if (matches && matches.length > 1) {
      return matches[1].split(',');
    }
    return [null, null];
  }

  _extractRentType(rentString) {
    // get rent type (monthly, daily)
    const monthly = 'месяц';
    const daily = 'сутки';
    if (rentString.indexOf(monthly) > -1) {
      return 'monthly';
    } else if (rentString.indexOf(daily) > -1) {
      return 'daily';
    }
    return null;
  }

  _extractRent(rentString) {
    const rentMatches = rentString.match(/(\d+\s*)+/);
    if (rentMatches && rentMatches.length > 0) {
      const normalizedRentString = rentMatches[0].replace(/[\s]/g, '');
      return parseFloat(normalizedRentString);
    }
    return null;
  }

  _extractDeposit(commissionString, rent) {
    if (commissionString.match(/[\s\.\,]депозит[\,\.\s]/)) return rent;
    return null;
  }

  _extractCommission(commissionString, rent) {
    const commission = 'комиссия';
    if (commissionString.indexOf(commission) > -1) {
      const regex = /(?:комиссия\s+)((\d+\s*)+)/g;
      const commissionMatches = regex.exec(commissionString);
      if (commissionMatches && commissionMatches.length > 1) {
        const normalizedCommissionString = commissionMatches[1].replace(/[\s]/g, '');
        return (parseFloat(normalizedCommissionString) / 100 * rent);
      }
    }
    return null;
  }

  _parsePage(body, url) {
    const result = new Property('cian', url);
    result.currency = 'rub';

    const $ = cheerio.load(body);

    const header = $('.object_descr_title').text().trim();
    result.type = this._extractPropertyTypeFromHeader(header);
    if (result.type === 'appartment') {
      result.roomCount = this._extractRoomCountFromHeader(header);
    }

    // get city and address
    const addrParts = $('.object_descr_addr').text().split(',').map((item) => {
      return item.trim();
    });
    if (addrParts.length > 0) {
      result.city = addrParts[0];
    }
    if (addrParts.length > 1) {
      addrParts.shift();
      result.address = addrParts.join(', ');
    }

    $('.object_descr_props tr').each((index, elem) => {
      const title = $('th', null, elem).text().trim().toLowerCase();
      const value = $('td', null, elem).text().trim().toLowerCase();

      // get appt floor and floors in the building
      if (title.indexOf('этаж') > -1) {
        const values = value.split('/').map((item) => {
          return parseInt(item.trim(), 10);
        });
        if (values.length === 2) {
          result.floor = values[0];
          result.floorsInBuilding = values[1];
        }
      }

      if (title.indexOf('общая площадь') > -1) {
        result.propertySize = parseFloat(value);
        result.propertySizeUnits = 'sq.m';
      }
    });

    // get description
    result.description = $('.object_descr_text').contents().first().text().trim();

    // get coordinates
    const mapOptions = $('map').attr('options');
    [result.lng, result.lat] = this._extractCoordinates(mapOptions);

    // get pricing
    const rentString = $('.object_descr_price').text();
    result.rentType = this._extractRentType(rentString);
    result.rent = this._extractRent(rentString);

    const commissionString = $('.object_descr_price').nextUntil('.clearfix').text();
    if (result.rent) {
      result.deposit = this._extractDeposit(commissionString, result.rent);
      result.commission = this._extractCommission(commissionString, result.rent);
    }

    result.author.type = result.commission ? 'agency' : 'owner';
    result.author.name = $('.object_descr_realtor_name').text().trim();

    result.photos = $('.fotorama img').map((index, elem) => {
      return $(elem).attr('src');
    }).get();

    // get permissions, household appliances, comforts
    const amenities = $('.object_descr_details li').map((index, elem) => {
      return $(elem).text().trim();
    }).get();

    amenities.forEach((prop) => {
      if (CianParser.permissionsMapping[prop]) {
        result.permissions.push(CianParser.permissionsMapping[prop]);
      }

      if (CianParser.comfortsMapping[prop]) {
        result.comforts.push(CianParser.comfortsMapping[prop]);
      }

      if (CianParser.householdAppliancesMapping[prop]) {
        result.householdAppliances.push(CianParser.householdAppliancesMapping[prop]);
      }
    });

    return result;
  }

  parse(url) {
    if (typeof url === 'undefined' || url === '') {
      throw new Error('url param should be valid');
    }

    const _this = this;
    return new Promise((resolve, reject) => {
      request.get(url, function(err, response, body) {
        if (err) {
          reject(err);
        } else {
          resolve(_this._parsePage(body, url));
        }
      });
    });
  }
}

CianParser.permissionsMapping = {
  'можно с животными': 'pets_allowed',
  'можно с детьми': 'family_with_children_allowed',
};

CianParser.comfortsMapping = {
  'балкон': 'balcony',
  'кондиционер': 'conditioner',
  'парковочное место': 'parking_space',
};

// TODO: check possible appliances on cian
CianParser.householdAppliancesMapping = {
  'интернет': 'internet',
  'мебель на кухне': 'kitchen_furniture',
  'мебель в комнатах': 'furniture',
  'ТВ': 'tv',
  'посудомоечная машина': 'dishwasher',
  'телефон': 'phone',
  'плита': 'stove',
  'микроволновка': 'microwave',
  'холодильник': 'fridge',
  'стиральная машина': 'washing_machine',
  'фен': 'hairdryer',
  'утюг': 'iron',
};


export default CianParser;
